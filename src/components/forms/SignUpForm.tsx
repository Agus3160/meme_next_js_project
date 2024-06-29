"use client"

import { signUpSchema } from '@/lib/definitions';
import { signUp } from '@/lib/auth/signUp';
import GenericForm from '@/components/global/GenericForm';
import { UserRoundPlus } from 'lucide-react';

export default function SignUpForm()  {
  return (
    <div className='flex min-h-full w-full flex-col'>
      <GenericForm
        buttonText="Sign Up"
        title='Sign Up'
        icon={<UserRoundPlus size={32} />}
        schema={signUpSchema}
        onSubmit={signUp}
        fields={[
          { name: 'email', label: 'Email', type: 'email', placeholder: 'example@gmail.com' },
          { name: 'username', label: 'Username', type: 'text', placeholder: 'Enter your username' },
          { name: 'name', label: 'Name', type: 'text', placeholder: 'Enter your name' },
          { name: 'password', label: 'Password', type: 'password', placeholder: 'Enter your password' },
        ]}
      />
    </div>
  );
};
