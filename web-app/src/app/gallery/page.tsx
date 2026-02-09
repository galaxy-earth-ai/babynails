'use client';

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";

export default function GalleryPage() {
  const { t } = useLanguage();

  const galleryImages = [
    { title: t('gallery.pure_silk'), category: t('gallery.minimalist') },
    { title: t('gallery.midnight_bloom'), category: t('gallery.avant_garde') },
    { title: t('gallery.sahara_mist'), category: t('gallery.seasonal') },
    { title: t('gallery.gilded_edge'), category: t('gallery.editorial') },
    { title: t('gallery.ivory_coast'), category: t('gallery.minimalist') },
    { title: t('gallery.rose_quartz'), category: t('gallery.nature') }
  ];

  return (
    <main className="bg-[#0a0a0a] min-h-screen pt-40 pb-20 px-6 text-ivory">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-end mb-32 gap-8">
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="w-2 h-2 rounded-full bg-rose-gold" />
              <span className="text-[10px] font-bold tracking-[0.5em] uppercase text-rose-gold">{t('gallery.badge')}</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-6xl md:text-8xl font-serif tracking-tighter"
            >
              {t('gallery.title')} <span className="italic text-rose-gold">{t('gallery.titleItalic')}</span> <br />{t('gallery.titleEnd')}
            </motion.h1>
          </div>
          <p className="text-ivory/40 text-sm max-w-xs uppercase tracking-widest leading-relaxed">
            {t('gallery.desc')}
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-20">
          {galleryImages.map((img, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="group cursor-crosshair"
            >
              <div className="aspect-[4/5] bg-ivory/5 border border-white/5 overflow-hidden relative mb-6">
                <div className="absolute inset-0 bg-rose-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="w-full h-full flex items-center justify-center italic text-white/5 font-serif text-2xl">
                  {img.title}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <h3 className="font-serif italic text-lg">{img.title}</h3>
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-rose-gold/60">{img.category}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
