import { StatsCard } from "@/components/dashboard/stats-card";
import { RecentResults } from "@/components/dashboard/recent-results";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Gamepad2, Gift, Target } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Welcome Back!
        </h1>
        <p className="text-muted-foreground">Here's your daily Matka overview.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Wallet Balance" value="₹1,250" icon={DollarSign} description="+20.1% from last month" />
        <StatsCard title="Today's Games" value="8" icon={Gamepad2} description="All markets open" />
        <StatsCard title="Winning Bets" value="3" icon={Gift} description="This week" />
        <StatsCard title="Lucky Number" value="7" icon={Target} description="Most frequent this month" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentResults />
        <Card className="flex flex-col items-center justify-center p-6 text-center">
            <CardHeader>
                <Target className="mx-auto h-12 w-12 text-primary" />
                <CardTitle className="font-headline mt-4">Get Your Predictions</CardTitle>
                <CardDescription>Use our AI to predict the next winning numbers.</CardDescription>
            </CardHeader>
            <CardContent>
                <Link href="/predictions">
                    <Button size="lg">Predict Now</Button>
                </Link>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
