import React from 'react'
import { FieldErrors, UseFormRegister } from 'react-hook-form'

type Props = {
  register: UseFormRegister<any>
  name: string
  label?: string
  type: string
  errors:FieldErrors<any>
  placeholder?: string
  className?: string
  resizable?: boolean
}

export default function GenericInput({
  register,
  name,
  label,
  type,
  errors,
  placeholder,
  className,
  resizable,
}: Props) {
  return (
    <div key={String(name)} className='flex flex-col gap-1 w-full'>
      { label && <label htmlFor={String(name)}>{label}</label>}
      {
        type === 'textarea' ?
        <textarea
          className={`p-2 ${!label? "w-full": ""} rounded bg-slate-700 focus:outline-1 outline-none ${resizable? "": "resize-none"} ${className || ""} ` + (errors[name]? 'focus:outline-red-500':'focus:outline-blue-700') }
          id={String(name)}
          {...register(name)}
          placeholder={placeholder}
        />
        :
        <input
          className={`p-2 ${!label? "w-full": ""} rounded bg-slate-700 focus:outline-1 outline-none ${className || ""} ` + (errors[name]? 'focus:outline-red-500':'focus:outline-blue-700') }
          id={String(name)}
          {...register(name)}
          type={type} 
          placeholder={placeholder}
        />
      }
      {
        errors[name] && <p className='text-sm text-red-500'>{errors[name]?.message as string}</p>
      }
  </div>
  )
}