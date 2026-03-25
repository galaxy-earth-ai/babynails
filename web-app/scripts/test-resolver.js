
const fs = require('fs').promises;
const path = require('path');

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
const PRIORITY_DIRS = ['ai_product_images'];
const SHOWCASE_DIRS = ['ai_showcase_images'];
const SUPPLIER_DIRS = ['supplier_originals', 'pending_review'];

async function safeReadDir(absoluteDir) {
  try {
    return await fs.readdir(absoluteDir);
  } catch (e) {
    return [];
  }
}

async function findImageBySlug(slug, relativeDir) {
  const absoluteDir = path.join(process.cwd(), 'public', 'images', 'products', relativeDir);
  const queue = [absoluteDir];
  const matched = [];

  while (queue.length) {
    const current = queue.shift();
    const names = await safeReadDir(current);

    for (const name of names) {
      const absolutePath = path.join(current, name);
      const stat = await fs.stat(absolutePath).catch(() => null);
      if (!stat) continue;

      if (stat.isDirectory()) {
        queue.push(absolutePath);
        continue;
      }

      if (!IMAGE_EXTENSIONS.includes(path.extname(name).toLowerCase())) continue;
      if (!name.toLowerCase().startsWith(slug.toLowerCase())) continue;

      const relFromProducts = path
        .relative(path.join(process.cwd(), 'public', 'images', 'products'), absolutePath)
        .split(path.sep)
        .join('/');
      matched.push(relFromProducts);
    }
  }

  if (!matched.length) return null;
  matched.sort();
  return `/images/products/${matched[0]}`;
}

async function test() {
  const slug = 'pressed-flower-clear';
  console.log('Testing slug:', slug);
  
  for (const dir of [...PRIORITY_DIRS, ...SHOWCASE_DIRS, ...SUPPLIER_DIRS]) {
    const found = await findImageBySlug(slug, dir);
    console.log(`In ${dir}:`, found);
  }
}

test();
