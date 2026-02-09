
import React, { useState } from 'react';
import { COFFEE_OPTIONS, SIZES, SIZE_LABELS } from '../constants';
import { CoffeeType, CoffeeSize, Order } from '../types';

interface GuestDashboardProps {
  onPlaceOrder: (order: Omit<Order, 'id' | 'timestamp' | 'status'>) => void;
}

const GuestDashboard: React.FC<GuestDashboardProps> = ({ onPlaceOrder }) => {
  const [name, setName] = useState('');
  const [selectedCoffee, setSelectedCoffee] = useState<CoffeeType | null>(null);
  const [size, setSize] = useState<CoffeeSize>(CoffeeSize.MEDIUM);
  const [percentage, setPercentage] = useState(50);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !selectedCoffee) return;
    
    onPlaceOrder({
      guestName: name,
      coffeeType: selectedCoffee,
      size,
      percentage
    });

    setOrderPlaced(true);
    setTimeout(() => setOrderPlaced(false), 3000);
    
    setTimeout(() => {
      setSelectedCoffee(null);
    }, 500);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-serif text-stone-800 mb-2">Kahve Siparişi</h2>
        <p className="text-stone-400 italic">Evinizdeki konforla, size özel hazırlanan lezzetler.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
          <h3 className="text-xl font-serif text-stone-800 mb-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-stone-100 text-stone-800 flex items-center justify-center text-sm font-bold">1</span>
            Kimin İçin?
          </h3>
          <input 
            type="text" 
            required
            placeholder="İsim soyisim giriniz"
            className="w-full px-6 py-4 text-lg rounded-2xl border border-stone-200 focus:ring-2 focus:ring-stone-800 focus:border-transparent outline-none transition-all"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </section>

        <section className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
          <h3 className="text-xl font-serif text-stone-800 mb-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-stone-100 text-stone-800 flex items-center justify-center text-sm font-bold">2</span>
            Kahvenizi Seçin
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {COFFEE_OPTIONS.map((coffee) => (
              <div 
                key={coffee.id}
                onClick={() => setSelectedCoffee(coffee.id)}
                className={`cursor-pointer group relative rounded-3xl overflow-hidden border-2 transition-all duration-300 ${
                  selectedCoffee === coffee.id ? 'border-stone-800 ring-8 ring-stone-50 scale-[1.02]' : 'border-stone-50 hover:border-stone-200'
                }`}
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={coffee.image} 
                    alt={coffee.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                </div>
                <div className="p-5 bg-white">
                  <h4 className="font-bold text-stone-800 text-lg">{coffee.name}</h4>
                  <p className="text-xs text-stone-400 mt-1 leading-relaxed">{coffee.description}</p>
                </div>
                {selectedCoffee === coffee.id && (
                  <div className="absolute top-4 right-4 bg-stone-800 text-white rounded-full p-2 shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
          <h3 className="text-xl font-serif text-stone-800 mb-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-stone-100 text-stone-800 flex items-center justify-center text-sm font-bold">3</span>
            Özelleştirin
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <label className="block text-[10px] font-black text-stone-400 mb-4 uppercase tracking-[0.2em]">Bardak Boyutu</label>
              <div className="flex gap-3">
                {SIZES.map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={`flex-1 py-4 rounded-2xl font-bold transition-all ${
                      size === s ? 'bg-stone-800 text-white shadow-xl translate-y-[-2px]' : 'bg-stone-50 text-stone-400 hover:bg-stone-100'
                    }`}
                  >
                    {SIZE_LABELS[s]}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-4">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Kahve Sertliği</label>
                <span className="text-xs font-black text-stone-800">%{percentage}</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                step="5"
                className="w-full h-2 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-stone-800"
                value={percentage}
                onChange={(e) => setPercentage(parseInt(e.target.value))}
              />
              <div className="flex justify-between mt-3 text-[9px] text-stone-300 font-black uppercase tracking-widest">
                <span>Hafif</span>
                <span>Dengeli</span>
                <span>Sert</span>
              </div>
            </div>
          </div>
        </section>

        <button 
          type="submit"
          disabled={!name || !selectedCoffee || orderPlaced}
          className={`w-full py-6 rounded-3xl text-xl font-bold shadow-2xl transition-all flex items-center justify-center gap-3 ${
            orderPlaced 
              ? 'bg-green-500 text-white cursor-default'
              : 'bg-stone-800 hover:bg-stone-900 text-white active:scale-[0.98] disabled:opacity-30'
          }`}
        >
          {orderPlaced ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Siparişiniz Alındı!
            </>
          ) : (
            'Barista\'ya Sipariş Ver'
          )}
        </button>
      </form>
    </div>
  );
};

export default GuestDashboard;
