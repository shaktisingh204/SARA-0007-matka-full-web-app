'use client';

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
import { DollarSign, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function WalletForms() {
  const { toast } = useToast();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>, type: 'Deposit' | 'Withdrawal') => {
    event.preventDefault();
    const amount = event.currentTarget.amount.value;
    if (amount) {
      toast({
        title: `${type} Successful`,
        description: `₹${amount} has been processed.`,
      });
      event.currentTarget.reset();
    }
  }

  return (
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
            <p className="font-headline text-5xl font-bold tracking-tighter">₹1,250.75</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Last Transaction</p>
            <p className="text-lg font-medium">+ ₹500.00 (Deposit)</p>
          </div>
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
            <form onSubmit={(e) => handleSubmit(e, 'Deposit')}>
              <CardHeader>
                <CardTitle>Deposit Funds</CardTitle>
                <CardDescription>
                  Add funds to your wallet to start playing.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="amount">Amount</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input id="amount" name="amount" type="number" placeholder="0.00" className="pl-8" required />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Deposit</Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        <TabsContent value="withdrawal">
          <Card>
            <form onSubmit={(e) => handleSubmit(e, 'Withdrawal')}>
              <CardHeader>
                <CardTitle>Withdraw Winnings</CardTitle>
                <CardDescription>
                  Transfer your winnings to your bank account.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="amount">Amount</Label>
                   <div className="relative">
                    <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input id="amount" name="amount" type="number" placeholder="0.00" className="pl-8" required />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Withdraw</Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
