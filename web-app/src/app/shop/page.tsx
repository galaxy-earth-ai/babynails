import React from 'react';
import { getProducts } from '@/lib/products';
import ShopClient from './ShopClient';

export default async function ShopPage() {
  const products = await getProducts();

  return <ShopClient products={products} />;
}
