import { LoaderCircle } from 'lucide-react'
import React from 'react'

type Props = {
  buttonText: string
  isLoading:boolean
}

export default function SubmitButton({
  buttonText,
  isLoading
}: Props) {
  return (
    <button disabled={isLoading} type="submit" className='p-2 rounded active:bg-blue-700 bg-blue-600 hover:bg-blue-500 outline-none flex gap-2 items-center justify-center'>
        <p>{buttonText}</p> 
        {isLoading && <LoaderCircle size={16} className='animate-spin' />}
    </button>
  )
}