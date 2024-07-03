import { ApiError } from "next/dist/server/api-utils";
import { NextRequest, NextResponse, } from "next/server";
import bcrypt from "bcrypt"
import { signUpSchema } from "@/lib/definitions";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { generateApiErrorResponse, generateApiSuccessResponse } from "@/lib/api/global";
import { createUser } from "@/backend/services/user";

export async function POST(req:NextRequest, res:NextResponse) {

  const body:unknown = await req.json();

  const result = signUpSchema.safeParse(body)

  if(!result.success){
    return generateApiErrorResponse(result.error.errors[0].message, 400)
  }

  try{
    const { username, email, name, password } = result.data

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await createUser({username, email, name, password: hashedPassword})
    
    return generateApiSuccessResponse("User created successfully", 201)
  }catch(error){
    if(error instanceof PrismaClientKnownRequestError){
      if(error.code === "P2002") return generateApiErrorResponse("User already exists", 500)
    }
    if(error instanceof ApiError) return generateApiErrorResponse(error.message, error.statusCode)
    return generateApiErrorResponse("Something went wrong", 500)
  }
}