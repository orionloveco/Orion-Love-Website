import fs from 'fs';
import path from 'path';
const baseUrl = process.env.MARKET_STATS_BASE_URL || 'https://orion-market-stats.orion-love-co.workers.dev';
const apiKey = process.env.MARKET_STATS_API_KEY;
const marketEndpoint = new URL('/api/market-stats', baseUrl).toString();
const pages = [['sell-redlands.html','redlands','Redlands'],['sell-orchard-mesa.html','orchard_mesa','Orchard Mesa'],['sell-fruita.html','fruita','Fruita'],['sell-palisade.html','palisade','Palisade'],['sell-clifton.html','clifton','Clifton'],['sell-downtown-grand-junction.html','downtown_grand_junction','Downtown Grand Junction'],['sell-north-grand-junction.html','north_grand_junction','North Grand Junction'],['sell-northeast-grand-junction.html','northeast_grand_junction_fruitvale','Northeast Grand Junction'],['sell-northwest-grand-junction.html','northwest_grand_junction_appleton','Northwest Grand Junction'],['sell-loma-mack.html','loma_mack','Loma / Mack'],['sell-with-orion.html','mesa_county','Mesa County']];
const headers = {Accept:'application/json'}; if(apiKey) headers.Authorization=`Bearer ${apiKey}`;
let payload={areas:{},generatedAt:new Date().toISOString()};
try {
  const res = await fetch(marketEndpoint,{headers});
  if(!res.ok) throw new Error(`Failed fetch ${res.status}`);
  payload = await res.json();
} catch (err) {
  console.warn(`Market stats fetch failed: ${err.message}`);
}
const areas = payload.areas||{}; const generatedAt = payload.generatedAt||new Date().toISOString();
fs.mkdirSync('market-data',{recursive:true});
const c=v=>Number.isFinite(v)?`$${Math.round(v).toLocaleString()}`:'Unavailable';
const n=v=>Number.isFinite(v)?Math.round(v).toLocaleString():'Unavailable';
const d=v=>Number.isFinite(v)?`${Math.round(v)} days`:'Unavailable';
const dt=v=>new Date(v).toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'});
const results=[];
for(const [file,key,label] of pages){ if(!fs.existsSync(file)) continue; let html=fs.readFileSync(file,'utf8'); const s=areas[key]; if(!s) console.warn(`No valid data for ${key}; keeping existing fallback in ${file}`);
const report=s?.lastUpdatedDate||generatedAt; const start=`<!-- MARKET_SNAPSHOT_START: ${key} -->`; const end=`<!-- MARKET_SNAPSHOT_END: ${key} -->`;
if(!html.includes(start)) html=html.replace(/(<section class="site-section[\s\S]*?seller-neighborhood-market-snapshot[\s\S]*?<\/section>)/,`${start}\n$1\n${end}`);
const replacement=`${start}\n<section id="${key.replace(/_/g,'-')}-market-snapshot" class="market-snapshot">\n  <div class="stat-grid local-area-stat-grid" data-market-area="${key}" data-market-area-label="${label}" data-market-currency="html">\n    <div class="stat-box card-stat"><div class="stat-val" data-market-stat="medianPrice">${c(s?.medianPrice)}</div><div class="stat-lbl">Median Sale Price</div></div>\n    <div class="stat-box card-stat"><div class="stat-val" data-market-stat="averageDaysOnMarket">${d(s?.averageDaysOnMarket)}</div><div class="stat-lbl">Avg. Days on Market</div></div>\n    <div class="stat-box card-stat"><div class="stat-val" data-market-stat="totalListings">${n(s?.totalListings)}</div><div class="stat-lbl">Active Listings</div></div>\n    <div class="stat-box card-stat"><div class="stat-val" data-market-stat="newListings">${n(s?.newListings)}</div><div class="stat-lbl">New Listings (30 Days)</div></div>\n    <p class="market-status-note" data-market-note="true">Reporting period: ${dt(report)}. Source: Orion Love Market Stats Worker/KV snapshot. Last updated: ${dt(generatedAt)}.</p>\n  </div>\n</section>\n${end}`;
html=html.replace(new RegExp(`${start}[\\s\\S]*?${end}`),replacement);
const alt=`/market-data/${key}-latest.json`; if(!html.includes(alt)) html=html.replace('</head>',`  <link rel="alternate" type="application/json" href="${alt}">\n</head>`);
const dsStart=`<!-- MARKET_DATASET_START: ${key} -->`; const dsEnd=`<!-- MARKET_DATASET_END: ${key} -->`;
const ds=`${dsStart}\n<script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@type":"Dataset",name:`${label} housing market snapshot`,url:`https://orionlovehomes.com/${file.replace('.html','')}`,dateModified:new Date(generatedAt).toISOString(),distribution:{"@type":"DataDownload",encodingFormat:"application/json",contentUrl:`https://orionlovehomes.com${alt}`},variableMeasured:[{"@type":"PropertyValue",name:"Median Sale Price",value:c(s?.medianPrice)},{"@type":"PropertyValue",name:"Average Days on Market",value:d(s?.averageDaysOnMarket)},{"@type":"PropertyValue",name:"Active Listings",value:n(s?.totalListings)},{"@type":"PropertyValue",name:"New Listings (30 Days)",value:n(s?.newListings)}]})}</script>\n${dsEnd}`;
if(html.includes(dsStart)) html=html.replace(new RegExp(`${dsStart}[\\s\\S]*?${dsEnd}`),ds); else html=html.replace('</head>',`${ds}\n</head>`);
fs.writeFileSync(file,html);
if (s) fs.writeFileSync(path.join('market-data',`${key}-latest.json`),JSON.stringify({areaKey:key,areaName:label,generatedAt,reportingPeriod:report,stats:s},null,2));
results.push([file,`market-data/${key}-latest.json`]); }
console.log('Updated pages:'); results.forEach(r=>console.log(`- ${r[0]}`)); console.log('Updated JSON:'); results.forEach(r=>console.log(`- ${r[1]}`));
