from pathlib import Path
import json
import re

SITE_ROOT = "https://orionlovehomes.com"
HOMEPAGE = f"{SITE_ROOT}/"

issues = []
html_files = list(Path(".").glob("*.html"))


def find_attr_value(tag: str, attr: str):
    match = re.search(rf'{attr}="([^"]+)"', tag, re.I)
    return match.group(1) if match else None


def check_clean_url(url: str, context: str):
    if ".html" in url:
        issues.append(f"{context} contains .html -> {url}")


def expected_clean_url_for_file(file_name: str) -> str:
    if file_name == "index.html":
        return HOMEPAGE
    slug = file_name[:-5]
    return f"{SITE_ROOT}/{slug}"


for file_path in html_files:
    text = file_path.read_text(encoding="utf-8")
    is_404 = file_path.name == "404.html"

    canonical_tags = re.findall(r'<link[^>]*rel="canonical"[^>]*>', text, re.I)
    if not is_404 and len(canonical_tags) != 1:
        issues.append(f"{file_path} canonical count != 1")
    elif canonical_tags:
        canonical_url = find_attr_value(canonical_tags[0], "href")
        if not canonical_url:
            issues.append(f"{file_path} canonical missing href")
        else:
            expected = expected_clean_url_for_file(file_path.name)
            if canonical_url != expected:
                issues.append(f"{file_path} canonical mismatch -> {canonical_url} (expected {expected})")
            check_clean_url(canonical_url, f"{file_path} canonical")

    for tag in re.findall(r'<link[^>]*hreflang="[^"]+"[^>]*>', text, re.I):
        href = find_attr_value(tag, "href")
        if href:
            check_clean_url(href, f"{file_path} hreflang")

    og_url_tags = re.findall(r'<meta[^>]*property="og:url"[^>]*>', text, re.I)
    for tag in og_url_tags:
        content = find_attr_value(tag, "content")
        if not content:
            issues.append(f"{file_path} og:url missing content")
        else:
            check_clean_url(content, f"{file_path} og:url")

    json_blocks = re.findall(r'<script type="application/ld\+json">\s*(.*?)\s*</script>', text, re.S | re.I)
    for idx, raw in enumerate(json_blocks, start=1):
        try:
            data = json.loads(raw)
        except Exception as exc:
            issues.append(f"{file_path} JSON-LD block {idx} parse error -> {exc}")
            continue

        nodes = data if isinstance(data, list) else [data]
        for node in nodes:
            if not isinstance(node, dict):
                continue
            if node.get("@type") != "WebPage":
                continue
            for key in ("@id", "url"):
                val = node.get(key)
                if isinstance(val, str):
                    check_clean_url(val, f"{file_path} WebPage {key}")

    for attr in ("href", "action"):
        for match in re.finditer(rf'{attr}="([^"]+)"', text, re.I):
            url = match.group(1)
            if not url.startswith("/"):
                continue
            if re.search(r"\.[a-zA-Z0-9]{1,8}$", url):
                continue
            check_clean_url(url, f"{file_path} {attr}")

sitemap_path = Path("sitemap.xml")
if not sitemap_path.exists():
    issues.append("sitemap.xml missing")
else:
    sitemap_text = sitemap_path.read_text(encoding="utf-8")
    loc_values = re.findall(r"<loc>(.*?)</loc>", sitemap_text, re.I)
    if HOMEPAGE not in loc_values:
        issues.append(f"sitemap homepage missing {HOMEPAGE}")
    for loc in loc_values:
        check_clean_url(loc, "sitemap <loc>")
    if any("buy-with-orion" in loc for loc in loc_values):
        issues.append("sitemap includes buy-with-orion")

redirects_path = Path("_redirects")
if not redirects_path.exists():
    issues.append("_redirects missing")
else:
    redirects_lines = [
        line.strip()
        for line in redirects_path.read_text(encoding="utf-8").splitlines()
        if line.strip() and not line.strip().startswith("#")
    ]
    pairs = []
    for line in redirects_lines:
        parts = line.split()
        if len(parts) < 2:
            issues.append(f"bad redirect line -> {line}")
            continue
        source, target = parts[0], parts[1]
        pairs.append((source, target))

        if "*" in source or "*" in target:
            issues.append(f"wildcard redirect disallowed -> {line}")
        if target.endswith(".html"):
            issues.append(f"redirect target ends in .html -> {line}")
        if target != "/" and target.endswith("/"):
            issues.append(f"redirect target has trailing slash -> {line}")

    required_html_redirects = {
        "/about.html": "/about",
        "/areas.html": "/areas",
        "/buy-with-orion.html": "/buy-with-orion",
        "/contact.html": "/contact",
        "/faq.html": "/faq",
        "/grand-junction-home-value.html": "/grand-junction-home-value",
        "/privacy.html": "/privacy",
        "/sell-with-orion.html": "/sell-with-orion",
        "/sell-clifton.html": "/sell-clifton",
        "/sell-downtown-grand-junction.html": "/sell-downtown-grand-junction",
        "/sell-fruita.html": "/sell-fruita",
        "/sell-loma-mack.html": "/sell-loma-mack",
        "/sell-north-grand-junction.html": "/sell-north-grand-junction",
        "/sell-northeast-grand-junction.html": "/sell-northeast-grand-junction",
        "/sell-northwest-grand-junction.html": "/sell-northwest-grand-junction",
        "/sell-orchard-mesa.html": "/sell-orchard-mesa",
        "/sell-palisade.html": "/sell-palisade",
        "/sell-redlands.html": "/sell-redlands",
    }

    required_legacy_area_redirects = {
        "/northwest-grand-junction": "/sell-northwest-grand-junction",
        "/north-grand-junction": "/sell-north-grand-junction",
        "/northeast-grand-junction": "/sell-northeast-grand-junction",
        "/downtown-grand-junction": "/sell-downtown-grand-junction",
        "/orchard-mesa": "/sell-orchard-mesa",
        "/redlands": "/sell-redlands",
        "/fruita": "/sell-fruita",
        "/palisade": "/sell-palisade",
        "/clifton": "/sell-clifton",
        "/loma-mack": "/sell-loma-mack",
        "/clifton-grand-junction": "/sell-clifton",
        "/clifton-grand-junction.html": "/sell-clifton",
        "/loma-mack-grand-junction": "/sell-loma-mack",
        "/loma-mack-grand-junction.html": "/sell-loma-mack",
    }

    redirect_map = dict(pairs)
    for source, target in {**required_html_redirects, **required_legacy_area_redirects}.items():
        if redirect_map.get(source) != target:
            issues.append(f"missing redirect {source} -> {target}")

print("ISSUES", len(issues))
for issue in issues:
    print("-", issue)
