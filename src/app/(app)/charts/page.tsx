import { HistoricalChart } from "@/components/charts/historical-chart";

export default function ChartsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Historical Charts
        </h1>
        <p className="text-muted-foreground">
          Analyze past results to find winning number patterns.
        </p>
      </div>
      <HistoricalChart />
    </div>
  );
}
