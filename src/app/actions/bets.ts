'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';
import {
  VALID_ANK,
  VALID_JODI,
  VALID_SINGLE_PATTI,
  VALID_DOUBLE_PATTI,
  VALID_TRIPLE_PATTI,
  ALL_VALID_PATTIS
} from '@/lib/matka-rules';

const betSchema = z.object({
  id: z.number(),
  market: z.enum(['open', 'close', 'jodi']),
  number: z.string(),
  amount: z.string(),
  betType: z.string(),
});

const halfSangamBetSchema = z.object({
  id: z.number(),
  openNumber: z.string(),
  closeNumber: z.string(),
  amount: z.string().regex(/^[1-9]\d*$/, "Invalid amount"),
}).refine(data => {
  const isOpenPatti = ALL_VALID_PATTIS.has(data.openNumber);
  const isCloseAnk = VALID_ANK.has(data.closeNumber);
  const isOpenAnk = VALID_ANK.has(data.openNumber);
  const isClosePatti = ALL_VALID_PATTIS.has(data.closeNumber);
  return (isOpenPatti && isCloseAnk) || (isOpenAnk && isClosePatti);
}, "Invalid Half Sangam combination. Must be Open Patti + Close Ank OR Open Ank + Close Patti.");

const fullSangamBetSchema = z.object({
  id: z.number(),
  openPatti: z.string().refine(val => ALL_VALID_PATTIS.has(val), "Invalid Open Patti"),
  closePatti: z.string().refine(val => ALL_VALID_PATTIS.has(val), "Invalid Close Patti"),
  amount: z.string().regex(/^[1-9]\d*$/, "Invalid amount"),
});

const betTypeValidations: { [key: string]: (numStr: string) => boolean } = {
  'ank': (numStr) => VALID_ANK.has(numStr),
  'jodi': (numStr) => VALID_JODI.has(numStr),
  'patti': (numStr) => ALL_VALID_PATTIS.has(numStr),
  'single-patti': (numStr) => VALID_SINGLE_PATTI.has(numStr),
  'double-patti': (numStr) => VALID_DOUBLE_PATTI.has(numStr),
  'triple-patti': (numStr) => VALID_TRIPLE_PATTI.has(numStr),
};

type SubmitBetsState = {
  success?: boolean;
  error?: string;
}

async function processTransaction(bids: any[], totalAmount: number, gameName: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) return { error: 'Not authenticated. Please log in.' };

  // Dynamic imports structure like in other actions
  const { verifyJwtToken } = await import('@/lib/jwt');
  const { default: connectToDatabase } = await import('@/lib/db');
  const { User, Bid: BidModel } = await import('@/lib/models');

  const payload = await verifyJwtToken(token);
  if (!payload || !payload.userId) return { error: 'Invalid or expired authentication token.' };

  await connectToDatabase();

  // Atomic check and deduct to prevent race conditions during betting
  const user = await User.findOneAndUpdate(
    { _id: payload.userId, wallet_balance: { $gte: totalAmount } },
    { $inc: { wallet_balance: -totalAmount } },
    { new: true }
  );

  if (!user) {
    return { error: 'Insufficient wallet balance to place these bids.' };
  }

  // Insert Bids
  const records = bids.map(b => ({
    ...b,
    userId: payload.userId,
    gameName: gameName,
    status: 'Pending'
  }));
  await BidModel.insertMany(records);

  return { success: true };
}

export async function submitBids(
  prevState: SubmitBetsState,
  formData: FormData
): Promise<SubmitBetsState> {
  const bidsJson = formData.get('bids') as string;
  const gameName = formData.get('gameName') as string || 'Unknown Game';
  if (!bidsJson) {
    return { error: 'No bids provided.' };
  }

  try {
    const bids = JSON.parse(bidsJson);
    const validatedBids = z.array(betSchema).safeParse(bids);

    if (!validatedBids.success) {
      return { error: 'Invalid bid format.' };
    }

    let totalAmount = 0;
    const records = [];

    for (const bid of validatedBids.data) {
      const isValidAmount = /^[1-9]\d*$/.test(bid.amount);
      if (!isValidAmount) {
        return { error: `Invalid amount for number ${bid.number}.` };
      }

      const validationFn = betTypeValidations[bid.betType];
      if (!validationFn || !validationFn(bid.number)) {
        return { error: `Invalid number ${bid.number} for the selected bet type.` };
      }

      const amt = parseInt(bid.amount, 10);
      totalAmount += amt;
      records.push({
        betType: bid.betType,
        market: bid.market,
        number: bid.number,
        amount: amt
      });
    }

    const txResult = await processTransaction(records, totalAmount, gameName);
    if (txResult.error) return { error: txResult.error };

    return { success: true };

  } catch (e) {
    console.error('Submit Bids Error:', e);
    return { error: 'An unexpected error occurred.' };
  }
}

export async function submitHalfSangamBids(
  prevState: SubmitBetsState,
  formData: FormData
): Promise<SubmitBetsState> {
  const bidsJson = formData.get('bids') as string;
  const gameName = formData.get('gameName') as string || 'Unknown Game';
  if (!bidsJson) {
    return { error: 'No bids provided.' };
  }

  try {
    const bids = JSON.parse(bidsJson);
    const validatedBids = z.array(halfSangamBetSchema).safeParse(bids);

    if (!validatedBids.success) {
      return { error: 'Invalid bid format.' };
    }

    let totalAmount = 0;
    const records = [];

    for (const bid of validatedBids.data) {
      const amt = parseInt(bid.amount, 10);
      totalAmount += amt;
      records.push({
        betType: 'half-sangam',
        market: 'sangam',
        number: `${bid.openNumber}-${bid.closeNumber}`,
        amount: amt
      });
    }

    const txResult = await processTransaction(records, totalAmount, gameName);
    if (txResult.error) return { error: txResult.error };

    return { success: true };
  } catch (e) {
    console.error('Submit Half Sangam Error:', e);
    return { error: 'An unexpected error occurred.' };
  }
}

export async function submitFullSangamBids(
  prevState: SubmitBetsState,
  formData: FormData
): Promise<SubmitBetsState> {
  const bidsJson = formData.get('bids') as string;
  const gameName = formData.get('gameName') as string || 'Unknown Game';
  if (!bidsJson) {
    return { error: 'No bids provided.' };
  }

  try {
    const bids = JSON.parse(bidsJson);
    const validatedBids = z.array(fullSangamBetSchema).safeParse(bids);

    if (!validatedBids.success) {
      return { error: 'Invalid bid format.' };
    }

    let totalAmount = 0;
    const records = [];

    for (const bid of validatedBids.data) {
      const amt = parseInt(bid.amount, 10);
      totalAmount += amt;
      records.push({
        betType: 'full-sangam',
        market: 'sangam',
        number: `${bid.openPatti}-${bid.closePatti}`,
        amount: amt
      });
    }

    const txResult = await processTransaction(records, totalAmount, gameName);
    if (txResult.error) return { error: txResult.error };

    return { success: true };
  } catch (e) {
    console.error('Submit Full Sangam Error:', e);
    return { error: 'An unexpected error occurred.' };
  }
}
