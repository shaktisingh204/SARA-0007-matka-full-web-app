
'use client';

import { Suspense, useState, useEffect } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { games, chartData as initialChartData, results as allResults } from '@/lib/data';
import type { ChartData, Result } from '@/lib/types';
import { useSearchParams } from 'next/navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const chartConfig = {
  open: {
    label: 'Open',
    color: 'hsl(var(--chart-1))',
  },
  close: {
    label: 'Close',
    color: 'hsl(var(--chart-2))',
  },
};

function ChartComponent() {
  const searchParams = useSearchParams();
  const gameId = searchParams.get('gameId');

  const [selectedGameName, setSelectedGameName] = useState('');
  const [chartData, setChartData] = useState<ChartData[]>(initialChartData);
  const [gameResults, setGameResults] = useState<Result[]>([]);

  useEffect(() => {
    const game = games.find(g => g.id === gameId);
    if (game) {
      setSelectedGameName(game.name);
    } else {
      setSelectedGameName(games[0].name); // fallback to first game
    }
  }, [gameId]);

  useEffect(() => {
    if (selectedGameName) {
      // Mock data fetching and update
      const newChartData = initialChartData.map(d => ({
          ...d,
          Open: Math.floor(Math.random() * 10),
          Close: Math.floor(Math.random() * 10)
      }));
      setChartData(newChartData);

      const filteredResults = allResults.filter(r => r.gameName === selectedGameName);
      setGameResults(filteredResults);
    }
  }, [selectedGameName]);


  if (!selectedGameName) {
    return <div>Loading...</div>;
  }
  
  return (
    <>
    <Card>
      <CardHeader className="flex-col items-start gap-4 sm:flex-row sm:items-center">
        <div className="flex-1">
          <CardTitle className="font-headline">Winning Number Patterns for {selectedGameName}</CardTitle>
          <CardDescription>Historical trends for Open and Close numbers.</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis domain={[0, 9]} tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="Open" fill="var(--color-open)" radius={4} />
              <Bar dataKey="Close" fill="var(--color-close)" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <CardTitle>Recent Results for {selectedGameName}</CardTitle>
      </CardHeader>
      <CardContent>
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
    </>
  );
}


export function HistoricalChart() {
  return (
    <Suspense fallback={<div>Loading chart details...</div>}>
      <ChartComponent />
    </Suspense>
  )
}
