import { serpDomainSearch } from './serpCommon.js';

/** REI live adapter (broad coverage via SerpAPI) */
export async function rei(keyword){
  return await serpDomainSearch(keyword, 'rei.com', 'REI');
}
