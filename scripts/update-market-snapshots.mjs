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

const MARKET_STAT_FORMATTERS = {
  medianPrice: (value, fallback = 'Unavailable') => Number.isFinite(value) ? `$${Math.round(value).toLocaleString()}` : fallback,
  averageDaysOnMarket: (value, fallback = 'Unavailable') => Number.isFinite(value) ? `${Math.round(value)} days` : fallback,
  totalListings: (value, fallback = 'Unavailable') => Number.isFinite(value) ? Math.round(value).toLocaleString() : fallback,
  newListings: (value, fallback = 'Unavailable') => Number.isFinite(value) ? Math.round(value).toLocaleString() : fallback,
};

const DATASET_MEASUREMENTS = [
  ['medianPrice', 'Median Sale Price'],
  ['averageDaysOnMarket', 'Average Days on Market'],
  ['totalListings', 'Active Listings'],
  ['newListings', 'New Listings (30 Days)'],
];

const args = new Set(process.argv.slice(2));
const getArgValue = (name) => {
  const prefix = `${name}=`;
  const inline = process.argv.slice(2).find((arg) => arg.startsWith(prefix));
  if (inline) return inline.slice(prefix.length);

  const index = process.argv.indexOf(name);
  if (index !== -1 && process.argv[index + 1]) return process.argv[index + 1];

  return null;
};
const dryRun = args.has('--dry-run') || process.env.MARKET_STATS_DRY_RUN === '1';
const rootDir = path.resolve(getArgValue('--root') || process.env.MARKET_STATS_ROOT || process.cwd());
const payloadFile = getArgValue('--payload-file') || process.env.MARKET_STATS_PAYLOAD_FILE;

function resolveFromRoot(file) {
  return path.join(rootDir, file);
}

function readJsonFile(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function buildHeaders(method) {
  const headers = { Accept: 'application/json' };
  if (!apiKey) return headers;
  if (method === 'bearer') headers.Authorization = `Bearer ${apiKey}`;
  if (method === 'x-api-key') headers['x-api-key'] = apiKey;
  return headers;
}

async function fetchMarketPayload() {
  if (payloadFile) {
    return { payload: readJsonFile(path.resolve(payloadFile)), method: `payload-file:${payloadFile}` };
  }

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

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function parseMarketStatValue(value) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value !== 'string' || value.trim() === '') return null;

  const numericValue = Number(value.replace(/<[^>]+>/g, '').replace(/[$,]/g, '').replace(/\s*days?$/i, '').trim());
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

function hasMarketAreaBlock(html, areaKey) {
  const key = escapeRegExp(areaKey);
  return new RegExp(`<[^>]+data-market-area=["']${key}["'][^>]*>`).test(html);
}

function getExistingStat(html, areaKey, statKey, fallback = 'Unavailable') {
  const key = escapeRegExp(areaKey);
  const stat = escapeRegExp(statKey);
  const pattern = new RegExp(`(<[^>]+data-market-area=["']${key}["'][^>]*>[\\s\\S]*?<[^>]+data-market-stat=["']${stat}["'][^>]*>)([\\s\\S]*?)(<\\/[^>]+>)`);
  const match = html.match(pattern);
  return match ? match[2].trim() : fallback;
}

function replaceAreaStat(html, areaKey, statKey, value) {
  const key = escapeRegExp(areaKey);
  const stat = escapeRegExp(statKey);
  const pattern = new RegExp(`(<[^>]+data-market-area=["']${key}["'][^>]*>[\\s\\S]*?<[^>]+data-market-stat=["']${stat}["'][^>]*>)([\\s\\S]*?)(<\\/[^>]+>)`);

  if (!pattern.test(html)) {
    console.warn(`Missing data-market-stat="${statKey}" inside data-market-area="${areaKey}"; preserving ${statKey}`);
    return html;
  }

  return html.replace(pattern, `$1${value}$3`);
}

function getExistingNote(html, areaKey, fallback = '') {
  const key = escapeRegExp(areaKey);
  const pattern = new RegExp(`(<[^>]+data-market-area=["']${key}["'][^>]*>[\\s\\S]*?<[^>]+data-market-note=["']true["'][^>]*>)([\\s\\S]*?)(<\\/[^>]+>)`);
  const match = html.match(pattern);
  return match ? match[2].trim() : fallback;
}

function replaceAreaNote(html, areaKey, value) {
  const key = escapeRegExp(areaKey);
  const pattern = new RegExp(`(<[^>]+data-market-area=["']${key}["'][^>]*>[\\s\\S]*?<[^>]+data-market-note=["']true["'][^>]*>)([\\s\\S]*?)(<\\/[^>]+>)`);

  if (!pattern.test(html)) {
    console.warn(`Missing data-market-note="true" inside data-market-area="${areaKey}"; preserving note`);
    return html;
  }

  return html.replace(pattern, `$1${value}$3`);
}

function parseValidDate(value) {
  if (!value) return null;

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function toIsoString(value, fallback = new Date()) {
  return (parseValidDate(value) || fallback).toISOString();
}

function formatUpdatedDate(value) {
  const parsed = parseValidDate(value);
  if (!parsed) return null;

  return parsed.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function buildMarketNote(reportingPeriod, fallback) {
  const formattedDate = formatUpdatedDate(reportingPeriod);
  return formattedDate ? `Source: RentCast market data. Last updated: ${formattedDate}.` : fallback;
}

function getDatasetJson(label, file, areaKey, generatedAt, alt, renderedStats) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: `${label} housing market snapshot`,
    url: `https://orionlovehomes.com/${file.replace('.html', '')}`,
    dateModified: toIsoString(generatedAt),
    distribution: {
      '@type': 'DataDownload',
      encodingFormat: 'application/json',
      contentUrl: `https://orionlovehomes.com${alt}`,
    },
    variableMeasured: DATASET_MEASUREMENTS.map(([statKey, name]) => ({
      '@type': 'PropertyValue',
      name,
      value: renderedStats[statKey],
    })),
  };
}

function updateDatasetJsonLd(html, areaKey, dataset) {
  const dsStart = `<!-- MARKET_DATASET_START: ${areaKey} -->`;
  const dsEnd = `<!-- MARKET_DATASET_END: ${areaKey} -->`;
  const ds = `${dsStart}\n<script type="application/ld+json">${JSON.stringify(dataset)}</script>\n${dsEnd}`;

  if (html.includes(dsStart)) return html.replace(new RegExp(`${escapeRegExp(dsStart)}[\\s\\S]*?${escapeRegExp(dsEnd)}`), ds);
  return html.replace('</head>', `${ds}\n</head>`);
}

function addAlternateJsonLink(html, alt) {
  if (html.includes(alt)) return html;
  return html.replace('</head>', `  <link rel="alternate" type="application/json" href="${alt}">\n</head>`);
}

function writeFileIfChanged(file, content) {
  if (dryRun) return false;

  const existing = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
  if (existing === content) return false;

  fs.writeFileSync(file, content);
  return true;
}

let payload = { areas: {}, generatedAt: new Date().toISOString() };
try {
  const result = await fetchMarketPayload();
  payload = result.payload;
  console.log(`Market stats fetch succeeded with auth method: ${result.method}`);
} catch (err) {
  console.warn(`Market stats fetch failed: ${err.message}`);
}

const areas = payload.areas || {};
const generatedAt = toIsoString(payload.generatedAt);
const results = [];
if (!dryRun) fs.mkdirSync(resolveFromRoot('market-data'), { recursive: true });

for (const [file, key, label] of pages) {
  const pagePath = resolveFromRoot(file);
  if (!fs.existsSync(pagePath)) continue;

  let html = fs.readFileSync(pagePath, 'utf8');
  const s = areas[key];
  if (!s || typeof s !== 'object') {
    console.warn(`No valid data for ${key}; keeping existing fallback in ${file}`);
    continue;
  }

  if (!hasMarketAreaBlock(html, key)) {
    console.warn(`No data-market-area="${key}" block found in ${file}; skipping to avoid replacing rebuilt area-detail markup`);
    continue;
  }

  const statValues = {
    medianPrice: getMarketStatValue(s, 'medianPrice'),
    averageDaysOnMarket: getMarketStatValue(s, 'averageDaysOnMarket'),
    totalListings: getMarketStatValue(s, 'totalListings'),
    newListings: getMarketStatValue(s, 'newListings'),
  };
  const reportingPeriod = s.lastUpdatedDate || generatedAt;
  const renderedStats = Object.fromEntries(Object.entries(statValues).map(([statKey, value]) => {
    const fallback = getExistingStat(html, key, statKey);
    return [statKey, MARKET_STAT_FORMATTERS[statKey](value, fallback)];
  }));

  for (const [statKey, renderedValue] of Object.entries(renderedStats)) {
    html = replaceAreaStat(html, key, statKey, renderedValue);
  }

  const existingNote = getExistingNote(html, key);
  html = replaceAreaNote(html, key, buildMarketNote(reportingPeriod, existingNote));

  const alt = `/market-data/${key}-latest.json`;
  html = addAlternateJsonLink(html, alt);
  const dataset = getDatasetJson(label, file, key, generatedAt, alt, renderedStats);
  html = updateDatasetJsonLd(html, key, dataset);

  const renderedStatValues = Object.fromEntries(Object.entries(renderedStats).map(([statKey, value]) => [statKey, parseMarketStatValue(value)]));
  const snapshotStats = Object.fromEntries(Object.entries(renderedStatValues).filter(([, value]) => value !== null));
  const jsonOutput = JSON.stringify({ areaKey: key, areaName: label, generatedAt, reportingPeriod, stats: { ...s, ...snapshotStats } }, null, 2);
  const jsonPath = resolveFromRoot(path.join('market-data', `${key}-latest.json`));

  const pageChanged = writeFileIfChanged(pagePath, html);
  const jsonChanged = writeFileIfChanged(jsonPath, jsonOutput);
  results.push([file, `market-data/${key}-latest.json`, pageChanged, jsonChanged]);
}

console.log(dryRun ? 'Dry run complete. No files written.' : 'Updated pages:');
results.forEach(([page, , pageChanged]) => console.log(`- ${page}${dryRun ? '' : pageChanged ? '' : ' (unchanged)'}`));
console.log(dryRun ? 'JSON files checked:' : 'Updated JSON:');
results.forEach(([, jsonFile, , jsonChanged]) => console.log(`- ${jsonFile}${dryRun ? '' : jsonChanged ? '' : ' (unchanged)'}`));
