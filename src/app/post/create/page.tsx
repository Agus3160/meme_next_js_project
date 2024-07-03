"use client";

import TextBox from '@/components/forms/TextBox';
import CustomDraggable from '@/components/post/CustomDraggable';
import FontEditor from '@/components/post/FontEditor';
import React, { useState } from 'react';
import { TypeTextBoxSchema } from '@/lib/definitions';

type Props = {};

type TextBox = {
  text: string,
  fontFamily: string,
  fontSize: number,
  textColor: string,
  borderColor: string,
  rotate: number
}

export default function CreatePost({ }: Props) {
  
  const [textBoxes, setTextBoxes] = useState<TypeTextBoxSchema[]>([]);
  
  console.log(textBoxes)

  return (
    <div className="flex items-center gap-6 flex-col md:justify-center md:flex-row min-h-[calc(100vh-64px)] py-8">

      <div 
        className='relative min-w-[320px] overflow-hidden h-72 bg-gray-700 border-1 border-gray-500 z-0'
      >
        {
          textBoxes.map((textBoxes, index) => {
            return (
              <CustomDraggable 
                key={index}
                rotate={textBoxes.rotate} 
                className=''   
                minHeight={32}
                minWidth={32}  
              >
              <FontEditor
                text={textBoxes.text}
                fontSize={textBoxes.fontSize}
                textColor={textBoxes.textColor}
                borderColor={textBoxes.borderColor}
                fontFamily={textBoxes.fontFamily}
              />
              </CustomDraggable>
            )
          })
        }
      </div>

      <TextBox textBoxes={textBoxes} setTextBoxes={setTextBoxes} />
      
    </div>
  );
}
