import { generateApiErrorResponse, generateApiSuccessResponse } from "@/lib/api/global";
import authOptions from "@/lib/auth/authOptions";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest, { params }: { params: { postId: string } }) => {

  const session = await getServerSession(authOptions);

  if (!session) return generateApiErrorResponse('You must be logged in to like a post', 401);

  const { postId } = params;

  const like = await prisma.like.findUnique({
    where: {
      userId_postId:{
        userId: session.user.id,
        postId
      }
    }
  })

  return generateApiSuccessResponse('This post is liked by you', 200, (like ? true : false));
}