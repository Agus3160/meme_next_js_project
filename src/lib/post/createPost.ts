import { fetchPlus } from "../api/global"

type Props = {
  title: string
  templateId: string
  base64Images: string[]
}

export default async function createPost(params:Props) {
  return await fetchPlus("/api/post", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(params),
    credentials: "include",
  })
}