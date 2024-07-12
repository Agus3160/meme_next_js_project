import { fetchPlus } from "../api/global"
import { TypeTemplateSchema } from "../definitions"

export default async function createTemplate({ contentType, base64Images, name, desc }: TypeTemplateSchema) {
  return await fetchPlus('/api/template', {
    method: 'POST',
    body: JSON.stringify({
      contentType,
      base64Images,
      name,
      desc
    })
  })
}