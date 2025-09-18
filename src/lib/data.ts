import type { Game, Result, ChartData } from '@/lib/types';

export const games: Game[] = [
  { id: 'milan_morning', name: 'Milan Morning', openTime: '10:15 AM', closeTime: '11:15 AM' },
  { id: 'kalyan_morning', name: 'Kalyan Morning', openTime: '11:00 AM', closeTime: '12:00 PM' },
  { id: 'madhuri', name: 'Madhuri', openTime: '11:45 AM', closeTime: '12:45 PM' },
  { id: 'sridevi', name: 'Sridevi', openTime: '11:35 AM', closeTime: '12:35 PM' },
  { id: 'kalyan', name: 'Kalyan', openTime: '03:45 PM', closeTime: '05:45 PM' },
  { id: 'milan_night', name: 'Milan Night', openTime: '09:00 PM', closeTime: '11:00 PM' },
  { id: 'rajdhani_night', name: 'Rajdhani Night', openTime: '09:25 PM', closeTime: '11:35 PM' },
  { id: 'main_bazar', name: 'Main Bazar', openTime: '09:40 PM', closeTime: '12:05 AM' },
  { id: 'starline', name: 'Starline', openTime: '24 Hours', closeTime: '' },
  { id: 'dishawar', name: 'Dishawar', openTime: '24 Hours', closeTime: '' },
  { id: 'super_day', name: 'Super Day', openTime: '24 Hours', closeTime: '' },
];

export const results: Result[] = [
  { id: '1', gameId: 'kalyan', gameName: 'Kalyan', date: '2024-07-28', openPana: '128', openSingle: '1', jodi: '12', closePana: '480', closeSingle: '2' },
  { id: '2', gameId: 'milan_night', gameName: 'Milan Night', date: '2024-07-28', openPana: '345', openSingle: '2', jodi: '25', closePana: '140', closeSingle: '5' },
  { id: '3', gameId: 'main_bazar', gameName: 'Main Bazar', date: '2024-07-28', openPana: '678', openSingle: '1', jodi: '10', closePana: '280', closeSingle: '0' },
  { id: '4', gameId: 'sridevi', gameName: 'Sridevi', date: '2024-07-28', openPana: '115', openSingle: '7', jodi: '73', closePana: '670', closeSingle: '3' },
  { id: '5', gameId: 'rajdhani_night', gameName: 'Rajdhani Night', date: '2024-07-27', openPana: '239', openSingle: '4', jodi: '46', closePana: '123', closeSingle: '6' },
  { id: '6', gameId: 'kalyan', gameName: 'Kalyan', date: '2024-07-27', openPana: '589', openSingle: '2', jodi: '22', closePana: '110', closeSingle: '2' },
];

export const chartData: ChartData[] = [
    { date: "Mon", 'Open': 1, 'Close': 2 },
    { date: "Tue", 'Open': 3, 'Close': 4 },
    { date: "Wed", 'Open': 5, 'Close': 6 },
    { date: "Thu", 'Open': 7, 'Close': 8 },
    { date: "Fri", 'Open': 9, 'Close': 0 },
    { date: "Sat", 'Open': 1, 'Close': 3 },
    { date: "Sun", 'Open': 2, 'Close': 5 },
];
