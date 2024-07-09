import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  // try {
    const { id } = params

  //   const template = await prisma.template.findUnique({
  //     where: { id },
  //     select: {
  //       image:{
  //         select:{
  //           urlOriginalImg: true
  //         }
  //       } 
  //     }
  //   })

  //   if(!template) throw new ApiError(404, 'Template not found')

  //   const response = await fetch(template.image.urlOriginalImg);

  //   const imageBuffer = await response.arrayBuffer();
  //   const imageArray = new Uint8Array(imageBuffer);

  //   return new NextResponse(Buffer.from(imageArray), {
  //     headers: {
  //       'Content-Type': 'image/jpeg',
  //     },
  //   });
  // } catch (error) {
  //   if(error instanceof ApiError) return generateApiErrorResponse(error.message, error.statusCode);
  //   return generateApiErrorResponse('Error getting the template', 500);
  // }
}

export async function POST(req: NextRequest,) {

  return
}

