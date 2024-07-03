import { ApiResponse, TypeSignInSchema } from "@/lib/definitions"
import { signIn } from "next-auth/react"

const signInHandler = async (data: TypeSignInSchema): Promise<ApiResponse> => {
  const res = await signIn("credentials", {
    ...data,
    redirect: false,
  })
  if(res?.error) return {error: res.error, success: false}
  return {success: true, message:"Sign in successful"}
}


export { signInHandler }