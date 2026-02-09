'use client';

import { Hero } from '@/components/Hero';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Product } from '@/lib/products';
import { ProductCard } from '@/components/ProductCard';
import { useLanguage } from '@/lib/LanguageContext';

interface HomeClientProps {
  featuredProducts: Product[];
}

export default function HomeClient({ featuredProducts }: HomeClientProps) {
  const { t, language } = useLanguage();

  const services = [
    { name: t('home.service1.name'), price: '$75+', desc: t('home.service1.desc') },
    { name: t('home.service2.name'), price: '$120+', desc: t('home.service2.desc') },
    { name: t('home.service3.name'), price: '$95+', desc: t('home.service3.desc') },
  ];

  return (
    <main className="bg-[#f7f3ef] min-h-screen relative">
      <Hero />

      <section className="py-16 sm:py-20">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-end mb-8 sm:mb-10 gap-4">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.34em] uppercase text-[#a08374] mb-2">{t('home.featured_badge')}</p>
              <h2 className="text-3xl sm:text-5xl font-playfair text-[#2f2520]">
                {t('home.featured_title')} <span className="italic text-[#8f7265]">{t('home.featured_titleItalic')}</span>
              </h2>
              <p className="text-xs text-[#7a6a61] mt-3">{language === 'zh' ? '双图卡片：产品图 + 展示图。' : 'Dual-image cards: product view + showcase view.'}</p>
            </div>
            <Link href="/shop" className="inline-flex items-center gap-2 text-[10px] font-semibold tracking-[0.26em] uppercase text-[#5f4c43] border-b border-[#cdbeb4] pb-1 hover:text-[#2f2520] hover:border-[#8f7265] transition">
              {t('home.explore_shop')}
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 px-4 sm:px-6 border-y border-[#e4d7ce] bg-white/30">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <p className="text-[10px] font-semibold tracking-[0.34em] uppercase text-[#a08374] mb-2">{t('home.excellence')}</p>
            <h2 className="text-3xl sm:text-5xl font-playfair text-[#2f2520]">
              {t('home.services_title')} <span className="italic text-[#8f7265]">{t('home.services_titleItalic')}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {services.map((service, i) => (
              <motion.article
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-2xl border border-[#e4d7ce] bg-white p-6"
              >
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#a08374] mb-3">0{i + 1}</p>
                <h3 className="text-2xl font-playfair text-[#2f2520] mb-2">{service.name}</h3>
                <p className="text-sm text-[#77655c] leading-relaxed mb-6">{service.desc}</p>
                <div className="border-t border-[#ece2db] pt-4 text-[#5f4c43] font-serif italic text-xl">{service.price}</div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
