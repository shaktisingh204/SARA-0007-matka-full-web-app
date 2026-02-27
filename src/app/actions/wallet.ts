'use server';

import { cookies } from 'next/headers';
import type { Transaction } from '@/lib/types';
import { revalidatePath } from 'next/cache';

type WalletDataResult = {
    success: boolean;
    data?: {
        balance: number;
        transactions: Transaction[];
    };
    error?: string;
};

type ActionState = {
    success?: boolean;
    error?: string;
};

export async function getWalletData(): Promise<WalletDataResult> {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
        return { success: false, error: 'User not authenticated.' };
    }

    try {
        const { verifyJwtToken } = await import('@/lib/jwt');
        const { default: connectToDatabase } = await import('@/lib/db');
        const { User, Transaction: TransactionModel } = await import('@/lib/models');

        const payload = await verifyJwtToken(token);
        if (!payload || !payload.userId) {
            return { success: false, error: 'Invalid or expired token.' };
        }

        await connectToDatabase();

        const userDoc = await User.findById(payload.userId);
        if (!userDoc) {
            return { success: false, error: 'User not found.' };
        }

        const txDocs = await TransactionModel.find({ userId: payload.userId })
            .sort({ createdAt: -1 })
            .limit(50); // Fetch latest 50 for wallet history

        const transactions: Transaction[] = txDocs.map((tx: any) => ({
            id: tx._id.toString(),
            date: tx.createdAt.toISOString(),
            description: tx.description,
            type: tx.type as 'credit' | 'debit',
            amount: tx.amount,
            balance: 0, // Computed balance is optional/hard based on history without absolute snapshot
        }));

        return {
            success: true,
            data: {
                balance: userDoc.wallet_balance,
                transactions,
            },
        };
    } catch (e) {
        console.error('Failed to get wallet data:', e);
        return { success: false, error: 'An unexpected error occurred.' };
    }
}

export async function requestDeposit(prevState: ActionState, formData: FormData): Promise<ActionState & { newBalance?: string }> {
    const amountStr = formData.get('amount') as string;
    const amount = parseFloat(amountStr);

    if (isNaN(amount) || amount <= 0) {
        return { error: 'Invalid deposit amount.' };
    }

    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) return { error: 'Not authenticated.' };

    try {
        const { verifyJwtToken } = await import('@/lib/jwt');
        const { default: connectToDatabase } = await import('@/lib/db');
        const { User, Transaction: TransactionModel } = await import('@/lib/models');

        const payload = await verifyJwtToken(token);
        if (!payload || !payload.userId) return { error: 'Invalid token.' };

        await connectToDatabase();

        // Create deposit transaction AND update user balance
        const updatedUser = await User.findByIdAndUpdate(payload.userId, {
            $inc: { wallet_balance: amount },
        }, { new: true });

        await TransactionModel.create({
            userId: payload.userId,
            type: 'credit',
            amount,
            description: 'Deposit',
            status: 'Approved',
        });

        revalidatePath('/wallet');
        return { success: true, newBalance: updatedUser?.wallet_balance.toString() };
    } catch (e) {
        console.error('Deposit Error:', e);
        return { error: 'An error occurred during deposit.' };
    }
}

export async function requestWithdrawal(prevState: ActionState, formData: FormData): Promise<ActionState & { newBalance?: string }> {
    const amountStr = formData.get('amount') as string;
    const amount = parseFloat(amountStr);

    if (isNaN(amount) || amount <= 0) {
        return { error: 'Invalid withdrawal amount.' };
    }

    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) return { error: 'Not authenticated.' };

    try {
        const { verifyJwtToken } = await import('@/lib/jwt');
        const { default: connectToDatabase } = await import('@/lib/db');
        const { User, Transaction: TransactionModel } = await import('@/lib/models');

        const payload = await verifyJwtToken(token);
        if (!payload || !payload.userId) return { error: 'Invalid token.' };

        await connectToDatabase();

        // Atomic check for sufficient balance
        const updatedUser = await User.findOneAndUpdate(
            { _id: payload.userId, wallet_balance: { $gte: amount } },
            { $inc: { wallet_balance: -amount } },
            { new: true }
        );

        if (!updatedUser) {
            return { error: 'Insufficient wallet balance.' };
        }

        await TransactionModel.create({
            userId: payload.userId,
            type: 'debit',
            amount,
            description: 'Withdrawal',
            status: 'Approved',
        });

        revalidatePath('/wallet');
        return { success: true, newBalance: updatedUser.wallet_balance.toString() };
    } catch (e) {
        console.error('Withdrawal Error:', e);
        return { error: 'An error occurred during withdrawal.' };
    }
}
