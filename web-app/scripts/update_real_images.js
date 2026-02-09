const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

const products = [
    "classic-velvet-cat-eye",
    "minimalist-milky-white",
    "3d-chrome-molten-gold",
    "french-glazed-donut",
    "matte-gothic-noir",
    "blush-aura",
    "blush-aura-korean-style",
    "cyberpunk-holo-graphic",
    "pressed-flower-clear",
    "luxury-coffin-marble",
    "short-squoval-tortoise",
    "jelly-tint-ombre",
    "rhinestone-encrusted",
    "hand-painted-cherry-print",
    "abstract-line-art",
    "pearl-glaze-almond"
];

async function main() {
  await client.connect();
  try {
    for (const slug of products) {
      await client.query(
        'UPDATE "Product" SET "imageUrl" = $1 WHERE "slug" = $2',
        [`/images/products/${slug}.png`, slug]
      );
    }
    console.log("Database updated with real image paths.");
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

main();
