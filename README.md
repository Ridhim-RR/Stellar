# StellarCred

Decentralized credit scoring platform built on the Stellar ecosystem. Connect your wallet, pay a subscription, and receive a credit score based on your on-chain activity.

## Tech Stack

- **Frontend:** Next.js 16 (App Router), TypeScript, TailwindCSS, ShadCN UI, Framer Motion, Recharts
- **Backend:** Next.js API Routes (monolith, no separate server)
- **Database:** PostgreSQL + Prisma ORM
- **Blockchain:** Stellar Testnet, Stellar SDK, Freighter Wallet, Horizon API

## Prerequisites

- Node.js 18+
- PostgreSQL
- Freighter Wallet browser extension (Chrome/Firefox)
- Stellar Testnet account (funded via Friendbot)

## Setup

```bash
# 1. Install
npm install

# 2. Copy environment variables
cp .env.example .env

# 3. Configure .env
#    - DATABASE_URL: your PostgreSQL connection string
#    - APP_WALLET_SECRET: secret key for the treasury wallet
#    - NEXT_PUBLIC_APP_WALLET: public key for the treasury wallet
#
#    Generate at: https://laboratory.stellar.org/#account-creator?network=testnet
#    Fund via Friendbot on the same page.

# 4. Generate Prisma client and sync database
npx prisma generate
npx prisma db push

# 5. Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Usage

1. Connect your Freighter wallet
2. Click **"Pay 0.1 XLM with Freighter"** — Freighter opens, you approve the transaction
3. Subscription activates automatically (no manual hash entry)
4. Click **"Analyze Wallet"** to generate your credit score
5. View your dashboard with score breakdown, analytics, and credit limit

## User Flow

```
Landing Page → Connect Wallet → Pay 0.1 XLM (via Freighter)
    → Subscription Activated → Analyze Wallet → Dashboard
```

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── analyze-wallet/        # POST - Analyze wallet activity & score
│   │   ├── app-wallet/            # GET  - Treasury wallet public key
│   │   ├── user/                  # POST - Get/create user
│   │   └── verify-subscription/   # POST - Verify subscription payment
│   ├── dashboard/                 # Dashboard page (client component)
│   ├── globals.css
│   ├── layout.tsx                 # Root layout with Providers
│   └── page.tsx                   # Landing page (client component)
├── components/
│   ├── dashboard/                 # Dashboard-specific components
│   ├── landing/                   # Landing page sections
│   └── ui/                        # Reusable UI components (ShadCN-style)
├── hooks/
│   ├── useSubscription.ts         # Subscription state machine
│   └── useWalletAnalytics.ts      # React Query hooks
├── lib/
│   ├── prisma.ts                  # Prisma client singleton
│   ├── stellar.ts                 # Stellar key derivation
│   └── utils.ts                   # cn(), shortenAddress(), formatXlm()
├── providers/
│   ├── query-provider.tsx         # TanStack Query provider
│   └── wallet-provider.tsx        # Freighter wallet context
├── services/
│   ├── creditScoring.ts           # Score algorithm (0-100)
│   ├── stellarAnalytics.ts        # Horizon data fetching
│   └── subscriptionService.ts     # Build, sign, submit payment via Freighter
└── types/
    └── index.ts                   # TypeScript type definitions
prisma/
└── schema.prisma                  # User & WalletAnalytics models
```

## API Endpoints

### POST /api/user
Get or create a user by wallet address.

**Body:** `{ walletAddress: string }`

### POST /api/verify-subscription
Verify a subscription payment by transaction hash.

**Body:** `{ walletAddress: string, transactionHash: string }`

### POST /api/analyze-wallet
Analyze wallet activity, generate credit score, and assign credit limit.

**Body:** `{ walletAddress: string }`

**Response:**
```json
{
  "success": true,
  "data": {
    "score": 55,
    "creditLimit": 20,
    "analytics": {
      "transactionCount": 2,
      "paymentCount": 2,
      "totalVolume": 10000.1,
      "walletAgeDays": 0,
      "recentActivity": 2
    },
    "breakdown": {
      "walletAge": 0,
      "transactions": 0,
      "volume": 25,
      "activity": 20,
      "subscription": 10
    }
  }
}
```

## Credit Scoring Rules

| Category | Threshold | Points |
|----------|-----------|--------|
| Wallet Age | > 180 days | +30 |
| Wallet Age | > 90 days | +20 |
| Wallet Age | > 30 days | +10 |
| Transactions | > 100 | +25 |
| Transactions | > 50 | +15 |
| Transactions | > 10 | +10 |
| Volume | > 1000 XLM | +25 |
| Volume | > 500 XLM | +15 |
| Volume | > 100 XLM | +10 |
| Recent Activity | Active in 30 days | +20 |
| Subscription | Paid | +10 |

**Score → Credit Limit:** ≥ 80 → 100 USDC, ≥ 60 → 50 USDC, ≥ 40 → 20 USDC, else none.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `APP_WALLET_SECRET` | Treasury wallet secret key (server-side only) |
| `NEXT_PUBLIC_APP_WALLET` | Treasury wallet public key (frontend uses this) |

## License

MIT
