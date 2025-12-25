import { useState, useEffect } from 'react';

export const MOCK_CHART_DATA = [
  { name: '9', value: 120 }, { name: '11', value: 150 }, { name: '13', value: 100 },
  { name: '15', value: 180 }, { name: '17', value: 220 }, { name: '19', value: 160 },
  { name: '21', value: 250 }, { name: '23', value: 210 }, { name: '25', value: 190 },
];

export const COIN_DATA = [
  {
    "id": "solana",
    "symbol": "sol",
    "name": "Solana",
    "hashing_algorithm": "Proof-of-History",
    "description": { "en": "Solana is a high-performance L1 blockchain..." },
    "market_data": {
      "current_price": { "usd": 150.25 },
      "market_cap": { "usd": 67890000000 },
      "total_volume": { "usd": 2500000000 },
      "price_change_percentage_24h": 2.5
    }
  },
  { 
    id: 'bitcoin', 
    name: 'Bitcoin', 
    symbol: 'BTC', 
    "market_data": {
      "current_price": { "usd": 150.25 },
      "market_cap": { "usd": 67890000000 },
      "total_volume": { "usd": 2500000000 },
      "price_change_percentage_24h": 2.5
    },
    price: 20788, 
    change: 0.25, 
    color: '#7B61FF', 
    isFavorite: true,
    sparkline: [{ value: 30 }, { value: 45 }, { value: 35 }, { value: 55 }, { value: 40 }, { value: 60 }, { value: 50 }]
  },
  { 
    id: 'ethereum', 
    name: 'Ethereum', 
    symbol: 'ETH', 
    price: 21543, 
    change: 1.56, 
    color: '#2EE297', 
    isFavorite: true,
    sparkline: [{ value: 20 }, { value: 40 }, { value: 60 }, { value: 45 }, { value: 70 }, { value: 55 }, { value: 80 }]
  },
  { 
    id: 'binancecoin', 
    name: 'Binance', 
    symbol: 'BNB', 
    price: 18788, 
    change: 0.35, 
    color: '#F3BA2F', 
    isFavorite: false,
    sparkline: [] // Các coin phụ có thể không cần biểu đồ để tối ưu
  },
  { 
    id: 'litecoin', 
    name: 'Litecoin', 
    symbol: 'LTC', 
    price: 11657, 
    change: -0.18, 
    color: '#345D9D', 
    isFavorite: false,
    sparkline: [] 
  },
];

export const useSolanaPrice = () => {
  const [price, setPrice] = useState<number | null>(null);
  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
        const data = await res.json();
        setPrice(data.solana.usd);
      } catch { setPrice(145.20); }
    };
    fetchPrice();
  }, []);
  return price;
};