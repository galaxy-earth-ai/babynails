#!/usr/bin/env bash
set -euo pipefail
ROOT="/home/galaxy/projects/babynails/web-app/public/images/products"
WEBROOT="/home/galaxy/projects/babynails/web-app"
SUMMARY="$ROOT/reorg-summary.json"
python3 - <<'PY2'
import json
from pathlib import Path
root = Path("/home/galaxy/projects/babynails/web-app/public/images/products")
web_root = Path("/home/galaxy/projects/babynails/web-app")
summary = json.loads((root/'reorg-summary.json').read_text(encoding='utf-8'))
# rollback file moves in reverse order
for m in reversed(summary.get('moves', [])):
    newp = root / m['new']
    oldp = root / m['old']
    if newp.exists():
        oldp.parent.mkdir(parents=True, exist_ok=True)
        newp.rename(oldp)
# rollback refs
text_ext = {'.js','.jsx','.ts','.tsx','.json','.md','.mdx','.yml','.yaml','.html','.css','.scss','.sass','.vue','.txt'}
for p in web_root.rglob('*'):
    if not p.is_file() or p.suffix.lower() not in text_ext:
        continue
    if p.stat().st_size > 2_000_000:
        continue
    try:
        c = p.read_text(encoding='utf-8')
    except Exception:
        continue
    o = c
    for m in summary.get('moves', []):
        a = f"images/products/{m['new']}"
        b = f"images/products/{m['old']}"
        c = c.replace(a,b)
    if c != o:
        p.write_text(c, encoding='utf-8')
print('Rollback completed.')
PY2
