"use client"

import TextBox from '@/components/forms/TextBox';
import CustomDraggable from '@/components/post/CustomDraggable';
import FontEditor from '@/components/post/FontEditor';
import React, { useEffect, useState } from 'react';
import { TypeTextBoxSchema } from '@/lib/definitions';
import { useSearchParams } from 'next/navigation';
import { prepareTemplateToPost } from '@/lib/post/utils';
import ErrorPage from '@/components/pages/ErrorPage';
import LoadingPage from '@/components/pages/LoadingPage';

type TextBox = {
  text: string,
  fontFamily: string,
  fontSize: number,
  textColor: string,
  borderColor: string,
  rotate: number
}

export default function CreatePost() {

  const searchParams = useSearchParams()
  const templateId = searchParams.get('templateId')

  const [textBoxes, setTextBoxes] = useState<TypeTextBoxSchema[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const divRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {

    if (!canvasRef.current || !divRef.current || !templateId) return

    const prepareTemplate = async () => {
      try {
        await prepareTemplateToPost(templateId, canvasRef.current, divRef.current);
      } catch (e) {
        if (e instanceof Error) setError(e.message)
        else setError('Error setting the template')
      } finally {
        setLoading(false)
      }
    }

    prepareTemplate()

  }, [templateId]);


  if (error) return <ErrorPage error={error} />
  if (!templateId) return <ErrorPage error="You have to specify a template" />

  return (
    <>
      {loading && <LoadingPage className='text-white' />}
      <div
        className={"flex items-center gap-6 flex-col md:justify-center lg:flex-row min-h-[calc(100vh-64px)] py-8" + (loading ? " hidden" : "")}
      >
        <div
          className='flex flex-col'
        >
          <div
            className='relative overflow-hidden bg-gray-700 z-0'
            style={{ width: '320px', height: 'auto' }}
            ref={divRef}
          >
            <canvas ref={canvasRef} />
            {
              textBoxes.map((textBox, index) => {
                return (
                  <CustomDraggable
                    key={index}
                    rotate={textBox.rotate}
                    minHeight={32}
                    minWidth={32}
                  >
                    <FontEditor
                      text={textBox.text}
                      fontSize={textBox.fontSize}
                      textColor={textBox.textColor}
                      borderColor={textBox.borderColor}
                      fontFamily={textBox.fontFamily}
                    />
                  </CustomDraggable>
                )
              })
            }
          </div>

        </div>

        <TextBox
          canvas={canvasRef.current!}
          container={divRef.current!}
          templateId={templateId}
          textBoxes={textBoxes}
          setTextBoxes={setTextBoxes}
        />

      </div>
    </>
  );
}
