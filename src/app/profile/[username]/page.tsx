import ErrorPage from '@/components/pages/ErrorPage'
import authOptions from '@/lib/auth/authOptions'
import getUsers from '@/lib/user/getUsers'
import { CircleUserRound, Settings } from 'lucide-react'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import React from 'react'
import { toast } from 'react-toastify'

export default async function Profile({ params }: { params: { username: string } }) {

  const { username } = params

  const currentUser = await getServerSession(authOptions)

  const {data:values, success, error} = await getUsers({username})

  if(!values && !success && error) return <ErrorPage error={error} />

  if(!values) return <ErrorPage error="Error getting the user info" />

  if(values.data.length === 0) return <ErrorPage error="User not found" />

  const user = values.data[0]

  return (
    <div className="text-white flex flex-col mt-8 mx-auto items-center justify-center">
      
      <div className='w-full px-4 sm:px-0 sm:w-[720px]'>
        <div className='flex items-center justify-between pb-4 border-b'>
          <div className='flex gap-3 items-center'>
            <CircleUserRound
              className='w-12 h-12 text-white'
            />
            <div className='flex flex-col'>
              <h2 className='text-2xl font-bold'>{user.username}</h2>
              {
                user.id === currentUser?.user?.id &&
                <>
                  <span className='text-sm'>{user.name}</span>
                  <span className='text-sm'>{user.email}</span>
                </>
              }
            </div>
          </div>
          {
            user.id === currentUser?.user?.id &&
            <Link className='hover:opacity-80' href={`/profile/${user.username}/settings`}>
              <Settings className='w-8 h-8 text-white'/>
            </Link>
          }
        </div>
      </div>
      <div>

      </div>
    </div>
  )
}