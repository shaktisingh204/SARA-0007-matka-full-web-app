'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { games, results } from '@/lib/data';
import type { Result } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';

export function ResultsTabs() {
  return (
    <Tabs defaultValue={games[0].id} className="w-full">
      <div className="overflow-x-auto">
        <TabsList className="mb-4">
          {games.map((game) => (
            <TabsTrigger key={game.id} value={game.id}>
              {game.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      {games.map((game) => {
        const gameResults = results.filter((r) => r.gameId === game.id);
        return (
          <TabsContent key={game.id} value={game.id}>
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-center">Open</TableHead>
                      <TableHead className="text-center">Jodi</TableHead>
                      <TableHead className="text-right">Close</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {gameResults.length > 0 ? (
                      gameResults.map((result: Result) => (
                        <TableRow key={result.id}>
                          <TableCell className="font-medium">{result.date}</TableCell>
                           <TableCell className="text-center">
                            <span className="font-mono">{result.openPana}</span>
                            <span className="font-bold text-primary">-{result.openSingle}</span>
                          </TableCell>
                          <TableCell className="text-center font-bold font-mono text-lg text-accent">{result.jodi}</TableCell>
                          <TableCell className="text-right">
                            <span className="font-bold text-primary">{result.closeSingle}-</span>
                            <span className="font-mono">{result.closePana}</span>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                          No results found for this game.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
