
'use client';

import * as React from 'react';
import { addDays, format } from 'date-fns';
import type { DateRange } from 'react-day-picker';
import { games } from '@/lib/data';
import type { Bid } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarIcon, FilterX, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { getBids } from '@/app/actions/bids';
import { useUser } from '@/hooks/use-user';

const betStatuses = ['Win', 'Loss', 'Pending'];

export function BidsHistoryClient() {
  const { user } = useUser();
  const [allBids, setAllBids] = React.useState<Bid[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: addDays(new Date(), -7),
    to: new Date(),
  });
  const [selectedGame, setSelectedGame] = React.useState<string>('all');
  const [selectedStatus, setSelectedStatus] = React.useState<string>('all');
  const [filteredBids, setFilteredBids] = React.useState<Bid[]>([]);

  React.useEffect(() => {
    const fetchBids = async () => {
      if (user) {
        setLoading(true);
        const userBids = await getBids(user.id);
        setAllBids(userBids);
        setLoading(false);
      }
    };
    fetchBids();
  }, [user]);

  const filterBids = React.useCallback(() => {
    const fromDate = date?.from ? new Date(date.from.setHours(0, 0, 0, 0)) : null;
    const toDate = date?.to ? new Date(date.to.setHours(23, 59, 59, 999)) : null;

    const filtered = allBids.filter(bid => {
      const bidDate = new Date(bid.date);
      const isDateInRange = fromDate && toDate ? (bidDate >= fromDate && bidDate <= toDate) : true;
      const isGameMatch = selectedGame === 'all' || bid.gameName === selectedGame;
      const isStatusMatch = selectedStatus === 'all' || bid.status === selectedStatus;
      
      return isDateInRange && isGameMatch && isStatusMatch;
    });
    setFilteredBids(filtered);
  }, [date, selectedGame, selectedStatus, allBids]);

  React.useEffect(() => {
    filterBids();
  }, [filterBids]);

  const clearFilters = () => {
    setDate({ from: addDays(new Date(), -7), to: new Date() });
    setSelectedGame('all');
    setSelectedStatus('all');
  }
  
  const getStatusVariant = (status: 'Win' | 'Loss' | 'Pending'): 'default' | 'destructive' | 'secondary' => {
      switch (status) {
          case 'Win': return 'default';
          case 'Loss': return 'destructive';
          case 'Pending': return 'secondary';
      }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Bidding History</CardTitle>
        <div className="flex flex-col md:flex-row gap-2 mt-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={'outline'}
                className={cn(
                  'w-full md:w-[260px] justify-start text-left font-normal',
                  !date && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, 'LLL dd, y')} - {format(date.to, 'LLL dd, y')}
                    </>
                  ) : (
                    format(date.from, 'LLL dd, y')
                  )
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          <Select value={selectedGame} onValueChange={setSelectedGame}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Select a game" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">All Games</SelectItem>
                {games.map((game) => (
                    <SelectItem key={game.id} value={game.name}>
                        {game.name}
                    </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {betStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                        {status}
                    </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <Button onClick={clearFilters} variant="ghost" className="w-full md:w-auto">
            <FilterX className="mr-2 h-4 w-4" />
            Clear
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
            <div className="flex justify-center items-center h-48">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Game</TableHead>
              <TableHead>Bet Details</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBids.length > 0 ? (
              filteredBids.map(bid => (
                <TableRow key={bid.id}>
                  <TableCell>{format(new Date(bid.date), 'dd/MM/yy, hh:mm a')}</TableCell>
                  <TableCell className="font-medium">{bid.gameName}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                        <span className="font-bold">{bid.betType} ({bid.market})</span>
                        <span className="font-mono text-primary">{bid.number}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-semibold">₹{bid.amount.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={getStatusVariant(bid.status)}>{bid.status}</Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No bids found for the selected filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        )}
      </CardContent>
    </Card>
  );
}
