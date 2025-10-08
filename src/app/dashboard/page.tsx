

'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Game } from "@/lib/types";
import { Play, MessageSquare, LineChart } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getGames } from "@/app/actions/games";
import { getAppDetails } from "@/app/actions/app-details";
import { useLogStore } from "@/lib/store";

function GameCard({ game }: { game: Game }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (game.open_time === '24 Hours' || !game.close_time) {
      setIsOpen(true);
      return;
    }

    const checkStatus = () => {
      const now = new Date();
      const [openHour, openMinute] = game.open_time.split(':').map(Number);
      const [closeHour, closeMinute] = game.close_time.split(':').map(Number);
      
      const openTime = new Date();
      openTime.setHours(openHour, openMinute, 0);

      const closeTime = new Date();
      closeTime.setHours(closeHour, closeMinute, 0);
      
      if (closeTime < openTime) { // overnight game
        if (now >= openTime || now < closeTime) {
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
      } else { // same day game
        if (now >= openTime && now < closeTime) {
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
      }
    };
    
    checkStatus();
    const interval = setInterval(checkStatus, 60000); // Check every minute
    return () => clearInterval(interval);

  }, [game.open_time, game.close_time]);

  const closeTimeText = game.close_time ? (
    <div>
      <p>Close Time:</p>
      <p className="font-semibold text-foreground">{game.close_time}</p>
    </div>
  ) : null;

  return (
    <Card>
      <CardContent className="p-4 grid grid-cols-3 items-center gap-4">
        <div className="col-span-2">
          <h3 className="font-bold text-lg">{game.name}</h3>
          <p className="text-primary font-bold text-lg tracking-widest">***-**-***</p>
          <div className="flex justify-between text-xs text-muted-foreground">
            <div>
              <p>Open Time:</p>
              <p className="font-semibold text-foreground">{game.open_time}</p>
            </div>
            {closeTimeText}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center text-center">
          {isOpen ? (
            <>
              <p className="text-green-600 text-xs font-semibold mb-2">Open for biding</p>
              <Link href={`/play/${game.id}`} className="flex flex-col items-center">
                <Button variant="default" size="icon" className="h-12 w-12 rounded-full bg-primary mb-1">
                  <Play className="h-6 w-6 fill-primary-foreground" />
                </Button>
                <p className="text-sm font-semibold">Play Game</p>
              </Link>
            </>
          ) : (
            <>
              <p className="text-destructive text-xs font-semibold mb-2">Closed for today</p>
               <Link href={`/charts?gameId=${game.id}`} className="flex flex-col items-center">
                <Button variant="outline" size="icon" className="h-12 w-12 rounded-full mb-1">
                  <LineChart className="h-6 w-6" />
                </Button>
                <p className="text-sm font-semibold">View Chart</p>
              </Link>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}


export default function DashboardPage() {
    const [games, setGames] = useState<Game[]>([]);
    const [appDetails, setAppDetails] = useState<{ whatsapp_no?: string, mobile_no?: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const { addLog } = useLogStore();

    useEffect(() => {
        const fetchGames = async () => {
            const result = await getGames();
            addLog({ title: 'getGames Response', data: result });
            if (result.success && result.data) {
                setGames(result.data);
            } else {
                console.error("Failed to fetch games:", result.error);
            }
        };

        const fetchAppDetails = async () => {
             const result = await getAppDetails();
             addLog({ title: 'getAppDetails Response', data: result });
             if (result.success && result.data) {
                setAppDetails(result.data);
             } else {
                 console.error("Failed to fetch app details:", result.error);
             }
        };
        
        const loadData = async () => {
            setLoading(true);
            await Promise.all([fetchGames(), fetchAppDetails()]);
            setLoading(false);
        }

        loadData();
    }, [addLog]);

    if (loading) {
        return (
            <div className="p-4 space-y-3">
                {[...Array(5)].map((_, i) => (
                    <Card key={i}>
                        <CardContent className="p-4">
                            <div className="animate-pulse flex space-x-4">
                                <div className="flex-1 space-y-3 py-1">
                                    <div className="h-4 bg-muted rounded w-3/4"></div>
                                    <div className="h-4 bg-muted rounded w-1/2"></div>
                                    <div className="h-3 bg-muted rounded w-5/6"></div>
                                </div>
                                <div className="rounded-full bg-muted h-12 w-12"></div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

  return (
    <div className="flex flex-col">
      <div className="bg-white p-2 text-center text-destructive font-bold text-sm shadow-md">
        <p>Welcome --Welcome --Welcome</p>
      </div>

      <div className="p-4">
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
            <Button className="h-12 bg-primary rounded-full font-bold text-lg">
                <Play className="mr-2 h-6 w-6 fill-primary-foreground" />
                STARLINE
            </Button>
            <Button className="h-12 bg-primary rounded-full font-bold text-lg">
                <Play className="mr-2 h-6 w-6 fill-primary-foreground" />
                DISHAWAR
            </Button>
            </div>

            <div className="flex justify-around bg-white p-2 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 text-green-600 font-bold">
                <MessageSquare className="h-5 w-5 fill-green-600 text-white" />
                <span>{appDetails?.whatsapp_no || 'Loading...'}</span>
            </div>
            <div className="flex items-center gap-2 text-green-600 font-bold">
                <MessageSquare className="h-5 w-5 fill-green-600 text-white" />
                <span>{appDetails?.mobile_no || 'Loading...'}</span>
            </div>
            </div>

            <div className="space-y-3">
            {games.map((game) => (
                <GameCard key={game.id} game={game} />
            ))}
            </div>
        </div>
      </div>
    </div>
  );
}
