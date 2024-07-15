import { LoaderCircle } from 'lucide-react'
import React from 'react'

type Props = {
  onClose: () => void
  onSubmit?: () => void
  type: "button" | "submit"
  title?: string
  backTitle?: string
  buttonTitle?: string
  description?: string
  children?: React.ReactNode
  moreButton?:React.ReactNode
  isLoading?: boolean
}

export default function CustomModal({
  onClose,
  onSubmit,
  title,
  description,
  buttonTitle,
  type,
  children,
  backTitle,
  moreButton,
  isLoading
}: Props) {
  return (
    <div
      className='fixed z-[50] inset-0 overflow-y-auto bg-black bg-opacity-75 flex items-center justify-center'
    >
      <div className='flex flex-col items-center min-h-[256px] justify-around bg-slate-800 p-4 max-w-[320px] text-center rounded shadow'>
        <h2 className='text-white text-2xl mb-2'>{title}</h2>
        <p className='text-sm'>{description}</p>
        {children}
        <div className='flex justify-between w-full items-center'>
          <button
            onClick={onClose}
            type='button'
            className='bg-gray-500 gap-1 p-2 flex items-center rounded text-white duration-300 active:bg-gray-700 hover:bg-gray-600 hover:text-slate-100'
          >
            <span>{backTitle||"Back"}</span>
          </button>
          {moreButton}

          {
            <button
              onClick={onSubmit}
              type={type}
              disabled={isLoading}
              className='bg-blue-700 disabled:opacity-50 gap-1 p-2 flex items-center rounded text-white duration-300 active:bg-green-500 hover:bg-blue-800 hover:text-slate-100'
            >
              <span>{buttonTitle||"Submit"}</span>
              {isLoading !==undefined && isLoading && <LoaderCircle size={16} className='animate-spin'/>}
            </button>
          }
        </div>
      </div>
    </div>
  )
}