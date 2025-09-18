'use server';

import { z } from 'zod';

const betSchema = z.object({
  id: z.number(),
  market: z.enum(['open', 'close', 'jodi']),
  number: z.string(),
  amount: z.string(),
  betType: z.string(),
});

const halfSangamBetSchema = z.object({
  id: z.number(),
  openPatti: z.string().regex(/^\d{3}$/, "Invalid Open Patti"),
  closeJodi: z.string().regex(/^\d{2}$/, "Invalid Close Jodi"),
  amount: z.string().regex(/^[1-9]\d*$/, "Invalid amount"),
});

const fullSangamBetSchema = z.object({
  id: z.number(),
  openPatti: z.string().regex(/^\d{3}$/, "Invalid Open Patti"),
  closePatti: z.string().regex(/^\d{3}$/, "Invalid Close Patti"),
  amount: z.string().regex(/^[1-9]\d*$/, "Invalid amount"),
});

const betTypeValidations: { [key: string]: (numStr: string) => boolean } = {
    'ank': (numStr) => /^\d$/.test(numStr),
    'jodi': (numStr) => /^\d{2}$/.test(numStr),
    'patti': (numStr) => /^\d{3}$/.test(numStr),
    'single-patti': (numStr) => /^\d{3}$/.test(numStr) && new Set(numStr.split('')).size === 3,
    'double-patti': (numStr) => /^\d{3}$/.test(numStr) && new Set(numStr.split('')).size === 2,
    'triple-patti': (numStr) => /^\d{3}$/.test(numStr) && new Set(numStr.split('')).size === 1,
};

type SubmitBetsState = {
  success?: boolean;
  error?: string;
}

export async function submitBids(
  prevState: SubmitBetsState,
  formData: FormData
): Promise<SubmitBetsState> {
  const bidsJson = formData.get('bids') as string;
  if (!bidsJson) {
    return { error: 'No bids provided.' };
  }
  
  try {
    const bids = JSON.parse(bidsJson);
    const validatedBids = z.array(betSchema).safeParse(bids);

    if (!validatedBids.success) {
      return { error: 'Invalid bid format.' };
    }

    for (const bid of validatedBids.data) {
      const isValidAmount = /^[1-9]\d*$/.test(bid.amount);
      if (!isValidAmount) {
        return { error: `Invalid amount for number ${bid.number}.` };
      }
      
      const validationFn = betTypeValidations[bid.betType];
      if (!validationFn || !validationFn(bid.number)) {
          return { error: `Invalid number ${bid.number} for the selected bet type.`};
      }
    }
    
    // In a real app, you would save the bids to a database here.
    console.log('Successfully validated bids:', validatedBids.data);
    return { success: true };

  } catch (e) {
    return { error: 'An unexpected error occurred.' };
  }
}

export async function submitHalfSangamBids(
  prevState: SubmitBetsState,
  formData: FormData
): Promise<SubmitBetsState> {
  const bidsJson = formData.get('bids') as string;
  if (!bidsJson) {
    return { error: 'No bids provided.' };
  }

  try {
    const bids = JSON.parse(bidsJson);
    const validatedBids = z.array(halfSangamBetSchema).safeParse(bids);

    if (!validatedBids.success) {
      return { error: 'Invalid bid format.' };
    }

    // In a real app, you would save the bids to a database here.
    console.log('Successfully validated Half Sangam bids:', validatedBids.data);
    return { success: true };
  } catch (e) {
    return { error: 'An unexpected error occurred.' };
  }
}

export async function submitFullSangamBids(
  prevState: SubmitBetsState,
  formData: FormData
): Promise<SubmitBetsState> {
  const bidsJson = formData.get('bids') as string;
  if (!bidsJson) {
    return { error: 'No bids provided.' };
  }

  try {
    const bids = JSON.parse(bidsJson);
    const validatedBids = z.array(fullSangamBetSchema).safeParse(bids);

    if (!validatedBids.success) {
      return { error: 'Invalid bid format.' };
    }

    // In a real app, you would save the bids to a database here.
    console.log('Successfully validated Full Sangam bids:', validatedBids.data);
    return { success: true };
  } catch (e) {
    return { error: 'An unexpected error occurred.' };
  }
}
