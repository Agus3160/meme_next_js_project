import { generateApiErrorResponse, generateApiSuccessResponse } from '@/lib/api/global';
import prisma from '@/lib/db';
import { templateSchema } from '@/lib/definitions';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ApiError } from 'next/dist/server/api-utils';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const template = await prisma.template.findUnique({
      where: { id },
      select: {
        image:{
          select:{
            urlOriginalImg: true
          }
        } 
      }
    })

    if(!template) throw new ApiError(404, 'Template not found')

    const response = await fetch(template.image.urlOriginalImg);

    const imageBuffer = await response.arrayBuffer();
    const imageArray = new Uint8Array(imageBuffer);

    return new NextResponse(Buffer.from(imageArray), {
      headers: {
        'Content-Type': 'image/jpeg',
      },
    });
  } catch (error) {
    if(error instanceof ApiError) return generateApiErrorResponse(error.message, error.statusCode);
    return generateApiErrorResponse('Error getting the template', 500);
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {

  const body = await req.json()

  const result = templateSchema.safeParse(body)

  if(!result.success) return generateApiErrorResponse(result.error.errors[0].message, 400)

  const { id } = params
  
  const { name, desc, contentType, base64Images} = result.data
  // try{
  //   const template = await prisma.template.update({
  //     where:{
  //       id
  //     },
  //     data: {
  //       name,
  //       desc,
  //       imageId
  //     }
  //   })
  //   return generateApiSuccessResponse('Template updated successfully', 201, template)
  // }catch(error){
  //   if(error instanceof PrismaClientKnownRequestError){
  //     if(error.code === "P2002") return generateApiErrorResponse("Template already exists", 500)
  //   } 
  //   if(error instanceof ApiError) return generateApiErrorResponse(error.message, error.statusCode)
  //   return generateApiErrorResponse("Something went wrong", 500)
  // }
  
}
