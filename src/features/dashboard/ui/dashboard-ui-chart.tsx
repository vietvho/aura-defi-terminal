"use client";
import { useEffect, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const SOL_PRICE = 122.16;

export default function DashboardUiChart() {
    const { connection } = useConnection();
    const { publicKey } = useWallet();

    const [chartData, setChartData] = useState<{ month: string; value: number }[]>([]);

    // Helper to generate fake history based on current value
    const generateHistory = (currentValue: number) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
        // If value is 0, return flat 0
        if (currentValue === 0) {
            return months.map(m => ({ month: m, value: 0 }));
        }

        // Generate volatile crypto-like history
        return months.map((month, index) => {
            if (index === months.length - 1) return { month, value: currentValue };

            // Create a "random walk" pattern working backwards from current value
            // We want it to look like it had some dips and pumps
            const volatility = 0.4; // 40% volatility
            const randomFactor = 1 + (Math.random() * volatility - (volatility / 2)); // 0.8 to 1.2

            // The further back, the more we drift, but keep it somewhat grounded
            // We simulate that the user "grew" their portfolio over time
            const timeDecay = 1 - ((months.length - 1 - index) * 0.15);

            let historicalValue = currentValue * timeDecay * randomFactor;

            // Ensure we don't go below 0
            return { month, value: Math.max(0, historicalValue) };
        });
    };

    useEffect(() => {
        async function updateLiveEquity() {
            if (!publicKey) {
                // Default "Demo" data if not connected
                setChartData([
                    { month: 'Jan', value: 12000 },
                    { month: 'Feb', value: 15000 },
                    { month: 'Mar', value: 13500 },
                    { month: 'Apr', value: 18000 },
                    { month: 'May', value: 18000 },
                ]);
                return;
            }

            try {
                const balance = await connection.getBalance(publicKey);
                const solAmount = balance / LAMPORTS_PER_SOL;
                const currentEquity = solAmount * SOL_PRICE;

                setChartData(prev => {
                    // If we already have data and it matches the scale of current equity, just update last point
                    // Otherwise (first load or massive change), regenerate history
                    const lastValue = prev[prev.length - 1]?.value || 0;
                    const isFirstLoad = prev.length === 0 || (lastValue === 18000 && currentEquity !== 18000); // 18000 was our hardcoded default

                    if (isFirstLoad) {
                        return generateHistory(currentEquity);
                    } else {
                        // Just update the last point to be live
                        const newData = [...prev];
                        newData[newData.length - 1] = {
                            ...newData[newData.length - 1],
                            value: currentEquity
                        };
                        return newData;
                    }
                });

            } catch (error) {
                console.error("Error fetching balance:", error);
            }
        }

        updateLiveEquity();
        const id = setInterval(updateLiveEquity, 10000);
        return () => clearInterval(id);
    }, [publicKey, connection]);

    return (
        <div className="market-table-container p-6 h-[350px]">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-white font-bold text-lg">Portfolio Growth</h3>
                {publicKey && (
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-[10px] text-green-400 font-mono tracking-tighter uppercase">Live Tracking</span>
                    </div>
                )}
            </div>

            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                    <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#14f195" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#14f195" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis
                        dataKey="month"
                        stroke="#4b5563"
                        fontSize={10}
                        axisLine={false}
                        tickLine={false}
                        dy={10}
                    />
                    <YAxis hide domain={['auto', 'auto']} />
                    <Tooltip
                        cursor={{ stroke: '#14f195', strokeWidth: 1, strokeDasharray: '4 4' }}
                        contentStyle={{ backgroundColor: '#11141d', border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)' }}
                        formatter={(value: number | undefined) => [`$${value?.toLocaleString() || '0'}`, 'Equity']}
                    />
                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#14f195"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorValue)"
                        isAnimationActive={true}
                        animationDuration={1000}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
