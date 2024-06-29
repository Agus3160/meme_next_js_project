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

export type ApiResponse<T=undefined> = {
  data?: T,
  error?: string
  message?: string
  success: boolean
}