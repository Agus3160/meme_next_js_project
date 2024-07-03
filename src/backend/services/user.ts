import prisma from "@/lib/db";
import { TypeSignUpSchema, UserFilter } from "@/lib/definitions";

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

const getUser = async (filter?:UserFilter) =>{
  
  const value = await prisma.user.findMany({
    where: {
      email: filter?.email,
      username:{ startsWith: filter?.username },
      name: { startsWith:filter?.name },
      createdAt:{ 
        gte:filter?.createdAt?.gte,
        lte:filter?.createdAt?.lte
      },
      updatedAt:{ 
        gte:filter?.updatedAt?.gte,
        lte:filter?.updatedAt?.lte
      },
      id: filter?.id
    },
    orderBy: { createdAt: 'desc' },
    take: filter?.quantity,
    skip: filter?.skip
  })

  const count = await prisma.user.count({
    where: {
      email: filter?.email,
      username:{ startsWith: filter?.username },
      name: { startsWith:filter?.name },
      createdAt:{ 
        gte:filter?.createdAt?.gte,
        lte:filter?.createdAt?.lte
      },
      updatedAt:{ 
        gte:filter?.updatedAt?.gte,
        lte:filter?.updatedAt?.lte
      },
      id: filter?.id
    }
  })

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