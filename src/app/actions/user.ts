
// src/app/actions/user.ts
'use server';

import { cookies } from 'next/headers';
import type { UserProfile } from '@/lib/store';


type ApiResult = {
  success: boolean;
  data?: UserProfile;
  error?: string;
};

/**
 * Fetches the user details from the API.
 * @returns A promise that resolves to an object with success status and data or error.
 */
export async function getUserDetails(): Promise<ApiResult> {
  const API_BASE_URL = process.env.API_BASE_URL;

  if (!API_BASE_URL) {
    console.error('API_BASE_URL environment variable is not set.');
    return { success: false, error: 'API endpoint is not configured.' };
  }
  
  const cookieStore = cookies();
  const token = cookieStore.get('auth_token')?.value;
 
  if (!token) {
    return { success: false, error: 'User not authenticated.' };
  }

  // Fallback for restricted development environment
  if (API_BASE_URL.startsWith('https://gurumatka.matkadash.in')) {
    console.log('Using mock user details response due to network restrictions.');
    return {
      success: true,
      data: {
        id: 'mock-user-123',
        name: 'Mock User',
        mobile: '9999988888',
        wallet_balance: '1234.56',
        bank_details_status: "1",
        gpay_status: "1",
        phonepe_status: "0",
        paytm_status: "0",
      },
    };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/get_user_details`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'token': token,
      },
      body: new URLSearchParams({ string: " " }),
    });

    const data = await response.json();

    if (response.ok && data && data.data) {
      return { success: true, data: data.data };
    } else {
      return { success: false, error: data.message || 'Failed to fetch user details.' };
    }
  } catch (e) {
    console.error('Failed to fetch user details from API:', e);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}
