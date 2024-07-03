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
    <p
      draggable={false}
      className={'unselectable'}
      style={{
        'fontFamily':`${fontFamily}`,
        'color':`${textColor}`,
        'fontSize':`${fontSize}`,
        'textShadow':`
          1px 1px 0 ${borderColor},
          -1px 1px 0 ${borderColor},
          -1px -1px 0 ${borderColor},
          1px -1px 0 ${borderColor}`
      }}
    >
      {text}
    </p>
  )
}