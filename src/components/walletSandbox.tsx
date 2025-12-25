import { Transaction, SystemProgram, PublicKey, LAMPORTS_PER_SOL, VersionedTransaction } from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useState, useEffect } from 'react';
import { DESTINATION_WALLET } from '@/constants/wallet';

export default function WalletSandbox({ currentSolPrice }: { currentSolPrice: number }) {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [realSolPrice, setRealSolPrice] = useState<number>(currentSolPrice);
  const [solBalance, setSolBalance] = useState<number>(0);
  const [mounted, setMounted] = useState(false);
  const [isMainnet, setIsMainnet] = useState(false);

  // Detect Network
  useEffect(() => {
    if (connection.rpcEndpoint.includes("mainnet")) {
      setIsMainnet(true);
    } else {
      setIsMainnet(false);
    }
  }, [connection]);

  // Fetch real-time SOL price from CoinGecko
  useEffect(() => {
    const fetchSolPrice = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
        const data = await response.json();
        if (data.solana?.usd) {
          setRealSolPrice(data.solana.usd);
          console.log('Real SOL Price:', data.solana.usd);
        }
      } catch (error) {
        console.error('Failed to fetch SOL price, using fallback:', error);
        setRealSolPrice(currentSolPrice);
      }
    };

    fetchSolPrice();
    const interval = setInterval(fetchSolPrice, 30000);
    return () => clearInterval(interval);
  }, [currentSolPrice]);

  // Fetch real wallet balance
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!publicKey) {
      setSolBalance(0);
      return;
    }

    const fetchBalance = async () => {
      try {
        const balance = await connection.getBalance(publicKey);
        setSolBalance(balance / LAMPORTS_PER_SOL);
      } catch (error) {
        console.error('Failed to fetch wallet balance:', error);
      }
    };

    fetchBalance();
    // Update balance every 5 seconds
    const interval = setInterval(fetchBalance, 5000);
    return () => clearInterval(interval);
  }, [publicKey, connection]);

  const handleTrade = async (type: 'BUY' | 'SELL', amount: number) => {
    if (!publicKey) return alert("Please connect your wallet!");

    try {
      let signature = '';

      if (isMainnet) {
        // --- MAINNET LOGIC (Jupiter Swap) ---
        const SOL_MINT = "So11111111111111111111111111111111111111112";
        const USDC_MINT = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";

        const inputMint = type === 'SELL' ? SOL_MINT : USDC_MINT;
        const outputMint = type === 'SELL' ? USDC_MINT : SOL_MINT;

        // Amount in atomic units
        const amountInAtomic = type === 'SELL'
          ? Math.floor(amount * LAMPORTS_PER_SOL)
          : Math.floor(amount * 1_000_000); // USDC has 6 decimals

        // 1. Get Quote
        const quoteResponse = await fetch(
          `https://quote-api.jup.ag/v6/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amountInAtomic}&slippageBps=50`
        ).then(res => res.json());

        if (!quoteResponse || quoteResponse.error) {
          throw new Error(quoteResponse.error || "Failed to get quote from Jupiter");
        }

        // 2. Get Swap Transaction
        const { swapTransaction } = await fetch('https://quote-api.jup.ag/v6/swap', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            quoteResponse,
            userPublicKey: publicKey.toString(),
            wrapAndUnwrapSol: true,
          })
        }).then(res => res.json());

        // 3. Deserialize and Sign
        // Use browser-compatible decoding instead of Buffer
        const swapTransactionBuf = Uint8Array.from(atob(swapTransaction), c => c.charCodeAt(0));
        const transaction = VersionedTransaction.deserialize(swapTransactionBuf);

        signature = await sendTransaction(transaction, connection);

      } else {
        // --- DEVNET LOGIC (Simulation) ---
        if (type === 'SELL') {
          // SELL: Send SOL to DESTINATION_WALLET
          const transaction = new Transaction().add(
            SystemProgram.transfer({
              fromPubkey: publicKey,
              toPubkey: DESTINATION_WALLET,
              lamports: amount * LAMPORTS_PER_SOL,
            })
          );

          const { blockhash } = await connection.getLatestBlockhash();
          transaction.recentBlockhash = blockhash;
          transaction.feePayer = publicKey;

          signature = await sendTransaction(transaction, connection);
        } else {
          // BUY: Request Airdrop (Simulate buying SOL)
          signature = await connection.requestAirdrop(publicKey, amount * LAMPORTS_PER_SOL);
        }
      }

      await connection.confirmTransaction(signature, 'confirmed');

      // Refresh balance after transaction
      const newBalance = await connection.getBalance(publicKey);
      setSolBalance(newBalance / LAMPORTS_PER_SOL);

      alert(`${type} transaction successful! (${isMainnet ? 'Mainnet Swap' : 'Devnet Simulation'})`);

    } catch (error: any) {
      // Error handling
      if (error.message?.includes("User rejected the request")) {
        console.warn("User cancelled transaction");
        return;
      }

      if (error.message?.includes("429") || error.message?.includes("too many requests")) {
        alert("Network is overloaded, please try again in a few seconds.");
      } else {
        alert("Error occurred: " + error.message);
      }
      console.error("Transaction error:", error);
    }
  };

  return (
    <div className="market-table-container p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-white font-bold text-lg">Solana Sandbox</h3>
        <div className={`px-2 py-1 text-[10px] rounded font-mono animate-pulse ${isMainnet ? 'bg-red-500/10 text-red-500' : 'bg-wallet-blue/10 text-wallet-blue'
          }`}>
          {isMainnet ? 'MAINNET LIVE' : 'SIMULATED DEVNET'}
        </div>
      </div>

      <div className="space-y-4">
        {/* Balance Display */}
        <div className="bg-white/[0.03] p-4 rounded-xl border border-white/5">
          <p className="text-text-muted text-[10px] uppercase font-bold">Your Balance</p>
          <div className="flex justify-between items-end mt-2">
            <h2 className="text-2xl font-bold text-white">{solBalance.toFixed(2)} SOL</h2>
            <p className="text-text-muted text-sm font-mono mb-1">
              ≈ ${(solBalance * realSolPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <p className="text-[#14f195] text-[9px] mt-1">
            Live Price: ${realSolPrice.toFixed(2)}/SOL
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <button
            onClick={() => handleTrade('BUY', 0.1)}
            className="relative overflow-hidden group p-3 bg-green-500/10 border border-green-500/30 rounded-xl hover:bg-green-500/20 transition-all"
          >
            <div className="flex flex-col items-center">
              <span className="text-green-400 font-bold text-xs uppercase">Buy 0.1 SOL</span>
              <span className="text-[9px] text-green-400/60 font-mono">
                {isMainnet ? 'Swap USDC → SOL' : 'Request Airdrop'}
              </span>
            </div>
            {/* Light ray effect on hover */}
            <div className="absolute inset-0 w-1/2 h-full bg-white/5 skew-x-[-20deg] -translate-x-full group-hover:translate-x-[250%] transition-transform duration-700" />
          </button>

          <button
            onClick={() => handleTrade('SELL', 0.1)}
            className="relative overflow-hidden group p-3 bg-red-500/10 border border-red-500/30 rounded-xl hover:bg-red-500/20 transition-all"
          >
            <div className="flex flex-col items-center">
              <span className="text-red-400 font-bold text-xs uppercase">Sell 0.1 SOL</span>
              <span className="text-[9px] text-red-400/60 font-mono">
                {isMainnet ? 'Swap SOL → USDC' : 'Simulate Transfer'}
              </span>
            </div>
            <div className="absolute inset-0 w-1/2 h-full bg-white/5 skew-x-[-20deg] -translate-x-full group-hover:translate-x-[250%] transition-transform duration-700" />
          </button>
        </div>

        {/* Wallet Status */}
        <div className="pt-4 border-t border-white/5 flex justify-between items-center">
          <span className="text-text-muted text-[10px]">Wallet Status:</span>
          <span className="text-white text-xs font-mono">
            {publicKey ? 'Connected' : 'Not Connected'}
          </span>
        </div>
      </div>
    </div>
  );
}