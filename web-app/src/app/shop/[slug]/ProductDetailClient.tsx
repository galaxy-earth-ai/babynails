"use client";

import React, { useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Product } from '@/lib/products';
import { useCart } from '@/lib/CartContext';
import Image from 'next/image';
import { useVton } from '@/lib/VtonContext';
import { useLanguage } from '@/lib/LanguageContext';
import dynamic from 'next/dynamic';
import { ChevronLeft, ChevronRight, Plus, ShieldCheck, Truck, RefreshCcw, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const VtonModal = dynamic(() => import('@/components/VtonModal').then((mod) => mod.VtonModal), { ssr: false });

interface ProductDetailClientProps {
  product: Product;
  recommendedProducts?: Product[];
}

export default function ProductDetailClient({ product, recommendedProducts = [] }: ProductDetailClientProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { setIsVtonOpen } = useVton();
  const { t, language } = useLanguage();

  const productImages = useMemo(
    () => (product.images?.length ? product.images : product.image ? [product.image] : []),
    [product.images, product.image]
  );

  const galleryImages = useMemo(() => {
    const primaryPair = [productImages[0], productImages[1]].filter(Boolean) as string[];
    const rest = productImages.slice(2);
    return Array.from(new Set([...primaryPair, ...rest]));
  }, [productImages]);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const hasMultipleImages = galleryImages.length > 1;
  const activeIndex = Math.min(selectedIndex, Math.max(galleryImages.length - 1, 0));
  const selectedImage = galleryImages[activeIndex] || null;

  const onSelectImage = (index: number) => {
    if (index < 0 || index >= galleryImages.length) return;
    setSelectedIndex(index);
  };

  const onPrevImage = () => {
    if (!galleryImages.length) return;
    setSelectedIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const onNextImage = () => {
    if (!galleryImages.length) return;
    setSelectedIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const onTouchStart: React.TouchEventHandler<HTMLDivElement> = (event) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const onTouchEnd: React.TouchEventHandler<HTMLDivElement> = (event) => {
    if (!hasMultipleImages || touchStartX.current === null) return;
    const touchEndX = event.changedTouches[0]?.clientX ?? touchStartX.current;
    const deltaX = touchEndX - touchStartX.current;
    touchStartX.current = null;

    if (Math.abs(deltaX) < 40) return;
    if (deltaX > 0) onPrevImage();
    else onNextImage();
  };

  return (
    <main className="min-h-screen bg-[#f7f3ef] pt-24 sm:pt-28 pb-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-[#7a6760] hover:text-[#2f2520] transition mb-6">
          <ChevronLeft size={18} />
          <span className="text-[11px] font-semibold tracking-[0.14em] uppercase">{t('shop.back') || 'Back to Collection'}</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {selectedImage && (
              <div
                className="relative aspect-square rounded-2xl overflow-hidden border border-[#e8ddd5] bg-white"
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
              >
                <Image src={selectedImage} alt={product.name} fill className="object-cover" />

                {hasMultipleImages && (
                  <>
                    <button
                      type="button"
                      onClick={onPrevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/85 p-2 text-[#4e3f37] shadow hover:bg-white"
                      aria-label="Previous image"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={onNextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/85 p-2 text-[#4e3f37] shadow hover:bg-white"
                      aria-label="Next image"
                    >
                      <ChevronRight size={18} />
                    </button>
                    <div className="absolute bottom-3 right-3 rounded-full bg-black/45 px-2.5 py-1 text-[10px] text-white">
                      {activeIndex + 1}/{galleryImages.length}
                    </div>
                  </>
                )}
              </div>
            )}

            {galleryImages.length > 0 && (
              <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 sm:grid sm:grid-cols-5 sm:overflow-visible">
                {galleryImages.map((img, index) => {
                  const isActive = activeIndex === index;
                  const label =
                    index === 0
                      ? language === 'zh'
                        ? '产品图'
                        : 'Product'
                      : index === 1
                        ? language === 'zh'
                          ? '展示图'
                          : 'Showcase'
                        : `${language === 'zh' ? '图片' : 'Image'} ${index + 1}`;

                  return (
                    <button
                      key={`${product.slug}-thumb-${index}`}
                      type="button"
                      onClick={() => onSelectImage(index)}
                      className={`relative aspect-square min-w-20 shrink-0 overflow-hidden rounded-xl border transition sm:min-w-0 ${
                        isActive ? 'border-[#4a3931] ring-2 ring-[#4a3931]/20' : 'border-[#e5d8cf] hover:border-[#b89f92]'
                      }`}
                      aria-label={`View image ${index + 1}`}
                      aria-pressed={isActive}
                    >
                      <Image src={img} alt={`${product.name} ${index + 1}`} fill className="object-cover" />
                      <span className="absolute left-1.5 top-1.5 rounded-full bg-white/90 px-2 py-0.5 text-[9px] font-semibold tracking-[0.14em] uppercase text-[#7b675e]">
                        {label}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </motion.section>

          <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#a08374] font-semibold mb-3">{t(product.category || '')}</p>
            <h1 className="font-playfair text-4xl sm:text-5xl text-[#2f2520] mb-4">{t(product.name)}</h1>
            <p className="text-2xl sm:text-3xl text-[#3c2f29] font-serif italic mb-6">${product.price}</p>

            <p className="text-[#6f5f56] leading-relaxed mb-3">{t(product.description || '')}</p>
            <p className="text-[#85746b] text-sm leading-relaxed mb-8">{t('shop.craftsmanship_desc')}</p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-sm text-[#6f5f56]"><ShieldCheck size={16} className="text-[#9d7f71]" />{t('product.custom_fit')}</div>
              <div className="flex items-center gap-3 text-sm text-[#6f5f56]"><Truck size={16} className="text-[#9d7f71]" />{t('product.fast_shipping')}</div>
              <div className="flex items-center gap-3 text-sm text-[#6f5f56]"><RefreshCcw size={16} className="text-[#9d7f71]" />{t('product.reusable')}</div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => addToCart(product)}
                className="flex-1 rounded-xl bg-[#2f2520] text-white px-6 py-3.5 text-sm font-semibold tracking-[0.12em] uppercase hover:bg-[#221a16] transition inline-flex items-center justify-center gap-2"
              >
                <Plus size={16} />
                {t('product.add_to_bag')}
              </button>

              <button
                onClick={() => setIsVtonOpen(true)}
                className="flex-1 rounded-xl border border-[#cfbeb3] bg-white text-[#5d4a41] px-6 py-3.5 text-sm font-semibold tracking-[0.12em] uppercase hover:border-[#a98e80] transition inline-flex items-center justify-center gap-2"
              >
                <Sparkles size={16} />
                {t('product.virtual_tryon')}
              </button>
            </div>
          </motion.section>
        </div>

        {recommendedProducts.length > 0 && (
          <section className="mt-16 sm:mt-20">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#a08374] font-semibold mb-2">{t('product.curated_for_you')}</p>
                <h2 className="font-playfair text-3xl sm:text-4xl text-[#2f2520]">{t('product.more_collection')}</h2>
              </div>
              <Link href="/shop" className="hidden sm:inline-flex items-center gap-1 text-sm text-[#5f4f47] hover:text-[#2f2520]">
                {t('product.view_all')} <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
              {recommendedProducts.map((item) => (
                <Link key={item.id} href={`/shop/${item.slug}`} className="group rounded-xl border border-[#e8ddd5] bg-white overflow-hidden">
                  <div className="relative aspect-[4/5] bg-[#f6f1ec]">
                    <Image src={item.images?.[0] || item.image || '/placeholder-nail.jpg'} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-3">
                    <h3 className="font-playfair text-lg text-[#2f2520] line-clamp-1">{t(item.name)}</h3>
                    <p className="text-sm text-[#6f5f56]">${item.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      <VtonModal currentProduct={product} />
    </main>
  );
}
