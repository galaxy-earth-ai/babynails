#!/usr/bin/env python3
import os, json, base64, urllib.request, urllib.error
from pathlib import Path

BASE = Path('/home/galaxy/projects/babynails')
SUPPLIER_DIR = BASE / 'web-app/public/images/products/originals_backup'
OUT_DIR = BASE / 'ai-image-pipeline'
OUT_DIR.mkdir(parents=True, exist_ok=True)
OUT_JSON = OUT_DIR / 'prompts_list.json'
OUT_MD = OUT_DIR / 'prompts_list.md'

API_KEY = os.getenv('GEMINI_API_KEY')
if not API_KEY:
    raise SystemExit('GEMINI_API_KEY not set')

MODEL='nano-banana-pro-preview'
URL=f'https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent?key={API_KEY}'

ANALYZE_INSTRUCTION = (
    '你是美甲电商图像分析师。请识别输入图中的美甲商品信息，并且只输出JSON对象，不要markdown。'
    '字段必须包含: category, color_palette, texture, selling_points, style, composition_suggestion。'
    '每个字段都要有内容，中文输出。'
)

def b64(path):
    return base64.b64encode(path.read_bytes()).decode()

def analyze_image(img: Path):
    mime = 'image/png' if img.suffix.lower()=='.png' else 'image/jpeg'
    payload = {
        'contents':[{'parts':[{'text':ANALYZE_INSTRUCTION},{'inlineData':{'mimeType':mime,'data':b64(img)}}]}],
        'generationConfig': {'responseModalities':['TEXT']}
    }
    req = urllib.request.Request(URL, data=json.dumps(payload).encode(), headers={'Content-Type':'application/json'})
    with urllib.request.urlopen(req, timeout=180) as r:
        obj = json.loads(r.read().decode())
    txt = obj['candidates'][0]['content']['parts'][0]['text']
    txt = txt.strip().strip('```json').strip('```').strip()
    return json.loads(txt)

def _norm(v, sep='、'):
    if isinstance(v, list):
        return sep.join([str(x) for x in v])
    return str(v)

def build_prompts(name:str, a:dict):
    colors = _norm(a.get('color_palette',[]), '、')
    textures = _norm(a.get('texture',[]), '、')
    points = _norm(a.get('selling_points',[]), '；')
    styles = _norm(a.get('style',[]), '、')
    comp = _norm(a.get('composition_suggestion',''), '')

    zh_main = (
        f'BabyNails 品牌电商产品图，SKU: {name}。保持原始甲片设计元素与花纹，不改变核心配色（{colors}）与质感（{textures}）。'
        f'突出卖点：{points}。风格统一为 {styles}。画面要求：干净纯色浅背景（#F8F6F4 或 #FFFFFF），'
        '柔和棚拍主光+轻微补光，阴影自然，高清细节，真实皮肤质感，适用于电商 shop 卡片，1:1 构图，主体占画面 75%-85%。'
        f'构图建议：{comp}。'
    )
    en_main = (
        f'BabyNails branded e-commerce product image, SKU: {name}. Preserve original nail design patterns and key color palette ({colors}) '
        f'with texture cues ({textures}). Highlight selling points: {points}. Unified style: {styles}. '
        'Use clean solid light background (#F8F6F4 or #FFFFFF), soft studio key light with gentle fill, natural shadow, '
        'high detail, realistic skin texture, optimized for shop cards, square 1:1 composition, subject coverage 75-85%.'
    )
    negative = (
        '低清晰度, 过曝, 过饱和, 杂乱背景, 多只手重影, 手指畸形, 指甲数量错误, logo水印, 文字, 边框, 噪点, 压缩伪影, 血腥, 色情'
    )
    params = {
        'aspect_ratio':'1:1',
        'framing':'close-up product focus',
        'lighting':'soft studio lighting',
        'background':'clean minimal light solid',
        'use_mode':'shop card / PDP thumbnail'
    }
    return zh_main, en_main, negative, params

imgs = sorted([p for p in SUPPLIER_DIR.glob('*') if p.suffix.lower() in ['.png','.jpg','.jpeg','.webp']])
records=[]
for img in imgs:
    print(f'Analyzing: {img.name}', flush=True)
    analysis = analyze_image(img)
    zh,en,neg,params = build_prompts(img.stem, analysis)
    records.append({
        'sku': img.stem,
        'source_image': str(img),
        'analysis': analysis,
        'prompt_zh_main': zh,
        'prompt_en_main': en,
        'negative_prompt': neg,
        'composition_params': params
    })

OUT_JSON.write_text(json.dumps(records, ensure_ascii=False, indent=2))

lines=['# BabyNails Supplier Image Prompts','','来源目录: '+str(SUPPLIER_DIR),'']
for r in records:
    lines += [f"## {r['sku']}",
              f"- Source: `{r['source_image']}`",
              f"- 识别: `{json.dumps(r['analysis'], ensure_ascii=False)}`",
              f"- 主提示(中文): {r['prompt_zh_main']}",
              f"- Main Prompt (EN): {r['prompt_en_main']}",
              f"- 负面提示: {r['negative_prompt']}",
              f"- 构图参数: `{json.dumps(r['composition_params'], ensure_ascii=False)}`",
              '']
OUT_MD.write_text('\n'.join(lines))
print(f'Wrote {OUT_JSON} and {OUT_MD}, total {len(records)} items')
