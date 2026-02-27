'use client';

import { useActionState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IndianRupee, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { Transaction } from '@/lib/types';
import { requestDeposit, requestWithdrawal } from '@/app/actions/wallet';
import { useUserProfileStore } from '@/lib/store';

export function WalletForms({ initialBalance, transactions }: { initialBalance: number, transactions: Transaction[] }) {
  const { toast } = useToast();
  const updateBalance = useUserProfileStore((state) => state.updateBalance);
  const [depositState, depositAction, isDepositing] = useActionState(requestDeposit, {});
  const [withdrawalState, withdrawalAction, isWithdrawing] = useActionState(requestWithdrawal, {});

  const depositFormRef = useRef<HTMLFormElement>(null);
  const withdrawalFormRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (depositState.success) {
      toast({
        title: 'Deposit Successful',
        description: 'Your deposit has been processed.',
      });
      if (depositState.newBalance) updateBalance(depositState.newBalance);
      depositFormRef.current?.reset();
    } else if (depositState.error) {
      toast({
        title: 'Deposit Failed',
        description: depositState.error,
        variant: 'destructive',
      });
    }
  }, [depositState, toast]);

  useEffect(() => {
    if (withdrawalState.success) {
      toast({
        title: 'Withdrawal Successful',
        description: 'Your withdrawal has been processed.',
      });
      if (withdrawalState.newBalance) updateBalance(withdrawalState.newBalance);
      withdrawalFormRef.current?.reset();
    } else if (withdrawalState.error) {
      toast({
        title: 'Withdrawal Failed',
        description: withdrawalState.error,
        variant: 'destructive',
      });
    }
  }, [withdrawalState, toast]);

  const lastTx = transactions[0];

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="flex flex-col justify-center">
          <CardHeader>
            <CardTitle className="font-headline">Your Wallet</CardTitle>
            <CardDescription>
              Your current balance and transaction history.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Current Balance</p>
              <p className="font-headline text-5xl font-bold tracking-tighter">₹{initialBalance.toFixed(2)}</p>
            </div>
            {lastTx && (
              <div>
                <p className="text-sm text-muted-foreground">Last Transaction</p>
                <p className="text-lg font-medium">
                  {lastTx.type === 'credit' ? '+' : '-'} ₹{lastTx.amount.toFixed(2)} ({lastTx.description})
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Tabs defaultValue="deposit" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="deposit">
              <ArrowDownCircle className="mr-2 h-4 w-4" /> Deposit
            </TabsTrigger>
            <TabsTrigger value="withdrawal">
              <ArrowUpCircle className="mr-2 h-4 w-4" /> Withdraw
            </TabsTrigger>
          </TabsList>
          <TabsContent value="deposit">
            <Card>
              <form ref={depositFormRef} action={depositAction}>
                <CardHeader>
                  <CardTitle>Deposit Funds</CardTitle>
                  <CardDescription>
                    Add funds to your wallet to start playing.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="deposit-amount">Amount</Label>
                    <div className="relative">
                      <IndianRupee className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input id="deposit-amount" name="amount" type="number" placeholder="0.00" className="pl-8" required min="1" step="any" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isDepositing}>
                    {isDepositing ? 'Processing...' : 'Deposit'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          <TabsContent value="withdrawal">
            <Card>
              <form ref={withdrawalFormRef} action={withdrawalAction}>
                <CardHeader>
                  <CardTitle>Withdraw Winnings</CardTitle>
                  <CardDescription>
                    Transfer your winnings to your bank account.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="withdrawal-amount">Amount</Label>
                    <div className="relative">
                      <IndianRupee className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input id="withdrawal-amount" name="amount" type="number" placeholder="0.00" className="pl-8" required min="1" step="any" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isWithdrawing}>
                    {isWithdrawing ? 'Processing...' : 'Withdraw'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No transactions found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{format(new Date(transaction.date), 'dd MMM, yyyy')}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell
                      className={cn(
                        'text-right font-semibold',
                        transaction.type === 'credit' ? 'text-green-600' : 'text-destructive'
                      )}
                    >
                      {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
