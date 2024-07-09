import React from 'react'

type Props = {
  error: string
}

export default function ErrorPage({error}: Props) {
  return (
    <div className="flex items-center px-8 gap-6 flex-col md:justify-center md:flex-row min-h-[calc(100vh-64px)] py-8">
      <div 
        className='flex gap-4 items-center h-full justify-center m-auto'
      >
        <img className='w-24' src='/img/sad_cat_face.gif'></img>
        <h2 className='text-red-500 text-3xl font-bold'>{error}</h2>
      </div>
    </div>
  )
}