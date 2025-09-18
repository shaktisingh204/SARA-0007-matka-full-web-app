import { WalletForms } from "@/components/wallet/wallet-forms";

export default function WalletPage() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">Wallet</h1>
        <p className="text-muted-foreground">
          Manage your deposits and withdrawals.
        </p>
      </div>
      <WalletForms />
    </div>
  );
}
