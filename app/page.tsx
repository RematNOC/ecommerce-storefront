"use client";

import { motion } from 'framer-motion';
import { ShoppingBag, ArrowRight } from 'lucide-react';

const MOCK_PRODUCTS = [
  { id: '1', title: 'Cyberpunk Hoodie', price_cents: 8500, sku: 'CB-H-001', is_active: true },
  { id: '2', title: 'Onyx Ring', price_cents: 12000, sku: 'ONX-R-001', is_active: true },
  { id: '3', title: 'Neural Uplink V2', price_cents: 45000, sku: 'NU-V2-88', is_active: true },
  { id: '4', title: 'Carbon Fiber Case', price_cents: 4500, sku: 'CF-C-12', is_active: true },
];

export default function Storefront() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#000000] selection:bg-black selection:text-white font-sans">
      <header className="border-b-2 border-black p-8 flex justify-between items-center">
        <h1 className="text-3xl font-black tracking-tighter uppercase">MotherBrain <span className="text-black/30">Store</span></h1>
        <button className="flex items-center gap-2 font-bold tracking-widest uppercase text-sm hover:opacity-50 transition-opacity">
          <ShoppingBag size={18} /> Cart (0)
        </button>
      </header>

      <section className="p-8 md:p-16 border-b-2 border-black">
        <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase max-w-4xl leading-none">
          Brutalist <br/> Luxury.
        </h2>
        <p className="mt-6 text-xl font-medium tracking-tight max-w-xl text-black/70">
          High-end technical apparel and hardware. Powered by a headless Next.js commerce engine.
        </p>
      </section>

      <section className="p-8 md:p-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {MOCK_PRODUCTS.map((product, idx) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group cursor-pointer flex flex-col"
            >
              <div className="aspect-[4/5] bg-black/5 border-2 border-black mb-4 relative overflow-hidden flex items-center justify-center group-hover:bg-black/10 transition-colors">
                <span className="font-bold tracking-widest text-black/20 uppercase text-xs rotate-[-90deg]">Asset Missing</span>
              </div>
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-bold text-lg tracking-tight uppercase">{product.title}</h3>
                  <p className="text-xs font-mono text-black/50 mt-1">{product.sku}</p>
                </div>
                <span className="font-black text-lg">${(product.price_cents / 100).toFixed(2)}</span>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-black text-white py-4 font-bold uppercase tracking-widest text-xs flex justify-center items-center gap-2 hover:bg-black/80 transition-colors mt-auto"
              >
                Add to Cart <ArrowRight size={16} />
              </motion.button>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
