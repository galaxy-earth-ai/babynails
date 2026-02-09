import os
import sys
import json
import base64
import urllib.request
import urllib.error
import mimetypes
from pathlib import Path

def get_api_key():
    key = os.environ.get("GEMINI_API_KEY")
    if not key:
        print("Error: GEMINI_API_KEY environment variable not set", file=sys.stderr)
        sys.exit(1)
    return key

def load_image_data(path):
    try:
        with open(path, "rb") as f:
            data = base64.b64encode(f.read()).decode()
        mime_type, _ = mimetypes.guess_type(path)
        if not mime_type:
            mime_type = "image/png"  # Fallback
        return data, mime_type
    except FileNotFoundError:
        print(json.dumps({"error": f"File not found: {path}"}))
        sys.exit(1)
    except Exception as e:
        print(json.dumps({"error": f"Failed to load image {path}: {str(e)}"}))
        sys.exit(1)

def call_gemini_api(payload, model="gemini-3-pro-preview"):
    api_key = get_api_key()
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
    headers = {"Content-Type": "application/json"}
    data = json.dumps(payload).encode()
    req = urllib.request.Request(url, data=data, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            return json.loads(resp.read().decode())
    except Exception as e:
        print(f"API Call failed: {e}", file=sys.stderr)
        return None

def validate_hand(image_path):
    img_data, mime_type = load_image_data(image_path)
    # Relaxed prompt to be more forgiving
    prompt = (
        "Task: Determine if this image contains a human hand suitable for a virtual nail try-on. "
        "The hand doesn't need to be perfect, but fingernails or fingertips should be visible. "
        "Be forgiving: if it looks like a hand or fingers, mark it as valid. "
        "Respond ONLY with a JSON object: {\"valid\": boolean, \"reason\": \"string\", \"debug_info\": \"string\"}."
    )
    
    payload = {
        "contents": [{
            "parts": [
                {"text": prompt},
                {"inlineData": {"mimeType": mime_type, "data": img_data}}
            ]
        }],
        "generationConfig": {
            "responseMimeType": "application/json"
        }
    }
    
    result = call_gemini_api(payload)
    if not result:
        return {"valid": False, "reason": "API Failure during validation"}
    
    # Enhanced Logging for debugging to stderr
    print(f"--- DEBUG: Gemini Validation Raw Response ---", file=sys.stderr)
    print(json.dumps(result, indent=2), file=sys.stderr)
    print(f"-------------------------------------------", file=sys.stderr)

    try:
        text = result["candidates"][0]["content"]["parts"][0]["text"]
        return json.loads(text)
    except Exception as e:
        return {"valid": False, "reason": f"Failed to parse validation response: {str(e)}"}

def generate_tryon(hand_path, product_path, output_path):
    hand_b64, hand_mime = load_image_data(hand_path)
    product_b64, product_mime = load_image_data(product_path)
    
    # Precise instructions for AI Stitching
    prompt = (
        "Instructions: This is a Virtual Try-On task. "
        "Apply the nail art style/pattern from the SECOND image (the product) onto the fingernails of the FIRST image (the hand). "
        "Requirement: Keep the hand image EXACTLY the same (pose, skin, lighting, background). "
        "ONLY modify the fingernails to match the product's design. "
        "The result must look photorealistic, as if the person is wearing these press-on nails."
    )
    
    payload = {
        "contents": [{
            "parts": [
                {"text": prompt},
                {"inlineData": {"mimeType": hand_mime, "data": hand_b64}},
                {"inlineData": {"mimeType": product_mime, "data": product_b64}}
            ]
        }],
        "generationConfig": {
            "responseModalities": ["TEXT", "IMAGE"]
        }
    }
    
    result = call_gemini_api(payload, model="gemini-3-pro-preview")
    
    if not result:
        return False
        
    try:
        content = result["candidates"][0]["content"]["parts"]
        for part in content:
            if "inlineData" in part:
                img_bytes = base64.b64decode(part["inlineData"]["data"])
                with open(output_path, "wb") as f:
                    f.write(img_bytes)
                return True
    except Exception as e:
        print(f"Stitching failed: {e}", file=sys.stderr)
    return False

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: python3 vton_core.py hand.png product.png output.png")
        sys.exit(1)
    
    hand, product, out = sys.argv[1:4]
    
    print(f"Phase 1: Validating hand image...")
    validation = validate_hand(hand)
    if not validation.get("valid"):
        print(json.dumps({
            "error": f"Validation failed: {validation.get('reason')}", 
            "reason": validation.get("reason"), 
            "debug": validation.get("debug_info")
        }))
        sys.exit(0)
    
    print(f"Phase 2: Generating AI Stitched Try-On...")
    success = generate_tryon(hand, product, out)
    if success:
        print(json.dumps({"success": True, "output": out}))
    else:
        print(json.dumps({"error": "Stitching failed"}))
