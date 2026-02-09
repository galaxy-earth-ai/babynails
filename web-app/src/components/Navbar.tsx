'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { BabyNailsLogo } from './BabyNailsLogo';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/CartContext';
import { CartDrawer } from './CartDrawer';
import { useLanguage } from '@/lib/LanguageContext';

export const Navbar = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { totalItems } = useCart();
  const { language, setLanguage, t } = useLanguage();

  const menuItems = [
    { name: t('nav.services'), href: '/services' },
    { name: t('nav.shop'), href: '/shop' },
    { name: t('nav.about'), href: '/about' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="fixed top-0 w-full z-50 px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center bg-[#fbf8f4]/90 backdrop-blur-md border-b border-[#eadfd8]"
      >
        <Link href="/">
          <BabyNailsLogo className="text-[#8c6e60]" />
        </Link>

        <div className="hidden md:flex space-x-8 items-center">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-[10px] font-semibold tracking-[0.26em] uppercase text-[#5f4c43] hover:text-[#2c201a] transition-colors">
              {item.name}
            </Link>
          ))}

          <div className="flex items-center gap-4 border-l border-[#e4d8d1] pl-6">
            <div className="flex items-center gap-1.5 bg-white p-1 rounded-full border border-[#e6dad3]">
              <button onClick={() => setLanguage('en')} className={`px-3 py-1 text-[9px] font-semibold rounded-full transition ${language === 'en' ? 'bg-[#2f2520] text-white' : 'text-[#7a665d]'}`}>
                EN
              </button>
              <button onClick={() => setLanguage('zh')} className={`px-3 py-1 text-[9px] font-semibold rounded-full transition ${language === 'zh' ? 'bg-[#2f2520] text-white' : 'text-[#7a665d]'}`}>
                中文
              </button>
            </div>

            <button onClick={() => setIsCartOpen(true)} className="relative p-2 text-[#3d2f28] hover:text-[#2f2520] transition-colors">
              <ShoppingBag size={19} strokeWidth={1.6} />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="absolute -top-1 -right-1 bg-[#2f2520] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-semibold">
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <Link href="/book" className="rounded-full bg-[#2f2520] text-white px-5 py-2.5 text-[10px] font-semibold tracking-[0.18em] uppercase hover:bg-[#201815] transition">
              {t('nav.book')}
            </Link>
          </div>
        </div>

        <button className="md:hidden text-[#3d2f28]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 8h16M4 16h16" />
          </svg>
        </button>
      </motion.nav>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};
