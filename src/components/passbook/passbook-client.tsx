
'use client';

import * as React from 'react';
import { addDays, format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { transactions as allTransactions } from '@/lib/data';
import type { Transaction } from '@/lib/types';
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
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export function PassbookClient() {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });
  const [filteredTransactions, setFilteredTransactions] = React.useState<Transaction[]>([]);

  const filterTransactions = React.useCallback(() => {
    const fromDate = date?.from ? new Date(date.from.setHours(0, 0, 0, 0)) : null;
    const toDate = date?.to ? new Date(date.to.setHours(23, 59, 59, 999)) : null;

    if (!fromDate || !toDate) {
      setFilteredTransactions(allTransactions);
      return;
    }

    const filtered = allTransactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= fromDate && transactionDate <= toDate;
    });
    setFilteredTransactions(filtered);
  }, [date]);

  React.useEffect(() => {
    filterTransactions();
  }, [filterTransactions]);

  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
        <CardTitle className="font-headline">Transaction History</CardTitle>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={'outline'}
                className={cn(
                  'w-[300px] justify-start text-left font-normal',
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
            <PopoverContent className="w-auto p-0" align="end">
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
          <Button onClick={filterTransactions}>Filter</Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Balance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map(transaction => (
                <TableRow key={transaction.id}>
                  <TableCell>{format(new Date(transaction.date), 'dd/MM/yyyy')}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell
                    className={cn(
                      'text-right font-semibold',
                      transaction.type === 'credit' ? 'text-green-600' : 'text-destructive'
                    )}
                  >
                    {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">₹{transaction.balance.toFixed(2)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No transactions found for the selected period.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
