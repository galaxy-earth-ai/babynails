const { db } = require('../src/lib/db');
const { products: productsTable } = require('../src/lib/db/schema');
const { eq } = require('drizzle-orm');
const fs = require('fs').promises;
const path = require('path');

const WASHED_DIR = path.join(process.cwd(), 'public/images/products/ai_product_images');

async function run() {
  console.log('--- Starting Washed Image Update ---');
  const allProducts = await db.select().from(productsTable);
  
  let updatedCount = 0;
  for (const product of allProducts) {
    const washedFilename = `washed-${product.slug}.png`;
    const washedPath = path.join(WASHED_DIR, washedFilename);
    
    try {
      await fs.access(washedPath);
      const dbPath = `/images/products/ai_product_images/${washedFilename}`;
      
      if (product.image !== dbPath) {
        console.log(`  Updating ${product.slug}: ${dbPath}`);
        await db.update(productsTable)
          .set({ image: dbPath })
          .where(eq(productsTable.id, product.id));
        updatedCount++;
      }
    } catch (e) {
      // Washed file doesn't exist for this slug
    }
  }

  console.log(`--- Finished. Updated ${updatedCount} products to washed versions. ---`);
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
