'use client';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Loader2, CheckCircle } from 'lucide-react';
import { useFormState, useFormStatus } from 'react-dom';
import { submitFullSangamBids } from '@/app/actions/bets';
import { getGames } from '@/app/actions/games';
import { ALL_VALID_PATTIS } from '@/lib/matka-rules';
import { useUserProfileStore } from '@/lib/store';

type Bid = {
    id: number;
    openPatti: string;
    closePatti: string;
    amount: string;
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

export default function FullSangamPage({ params }: { params: Promise<{ gameId: string }> }) {
    const { toast } = useToast();
    const updateBalance = useUserProfileStore((state) => state.updateBalance);

    const [game, setGame] = useState<any>(null);
    const [gameId, setGameId] = useState<string>('');
    const [loading, setLoading] = useState(true);

    const [openPatti, setOpenPatti] = useState('');
    const [closePatti, setClosePatti] = useState('');
    const [betAmount, setBetAmount] = useState('');
    const [bids, setBids] = useState<Bid[]>([]);

    const initialState = { error: undefined, success: undefined };
    const [state, dispatch] = useFormState(submitFullSangamBids, initialState);

    useEffect(() => {
        async function loadParamsAndGame() {
            const resolvedParams = await params;
            setGameId(resolvedParams.gameId);

            const result = await getGames();
            if (result.success && result.data) {
                const found = result.data.find((g: any) => g.id === resolvedParams.gameId);
                if (found) setGame(found);
            }

            setLoading(false);
        }
        loadParamsAndGame();
    }, [params]);

    useEffect(() => {
        if (state.error) {
            toast({ title: 'Submission Error', description: state.error, variant: 'destructive' });
        }
        if (state.success) {
            toast({
                title: 'Bids Submitted', description: `${bids.length} Full Sangam bids have been successfully placed.`,
                action: <CheckCircle className="h-5 w-5 text-green-500" />
            });
            if (state.newBalance) updateBalance(state.newBalance);
            setBids([]);
        }
    }, [state, toast, bids.length]);

    if (!game) {
        if (!loading) notFound();
        return null;
    }

    const validateAndAddBid = () => {
        const amount = parseInt(betAmount, 10);
        const isOpenPattiValid = ALL_VALID_PATTIS.has(openPatti);
        const isClosePattiValid = ALL_VALID_PATTIS.has(closePatti);

        if (!openPatti || !closePatti || !betAmount) {
            toast({ title: "Invalid Input", description: "Please enter all fields.", variant: "destructive" });
            return;
        }
        if (isNaN(amount) || amount <= 0) {
            toast({ title: "Invalid Amount", description: "Amount must be a positive number.", variant: "destructive" });
            return;
        }
        if (!isOpenPattiValid) {
            toast({ title: "Invalid Open Patti", description: "Please enter a valid Open Patti.", variant: "destructive" });
            return;
        }
        if (!isClosePattiValid) {
            toast({ title: "Invalid Close Patti", description: "Please enter a valid Close Patti.", variant: "destructive" });
            return;
        }

        const newBid: Bid = {
            id: Date.now(),
            openPatti: openPatti,
            closePatti: closePatti,
            amount: betAmount
        };

        setBids(prevBids => [...prevBids, newBid]);
        setOpenPatti('');
        setClosePatti('');
        setBetAmount('');
    }

    const removeBid = (id: number) => {
        setBids(bids.filter(bid => bid.id !== id));
    }

    const validPattisArray = Array.from(ALL_VALID_PATTIS);

    return (
        <div className="p-4 md:p-6 space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">{game.name}</CardTitle>
                    <CardDescription>Placing Bet: <span className="font-semibold">Full Sangam</span></CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="open-patti">Open Patti (3 digits)</Label>
                        <Input
                            id="open-patti"
                            type="text"
                            list="pattis"
                            placeholder="e.g., 123"
                            value={openPatti}
                            onChange={(e) => setOpenPatti(e.target.value)}
                            maxLength={3}
                        />
                    </div>
                    <div>
                        <Label htmlFor="close-patti">Close Patti (3 digits)</Label>
                        <Input
                            id="close-patti"
                            type="text"
                            list="pattis"
                            placeholder="e.g., 456"
                            value={closePatti}
                            onChange={(e) => setClosePatti(e.target.value)}
                            maxLength={3}
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

                    <datalist id="pattis">
                        {validPattisArray.map((p) => <option key={p} value={p} />)}
                    </datalist>
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
                                    <TableHead>Close Patti</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {bids.map(bid => (
                                    <TableRow key={bid.id}>
                                        <TableCell className="font-mono">{bid.openPatti}</TableCell>
                                        <TableCell className="font-mono">{bid.closePatti}</TableCell>
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
                            <input type="hidden" name="gameName" value={game.name} />
                            <SubmitButton />
                        </form>
                    </CardFooter>
                </Card>
            )}
        </div>
    );
}
