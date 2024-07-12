import z from 'zod'

//SIGNUP UP ZOD SCHEMA
export const signUpSchema = z.object({
  username: z.string().min(8, { message: 'Username must be at least 8 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  name: z.string().min(1, { message: 'Name is required' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
});
export type TypeSignUpSchema = z.infer<typeof signUpSchema>;

//SIGNIN ZOD SCHEMA
export const signInSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
})
export type TypeSignInSchema = z.infer<typeof signInSchema>;

//TEXTBOX ZOD SCHEMA
export const textBoxSchema = z.object({
  text: z.string().min(1, { message: 'Text is required' }),
  fontFamily: z.string().min(1, { message: 'Font family is required' }),
  fontSize: z.number().min(1, { message: 'Font size must be at least 1' }).max(128, { message: 'Font size must be at most 128' }),
  textColor: z.string().min(1, { message: 'Font color is required' }),
  borderColor: z.string().min(1, { message: 'Border color is required' }),
  rotate: z.number().min(-180, { message: 'Rotate must be between -180 and 180' }).max(180, { message: 'Rotate must be between 0 and 360' }),
})
export type TypeTextBoxSchema = z.infer<typeof textBoxSchema>

//POST ZOD SCHEMA
export const postSchema = z.object({
  title: z.string().min(1, { message: 'A title is required' }),
  templateId: z.string().min(1, { message: 'A template is required' }),
  base64Images: z.array(z.string().min(1, { message: 'Image string cannot be empty' }))
    .length(2, { message: 'You must upload exactly two images' }),
  textBoxArray: z.array(textBoxSchema).min(1, { message: 'You must use at least one text box' }),
})
export type TypePostSchema = z.infer<typeof postSchema>

//TEMPLATE ZOD SCHEMA
export const templateSchema = z.object({
  name: z.string().min(1, { message: 'A name is required' }),
  desc: z.string().min(1, { message: 'A description is required' }),
  base64Images: z.array(z.string().min(1, { message: 'Image string cannot be empty' }))
    .length(2, { message: 'You must upload exactly two images' }),
  contentType: z.string().min(1, { message: 'Content type cannot be empty' }),
});

export type TypeTemplateSchema = z.infer<typeof templateSchema>;


//IMAGE ZOD SCHEMA
export const imageSchema = z.object({
  urlOriginalImg: z.string().min(1, { message: 'An url of the image is required' }),
  urlBlurImg: z.string().min(1, { message: 'An url of blur version of the image is required' }),
  pathOriginalImg: z.string().min(1, { message: 'An path of the image is required' }),
  pathBlurImg: z.string().min(1, { message: 'An path of blur version of the image is required' }),
})
export type TypeImageSchema = z.infer<typeof imageSchema>

//API RESPONSE
export type ApiResponse<T=undefined> = {
  data?: T,
  error?: string
  message?: string
  success: boolean
}

//FILTER DATA
export type FilterData<T> = {
  data: T[]
  count: number
}

export type UserFilter = {
  email?:string
  username?:string
  name?:string
  createdAt?:{
    gte?:Date
    lte?:Date
  }
  updatedAt?:{
    gte?:Date
    lte?:Date
  }
  id?:string
  quantity?:number
  skip?:number
}