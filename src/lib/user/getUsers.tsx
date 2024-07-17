import { User } from "@prisma/client"
import { fetchPlus } from "../api/global"
import { FilterData } from "../definitions"
import { objectToUrlParams } from "../util"

export type UserFilter = {
  id?: string
  username?: string
  email?: string
  name?: string
  skip?: number
  limit?: number
  orderBy?: string
}

const host = process.env.HOST_URL

export default async function getUsers(params:UserFilter) {
  const query = objectToUrlParams(params)
  const res = await fetchPlus<FilterData<User>>(`${host || ""}/api/user?${query}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  return res
}

