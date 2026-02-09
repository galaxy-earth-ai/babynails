import { pgTable, text, numeric, integer, serial } from 'drizzle-orm/pg-core';

export const products = pgTable('Product', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  description: text('description'),
  image: text('imageUrl'),
  category: text('category'),
  supplierUrl: text('supplierUrl'),
  sku: text('sku'),
  shopifyProductId: text('shopifyProductId'),
  shopifyVariantId: text('shopifyVariantId'),
  stock: integer('stock').default(0),
});

export const services = pgTable('Service', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  duration: integer('duration'),
  category: text('category'),
});
