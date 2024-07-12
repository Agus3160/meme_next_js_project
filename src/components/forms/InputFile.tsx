"use client"

import React from 'react'
import { toast } from 'react-toastify'
import { Upload, CircleX, LoaderCircle } from 'lucide-react'

type Props = {
  file: File | null
  setFile: (file: File | null) => void
  label?: string
  id?: string
  sizeLimitBytes?: number
  handleSetValue?: (file: File) => void
  handleClearFile?: () => void
}

export default function InputFile({
  file,
  setFile,
  label,
  id,
  handleSetValue,
  sizeLimitBytes,
  handleClearFile
}: Props) {

  const ref = React.useRef<HTMLInputElement>(null)
  const [loading, setLoading] = React.useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true)
    if (e.target.files && e.target.files.length > 0) {
      try {
        const file = e.target.files[0]

        if (!file.type.startsWith('image/')) throw new Error('Please select an image')
        if (file.size > (sizeLimitBytes || 1024) * 1024) throw new Error('File must be less than 1MB')
        
        setFile(e.target.files[0])

        handleSetValue && handleSetValue(file)
        
      } catch (error) {
        if (error instanceof Error) toast.error(error.message)
        else toast.error('Error setting the image')
      } finally {
        setLoading(false)
      }
    }
    setLoading(false)
  }

  return (
    <div className='w-full gap-1 flex flex-col '>
      {label && <label className='text-white text-left w-42' htmlFor={id}>{label}</label>}
      <div
        className='flex w-full bg-slate-700 justify-between items-center p-2 outline outline-2 outline-slate-500 outline-dashed rounded hover:cursor-pointer'
        id={id}
        onClick={file ? undefined : () => ref.current?.click()}
      >
        <span className='text-white line-clamp-1 w-11/12'>{file ? file.name : 'Select an Image'}</span>
        {
          loading ?
            <LoaderCircle size={32} className='text-white-500 animate-spin' />
          :
          file ?
            <CircleX
              onClick={() => {
                handleClearFile && handleClearFile()
                setFile(null)
              }}
              size={32}
              className='text-white duration-300 hover:text-red-500'
            />
          :
            <Upload 
              className='text-white'
              size={32} 
            />
        }
        <input 
          ref={ref} 
          className='hidden' 
          type="file" 
          accept='image/*' 
          size={(sizeLimitBytes || 1024) * 1024} 
          onChange={(e) => handleFileChange(e)}
        >  
        </input>
      </div>
    </div>
  )
}