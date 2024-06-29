import { fetchPlus } from "../api/global";
import { TypeSignUpSchema } from "../definitions";

export async function signUp(params:TypeSignUpSchema) {
  return await fetchPlus("/api/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(params)
  })
}