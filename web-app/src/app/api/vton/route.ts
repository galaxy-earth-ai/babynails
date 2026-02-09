import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

const execPromise = promisify(exec);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const handImage = formData.get('handImage') as File;
    const productSlug = formData.get('productSlug') as string;

    if (!handImage || !productSlug) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const sessionId = Date.now().toString();
    const tempDir = path.join(process.cwd(), 'public/temp');
    await fs.mkdir(tempDir, { recursive: true });

    const handPath = path.join(tempDir, `${sessionId}_hand.png`);
    const outPath = path.join(tempDir, `${sessionId}_result.png`);
    
    const productsRoot = path.join(process.cwd(), 'public/images/products');
    const imageExts = ['.png', '.jpg', '.jpeg', '.webp'];

    const findProductImageBySlug = async (slug: string): Promise<string | null> => {
      const normalizedSlug = slug.replace(/\.(png|jpg|jpeg|webp)$/i, '').toLowerCase();
      const queue = [productsRoot];
      const matched: string[] = [];

      while (queue.length) {
        const current = queue.shift()!;
        const names = await fs.readdir(current).catch(() => [] as string[]);

        for (const name of names) {
          const abs = path.join(current, name);
          const stat = await fs.stat(abs).catch(() => null);
          if (!stat) continue;

          if (stat.isDirectory()) {
            queue.push(abs);
            continue;
          }

          const ext = path.extname(name).toLowerCase();
          if (!imageExts.includes(ext)) continue;
          if (!name.toLowerCase().startsWith(normalizedSlug)) continue;
          matched.push(abs);
        }
      }

      if (!matched.length) return null;
      matched.sort();
      return matched[0];
    };

    let finalProductPath = await findProductImageBySlug(productSlug);
    if (!finalProductPath) {
      return NextResponse.json({ error: `Product image not found for slug: ${productSlug}` }, { status: 404 });
    }

    console.log(`Starting VTON Core for session ${sessionId}...`);
    
    // Run the Python orchestrator
    // Note: We use the GEMINI_API_KEY from the environment
    const pythonCmd = `GEMINI_API_KEY=${process.env.GEMINI_API_KEY} python3 scripts/vton_core.py "${handPath}" "${finalProductPath}" "${outPath}"`;
    
    const { stdout, stderr } = await execPromise(pythonCmd);
    
    if (stderr) {
      console.error('Python Stderr:', stderr);
    }

    // Parse the last line of stdout which should be the JSON result
    const lines = stdout.trim().split('\n');
    const result = JSON.parse(lines[lines.length - 1]);

    if (result.error) {
      return NextResponse.json({ 
        error: result.error === "Validation failed" ? `Validation failed: ${result.reason}` : result.error, 
        reason: result.reason || 'Unknown error' 
      }, { status: 200 });
    }

    return NextResponse.json({ 
      success: true, 
      resultUrl: `/temp/${sessionId}_result.png` 
    });

  } catch (error: any) {
    console.error('VTON API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error', message: error.message }, { status: 500 });
  }
}
