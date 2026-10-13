// Fills the housing market page and the area guides from market-data/mesa-market-latest.json,
// the file the Monday "Mesa County Weekly Market Pulse" task writes from the GJARA MLS.
//
//   node scripts/update-market-from-mls.mjs            write the pages
//   node scripts/update-market-from-mls.mjs --check    exit 1 if any page is out of date
//   node scripts/update-market-from-mls.mjs --root=DIR --data=FILE   (used by the tests)
//
// Every number and every sentence built on a number is generated here, between
// <!-- mls:NAME --> ... <!-- /mls:NAME --> markers, so nobody edits them by hand.
// If the data file is missing something, the script stops before writing anything.
//
// MLS rules (GJARA Section 13): aggregate statistics only, never individual properties, and every
// page that shows them carries the "Based on information from..." notice with its period.

import fs from 'fs';
import path from 'path';

const argValue = (name) => {
  const inline = process.argv.slice(2).find((arg) => arg.startsWith(`${name}=`));
  return inline ? inline.slice(name.length + 1) : null;
};
const root = path.resolve(argValue('--root') || process.cwd());
const dataPath = path.resolve(argValue('--data') || path.join(root, 'market-data/mesa-market-latest.json'));
const checkOnly = process.argv.includes('--check');

// MLS area name -> how the site names it. `page` is the area guide, when one exists.
const AREAS = [
  { mls: 'Redlands', label: 'Redlands', name: 'the Redlands', group: 'city', page: 'sell-redlands' },
  { mls: 'Orchard Mesa', label: 'Orchard Mesa', name: 'Orchard Mesa', group: 'city', page: 'sell-orchard-mesa' },
  { mls: 'Grand Junction City', label: 'Central Grand Junction', name: 'central Grand Junction', group: 'city', page: 'sell-downtown-grand-junction' },
  { mls: 'North Grand Junction', label: 'North Grand Junction', name: 'North Grand Junction', group: 'city', page: 'sell-north-grand-junction' },
  { mls: 'NE Grand Junction', label: 'NE Grand Junction', name: 'Northeast Grand Junction', group: 'city', page: 'sell-northeast-grand-junction' },
  { mls: 'SE Grand Junction', label: 'SE Grand Junction', name: 'Southeast Grand Junction', group: 'city', page: null },
  { mls: 'NW Grand Junction', label: 'NW Grand Junction', name: 'Northwest Grand Junction', group: 'city', page: 'sell-northwest-grand-junction' },
  { mls: 'Fruita', label: 'Fruita', name: 'Fruita', group: 'surrounding', page: 'sell-fruita' },
  { mls: 'Loma / Mack', label: 'Loma &amp; Mack', name: 'Loma and Mack', group: 'surrounding', page: 'sell-loma-mack' },
  { mls: 'Palisade', label: 'Palisade', name: 'Palisade', group: 'surrounding', page: 'sell-palisade' },
  { mls: 'Clifton', label: 'Clifton', name: 'Clifton', group: 'surrounding', page: 'sell-clifton' },
  { mls: 'Other Mesa County', label: 'Other Mesa County', name: 'the rest of Mesa County', group: 'surrounding', page: null },
];

const BANDS = {
  'Under $300k': { label: 'Under $300,000', phrase: 'under $300,000' },
  '$300–400k': { label: '$300,000 to $400,000', phrase: 'from $300,000 to $400,000' },
  '$400–500k': { label: '$400,000 to $500,000', phrase: 'from $400,000 to $500,000' },
  '$500–750k': { label: '$500,000 to $750,000', phrase: 'from $500,000 to $750,000' },
  '$750k+': { label: '$750,000 and up', phrase: 'at $750,000 and up' },
};

const COUNTY_METRICS = {
  closings: 'Closings (4 weeks)',
  medianSold: 'Median sold price (4 weeks)',
  medianDays: 'Median days on market (4 weeks)',
  soldToList: 'Sold-to-list ratio, median per sale (4 weeks)',
  pricePerSqFt: 'Median sold price per sq ft (4 weeks)',
  concessionCount: 'Sales with a seller concession (4 weeks)',
  concessionShare: 'Share of sales with a seller concession (4 weeks)',
  concessionMedian: 'Median seller concession (4 weeks)',
  active: 'Active listings',
  monthsOfSupply: 'Months of supply',
  over90Share: 'Share of active listings on market more than 90 days',
  priceCuts: 'Price reductions (past 7 days)',
  medianCut: 'Median price cut from original list (past 7 days)',
};

// A median built on fewer sales than this isn't shown.
const MIN_SALES_FOR_MEDIAN = 3;
// Areas need at least this many sales to be named highest or lowest priced.
const MIN_SALES_FOR_RANKING = 10;

class DataError extends Error {}
const fail = (message) => { throw new DataError(message); };

const toNumber = (value) => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value !== 'string') return null;
  const cleaned = value.replace(/[$,%\s]/g, '');
  if (cleaned === '' || !/^-?\d+(\.\d+)?$/.test(cleaned)) return null;
  return Number(cleaned);
};
const money = (n) => `$${Math.round(n).toLocaleString('en-US')}`;
const count = (n) => Math.round(n).toLocaleString('en-US');
const cardMoney = (n) => (n >= 1000000
  ? `$${(n / 1000000).toFixed(2).replace(/0$/, '').replace(/\.0$/, '')}M`
  : `$${Math.round(n / 1000)}K`);
const longDate = (iso) => {
  const d = new Date(`${iso}T12:00:00Z`);
  if (Number.isNaN(d.getTime())) fail(`Bad date in data file: ${iso}`);
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
};
const shortDate = (iso) => longDate(iso).replace(/, \d{4}$/, '');
const numberWord = (n) => ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'][n] || String(n);
const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

// "45.3" -> "nearly half". Used for headlines so they stay true as the numbers move.
function shareWords(pct) {
  if (pct >= 90) return 'nearly all';
  if (pct >= 70) return 'most';
  if (pct >= 55) return 'more than half';
  if (pct >= 50) return 'about half';
  if (pct >= 44) return 'nearly half';
  if (pct >= 38) return 'about four in ten';
  if (pct >= 30) return 'about a third';
  if (pct >= 22) return 'about a quarter';
  if (pct >= 15) return 'about one in five';
  if (pct >= 8) return 'about one in ten';
  return 'very few';
}

function loadData() {
  if (!fs.existsSync(dataPath)) fail(`Data file not found: ${dataPath}`);
  let raw;
  try { raw = JSON.parse(fs.readFileSync(dataPath, 'utf8')); } catch (err) { fail(`Data file is not valid JSON: ${err.message}`); }

  const period = raw.period || {};
  for (const key of ['fourWeekStart', 'fourWeekEnd', 'thirteenWeekStart', 'thirteenWeekEnd', 'activeCountedOn']) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(period[key] || '')) fail(`Missing or bad period.${key}`);
  }

  const countyRows = new Map((raw.county || []).map((row) => [row.metric, row]));
  const county = {};
  for (const [key, metric] of Object.entries(COUNTY_METRICS)) {
    const row = countyRows.get(metric);
    if (!row) fail(`County metric missing: ${metric}`);
    const value = toNumber(row.value);
    if (value === null) fail(`County metric is not a number: ${metric} = ${row.value}`);
    county[key] = { value, lastYear: toNumber(row.samePeriodLastYear) };
  }

  const bandRows = new Map((raw.priceBands || []).map((row) => [row.priceBand, row]));
  const bands = Object.entries(BANDS).map(([key, info]) => {
    const row = bandRows.get(key);
    if (!row) fail(`Price band missing: ${key}`);
    const active = toNumber(row.activeListings);
    const months = toNumber(row.monthsOfSupply);
    if (active === null || months === null) fail(`Price band has a bad number: ${key}`);
    return { ...info, active, months };
  });

  const areaRows = new Map((raw.areas || []).map((row) => [row.area, row]));
  const areas = AREAS.map((info) => {
    const row = areaRows.get(info.mls);
    if (!row) fail(`Area missing: ${info.mls}`);
    const active = toNumber(row.activeListings);
    const closings4 = toNumber(row.closings4wk);
    const closings13 = toNumber(row.closings13wk);
    if (active === null || closings4 === null || closings13 === null) fail(`Area has a bad count: ${info.mls}`);
    const enough = closings13 >= MIN_SALES_FOR_MEDIAN;
    return {
      ...info,
      active,
      closings4,
      closings13,
      median13: enough ? toNumber(row.medianSold13wk) : null,
      days13: enough ? toNumber(row.medianDays13wk) : null,
    };
  });
  const unknown = [...areaRows.keys()].filter((name) => !AREAS.some((a) => a.mls === name));
  if (unknown.length) fail(`Unrecognized area name(s) in data file: ${unknown.join(', ')}`);

  const areaActive = areas.reduce((sum, a) => sum + a.active, 0);
  if (Math.abs(areaActive - county.active.value) > county.active.value * 0.02) {
    console.warn(`Warning: area listings add up to ${areaActive}, county total is ${county.active.value}.`);
  }
  return { period, county, bands, areas };
}

/* ---------- Sentences ---------- */

function yearOverYear(now, lastYear) {
  if (lastYear === null || lastYear === 0) return null;
  const pct = Math.round(((now - lastYear) / lastYear) * 100);
  if (pct === 0) return { sentence: `about level with ${money(lastYear)} in the same period last year`, card: 'About level with a year ago' };
  const direction = pct > 0 ? 'up' : 'down';
  return {
    sentence: `${direction} about ${Math.abs(pct)}% from ${money(lastYear)} in the same period last year`,
    card: `${capitalize(direction)} about ${Math.abs(pct)}% from a year ago`,
  };
}

function creditLine(start, end) {
  return `Based on information from the Grand Junction Area REALTOR® Association MLS for the period ${longDate(start)} through ${longDate(end)}.`;
}

function buildMarketBody({ period, county, bands, areas }) {
  const activeDay = shortDate(period.activeCountedOn);
  const yoy = yearOverYear(county.medianSold.value, county.medianSold.lastYear);
  const pulse = `In the past month, the median sold price in Mesa County was ${money(county.medianSold.value)}${yoy ? `, ${yoy.sentence}` : ''}. Homes sold after a median of ${count(county.medianDays.value)} days, for ${county.soldToList.value}% of their final list price, at a median of ${money(county.pricePerSqFt.value)} per square foot.`;

  const fastest = bands.reduce((a, b) => (b.months < a.months ? b : a));
  const slowest = bands.reduce((a, b) => (b.months > a.months ? b : a));
  const slowestRead = slowest.months >= 6
    ? `Homes priced ${slowest.phrase} have ${slowest.months.toFixed(1)} months, so buyers there have more room to negotiate.`
    : `Homes priced ${slowest.phrase} are the slowest, at ${slowest.months.toFixed(1)} months.`;
  const bandRead = `Homes priced ${fastest.phrase} are moving fastest, with ${fastest.months.toFixed(1)} months of supply. ${slowestRead}`;

  const ranked = areas.filter((a) => a.median13 !== null && a.closings13 >= MIN_SALES_FOR_RANKING);
  const highest = ranked.reduce((a, b) => (b.median13 > a.median13 ? b : a), ranked[0]);
  const lowest = ranked.reduce((a, b) => (b.median13 < a.median13 ? b : a), ranked[0]);
  const busiest = areas.reduce((a, b) => (b.closings4 > a.closings4 ? b : a));
  const mostListed = areas.reduce((a, b) => (b.active > a.active ? b : a));
  const priceRead = ranked.length >= 2
    ? `Over the past three months, ${highest.name} had the highest median sold price of the ${numberWord(areas.length)} areas (${money(highest.median13)}) and ${lowest.name} the lowest (${money(lowest.median13)}). `
    : '';
  const activityRead = busiest === mostListed
    ? `${capitalize(busiest.name)} had the most sales in the past month (${count(busiest.closings4)}) and the most homes for sale (${count(busiest.active)}).`
    : `${capitalize(busiest.name)} had the most sales in the past month (${count(busiest.closings4)}), and ${mostListed.name} had the most homes for sale (${count(mostListed.active)}).`;

  const areaRow = (a) => `              <tr>
                <th scope="row">${a.page ? `<a href="/${a.page}">${a.label}</a>` : `<span>${a.label}</span>`}</th>
                <td data-label="Median sold price">${a.median13 !== null ? money(a.median13) : 'Too few sales'}</td>
                <td data-label="Monthly sales">${count(a.closings4)}</td>
                <td data-label="Homes for sale">${count(a.active)}</td>
              </tr>`;
  const groupRow = (title) => `              <tr class="market-table__group"><th colspan="4" scope="colgroup">${title}</th></tr>`;
  const cityRows = areas.filter((a) => a.group === 'city').map(areaRow).join('\n');
  const surroundingRows = areas.filter((a) => a.group === 'surrounding').map(areaRow).join('\n');
  const bandRows = bands.map((b) => `              <tr>
                <th scope="row"><span>${b.label}</span></th>
                <td data-label="Homes for sale">${count(b.active)}</td>
                <td data-label="Months of supply">${b.months.toFixed(1)}</td>
              </tr>`).join('\n');

  const concessionPct = county.concessionShare.value;
  const over90Pct = county.over90Share.value;

  return `  <section class="market-pulse" aria-labelledby="market-pulse-title">
    <div class="editorial-shell">
      <div class="market-table-intro">
        <h2 id="market-pulse-title">Mesa County right now.</h2>
        <p class="market-highlights">${pulse}</p>
      </div>
      <div class="market-pulse__grid">
        <div class="market-pulse__stat"><strong>${money(county.medianSold.value)}</strong><span>Median sold price</span>${yoy ? `<em>${yoy.card}</em>` : ''}</div>
        <div class="market-pulse__stat"><strong>${county.monthsOfSupply.value.toFixed(1)}</strong><span>Months of supply</span><em>${count(county.active.value)} homes for sale on ${activeDay}</em></div>
        <div class="market-pulse__stat"><strong>${county.soldToList.value}%</strong><span>Sold price vs. list price</span><em>${count(county.closings.value)} sales in the past month</em></div>
        <div class="market-pulse__stat"><strong>${count(county.medianDays.value)} days</strong><span>Median days on market</span>${county.medianDays.lastYear !== null ? `<em>${count(county.medianDays.lastYear)} days a year ago</em>` : ''}</div>
      </div>
    </div>
  </section>

  <section class="market-bands" aria-labelledby="market-bands-title">
    <div class="editorial-shell market-bands__grid">
      <div>
        <h2 id="market-bands-title">It depends on your price range.</h2>
        <p class="market-bands__read">${bandRead}</p>
      </div>
      <div class="market-table-wrap">
        <table class="market-table market-table--bands">
          <caption class="visually-hidden">Months of supply by price range in Mesa County, Colorado</caption>
          <thead>
            <tr><th scope="col">Price range</th><th scope="col">Homes for sale</th><th scope="col">Months of supply</th></tr>
          </thead>
          <tbody>
${bandRows}
          </tbody>
        </table>
        <p class="market-page-note">Months of supply is how long it would take to sell every home now for sale at the recent pace of sales. Around five to six months is commonly treated as a balanced market.</p>
      </div>
    </div>
  </section>

  <section class="market-table-section" aria-labelledby="market-table-title">
    <div class="editorial-shell">
      <div class="market-table-intro">
        <h2 id="market-table-title">Area by area.</h2>
        <p class="market-highlights">${priceRead}${activityRead}</p>
      </div>
      <div class="market-table-wrap">
        <table class="market-table">
          <caption class="visually-hidden">Housing market figures by area in Grand Junction and Mesa County, Colorado</caption>
          <thead>
            <tr><th scope="col">Area</th><th scope="col">Median sold price</th><th scope="col">Monthly sales</th><th scope="col">Homes for sale</th></tr>
          </thead>
          <tbody>
${groupRow('Grand Junction')}
${cityRows}
          </tbody>
          <tbody>
${groupRow('Surrounding areas')}
${surroundingRows}
          </tbody>
        </table>
      </div>
      <p class="market-page-note">Each area&rsquo;s median sold price covers the past three months, so a small area isn&rsquo;t judged on a handful of sales.</p>
    </div>
  </section>

  <section class="market-sellers" aria-label="What sellers are giving up">
    <div class="editorial-shell">
      <div class="market-sellers__list">
        <div class="market-seller-note">
          <h3>${capitalize(shareWords(concessionPct))} of sales include a seller concession.</h3>
          <p>In the past month, ${count(county.concessionCount.value)} of ${count(county.closings.value)} sales (${Math.round(concessionPct)}%) included money from the seller toward the buyer&rsquo;s costs. The median concession was ${money(county.concessionMedian.value)}. <a href="/blog-best-offer-not-highest">How to weigh a concession against the price</a>.</p>
        </div>
        <div class="market-seller-note">
          <h3>${count(county.priceCuts.value)} listings cut their price in one week.</h3>
          <p>That was the week ending ${shortDate(period.fourWeekEnd)}. The median cut was ${county.medianCut.value}% off the original list price.</p>
        </div>
        <div class="market-seller-note">
          <h3>${capitalize(shareWords(over90Pct))} of listings have been for sale more than 90 days.</h3>
          <p>On ${activeDay}, ${over90Pct}% of the homes for sale in Mesa County had been listed for more than 90 days. Most price cuts trace back to the first price, which is why a <a href="/grand-junction-home-value">local home value review</a> comes before the listing.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="market-footnote" aria-label="About these numbers">
    <div class="editorial-shell">
      <p>These are closed sales of single-family homes, condos and townhomes in Mesa County. Land is left out. County figures cover the past month, counted as four full weeks, because a single week has too few sales to trust. Homes for sale were counted on ${longDate(period.activeCountedOn)}.</p>
      <p>${creditLine(period.thirteenWeekStart, period.thirteenWeekEnd)}</p>
    </div>
  </section>`;
}

function buildHeroMeta({ period }) {
  return `      <p class="market-hero__meta"><span>Updated every Monday</span><span>Month ending ${longDate(period.fourWeekEnd)}</span></p>`;
}

function buildAreaStats(area, { period }) {
  const activeDay = shortDate(period.activeCountedOn);
  const hasMedian = area.median13 !== null && area.days13 !== null;
  const summary = hasMedian
    ? `In the three months ending ${longDate(period.thirteenWeekEnd)}, ${count(area.closings13)} homes sold in ${area.name} at a median price of ${money(area.median13)}, after a median of ${count(area.days13)} days on the market. On ${activeDay}, ${count(area.active)} homes were for sale there.`
    : `Too few homes sold in ${area.name} in the three months ending ${longDate(period.thirteenWeekEnd)} to give a reliable median price. On ${activeDay}, ${count(area.active)} homes were for sale there.`;
  return `          <div class="area-stat-grid" aria-label="${area.label.replace('&amp;', 'and')} market snapshot">
            <div class="area-stat"><strong>${hasMedian ? cardMoney(area.median13) : 'n/a'}</strong><span>Median sold price</span></div>
            <div class="area-stat"><strong>${hasMedian ? `${count(area.days13)} days` : 'n/a'}</strong><span>Median days on market</span></div>
            <div class="area-stat"><strong>${count(area.active)}</strong><span>Homes for sale</span></div>
          </div>
          <p class="area-market-summary">${summary}</p>
          <p class="area-market-credit">${creditLine(period.thirteenWeekStart, period.thirteenWeekEnd)}</p>`;
}

/* ---------- Writing ---------- */

function fillMarker(html, name, content, file) {
  const open = `<!-- mls:${name} -->`;
  const close = `<!-- /mls:${name} -->`;
  const start = html.indexOf(open);
  const end = html.indexOf(close);
  if (start === -1 || end === -1 || end < start) fail(`Marker "${name}" not found in ${file}`);
  return `${html.slice(0, start + open.length)}\n${content}\n${html.slice(end)}`;
}

function run() {
  const data = loadData();
  const planned = [];

  const marketFile = 'grand-junction-housing-market.html';
  let market = fs.readFileSync(path.join(root, marketFile), 'utf8');
  market = fillMarker(market, 'hero-meta', buildHeroMeta(data), marketFile);
  market = fillMarker(market, 'market-body', buildMarketBody(data), marketFile);
  planned.push([marketFile, market]);

  for (const area of data.areas.filter((a) => a.page)) {
    const file = `${area.page}.html`;
    const html = fs.readFileSync(path.join(root, file), 'utf8');
    planned.push([file, fillMarker(html, 'area-stats', buildAreaStats(area, data), file)]);
  }

  const changed = planned.filter(([file, html]) => fs.readFileSync(path.join(root, file), 'utf8') !== html);

  if (checkOnly) {
    if (changed.length) {
      console.error(`Out of date with ${path.basename(dataPath)}: ${changed.map(([file]) => file).join(', ')}`);
      process.exit(1);
    }
    console.log(`Market pages match ${path.basename(dataPath)} (${planned.length} pages).`);
    return;
  }

  for (const [file, html] of changed) fs.writeFileSync(path.join(root, file), html);

  const sitemapPath = path.join(root, 'sitemap.xml');
  if (changed.length && fs.existsSync(sitemapPath)) {
    let sitemap = fs.readFileSync(sitemapPath, 'utf8');
    const today = new Date().toISOString().slice(0, 10);
    for (const [file] of changed) {
      const loc = `https://orionlovehomes.com/${file.replace('.html', '')}`.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      sitemap = sitemap.replace(new RegExp(`(<loc>${loc}</loc><lastmod>)[^<]*(</lastmod>)`), (_m, a, b) => `${a}${today}${b}`);
    }
    fs.writeFileSync(sitemapPath, sitemap);
  }

  console.log(changed.length
    ? `Updated ${changed.length} page(s) for the month ending ${longDate(data.period.fourWeekEnd)}: ${changed.map(([file]) => file).join(', ')}`
    : 'Pages already match the data file. Nothing to write.');
}

try {
  run();
} catch (err) {
  if (err instanceof DataError) {
    console.error(`Market update stopped, nothing was written: ${err.message}`);
    process.exit(1);
  }
  throw err;
}
