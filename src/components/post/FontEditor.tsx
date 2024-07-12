import React from 'react'

type Props = {
  text:string
  fontFamily?:string,
  fontSize:number
  textColor:string
  borderColor:string
}

export default function FontEditor({fontFamily='Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif', fontSize, textColor, borderColor, text}: Props) {
  return (
    <div
      draggable={false}
      className={'unselectable'}
      style={{
        'fontFamily':`${fontFamily}`,
        'color':`${textColor}`,
        'fontSize':`${fontSize}px`,
        'textShadow':`2px 2px 5px ${borderColor}`
      }}
    >
      {text}
    </div>
  )
}