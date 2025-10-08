'use client';
import { games } from '@/lib/data';
import { notFound, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Loader2, CheckCircle } from 'lucide-react';
import { useFormState, useFormStatus } from 'react-dom';
import { submitBids } from '@/app/actions/bets';

const betTypes: { [key: string]: { name: string, description: string, minLength: number, maxLength: number, validation: (numStr: string) => boolean, validationMessage: string } } = {
    'ank': {
        name: 'Single (Ank)',
        description: 'Enter a single digit from 0-9',
        minLength: 1,
        maxLength: 1,
        validation: (numStr) => /^\d$/.test(numStr),
        validationMessage: 'Please enter a single digit (0-9).'
    },
    'jodi': { 
        name: 'Jodi', 
        description: 'Enter a two-digit number from 00-99', 
        minLength: 2, 
        maxLength: 2,
        validation: (numStr) => /^\d{2}$/.test(numStr),
        validationMessage: 'Please enter a two-digit number (00-99).'
    },
    'patti': {
        name: 'Patti / Panna',
        description: 'Enter a three-digit number from 000-999',
        minLength: 3,
        maxLength: 3,
        validation: (numStr) => /^\d{3}$/.test(numStr),
        validationMessage: 'Please enter a three-digit number (000-999).'
    },
    'single-patti': { 
        name: 'Single Patti', 
        description: 'Enter a unique three-digit number', 
        minLength: 3, 
        maxLength: 3,
        validation: (numStr) => {
            if (!/^\d{3}$/.test(numStr)) return false;
            const digits = numStr.split('');
            return new Set(digits).size === 3;
        },
        validationMessage: 'Please enter a 3-digit number with all unique digits.'
    },
    'double-patti': { 
        name: 'Double Patti', 
        description: 'Enter a three-digit number with two same digits', 
        minLength: 3, 
        maxLength: 3,
        validation: (numStr) => {
            if (!/^\d{3}$/.test(numStr)) return false;
            const digits = numStr.split('');
            return new Set(digits).size === 2;
        },
        validationMessage: 'Please enter a 3-digit number with exactly two same digits.'
    },
    'triple-patti': { 
        name: 'Triple Patti', 
        description: 'Enter a three-digit number with all same digits', 
        minLength: 3, 
        maxLength: 3,
        validation: (numStr) => {
            if (!/^\d{3}$/.test(numStr)) return false;
            return new Set(numStr.split('')).size === 1;
        },
        validationMessage: 'Please enter a 3-digit number with all same digits.'
    },
}

type Bid = {
    id: number;
    market: 'open' | 'close' | 'jodi';
    number: string;
    amount: string;
    betType: string;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
       {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
        </>
      ) : (
        'Submit All Bids'
      )}
    </Button>
  );
}


export default function PlaceBetPage() {
  const params = useParams();
  const { toast } = useToast();
  const { gameId, betType: betTypeParam } = params;

  const game = games.find((g) => g.id === gameId);
  const betTypeKey = typeof betTypeParam === 'string' ? betTypeParam : '';
  const betType = betTypes[betTypeKey];
  const isJodi = betTypeParam === 'jodi';

  const [market, setMarket] = useState<'open' | 'close'>('open');
  const [betNumber, setBetNumber] = useState('');
  const [betAmount, setBetAmount] = useState('');
  const [bids, setBids] = useState<Bid[]>([]);

  const initialState = { error: undefined, success: undefined };
  const [state, dispatch] = useFormState(submitBids, initialState);

  useEffect(() => {
    if (state.error) {
      toast({ title: 'Submission Error', description: state.error, variant: 'destructive' });
    }
    if (state.success) {
      toast({ title: 'Bids Submitted', description: `${bids.length} bids have been successfully placed.`,
        action: <CheckCircle className="h-5 w-5 text-green-500" />
      });
      setBids([]);
    }
  }, [state, toast, bids.length]);


  if (!game || !betType) {
    notFound();
  }
  
  const validateAndAddBid = () => {
    const amount = parseInt(betAmount, 10);

    // Basic validation
    if (!betNumber || !betAmount) {
        toast({ title: "Invalid Input", description: "Please enter a number and amount.", variant: "destructive" });
        return;
    }
    if (isNaN(amount) || amount <= 0) {
        toast({ title: "Invalid Amount", description: "Amount must be a positive number.", variant: "destructive" });
        return;
    }

    // Game rule validation
    if (!betType.validation(betNumber)) {
        toast({ title: "Invalid Number", description: betType.validationMessage, variant: "destructive" });
        return;
    }
    
    const newBid: Bid = {
        id: Date.now(),
        market: isJodi ? 'jodi' : market,
        number: betNumber.padStart(betType.minLength, '0'),
        amount: betAmount,
        betType: betTypeKey
    };

    setBids(prevBids => [...prevBids, newBid]);
    setBetNumber('');
    setBetAmount('');
  }

  const removeBid = (id: number) => {
    setBids(bids.filter(bid => bid.id !== id));
  }
  
  return (
    <div className="p-4 md:p-6 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">{game.name}</CardTitle>
          <CardDescription>Placing Bet: <span className="font-semibold">{betType.name}</span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           {!isJodi && (
             <div className="space-y-2">
                <Label>Market</Label>
                <RadioGroup value={market} onValueChange={(value: 'open' | 'close') => setMarket(value)} className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="open" id="open" />
                    <Label htmlFor="open">Open</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="close" id="close" />
                    <Label htmlFor="close">Close</Label>
                  </div>
                </RadioGroup>
            </div>
           )}
           <div>
            <Label htmlFor="bet-number">{betType.description}</Label>
            <Input 
                id="bet-number" 
                type="number" 
                placeholder="Enter number" 
                value={betNumber}
                onChange={(e) => setBetNumber(e.target.value)}
            />
           </div>
           <div>
            <Label htmlFor="bet-amount">Amount</Label>
            <Input 
                id="bet-amount" 
                type="number" 
                placeholder="Enter amount" 
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
            />
           </div>
        </CardContent>
        <CardFooter>
            <Button className="w-full" variant="outline" onClick={validateAndAddBid}>Add Bid</Button>
        </CardFooter>
      </Card>
      
      {bids.length > 0 && (
        <Card>
            <CardHeader>
                <CardTitle>Current Bids</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            {!isJodi && <TableHead>Market</TableHead>}
                            <TableHead>Number</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {bids.map(bid => (
                            <TableRow key={bid.id}>
                                {!isJodi && <TableCell className="capitalize">{bid.market}</TableCell>}
                                <TableCell className="font-mono">{bid.number}</TableCell>
                                <TableCell>₹{bid.amount}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" onClick={() => removeBid(bid.id)}>
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
            <CardFooter>
                <form action={dispatch} className="w-full">
                  <input type="hidden" name="bids" value={JSON.stringify(bids)} />
                  <SubmitButton />
                </form>
            </CardFooter>
        </Card>
      )}
    </div>
  );
}
