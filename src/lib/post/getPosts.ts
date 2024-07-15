import { fetchPlus } from "../api/global";
import { FilterData, PostType } from "../definitions";
import { objectToUrlParams } from "../util";

export type PostFilter = {
  title?: string;
  skip?: number;
  limit?: number;
  templateId?: string;
  userId?: string;
}

export default async function getPosts(
  filter?: PostFilter
){

  let query = ""

  if(filter) query = objectToUrlParams(filter)

  const res = await fetchPlus<FilterData<PostType>>(`/api/post?${query}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res
}