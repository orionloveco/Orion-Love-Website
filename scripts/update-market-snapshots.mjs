import fs from 'fs';
import path from 'path';

const baseUrl = process.env.MARKET_STATS_BASE_URL || 'https://orion-market-stats.orion-love-co.workers.dev';
const apiKey = process.env.MARKET_STATS_API_KEY;
const authMethod = (process.env.MARKET_STATS_AUTH_METHOD || 'auto').toLowerCase();
const marketEndpoint = new URL('/api/market-stats', baseUrl).toString();
const pages = [['sell-redlands.html','redlands','Redlands'],['sell-orchard-mesa.html','orchard_mesa','Orchard Mesa'],['sell-fruita.html','fruita','Fruita'],['sell-palisade.html','palisade','Palisade'],['sell-clifton.html','clifton','Clifton'],['sell-downtown-grand-junction.html','downtown_grand_junction','Downtown Grand Junction'],['sell-north-grand-junction.html','north_grand_junction','North Grand Junction'],['sell-northeast-grand-junction.html','northeast_grand_junction_fruitvale','Northeast Grand Junction'],['sell-northwest-grand-junction.html','northwest_grand_junction_appleton','Northwest Grand Junction'],['sell-loma-mack.html','loma_mack','Loma / Mack']];

const MARKET_STAT_SOURCE_KEYS = {
  medianPrice: ['medianPrice', 'medianSalePrice', 'medianListPrice'],
  averageDaysOnMarket: ['averageDaysOnMarket', 'avgDaysOnMarket', 'averageDom'],
  newListings: ['newListings', 'newListings30d', 'newListings30Days'],
  totalListings: ['totalListings', 'activeListings'],
};

function buildHeaders(method) {
  const headers = { Accept: 'application/json' };
  if (!apiKey) return headers;
  if (method === 'bearer') headers.Authorization = `Bearer ${apiKey}`;
  if (method === 'x-api-key') headers['x-api-key'] = apiKey;
  return headers;
}

async function fetchMarketPayload() {
  const methods = authMethod === 'auto' ? ['bearer', 'x-api-key', 'none'] : [authMethod];
  let lastError;
  for (const method of methods) {
    const headers = method === 'none' ? { Accept: 'application/json' } : buildHeaders(method);
    try {
      const res = await fetch(marketEndpoint, { headers });
      if (!res.ok) {
        lastError = new Error(`Failed fetch ${res.status} with ${method}`);
        continue;
      }
      const json = await res.json();
      return { payload: json, method };
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError || new Error('Unknown market stats fetch failure');
}

function parseMarketStatValue(value) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value !== 'string' || value.trim() === '') return null;

  const numericValue = Number(value.replace(/[$,]/g, '').replace(/\s*days?$/i, '').trim());
  return Number.isFinite(numericValue) ? numericValue : null;
}

function getMarketStatValue(stats, statKey) {
  if (!stats || typeof stats !== 'object') return null;

  const sourceKeys = MARKET_STAT_SOURCE_KEYS[statKey] || [statKey];
  for (const sourceKey of sourceKeys) {
    if (!Object.prototype.hasOwnProperty.call(stats, sourceKey)) continue;

    const numericValue = parseMarketStatValue(stats[sourceKey]);
    if (numericValue !== null) return numericValue;
  }

  return null;
}

function getExistingStat(html, statKey, fallback = 'Unavailable') {
  const pattern = new RegExp(`<[^>]+data-market-stat=["']${statKey}["'][^>]*>([\\s\\S]*?)<\\/[^>]+>`);
  const match = html.match(pattern);
  return match ? match[1].trim() : fallback;
}

const c = (v, fallback = 'Unavailable') => Number.isFinite(v) ? `$${Math.round(v).toLocaleString()}` : fallback;
const n = (v, fallback = 'Unavailable') => Number.isFinite(v) ? Math.round(v).toLocaleString() : fallback;
const d = (v, fallback = 'Unavailable') => Number.isFinite(v) ? `${Math.round(v)} days` : fallback;
const dt = (v) => new Date(v).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

let payload = { areas: {}, generatedAt: new Date().toISOString() };
try {
  const result = await fetchMarketPayload();
  payload = result.payload;
  console.log(`Market stats fetch succeeded with auth method: ${result.method}`);
} catch (err) {
  console.warn(`Market stats fetch failed: ${err.message}`);
}

const areas = payload.areas || {};
const generatedAt = payload.generatedAt || new Date().toISOString();
const results = [];
fs.mkdirSync('market-data', { recursive: true });

for (const [file, key, label] of pages) {
  if (!fs.existsSync(file)) continue;
  let html = fs.readFileSync(file, 'utf8');
  const s = areas[key];
  if (!s) {
    console.warn(`No valid data for ${key}; keeping existing fallback in ${file}`);
    continue;
  }

  const start = `<!-- MARKET_SNAPSHOT_START: ${key} -->`;
  const end = `<!-- MARKET_SNAPSHOT_END: ${key} -->`;
  const statValues = {
    medianPrice: getMarketStatValue(s, 'medianPrice'),
    averageDaysOnMarket: getMarketStatValue(s, 'averageDaysOnMarket'),
    totalListings: getMarketStatValue(s, 'totalListings'),
    newListings: getMarketStatValue(s, 'newListings'),
  };
  const report = s.lastUpdatedDate || generatedAt;

  if (!html.includes(start)) html = html.replace(/(<section class="site-section[\s\S]*?seller-neighborhood-market-snapshot[\s\S]*?<\/section>)/, `${start}\n$1\n${end}`);

  const renderedStats = {
    medianPrice: c(statValues.medianPrice, getExistingStat(html, 'medianPrice')),
    averageDaysOnMarket: d(statValues.averageDaysOnMarket, getExistingStat(html, 'averageDaysOnMarket')),
    totalListings: n(statValues.totalListings, getExistingStat(html, 'totalListings')),
    newListings: n(statValues.newListings, getExistingStat(html, 'newListings')),
  };

  const replacement = `${start}\n<section id="${key.replace(/_/g, '-')}-market-snapshot" class="market-snapshot">\n  <div class="stat-grid local-area-stat-grid" data-market-area="${key}" data-market-area-label="${label}" data-market-currency="html">\n    <div class="stat-box card-stat"><div class="stat-val" data-market-stat="medianPrice">${renderedStats.medianPrice}</div><div class="stat-lbl">Median Sale Price</div></div>\n    <div class="stat-box card-stat"><div class="stat-val" data-market-stat="averageDaysOnMarket">${renderedStats.averageDaysOnMarket}</div><div class="stat-lbl">Avg. Days on Market</div></div>\n    <div class="stat-box card-stat"><div class="stat-val" data-market-stat="totalListings">${renderedStats.totalListings}</div><div class="stat-lbl">Active Listings</div></div>\n    <div class="stat-box card-stat"><div class="stat-val" data-market-stat="newListings">${renderedStats.newListings}</div><div class="stat-lbl">New Listings (30 Days)</div></div>\n    <p class="market-status-note" data-market-note="true">Reporting period: ${dt(report)}. Source: Orion Love Market Stats Worker/KV snapshot. Last updated: ${dt(generatedAt)}.</p>\n  </div>\n</section>\n${end}`;

  html = html.replace(new RegExp(`${start}[\\s\\S]*?${end}`), replacement);
  const alt = `/market-data/${key}-latest.json`;
  if (!html.includes(alt)) html = html.replace('</head>', `  <link rel="alternate" type="application/json" href="${alt}">\n</head>`);

  const dsStart = `<!-- MARKET_DATASET_START: ${key} -->`;
  const dsEnd = `<!-- MARKET_DATASET_END: ${key} -->`;
  const ds = `${dsStart}\n<script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@type":"Dataset",name:`${label} housing market snapshot`,url:`https://orionlovehomes.com/${file.replace('.html','')}`,dateModified:new Date(generatedAt).toISOString(),distribution:{"@type":"DataDownload",encodingFormat:"application/json",contentUrl:`https://orionlovehomes.com${alt}`},variableMeasured:[{"@type":"PropertyValue",name:"Median Sale Price",value:renderedStats.medianPrice},{"@type":"PropertyValue",name:"Average Days on Market",value:renderedStats.averageDaysOnMarket},{"@type":"PropertyValue",name:"Active Listings",value:renderedStats.totalListings},{"@type":"PropertyValue",name:"New Listings (30 Days)",value:renderedStats.newListings}]})}</script>\n${dsEnd}`;

  if (html.includes(dsStart)) html = html.replace(new RegExp(`${dsStart}[\\s\\S]*?${dsEnd}`), ds);
  else html = html.replace('</head>', `${ds}\n</head>`);

  const snapshotStats = Object.fromEntries(Object.entries(statValues).filter(([, value]) => value !== null));
  fs.writeFileSync(file, html);
  fs.writeFileSync(path.join('market-data', `${key}-latest.json`), JSON.stringify({ areaKey: key, areaName: label, generatedAt, reportingPeriod: report, stats: { ...s, ...snapshotStats } }, null, 2));
  results.push([file, `market-data/${key}-latest.json`]);
}

console.log('Updated pages:');
results.forEach(r => console.log(`- ${r[0]}`));
console.log('Updated JSON:');
results.forEach(r => console.log(`- ${r[1]}`));
