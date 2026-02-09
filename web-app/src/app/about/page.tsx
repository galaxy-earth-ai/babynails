'use client';

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <main className="bg-background min-h-screen pt-40 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4 mb-8"
            >
              <div className="w-12 h-px bg-rose-gold" />
              <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-rose-gold">{t('about.badge')}</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-6xl md:text-8xl font-serif leading-[0.9] tracking-tighter mb-16"
            >
              {t('about.title')} <br /><span className="italic text-rose-gold">{t('about.titleItalic')}</span>
            </motion.h1>
            <div className="space-y-10 text-lg leading-relaxed text-muted max-w-xl">
              <p>{t('about.p1')}</p>
              <p>{t('about.p2')}</p>
              <p className="font-serif italic text-foreground text-2xl border-l-2 border-rose-gold pl-8 py-4">{t('about.quote')}</p>
            </div>
          </div>
          <div className="lg:col-span-5 relative">
            <div className="aspect-[3/4] bg-ivory border border-rose-gold/10 p-4 shadow-2xl relative z-10">
              <div className="w-full h-full bg-rose-gold/5 flex items-center justify-center italic text-rose-gold/20 font-serif text-3xl">{t('about.ethos')}</div>
            </div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-rose-gold/5 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </main>
  );
}
