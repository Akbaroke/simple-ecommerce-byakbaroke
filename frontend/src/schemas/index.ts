import * as z from 'zod';

export const LoginSchema = z.object({
  email: z
    .string()
    .email({
      message: 'Email is not valid',
    })
    .max(255),
  password: z
    .string()
    .min(6, {
      message: 'Password must be at least 6 characters',
    })
    .max(255),
  code: z.optional(z.string().min(6, { message: 'Code must be 6 numbers' })),
});

export const RegisterSchema = z.object({
  email: z
    .string()
    .email({
      message: 'Email is not valid',
    })
    .max(255, {
      message: 'Email must be less than 255 characters',
    }),
  password: z
    .string()
    .min(8, {
      message: 'Password must be at least 8 characters long',
    })
    .max(255, {
      message: 'Password must be less than 255 characters',
    })
    .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
      message: 'Password must contain at least one letter and one number',
    }),
  name: z
    .string()
    .min(1, {
      message: 'Name is required',
    })
    .max(255, {
      message: 'Name must be less than 255 characters',
    }),
});

export const ResetSchema = z.object({
  email: z
    .string()
    .email({
      message: 'Email is not valid',
    })
    .max(255),
});

export const NewPasswordSchema = z.object({
  password: z
    .string()
    .min(8, {
      message: 'Password must be at least 8 characters long',
    })
    .max(255, {
      message: 'Password must be less than 255 characters',
    })
    .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
      message: 'Password must contain at least one letter and one number',
    }),
});

export const ProfileSchema = z.object({
  imgUrl: z.string(),
  name: z
    .string()
    .min(1, {
      message: 'Name is required',
    })
    .max(255, {
      message: 'Name must be less than 255 characters',
    }),
  address: z.string().max(255, {
    message: 'Address must be less than 255 characters',
  }),
  contact: z.string().max(15, {
    message: 'Contact must be less than 15 characters',
  }),
});

export const AdminSchema = z.object({
  imgUrl: z.string(),
  name: z
    .string()
    .min(1, {
      message: 'Name is required',
    })
    .max(255, {
      message: 'Name must be less than 255 characters',
    }),
  address: z
    .string()
    .max(255, {
      message: 'Address must be less than 255 characters',
    })
    .nullable(),
  contact: z
    .string()
    .max(15, {
      message: 'Contact must be less than 15 characters',
    })
    .nullable(),
  role: z.string(),
});


export const ProductSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: 'Name is required',
    })
    .max(255, {
      message: 'Name must be less than 255 characters',
    }),
  price: z.number().min(1, {
    message: 'Price is required',
  }),
  stock: z.number().min(1, {
    message: 'Stock is required',
  }),
  description: z
    .string()
    .min(1, {
      message: 'Description is required',
    })
    .max(1000, {
      message: 'Description must be less than 1000 characters',
    }),
  brand: z
    .string()
    .min(1, {
      message: 'Brand is required',
    })
    .max(255, {
      message: 'Brand must be less than 255 characters',
    }),
  image: z.string().min(1, {
    message: 'Image is required',
  }),
});