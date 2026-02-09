import React from 'react';

export const BabyNailsLogo = ({ className }: { className?: string }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative w-8 h-8 flex items-center justify-center">
        <div className="absolute inset-0 border border-current rounded-full opacity-20" />
        <div className="w-1 h-1 bg-rose-gold rounded-full" />
      </div>
      <span className="font-serif text-lg font-light tracking-[0.3em] uppercase italic">
        Baby<span className="not-italic font-bold text-rose-gold ml-1">Nails</span>
      </span>
    </div>
  );
};
