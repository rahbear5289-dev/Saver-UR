import { Check, Star, Zap, Crown } from 'lucide-react';

export default function Decshop() {
  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-6 py-16 pb-24">
      <div className="text-center mb-14">
        <p className="text-xs font-bold text-violet-600 uppercase tracking-widest mb-3 flex items-center justify-center gap-2">
          <Crown className="w-4 h-4"/> Premium Plans
        </p>
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4">Simple, Transparent Pricing</h1>
        <p className="text-gray-500 text-lg">Upgrade for faster downloads, 4K quality, and batch processing.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto items-center">
        {/* Basic */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 flex flex-col">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Basic</p>
          <div className="text-5xl font-extrabold text-gray-900 mb-1">Free</div>
          <p className="text-gray-400 text-sm mb-8">Forever. No credit card.</p>
          <ul className="space-y-3 mb-8 flex-1 text-sm text-gray-600">
            {['Standard speed', 'Up to 1080p', 'Up to 5 downloads/day'].map(i => (
              <li key={i} className="flex items-center gap-2.5"><Check className="w-4 h-4 text-violet-600 shrink-0"/> {i}</li>
            ))}
          </ul>
          <button className="w-full py-3 rounded-xl font-semibold border border-gray-200 text-gray-600 hover:border-violet-300 hover:text-violet-700 transition">Current Plan</button>
        </div>

        {/* Pro */}
        <div className="relative rounded-3xl bg-violet-700 shadow-2xl shadow-violet-200 p-8 flex flex-col scale-105 z-10">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow">
            <Star className="w-3 h-3 fill-yellow-900"/> MOST POPULAR
          </div>
          <p className="text-xs font-bold text-violet-200 uppercase tracking-widest mb-2">Pro</p>
          <div className="text-5xl font-extrabold text-white mb-1">$4.99</div>
          <p className="text-violet-300 text-sm mb-8">Per month, cancel anytime.</p>
          <ul className="space-y-3 mb-8 flex-1 text-sm text-white/90">
            {['Max download speed', '4K & 8K quality', 'Unlimited downloads', 'Batch downloading', 'No ads ever'].map(i => (
              <li key={i} className="flex items-center gap-2.5"><Zap className="w-4 h-4 text-yellow-300 fill-yellow-300 shrink-0"/> {i}</li>
            ))}
          </ul>
          <button className="w-full py-3 rounded-xl font-bold bg-white text-violet-700 hover:bg-violet-50 transition shadow">Upgrade Now</button>
        </div>

        {/* Lifetime */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 flex flex-col">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Lifetime</p>
          <div className="text-5xl font-extrabold text-gray-900 mb-1">$39<span className="text-2xl">.99</span></div>
          <p className="text-gray-400 text-sm mb-8">Pay once, yours forever.</p>
          <ul className="space-y-3 mb-8 flex-1 text-sm text-gray-600">
            {['All Pro features', 'Future updates included', 'Priority 24/7 support', 'Commercial use license'].map(i => (
              <li key={i} className="flex items-center gap-2.5"><Check className="w-4 h-4 text-violet-600 shrink-0"/> {i}</li>
            ))}
          </ul>
          <button className="w-full py-3 rounded-xl font-semibold bg-violet-50 text-violet-700 border border-violet-200 hover:bg-violet-100 transition">Get Lifetime</button>
        </div>
      </div>
    </div>
  );
}
