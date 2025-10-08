

import { ResultsTabs } from "@/components/results/results-tabs";

export default function ResultsPage() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Game Results
        </h1>
        <p className="text-muted-foreground">
          Check the latest results for all supported Matka games.
        </p>
      </div>
      <ResultsTabs />
    </div>
  );
}
