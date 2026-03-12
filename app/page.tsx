"use client";
import React, { useEffect, useState } from 'react';
import { ShoppingCart, Plus, Layers, Zap, Shield, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

const formatPrice = (cents: number) => {
  return (cents / 100).toLocaleString('en-US', {
    style: 'currency', currency: 'USD',
  });
};

export default function Storefront() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true);
      
      if (error) {
        console.error('Error fetching products:', error);
      } else {
        setProducts(data || []);
      }
      setLoading(false);
    }
    fetchProducts();
  }, []);

  const handleCheckout = async (price_cents: number, title: string, id: string) => {
    setCheckoutLoading(id);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price_cents, title }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCheckoutLoading(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-[#000000] p-8 md:p-16 lg:p-24 font-sans selection:bg-black selection:text-white">
      <header className="flex justify-between items-baseline mb-32 border-b border-black pb-8">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none">Agency<br />HQ</h1>
        <div className="flex flex-col items-end">
          <span className="text-xs font-bold tracking-[0.3em] uppercase mb-2">Cart (0)</span>
          <ShoppingCart size={32} strokeWidth={2.5} />
        </div>
      </header>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin" size={48} />
        </div>
      ) : products.length === 0 ? (
        <div className="border-4 border-black p-24 text-center">
          <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">INVENTORY DEPLETED.</h2>
          <p className="text-xl font-bold tracking-widest uppercase text-neutral-500">AWAITING MOTHERBRAIN SYNC.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-black border border-black overflow-hidden">
          {products.map((product) => (
            <div key={product.id} className="bg-[#FAFAFA] p-8 group flex flex-col h-full hover:bg-white transition-colors">
              <div className="aspect-[4/5] bg-white/5 border border-black/5 mb-12 relative overflow-hidden flex items-center justify-center">
                 <Layers size={64} className="opacity-10" />
                 <span className="absolute bottom-4 left-4 text-neutral-400 font-mono text-[10px] uppercase tracking-widest">Image_Placeholder</span>
              </div>
              <div className="flex-grow">
                <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-neutral-500 block mb-2">{product.sku || 'COLLECTION'}</span>
                <h2 className="text-4xl font-bold tracking-tighter leading-tight mb-4 uppercase">{product.title}</h2>
                <p className="text-2xl font-mono mb-8">{formatPrice(product.price_cents)}</p>
              </div>
              <motion.button 
                whileHover={{ scale: 0.98 }} 
                whileTap={{ scale: 0.95 }} 
                onClick={() => handleCheckout(product.price_cents, product.title, product.id)}
                disabled={checkoutLoading !== null}
                className="w-full bg-black text-white py-6 text-sm font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-neutral-900 transition-all disabled:opacity-50"
              >
                {checkoutLoading === product.id ? 'PROCESSING...' : (
                  <>PURCHASE ARTIFACT <Plus size={20} /></>
                )}
              </motion.button>
            </div>
          ))}
        </div>
      )}

      <section className="mt-48 grid grid-cols-1 md:grid-cols-3 gap-16 border-t border-black pt-24">
        <div className="space-y-6"><Zap size={32} /><h3 className="text-2xl font-black uppercase tracking-tighter">Speed</h3><p className="text-neutral-600 leading-relaxed font-medium">Instant acquisition via secure neural handshake.</p></div>
        <div className="space-y-6"><Shield size={32} /><h3 className="text-2xl font-black uppercase tracking-tighter">Security</h3><p className="text-neutral-600 leading-relaxed font-medium">Quantum-encrypted transactions for the digital age.</p></div>
        <div className="space-y-6"><Layers size={32} /><h3 className="text-2xl font-black uppercase tracking-tighter">Curation</h3><p className="text-neutral-600 leading-relaxed font-medium">Every artifact selected for its brutalist integrity.</p></div>
      </section>

      <footer className="mt-64 border-t border-black pt-16 pb-12 flex flex-col md:flex-row justify-between items-start gap-16">
        <div className="max-w-md"><p className="text-2xl font-medium leading-relaxed tracking-tight">Curated objects for the digital vanguard. Designed with absolute precision and zero compromise.</p></div>
        <div className="grid grid-cols-2 gap-x-24 gap-y-4 text-xs font-bold uppercase tracking-widest">
          <a href="#" className="hover:line-through">Shipping</a><a href="#" className="hover:line-through">Archive</a><a href="#" className="hover:line-through">Terms</a><a href="#" className="hover:line-through">Privacy</a>
        </div>
      </footer>
    </main>
  );
}
