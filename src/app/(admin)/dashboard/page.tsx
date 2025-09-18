import { StatsCard } from '@/components/admin/stats-card';
import { bids, users } from '@/lib/data';
import { Users, Gavel, IndianRupee } from 'lucide-react';

export default function AdminDashboardPage() {
    const totalBids = bids.length;
    const totalUsers = users.length;
    const totalWinnings = bids.filter(b => b.status === 'Win').reduce((sum, b) => sum + b.amount * 9, 0); // Assuming 1:9 win ratio for demo

    return (
        <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <StatsCard 
                    title="Total Users"
                    value={totalUsers.toString()}
                    icon={Users}
                    description="Total registered users"
                />
                <StatsCard 
                    title="Total Bids Placed"
                    value={totalBids.toString()}
                    icon={Gavel}
                    description="All bids across all games"
                />
                <StatsCard 
                    title="Total Winnings Paid"
                    value={`₹${totalWinnings.toLocaleString()}`}
                    icon={IndianRupee}
                    description="Estimated total winnings"
                />
            </div>
        </div>
    )
}
