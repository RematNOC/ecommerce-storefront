"use client";
import React, { useEffect, useState } from 'react';
import { ShoppingCart, Search, Menu, ArrowRight, Loader2, X, Trash2 } from 'lucide-react';
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
      {/* Cart Drawer */}
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

      <div className="bg-black text-white py-2 text-[10px] tracking-[0.3em] text-center uppercase">COMPLIMENTARY GLOBAL SHIPPING</div>

      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-100 px-6 py-4 md:px-12 flex justify-between items-center">
        <Menu className="w-5 h-5 cursor-pointer" />
        <h1 className="text-xl font-light tracking-[0.4em] uppercase">PRESTIGE</h1>
        <div className="flex items-center gap-6">
          <Search className="w-5 h-5 cursor-pointer" />
          <div className="relative cursor-pointer" onClick={() => setIsCartOpen(true)}>
            <ShoppingCart className="w-5 h-5" />
            {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-black text-white text-[8px] w-3 h-3 rounded-full flex items-center justify-center">{cart.length}</span>}
          </div>
        </div>
      </header>

      <section className="relative h-[60vh] bg-neutral-50 flex flex-col items-center justify-center text-center px-6">
        <span className="text-[10px] tracking-[0.5em] uppercase text-neutral-400 mb-6">Archive 001</span>
        <h2 className="text-5xl md:text-7xl font-light tracking-tight mb-10 leading-none uppercase">Pure Artifacts</h2>
        <button className="border border-black px-10 py-4 text-[10px] tracking-[0.3em] uppercase hover:bg-black hover:text-white transition-all font-bold">Discover Collection</button>
      </section>

      <div className="max-w-[1400px] mx-auto px-6 py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-24">
          {products.map((product) => (
            <div key={product.id} className="group flex flex-col">
              <div className="aspect-[4/5] bg-neutral-100 mb-8 relative overflow-hidden flex items-center justify-center">
                <span className="text-[8px] tracking-[0.4em] text-neutral-400 uppercase font-bold">Artifact_Image</span>
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
      </div>
    </div>
  );
}
