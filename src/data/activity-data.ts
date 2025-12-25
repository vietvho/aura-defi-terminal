export const activities = [
  {
    id: 1,
    asset: "Solana",
    symbol: "SOL",
    type: "Buy",
    amount: "24.5",
    price: 122.16, // Khớp với converted_last.usd trong solana.json
    market: "Binance", // Lấy từ market.name
    time: "2 mins ago",
    status: "Completed"
  },
  {
    id: 2,
    asset: "Bitcoin",
    symbol: "BTC",
    type: "Sell",
    amount: "0.015",
    price: 87271.0, // Khớp với bitcoin.json
    market: "Coinbase",
    time: "15 mins ago",
    status: "Completed"
  },
  {
    id: 3,
    asset: "Ethereum",
    symbol: "ETH",
    type: "Buy",
    amount: "1.2",
    price: 2935.57, // Khớp với ethereum.json
    market: "Kraken",
    time: "1 hour ago",
    status: "Completed"
  }
];