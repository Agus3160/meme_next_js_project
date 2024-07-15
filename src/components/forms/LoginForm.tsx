"use client"

import { signInSchema } from '@/lib/definitions'
import GenericForm from '../global/GenericForm'
import { KeyRound } from 'lucide-react'
import { signInHandler } from '@/backend/controllers/user'

type Props = {}

export default function LoginForm({}: Props) {
  return (
    <div className='flex min-h-full w-full flex-col'>
    <GenericForm 
      title="Sign In"
      buttonText="Sign In"
      schema={signInSchema}
      onSubmit={signInHandler}
      redirect="/"
      fields={[
        { name: 'email', label: 'Email', type: 'email', placeholder: 'example@gmail.com' },
        { name: 'password', label: 'Password', type: 'password', placeholder: 'Enter your password' },
      ]}
      icon={<KeyRound size={32} />}
    />
    </div>
  )
}