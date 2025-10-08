import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const gameRates = [
  { type: 'Single Digit', rate: '₹1 wins ₹9.8' },
  { type: 'Jodi Digit', rate: '₹1 wins ₹98' },
  { type: 'Red Bracket', rate: '₹1 wins ₹98' },
  { type: 'Single Pana', rate: '₹1 wins ₹160' },
  { type: 'Double Pana', rate: '₹1 wins ₹320' },
  { type: 'Triple Pana', rate: '₹1 wins ₹1000' },
  { type: 'Half Sangam', rate: '₹1 wins ₹1000' },
  { type: 'Full Sangam', rate: '₹1 wins ₹10000' },
];

export default function RatesPage() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Game Rates
        </h1>
        <p className="text-muted-foreground">
          Payout rates for different game types.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rate Chart</CardTitle>
          <CardDescription>
            The following table shows the payout for a ₹1 bet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Game Type</TableHead>
                <TableHead className="text-right">Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {gameRates.map((game) => (
                <TableRow key={game.type}>
                  <TableCell className="font-medium">{game.type}</TableCell>
                  <TableCell className="text-right font-semibold">{game.rate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
