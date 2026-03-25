#!/usr/bin/env python3
import os, json, base64, urllib.request, subprocess, sys, time, urllib.error
from pathlib import Path

# Paths
BASE = Path('/home/galaxy/projects/babynails')
SUPPLIER_DIR = BASE / 'web-app/public/images/products/supplier_originals'
AI_IMG_DIR = BASE / 'web-app/public/images/products/ai_product_images'
REGISTRY_FILE = Path('/home/galaxy/.openclaw/workspace/notes/areas/product-dna-registry.md')
GEN_SCRIPT = Path('/home/galaxy/.openclaw/workspace/skills/nano-banana-pro/scripts/generate_image.py')
UPDATE_SCRIPT = BASE / 'scripts/update-product-images.js'

AI_IMG_DIR.mkdir(parents=True, exist_ok=True)
REGISTRY_FILE.parent.mkdir(parents=True, exist_ok=True)

# API Setup
ENV_FILE = Path('/home/galaxy/.openclaw/workspace/.env')
if ENV_FILE.exists():
    with open(ENV_FILE) as f:
        for line in f:
            if line.startswith('GEMINI_API_KEY='):
                os.environ['GEMINI_API_KEY'] = line.strip().split('=', 1)[1]

API_KEY = os.getenv('GEMINI_API_KEY')
if not API_KEY:
    print("Error: GEMINI_API_KEY not set")
    sys.exit(1)

ANALYZE_URL = f'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={API_KEY}'

def b64(path):
    return base64.b64encode(path.read_bytes()).decode()

def analyze_dna(img_path):
    print(f"Analyzing DNA for {img_path.name}...")
    mime = 'image/png' if img_path.suffix.lower()=='.png' else 'image/jpeg'
    prompt = (
        "Analyze this nail product image. Extract the 'Physical DNA'. "
        "Return strictly JSON with keys: 'colors' (list of hex/names), 'texture' (description), "
        "'design_elements' (description), 'shape' (nail shape)."
    )
    payload = {
        'contents':[{'parts':[{'text':prompt},{'inlineData':{'mimeType':mime,'data':b64(img_path)}}]}],
        'generationConfig': {'responseModalities':['TEXT'], 'responseMimeType': 'application/json'}
    }
    
    for attempt in range(5):
        try:
            req = urllib.request.Request(ANALYZE_URL, data=json.dumps(payload).encode(), headers={'Content-Type':'application/json'})
            with urllib.request.urlopen(req, timeout=60) as r:
                obj = json.loads(r.read().decode())
            txt = obj['candidates'][0]['content']['parts'][0]['text']
            return json.loads(txt)
        except urllib.error.HTTPError as e:
            if e.code == 429:
                wait = (2 ** attempt) * 5 + 10
                print(f"Analysis 429 Hit. Waiting {wait}s...")
                time.sleep(wait)
            else:
                print(f"Analysis failed: {e}")
                return {}
        except Exception as e:
            print(f"Analysis Error: {e}")
            return {}
    return {}

def generate_washed_image(img_path, dna):
    slug = img_path.stem
    out_file = AI_IMG_DIR / f"washed-{slug}.png"
    
    # Construct prompt
    colors = ", ".join(dna.get('colors', []))
    texture = dna.get('texture', '')
    design = dna.get('design_elements', '')
    
    prompt = (
        f"Product photography, close up. Re-render these specific nails on a minimalist beige silk background. "
        f"The background should be soft, luxurious beige silk (#F5F5DC). "
        f"Maintain the original nail design EXACTLY: {colors}, {texture}, {design}. "
        f"High quality, photorealistic, 8k, soft studio lighting."
    )
    
    print(f"Generating washed image for {slug}...")
    cmd = [
        'python3', str(GEN_SCRIPT),
        '--prompt', prompt,
        '--filename', str(out_file),
        '--input-image', str(img_path),
        '--resolution', '1K'
    ]
    
    for attempt in range(3):
        try:
            subprocess.run(cmd, check=True, capture_output=True)
            return str(out_file) if out_file.exists() else None
        except subprocess.CalledProcessError as e:
            err = e.stderr.decode()
            if "429" in err or "Too Many Requests" in err:
                wait = (2 ** attempt) * 10 + 10
                print(f"Generation 429 Hit. Waiting {wait}s...")
                time.sleep(wait)
            else:
                print(f"Generation failed for {slug}: {err}")
                return None
    return None

def main():
    images = sorted([p for p in SUPPLIER_DIR.glob('*') if p.suffix.lower() in ['.png', '.jpg', '.jpeg', '.webp']])
    registry_lines = ["# Product DNA Registry", "", f"Generated: 2026-02-11", ""]
    
    update_data = []

    for img in images:
        time.sleep(5) 
        # 1. Analyze
        dna = analyze_dna(img)
        if not dna:
            print(f"Skipping generation for {img.name} due to missing DNA.")
            continue
            
        # 2. Generate
        washed_path = generate_washed_image(img, dna)
        
        if washed_path:
            # 3. Registry Log
            registry_lines.append(f"## {img.stem}")
            registry_lines.append(f"- **Original**: `{img.name}`")
            registry_lines.append(f"- **DNA**: {json.dumps(dna)}")
            registry_lines.append(f"- **Washed**: `{Path(washed_path).name}`")
            registry_lines.append("")
            
            # 4. Prepare DB Update
            update_data.append({
                'slug': img.stem,
                'imageUrl': f"/images/products/ai_product_images/{Path(washed_path).name}"
            })
        else:
            print(f"Skipping registry/DB for {img.stem} due to generation failure.")

    # Save Registry
    REGISTRY_FILE.write_text('\n'.join(registry_lines))
    print(f"Registry saved to {REGISTRY_FILE}")

    # Create DB Script
    js_content = f"""
const {{ PrismaClient }} = require('@prisma/client');
const prisma = new PrismaClient();

const updates = {json.dumps(update_data, indent=2)};

async function main() {{
  console.log('Starting DB update for ' + updates.length + ' products...');
  for (const item of updates) {{
    try {{
      const product = await prisma.product.update({{
        where: {{ slug: item.slug }},
        data: {{ imageUrl: item.imageUrl }},
      }});
      console.log(`Updated ${{item.slug}} -> ${{item.imageUrl}}`);
    }} catch (e) {{
      console.error(`Failed to update ${{item.slug}}: ${{e.message}}`);
    }}
  }}
}}

main()
  .catch((e) => {{
    console.error(e);
    process.exit(1);
  }})
  .finally(async () => {{
    await prisma.$disconnect();
  }});
"""
    UPDATE_SCRIPT.write_text(js_content)
    print(f"Update script saved to {UPDATE_SCRIPT}")
    
    # Run DB Update
    if update_data:
        print("Running DB Update...")
        subprocess.run(['node', str(UPDATE_SCRIPT)], cwd=str(BASE))
    else:
        print("No updates to run.")

if __name__ == '__main__':
    main()
