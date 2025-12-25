
'use client'
import { useState, useEffect } from 'react';

export const useSolanaPrice = () => {
  const [price, setPrice] = useState<number | null>(null);
  
  useEffect(() => {
    const fetchPrice = async () => {
      try {
        // Fetch giá SOL live từ CoinGecko Demo API
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
        const data = await res.json();
        setPrice(data.solana.usd);
      } catch (err) {
        setPrice(124.50); // Dự phòng giá giả nếu API limit
      }
    };
    fetchPrice();
    const interval = setInterval(fetchPrice, 60000); // Cập nhật mỗi phút
    return () => clearInterval(interval);
  }, []);
  
  return price;
};
