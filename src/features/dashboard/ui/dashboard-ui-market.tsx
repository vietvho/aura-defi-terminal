"use client";
import { popularCoins } from '@/data/popular-coins';

export default function DashboardUiMarket() {
    return (
        <div className="market-table-container">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                <h3 className="text-white font-bold text-lg tracking-tight">Popular Coins</h3>
                <span className="text-[10px] text-text-muted bg-white/5 px-2 py-1 rounded-md uppercase font-mono">
                    Live Market Data
                </span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="text-[10px] uppercase text-text-muted font-bold tracking-widest bg-white/[0.02]">
                        <tr>
                            <th className="px-6 py-4">Asset</th>
                            <th className="px-6 py-4 text-right">Price (USD)</th>
                            <th className="px-6 py-4 text-right">24h Change</th>
                            <th className="px-6 py-4 text-right">Market Cap</th>
                            <th className="px-6 py-4 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {popularCoins.map((coin) => (
                            <tr key={coin.id} className="group hover:bg-white/[0.03] transition-all duration-300">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full grayscale group-hover:grayscale-0 transition-all" />
                                        <div>
                                            <p className="text-white text-sm font-bold">{coin.name}</p>
                                            <p className="text-text-muted text-[10px] uppercase font-mono">{coin.symbol}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <p className="text-white text-sm font-mono font-bold">
                                        ${coin.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </p>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className={`inline-flex items-center gap-1 text-sm font-medium ${coin.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                                        }`}>
                                        {coin.change24h > 0 ? '▲' : '▼'} {Math.abs(coin.change24h)}%
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <p className="text-text-muted text-xs font-medium">
                                        ${(coin.mcap / 1e9).toFixed(2)}B
                                    </p>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex justify-center">
                                        <button className="bg-wallet-blue text-white text-[10px] font-bold px-5 py-2 rounded-lg opacity-0 group-hover:opacity-100 shadow-lg shadow-wallet-blue/20 hover:scale-105 transition-all">
                                            Trade
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
