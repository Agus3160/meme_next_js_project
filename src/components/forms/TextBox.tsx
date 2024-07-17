"use client"

import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { CirclePlus, X, ChevronUp, ChevronDown, Brush, Save, LoaderCircle, Download } from 'lucide-react';
import { TypeTextBoxSchema, TypePostSchema, postSchema } from '@/lib/definitions';
import GenericInput from './GenericInput';
import { generateCanvas, resizeCanvas } from '@/lib/post/utils';
import CustomModal from '../global/CustomModal';
import { toast } from 'react-toastify';
import createPost from '@/lib/post/createPost';
import { useSession } from 'next-auth/react';

type Props = {
  templateId: string;
  textBoxes: TypeTextBoxSchema[];
  setTextBoxes: (textBoxes: TypeTextBoxSchema[]) => void;
  canvas: HTMLCanvasElement;
  container: HTMLDivElement; 
};

const defaultValue = {
  text: '',
  fontFamily: 'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif',
  fontSize: 22,
  textColor: '#ffffff',
  borderColor: '#000000',
  rotate: 0,
};

export default function TextBox({ textBoxes, setTextBoxes, templateId, canvas, container }: Props) {

  const {data:session} = useSession();
  const [showDetail, setShowDetail] = useState<boolean[]>(new Array(textBoxes.length).fill(false));
  const [step, setStep] = useState<number>(0);

  const { 
    control, 
    handleSubmit, 
    register, 
    setValue, 
    trigger, 
    getValues, 
    formState: { errors, isSubmitting } 
  } = useForm<TypePostSchema>({
    resolver: zodResolver(postSchema),
    mode:"all",
    defaultValues: {
      title: '',
      textBoxArray: textBoxes.length ? textBoxes : [defaultValue],
      templateId: templateId,
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: 'textBoxArray',
    control,
  });

  const watchAll = useWatch({ control });

  useEffect(() => {
    setTextBoxes(watchAll.textBoxArray as TypeTextBoxSchema[] || []);
  }, [watchAll, setTextBoxes]);

  const onSubmit = async (data: TypePostSchema) => {
    if(!session) {
      toast.error("You need to be logged in to create a post")
      return
    }
    const {error, message, success} = await createPost({title: data.title, templateId: data.templateId, base64Images: data.base64Images})
    if(success){ 
      toast.success(message)
      setStep(0)
    }
    else toast.error(error)
  };

  return (
    <form
      className="bg-slate-800 text-white p-4 flex flex-col gap-4 rounded max-w-[320px] lg:min-w-[520px] min-w-[320px] shadow-md"
      onSubmit={handleSubmit(onSubmit)}
    >
      {
        step===1 && 
        <CustomModal 
          onClose={() => setStep(0)} 
          type="submit" 
          title="This is your meme" 
          buttonTitle="Publish" 
          description="This is a preview to check if everything is correct" 
          isLoading={isSubmitting}
          moreButton={
            <button 
              type='button'
              onClick={async () => {
                const a = document.createElement("a");
                a.href = getValues("base64Images")[0];
                a.download = `meme_${new Date().getTime()}.png`;
                a.click();
                a.remove();
              }}
              className="px-2 py-2 bg-green-500 hover:bg-green-700 duration-300 text-white rounded"
            >
              <Download size={16} />
            </button>
          }
        >
          <img 
            className='my-4 rounded'
            src={getValues("base64Images")[0]}
          />
        </CustomModal>
      }

      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Brush size={32} className='' />
          <h2 className='text-white text-2xl'>Edit Console</h2>
        </div>
        <button
          onClick={async (e) => {
            e.preventDefault();
            const isValid = await trigger(['textBoxArray', 'title', 'templateId']);
            if(
              !isValid
            ) {
              return;
            }else{
              const imageCanvas = await generateCanvas(canvas, container);
              if(!imageCanvas) return toast.error("Failed to generate image");
              const base64OriginalImage = imageCanvas.toDataURL()
              const base64BlurImage = resizeCanvas(imageCanvas, 20).toDataURL();
              setValue("base64Images", [base64OriginalImage, base64BlurImage]);
              setStep(1);
            }
          }}
          disabled={isSubmitting}
          type='button'
          className='bg-slate-700 gap-1 p-1 flex items-center rounded text-white duration-300 active:bg-green-500 hover:bg-green-700 hover:text-slate-100'
        >
          <Save size={32} />
          <p>Save</p>
        </button>
      </div>

      <GenericInput
        name='title'
        type="text"
        register={register}
        errors={errors}
        label="Title"
        placeholder="Enter title here"
      />

      {fields.map((field, index) => (
        <div
          key={field.id}
          className='flex flex-col items-center gap-2 relative'
        >
          <div className='flex w-full gap-1 items-center'>
            <span className={`text-white p-2 rounded inner-shadow text-sm ` + (errors.textBoxArray?.[index]?.text? 'bg-red-700':'bg-slate-700')}>#{index + 1}</span>
            <button
              type='button'
              className='bg-slate-800 p-1 rounded text-white duration-300 hover:bg-slate-600 hover:text-slate-100'
              onClick={() => setShowDetail(prev => {
                const newState = [...prev];
                newState[index] = !newState[index];
                return newState;
              })}
            >
              {showDetail[index] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            
            <div
              className='flex flex-col flex-1 gap-1'
            >
              <input
                type="text"
                autoComplete='off'
                {...register(`textBoxArray.${index}.text` as const)}
                className={`p-2 w-full rounded bg-slate-700 focus:outline-1 outline-none ` + (errors.textBoxArray?.[index]?.text? 'focus:outline-red-500':'focus:outline-blue-700') }
                placeholder={
                  errors.textBoxArray?.[index]?.text ? 
                    errors.textBoxArray?.[index]?.text?.message as string
                  :
                    `Text ${index + 1}`
                }
              />
            </div>

            <button
              type='button'
              className='bg-slate-800 p-1 rounded text-white duration-300 hover:bg-red-600 hover:text-red-100'
              onClick={() => remove(index)}
            >
              <X size={16} />
            </button>
          </div>

          {showDetail[index] && (
            <div
              className='grid lg:grid-cols-2 shadow-md rounded mb-3 z-10 bg-slate-700 p-4 grid-cols-1 top-[100%] gap-2 absolute border-b-2 border-l-2 border-r-2 border-gray-500 text-white'
            >
              <div className='flex items-center gap-2'>
                <label htmlFor={`fontSize-${index}`} className='text-sm w-24'>Font Size:</label>
                <input
                  id={`fontSize-${index}`}
                  type='number'
                  min={0}
                  max={128}
                  className='bg-slate-800 p-2 w-16 rounded text-white outline-none'
                  {...register(`textBoxArray.${index}.fontSize` as const, {valueAsNumber: true})}
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
                <label htmlFor={`rotate-${index}`} className='text-sm w-24'>Rotate:</label>
                <input
                  id={`rotate-${index}`}
                  className='range bg-slate-800 m-2 w-full rounded text-white outline-none'
                  type='range'
                  min={-180}
                  max={180}
                  defaultValue={0}
                  step={1}
                  {...register(`textBoxArray.${index}.rotate` as const, {valueAsNumber: true})}
                />
              </div>
            </div>
          )}
        </div>
      ))}
        
      {
        errors.textBoxArray && 
        <p className='text-red-500 text-sm text-center'>{errors.textBoxArray.message}</p>
      }

      <button
        type='button'
        disabled={isSubmitting}
        className='flex items-center gap-2 p-2 rounded text-white bg-slate-700 duration-300 hover:bg-slate-600 hover:text-green-100'
        onClick={() => {
          append(defaultValue)
        }}
      >
        <CirclePlus size={32} />
        <p>Add Text Box</p>
      </button>
    </form>
  );
}
