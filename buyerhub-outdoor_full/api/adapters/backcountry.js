import { serpDomainSearch } from './serpCommon.js';

/** Backcountry live adapter (broad coverage via SerpAPI) */
export async function backcountry(keyword){
  return await serpDomainSearch(keyword, 'backcountry.com', 'Backcountry');
}
