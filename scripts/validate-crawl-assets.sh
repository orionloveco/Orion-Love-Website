#!/usr/bin/env bash
set -euo pipefail

fail(){ echo "FAIL: $1"; exit 1; }
pass(){ echo "PASS: $1"; }

[[ -f sitemap.xml ]] || fail "sitemap.xml missing at repo root"
pass "sitemap.xml exists at repo root"

[[ -f robots.txt ]] || fail "robots.txt missing at repo root"
pass "robots.txt exists at repo root"

[[ -f _headers ]] || fail "_headers missing at repo root"
pass "_headers exists at repo root"

if command -v xmllint >/dev/null 2>&1; then
  xmllint --noout sitemap.xml || fail "sitemap.xml failed XML parse"
  pass "sitemap.xml parses as XML"
else
  python3 - <<'PY' || fail "sitemap.xml failed XML parse via python"
import xml.etree.ElementTree as ET
ET.parse('sitemap.xml')
print('PASS: sitemap.xml parses as XML (python)')
PY
fi

if rg -n "<!doctype html|<html|<head|<body|Orion Love|Grand Junction realtor" sitemap.xml >/dev/null; then
  fail "sitemap.xml contains HTML/homepage markers"
else
  pass "sitemap.xml contains no HTML/homepage markers"
fi

if [[ "$(wc -l < robots.txt)" -lt 2 ]]; then
  fail "robots.txt appears flattened (fewer than 2 lines)"
else
  pass "robots.txt contains line breaks"
fi
