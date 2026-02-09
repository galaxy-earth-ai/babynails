#!/usr/bin/env bash
set -euo pipefail
BASE="/home/galaxy/projects/babynails"
PROMPTS="$BASE/ai-image-pipeline/prompts_list.json"
GEN_SCRIPT="/home/galaxy/.openclaw/workspace/skills/gemini-image-simple/scripts/generate.py"
OUT_DIR="$BASE/web-app/public/images/products/brand_generated"
mkdir -p "$OUT_DIR"

python3 - <<'PY'
import json, subprocess, pathlib
BASE=pathlib.Path('/home/galaxy/projects/babynails')
items=json.loads((BASE/'ai-image-pipeline/prompts_list.json').read_text())
GEN='/home/galaxy/.openclaw/workspace/skills/gemini-image-simple/scripts/generate.py'
out=BASE/'web-app/public/images/products/brand_generated'
out.mkdir(parents=True, exist_ok=True)
for it in items:
    prompt = it['prompt_zh_main'] + '\nEnglish guidance: ' + it['prompt_en_main'] + '\nNegative prompt: ' + it['negative_prompt']
    target = out/f"{it['sku']}-brand-v1.png"
    cmd=['python3', GEN, prompt, str(target), '--input', it['source_image']]
    print('RUN:', ' '.join(cmd[:3]), '...')
    subprocess.run(cmd, check=True)
print('Done. Output dir:', out)
PY
