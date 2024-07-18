import { generateApiErrorResponse, generateApiSuccessResponse } from "@/lib/api/global";
import authOptions from "@/lib/auth/authOptions";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export const DELETE = async (req: NextRequest, { params }: { params: { id: string } }) => {

  const session = await getServerSession(authOptions);

  if (!session) return generateApiErrorResponse('You must be logged in to like a post', 401);

  const { id } = params;

  const like = await prisma.like.delete({
    where: {
      userId_postId:{
        userId: session.user.id,
        postId: id
      }
    }
  })

  return generateApiSuccessResponse('Post disliked', 200);
}