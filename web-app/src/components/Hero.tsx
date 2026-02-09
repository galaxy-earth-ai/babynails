'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';

export const Hero = () => {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-[92vh] flex flex-col justify-center overflow-hidden bg-[#f7f3ef] px-4 sm:px-6 pt-28 pb-14">
      <div className="absolute top-[-10%] right-[-5%] w-[70vw] h-[70vw] rounded-full bg-[#b48f7f]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[50vw] h-[50vw] rounded-full bg-[#b48f7f]/8 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-8 relative z-10">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="flex items-center gap-4 mb-7">
              <div className="w-12 h-px bg-[#9d7f71]" />
              <span className="text-[10px] sm:text-xs font-semibold tracking-[0.34em] uppercase text-[#9d7f71]">{t('hero.badge')}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 1 }}
              className="text-[14vw] sm:text-[10vw] lg:text-[6.6vw] font-serif leading-[0.92] tracking-tight mb-8 text-[#2f2520]"
            >
              {t('hero.title')} <br />
              <span className="italic text-[#8f7265]">{t('hero.titleItalic')}</span>
            </motion.h1>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 1 }} className="flex flex-col md:flex-row md:items-center gap-7">
              <p className="text-[#6d5c53] text-base sm:text-lg max-w-md leading-relaxed">{t('hero.subtitle')}</p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/shop" className="group relative px-7 py-4 rounded-xl bg-[#2f2520] text-white text-[11px] font-semibold tracking-[0.2em] uppercase overflow-hidden">
                  <span className="relative z-10">{t('hero.cta')}</span>
                </Link>

                <button className="px-7 py-4 rounded-xl border border-[#b89f92] text-[#6e584f] text-[11px] font-semibold tracking-[0.2em] uppercase hover:bg-[#f0e7e1] transition-all duration-300">
                  {t('hero.tryon')}
                </button>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-4 relative hidden lg:block">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 0.5, duration: 1.5, ease: 'easeOut' }}
              className="aspect-[3/4] bg-white border border-[#e3d7cf] p-4 shadow-2xl rotate-3"
            >
              <div className="w-full h-full bg-[#f4ece7] flex items-center justify-center relative overflow-hidden">
                <span className="font-serif italic text-[#ab9083]/40 text-4xl">{t('hero_extra.studio_view')}</span>
                <div className="absolute top-0 left-0 w-full h-full border border-[#dac8be]/40 scale-95" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
