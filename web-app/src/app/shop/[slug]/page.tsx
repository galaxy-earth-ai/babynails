import React from 'react';
import { getProductBySlug, getProducts } from '@/lib/products';
import ProductDetailClient from './ProductDetailClient';

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Product not found</p>
      </div>
    );
  }

  const allProducts = await getProducts();
  const recommendedProducts = allProducts
    .filter((p) => p.slug !== slug)
    .slice(0, 4);

  return (
    <ProductDetailClient 
      product={product} 
      recommendedProducts={recommendedProducts} 
    />
  );
}
