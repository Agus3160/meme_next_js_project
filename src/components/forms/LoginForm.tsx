"use client"

import { ApiResponse, TypeSignInSchema, signInSchema } from '@/lib/definitions'
import { signIn } from 'next-auth/react'
import GenericForm from '../global/GenericForm'
import { KeyRound } from 'lucide-react'

type Props = {}

export default function LoginForm({}: Props) {

  const signInHandler = async (data: TypeSignInSchema): Promise<ApiResponse> => {
    const res = await signIn("credentials", {
      ...data,
      redirect: false,
    })
    if(res?.error) return {error: res.error, success: false}
    return {success: true, message:"Sign in successful"}
  }

  return (
    <div className='flex min-h-full w-full flex-col'>
    <GenericForm 
      title="Sign In"
      buttonText="Sign In"
      schema={signInSchema}
      onSubmit={signInHandler}
      fields={[
        { name: 'email', label: 'Email', type: 'email', placeholder: 'example@gmail.com' },
        { name: 'password', label: 'Password', type: 'password', placeholder: 'Enter your password' },
      ]}
      icon={<KeyRound size={32} />}
    />
    </div>
  )
}