import { db } from './db';
import { products as productsTable } from './db/schema';
import { eq } from 'drizzle-orm';
import { promises as fs } from 'fs';
import path from 'path';

export interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  description: string | null;
  image: string | null;
  images: string[];
  category: string | null;
  shopifyProductId?: string | null;
  shopifyVariantId?: string | null;
}

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
const PRIORITY_DIRS = ['ai_product_images'];
const SHOWCASE_DIRS = ['ai_showcase_images'];
const SUPPLIER_DIRS = ['supplier_originals', 'pending_review'];

async function safeReadDir(absoluteDir: string): Promise<string[]> {
  try {
    return await fs.readdir(absoluteDir);
  } catch {
    return [];
  }
}

function normalizeImageUrl(image: string | null | undefined): string | null {
  if (!image) return null;
  if (image.startsWith('http://') || image.startsWith('https://') || image.startsWith('/')) {
    return image;
  }
  return `/${image}`;
}

function uniqueImages(images: Array<string | null | undefined>): string[] {
  return Array.from(new Set(images.filter((img): img is string => Boolean(img))));
}

async function findImageBySlug(slug: string, relativeDir: string): Promise<string | null> {
  const absoluteDir = path.join(process.cwd(), 'public', 'images', 'products', relativeDir);
  const queue = [absoluteDir];
  const matched: string[] = [];

  while (queue.length) {
    const current = queue.shift()!;
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

async function resolveProductImages(p: { slug: string; image: string | null }): Promise<string[]> {
  const legacyMain = normalizeImageUrl(p.image);

  const [brandImage, showcaseImage] = await Promise.all([
    (async () => {
      for (const dir of PRIORITY_DIRS) {
        const found = await findImageBySlug(p.slug, dir);
        if (found) return found;
      }
      return null;
    })(),
    (async () => {
      for (const dir of SHOWCASE_DIRS) {
        const found = await findImageBySlug(p.slug, dir);
        if (found) return found;
      }
      return null;
    })(),
  ]);

  const supplierImage = (await Promise.all(SUPPLIER_DIRS.map((dir) => findImageBySlug(p.slug, dir)))).find(Boolean) || null;
  const images = uniqueImages([brandImage, showcaseImage, supplierImage, legacyMain]);

  return images.length ? images : uniqueImages([legacyMain]);
}

type ProductRecord = {
  id: number;
  name: string;
  slug: string;
  price: string;
  description: string | null;
  image: string | null;
  category: string | null;
  shopifyProductId?: string | null;
  shopifyVariantId?: string | null;
};

function mapProductRecord(p: ProductRecord, images: string[]): Product {
  return {
    ...p,
    price: parseFloat(p.price as string),
    image: images[0] || normalizeImageUrl(p.image),
    images,
  };
}

export async function getProducts(): Promise<Product[]> {
  const result = await db.select().from(productsTable);
  return Promise.all(result.map(async (p) => mapProductRecord(p, await resolveProductImages(p))));
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const result = await db.select().from(productsTable).where(eq(productsTable.slug, slug)).limit(1);
  if (result.length === 0) return undefined;

  const product = result[0];
  const images = await resolveProductImages(product);
  return mapProductRecord(product, images);
}
