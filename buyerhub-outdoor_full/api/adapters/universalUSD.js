import { serpDomainSearch } from './serpCommon.js';

/**
 * Universal USD adapter:
 * Scans a curated allowlist of US-centric domains (retail + secondary markets) and aggregates in-stock USD prices.
 * Add/remove domains here to broaden coverage.
 */
const ALLOW_USD_DOMAINS = [
  // Retailers (US)
  'rei.com',
  'backcountry.com',
  'omcgear.com',
  'enwild.com',
  'moosejaw.com',
  'campmor.com',
  'backcountrygear.com',
  'stp.com',           // Sierra Trading Post
  'steepandcheap.com', // Backcountry outlet (USD)

  // Brand US sites that commonly list USD
  'gregorypacks.com',
  'mysteryranch.com',
  'osprey.com',
  'patagonia.com',
  'blackdiamondequipment.com',
  'arcteryx.com',  // many pages localize; serp filter still helps surface USD pages

  // Secondary markets (USD)
  'stockx.com',
  'goat.com',
  'ebay.com',
  'geartrade.com',
];

export async function universalUSD(keyword){
  const items = [];
  for (const domain of ALLOW_USD_DOMAINS){
    const vendor = domain.replace('www.','');
    const arr = await serpDomainSearch(keyword, domain, vendor);
    items.push(...arr);
  }
  // de-duplicate by URL
  const seen = new Set();
  const dedup = [];
  for (const it of items){
    if (seen.has(it.url)) continue;
    seen.add(it.url);
    dedup.push(it);
  }
  return dedup;
}
