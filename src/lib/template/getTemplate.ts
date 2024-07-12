import { ApiResponse } from "../definitions";

const getTemplate = async (templateId: string) => {

  try {
    const res = await fetch(`/api/template/${templateId}`, {
      method: 'GET',
    })

    if(!res.ok) {
      const data:ApiResponse = await res.json()
      return data.error
    }

    const data = await res.blob(); // Get image data as Buffer
    return data
  } catch (e) {
    console.error(e)
  }
}

export {
  getTemplate
}

