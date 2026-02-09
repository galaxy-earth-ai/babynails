
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const styles = [{'slug': 'classic-velvet-cat-eye', 'imageUrl': '/images/products/classic-velvet-cat-eye.png'}, {'slug': 'minimalist-milky-white', 'imageUrl': '/images/products/minimalist-milky-white.png'}, {'slug': '3d-chrome-molten-gold', 'imageUrl': '/images/products/3d-chrome-molten-gold.png'}, {'slug': 'french-glazed-donut', 'imageUrl': '/images/products/french-glazed-donut.png'}, {'slug': 'matte-gothic-noir', 'imageUrl': '/images/products/matte-gothic-noir.png'}, {'slug': 'blush-aura', 'imageUrl': '/images/products/blush-aura.png'}, {'slug': 'cyberpunk-holo-graphic', 'imageUrl': '/images/products/cyberpunk-holo-graphic.png'}, {'slug': 'pressed-flower-clear', 'imageUrl': '/images/products/pressed-flower-clear.png'}, {'slug': 'luxury-coffin-marble', 'imageUrl': '/images/products/luxury-coffin-marble.png'}, {'slug': 'short-squoval-tortoise', 'imageUrl': '/images/products/short-squoval-tortoise.png'}, {'slug': 'jelly-tint-ombre', 'imageUrl': '/images/products/jelly-tint-ombre.png'}, {'slug': 'rhinestone-encrusted', 'imageUrl': '/images/products/rhinestone-encrusted.png'}, {'slug': 'hand-painted-cherry-print', 'imageUrl': '/images/products/hand-painted-cherry-print.png'}, {'slug': 'abstract-line-art', 'imageUrl': '/images/products/abstract-line-art.png'}, {'slug': 'pearl-glaze-almond', 'imageUrl': '/images/products/pearl-glaze-almond.png'}];

async function main() {
  for (const style of styles) {
    try {
      const product = await prisma.product.update({
        where: { slug: style.slug },
        data: { imageUrl: style.imageUrl },
      });
      console.log(`Updated ${product.slug} with ${product.imageUrl}`);
    } catch (e) {
      console.error(`Failed to update ${style.slug}: ${e.message}`);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
