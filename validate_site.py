from pathlib import Path
import json,re

SITE_ROOT='https://orionlovehomes.com'
EXPECTED_SAMEAS={
'https://www.zillow.com/profile/OrionLove',
'https://www.realtor.com/realestateagents/6960e90c720b6c832a10ce6b',
'https://www.linkedin.com/in/orionlove/',
'https://kw.com/agent/orion-love/2000137810',
}
issues=[]

html_files=sorted(Path('.').glob('*.html'))
all_ids={}

def canonical_for(name):
 return SITE_ROOT+'/' if name=='index.html' else f"{SITE_ROOT}/{name[:-5]}"

for f in html_files:
 txt=f.read_text(encoding='utf-8')
 if 'renderSharedFooter' in txt:
  issues.append(f'{f} contains renderSharedFooter reference')
 ctags=re.findall(r'<link[^>]*rel="canonical"[^>]*>',txt,re.I)
 if f.name!='404.html' and len(ctags)!=1:
  issues.append(f'{f} canonical count {len(ctags)}')
 canon=None
 if ctags:
  m=re.search(r'href="([^"]+)"',ctags[0],re.I); canon=m.group(1) if m else None
  if not canon: issues.append(f'{f} canonical missing href')
  elif canon!=canonical_for(f.name): issues.append(f'{f} canonical mismatch {canon}')

 blocks=re.findall(r'<script type="application/ld\+json">\s*(.*?)\s*</script>',txt,re.S|re.I)
 if f.name!='404.html' and not blocks:
  issues.append(f'{f} missing JSON-LD')
 found_rating=False
 for i,b in enumerate(blocks,1):
  try: data=json.loads(b)
  except Exception as e:
   issues.append(f'{f} JSON-LD block {i} parse error {e}')
   continue
  nodes=[]
  if isinstance(data,dict) and '@graph' in data: nodes.extend(data['@graph'])
  elif isinstance(data,list): nodes.extend(data)
  elif isinstance(data,dict): nodes.append(data)
  for n in nodes:
   if not isinstance(n,dict): continue
   nid=n.get('@id')
   if nid: all_ids.setdefault(nid,[]).append((f.name,n.get('@type')))
   t=n.get('@type')
   if t in ('WebPage','ContactPage','CollectionPage') and canon:
    for k in ('url','mainEntityOfPage'):
     v=n.get(k)
     if isinstance(v,str) and v!=canon: issues.append(f'{f} {t} {k} != canonical')
   if t in ('RealEstateAgent','Person'):
    sa=set(n.get('sameAs',[]))
    if sa and not EXPECTED_SAMEAS.issubset(sa):
      issues.append(f'{f} {t} sameAs missing expected links')
   if t in ('Review','AggregateRating'): found_rating=True
 if found_rating and not re.search(r'review|rating',txt,re.I):
  issues.append(f'{f} has Review/AggregateRating without visible review/rating text')

script=Path('script.js').read_text(encoding='utf-8')
if re.search(r'ld\+json|application/ld\+json|schema\.org',script,re.I):
 issues.append('script.js appears to inject or contain schema content')
if 'renderSharedFooter' in script:
 issues.append('script.js contains renderSharedFooter()')

for idv,refs in all_ids.items():
 types={t for _,t in refs}
 if len(types)>1 and idv.endswith('#webpage'):
  issues.append(f'Conflicting @id types for {idv}: {refs}')

print('ISSUES',len(issues))
for i in issues: print('-',i)
