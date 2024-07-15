import { signOut } from "next-auth/react";
import { toast } from "react-toastify";

export default async function logOut() {
  try {
    await signOut({
      redirect: true,
      callbackUrl: "/",
    })
  } catch (error) {
    toast.error("Error logging out")
  }
}