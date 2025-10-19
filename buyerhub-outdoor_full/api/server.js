import express from 'express';
import fetch from 'cross-fetch';
import dotenv from 'dotenv';
import { rei } from './adapters/rei.js';
import { backcountry } from './adapters/backcountry.js';
import { omcgear } from './adapters/omcgear.js';
import { enwild } from './adapters/enwild.js';
import { gregory } from './adapters/gregory.js';
import { mysteryRanch } from './adapters/mysteryranch.js';
import { osprey } from './adapters/osprey.js';
import { universalUSD } from './adapters/universalUSD.js';


dotenv.config();
const app = express();
const PORT = process.env.PORT || 8787;
const USE_LIVE = (process.env.USE_LIVE || 'true').toLowerCase() === 'true';

// CORS for local dev
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

/** Unified item shape */
const shape = (item) => ({
  id: item.id,
  vendor: item.vendor,
  vendorRegion: item.vendorRegion || 'US',
  brand: item.brand || '',
  category: item.category || '',
  title: item.title,
  url: item.url,
  price: item.price,
  currency: item.currency || 'USD',
  inStock: Boolean(item.inStock),
  shippingDays: item.shippingDays ?? undefined,
  rating: item.rating ?? undefined,
  reviews: item.reviews ?? undefined,
  image: item.image || '',
});

/** Demo fallback data */
const DEMO = {
  "alpha sv": [
    { id:"rei-alpha-sv", vendor:"REI", vendorRegion:"US", brand:"Arc'teryx", category:"Jacket", title:"Arc'teryx Alpha SV Jacket (Men's)", url:"https://www.rei.com/", price:899, currency:"USD", inStock:true, rating:4.8, image:"" },
    { id:"bc-alpha-sv", vendor:"Backcountry", vendorRegion:"US", brand:"Arc'teryx", category:"Jacket", title:"Arc'teryx Alpha SV Jacket", url:"https://www.backcountry.com/", price:899, currency:"USD", inStock:true, rating:4.7, image:"" },
    { id:"omc-alpha-sv", vendor:"OMCgear", vendorRegion:"US", brand:"Arc'teryx", category:"Jacket", title:"Arc'teryx Alpha SV", url:"https://omcgear.com/", price:874, currency:"USD", inStock:true, image:"" },
    { id:"enw-alpha-sv", vendor:"Enwild", vendorRegion:"US", brand:"Arc'teryx", category:"Jacket", title:"Arc'teryx Alpha SV", url:"https://www.enwild.com/", price:869, currency:"USD", inStock:true, image:"" },
  ],
  "zodiac tech gtx": [
    { id:"bc-zodiac", vendor:"Backcountry", vendorRegion:"US", brand:"Scarpa", category:"Boots", title:"Scarpa Zodiac Tech GTX", url:"https://www.backcountry.com/", price:329, currency:"USD", inStock:true },
    { id:"rei-zodiac", vendor:"REI", vendorRegion:"US", brand:"Scarpa", category:"Boots", title:"Scarpa Zodiac Tech GTX", url:"https://www.rei.com/", price:329, currency:"USD", inStock:true },
  ],
  "petzl quark": [
    { id:"enw-quark", vendor:"Enwild", vendorRegion:"US", brand:"Petzl", category:"Ice Tool", title:"Petzl Quark Ice Tool", url:"https://www.enwild.com/", price:219, currency:"USD", inStock:true },
    { id:"rei-quark", vendor:"REI", vendorRegion:"US", brand:"Petzl", category:"Ice Tool", title:"Petzl Quark Ice Tool", url:"https://www.rei.com/", price:259, currency:"USD", inStock:true },
  ]
};

app.get('/health', (req, res) => res.json({ ok: true, use_live: USE_LIVE }));

app.get('/search', async (req, res) => {
  const kw = (req.query.kw || '').toString().trim();
  if (!kw) return res.status(400).json({ error: 'missing kw' });

  if (!USE_LIVE) {
    const key = kw.toLowerCase();
    const items = (DEMO[key] || []).map(shape);
    return res.json({ items });
  }

  try {
    const adapters = [universalUSD, rei, backcountry, omcgear, enwild, gregory, mysteryRanch, osprey];
    const results = await Promise.allSettled(adapters.map(fn => fn(kw)));
    const merged = [];
    for (const r of results) {
      if (r.status === 'fulfilled' && Array.isArray(r.value)) {
        merged.push(...r.value.map(shape));
      }
    }
    // Keep only in-stock
    const inStock = merged.filter(x => x.inStock);
    res.json({ items: inStock });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'search_failed', message: String(e) });
  }
});

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT} (USE_LIVE=${USE_LIVE})`);
});
