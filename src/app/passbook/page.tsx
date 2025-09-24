

import { PassbookClient } from "@/components/passbook/passbook-client";

export default function PassbookPage() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Passbook
        </h1>
        <p className="text-muted-foreground">
          View your transaction history and filter by date.
        </p>
      </div>
      <PassbookClient />
    </div>
  );
}
