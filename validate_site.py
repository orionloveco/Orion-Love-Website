from pathlib import Path
import re,json
html=list(Path('.').glob('*.html'))
issues=[]
def meta_has(t,key,prop=False):
    attr='property' if prop else 'name'
    return re.search(rf'<meta[^>]*{attr}="{re.escape(key)}"[^>]*content="[^"]+"|<meta[^>]*content="[^"]+"[^>]*{attr}="{re.escape(key)}"',t,re.I)
for f in html:
 t=f.read_text()
 noindex=bool(re.search(r'<meta[^>]*name="robots"[^>]*noindex|<meta[^>]*content="[^"]*noindex[^"]*"[^>]*name="robots"',t,re.I))
 if not noindex:
  if len(re.findall(r'<link[^>]*rel="canonical"',t,re.I))!=1: issues.append(f'{f} canonical count')
  if f.name=='index.html' and 'href="https://orionlovehomes.com/"' not in t: issues.append('index canonical')
  if f.name!='index.html' and f'https://orionlovehomes.com/{f.name}' not in t: issues.append(f'{f} canonical fmt')
  for k,p in [('description',False),('og:title',True),('og:description',True),('twitter:title',False),('twitter:description',False)]:
   if not meta_has(t,k,p): issues.append(f'{f} missing {k}')
  if 'hreflang="en-US"' not in t: issues.append(f'{f} missing hreflang')
  for k,p in [('og:image',True),('twitter:image',False)]:
   m=re.search(rf'<meta[^>]*(?:property|name)="{k}"[^>]*content="([^"]+)"|<meta[^>]*content="([^"]+)"[^>]*(?:property|name)="{k}"',t,re.I)
   if not m: issues.append(f'{f} missing {k}')
   else:
    u=next(g for g in m.groups() if g)
    if 'orionlovehomes.com/' in u:
      pth=u.split('orionlovehomes.com/',1)[1]
      if pth and not Path(pth).exists(): issues.append(f'{f} missing image {pth}')
 for j in re.findall(r'<script type="application/ld\+json">\s*(.*?)\s*</script>',t,re.S):
  try: json.loads(j)
  except Exception as e: issues.append(f'{f} jsonld {e}')
 if 'href="index.html"' in t: issues.append(f'{f} has index.html link')
 if re.search(r'href="/(about|contact|areas|sell-with-orion|faq|privacy|grand-junction-home-value|sell-[^"]+)"',t) is None and f.name!='script.js': pass
sm=Path('sitemap.xml').read_text()
if '404.html' in sm: issues.append('sitemap has 404')
if 'buy-with-orion.html' in sm: issues.append('sitemap has noindex buy')
print('ISSUES',len(issues))
for i in issues: print('-',i)
