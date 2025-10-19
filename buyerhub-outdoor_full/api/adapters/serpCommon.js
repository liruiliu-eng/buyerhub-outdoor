import fetch from 'cross-fetch';
import { fetchText, extractUSD, inferInStock, normItem, sleep } from './helpers.js';

/**
 * Use SerpAPI (if SERPAPI_KEY) to find product pages on a target domain, then scrape each page for price/stock.
 * Fallback: no results if key missing.
 */
export async function serpDomainSearch(keyword, domain, vendor){
  const key = process.env.SERPAPI_KEY;
  if (!key) return [];
  const items = [];
  let start = 0;
  // try up to 3 pages (approx 30 results/page * 3 = 90 URLs)
  for (let page=0; page<3; page++){
    const u = new URL('https://serpapi.com/search.json');
    u.searchParams.set('engine', 'google');
    u.searchParams.set('q', `${keyword} site:${domain}`);
    u.searchParams.set('hl', 'en');
    u.searchParams.set('num', '100');
    if (start) u.searchParams.set('start', String(start));
    u.searchParams.set('api_key', key);
    const resp = await fetch(u.toString());
    if (!resp.ok) break;
    const data = await resp.json();
    const links = [];
    const organic = data.organic_results || [];
    for (const r of organic){
      if (r.link && r.link.includes(domain)){
        links.push(r.link);
      }
    }
    // dedupe
    const seen = new Set();
    for (const link of links){
      if (seen.has(link)) continue;
      seen.add(link);
      try{
        const html = await fetchText(link, { tries: 2, timeout: 15000 });
        const price = extractUSD(html);
        if (!price) continue;
        const title = (html.match(/<title[^>]*>(.*?)<\/title>/i)?.[1] || `${keyword}`).replace(/\s+/g,' ').trim();
        const inStock = inferInStock(html);
        if (!inStock) continue; // only in-stock
        items.push(normItem({ vendor, url: link, title, price, inStock }));
        await sleep(200); // be polite
      }catch(e){
        // ignore
      }
    }
    // next page
    start += 100;
    await sleep(400);
  }
  return items;
}
