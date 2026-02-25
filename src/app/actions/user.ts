
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
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    return { success: false, error: 'User not authenticated.' };
  }

  try {
    const { verifyJwtToken } = await import('@/lib/jwt');
    const { default: connectToDatabase } = await import('@/lib/db');
    const { User } = await import('@/lib/models');

    const payload = await verifyJwtToken(token);

    if (!payload || !payload.userId) {
      return { success: false, error: 'Invalid or expired token.' };
    }

    await connectToDatabase();

    const userDoc = await User.findById(payload.userId);

    if (!userDoc) {
      return { success: false, error: 'User not found in database.' };
    }

    return {
      success: true,
      data: {
        id: userDoc._id.toString(),
        name: userDoc.full_name,
        mobile: userDoc.mobile,
        wallet_balance: userDoc.wallet_balance.toString(),
        bank_details_status: userDoc.bank_details_status,
        gpay_status: userDoc.gpay_status,
        phonepe_status: userDoc.phonepe_status,
        paytm_status: userDoc.paytm_status,
      }
    };
  } catch (e) {
    console.error('Failed to fetch user details from DB:', e);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

