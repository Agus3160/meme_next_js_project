import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { CirclePlus, X, ChevronUp, ChevronDown, LoaderCircle } from 'lucide-react'
import { TypeTextBoxSchema, textBoxSchema, TypePostSchema, postSchema } from '@/lib/definitions'
import { useWatch } from 'react-hook-form'

type Props = {
  textBoxes: TypeTextBoxSchema[]
  setTextBoxes: (textBoxes: TypeTextBoxSchema[]) => void
}

const defaultValue = {
  text: '',
  fontFamily: 'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif',
  fontSize: 14,
  textColor: '#ffffff',
  borderColor: '#000000',
  rotate: 0
}

export default function TextBox({ textBoxes, setTextBoxes }: Props) {

  const [showDetail, setShowDetail] = useState<boolean[]>(new Array(textBoxes.length).fill(false))

  const { control, handleSubmit, register, formState: { errors } } = useForm<TypePostSchema>({
    resolver: zodResolver(textBoxSchema),
    defaultValues:{
      textBoxArray: [defaultValue]
    }
  })

  const { fields, append, remove } = useFieldArray({
    name: 'textBoxArray',
    control,
    rules:{
      minLength: 1
    }
  })

  const watchAll = useWatch({ control });

  useEffect(() => {
    setTextBoxes(watchAll.textBoxArray as TypeTextBoxSchema[] || []);
  }, [watchAll, setTextBoxes]);

  return (
    <form
      className="bg-slate-700 p-4 flex flex-col gap-4 rounded max-w-[320px] md:min-w-[560px] min-w-[320px] "
    >
      <h2 className='text-white text-2xl '>Edit Console</h2>

      <div 
        className='flex gap-2 items-center'
      >
        <label htmlFor='title' className='text-white'>
          Titulo:
        </label>
        <input id='title' placeholder='Enter title here' className='bg-slate-800 p-2 w-full rounded text-white outline-none' {...register('title')} />
      </div>

      {
        fields.map((field, index) => {
          return (
            <div
              key={field.id}
              className='flex flex-col items-center gap-2 relative  '
            >
              <div className='flex w-full gap-1 items-center'>
                <span className='text-white bg-slate-800 p-2 rounded text-sm'>#{index + 1}</span>
                <button
                  type='button'
                  className='bg-slate-800 p-1 rounded text-white duration-300 hover:bg-slate-600 hover:text-slate-100'
                  onClick={() => setShowDetail(prev => {
                    const newState = [...prev]
                    newState[index] = !newState[index]
                    return newState
                  })}
                >
                  {showDetail[index] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                <input
                  className='bg-slate-800 p-2 w-full rounded text-white outline-none'
                  placeholder='Enter text here'
                  {...register(`textBoxArray.${index}.text` as const)}
                />

                  <button
                    type='button'
                    className='bg-slate-800 p-1 rounded text-white duration-300 hover:bg-red-600 hover:text-red-100'
                    onClick={() => remove(index)}
                  >
                    <X
                      className=''
                      size={16}
                    />
                  </button>
              </div>

              {
                (
                  <div 
                    className={'grid md:grid-cols-2 shadow-md rounded  top-[100%] mb-3 z-10 bg-slate-700 p-4 grid-cols-1 gap-2 absolute border-b-2 border-l-2 border-r-2 border-gray-500 text-white duration-300 '
                    + (showDetail[index] ? ' h-auto top-0 opacity-100' : ' hidden')}
                  >
                    
                    <div className='flex items-center gap-2 '>
                      <label htmlFor={`fontSize-${index}`} className='text-sm w-24'>Font Size:</label>
                      <input
                        id={`fontSize-${index}`}
                        type='number'
                        min={0}
                        max={128}
                        className='bg-slate-800 p-2 w-16 rounded text-white outline-none'
                        {...register(`textBoxArray.${index}.fontSize` as const)}
                      />
                    </div>
                    
                    <div className='flex items-center gap-2'>

                      <label htmlFor={`fontFamily-${index}`} className='text-sm w-24'>Font Family:</label>
                      <select
                        id={`fontFamily-${index}`}
                        className='bg-slate-800 p-2 rounded text-white outline-none'
                        {...register(`textBoxArray.${index}.fontFamily` as const)}
                      >
                        <option 
                          style={{ fontFamily: 'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif' }} 
                          value='Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif'
                        >
                          Impact
                        </option>
                        <option style={{ fontFamily: 'monospace' }} value='monospace'>monospace</option>
                        <option style={{ fontFamily: 'sans-serif' }} value='sans-serif'>sans-serif</option>
                        <option style={{ fontFamily: 'serif' }} value='serif'>serif</option>
                      </select>
                    </div>

                    <div className='flex items-center gap-2'>

                      <label htmlFor={`textColor-${index}`} className='text-sm w-24'>Font Color:</label>
                      <input
                        type='color'
                        id={`textColor-${index}`}
                        className='bg-slate-800 p-0.5 w-12 mr-auto rounded text-white outline-none'
                        {...register(`textBoxArray.${index}.textColor` as const)}
                      />
                    </div>

                    <div className='flex items-center gap-2'>

                      <label htmlFor={`borderColor-${index}`} className='text-sm w-24'>Border Color:</label>
                      <input
                        type='color'
                        id={`borderColor-${index}`}
                        className='bg-slate-800 p-0.5 w-12 m-0 rounded text-white outline-none'
                        {...register(`textBoxArray.${index}.borderColor` as const)}
                      />
                    </div>

                    <div className='flex items-center gap-2'>

                      <label htmlFor={`rotate-${index}`} className='text-sm w-24  '>Rotate:</label>
                      <input
                        id={`rotate-${index}`}
                        className='range bg-slate-800 m-2 w-full rounded text-white outline-none'
                        type='range'
                        min={0}
                        max={360}
                        defaultValue={0}
                        step={1}
                        {...register(`textBoxArray.${index}.rotate` as const)}
                      />
                    </div>

                  </div>
                )
              }
            </div>
          )
        })
      }

      <button
        type='button'
        className='flex items-center gap-2 p-2 rounded text-white gap-2 bg-slate-800 duration-300 hover:bg-green-600 hover:text-green-100'
        onClick={() => append({ text: '', fontFamily: 'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif', fontSize: 12, textColor: 'black', borderColor: 'black', rotate: 0 })}
      >
        <CirclePlus size={32} />
        <p>Add Text Box</p>
      </button>

    </form>
  )
}