import { generateApiErrorResponse, generateApiSuccessResponse } from '@/lib/api/global';
import authOptions from '@/lib/auth/authOptions';
import prisma from '@/lib/db';
import {templateSchema} from '@/lib/definitions';
import { saveImage } from '@/lib/firebase/service';
import { TemplateFilter } from '@/lib/template/getAllTemplates';
import { getSearchParams } from '@/lib/util';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { getServerSession } from 'next-auth';
import { ApiError } from 'next/dist/server/api-utils';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams

  const keys:(keyof TemplateFilter)[] = ['title', 'skip', 'limit', 'name']; 

  const filter: TemplateFilter = getSearchParams(searchParams, keys);

  const templates = await prisma.template.findMany({
    take: Number(filter.limit || 16),
    skip: Number(filter.skip || 0),
    orderBy: {
      createdAt: 'desc'
    },
    include:{
      image:true,
      author:{
        select:{
          username: true
        }
      }
    }
  })

  const count = await prisma.template.count()

  const values = {
    data: templates,
    count,
  }

  return generateApiSuccessResponse('List of templates', 200, values)
}

export async function POST(req: NextRequest,) {

  const session = await getServerSession(authOptions);

  if (!session) return generateApiErrorResponse("You must be logged in to upload a template", 401);

  const body = await req.json()

  const result = templateSchema.safeParse(body)

  if(!result.success) return generateApiErrorResponse(result.error.errors[0].message, 400)

  const { name, desc, base64Images, contentType } = result.data

  try{
    const result = await prisma.$transaction(async (tx) => {
      const imageTx = await tx.image.create({
        data: {
          urlOriginalImg: "",
          urlBlurImg: "",
          pathOriginalImg: "",
          pathBlurImg: "",
          imageType: contentType
        },
        select:{
          id: true
        }
      })

      const saveImageResult = await saveImage("template",base64Images, contentType, imageTx.id)

      const imageUpdateTx = await tx.image.update({
        where: {
          id: imageTx.id
        },
        data: {
          urlOriginalImg: saveImageResult.urlOriginalImg,
          urlBlurImg: saveImageResult.urlBlurImg,
          pathOriginalImg: saveImageResult.pathOriginalImg,
          pathBlurImg: saveImageResult.pathBlurImg
        }
      })

      const templateTx = await tx.template.create({
        data: {
          name,
          desc,
          authorId:session.user.id,
          imageId:imageTx.id
        }
      })

      return templateTx
    })
    return generateApiSuccessResponse('Template created successfully', 201, result)
  }catch(error){
    if(error instanceof PrismaClientKnownRequestError){
      if(error.code === "P2002") return generateApiErrorResponse("Template already exists", 500)
    } 
    if(error instanceof ApiError) return generateApiErrorResponse(error.message, error.statusCode)
    return generateApiErrorResponse("Something went wrong", 500)
  }
}

