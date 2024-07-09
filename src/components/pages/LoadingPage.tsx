import React from 'react'
import { LoaderCircle } from 'lucide-react'

type Props = {
  className?: string
}

export default function LoadingPage({className}: Props) {
  return (
    <div className="flex items-center px-8 gap-6 flex-col md:justify-center md:flex-row min-h-[calc(100vh-64px)] py-8">
      <div 
        className='flex items-center h-full justify-center m-auto'
      >
        <LoaderCircle className={`w-24 h-24 animate-spin ${className || ""}`} />
      </div>
    </div>
  )
}