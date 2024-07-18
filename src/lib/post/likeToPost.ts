import { fetchPlus } from "../api/global"
import { TypeLikeSchema } from "../definitions"

const likePost =  async (params:TypeLikeSchema) => {
  return await fetchPlus("/api/like", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
    credentials: "include",
  })
}

const dislikePost = async (params:TypeLikeSchema) => {
  return await fetchPlus(`/api/like/${params.postId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  })
}

export { likePost, dislikePost }