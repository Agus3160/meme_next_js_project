import { ApiResponse } from "../definitions"
import { NextResponse } from "next/server"

const generateApiErrorResponse = (error:string, statusCode: number) => {
  return NextResponse.json({ error: error, success: false }, { status: statusCode })
}

const generateApiSuccessResponse = <T>(message:string, statusCode: number, data?: T) => {
  return NextResponse.json({ data, message, success: true }, { status: statusCode })
}

const fetchPlus = async <T=undefined>(url: string, options?: RequestInit) => { 
  try{
  //Get the response
  const res = await fetch(url, options)

  //If the error is not ok, return the error and the message of error
  if(!res.ok){
    const dataError:ApiResponse = await res.json()
    return {error: dataError.error, success: false}
  }

  //If the response is ok, return the data
  const data:ApiResponse<T> = await res.json()
  return {data: data.data, success: true, message: data.message}

  }catch(e){
    if(e instanceof Error) return {error: e.message, success: false}
    return {error: "Error al obtener la respuesta", success: false} 
  }
}

export {generateApiErrorResponse, generateApiSuccessResponse, fetchPlus}