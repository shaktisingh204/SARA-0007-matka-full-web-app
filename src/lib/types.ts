export type Game = {
  id: string;
  name: string;
  openTime: string;
  closeTime: string;
};

export type Result = {
  id: string;
  gameId: string;
  gameName: string;
  date: string;
  openPana: string;
  openSingle: string;
  jodi: string;
  closePana: string;
  closeSingle: string;
};

export type ChartData = {
  date: string;
  [key: string]: number | string;
};

export type Transaction = {
  id: string;
  date: string;
  description: string;
  type: 'credit' | 'debit';
  amount: number;
  balance: number;
};
