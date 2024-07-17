import { generateApiErrorResponse, generateApiSuccessResponse } from "@/lib/api/global";
import prisma from "@/lib/db";
import { NextRequest } from "next/server";
import { getSearchParams } from "@/lib/util";
import { UserFilter } from "@/lib/user/getUsers";

export async function GET(req: NextRequest) {
  
  const query = req.nextUrl.searchParams;

  const keys:(keyof UserFilter)[] = ['id', 'skip', 'limit', 'username', "email", "name", "orderBy"]; 

  const filter: UserFilter = getSearchParams(query, keys);

  const where = {
    id: filter.id,
    username: filter.username,
    email: filter.email,
    name: filter.name
  }

  const users = await prisma.user.findMany({
    take: Number(filter.limit || 10),
    skip: Number(filter.skip || 0),
    where: {...where},
    orderBy: {
      createdAt: 'desc'
    },
  })

  const count = await prisma.user.count({
    where: {...where}
  });

  const values = {
    data: users,
    count
  }

  return generateApiSuccessResponse('List of posts', 200, values);

}
