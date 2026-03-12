"use client";
import React, { useEffect, useState } from 'react';
import { ShoppingCart, Search, Menu, ArrowRight, Loader2, X, Trash2, Eye, ShieldCheck, Globe, Lock, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';

const formatPrice = (cents: number) => {
  return (cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

export default function Storefront() {
  const [products, setProducts] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<any | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      const { data } = await supabase.from('products').select('*').eq('is_active', true);
      setProducts(data || []);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  const addToCart = (product: any) => {
    setCart(prev => [...prev, product]);
    setIsCartOpen(true);
    setQuickViewProduct(null); // Close quick view if open
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const handleCheckout = async (itemsToBuy: any[]) => {
    setCheckoutLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: itemsToBuy }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) { console.error(err); } finally { setCheckoutLoading(false); }
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price_cents, 0);

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white overflow-x-hidden">
      
      {/* 1. CART DRAWER (Existing) */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCartOpen(false)} className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl p-8 flex flex-col">
              <div className="flex justify-between items-center mb-12">
                <h2 className="text-sm font-bold tracking-[0.3em] uppercase">Your Collection ({cart.length})</h2>
                <X className="w-6 h-6 cursor-pointer hover:rotate-90 transition-transform" onClick={() => setIsCartOpen(false)} />
              </div>
              <div className="flex-grow overflow-y-auto space-y-8">
                {cart.length === 0 ? (
                  <p className="text-xs text-neutral-400 uppercase tracking-widest text-center mt-24">The collection is empty.</p>
                ) : cart.map((item, i) => (
                  <div key={i} className="flex justify-between items-center border-b border-neutral-100 pb-4">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-tight">{item.title}</h4>
                      <p className="text-xs text-neutral-500 font-mono">{formatPrice(item.price_cents)}</p>
                    </div>
                    <Trash2 className="w-4 h-4 text-neutral-300 hover:text-black cursor-pointer" onClick={() => removeFromCart(i)} />
                  </div>
                ))}
              </div>
              <div className="pt-8 border-t border-neutral-100">
                <div className="flex justify-between mb-8">
                  <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">Total</span>
                  <span className="text-xl font-light">{formatPrice(cartTotal)}</span>
                </div>
                <button onClick={() => handleCheckout(cart)} disabled={cart.length === 0 || checkoutLoading} className="w-full bg-black text-white py-6 text-[10px] tracking-[0.3em] uppercase hover:bg-neutral-800 transition-all font-bold disabled:opacity-50">
                  {checkoutLoading ? 'Encrypting...' : 'Secure Checkout'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 2. QUICK VIEW MODAL (New Elite Feature) */}
      <AnimatePresence>
        {quickViewProduct && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setQuickViewProduct(null)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }} className="relative w-full max-w-4xl bg-white shadow-2xl overflow-hidden flex flex-col md:flex-row h-[80vh] md:h-[600px]">
              <button onClick={() => setQuickViewProduct(null)} className="absolute top-4 right-4 z-10 bg-white p-2 rounded-full shadow-md hover:bg-neutral-100 transition-colors"><X size={16} /></button>
              
              <div className="w-full md:w-1/2 bg-neutral-100 h-1/2 md:h-full flex items-center justify-center relative">
                <span className="text-[10px] tracking-[0.4em] text-neutral-400 uppercase font-bold">Artifact_Image</span>
                {quickViewProduct.sku && <span className="absolute bottom-4 left-4 text-[8px] tracking-[0.3em] uppercase text-neutral-400 bg-white px-2 py-1 shadow-sm">{quickViewProduct.sku}</span>}
              </div>
              
              <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center h-1/2 md:h-full overflow-y-auto">
                <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 mb-4 block">Limited Issue</span>
                <h3 className="text-2xl md:text-4xl font-light uppercase tracking-tight mb-4">{quickViewProduct.title}</h3>
                <p className="text-xl font-light mb-8">{formatPrice(quickViewProduct.price_cents)}</p>
                <p className="text-xs text-neutral-500 leading-relaxed font-medium mb-10">
                  {quickViewProduct.description || "Forged with precision. This artifact represents the pinnacle of minimal design and absolute utility. Designed to outlast the user."}
                </p>
                
                <div className="mt-auto space-y-3">
                  <button onClick={() => handleCheckout([quickViewProduct])} className="w-full bg-black text-white py-4 text-[10px] tracking-[0.2em] uppercase hover:bg-neutral-800 transition-all font-bold">Buy Now</button>
                  <button onClick={() => addToCart(quickViewProduct)} className="w-full border border-black py-4 text-[10px] tracking-[0.2em] uppercase hover:bg-black hover:text-white transition-all font-bold">Add to Collection</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="bg-black text-white py-2 text-[10px] tracking-[0.3em] text-center uppercase">COMPLIMENTARY GLOBAL SHIPPING</div>

      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-neutral-100 px-6 py-4 md:px-12 flex justify-between items-center">
        <Menu className="w-5 h-5 cursor-pointer hover:opacity-60 transition-opacity" />
        <h1 className="text-xl font-light tracking-[0.4em] uppercase cursor-pointer">PRESTIGE</h1>
        <div className="flex items-center gap-6">
          <Search className="w-5 h-5 cursor-pointer hover:opacity-60 transition-opacity" />
          <div className="relative cursor-pointer hover:opacity-60 transition-opacity" onClick={() => setIsCartOpen(true)}>
            <ShoppingCart className="w-5 h-5" />
            {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-black text-white text-[8px] w-3 h-3 rounded-full flex items-center justify-center">{cart.length}</span>}
          </div>
        </div>
      </header>

      <section className="relative h-[70vh] bg-neutral-50 flex flex-col items-center justify-center text-center px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-4xl">
          <span className="text-[10px] tracking-[0.5em] uppercase text-neutral-400 mb-6 block">Archive 001</span>
          <h2 className="text-5xl md:text-7xl font-light tracking-tight mb-10 leading-none uppercase">Pure Artifacts</h2>
          <button className="border border-black px-10 py-4 text-[10px] tracking-[0.3em] uppercase hover:bg-black hover:text-white transition-all font-bold">Discover Collection</button>
        </motion.div>
      </section>

      {/* 3. TRUST BAR (New Elite Feature) */}
      <section className="border-b border-neutral-100 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 py-8 md:py-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-neutral-100">
          <div className="flex flex-col items-center justify-center pt-8 md:pt-0 space-y-3">
            <Globe className="w-5 h-5 text-neutral-400" />
            <h4 className="text-[10px] tracking-[0.2em] uppercase font-bold">Global Dispatch</h4>
            <p className="text-xs text-neutral-500 font-medium">Complimentary worldwide shipping.</p>
          </div>
          <div className="flex flex-col items-center justify-center pt-8 md:pt-0 space-y-3">
            <ShieldCheck className="w-5 h-5 text-neutral-400" />
            <h4 className="text-[10px] tracking-[0.2em] uppercase font-bold">Lifetime Warranty</h4>
            <p className="text-xs text-neutral-500 font-medium">Engineered to outlast the user.</p>
          </div>
          <div className="flex flex-col items-center justify-center pt-8 md:pt-0 space-y-3">
            <Lock className="w-5 h-5 text-neutral-400" />
            <h4 className="text-[10px] tracking-[0.2em] uppercase font-bold">Secure Vault</h4>
            <p className="text-xs text-neutral-500 font-medium">256-bit encrypted transactions.</p>
          </div>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-6 py-32">
        <div className="text-center mb-24">
          <h3 className="text-2xl font-light tracking-[0.3em] uppercase">The Collection</h3>
        </div>

        {loading ? (
          <div className="flex justify-center py-32"><Loader2 className="animate-spin w-8 h-8 text-neutral-300" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-24">
            {products.map((product) => (
              <div key={product.id} className="group flex flex-col">
                <div className="aspect-[4/5] bg-neutral-100 mb-8 relative overflow-hidden flex items-center justify-center cursor-pointer" onClick={() => setQuickViewProduct(product)}>
                  <span className="text-[8px] tracking-[0.4em] text-neutral-400 uppercase font-bold">Artifact_Image</span>
                  {/* Quick View Hover State */}
                  <div className="absolute inset-0 bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                    <div className="bg-black text-white px-6 py-3 flex items-center gap-2 text-[10px] tracking-widest uppercase font-bold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <Eye size={14} /> Quick View
                    </div>
                  </div>
                </div>
                <div className="flex-grow space-y-2 mb-8">
                  <div className="flex justify-between items-baseline">
                    <h4 className="text-xs font-bold uppercase tracking-[0.1em]">{product.title}</h4>
                    <span className="text-sm font-light">{formatPrice(product.price_cents)}</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <button onClick={() => handleCheckout([product])} className="w-full bg-black text-white py-4 text-[10px] tracking-[0.2em] uppercase hover:bg-neutral-800 transition-all font-bold">Buy Now</button>
                  <button onClick={() => addToCart(product)} className="w-full border border-black py-4 text-[10px] tracking-[0.2em] uppercase hover:bg-black hover:text-white transition-all font-bold">Add to Collection</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. NEWSLETTER CAPTURE (New Elite Feature) */}
      <section className="bg-neutral-50 py-32 border-t border-neutral-100">
        <div className="max-w-2xl mx-auto px-6 text-center space-y-8">
          <Mail className="w-8 h-8 mx-auto text-neutral-400" />
          <h3 className="text-2xl font-light tracking-[0.3em] uppercase">Join the Vanguard</h3>
          <p className="text-xs text-neutral-500 font-medium max-w-md mx-auto leading-relaxed">
            Subscribe to receive priority access to new artifacts, limited run production pieces, and archival releases.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <input type="email" placeholder="ENTER EMAIL ADDRESS" className="flex-grow bg-white border border-neutral-200 px-6 py-4 text-[10px] tracking-[0.2em] uppercase focus:outline-none focus:border-black transition-colors" />
            <button className="bg-black text-white px-8 py-4 text-[10px] tracking-[0.2em] uppercase hover:bg-neutral-800 transition-all font-bold whitespace-nowrap">Subscribe</button>
          </div>
        </div>
      </section>

      <footer className="bg-white border-t border-neutral-100 py-12 px-6 text-center flex flex-col items-center space-y-6">
        <h1 className="text-lg font-light tracking-[0.4em] uppercase text-neutral-300">PRESTIGE</h1>
        <p className="text-[8px] tracking-[0.3em] uppercase text-neutral-400">© 2026 PRESTIGE ARTIFACTS HQ. ALL RIGHTS RESERVED.</p>
      </footer>
    </div>
  );
}
