'use client';

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";

export default function ServicesPage() {
  const { t } = useLanguage();

  const serviceCategories = [
    {
      title: t('services.nails.title'),
      description: t('services.nails.desc'),
      items: [
        { name: "Signature Gel Manicure", price: "$75", desc: "Detailed cuticle care, shaping, and high-quality gel polish. Includes organic oil hand massage." },
        { name: "Luxury Spa Pedicure", price: "$95", desc: "Relaxing soak, exfoliation, callous treatment, and hydrating mask with gel finish." },
        { name: "Gel-X Extensions", price: "$120", desc: "The gold standard of extensions. Lightweight, durable, and natural-looking full-cover sets." }
      ]
    },
    {
      title: t('services.lashes.title'),
      description: t('services.lashes.desc'),
      items: [
        { name: "Natural Classic Set", price: "$150", desc: "1:1 application for a refined, 'mascara-only' look with customized curl." },
        { name: "Signature Hybrid Set", price: "$185", desc: "A sophisticated blend of classic and volume for added texture and soft fluffiness." },
        { name: "Grand Volume Set", price: "$220", desc: "Multi-lash fans for a dramatic, dense, and glamorous editorial look." }
      ]
    }
  ];

  return (
    <main className="bg-background min-h-screen pt-40 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-8"
          >
            <div className="w-12 h-px bg-rose-gold" />
            <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-rose-gold">{t('services.badge')}</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl md:text-9xl font-serif leading-none tracking-tighter"
          >
            {t('services.title')} <br /><span className="italic text-rose-gold">{t('services.titleItalic')}</span>
          </motion.h1>
        </header>

        <div className="space-y-40">
          {serviceCategories.map((cat, i) => (
            <section key={i} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-4">
                <h2 className="text-3xl font-serif mb-6">{cat.title}</h2>
                <p className="text-muted leading-relaxed">{cat.description}</p>
              </div>
              <div className="lg:col-span-8 space-y-12">
                {cat.items.map((item, j) => (
                  <motion.div 
                    key={j}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="group flex justify-between items-start border-b border-rose-gold/10 pb-8 hover:border-rose-gold/40 transition-colors"
                  >
                    <div className="max-w-md">
                      <h3 className="text-xl font-medium mb-2 group-hover:text-rose-gold transition-colors">{t(item.name)}</h3>
                      <p className="text-sm text-muted leading-relaxed">{t(item.desc)}</p>
                    </div>
                    <span className="text-2xl font-serif italic text-rose-gold">{item.price}</span>
                  </motion.div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
