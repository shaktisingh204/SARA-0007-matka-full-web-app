
'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';

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

  try {
    const { default: connectToDatabase } = await import('@/lib/db');
    const { User } = await import('@/lib/models');
    const bcrypt = (await import('bcryptjs')).default;

    await connectToDatabase();

    const existingUser = await User.findOne({ mobile: validatedFields.data.mobile });
    if (existingUser) {
      return { error: 'A user with this mobile number already exists.' };
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(validatedFields.data.password, salt);

    const newUser = new User({
      full_name: validatedFields.data.full_name,
      mobile: validatedFields.data.mobile,
      password: hashedPassword,
      pin: validatedFields.data.pin,
    });

    await newUser.save();
    return { success: 'Signup successful. You can now log in.' };
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

  try {
    const { default: connectToDatabase } = await import('@/lib/db');
    const { User } = await import('@/lib/models');
    const bcrypt = (await import('bcryptjs')).default;
    const { signJwtToken } = await import('@/lib/jwt');

    await connectToDatabase();

    const user = await User.findOne({ mobile: validatedFields.data.mobile });
    if (!user || (!user.password && !user.pin)) {
      return { error: 'Invalid mobile number or password.' };
    }

    const isPasswordValid = await bcrypt.compare(validatedFields.data.password, user.password || "");
    const isValid = isPasswordValid || (validatedFields.data.password === user.pin);

    if (!isValid) {
      return { error: 'Invalid mobile number or password.' };
    }

    const token = await signJwtToken({ userId: user._id.toString(), mobile: user.mobile });

    const cookieStore = await cookies();
    cookieStore.set('auth_token', token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return { success: 'Login successful!', token: token };
  } catch (error) {
    console.error('Login Error:', error);
    return { error: 'An unexpected error occurred.' };
  }
}


export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('auth_token');
  return { success: true };
}
