import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const root = process.cwd();
const fixture = path.join(root, 'scripts/fixtures/market-audit/market-stats-payload.json');
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'orion-market-audit-'));

const filesToCopy = [
  'sell-redlands.html',
  'sell-fruita.html',
  'sell-palisade.html',
  'sell-orchard-mesa.html',
  'sell-clifton.html',
  'sell-downtown-grand-junction.html',
  'sell-north-grand-junction.html',
  'sell-northeast-grand-junction.html',
  'sell-northwest-grand-junction.html',
  'sell-loma-mack.html',
];

for (const file of filesToCopy) {
  fs.copyFileSync(path.join(root, file), path.join(tempRoot, file));
}

// Fallback cases must keep whatever the page shows today, which changes every monthly refresh.
const statIn = (source, statKey) => source.match(new RegExp(`data-market-stat=["']${statKey}["'][^>]*>([^<]*)<`))[1].trim();
const originalNewListings = (file) => statIn(fs.readFileSync(path.join(root, file), 'utf8'), 'newListings');
const before = {
  fruita: originalNewListings('sell-fruita.html'),
  orchardMesa: originalNewListings('sell-orchard-mesa.html'),
  clifton: originalNewListings('sell-clifton.html'),
};
fs.mkdirSync(path.join(tempRoot, 'market-data'));

execFileSync(process.execPath, [
  path.join(root, 'scripts/update-market-snapshots.mjs'),
  `--root=${tempRoot}`,
  `--payload-file=${fixture}`,
], { stdio: 'pipe' });

function html(file) {
  return fs.readFileSync(path.join(tempRoot, file), 'utf8');
}


function note(file) {
  const source = html(file);
  const match = source.match(/<[^>]+data-market-note=["']true["'][^>]*>([\s\S]*?)<\/[^>]+>/);
  assert.ok(match, `${file} should contain market note`);
  return match[1].replace(/<[^>]+>/g, '').trim();
}

function stat(file, statKey) {
  const source = html(file);
  const pattern = new RegExp(`<[^>]+data-market-stat=["']${statKey}["'][^>]*>([\\s\\S]*?)<\\/[^>]+>`);
  const match = source.match(pattern);
  assert.ok(match, `${file} should contain ${statKey}`);
  return match[1].replace(/<[^>]+>/g, '').trim();
}

assert.equal(stat('sell-fruita.html', 'newListings'), before.fruita, 'missing newListings preserves fallback');
assert.equal(stat('sell-palisade.html', 'newListings'), '0', 'explicit canonical newListings: 0 renders 0');
assert.equal(stat('sell-redlands.html', 'newListings'), '23', 'newListings30d alias maps when valid');
assert.equal(stat('sell-orchard-mesa.html', 'newListings'), before.orchardMesa, 'invalid newListings preserves fallback');
assert.equal(stat('sell-downtown-grand-junction.html', 'newListings'), '17', 'valid fetched values update in place');
assert.equal(stat('sell-clifton.html', 'newListings'), before.clifton, 'alias default zero preserves fallback');
assert.equal(note('sell-redlands.html'), 'Source: RentCast market data. Last updated: May 12, 2026.', 'market note synchronizes to source lastUpdatedDate');

const palisadeJson = JSON.parse(fs.readFileSync(path.join(tempRoot, 'market-data/palisade-latest.json'), 'utf8'));
assert.equal(palisadeJson.stats.newListings, 0, 'JSON preserves explicit canonical zero');

const cliftonJson = JSON.parse(fs.readFileSync(path.join(tempRoot, 'market-data/clifton-latest.json'), 'utf8'));
assert.equal(cliftonJson.stats.newListings, Number(before.clifton), 'JSON does not let alias default zero overwrite fallback');


const invalidPayload = {
  generatedAt: '2026-05-12T00:00:00.000Z',
  areas: {
    redlands: {
      medianPrice: 551000,
      averageDaysOnMarket: 88,
      totalListings: 235,
      newListings: 23,
      lastUpdatedDate: 'not-a-date',
    },
  },
};
const invalidPayloadPath = path.join(tempRoot, 'invalid-payload.json');
fs.writeFileSync(invalidPayloadPath, JSON.stringify(invalidPayload));
assert.throws(() => {
  execFileSync(process.execPath, [
    path.join(root, 'scripts/update-market-snapshots.mjs'),
    `--root=${tempRoot}`,
    `--payload-file=${invalidPayloadPath}`,
  ], { stdio: 'pipe' });
}, /Invalid or missing lastUpdatedDate for redlands/);

const nullDatePayload = {
  generatedAt: '2026-09-15T08:00:00.000Z',
  areas: {
    redlands: { ...invalidPayload.areas.redlands, lastUpdatedDate: null },
  },
};
const nullDatePayloadPath = path.join(tempRoot, 'null-date-payload.json');
fs.writeFileSync(nullDatePayloadPath, JSON.stringify(nullDatePayload));
execFileSync(process.execPath, [
  path.join(root, 'scripts/update-market-snapshots.mjs'),
  `--root=${tempRoot}`,
  `--payload-file=${nullDatePayloadPath}`,
], { stdio: 'pipe' });
assert.equal(note('sell-redlands.html'), 'Source: RentCast market data. Last updated: September 15, 2026.', 'null lastUpdatedDate falls back to payload generatedAt');

// Prices starting with $1-$3 must not be read as regex backreferences ("$369,900" once became "</strong>69,900").
const dollarPayloadPath = path.join(tempRoot, 'dollar-payload.json');
fs.writeFileSync(dollarPayloadPath, JSON.stringify({
  generatedAt: '2026-09-15T08:00:00.000Z',
  areas: { redlands: { ...invalidPayload.areas.redlands, medianPrice: 369900, lastUpdatedDate: null } },
}));
execFileSync(process.execPath, [
  path.join(root, 'scripts/update-market-snapshots.mjs'),
  `--root=${tempRoot}`,
  `--payload-file=${dollarPayloadPath}`,
], { stdio: 'pipe' });
assert.equal(stat('sell-redlands.html', 'medianPrice'), '$369,900', 'dollar-prefixed prices are written literally');
assert.ok(!/data-market-stat="medianPrice"><\/strong>/.test(html('sell-redlands.html')), 'no empty/broken median price tag');

fs.rmSync(tempRoot, { recursive: true, force: true });
console.log('market snapshot fallback tests passed');
