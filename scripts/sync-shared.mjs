// Copies the shared site parts in partials/ into every page, so the header, phone menu,
// footer, head assets and the site-wide JSON-LD entities are edited in one place.
//
//   node scripts/sync-shared.mjs          write partials into all *.html pages
//   node scripts/sync-shared.mjs --check  exit 1 (and list pages) if any page has drifted
//
// Pages mark each shared region with <!-- shared:NAME --> ... <!-- /shared:NAME -->.
// Entities in partials/entities.json replace JSON-LD nodes with the same @id on each page;
// page-specific nodes (WebPage, BreadcrumbList, FAQPage, BlogPosting, ...) are left alone.
import fs from 'fs';
import path from 'path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const partialsDir = path.join(root, 'partials');
const check = process.argv.includes('--check');

const REGIONS = ['head-assets', 'head-icons', 'header', 'mobile-nav', 'footer'];
const partials = Object.fromEntries(
  REGIONS.map((name) => [name, fs.readFileSync(path.join(partialsDir, `${name}.html`), 'utf8').trim()]),
);
const entities = JSON.parse(fs.readFileSync(path.join(partialsDir, 'entities.json'), 'utf8'));
const entitiesById = new Map(entities.map((node) => [node['@id'], node]));

function syncRegions(html, file, problems) {
  for (const name of REGIONS) {
    const pattern = new RegExp(`(<!-- shared:${name} -->)[\\s\\S]*?(<!-- /shared:${name} -->)`);
    if (!pattern.test(html)) {
      problems.push(`${file}: missing <!-- shared:${name} --> markers`);
      continue;
    }
    html = html.replace(pattern, (_m, open, close) => `${open}\n${partials[name]}\n${close}`);
  }
  return html;
}

function syncEntities(html) {
  return html.replace(/(<script type="application\/ld\+json">\s*)([\s\S]*?)(\s*<\/script>)/g, (match, open, raw, close) => {
    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      return match; // validate_site.py reports unparseable JSON-LD
    }
    const graph = Array.isArray(data?.['@graph']) ? data['@graph'] : null;
    if (!graph) return match;
    let changed = false;
    data['@graph'] = graph.map((node) => {
      const shared = node && entitiesById.get(node['@id']);
      if (!shared) return node;
      changed = true;
      return shared;
    });
    if (!changed) return match;
    const compact = raw.trim() === JSON.stringify(JSON.parse(raw));
    return `${open}${compact ? JSON.stringify(data) : JSON.stringify(data, null, 2)}${close}`;
  });
}

// Files starting with "_" are local scratch/tools, not site pages.
const files = fs.readdirSync(root).filter((f) => f.endsWith('.html') && !f.startsWith('_')).sort();
const problems = [];
const drifted = [];

for (const file of files) {
  const filePath = path.join(root, file);
  const before = fs.readFileSync(filePath, 'utf8');
  const after = syncEntities(syncRegions(before, file, problems));
  if (after === before) continue;
  drifted.push(file);
  if (!check) fs.writeFileSync(filePath, after);
}

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}

if (check) {
  if (drifted.length) {
    console.error(`Shared parts out of sync in: ${drifted.join(', ')}\nRun: node scripts/sync-shared.mjs`);
    process.exit(1);
  }
  console.log(`Shared parts in sync across ${files.length} pages.`);
} else {
  console.log(drifted.length ? `Updated ${drifted.length} page(s): ${drifted.join(', ')}` : 'All pages already in sync.');
}
