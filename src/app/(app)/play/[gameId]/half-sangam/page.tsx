
'use client';
import { games } from '@/lib/data';
import { notFound, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2 } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

type Bid = {
    id: number;
    openPatti: string;
    closeJodi: string;
    amount: string;
}

export default function HalfSangamPage() {
    const params = useParams();
    const { toast } = useToast();
    const { gameId } = params;

    const game = games.find((g) => g.id === gameId);

    const [openPatti, setOpenPatti] = useState('');
    const [closeJodi, setCloseJodi] = useState('');
    const [betAmount, setBetAmount] = useState('');
    const [bids, setBids] = useState<Bid[]>([]);

    if (!game) {
        notFound();
    }

    const validateAndAddBid = () => {
        const amount = parseInt(betAmount, 10);
        const isPattiValid = /^\d{3}$/.test(openPatti);
        const isJodiValid = /^\d{2}$/.test(closeJodi);

        if (!openPatti || !closeJodi || !betAmount) {
            toast({ title: "Invalid Input", description: "Please enter all fields.", variant: "destructive" });
            return;
        }
        if (isNaN(amount) || amount <= 0) {
            toast({ title: "Invalid Amount", description: "Amount must be a positive number.", variant: "destructive" });
            return;
        }
        if (!isPattiValid) {
            toast({ title: "Invalid Open Patti", description: "Open Patti must be a 3-digit number.", variant: "destructive" });
            return;
        }
        if (!isJodiValid) {
            toast({ title: "Invalid Close Jodi", description: "Close Jodi must be a 2-digit number.", variant: "destructive" });
            return;
        }

        const newBid: Bid = {
            id: Date.now(),
            openPatti: openPatti,
            closeJodi: closeJodi,
            amount: betAmount
        };

        setBids(prevBids => [...prevBids, newBid]);
        setOpenPatti('');
        setCloseJodi('');
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
        toast({ title: "Bids Submitted", description: `${bids.length} Half Sangam bids have been successfully placed.`});
        setBids([]);
    }

    return (
        <div className="p-4 space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">{game.name}</CardTitle>
                    <CardDescription>Placing Bet: <span className="font-semibold">Half Sangam</span></CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                   <div>
                       <Label htmlFor="open-patti">Open Patti (3 digits)</Label>
                       <Input 
                           id="open-patti" 
                           type="number" 
                           placeholder="e.g., 123" 
                           value={openPatti}
                           onChange={(e) => setOpenPatti(e.target.value)}
                           maxLength={3}
                       />
                   </div>
                   <div>
                       <Label htmlFor="close-jodi">Close Jodi (2 digits)</Label>
                       <Input 
                           id="close-jodi" 
                           type="number" 
                           placeholder="e.g., 45" 
                           value={closeJodi}
                           onChange={(e) => setCloseJodi(e.target.value)}
                           maxLength={2}
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
                                    <TableHead>Open Patti</TableHead>
                                    <TableHead>Close Jodi</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {bids.map(bid => (
                                    <TableRow key={bid.id}>
                                        <TableCell className="font-mono">{bid.openPatti}</TableCell>
                                        <TableCell className="font-mono">{bid.closeJodi}</TableCell>
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
