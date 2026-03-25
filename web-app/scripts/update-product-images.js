
const { db } = require('../src/lib/db');
const { products: productsTable } = require('../src/lib/db/schema');
const { eq } = require('drizzle-orm');
const fs = require('fs').promises;
const path = require('path');

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
const SEARCH_DIRS = ['ai_product_images', 'ai_showcase_images', 'supplier_originals', 'pending_review'];

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
  // Return the shortest match or first one
  return `/images/products/${matched[0]}`;
}

async function run() {
  console.log('--- Starting Image Path Cleanup ---');
  const allProducts = await db.select().from(productsTable);
  console.log(`Found ${allProducts.length} products.`);

  let updatedCount = 0;

  for (const product of allProducts) {
    console.log(`Checking ${product.slug}...`);
    
    let bestImage = null;
    for (const dir of SEARCH_DIRS) {
      const found = await findImageBySlug(product.slug, dir);
      if (found) {
        bestImage = found;
        break; // Priority order based on SEARCH_DIRS
      }
    }

    if (bestImage && bestImage !== product.image) {
      console.log(`  Updating path: ${product.image} -> ${bestImage}`);
      await db.update(productsTable)
        .set({ image: bestImage })
        .where(eq(productsTable.id, product.id));
      updatedCount++;
    } else if (!bestImage) {
      console.warn(`  [!] No image found for slug: ${product.slug}`);
    } else {
      console.log(`  Path already correct: ${product.image}`);
    }
  }

  console.log(`--- Cleanup Finished. Updated ${updatedCount} products. ---`);
  process.exit(0);
}

run().catch(err => {
  console.error('Error during cleanup:', err);
  process.exit(1);
});
