"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/lib/products';
import { ProductCard } from '@/components/ProductCard';
import { useLanguage } from '@/lib/LanguageContext';

interface ShopClientProps {
  products: Product[];
}

export default function ShopClient({ products }: ShopClientProps) {
  const { t, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = useMemo(
    () => [
      { id: 'All', label: t('shop.filters.all') },
      { id: 'Essential', label: t('shop.filters.essential') },
      { id: 'Boutique', label: t('shop.filters.boutique') },
      { id: 'Couture', label: t('shop.filters.couture') },
    ],
    [t]
  );

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'All') return products;
    return products.filter((p) => p.category === selectedCategory);
  }, [products, selectedCategory]);

  return (
    <main className="min-h-screen bg-[#f7f3ef] pt-24 pb-14 px-4 sm:px-6">
      <div className="mx-auto max-w-[1360px]">
        <header className="mb-8 sm:mb-10 text-center">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] uppercase tracking-[0.36em] text-[#a38376] font-semibold mb-3"
          >
            {t('shop.badge')}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-playfair text-4xl sm:text-5xl md:text-6xl text-[#2d211b]"
          >
            {t('shop.title')}
          </motion.h1>
          <p className="text-xs sm:text-sm text-[#77655c] mt-4">
            {language === 'zh' ? '双图展示：产品图 + 展示图，帮助更快挑选。' : 'Dual-image view: Product + Showcase for faster selection.'}
          </p>
        </header>

        <div className="mb-8 flex flex-wrap justify-center gap-2.5 sm:gap-3">
          {categories.map((tag) => (
            <button
              key={tag.id}
              onClick={() => setSelectedCategory(tag.id)}
              className={`rounded-full px-4 py-2 text-[10px] font-semibold tracking-[0.16em] uppercase transition ${
                selectedCategory === tag.id
                  ? 'bg-[#2e241f] text-white shadow-[0_10px_24px_rgba(46,36,31,0.24)]'
                  : 'bg-white text-[#715f56] border border-[#e3d9d1] hover:border-[#bda89d]'
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>

        <motion.section layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.22 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.section>

        {filteredProducts.length === 0 && <div className="py-20 text-center text-[#9f9188]">{t('shop_extra.no_products')}</div>}
      </div>
    </main>
  );
}
