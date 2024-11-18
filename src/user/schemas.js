import {z} from 'zod'

export const createUserSchema = z.object({
    username: z.string().min(3).max(100),
    age: z.number().int().min(0).max(150).optional(),
    role: z.string().default('user'),
    password: z.string().min(6).max(10000),
})

export const userSchema = z.object({
    id: z.number().int().min(1),
    username: z.string().min(3).max(100),
    age: z.number().int().min(0).max(150).optional(),
    password: z.never(),
    role: z.string() 
})

export const updateUserSchema = z.object({
    id: z.number().int().min(1),
    username: z.string().min(3).max(100),
    age: z.number().int().min(0).max(150).optional(),
})

export const loginUserSchema = z.object({
    username: z.string().min(3).max(100),
    password: z.string().min(6).max(10000)
})