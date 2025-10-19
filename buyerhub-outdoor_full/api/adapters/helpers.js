import fetch from 'cross-fetch';

/** Simple delay */
export const sleep = (ms) => new Promise(r => setTimeout(r, ms));

/** Fetch text with retries */
export async function fetchText(url, { tries = 3, timeout = 15000, headers = {} } = {}) {
  let lastErr;
  for (let i=0;i<tries;i++){
    try{
      const ctrl = new AbortController();
      const t = setTimeout(()=>ctrl.abort(), timeout);
      const resp = await fetch(url, { headers, signal: ctrl.signal });
      clearTimeout(t);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      return await resp.text();
    }catch(e){
      lastErr = e;
      await sleep(500 * (i+1));
    }
  }
  throw lastErr;
}

/** crude price extractor: finds the lowest positive $number style in the page */
export function extractUSD(html){
  const prices = [];
  // $1,234.56 or 1234.56 USD
  const re = /\$?\s?([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]{2})|[0-9]+(?:\.[0-9]{2}))\s?(USD)?/gi;
  let m;
  while ((m = re.exec(html))){
    const raw = m[1].replace(/,/g,'');
    const val = parseFloat(raw);
    if (!Number.isNaN(val) && val > 1 && val < 10000) prices.push(val);
  }
  if (!prices.length) return null;
  return Math.min(...prices);
}

/** stock heuristics */
export function inferInStock(html){
  const hx = html.toLowerCase();
  if (hx.includes('out of stock') || hx.includes('sold out') || hx.includes('backordered')) return false;
  if (hx.includes('in stock') || hx.includes('add to cart') || hx.includes('add-to-cart')) return true;
  return true; // default optimistic
}

/** normalize */
export function normItem(o){
  return {
    id: o.id || o.url,
    vendor: o.vendor,
    vendorRegion: o.vendorRegion || 'US',
    brand: o.brand || '',
    category: o.category || '',
    title: o.title,
    url: o.url,
    price: o.price,
    currency: 'USD',
    inStock: o.inStock,
    image: o.image || '',
    rating: o.rating,
    reviews: o.reviews
  };
}
