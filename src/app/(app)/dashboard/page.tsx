
'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { games } from "@/lib/data";
import { Play, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";

function GameCard({ game }: { game: typeof games[0] }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (game.openTime === '24 Hours') {
      setIsOpen(true);
      return;
    }

    const checkStatus = () => {
      const now = new Date();
      const [openHour, openMinute] = game.openTime.split(':').map(Number);
      const [closeHour, closeMinute] = game.closeTime.split(':').map(Number);
      
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

  }, [game.openTime, game.closeTime]);

  const closeTimeText = game.closeTime ? (
    <div>
      <p>Close Time:</p>
      <p className="font-semibold text-foreground">{game.closeTime}</p>
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
              <p className="font-semibold text-foreground">{game.openTime}</p>
            </div>
            {closeTimeText}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center text-center">
          {isOpen ? (
            <p className="text-green-600 text-xs font-semibold mb-2">Open for biding</p>
          ) : (
            <p className="text-destructive text-xs font-semibold mb-2">Closed for today</p>
          )}
          <Button variant="default" size="icon" className="h-12 w-12 rounded-full bg-primary mb-1" disabled={!isOpen}>
            <Play className="h-6 w-6 fill-primary-foreground" />
          </Button>
          <p className="text-sm font-semibold">Play Game</p>
        </div>
      </CardContent>
    </Card>
  )
}


export default function DashboardPage() {
  return (
    <div className="flex flex-col">
      <div className="bg-white p-2 text-center text-destructive font-bold text-sm shadow-md">
        <p>Welcome --Welcome --Welcome</p>
      </div>

      <div className="p-4 space-y-4">
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
              <span>+919999999999</span>
           </div>
           <div className="flex items-center gap-2 text-green-600 font-bold">
              <MessageSquare className="h-5 w-5 fill-green-600 text-white" />
              <span>+919999999999</span>
           </div>
        </div>

        <div className="space-y-3">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </div>
    </div>
  );
}
