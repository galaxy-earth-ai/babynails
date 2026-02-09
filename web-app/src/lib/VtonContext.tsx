"use client";

import React, { createContext, useContext, useState } from 'react';

interface VtonContextType {
  userHandImage: string | null;
  setUserHandImage: (image: string | null) => void;
  isVtonOpen: boolean;
  setIsVtonOpen: (isOpen: boolean) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
  isCompareMode: boolean;
  setIsCompareMode: (mode: boolean) => void;
  compareProduct: string | null;
  setCompareProduct: (slug: string | null) => void;
}

const VtonContext = createContext<VtonContextType | undefined>(undefined);

export const VtonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userHandImage, setUserHandImage] = useState<string | null>(null);
  const [isVtonOpen, setIsVtonOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [compareProduct, setCompareProduct] = useState<string | null>(null);

  return (
    <VtonContext.Provider
      value={{
        userHandImage,
        setUserHandImage,
        isVtonOpen,
        setIsVtonOpen,
        isProcessing,
        setIsProcessing,
        isCompareMode,
        setIsCompareMode,
        compareProduct,
        setCompareProduct,
      }}
    >
      {children}
    </VtonContext.Provider>
  );
};

export const useVton = () => {
  const context = useContext(VtonContext);
  if (context === undefined) {
    throw new Error('useVton must be used within a VtonProvider');
  }
  return context;
};
