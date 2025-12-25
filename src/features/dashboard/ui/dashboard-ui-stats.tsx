"use client";
import { coinData } from '@/data/market-data';

export default function DashboardUiStats() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {coinData.map((coin) => (
                <div key={coin.id} className="glass-card p-5 relative overflow-hidden group">
                    <div className="flex justify-between items-start relative z-10">
                        <div className="flex items-center gap-3">
                            <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full" />
                            <div>
                                <h3 className="text-white font-bold text-sm">{coin.name}</h3>
                                <p className="text-text-muted text-[10px] uppercase font-mono">{coin.symbol}</p>
                            </div>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${coin.change24h >= 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                            }`}>
                            {coin.change24h > 0 ? '+' : ''}{coin.change24h}%
                        </span>
                    </div>

                    <div className="mt-5 relative z-10">
                        <p className="text-2xl font-bold text-white tracking-tight">
                            ${coin.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-text-muted text-[10px] mt-1">
                            Cap: ${(coin.mcap / 1e9).toFixed(2)}B
                        </p>
                    </div>

                    {/* Background Glow Effect */}
                    <div
                        className="absolute -right-6 -bottom-6 w-24 h-24 blur-[50px] opacity-10 group-hover:opacity-25 transition-opacity duration-500"
                        style={{ backgroundColor: coin.color }}
                    />
                </div>
            ))}
        </div>
    );
}
