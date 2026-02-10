
import React, { useState, useMemo } from 'react';
import { COFFEE_OPTIONS, SIZES, SIZE_LABELS } from '../constants';
import { CoffeeType, CoffeeSize, Order, MilkLevel } from '../types';

interface GuestDashboardProps {
  orders: Order[];
  onPlaceOrder: (order: Omit<Order, 'id' | 'timestamp' | 'status'>) => Promise<string | null>;
  isServiceOnline: boolean;
}

const GuestDashboard: React.FC<GuestDashboardProps> = ({ orders, onPlaceOrder, isServiceOnline }) => {
  const [name, setName] = useState('');
  const [selectedCoffee, setSelectedCoffee] = useState<CoffeeType | null>(null);
  const [size, setSize] = useState<CoffeeSize>(CoffeeSize.MEDIUM);
  const [percentage, setPercentage] = useState(50);
  const [milkLevel, setMilkLevel] = useState<MilkLevel>('Standart');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [trackedOrderId, setTrackedOrderId] = useState<string | null>(null);

  // Takip edilen siparişi bul
  const trackedOrder = useMemo(() => {
    if (!trackedOrderId) return null;
    return orders.find(o => o.id === trackedOrderId) || null;
  }, [orders, trackedOrderId]);

  // Seçilen kahve detayını bul
  const selectedCoffeeDetails = useMemo(() => {
    return COFFEE_OPTIONS.find(c => c.id === selectedCoffee);
  }, [selectedCoffee]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !selectedCoffee || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const orderId = await onPlaceOrder({
        guestName: name,
        coffeeType: selectedCoffee,
        size,
        percentage,
        // Sadece sütlü kahveyse süt oranını gönder, değilse undefined
        milkLevel: selectedCoffeeDetails?.isMilky ? milkLevel : undefined
      });

      if (orderId) {
        setTrackedOrderId(orderId);
      }
      
      // Formu temizle ama isim kalsın
      setSelectedCoffee(null);
      setMilkLevel('Standart');
      setPercentage(50);
      
    } catch (error) {
      // Hata App.tsx'te handle ediliyor
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewOrder = () => {
    setTrackedOrderId(null);
    setSelectedCoffee(null);
  };

  // 1. SERVİS KAPALI EKRANI
  if (!isServiceOnline && !trackedOrder) {
      return (
        <div className="max-w-2xl mx-auto py-16 animate-fade-in text-center px-6">
             <div className="w-24 h-24 bg-stone-200 rounded-full flex items-center justify-center mx-auto text-stone-400 mb-8">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
            </div>
            <h2 className="text-4xl font-serif text-stone-800 mb-4">Servisimiz Kapalıdır</h2>
            <p className="text-stone-500 text-lg">Şu anda kahve servisi yapılmamaktadır. <br/>Daha sonra tekrar bekleriz.</p>
        </div>
      );
  }

  // 2. DURUM EKRANI
  if (trackedOrder) {
    const isCompleted = trackedOrder.status === 'COMPLETED';
    const isPreparing = trackedOrder.status === 'PREPARING';
    const isPending = trackedOrder.status === 'PENDING';

    return (
      <div className="max-w-2xl mx-auto py-10 animate-fade-in">
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-stone-100 overflow-hidden relative">
          
          <div className={`p-10 text-center transition-colors duration-500 ${
            isCompleted ? 'bg-stone-800 text-white' : 
            isPreparing ? 'bg-orange-50 text-stone-800' : 
            'bg-stone-50 text-stone-600'
          }`}>
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white shadow-lg mb-6 text-4xl">
              {isCompleted ? '☕' : isPreparing ? '🔥' : '⏳'}
            </div>
            <h2 className="text-3xl font-serif font-bold mb-2">
              {isCompleted ? 'Afiyet Olsun!' : 
               isPreparing ? 'Hazırlanıyor...' : 
               'Sıraya Alındı'}
            </h2>
            <p className="text-sm font-medium opacity-80 uppercase tracking-widest">
              {isCompleted ? 'Kahveniz servise hazır.' : 
               isPreparing ? 'Barista kahvenizi hazırlıyor.' : 
               'Siparişiniz baristaya iletildi.'}
            </p>
          </div>

          <div className="px-10 py-8">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-stone-300 mb-4">
              <span className={isPending || isPreparing || isCompleted ? 'text-stone-800' : ''}>Sırada</span>
              <span className={isPreparing || isCompleted ? 'text-stone-800' : ''}>Hazırlanıyor</span>
              <span className={isCompleted ? 'text-stone-800' : ''}>Hazır</span>
            </div>
            <div className="h-3 bg-stone-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-stone-800 transition-all duration-1000 ease-out"
                style={{ 
                  width: isCompleted ? '100%' : isPreparing ? '66%' : '33%' 
                }}
              />
            </div>
          </div>

          <div className="px-10 pb-10">
            <div className="bg-stone-50 rounded-2xl p-6 border border-stone-100 flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center text-2xl shadow-sm">
                ☕
              </div>
              <div className="flex-1">
                <div className="text-lg font-serif font-bold text-stone-800">{trackedOrder.coffeeType}</div>
                <div className="text-xs text-stone-500 font-medium">
                  {SIZE_LABELS[trackedOrder.size]} • %{trackedOrder.percentage} Sertlik
                  {trackedOrder.milkLevel && (
                    <span className="block mt-1 text-stone-400 font-bold uppercase text-[10px]">
                      {trackedOrder.milkLevel}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {isCompleted && isServiceOnline && (
              <button 
                onClick={handleNewOrder}
                className="w-full mt-8 py-5 bg-stone-800 text-white rounded-2xl font-bold uppercase tracking-widest hover:bg-stone-900 transition-all shadow-lg active:scale-[0.98]"
              >
                Yeni Sipariş Ver
              </button>
            )}

            {isCompleted && !isServiceOnline && (
                 <p className="mt-8 text-center text-red-500 font-bold text-sm">
                     Servis kapandığı için yeni sipariş verilemez.
                 </p>
            )}
            
            {!isCompleted && (
               <p className="text-center mt-8 text-xs text-stone-400 italic">
                 Ekran otomatik güncellenecektir...
               </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 3. SİPARİŞ FORMU
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
                onClick={() => !coffee.isComingSoon && setSelectedCoffee(coffee.id)}
                className={`group relative rounded-3xl overflow-hidden border-2 transition-all duration-300 ${
                  coffee.isComingSoon ? 'cursor-not-allowed opacity-90' : 'cursor-pointer'
                } ${
                  selectedCoffee === coffee.id ? 'border-stone-800 ring-8 ring-stone-50 scale-[1.02]' : 'border-stone-50 hover:border-stone-200'
                }`}
              >
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={coffee.image} 
                    alt={coffee.name} 
                    className={`w-full h-full object-cover transition-transform duration-700 ${coffee.isComingSoon ? 'grayscale-[0.5]' : 'group-hover:scale-110'}`} 
                  />
                  
                  {/* Yakında Gelecek Overlay */}
                  {coffee.isComingSoon && (
                    <div className="absolute inset-0 bg-stone-900/60 z-10 flex items-center justify-center backdrop-blur-[2px]">
                      <span className="bg-white/95 text-stone-900 px-4 py-2 font-black text-xs uppercase tracking-widest rounded-lg transform -rotate-6 shadow-xl border border-stone-200">
                        Yakında Gelecek
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-5 bg-white relative">
                  <h4 className={`font-bold text-lg ${coffee.isComingSoon ? 'text-stone-400' : 'text-stone-800'}`}>{coffee.name}</h4>
                  <p className="text-xs text-stone-400 mt-1 leading-relaxed">{coffee.description}</p>
                </div>
                {selectedCoffee === coffee.id && (
                  <div className="absolute top-4 right-4 bg-stone-800 text-white rounded-full p-2 shadow-lg z-20">
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
            
            <div className="space-y-8">
              {/* Sertlik Ayarı */}
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

              {/* Süt Oranı - Sadece Sütlü Kahveler İçin */}
              {selectedCoffeeDetails?.isMilky && (
                 <div className="animate-fade-in">
                    <label className="block text-[10px] font-black text-stone-400 mb-4 uppercase tracking-[0.2em] flex items-center gap-2">
                       Süt Oranı
                       <span className="px-1.5 py-0.5 bg-orange-100 text-orange-700 rounded text-[8px]">ÖZEL</span>
                    </label>
                    <div className="flex gap-3">
                      {(['Az Sütlü', 'Standart', 'Bol Sütlü'] as MilkLevel[]).map(level => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setMilkLevel(level)}
                          className={`flex-1 py-3 rounded-2xl font-bold text-xs transition-all ${
                            milkLevel === level ? 'bg-stone-800 text-white shadow-lg' : 'bg-stone-50 text-stone-400 hover:bg-stone-100'
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                 </div>
              )}
            </div>
          </div>
        </section>

        <button 
          type="submit"
          disabled={!name || !selectedCoffee || isSubmitting}
          className={`w-full py-6 rounded-3xl text-xl font-bold shadow-2xl transition-all flex items-center justify-center gap-3 ${
             isSubmitting
              ? 'bg-stone-700 cursor-wait'
              : 'bg-stone-800 hover:bg-stone-900 text-white active:scale-[0.98] disabled:opacity-30'
          }`}
        >
          {isSubmitting ? (
             <span className="animate-pulse">Sipariş Gönderiliyor...</span>
          ) : (
            'Barista\'ya Sipariş Ver'
          )}
        </button>
      </form>
    </div>
  );
};

export default GuestDashboard;
