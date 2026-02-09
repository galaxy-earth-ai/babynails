"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Check, ChevronRight, Sparkles, Eye, Image as ImageIcon } from 'lucide-react';
import { useVton } from '@/lib/VtonContext';
import { Product } from '@/lib/products';
import { ProcessingAnimation } from './ProcessingAnimation';
import Image from 'next/image';

interface VtonModalProps {
  currentProduct: Product;
}

export const VtonModal: React.FC<VtonModalProps> = ({ currentProduct }) => {
  const { 
    isVtonOpen, setIsVtonOpen, 
    userHandImage, setUserHandImage, 
    isProcessing, setIsProcessing 
  } = useVton();
  
  const [showResult, setShowResult] = useState(false);
  const [viewMode, setViewMode] = useState<'original' | 'result'>('original');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [rawFile, setRawFile] = useState<File | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setRawFile(file);
      const url = URL.createObjectURL(file);
      setUserHandImage(url);
      setShowResult(false);
      setViewMode('original');
      setErrorMsg(null);
    }
  };

  const startTryOn = async () => {
    if (!rawFile) return;
    
    setIsProcessing(true);
    setErrorMsg(null);

    try {
      const formData = new FormData();
      formData.append('handImage', rawFile);
      formData.append('productSlug', currentProduct.slug);

      const response = await fetch('/api/vton', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setResultImage(data.resultUrl);
        setShowResult(true);
        setViewMode('result');
      } else {
        setErrorMsg(data.reason || 'Failed to process image');
      }
    } catch (err) {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      {isVtonOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-ivory/95 backdrop-blur-xl"
        >
          <button 
            onClick={() => setIsVtonOpen(false)}
            className="absolute top-8 right-8 p-3 bg-white/50 hover:bg-white rounded-full transition-colors z-[110]"
          >
            <X size={24} />
          </button>

          <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Area: The Studio (Focus on the Hand) */}
            <div className="relative aspect-square bg-white rounded-3xl overflow-hidden shadow-2xl border border-pink-100/50 group">
              {!userHandImage ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center space-y-6">
                  <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center text-pink-400">
                    <Upload size={32} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-playfair text-2xl">Upload Your Hand</h3>
                    <p className="text-gray-400 text-xs uppercase tracking-widest font-bold">Step 1: Provide the canvas</p>
                  </div>
                  <label className="px-8 py-4 bg-pink-500 text-white rounded-2xl font-bold cursor-pointer hover:bg-pink-600 transition-all shadow-lg shadow-pink-200">
                    Select Photo
                    <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
                  </label>
                </div>
              ) : (
                <div className="relative w-full h-full">
                  {/* Base Layer: Always the User's Hand */}
                  <Image 
                    src={userHandImage} 
                    alt="Original Hand" 
                    fill 
                    className="object-cover"
                  />
                  
                  {/* Result Layer: Fades in over the original */}
                  <AnimatePresence>
                    {showResult && viewMode === 'result' && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 z-10"
                      >
                        <Image 
                          src={resultImage || userHandImage} 
                          alt="AI Stitched Result" 
                          fill 
                          className="object-cover"
                        />
                        <div className="absolute top-6 left-6 px-4 py-2 bg-pink-600/90 backdrop-blur-md text-white text-[10px] font-bold rounded-full shadow-2xl flex items-center gap-2 tracking-[0.2em]">
                          <Sparkles size={12} />
                          AI WEAR ACTIVE
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {isProcessing && <ProcessingAnimation />}

                  {errorMsg && (
                    <div className="absolute inset-0 z-30 flex items-center justify-center p-8 bg-red-50/90 backdrop-blur-md">
                      <div className="text-center space-y-4">
                        <p className="text-red-600 font-bold uppercase tracking-widest text-xs">Validation Failed</p>
                        <p className="text-gray-900 font-playfair text-xl">{errorMsg}</p>
                        <button 
                          onClick={() => { setUserHandImage(null); setErrorMsg(null); }}
                          className="px-6 py-2 bg-gray-900 text-white rounded-full text-[10px] font-bold uppercase tracking-widest"
                        >
                          Try Another Photo
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Quick Toggle Overlay (When Result is available) */}
                  {showResult && !isProcessing && (
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex bg-white/80 backdrop-blur-md p-1 rounded-full shadow-xl border border-white">
                      <button 
                        onClick={() => setViewMode('original')}
                        className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${viewMode === 'original' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-900'}`}
                      >
                        Original
                      </button>
                      <button 
                        onClick={() => setViewMode('result')}
                        className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${viewMode === 'result' ? 'bg-pink-500 text-white' : 'text-gray-500 hover:text-pink-500'}`}
                      >
                        Try-On
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Area: Product & Logic */}
            <div className="space-y-8">
              <div className="flex items-center gap-6 p-6 bg-white/40 rounded-3xl border border-white/60">
                <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-pink-100 shadow-sm">
                  <Image src={currentProduct.image || '/placeholder-nail.jpg'} alt={currentProduct.name} fill className="object-cover" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-pink-400 font-bold mb-1">Now Styling</p>
                  <h2 className="font-playfair text-4xl text-gray-900">{currentProduct.name}</h2>
                  <p className="text-gray-500 text-sm mt-1">Artisan Press-on Collection</p>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl border border-white space-y-6 shadow-sm">
                <div className="space-y-4">
                  <h4 className="font-bold text-xs tracking-widest uppercase flex items-center gap-2 text-gray-400">
                    <Sparkles size={14} className="text-pink-400" />
                    Neural Texture Mapping
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Our system uses <strong>Real-Time AI Stitching</strong> to overlay the <strong>{currentProduct.name}</strong> designs directly onto your uploaded photo. We preserve your hand's unique geometry, lighting, and skin texture for 100% accuracy.
                  </p>
                </div>

                {!showResult ? (
                  <button
                    disabled={!userHandImage || isProcessing}
                    onClick={startTryOn}
                    className="w-full py-5 bg-gray-900 text-white rounded-2xl font-bold text-lg disabled:opacity-30 flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl shadow-gray-200 active:scale-95"
                  >
                    {isProcessing ? 'AI Stitching...' : 'Generate My Try-On'}
                    {!isProcessing && <ChevronRight size={20} />}
                  </button>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-green-500 mb-4 bg-green-50 p-3 rounded-xl justify-center">
                      <Check size={18} />
                      <span className="text-xs font-bold uppercase tracking-widest">Stitching Complete</span>
                    </div>
                    <button
                      className="w-full py-5 bg-pink-500 text-white rounded-2xl font-bold text-lg hover:bg-pink-600 transition-all flex items-center justify-center gap-2 shadow-xl shadow-pink-100 active:scale-95"
                    >
                      Add to Bag
                    </button>
                    {userHandImage && (
                      <button 
                        onClick={() => { setUserHandImage(null); setShowResult(false); }}
                        className="w-full text-[10px] text-gray-400 hover:text-pink-500 transition-colors uppercase tracking-[0.2em] font-bold pt-2"
                      >
                        Change Hand Photo
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/30 rounded-2xl border border-white/50">
                  <p className="text-[9px] uppercase font-bold text-gray-400 mb-1">Perspective</p>
                  <p className="text-xs font-medium">Automatic Alignment</p>
                </div>
                <div className="p-4 bg-white/30 rounded-2xl border border-white/50">
                  <p className="text-[9px] uppercase font-bold text-gray-400 mb-1">Lighting</p>
                  <p className="text-xs font-medium">Luminance Matched</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
