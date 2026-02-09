"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Product } from '@/lib/products';
import { useCart } from '@/lib/CartContext';
import { ShoppingBag, Plus } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative bg-white/40 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-pink-200/20 transition-all duration-500"
    >
      <Link href={`/shop/${product.slug}`} className="block relative aspect-square overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-pink-900/0 group-hover:bg-pink-900/10 transition-colors duration-500" />
      </Link>

      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="text-xs uppercase tracking-widest text-pink-400 font-medium mb-1">
              {product.category}
            </p>
            <h3 className="font-playfair text-xl text-gray-800 group-hover:text-pink-600 transition-colors">
              {product.name}
            </h3>
          </div>
          <p className="font-medium text-gray-900">${product.price}</p>
        </div>
        
        <p className="text-sm text-gray-500 line-clamp-2 mb-4 h-10">
          {product.description}
        </p>

        <button
          onClick={() => addToCart(product)}
          className="w-full py-3 bg-pink-50 text-pink-600 rounded-xl flex items-center justify-center gap-2 font-medium hover:bg-pink-600 hover:text-white transition-all duration-300 active:scale-95"
        >
          <Plus size={18} />
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
};
