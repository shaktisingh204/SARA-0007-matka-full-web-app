
'use client';
import { games } from '@/lib/data';
import { notFound, useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

const betTypes = [
    { id: 'ank', name: 'Single (Ank)', description: '0-9' },
    { id: 'jodi', name: 'Jodi', description: '00-99' },
    { id: 'patti', name: 'Patti / Panna', description: '000-999' },
    { id: 'single-patti', name: 'Single Patti', description: 'e.g. 123 (all unique)' },
    { id: 'double-patti', name: 'Double Patti', description: 'e.g. 112 (two same)' },
    { id: 'triple-patti', name: 'Triple Patti', description: 'e.g. 111 (all same)' },
    { id: 'half-sangam', name: 'Half Sangam', description: 'Patti + Jodi' },
    { id: 'full-sangam', name: 'Full Sangam', description: 'Open Patti + Close Patti' },
]

export default function PlayGamePage() {
  const router = useRouter();
  const params = useParams();
  const gameId = params.gameId;
  const game = games.find((g) => g.id === gameId);

  if (!game) {
    notFound();
  }

  const handleBetTypeSelect = (betType: string) => {
      router.push(`/play/${game.id}/${betType}`);
  }

  return (
    <div className="p-4 md:p-6 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">{game.name}</CardTitle>
          <CardDescription>Select a bet type to continue</CardDescription>
        </CardHeader>
      </Card>

      <div className="space-y-3">
        {betTypes.map((bet) => (
            <Card key={bet.id} onClick={() => handleBetTypeSelect(bet.id)} className="cursor-pointer hover:bg-muted">
                <CardContent className="p-4 flex justify-between items-center">
                    <div>
                        <h3 className="font-bold text-lg">{bet.name}</h3>
                        <p className="text-sm text-muted-foreground">{bet.description}</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </CardContent>
            </Card>
        ))}
      </div>
    </div>
  );
}
