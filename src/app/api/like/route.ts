import { generateApiErrorResponse, generateApiSuccessResponse } from "@/lib/api/global";
import authOptions from "@/lib/auth/authOptions";
import prisma from "@/lib/db";
import { likeSchema } from "@/lib/definitions";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {

  const session = await getServerSession(authOptions);

  if (!session) return generateApiErrorResponse("You have to be logged in to like a post", 401);

  const body = await req.json();

  const result = likeSchema.safeParse(body);

  if (result.error) return generateApiErrorResponse(result.error.errors[0].message, 400);

  const { postId } = result.data;

  const like = await prisma.like.create({
    data: {
      postId,
      userId: session.user.id
    }
  })

  return generateApiSuccessResponse('Post liked', 200);
}

