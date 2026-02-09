'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import { CheckCircle2, Loader2 } from 'lucide-react';

export default function BookPage() {
  const { t } = useLanguage();
  const [isSubmitting, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      fullName: formData.get('fullName'),
      email: formData.get('email'),
      experience: formData.get('experience'),
    };

    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (res.ok) {
        setIsSuccess(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="bg-background min-h-screen pt-40 pb-20 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <header className="mb-20">
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[10px] font-bold tracking-[0.5em] uppercase text-rose-gold mb-8 block"
          >
            {t('book.badge')}
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-serif tracking-tighter"
          >
            {t('book.title')} <span className="italic text-rose-gold">{t('book.titleItalic')}</span>
          </motion.h1>
        </header>

        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.form 
              key="form"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onSubmit={handleSubmit}
              className="space-y-12 text-left bg-ivory border border-rose-gold/10 p-12 shadow-sm"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-widest uppercase text-muted">{t('book.name')}</label>
                  <input name="fullName" required type="text" className="w-full bg-transparent border-b border-rose-gold/20 py-3 focus:outline-none focus:border-rose-gold transition-colors font-serif" placeholder="Alexander McQueen" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-widest uppercase text-muted">{t('book.email')}</label>
                  <input name="email" required type="email" className="w-full bg-transparent border-b border-rose-gold/20 py-3 focus:outline-none focus:border-rose-gold transition-colors font-serif" placeholder="studio@example.com" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold tracking-widest uppercase text-muted">{t('book.experience')}</label>
                <select name="experience" className="w-full bg-transparent border-b border-rose-gold/20 py-3 focus:outline-none focus:border-rose-gold transition-colors font-serif appearance-none cursor-pointer">
                  <option>{t('items.Signature Gel Manicure')}</option>
                  <option>{t('items.Luxury Spa Pedicure')}</option>
                  <option>{t('items.Gel-X Extensions')}</option>
                  <option>{t('items.Natural Classic Set')}</option>
                  <option>{t('items.Signature Hybrid Set')}</option>
                  <option>{t('items.Grand Volume Set')}</option>
                </select>
              </div>

              <button 
                disabled={isSubmitting}
                className="w-full bg-foreground text-background py-6 text-xs font-bold tracking-[0.3em] uppercase hover:bg-rose-gold transition-all duration-700 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    {t('book.submitting')}
                  </>
                ) : t('book.cta')}
              </button>
              
              <p className="text-center text-[10px] text-muted tracking-widest uppercase">
                {t('book.disclaimer')}
              </p>
            </motion.form>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white border border-rose-gold/10 p-20 shadow-xl rounded-3xl"
            >
              <div className="flex flex-col items-center space-y-6">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500">
                  <CheckCircle2 size={40} />
                </div>
                <h2 className="text-3xl font-serif">{t('book.success_title')}</h2>
                <p className="text-muted max-w-sm">{t('book.success_desc')}</p>
                <button 
                  onClick={() => setIsSuccess(false)}
                  className="text-xs font-bold tracking-widest uppercase text-rose-gold hover:underline pt-4"
                >
                  {t('book.back')}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
