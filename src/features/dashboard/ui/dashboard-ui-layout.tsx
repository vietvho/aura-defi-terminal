"use client";

import DashboardUiStats from './dashboard-ui-stats';
import DashboardUiChart from './dashboard-ui-chart';
import DashboardUiMarket from './dashboard-ui-market';
import DashboardUiWallet from './dashboard-ui-wallet';
import DashboardUiActivity from './dashboard-ui-activity';
import WalletSandbox from '@/components/walletSandbox';

const currentSolPrice = 122.16;

export default function DashboardUiLayout() {
    return (
        <div className="flex flex-col lg:flex-row lg:items-start gap-6 p-4 md:p-6 h-full">
            {/* LEFT COLUMN (Main Data): Spans 2/3 on large screens */}
            <div className="flex-1  flex flex-col gap-6 order-2 lg:order-1">
                {/* Top Row: Asset Statistics */}
                <header>
                    <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
                    <DashboardUiStats />
                </header>

                {/* Middle: Interactive Growth Chart */}
                <section className="min-h-[300px]">
                    <DashboardUiChart />
                </section>

                {/* Bottom: Market Assets Table */}
                <section className="w-full overflow-x-auto">
                    <DashboardUiMarket />
                </section>
            </div>

            {/* RIGHT COLUMN (Wallet & Actions): Spans 1/3 on large screens */}
            <div className="flex-1 lg:flex-1 flex flex-col gap-6 lg:max-w-[380px] order-1 lg:order-2">
                {/* Wallet Balance & Swap Interface */}
                <DashboardUiWallet />
                <WalletSandbox currentSolPrice={currentSolPrice} />
                {/* Recent Activity Feed */}
                <DashboardUiActivity />
            </div>
        </div>
    );
}
