#!/usr/bin/env python3
import json, subprocess
from pathlib import Path

BASE = Path('/home/galaxy/projects/babynails')
PIPE = BASE / 'ai-image-pipeline'
PROMPTS = PIPE / 'prompts_list.json'
OUT_DIR = BASE / 'web-app/public/images/products/brand_generated'
OUT_DIR.mkdir(parents=True, exist_ok=True)
GEN = Path('/home/galaxy/.openclaw/workspace/skills/gemini-image-simple/scripts/generate.py')

items = json.loads(PROMPTS.read_text())
success, fail = 0, 0
logs=[]
for it in items:
    sku = it['sku']
    src = it['source_image']
    out = OUT_DIR / f'{sku}-brand-v1.png'
    prompt = it['prompt_zh_main'] + '\nEnglish guidance: ' + it['prompt_en_main'] + '\nNegative prompt: ' + it['negative_prompt']
    cmd = ['python3', str(GEN), prompt, str(out), '--input', src]
    p = subprocess.run(cmd, capture_output=True, text=True)
    if p.returncode == 0:
        success += 1
        logs.append({'sku':sku, 'status':'success', 'output':str(out), 'stdout':p.stdout.strip()})
    else:
        fail += 1
        logs.append({'sku':sku, 'status':'failed', 'error':p.stderr[-1000:]})

report = {
    'total': len(items),
    'success': success,
    'failed': fail,
    'output_dir': str(OUT_DIR),
    'logs': logs
}
(PIPE/'generation_report.json').write_text(json.dumps(report, ensure_ascii=False, indent=2))
print(json.dumps(report, ensure_ascii=False, indent=2))
