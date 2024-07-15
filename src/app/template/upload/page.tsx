"use client"

import InputFile from '@/components/forms/InputFile';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react'
import { useForm } from 'react-hook-form'
import { templateSchema, TypeTemplateSchema } from '@/lib/definitions';
import GenericInput from '@/components/forms/GenericInput';
import SubmitButton from '@/components/forms/SubmitButton';
import createTemplate from '@/lib/template/createTemplate';
import { toast } from 'react-toastify';
import { Images } from 'lucide-react';

export default function UploadTemplate() {

  const [src, setSrc] = React.useState('')
  const [file, setFile] = React.useState<File | null>(null)

  const {
    register,
    setValue,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TypeTemplateSchema>({
    defaultValues:{
      base64Images: [],
    },
    resolver: zodResolver(templateSchema),
  })

  const handleFileChange = (file: File) => {
    
    if(!file) {
      setValue('base64Images', [])
      setSrc('')
      setValue('contentType', '')
      return
    }

    const reader = new FileReader();
    let blurImageBase64:string = '';
    let originalImageBase64:string = '';

    reader.onload = function () {
      originalImageBase64 = reader.result as string;
      
      //Create the resized image
      const img = new Image();
      img.onload = function () {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) throw new Error('Failed to get canvas 2D context');

          // Calculate the new height to maintain aspect ratio
          const width = 20;
          const height = img.height * (width / img.width);

          canvas.width = width;
          canvas.height = height;

          // Draw the resized image onto the canvas
          ctx.drawImage(img, 0, 0, width, height);

          // Get the resized base64 string
          blurImageBase64 = canvas.toDataURL();

          // Update the state after the image is fully loaded and processed
          setValue('base64Images', [originalImageBase64, blurImageBase64])
          setValue('contentType', file.type.split('/')[1])
          setSrc(originalImageBase64)
      };

      img.src = originalImageBase64;
    };
    reader.readAsDataURL(file);
  }

  const handleClearImage = () => {
    setValue('base64Images', [])
    setSrc('')
  }

  const handleOnSubmit = async (data: TypeTemplateSchema) => {
    const { error, message, success } = await createTemplate(data) 
    if(success) toast.success(message)
    else toast.error(error)
    reset()
    setSrc('')
    setFile(null)
  }

  return (
    <div className='flex flex-col py-4 min-h-[calc(100vh-64px)] gap-2 px-4 md:px-12 m-auto justify-center'>
      <h2 className='text-3xl text-white font-bold mb-4 text-center'>Upload Your Template</h2>
      <div
        className='flex flex-col md:flex-row gap-4 items-center justify-center'
      >
        <div className={`bg-slate-500 flex flex-col items-center justify-center rounded ${src.length > 0 ? "h-auto" : "md:h-72 h-48 md:w-72 w-48"}`}>
          {
            src.length > 0 ?
              <img className='w-full max-w-[500px] h-auto' src={src}></img>
              :
              <div className='flex flex-col items-center justify-center'>
                <Images size={64} className='text-slate-600' />
                <p className='text-slate-600 font-bold'>Preview image</p>
              </div>
          }
        </div>

        <form
          onSubmit={handleSubmit(handleOnSubmit)}
          className='flex flex-col gap-6 py-4 md:p-4 text-white rounded-lg max-w-[720px] md:w-1/2 w-full'
        >
          <div className='flex flex-col gap-1'>
           <InputFile
              file={file}
              setFile={setFile}
              label='Image:'
              handleSetValue={handleFileChange}
              handleClearFile={handleClearImage}
              sizeLimitBytes={1024}
            />
            {errors.base64Images && <p className='text-sm text-red-500'>{errors.base64Images.message}</p>}
          </div>


          <GenericInput
            register={register}
            name='name'
            label='Template Name:'
            type='text'
            errors={errors}
            placeholder='Enter Template Name'
          />

          <GenericInput
            register={register}
            name='desc'
            label='Template Description:'
            type='textarea'
            errors={errors}
            className='h-24'
            placeholder='Enter Template Description'
            resizable={false}
          />

          <SubmitButton buttonText='Upload Template' isLoading={isSubmitting} />

        </form>
      </div>
    </div>
  )
}