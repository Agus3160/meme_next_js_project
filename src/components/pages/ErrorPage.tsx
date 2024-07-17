import React from 'react'

type Props = {
  error: string
  children?: React.ReactNode
}

export default function ErrorPage({error, children}: Props) {
  return (
    <div className="flex items-center px-8 gap-8 flex-col justify-center min-h-[calc(100vh-64px)]">
      <div 
        className='flex gap-4 items-center justify-center '
      >
        <img className='w-24' src='/img/sad_cat_face.gif'></img>
        <h2 className='text-red-500 text-3xl font-bold'>{error}</h2>
      </div>
      {children}
    </div>
  )
}