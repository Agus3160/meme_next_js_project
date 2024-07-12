import { generateApiErrorResponse, generateApiSuccessResponse } from '@/lib/api/global';
import prisma from '@/lib/db';
import {imageSchema} from '@/lib/definitions';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ApiError } from 'next/dist/server/api-utils';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams

  const upTo = searchParams.get('upTo') || 10
  const skip = searchParams.get('skip') || 0

  const images = await prisma.image.findMany({
    take: Number(upTo),
    skip: Number(skip),
    orderBy: {
      createdAt: 'desc'
    }
  })

  const count = await prisma.template.count()

  const values = {
    data: images,
    count,
  }

  return generateApiSuccessResponse('List of images', 200, values)
}

export async function POST(req: NextRequest,) {

  const body = await req.json()

  const result = imageSchema.safeParse(body)

  if(!result.success) return generateApiErrorResponse(result.error.errors[0].message, 400)

  const { urlBlurImg, urlOriginalImg, pathBlurImg, pathOriginalImg } = result.data
  try{
    const image = await prisma.image.create({
      data: {
        urlBlurImg,
        urlOriginalImg,
        pathBlurImg,
        pathOriginalImg
      }
    })
    return generateApiSuccessResponse('Image created successfully', 201, image)
  }catch(error){
    if(error instanceof PrismaClientKnownRequestError){
      if(error.code === "P2002") return generateApiErrorResponse("Image already exists", 500)
    } 
    if(error instanceof ApiError) return generateApiErrorResponse(error.message, error.statusCode)
    return generateApiErrorResponse("Something went wrong", 500)
  }
  
}

