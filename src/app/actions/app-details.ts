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
  try {
    const { default: connectToDatabase } = await import('@/lib/db');
    const { AppDetails } = await import('@/lib/models');

    await connectToDatabase();

    let details = await AppDetails.findOne();

    if (!details) {
      // Seed default details if none exist
      details = await AppDetails.create({
        app_name: 'MatkaCalc',
        version_code: '1.0',
        app_link: 'http://example.com',
        whatsapp_no: '+911234567890',
        mobile_no: '+910987654321',
        upi_id: 'mock@upi',
        add_fund_text: 'Add funds easily.',
        withdraw_fund_text: 'Withdraw your winnings.',
      });
    }

    return {
      success: true,
      data: {
        id: details._id.toString(),
        app_name: details.app_name,
        version_code: details.version_code,
        app_link: details.app_link,
        whatsapp_no: details.whatsapp_no,
        mobile_no: details.mobile_no,
        upi_id: details.upi_id,
        add_fund_text: details.add_fund_text,
        withdraw_fund_text: details.withdraw_fund_text,
      }
    };
  } catch (e) {
    console.error('Failed to fetch app details from DB:', e);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}
