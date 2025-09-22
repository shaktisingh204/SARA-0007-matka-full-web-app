// src/app/actions/app-details.ts
'use server';

import { cookies } from 'next/headers';

type AppDetails = {
  id: string;
  app_name: string;
  version_code: string;
  app_link: string;
  whatsapp_no: string;
  mobile_no: string;
  upi_id: string;
  add_fund_text: string;
  withdraw_fund_text: string;
};

type ApiResult = {
  success: boolean;
  data?: AppDetails;
  error?: string;
};

/**
 * Fetches the application details from the API.
 * @returns A promise that resolves to an object with success status and data or error.
 */
export async function getAppDetails(): Promise<ApiResult> {
  const API_BASE_URL = process.env.API_BASE_URL;

  if (!API_BASE_URL) {
    console.error('API_BASE_URL environment variable is not set.');
    return { success: false, error: 'API endpoint is not configured.' };
  }

  // Fallback for restricted development environment
  if (API_BASE_URL.startsWith('https://gurumatka.matkadash.in')) {
    console.log('Using mock app details response due to network restrictions.');
    return {
      success: true,
      data: {
        id: '1',
        app_name: 'MatkaCalc',
        version_code: '1.0',
        app_link: 'http://example.com',
        whatsapp_no: '+911234567890',
        mobile_no: '+910987654321',
        upi_id: 'mock@upi',
        add_fund_text: 'Add funds easily.',
        withdraw_fund_text: 'Withdraw your winnings.',
      },
    };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/app_details`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
       body: new URLSearchParams({ string: " " }),
    });

    const data = await response.json();

    if (response.ok && data && data.data) {
      return { success: true, data: data.data };
    } else {
      return { success: false, error: data.message || 'Failed to fetch app details.' };
    }
  } catch (e) {
    console.error('Failed to fetch app details from API:', e);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}
