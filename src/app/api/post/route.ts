import { postSchema } from "@/lib/definitions";
import { generateApiErrorResponse, generateApiSuccessResponse } from "@/lib/api/global";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ApiError } from "next/dist/server/api-utils";
import prisma from "@/lib/db";
import { saveImage } from "@/lib/firebase/service";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth/authOptions";
import { NextRequest } from "next/server";
import { PostFilter } from "@/lib/post/getPosts";
import { getSearchParams } from "@/lib/util";

export async function GET(req: NextRequest) {
  
  const query = req.nextUrl.searchParams;

  const keys:(keyof PostFilter)[] = ['title', 'skip', 'limit', 'templateId', 'userId']; 

  const filter: PostFilter = getSearchParams(query, keys);

  const where = {
    title: {
      contains: filter.title || undefined
    },
    templateId: {
      equals: filter.templateId || undefined
    },
    authorId: {
      equals: filter.userId || undefined
    }
  }

  const posts = await prisma.post.findMany({
    take: Number(filter.limit || 10),
    skip: Number(filter.skip || 0),
    where: {...where},
    orderBy: {
      createdAt: 'desc'
    },
    include:{
      _count:{
        select:{
          likes: true
        }
      },
      image:true,
      template:{
        select:{
          id: true,
        }
      },
      author:{
        select:{
          id: true,
          username: true
        }
      }
    }
  })

  const count = await prisma.post.count();

  const values = {
    data: posts,
    count
  }

  return generateApiSuccessResponse('List of posts', 200, values);

}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) return generateApiErrorResponse("You must be logged in to create a post", 401);

    const body = await req.json();

    const partialPostSchema = postSchema.omit({
      textBoxArray: true,
    })

    const result = partialPostSchema.safeParse(body);

    if (!result.success) return generateApiErrorResponse(result.error.errors[0].message, 400);

    const { title, templateId, base64Images } = result.data;

    const transactionResult = await prisma.$transaction(async (tx) => {
      const templateImageType = await tx.template.findUnique({
        where: { id: templateId },
        select: {
          image: {
            select: { imageType: true },
          },
        },
      });

      if (!templateImageType) return generateApiErrorResponse("Template not found", 404);

      const image = await tx.image.create({
        data: {
          urlOriginalImg: '',
          urlBlurImg: '',
          pathOriginalImg: '',
          pathBlurImg: '',
          imageType: templateImageType.image.imageType,
        },
        select: { id: true },
      });

      const saveImageResult = await saveImage("post", base64Images, "png", image.id);

      const post = await tx.post.create({
        data: {
          title,
          templateId,
          imageId: image.id,
          authorId: session.user.id,
        },
      });

      const imageUpdate = await tx.image.update({
        where: { id: image.id },
        data: {
          urlOriginalImg: saveImageResult.urlOriginalImg,
          urlBlurImg: saveImageResult.urlBlurImg,
          pathOriginalImg: saveImageResult.pathOriginalImg,
          pathBlurImg: saveImageResult.pathBlurImg,
        },
      });

      return { post };
    }, { maxWait: 10000, timeout: 7500 });

    return generateApiSuccessResponse('Image created successfully', 201, transactionResult);
  } catch (error) {
    console.error(error);
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2002") return generateApiErrorResponse("Image already exists", 500);
      else return generateApiErrorResponse("Something went wrong", 500);
    } else if (error instanceof ApiError) {
      return generateApiErrorResponse(error.message, error.statusCode);
    } else {
      return generateApiErrorResponse("Something went wrong", 500);
    }
  }
}
