import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { getGames } from '@/app/actions/games';
import Link from 'next/link';

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

export default async function PlayGamePage({ params }: { params: Promise<{ gameId: string }> }) {
  const resolvedParams = await params;
  const gameId = resolvedParams.gameId;

  const result = await getGames();
  const games = result.success && result.data ? result.data : [];
  const game = games.find((g: any) => g.id === gameId);

  if (!game) {
    notFound();
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
          <Link key={bet.id} href={`/play/${game.id}/${bet.id}`} className="block">
            <Card className="cursor-pointer hover:bg-muted transition-colors">
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg">{bet.name}</h3>
                  <p className="text-sm text-muted-foreground">{bet.description}</p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
