import { fetchPlus } from "../api/global";

export default async function doYouLikeThisPost (
  postId:string
) {
  return await fetchPlus(`/api/like/check/${postId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  })
}