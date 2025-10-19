import fetch from 'cross-fetch';
import * as cheerio from 'cheerio';

/**
 * Adapter for Mystery Ranch
 * - Return array of items: [{ id, vendor, vendorRegion, brand, category, title, url, price, currency:'USD', inStock, image }]
 * - Implement real parsing when USE_LIVE=true
 */
export async function mysteryRanch(keyword) {
  // TODO: Replace with real fetch & parse logic for Mystery Ranch.
  // Keep a light rate limit and respect robots.txt.
  // Example (pseudocode):
  // const resp = await fetch(`https://www.mysteryranch.com/search?q=${encodeURIComponent(keyword)}`);
  // const html = await resp.text();
  // const $ = cheerio.load(html);
  // const items = [];
  // $('.product-card').each((_, el) => {
  //   const title = $(el).find('.product-title').text().trim();
  //   const url = new URL($(el).find('a').attr('href'), 'https://www.mysteryranch.com').toString();
  //   const price = parseFloat($(el).find('.price').text().replace(/[^0-9.]/g,''));
  //   const inStock = !/out of stock/i.test($(el).text());
  //   if (inStock) items.push({ id: url, vendor: 'Mystery Ranch', vendorRegion: 'US', brand: '', category: '', title, url, price, currency:'USD', inStock, image: '' });
  // });
  // return items;
  return []; // Placeholder if USE_LIVE=true and not implemented yet
}
