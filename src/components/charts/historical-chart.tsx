'use client';

import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { games, chartData as initialChartData } from '@/lib/data';
import type { ChartData } from '@/lib/types';

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

export function HistoricalChart() {
  const [selectedGame, setSelectedGame] = useState(games[0].name);
  // NOTE: In a real app, this data would be fetched based on the selectedGame
  const [chartData, setChartData] = useState<ChartData[]>(initialChartData);

  const handleGameChange = (gameName: string) => {
    setSelectedGame(gameName);
    // Mock data fetching and update
    const newChartData = initialChartData.map(d => ({
        ...d,
        Open: Math.floor(Math.random() * 10),
        Close: Math.floor(Math.random() * 10)
    }));
    setChartData(newChartData);
  }

  return (
    <Card>
      <CardHeader className="flex-col items-start gap-4 sm:flex-row sm:items-center">
        <div className="flex-1">
          <CardTitle className="font-headline">Winning Number Patterns</CardTitle>
          <CardDescription>Historical trends for Open and Close numbers.</CardDescription>
        </div>
        <Select value={selectedGame} onValueChange={handleGameChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Select a game" />
          </SelectTrigger>
          <SelectContent>
            {games.map((game) => (
              <SelectItem key={game.id} value={game.name}>
                {game.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
  );
}
