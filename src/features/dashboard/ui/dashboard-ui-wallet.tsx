"use client";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useState, useEffect } from 'react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { PublicKey } from '@solana/web3.js';

export default function DashboardUiWallet() {
    const { connection } = useConnection();
    const { publicKey } = useWallet();
    const [balance, setBalance] = useState<number | null>(null);
    const [totalUsdValue, setTotalUsdValue] = useState<number | null>(null);
    const [solPriceUsd, setSolPriceUsd] = useState<number>(122.16); // Default fallback
    const [mounted, setMounted] = useState(false);

    // Fetch real-time SOL price from CoinGecko
    useEffect(() => {
        const fetchSolPrice = async () => {
            try {
                const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
                const data = await response.json();
                if (data.solana?.usd) {
                    setSolPriceUsd(data.solana.usd);
                    console.log('Real SOL Price:', data.solana.usd);
                }
            } catch (error) {
                console.error('Failed to fetch SOL price, using fallback:', error);
            }
        };

        fetchSolPrice();
        // Update price every 30 seconds
        const interval = setInterval(fetchSolPrice, 30000);
        return () => clearInterval(interval);
    }, []);

    const getTokens = async () => {
        if (!publicKey) return 0;

        try {
            const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
                programId: new PublicKey(TOKEN_PROGRAM_ID),
            });

            let totalTokenValueUsd = 0;

            tokenAccounts.value.forEach((tokenAccount) => {
                const accountData = tokenAccount.account.data.parsed.info;
                const mintAddress = accountData.mint;
                const amount = accountData.tokenAmount.uiAmount;

                // Here you would normally fetch the price for each token
                // For now, we'll assume USDT/USDC = $1
                const isStablecoin = mintAddress.includes('USDT') || mintAddress.includes('USDC');
                const tokenPriceUsd = isStablecoin ? 1 : 0; // Add more token prices as needed

                totalTokenValueUsd += (amount || 0) * tokenPriceUsd;

                console.log(`Token Mint: ${mintAddress}, Balance: ${amount}, USD Value: $${(amount || 0) * tokenPriceUsd}`);
            });

            return totalTokenValueUsd;
        } catch (error) {
            console.error("Failed to fetch tokens:", error);
            return 0;
        }
    };

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!publicKey) {
            setBalance(null);
            setTotalUsdValue(null);
            return;
        }

        const updateBalance = async () => {
            try {
                const b = await connection.getBalance(publicKey);
                const solBalance = b / LAMPORTS_PER_SOL;
                setBalance(solBalance);

                // Calculate total portfolio value
                const tokenValueUsd = await getTokens();
                const solValueUsd = solBalance * solPriceUsd;
                const totalValue = solValueUsd + tokenValueUsd;

                setTotalUsdValue(totalValue);

                console.log(`SOL: ${solBalance} ($${solValueUsd.toFixed(2)}), Tokens: $${tokenValueUsd.toFixed(2)}, Total: $${totalValue.toFixed(2)}`);
            } catch (e) {
                console.error("Failed to fetch balance", e);
            }
        };

        updateBalance();
        const interval = setInterval(updateBalance, 10000);
        return () => clearInterval(interval);
    }, [publicKey, connection]);

    const handleAirdrop = async () => {
        if (!publicKey) return;

        try {
            const sig = await connection.requestAirdrop(publicKey, 1 * LAMPORTS_PER_SOL);
            alert("Waiting for airdrop confirmation...");
            await connection.confirmTransaction(sig);

            // Manually update balance after airdrop
            const newBalance = await connection.getBalance(publicKey);
            const solBalance = newBalance / LAMPORTS_PER_SOL;
            setBalance(solBalance);

            // Recalculate total USD value
            const tokenValueUsd = await getTokens();
            const solValueUsd = solBalance * solPriceUsd;
            setTotalUsdValue(solValueUsd + tokenValueUsd);

            alert("Successfully received 1 SOL!");
        } catch (error) {
            console.error("Airdrop failed:", error);
            alert("Airdrop failed. Please try again.");
        }
    };

    return (
        <div className="market-table-container p-6 bg-gradient-to-br from-wallet-blue/10 to-transparent">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-white font-bold text-sm uppercase tracking-wider">Devnet Wallet</h3>
                {mounted ? (
                    <WalletMultiButton className="!bg-wallet-blue !h-9 !text-[11px] !rounded-xl hover:!bg-blue-600 transition-all" />
                ) : (
                    <div className="h-9 w-24 bg-white/5 animate-pulse rounded-xl" />
                )}
            </div>

            {publicKey ? (
                <div className="space-y-4 animate-in fade-in duration-500">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 shadow-inner">
                        <p className="text-text-muted text-[10px] uppercase font-bold mb-1">Total Portfolio Value</p>
                        <div className="flex items-baseline gap-2">
                            <h2 className="text-3xl font-bold text-[#14f195]">
                                ${totalUsdValue !== null ? totalUsdValue.toFixed(2) : "---"}
                            </h2>
                            <span className="text-[#14f195] text-xs font-bold">USD</span>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                            <p className="text-text-muted text-[10px]">
                                {balance !== null ? balance.toFixed(4) : "---"} SOL
                            </p>
                            <span className="text-text-muted text-[10px]">•</span>
                            <p className="text-text-muted text-[10px]">
                                ${balance !== null ? (balance * solPriceUsd).toFixed(2) : "---"}
                            </p>
                            <span className="text-text-muted text-[10px]">•</span>
                            <p className="text-[#14f195] text-[9px]">
                                ${solPriceUsd.toFixed(2)}/SOL
                            </p>
                        </div>
                        <p className="text-text-muted text-[9px] font-mono truncate mt-2 opacity-50">
                            {publicKey.toBase58()}
                        </p>
                    </div>

                    <button
                        onClick={handleAirdrop}
                        className="w-full py-3 bg-white/5 hover:bg-white/10 text-[#14f195] text-[11px] font-bold rounded-xl border border-[#14f195]/20 transition-all uppercase"
                    >
                        Faucet 1 SOL (Free)
                    </button>
                </div>
            ) : (
                <div className="text-center py-8 border-2 border-dashed border-white/5 rounded-2xl">
                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-xl">🔌</span>
                    </div>
                    <p className="text-text-muted text-[11px] px-4">
                        Connect your Phantom wallet to access the Devnet Sandbox
                    </p>
                </div>
            )}
        </div>
    );
}
