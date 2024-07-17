import prisma from "@/lib/db";
import { TypeSignUpSchema } from "@/lib/definitions";

const createUser = async (params:TypeSignUpSchema) =>{
  return await prisma.user.create({
    data: {
      username:params.username,
      email:params.email,
      name:params.name,
      password: params.password
    }
  })
}

const getUser = async () =>{
  
  const value = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
  })

  const count = await prisma.user.count( )

  return {value: value, count: count}
}

const updateUser = async (id:string, params:TypeSignUpSchema) =>{
  return await prisma.user.update({
    where: { id },
    data: params
  })
}

export { 
  getUser, 
  createUser 
}