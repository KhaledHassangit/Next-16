import { z } from 'zod'

// Login form validation schema
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(1, { message: 'Password is required' })
    .min(8, { message: 'Password must be at least 8 characters' })
})

// Register form validation schema
export const registerSchema = z.object({
  username: z
    .string()
    .min(1, { message: 'Username is required' })
    .min(3, { message: 'Username must be at least 3 characters' })
    .max(50, { message: 'Username must be less than 50 characters' })
    .regex(/^[a-zA-Z0-9_ ]+$/, { 
      message: 'Username can only contain letters, numbers, spaces, and underscores' 
    }),
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(1, { message: 'Password is required' })
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/, { 
      message: 'Password must contain at least one letter and one number. Special characters like @, $, !, %, *, ?, & are allowed' 
    }),
  confirmPassword: z
    .string()
    .min(1, { message: 'Please confirm your password' })
})
.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>


// Contact Validation

export const contactFormSchema = z.object({
  firstName: z.string().min(2, { message: 'First name must be at least 2 characters' }),
  lastName: z.string().min(2, { message: 'Last name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z.string().optional(),
  inquiryType: z.string().min(1, { message: 'Please select an inquiry type' }),
  message: z.string().min(5, { message: 'Message must be at least 5 characters' }),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export const validateContactForm = (data: unknown) => {
  return contactFormSchema.safeParse(data);
};