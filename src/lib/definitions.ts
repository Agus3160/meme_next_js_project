import z from 'zod'

export const signUpSchema = z.object({
  username: z.string().min(8, { message: 'Username must be at least 8 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  name: z.string().min(1, { message: 'Name is required' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
});
export type TypeSignUpSchema = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
})
export type TypeSignInSchema = z.infer<typeof signInSchema>;

export const textBoxSchema = z.object({
  text: z.string().min(1, { message: 'Text is required' }),
  fontFamily: z.string(),
  fontSize: z.number(),
  textColor: z.string(),
  borderColor: z.string(),
  rotate: z.number().min(0, { message: 'Rotate must be between 0 and 360' }).max(360, { message: 'Rotate must be between 0 and 360' }),
})

export const postSchema = z.object({
  title: z.string().min(1, { message: 'A title is required' }),
  textBoxArray: z.array(textBoxSchema).nonempty({ message: 'At least one text box is required' }),
})

export type TypePostSchema = z.infer<typeof postSchema>

export type TypeTextBoxSchema = z.infer<typeof textBoxSchema>

export type ApiResponse<T=undefined> = {
  data?: T,
  error?: string
  message?: string
  success: boolean
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