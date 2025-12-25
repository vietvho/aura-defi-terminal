"use client";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';

export default function DashboardUiActivity() {
    const { connection } = useConnection();
    const { publicKey } = useWallet();
    const [activities, setActivities] = useState<any[]>([]);

    useEffect(() => {
        if (!publicKey) return;

        const fetchActivities = async () => {
            try {
                // Get 5 most recent transactions for this wallet
                const signatures = await connection.getSignaturesForAddress(publicKey, { limit: 5 });

                const formattedActivities = signatures.map((sig) => ({
                    id: sig.signature,
                    type: 'Transaction',
                    status: sig.confirmationStatus,
                    time: sig.blockTime ? new Date(sig.blockTime * 1000).toLocaleTimeString() : 'Just now',
                    signature: sig.signature
                }));

                setActivities(formattedActivities);
            } catch (error) {
                console.error("Error fetching transaction history:", error);
            }
        };

        fetchActivities();
        // Update every 10s when new transactions occur
        const interval = setInterval(fetchActivities, 10000);
        return () => clearInterval(interval);
    }, [publicKey, connection]);

    return (
        <div className="glass-card p-6 h-full">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-white font-bold text-lg">Recent Activity</h3>
                <button className="text-wallet-blue text-xs font-semibold hover:underline">
                    View All
                </button>
            </div>

            <div className="space-y-6">
                {activities.length > 0 ? (
                    activities.map((act) => (
                        <div key={act.id} className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5 hover:border-[#14f195]/30 transition-all cursor-pointer"
                            onClick={() => window.open(`https://explorer.solana.com/tx/${act.signature}?cluster=devnet`, '_blank')}>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#14f195]/10 flex items-center justify-center text-[#14f195]">
                                    {act.status === 'confirmed' || act.status === 'finalized' ? '✓' : '⌛'}
                                </div>
                                <div>
                                    <p className="text-white text-[11px] font-bold font-mono">
                                        {act.id.slice(0, 8)}...{act.id.slice(-4)}
                                    </p>
                                    <p className="text-text-muted text-[10px]">{act.time}</p>
                                </div>
                            </div>
                            <span className="text-[9px] px-2 py-1 bg-white/5 rounded text-text-muted uppercase tracking-tighter">
                                {act.status}
                            </span>
                        </div>
                    ))
                ) : (
                    <p className="text-text-muted text-[10px] italic text-center py-4">No recent transactions found</p>
                )}
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 text-center text-[10px] text-text-muted italic">
                Real-time updates synced with global exchanges.
            </div>
        </div>
    );
}
