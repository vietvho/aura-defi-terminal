# Aura DeFi Terminal ⚡️

A Demo, high-performance DeFi Dashboard and Trading Terminal built exclusively for the **Solana Blockchain**.

## 🌟 Features

- **Solana-Exclusive**: Built specifically for the high-speed Solana network.
- **Hybrid Trading Engine**:
  - **Devnet Mode**: Risk-free simulation using Airdrops and dummy transfers.
  - **Mainnet Mode**: Real trading execution via **Jupiter Aggregator** (USDC ↔ SOL).
- **Real-Time Data**: Live price feeds via CoinGecko and direct on-chain balance updates.
- **Non-Custodial**: Users trade directly from their own wallets (Phantom, Solflare, etc.).

## ⚠️ Important Note

This application is designed **ONLY for the Solana ecosystem**. 
- It uses Solana-specific libraries (`@solana/web3.js`).
- It connects to Solana wallets.
- It trades Solana-native tokens (SOL, USDC-SPL).
- It **CANNOT** interact with Ethereum, Bitcoin, or other blockchains.

## Getting Started

### Installation

#### Install Dependencies

```shell
npm install
```

#### Start the app

```shell
npm run dev
```
