# BuyerHub Outdoor — International Outdoor Gear Aggregator

This is a ready-to-run project (frontend + backend) for your buying agent workflow.
Type a product (e.g., "alpha sv", "zodiac tech gtx", "petzl quark") and see prices
from **REI, Backcountry, OMCgear, Enwild, Gregory, Mystery Ranch, Osprey** (international only).

## Quick Start (local)

### Requirements
- Node.js 18+ and npm

### 1) Install & Run Backend
```bash
cd api
npm i
npm run dev
```
This starts the API at http://localhost:8787

### 2) Install & Run Frontend
```bash
cd ../frontend
npm i
npm run dev
```
Open the URL shown (usually http://localhost:5173). The frontend will call the backend at `http://localhost:8787`.

## Deploy to Vercel (recommended)
- Create a Vercel project with two deployments:
  - **api/** as a Serverless Function (Node 18). Set `PORT` to 8787 or omit (Vercel sets dynamically).
  - **frontend/** as a static Vite project. Configure proxy or set `VITE_API_BASE` env to your API URL.
- Alternatively, deploy the whole repo as a monorepo: api as functions, frontend as static.

## Live vs Demo
- By default the backend runs in **DEMO** mode using curated results. To enable live adapters, set `USE_LIVE=true` in `api/.env` and fill any required selectors or API keys, then redeploy.
- Adapters: `rei`, `backcountry`, `omcgear`, `enwild`, `gregory`, `mysteryranch`, `osprey`

## Notes
- Scraping retail sites should respect robots.txt and Terms of Service.
- Consider official APIs or affiliate feeds where available.
- For cross-border, you can extend the backend to estimate duties, taxes, and shipping.


## Universal USD Adapter
- The backend includes a **universalUSD** adapter that scans multiple US domains (retail + secondary markets like StockX/GOAT/eBay/Geartrade) via SerpAPI, consolidating USD in-stock prices.
- Edit `api/adapters/universalUSD.js` to customize the domain allowlist.
