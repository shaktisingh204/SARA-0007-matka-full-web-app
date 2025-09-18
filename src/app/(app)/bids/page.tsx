
import { BidsHistoryClient } from "@/components/bids/bids-history-client";

export default function BidsPage() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          My Bids
        </h1>
        <p className="text-muted-foreground">
          View your bidding history and filter by game, status, or date.
        </p>
      </div>
      <BidsHistoryClient />
    </div>
  );
}
