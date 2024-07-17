import { fetchPlus } from "../api/global";
import { FilterData, TemplateType } from "../definitions";
import { objectToUrlParams } from "../util";

export type TemplateFilter = {
  title?: string;
  skip?: number;
  limit?: number;
  name?: string;
}

export default async function getTemplates(
  filter?: TemplateFilter
){

  let query = ""

  if(filter) query = objectToUrlParams(filter)

  const res = await fetchPlus<FilterData<TemplateType>>(`/api/template?${query}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return res
}