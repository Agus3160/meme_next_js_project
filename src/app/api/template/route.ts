import { generateApiErrorResponse, generateApiSuccessResponse } from '@/lib/api/global';
import prisma from '@/lib/db';
import {templateSchema} from '@/lib/definitions';
import { saveImage } from '@/lib/firebase/service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ApiError } from 'next/dist/server/api-utils';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams

  const upTo = searchParams.get('upTo') || 10
  const skip = searchParams.get('skip') || 0

  const templates = await prisma.template.findMany({
    take: Number(upTo),
    skip: Number(skip),
    orderBy: {
      createdAt: 'desc'
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
          pathBlurImg: ""
        },
        select:{
          id: true
        }
      })

      const saveImageResult = await saveImage(base64Images, contentType, imageTx.id)

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

