"use client";

import React, { useEffect, useRef } from 'react';

type Props = {
  className?: string;
  children?: React.ReactNode;
  rotate?: number;
  minWidth?: number;
  minHeight?: number;
  id?: string;
};

type Resizer = {
  S: HTMLDivElement | null;
  W: HTMLDivElement | null;
  N: HTMLDivElement | null;
  E: HTMLDivElement | null;
};

export default function CustomDraggable({ children, className, rotate, minWidth, id, minHeight }: Props) {
  
  const boxRef = useRef<HTMLDivElement>(null);

  const resizerRef = useRef<Resizer>({ S: null, W: null, N: null, E: null });

  const isClicked = useRef<boolean>(false);

  const isResizing = useRef<boolean>(false);
  const currentResizer = useRef<HTMLDivElement | null>(null);

  const sizes = useRef<{
    startWidth: number,
    startHeight: number,
    lastWidth: number,
    lastHeight: number
  }>({
    startWidth: 0,
    startHeight: 0,
    lastWidth: 0,
    lastHeight: 0
  })

  const coords = useRef<{
    startX: number,
    startY: number,
    lastX: number,
    lastY: number
  }>({
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0
  })

  useEffect(() => {
    if (!boxRef.current) return;
    
    if (!resizerRef.current.S || !resizerRef.current.W || !resizerRef.current.N || !resizerRef.current.E) throw new Error('Resizer not found');

    const {S, W, N, E} = resizerRef.current;
    const box = boxRef.current;
    const container = box.parentElement

    if(!container) return

    const onResizeMouseDown = (e: MouseEvent) => {
      isResizing.current = true;

      coords.current.startX = e.clientX;
      coords.current.startY = e.clientY;

      sizes.current.startWidth = box.offsetWidth;
      sizes.current.startHeight = box.offsetHeight;

      currentResizer.current = e.currentTarget as HTMLDivElement

      container.addEventListener('mousemove', onResizeMouseMove);
      container.addEventListener('mouseup', onResizeMouseUp);
    }

    const onResizeMouseMove = (e: MouseEvent) => {
      if (!isResizing.current) return;

      let newHeight = 0;
      let newWidth = 0;
      let newTop = 0;
      let newLeft = 0;

      switch(currentResizer.current) {
        case S: {
          newHeight = sizes.current.startHeight + (e.clientY - coords.current.startY);
          if(minHeight && newHeight < minHeight) newHeight = minHeight;
          box.style.height = `${newHeight}px`;
          break;
        }
        case W: {
          newWidth = sizes.current.startWidth - (e.clientX - coords.current.startX);
          newLeft = e.clientX + coords.current.lastX - coords.current.startX 
          if(minWidth && newWidth < minWidth) newWidth = minWidth;
          box.style.width = `${newWidth}px`;
          box.style.left = `${newLeft}px`;
          break;
        }
        case N: {
          newHeight = sizes.current.startHeight - (e.clientY - coords.current.startY);
          newTop = e.clientY + coords.current.lastY - coords.current.startY
          if(minHeight && newHeight < minHeight) newHeight = minHeight;
          box.style.height = `${newHeight}px`;
          box.style.top = `${newTop}px`;
          break;
        }
        case E: {
          newWidth = sizes.current.startWidth + (e.clientX - coords.current.startX);
          if(minWidth && newWidth < minWidth) newWidth = minWidth;
          box.style.width = `${newWidth}px`;
          break;
        }
      }
    }

    const onResizeMouseUp = () => {
      isResizing.current = false;
      coords.current.lastX = box.offsetLeft;
      coords.current.lastY = box.offsetTop;

      sizes.current.lastWidth = box.offsetWidth;
      sizes.current.lastHeight = box.offsetHeight;

      container.removeEventListener('mousemove', onResizeMouseMove);
      container.removeEventListener('mouseup', onResizeMouseUp);
    }

    const onDragMouseDown = (e: MouseEvent) => {
      if (isResizing.current) return;
      isClicked.current = true;
      coords.current.startX = e.clientX;
      coords.current.startY = e.clientY;

      container.addEventListener('mousemove', onDragMouseMove);
      container.addEventListener('mouseup', onDragMouseUp);
    }

    const onDragMouseUp = () => {
      isClicked.current = false;
      coords.current.lastX = box.offsetLeft;
      coords.current.lastY = box.offsetTop;

      container.removeEventListener('mousemove', onDragMouseMove);
      container.removeEventListener('mouseup', onDragMouseUp);
    }

    const onDragMouseMove = (e: MouseEvent) => {
      if (!isClicked.current || isResizing.current) return;

      let nextX = e.clientX - coords.current.startX + coords.current.lastX;
      let nextY = e.clientY - coords.current.startY + coords.current.lastY;

      const containerRect = container.getBoundingClientRect();

      const maxWidth = containerRect.width - box.offsetWidth;
      const maxHeight = containerRect.height - box.offsetHeight;

      if(nextX > maxWidth) nextX = maxWidth;
      if(nextY > maxHeight) nextY = maxHeight;
      if(nextX < 0) nextX = 0
      if(nextY < 0) nextY = 0

      box.style.top = `${nextY}px`;
      box.style.left = `${nextX}px`;
    }

    box.addEventListener('mousedown', onDragMouseDown);

    S.addEventListener('mousedown', onResizeMouseDown);
    W.addEventListener('mousedown', onResizeMouseDown);
    N.addEventListener('mousedown', onResizeMouseDown);
    E.addEventListener('mousedown', onResizeMouseDown);

    const cleanup = () => {
      box.removeEventListener('mousedown', onDragMouseDown);
      container.removeEventListener('mousemove', onDragMouseMove);
      container.removeEventListener('mouseup', onDragMouseUp);

      S.removeEventListener('mousedown', onResizeMouseDown);
      W.removeEventListener('mousedown', onResizeMouseDown);
      N.removeEventListener('mousedown', onResizeMouseDown);
      E.removeEventListener('mousedown', onResizeMouseDown);
      container.removeEventListener('mousemove', onResizeMouseMove);
      container.removeEventListener('mouseup', onResizeMouseUp);
    }

    return cleanup;
  }, []);

  return (
    <div
      id={id}
      ref={boxRef}
      className={`absolute border-2 border-dashed border-white overflow-hidden ${className}`}
      style={{ top: 12, left: 12, width: '100px', height: '100px', rotate: `${rotate}deg` }}
    >
      <div ref={el => { resizerRef.current.S = el }} className='absolute bottom-[-4px] left-[calc(50%-4px)] w-[8px] h-[8px] bg-white cursor-s-resize'></div>
      <div ref={el => { resizerRef.current.W = el }} className='absolute top-[calc(50%-4px)] left-[-4px] w-[8px] h-[8px] bg-white cursor-w-resize'></div>
      <div ref={el => { resizerRef.current.E = el }} className='absolute top-[calc(50%-4px)] right-[-4px] w-[8px] h-[8px] bg-white cursor-e-resize'></div>
      <div ref={el => { resizerRef.current.N = el }} className='absolute top-[-4px] left-[calc(50%-4px)] w-[8px] h-[8px] bg-white cursor-n-resize'></div>
      {children}
    </div>
  );
}
