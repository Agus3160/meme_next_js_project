"use client"

import React from 'react'
import { useForm, FieldValues, UseFormReturn, Path } from 'react-hook-form'
import { ZodSchema } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ApiResponse } from '@/lib/definitions'
import { toast } from 'react-toastify'
import GenericInput from '../forms/GenericInput'
import SubmitButton from '../forms/SubmitButton'

interface CustomFormProps<D, T extends FieldValues > {
  title: string
  buttonText: string
  icon?: React.ReactNode
  schema: ZodSchema<T>
  onSubmit: (data: T) => Promise<ApiResponse<D>>
  fields: {
    name: Path<T>
    label: string
    type: string
    placeholder?: string
  }[]
}

export default function GenericForm<D, T extends FieldValues>({ schema, onSubmit, fields, title, buttonText, icon }: CustomFormProps<D,T>) {
  const { handleSubmit, register, formState: { errors, isSubmitting } }: UseFormReturn<T> = useForm<T>({
    resolver: zodResolver(schema),
  })

  const handleFormSubmit = async (data: T) => {
    const { success, error, message } = await onSubmit(data)
    if (success && message) toast.success(message, { type: "success" })
    if (error) toast.error(error, { type: "error" })
  }

  return (
    <form
      className='flex flex-col gap-6 py-4 md:p-4 text-white rounded-lg max-w-[560px] md:w-1/2 w-full m-auto'
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <div className='flex gap-2 justify-center items-center'>
        <h1 className='text-3xl text-center font-bold'>{title}</h1>
        {icon && icon}
      </div>

      {fields.map(({ name, label, type, placeholder }) => (
        <GenericInput 
          key={String(name)}
          register={register}
          name={name}
          label={label}
          type={type}
          errors={errors}
          placeholder={placeholder}
        />
      ))}
      <SubmitButton buttonText={buttonText} isLoading={isSubmitting} />
    </form>
  )
}
