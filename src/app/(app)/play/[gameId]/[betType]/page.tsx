
'use client';
import { games } from '@/lib/data';
import { notFound, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2 } from 'lucide-react';

const betTypes: { [key: string]: { name: string, description: string, min: number, max: number, minLength: number, maxLength: number } } = {
    'single': { name: 'Single Digit', description: 'Enter a single digit from 0-9', min: 0, max: 9, minLength: 1, maxLength: 1 },
    'jodi': { name: 'Jodi', description: 'Enter a two-digit number from 00-99', min: 0, max: 99, minLength: 2, maxLength: 2 },
    'patti': { name: 'Patti / Panna', description: 'Enter a three-digit number from 000-999', min: 0, max: 999, minLength: 3, maxLength: 3 },
}

type Bid = {
    id: number;
    market: 'open' | 'close' | 'jodi';
    number: string;
    amount: string;
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

  if (!game || !betType) {
    notFound();
  }
  
  const validateAndAddBid = () => {
    const num = parseInt(betNumber, 10);
    const amount = parseInt(betAmount, 10);

    // Basic validation
    if (isNaN(num) || isNaN(amount)) {
        toast({ title: "Invalid Input", description: "Please enter a valid number and amount.", variant: "destructive" });
        return;
    }
    if (amount <= 0) {
        toast({ title: "Invalid Amount", description: "Amount must be greater than zero.", variant: "destructive" });
        return;
    }

    // Game rule validation
    if (betNumber.length > betType.maxLength) {
        toast({ title: "Invalid Number", description: `Number cannot be more than ${betType.maxLength} digits for ${betType.name}.`, variant: "destructive" });
        return;
    }
     if (num < betType.min || num > betType.max) {
        toast({ title: "Invalid Number", description: `Please enter a valid ${betType.name} (${betType.description}).`, variant: "destructive" });
        return;
    }
    
    const newBid: Bid = {
        id: Date.now(),
        market: isJodi ? 'jodi' : market,
        number: betNumber.padStart(betType.minLength, '0'),
        amount: betAmount
    };

    setBids(prevBids => [...prevBids, newBid]);
    setBetNumber('');
    setBetAmount('');
  }

  const removeBid = (id: number) => {
    setBids(bids.filter(bid => bid.id !== id));
  }
  
  const submitAllBids = () => {
      if (bids.length === 0) {
          toast({ title: "No Bids", description: "Please add at least one bid to submit.", variant: "destructive"});
          return;
      }
      toast({ title: "Bids Submitted", description: `${bids.length} bids have been successfully placed.`});
      setBids([]);
  }


  return (
    <div className="p-4 space-y-4">
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
                minLength={betType.minLength}
                maxLength={betType.maxLength}
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
                <Button className="w-full" onClick={submitAllBids}>Submit All Bids</Button>
            </CardFooter>
        </Card>
      )}
    </div>
  );
}
