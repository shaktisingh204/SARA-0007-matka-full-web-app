
'use client';
import { games } from '@/lib/data';
import { notFound, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const betTypes: { [key: string]: { name: string, description: string } } = {
    'single': { name: 'Single Digit', description: 'Enter a single digit from 0-9' },
    'jodi': { name: 'Jodi', description: 'Enter a two-digit number from 00-99' },
    'patti': { name: 'Patti / Panna', description: 'Enter a three-digit number from 000-999' },
}

export default function PlaceBetPage() {
  const params = useParams();
  const { gameId, betType: betTypeParam } = params;

  const game = games.find((g) => g.id === gameId);
  const betType = typeof betTypeParam === 'string' ? betTypes[betTypeParam] : undefined;

  if (!game || !betType) {
    notFound();
  }

  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">{game.name}</CardTitle>
          <CardDescription>Placing Bet: <span className="font-semibold">{betType.name}</span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div>
            <Label htmlFor="bet-number">{betType.description}</Label>
            <Input id="bet-number" type="number" placeholder="Enter number" />
           </div>
           <div>
            <Label htmlFor="bet-amount">Amount</Label>
            <Input id="bet-amount" type="number" placeholder="Enter amount" />
           </div>
        </CardContent>
        <CardFooter>
            <Button className="w-full">Submit Bid</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
