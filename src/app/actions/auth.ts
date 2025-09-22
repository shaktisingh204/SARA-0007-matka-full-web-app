
'use server';

import { z } from 'zod';

const API_BASE_URL = process.env.API_BASE_URL;

const signupSchema = z.object({
  full_name: z.string().min(1),
  mobile: z.string().min(10),
  password: z.string().min(6),
  pin: z.string().length(4),
});

const loginSchema = z.object({
  mobile: z.string().min(10),
  password: z.string().min(1),
});

export async function signupUser(values: z.infer<typeof signupSchema>) {
  const validatedFields = signupSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid fields.' };
  }

  if (!API_BASE_URL) {
    return { error: 'API endpoint is not configured.' };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(validatedFields.data),
    });

    const data = await response.json();

    if (data.status === 'success') {
      return { success: data.message };
    } else {
      return { error: data.message || 'Signup failed.' };
    }
  } catch (error) {
    console.error('Signup Error:', error);
    return { error: 'An unexpected error occurred.' };
  }
}

export async function loginUser(values: z.infer<typeof loginSchema>) {
  const validatedFields = loginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid fields.' };
  }
  
  if (!API_BASE_URL) {
    return { error: 'API endpoint is not configured.' };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(validatedFields.data),
    });

    const data = await response.json();

    if (data.status === 'success' && data.token) {
        return { success: data.message, token: data.token };
    } else {
        return { error: data.message || 'Login failed.' };
    }
  } catch (error) {
      console.error('Login Error:', error);
      return { error: 'An unexpected error occurred.' };
  }
}
