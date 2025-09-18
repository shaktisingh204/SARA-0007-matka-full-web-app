
import { games } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function PlayGamePage({ params }: { params: { gameId: string } }) {
  const game = games.find((g) => g.id === params.gameId);

  if (!game) {
    notFound();
  }

  const gameTypes = [
    { id: 'single', name: 'Single Digit' },
    { id: 'jodi', name: 'Jodi' },
    { id: 'single-patti', name: 'Single Patti' },
    { id: 'double-patti', name: 'Double Patti' },
    { id: 'triple-patti', name: 'Triple Patti' },
  ];

  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">{game.name}</CardTitle>
          <CardDescription>Place your bid below</CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="single" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="single">Single</TabsTrigger>
            <TabsTrigger value="jodi">Jodi</TabsTrigger>
            <TabsTrigger value="patti">Patti</TabsTrigger>
        </TabsList>
        <TabsContent value="single">
            <Card>
                <CardHeader>
                    <CardTitle>Single Digit</CardTitle>
                    <CardDescription>Enter a single digit from 0 to 9.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="single-digit">Digit</Label>
                        <Input id="single-digit" type="number" min="0" max="9" placeholder="e.g. 5" />
                    </div>
                    <div>
                        <Label htmlFor="single-amount">Amount</Label>
                        <Input id="single-amount" type="number" placeholder="Enter amount" />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full">Submit Bid</Button>
                </CardFooter>
            </Card>
        </TabsContent>
        <TabsContent value="jodi">
             <Card>
                <CardHeader>
                    <CardTitle>Jodi</CardTitle>
                    <CardDescription>Enter a two-digit number from 00 to 99.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="jodi-digit">Jodi</Label>
                        <Input id="jodi-digit" type="number" min="0" max="99" placeholder="e.g. 42" />
                    </div>
                    <div>
                        <Label htmlFor="jodi-amount">Amount</Label>
                        <Input id="jodi-amount" type="number" placeholder="Enter amount" />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full">Submit Bid</Button>
                </CardFooter>
            </Card>
        </TabsContent>
        <TabsContent value="patti">
             <Card>
                <CardHeader>
                    <CardTitle>Patti / Panna</CardTitle>
                    <CardDescription>Enter a three-digit number.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="patti-digit">Patti</Label>
                        <Input id="patti-digit" type="number" min="0" placeholder="e.g. 123" />
                    </div>
                    <div>
                        <Label htmlFor="patti-amount">Amount</Label>
                        <Input id="patti-amount" type="number" placeholder="Enter amount" />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full">Submit Bid</Button>
                </CardFooter>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
