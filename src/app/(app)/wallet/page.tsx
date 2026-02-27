import { WalletForms } from "@/components/wallet/wallet-forms";
import { getWalletData } from "@/app/actions/wallet";

export default async function WalletPage() {
  const rs = await getWalletData();
  const balance = rs.success ? rs.data?.balance || 0 : 0;
  const transactions = rs.success ? rs.data?.transactions || [] : [];

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">Wallet</h1>
        <p className="text-muted-foreground">
          Manage your deposits and withdrawals.
        </p>
      </div>
      <WalletForms initialBalance={balance} transactions={transactions} />
    </div>
  );
}
