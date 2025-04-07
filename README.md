# 🚀 Crypto Asset Tracker & Comparator

A modern web app to **track, analyze, and compare** cryptocurrency performance with integrated wallet support.

## ✨ Features

### 📊 Real-Time Asset Analysis

- Historical price charts (24h to 1 year)
- Normalized comparison for accurate ROI visualization

### 🔗 Wallet Integration

- Connect MetaMask
- ENS avatar/name support (`.eth` domains)

### 🔍 Side-by-Side Comparison

- Compare any two cryptocurrencies
- Unified timeline for performance analysis
- Dynamic tooltips with price differentials

## 🛠 Tech Stack

| Area             | Technologies Used               |
| ---------------- | ------------------------------- |
| Frontend         | React, TypeScript, Tailwind CSS |
| State Management | Redux, RTK Query                |
| Charting         | Recharts                        |
| Wallet SDK       | Wagmi, Viem                     |
| API              | CoinGecko API                   |
| Build tool       | Vite                            |
| Tests            | Vitest, React Testing Library   |

1. Clone the repo:
   git clone https://github.com/Juanmla/crypto-asset-tracker.git
2. pnpm install or npm install
3. Run locally: pnpm dev
4. Run tests: pnpm run test

This app uses Coingecko API (Public). In case reaching Coingecko rate limit, follow this: https://docs.coingecko.com/v3.0.1/reference/common-errors-rate-limit
