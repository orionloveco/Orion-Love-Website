// Tests for scripts/update-market-from-mls.mjs. Runs it against copies of the real pages
// with made-up numbers, so nothing here depends on the current week's data.
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const root = process.cwd();
const script = path.join(root, 'scripts/update-market-from-mls.mjs');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'orion-mls-market-'));
const areaPages = ['sell-redlands', 'sell-orchard-mesa', 'sell-downtown-grand-junction', 'sell-north-grand-junction', 'sell-northeast-grand-junction', 'sell-southeast-grand-junction', 'sell-northwest-grand-junction', 'sell-fruita', 'sell-loma-mack', 'sell-palisade', 'sell-clifton'];
const pages = ['grand-junction-housing-market', ...areaPages].map((p) => `${p}.html`);
for (const file of [...pages, 'sitemap.xml']) fs.copyFileSync(path.join(root, file), path.join(temp, file));

const area = (name, active, c4, c13, median13, days13) => ({
  area: name, activeListings: String(active), closings4wk: String(c4), medianSold4wk: 'n/a', medianDays4wk: 'n/a',
  closings13wk: String(c13), medianSold13wk: median13, medianDays13wk: days13,
});
const fixture = () => ({
  period: { fourWeekStart: '2027-02-01', fourWeekEnd: '2027-02-28', thirteenWeekStart: '2026-11-30', thirteenWeekEnd: '2027-02-28', activeCountedOn: '2027-03-01' },
  county: [
    ['Closings (4 weeks)', '150', '160'],
    ['Median sold price (4 weeks)', '$380,000', '$400,000'],
    ['Median days on market (4 weeks)', '81', '77'],
    ['Sold-to-list ratio, median per sale (4 weeks)', '98.4%', '99.0%'],
    ['Median sold price per sq ft (4 weeks)', '$251', '$260'],
    ['Sales with a seller concession (4 weeks)', '93', '80'],
    ['Share of sales with a seller concession (4 weeks)', '62.0%', '50.0%'],
    ['Median seller concession (4 weeks)', '$8,500', '$7,000'],
    ['Active listings', '1,234', 'n/a'],
    ['Months of supply', '6.3', 'n/a'],
    ['Share of active listings on market more than 90 days', '24.0%', 'n/a'],
    ['Price reductions (past 7 days)', '77', 'n/a'],
    ['Median price cut from original list (past 7 days)', '4.1%', 'n/a'],
  ].map(([metric, value, samePeriodLastYear]) => ({ metric, value, samePeriodLastYear })),
  priceBands: [
    ['Under $300k', '100', '2.9'], ['$300–400k', '300', '4.0'], ['$400–500k', '250', '4.6'], ['$500–750k', '284', '5.2'], ['$750k+', '300', '5.5'],
  ].map(([priceBand, activeListings, monthsOfSupply]) => ({ priceBand, activeListings, monthsOfSupply })),
  areas: [
    area('Redlands', 140, 20, 80, '$611,000', '70'),
    area('Orchard Mesa', 100, 15, 60, '$401,000', '66'),
    area('Grand Junction City', 120, 30, 70, '$333,000', '50'),
    area('North Grand Junction', 170, 25, 90, '$470,000', '75'),
    area('NE Grand Junction', 110, 22, 75, '$390,000', '60'),
    area('SE Grand Junction', 90, 16, 55, '$345,000', '58'),
    area('NW Grand Junction', 44, 6, 24, '$490,000', '82'),
    area('Fruita', 200, 24, 85, '$455,000', '72'),
    area('Loma / Mack', 20, 0, 2, 'n/a', 'n/a'),
    area('Palisade', 60, 7, 9, '$905,000', '64'),
    area('Clifton', 100, 10, 40, '$299,000', '61'),
    area('Other Mesa County', 80, 5, 20, '$420,000', '70'),
  ],
});

const dataFile = path.join(temp, 'data.json');
const run = (data, ...extra) => {
  fs.writeFileSync(dataFile, JSON.stringify(data));
  return spawnSync(process.execPath, [script, `--root=${temp}`, `--data=${dataFile}`, ...extra], { encoding: 'utf8' });
};
const read = (file) => fs.readFileSync(path.join(temp, file), 'utf8');
const text = (html) => html.replace(/<[^>]+>/g, ' ').replace(/&rsquo;/g, '’').replace(/&amp;/g, '&').replace(/\s+/g, ' ');

// 1. A normal week writes every page.
let result = run(fixture());
assert.equal(result.status, 0, result.stderr);
const market = text(read('grand-junction-housing-market.html'));
assert.ok(market.includes('Month ending February 28, 2027'), 'hero shows the period');
assert.ok(market.includes('the median sold price in Mesa County was $380,000, down about 5% from $400,000 in the same period last year'), 'year-over-year direction follows the numbers');
assert.ok(market.includes('for 98.4% of their final list price, at a median of $251 per square foot'), 'sold-to-list and price per square foot');
assert.ok(market.includes('Homes priced under $300,000 are moving fastest, with 2.9 months of supply. Homes priced at $750,000 and up are the slowest, at 5.5 months.'), 'price-range read picks fastest and slowest, without claiming room to negotiate under six months');
assert.ok(market.includes('the Redlands had the highest median sold price of the twelve areas ($611,000) and Clifton the lowest ($299,000)'), 'ranking skips areas with too few sales (Palisade has 9)');
assert.ok(market.includes('Central Grand Junction had the most sales in the past month (30), and Fruita had the most homes for sale (200).'), 'busiest and most-listed areas named separately');
assert.ok(market.includes('More than half of sales include a seller concession.'), 'concession headline follows the share');
assert.ok(market.includes('93 of 150 sales (62%)'), 'concession counts');
assert.ok(market.includes('About a quarter of listings have been for sale more than 90 days.'), '90-day headline follows the share');
assert.ok(market.includes('77 listings cut their price in one week.'), 'price cuts');
assert.ok(market.includes('Based on information from the Grand Junction Area REALTOR® Association MLS for the period November 30, 2026 through February 28, 2027.'), 'market page carries the MLS notice and period');
assert.ok(/Loma & Mack\s+Too few sales\s+0\s+20/.test(market), 'an area with too few sales shows no median');
assert.ok(/SE Grand Junction\s+\$345,000\s+16\s+90/.test(market), 'SE Grand Junction row');

for (const page of areaPages) {
  const html = read(`${page}.html`);
  assert.ok(text(html).includes('Based on information from the Grand Junction Area REALTOR® Association MLS for the period November 30, 2026 through February 28, 2027.'), `${page} carries the MLS notice`);
  assert.ok(!/RentCast|data-market-/.test(html), `${page} has no leftovers from the old pipeline`);
}
const redlands = text(read('sell-redlands.html'));
assert.ok(redlands.includes('$611K Median sold price 70 days Median days on market 140 Homes for sale'), 'area cards');
assert.ok(redlands.includes('In the three months ending February 28, 2027, 80 homes sold in the Redlands at a median price of $611,000, after a median of 70 days on the market. On March 1, 140 homes were for sale there.'), 'area summary sentence');
assert.ok(text(read('sell-downtown-grand-junction.html')).includes('70 homes sold in central Grand Junction at a median price of $333,000'), 'Grand Junction City maps to the Central guide');
const loma = text(read('sell-loma-mack.html'));
assert.ok(loma.includes('n/a Median sold price') && loma.includes('Too few homes sold in Loma and Mack'), 'thin area shows n/a and says why');

// 2. --check passes when pages match the data, fails when the data moves on.
assert.equal(run(fixture(), '--check').status, 0, 'check passes after an update');
const newer = fixture();
newer.county[1].value = '$390,000';
assert.equal(run(newer, '--check').status, 1, 'check fails when the data file is newer than the pages');
assert.ok(market === text(read('grand-junction-housing-market.html')), '--check never writes');

// 3. Bad data stops the run before anything is written.
const snapshot = () => pages.map(read).join('\u0000');
const before = snapshot();
const badCases = {
  'a missing area': (d) => { d.areas = d.areas.filter((a) => a.area !== 'Fruita'); },
  'a renamed area': (d) => { d.areas[0].area = 'The Redlands'; },
  'a non-numeric county value': (d) => { d.county[1].value = 'pending'; },
  'a missing county metric': (d) => { d.county = d.county.filter((row) => row.metric !== 'Months of supply'); },
  'a missing price band': (d) => { d.priceBands.pop(); },
  'a bad date': (d) => { d.period.fourWeekEnd = 'last Sunday'; },
};
for (const [label, mutate] of Object.entries(badCases)) {
  const data = fixture();
  data.county[0].value = '999';
  mutate(data);
  result = run(data);
  assert.equal(result.status, 1, `${label} should stop the update`);
  assert.ok(result.stderr.includes('nothing was written'), `${label} explains itself`);
  assert.equal(snapshot(), before, `${label} leaves every page untouched`);
}

fs.rmSync(temp, { recursive: true, force: true });
console.log('MLS market update tests passed');
