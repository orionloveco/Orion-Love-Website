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
fs.mkdirSync(path.join(tempRoot, 'market-data'));

execFileSync(process.execPath, [
  path.join(root, 'scripts/update-market-snapshots.mjs'),
  `--root=${tempRoot}`,
  `--payload-file=${fixture}`,
], { stdio: 'pipe' });

function html(file) {
  return fs.readFileSync(path.join(tempRoot, file), 'utf8');
}

function stat(file, statKey) {
  const source = html(file);
  const pattern = new RegExp(`<[^>]+data-market-stat=["']${statKey}["'][^>]*>([\\s\\S]*?)<\\/[^>]+>`);
  const match = source.match(pattern);
  assert.ok(match, `${file} should contain ${statKey}`);
  return match[1].replace(/<[^>]+>/g, '').trim();
}

assert.equal(stat('sell-fruita.html', 'newListings'), '30', 'missing newListings preserves fallback');
assert.equal(stat('sell-palisade.html', 'newListings'), '0', 'explicit canonical newListings: 0 renders 0');
assert.equal(stat('sell-redlands.html', 'newListings'), '23', 'newListings30d alias maps when valid');
assert.equal(stat('sell-orchard-mesa.html', 'newListings'), '26', 'invalid newListings preserves fallback');
assert.equal(stat('sell-downtown-grand-junction.html', 'newListings'), '17', 'valid fetched values update in place');
assert.equal(stat('sell-clifton.html', 'newListings'), '10', 'alias default zero preserves fallback');

const palisadeJson = JSON.parse(fs.readFileSync(path.join(tempRoot, 'market-data/palisade-latest.json'), 'utf8'));
assert.equal(palisadeJson.stats.newListings, 0, 'JSON preserves explicit canonical zero');

const cliftonJson = JSON.parse(fs.readFileSync(path.join(tempRoot, 'market-data/clifton-latest.json'), 'utf8'));
assert.equal(cliftonJson.stats.newListings, 10, 'JSON does not let alias default zero overwrite fallback');

fs.rmSync(tempRoot, { recursive: true, force: true });
console.log('market snapshot fallback tests passed');
