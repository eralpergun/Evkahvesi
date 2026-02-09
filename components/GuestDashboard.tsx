
import React, { useState } from 'react';
import { COFFEE_OPTIONS, SIZES } from '../constants';
import { CoffeeType, CoffeeSize, Order } from '../types';
import { getBaristaSuggestion } from '../services/geminiService';

interface GuestDashboardProps {
  onPlaceOrder: (order: Omit<Order, 'id' | 'timestamp' | 'status'>) => void;
}

const GuestDashboard: React.FC<GuestDashboardProps> = ({ onPlaceOrder }) => {
  const [name, setName] = useState('');
  const [selectedCoffee, setSelectedCoffee] = useState<CoffeeType | null>(null);
  const [size, setSize] = useState<CoffeeSize>(CoffeeSize.MEDIUM);
  const [percentage, setPercentage] = useState(50);
  const [mood, setMood] = useState('');
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleSuggest = async () => {
    if (!mood) return;
    setIsLoadingSuggestion(true);
    const text = await getBaristaSuggestion(mood);
    setSuggestion(text);
    setIsLoadingSuggestion(false);
  };

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
    
    // Reset selection after a short delay
    setTimeout(() => {
      setSelectedCoffee(null);
      setMood('');
      setSuggestion(null);
    }, 500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Sidebar: AI Barista */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100">
          <h3 className="text-xl font-serif text-stone-800 mb-4">AI Barista Advice</h3>
          <p className="text-sm text-stone-500 mb-4 italic">Tell me how you're feeling, and I'll recommend the perfect brew.</p>
          <div className="space-y-4">
            <input 
              type="text" 
              placeholder="e.g., Tired, Excited, Sleepy..."
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
            />
            <button 
              onClick={handleSuggest}
              disabled={isLoadingSuggestion || !mood}
              className="w-full py-3 bg-stone-800 text-white rounded-xl font-semibold hover:bg-stone-700 disabled:opacity-50 transition-all flex justify-center items-center gap-2"
            >
              {isLoadingSuggestion ? 'Brewing Ideas...' : 'Get Suggestion'}
            </button>
            {suggestion && (
              <div className="p-4 bg-orange-50 rounded-xl border border-orange-100 animate-fade-in">
                <p className="text-sm text-orange-900 leading-relaxed">{suggestion}</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-orange-600 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <h4 className="text-2xl font-serif mb-2">Today's Special</h4>
            <p className="text-orange-100 text-sm mb-4">Every order is free today. Enjoy your handcrafted beverage on the house!</p>
            <div className="text-4xl font-bold">$0.00</div>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500 rounded-full -mr-16 -mt-16 opacity-50 blur-2xl"></div>
        </div>
      </div>

      {/* Main Order Form */}
      <div className="lg:col-span-2">
        <form onSubmit={handleSubmit} className="space-y-8">
          <section className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100">
            <h3 className="text-xl font-serif text-stone-800 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold">1</span>
              Who is this for?
            </h3>
            <input 
              type="text" 
              required
              placeholder="Enter your name"
              className="w-full px-6 py-4 text-lg rounded-2xl border border-stone-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </section>

          <section className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100">
            <h3 className="text-xl font-serif text-stone-800 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold">2</span>
              Choose your blend
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {COFFEE_OPTIONS.map((coffee) => (
                <div 
                  key={coffee.id}
                  onClick={() => setSelectedCoffee(coffee.id)}
                  className={`cursor-pointer group relative rounded-2xl overflow-hidden border-2 transition-all ${
                    selectedCoffee === coffee.id ? 'border-orange-600 ring-4 ring-orange-50' : 'border-stone-100 hover:border-orange-200'
                  }`}
                >
                  <img src={coffee.image} alt={coffee.name} className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="p-4 bg-white">
                    <h4 className="font-bold text-stone-800">{coffee.name}</h4>
                    <p className="text-xs text-stone-500 line-clamp-1">{coffee.description}</p>
                  </div>
                  {selectedCoffee === coffee.id && (
                    <div className="absolute top-3 right-3 bg-orange-600 text-white rounded-full p-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100">
            <h3 className="text-xl font-serif text-stone-800 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold">3</span>
              Customizations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-semibold text-stone-600 mb-3 uppercase tracking-wider">Cup Size</label>
                <div className="flex gap-2">
                  {SIZES.map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSize(s)}
                      className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                        size === s ? 'bg-orange-600 text-white shadow-lg' : 'bg-stone-50 text-stone-500 hover:bg-stone-100'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-3">
                  <label className="text-sm font-semibold text-stone-600 uppercase tracking-wider">Coffee Strength</label>
                  <span className="text-sm font-bold text-orange-600">{percentage}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  step="5"
                  className="w-full h-2 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-orange-600"
                  value={percentage}
                  onChange={(e) => setPercentage(parseInt(e.target.value))}
                />
                <div className="flex justify-between mt-2 text-[10px] text-stone-400 font-bold uppercase">
                  <span>Decaf</span>
                  <span>Balanced</span>
                  <span>Extra Kick</span>
                </div>
              </div>
            </div>
          </section>

          <button 
            type="submit"
            disabled={!name || !selectedCoffee || orderPlaced}
            className={`w-full py-5 rounded-3xl text-xl font-bold shadow-2xl transition-all flex items-center justify-center gap-3 ${
              orderPlaced 
                ? 'bg-green-500 text-white cursor-default'
                : 'bg-orange-600 hover:bg-orange-700 text-white active:scale-95 disabled:opacity-50'
            }`}
          >
            {orderPlaced ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Order Received!
              </>
            ) : (
              'Send Order to Barista'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default GuestDashboard;
