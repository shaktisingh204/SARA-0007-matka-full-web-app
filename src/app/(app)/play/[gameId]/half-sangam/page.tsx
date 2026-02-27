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
import { submitHalfSangamBids } from '@/app/actions/bets';

import { getGames } from '@/app/actions/games';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ALL_VALID_PATTIS, VALID_ANK } from '@/lib/matka-rules';
import { useUserProfileStore } from '@/lib/store';

type Bid = {
    id: number;
    openNumber: string;
    closeNumber: string;
    amount: string;
    sangamType: string;
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

export default function HalfSangamPage({ params }: { params: Promise<{ gameId: string }> }) {
    const { toast } = useToast();
    const updateBalance = useUserProfileStore((state) => state.updateBalance);

    const [game, setGame] = useState<any>(null);
    const [gameId, setGameId] = useState<string>('');
    const [loading, setLoading] = useState(true);

    const [sangamType, setSangamType] = useState<'open_patti_close_ank' | 'open_ank_close_patti'>('open_patti_close_ank');
    const [openNumber, setOpenNumber] = useState('');
    const [closeNumber, setCloseNumber] = useState('');
    const [betAmount, setBetAmount] = useState('');
    const [bids, setBids] = useState<Bid[]>([]);

    const initialState = { error: undefined, success: undefined };
    const [state, dispatch] = useFormState(submitHalfSangamBids, initialState);

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
                title: 'Bids Submitted', description: `${bids.length} Half Sangam bids have been successfully placed.`,
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

    const handleSangamTypeChange = (type: any) => {
        setSangamType(type);
        setOpenNumber('');
        setCloseNumber('');
    };

    const validateAndAddBid = () => {
        const amount = parseInt(betAmount, 10);

        let isOpenValid = false;
        let isCloseValid = false;

        if (sangamType === 'open_patti_close_ank') {
            isOpenValid = ALL_VALID_PATTIS.has(openNumber);
            isCloseValid = VALID_ANK.has(closeNumber);
        } else {
            isOpenValid = VALID_ANK.has(openNumber);
            isCloseValid = ALL_VALID_PATTIS.has(closeNumber);
        }

        if (!openNumber || !closeNumber || !betAmount) {
            toast({ title: "Invalid Input", description: "Please enter all fields.", variant: "destructive" });
            return;
        }
        if (isNaN(amount) || amount <= 0) {
            toast({ title: "Invalid Amount", description: "Amount must be a positive number.", variant: "destructive" });
            return;
        }
        if (!isOpenValid) {
            toast({ title: "Invalid Open Number", description: `Please select a valid ${sangamType === 'open_patti_close_ank' ? '3-digit Patti' : '1-digit Ank'}.`, variant: "destructive" });
            return;
        }
        if (!isCloseValid) {
            toast({ title: "Invalid Close Number", description: `Please select a valid ${sangamType === 'open_patti_close_ank' ? '1-digit Ank' : '3-digit Patti'}.`, variant: "destructive" });
            return;
        }

        const newBid: Bid = {
            id: Date.now(),
            openNumber: openNumber,
            closeNumber: closeNumber,
            amount: betAmount,
            sangamType: sangamType
        };

        setBids(prevBids => [...prevBids, newBid]);
        setOpenNumber('');
        setCloseNumber('');
        setBetAmount('');
    }

    const removeBid = (id: number) => {
        setBids(bids.filter(bid => bid.id !== id));
    }

    const validPattisArray = Array.from(ALL_VALID_PATTIS);
    const validAnkArray = Array.from(VALID_ANK);

    return (
        <div className="p-4 md:p-6 space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">{game.name}</CardTitle>
                    <CardDescription>Placing Bet: <span className="font-semibold">Half Sangam</span></CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Half Sangam Type</Label>
                        <RadioGroup value={sangamType} onValueChange={handleSangamTypeChange} className="flex flex-col sm:flex-row gap-4">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="open_patti_close_ank" id="open_patti" />
                                <Label htmlFor="open_patti">Open Patti + Close Ank</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="open_ank_close_patti" id="open_ank" />
                                <Label htmlFor="open_ank">Open Ank + Close Patti</Label>
                            </div>
                        </RadioGroup>
                    </div>
                    <div>
                        <Label htmlFor="open-number">{sangamType === 'open_patti_close_ank' ? 'Open Patti (3 digits)' : 'Open Ank (1 digit)'}</Label>
                        <Input
                            id="open-number"
                            type="text"
                            list={sangamType === 'open_patti_close_ank' ? "pattis" : "anks"}
                            placeholder={`e.g., ${sangamType === 'open_patti_close_ank' ? '123' : '5'}`}
                            value={openNumber}
                            onChange={(e) => setOpenNumber(e.target.value)}
                            maxLength={sangamType === 'open_patti_close_ank' ? 3 : 1}
                        />
                    </div>
                    <div>
                        <Label htmlFor="close-number">{sangamType === 'open_patti_close_ank' ? 'Close Ank (1 digit)' : 'Close Patti (3 digits)'}</Label>
                        <Input
                            id="close-number"
                            type="text"
                            list={sangamType === 'open_patti_close_ank' ? "anks" : "pattis"}
                            placeholder={`e.g., ${sangamType === 'open_patti_close_ank' ? '5' : '123'}`}
                            value={closeNumber}
                            onChange={(e) => setCloseNumber(e.target.value)}
                            maxLength={sangamType === 'open_patti_close_ank' ? 1 : 3}
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
                    <datalist id="anks">
                        {validAnkArray.map((a) => <option key={a} value={a} />)}
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
                                    <TableHead>Type</TableHead>
                                    <TableHead>Open</TableHead>
                                    <TableHead>Close</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {bids.map(bid => (
                                    <TableRow key={bid.id}>
                                        <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                                            {bid.sangamType === 'open_patti_close_ank' ? 'Patti + Ank' : 'Ank + Patti'}
                                        </TableCell>
                                        <TableCell className="font-mono">{bid.openNumber}</TableCell>
                                        <TableCell className="font-mono">{bid.closeNumber}</TableCell>
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
