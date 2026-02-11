
import React, { useState, useMemo, useEffect } from 'react';
import { COFFEE_OPTIONS, SIZES, SIZE_LABELS } from '../constants';
import { CoffeeType, CoffeeSize, Order, MilkLevel } from '../types';

interface GuestDashboardProps {
  orders: Order[];
  onPlaceOrder: (order: Omit<Order, 'id' | 'timestamp' | 'status'>) => Promise<string | null>;
  isServiceOnline: boolean;
}

type ViewMode = 'FORM' | 'STATUS';

const GuestDashboard: React.FC<GuestDashboardProps> = ({ orders, onPlaceOrder, isServiceOnline }) => {
  // LocalStorage'dan sipariş geçmişini al veya boş başlat
  const [myOrderIds, setMyOrderIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('evCoffee_myOrders');
    return saved ? JSON.parse(saved) : [];
  });

  // Aktif görünüm modu
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const saved = localStorage.getItem('evCoffee_myOrders');
    const ids = saved ? JSON.parse(saved) : [];
    return ids.length > 0 ? 'STATUS' : 'FORM';
  });

  // Wizard Step State (1: İsim, 2: Kahve, 3: Ayarlar)
  const [step, setStep] = useState(1);

  const [name, setName] = useState(() => localStorage.getItem('evCoffee_guestName') || '');
  const [selectedCoffee, setSelectedCoffee] = useState<CoffeeType | null>(null);
  const [size, setSize] = useState<CoffeeSize>(CoffeeSize.MEDIUM);
  const [percentage, setPercentage] = useState(50);
  const [milkLevel, setMilkLevel] = useState<MilkLevel>('Standart');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // myOrderIds değiştiğinde LocalStorage'ı güncelle
  useEffect(() => {
    localStorage.setItem('evCoffee_myOrders', JSON.stringify(myOrderIds));
  }, [myOrderIds]);

  // İsim değiştiğinde kaydet
  useEffect(() => {
    localStorage.setItem('evCoffee_guestName', name);
  }, [name]);

  const myActiveOrders = useMemo(() => {
    return orders
      .filter(o => myOrderIds.includes(o.id))
      .sort((a, b) => b.timestamp - a.timestamp);
  }, [orders, myOrderIds]);

  const selectedCoffeeDetails = useMemo(() => {
    return COFFEE_OPTIONS.find(c => c.id === selectedCoffee);
  }, [selectedCoffee]);

  // Yeni sipariş ekleme moduna geçiş
  const handleStartNewOrder = () => {
      setViewMode('FORM');
      setStep(1); // Başa dön
      setSelectedCoffee(null);
      setMilkLevel('Standart');
      setPercentage(50);
      // İsmi koruyoruz (kullanıcı deneyimi için)
  };

  const handleNextStep = () => {
    if (step === 1 && name.trim().length > 0) {
      setStep(2);
    } else if (step === 2 && selectedCoffee) {
      setStep(3);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Fallback: Eğer form submit tetiklenirse (örneğin mobilde Enter tuşuyla)
    // ve henüz son adımda değilsek, bir sonraki adıma geçmeyi dene.
    if (step === 1) {
        if (name.trim().length > 0) handleNextStep();
        return;
    }
    if (step === 2) {
        if (selectedCoffee) handleNextStep();
        return;
    }

    if (!name || !selectedCoffee || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const orderId = await onPlaceOrder({
        guestName: name,
        coffeeType: selectedCoffee,
        size,
        percentage,
        milkLevel: selectedCoffeeDetails?.isMilky ? milkLevel : undefined
      });

      if (orderId) {
        setMyOrderIds(prev => [orderId, ...prev]);
        setViewMode('STATUS');
        // Reset form for next time, keep name
        setStep(1);
        setSelectedCoffee(null);
        setMilkLevel('Standart');
        setPercentage(50);
      }
      
    } catch (error) {
      // Hata App.tsx'te handle ediliyor
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- RENDER: STATUS VIEW (Sipariş Listesi) ---
  if (viewMode === 'STATUS' && (myActiveOrders.length > 0 || !isServiceOnline)) {
    return (
      <div className="max-w-3xl mx-auto py-2 md:py-6 animate-fade-in pb-24">
        {/* Başlık Alanı */}
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-serif text-stone-800">Siparişleriniz</h2>
          <p className="text-stone-400 italic text-sm mt-1">Afiyet olsun, {name || 'Misafir'}!</p>
        </div>

        {/* Sipariş Listesi */}
        <div className="space-y-4 md:space-y-6">
            {myActiveOrders.map((order) => {
                const isCompleted = order.status === 'COMPLETED';
                const isPreparing = order.status === 'PREPARING';
                const isPending = order.status === 'PENDING';

                return (
                    <div key={order.id} className="bg-white rounded-[1.5rem] md:rounded-[2rem] shadow-lg border border-stone-100 overflow-hidden relative transition-all hover:shadow-xl">
                        {/* Durum Göstergesi */}
                        <div className={`px-4 md:px-6 py-3 flex items-center justify-between ${
                            isCompleted ? 'bg-stone-800 text-white' : 
                            isPreparing ? 'bg-orange-50 text-orange-800 border-b border-orange-100' : 
                            'bg-stone-50 text-stone-500 border-b border-stone-100'
                        }`}>
                            <div className="flex items-center gap-2 text-[10px] md:text-xs font-black uppercase tracking-widest">
                                {isCompleted ? (
                                    <><span className="text-lg md:text-xl">☕</span> Hazır</>
                                ) : isPreparing ? (
                                    <><span className="text-lg md:text-xl animate-pulse">🔥</span> Hazırlanıyor</>
                                ) : (
                                    <><span className="text-lg md:text-xl">⏳</span> Sırada</>
                                )}
                            </div>
                            <div className="text-[10px] font-mono opacity-60">
                                {new Date(order.timestamp).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>

                        {/* İçerik */}
                        <div className="p-4 md:p-6">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h3 className="text-lg md:text-xl font-serif font-bold text-stone-800">{order.coffeeType}</h3>
                                    <p className="text-[10px] md:text-xs text-stone-400 font-bold uppercase tracking-wide mt-1">
                                        {SIZE_LABELS[order.size]} 
                                        {order.milkLevel && <span className="mx-1">• {order.milkLevel}</span>}
                                        <span className="mx-1">• %{order.percentage} Sertlik</span>
                                    </p>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mt-4 md:mt-6">
                                <div className="flex justify-between text-[8px] font-black uppercase tracking-[0.2em] text-stone-300 mb-2">
                                    <span className={isPending || isPreparing || isCompleted ? 'text-stone-800' : ''}>Sırada</span>
                                    <span className={isPreparing || isCompleted ? 'text-stone-800' : ''}>Hazırlanıyor</span>
                                    <span className={isCompleted ? 'text-stone-800' : ''}>Teslim</span>
                                </div>
                                <div className="h-1.5 md:h-2 bg-stone-100 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-stone-800 transition-all duration-1000 ease-out"
                                        style={{ width: isCompleted ? '100%' : isPreparing ? '60%' : '20%' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>

        {/* Servis Kapalı ve Sipariş Yoksa */}
        {!isServiceOnline && myActiveOrders.length === 0 && (
            <div className="text-center py-12">
                 <h2 className="text-2xl font-serif text-stone-800 mb-2">Servis Kapalı</h2>
                 <p className="text-stone-500">Şu anda yeni sipariş alınmamaktadır.</p>
            </div>
        )}

        {/* Yeni Sipariş Butonu */}
        {isServiceOnline && (
            <div className="mt-6 md:mt-8 sticky bottom-4 md:bottom-6 z-10 px-2 md:px-0">
                <button 
                    onClick={handleStartNewOrder}
                    className="w-full py-3 md:py-4 bg-stone-800 text-white rounded-xl md:rounded-2xl font-bold uppercase tracking-widest hover:bg-stone-900 transition-all shadow-xl active:scale-[0.98] flex items-center justify-center gap-3 border border-stone-700 text-sm md:text-base"
                >
                    <span className="text-xl md:text-2xl leading-none font-light">+</span>
                    <span>Başka Bir Kahve Ekle</span>
                </button>
            </div>
        )}
      </div>
    );
  }

  // --- RENDER: FORM VIEW (Sipariş Ekranı) ---

  if (!isServiceOnline && viewMode === 'FORM') {
    return (
        <div className="max-w-2xl mx-auto py-12 md:py-16 animate-fade-in text-center px-6">
             {/* Servis Kapalı UI */}
             <div className="w-20 h-20 md:w-24 md:h-24 bg-stone-200 rounded-full flex items-center justify-center mx-auto text-stone-400 mb-6 md:mb-8">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-10 md:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif text-stone-800 mb-4">Servisimiz Kapalıdır</h2>
            <p className="text-stone-500 text-base md:text-lg">Şu anda kahve servisi yapılmamaktadır. <br/>Daha sonra tekrar bekleriz.</p>
            {myActiveOrders.length > 0 && (
                <button 
                    onClick={() => setViewMode('STATUS')}
                    className="mt-8 text-stone-800 font-bold underline decoration-2 underline-offset-4"
                >
                    Mevcut Siparişlerimi Göster
                </button>
            )}
        </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-20">
      
      {/* Üst Navigation */}
      <div className="flex justify-between items-center mb-6">
          {myActiveOrders.length > 0 ? (
              <button 
                type="button"
                onClick={() => setViewMode('STATUS')}
                className="flex items-center gap-2 text-stone-500 hover:text-stone-800 transition-colors text-[10px] md:text-xs font-bold uppercase tracking-widest"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-4 md:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Siparişler
              </button>
          ) : (
             <div /> // Spacer
          )}
          
          {/* Adım Göstergesi */}
          <div className="flex items-center gap-2">
             <span className={`w-2 h-2 rounded-full transition-colors duration-300 ${step >= 1 ? 'bg-stone-800' : 'bg-stone-200'}`}></span>
             <span className={`w-2 h-2 rounded-full transition-colors duration-300 ${step >= 2 ? 'bg-stone-800' : 'bg-stone-200'}`}></span>
             <span className={`w-2 h-2 rounded-full transition-colors duration-300 ${step >= 3 ? 'bg-stone-800' : 'bg-stone-200'}`}></span>
          </div>
      </div>

      <div className="mb-6 md:mb-10 text-center animate-fade-in">
        <h2 className="text-2xl md:text-3xl font-serif text-stone-800 mb-2">
            {step === 1 && "Hoş Geldiniz"}
            {step === 2 && "Kahvenizi Seçin"}
            {step === 3 && "Damak Tadınız"}
        </h2>
        <p className="text-stone-400 italic text-sm md:text-base">
            {step === 1 && "Size hitap edebilmemiz için isminizi rica edebilir miyiz?"}
            {step === 2 && "Bugün canınız hangisini çekiyor?"}
            {step === 3 && "Her detayıyla tam istediğiniz gibi."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-8 min-h-[300px]">
        
        {/* ADIM 1: İSİM */}
        {step === 1 && (
            <div className="animate-fade-in flex flex-col items-center justify-center py-4 md:py-8">
                 <div className="w-full max-w-md space-y-6">
                    <label className="block text-center text-xs font-black text-stone-400 uppercase tracking-widest">Misafir İsmi</label>
                    <input 
                        type="text" 
                        required
                        placeholder="İsminizi buraya yazın..."
                        className="w-full px-6 py-5 text-2xl md:text-3xl text-center rounded-2xl bg-stone-50 border-2 border-transparent focus:border-stone-800 focus:bg-white text-stone-800 placeholder:text-stone-300 outline-none transition-all font-serif"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && name.trim().length > 0) {
                                e.preventDefault();
                                handleNextStep();
                            }
                        }}
                    />
                    <button 
                        type="button"
                        disabled={name.trim().length === 0}
                        onClick={handleNextStep}
                        className="w-full py-4 md:py-5 bg-stone-800 text-white rounded-2xl font-bold uppercase tracking-widest hover:bg-stone-900 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-xl mt-4 md:mt-8"
                    >
                        Devam Et
                    </button>
                 </div>
            </div>
        )}

        {/* ADIM 2: KAHVE SEÇİMİ */}
        {step === 2 && (
            <div className="animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
                    {COFFEE_OPTIONS.map((coffee) => (
                    <div 
                        key={coffee.id}
                        onClick={() => !coffee.isComingSoon && setSelectedCoffee(coffee.id)}
                        className={`group relative rounded-2xl md:rounded-3xl overflow-hidden border-2 transition-all duration-300 ${
                        coffee.isComingSoon ? 'cursor-not-allowed opacity-90' : 'cursor-pointer'
                        } ${
                        selectedCoffee === coffee.id ? 'border-stone-800 ring-4 md:ring-8 ring-stone-50 scale-[1.02]' : 'border-stone-50 hover:border-stone-200'
                        }`}
                    >
                        <div className="h-40 md:h-48 overflow-hidden relative">
                        <img 
                            src={coffee.image} 
                            alt={coffee.name} 
                            className={`w-full h-full object-cover transition-transform duration-700 ${coffee.isComingSoon ? 'grayscale-[0.5]' : 'group-hover:scale-110'}`} 
                        />
                        {coffee.isComingSoon && (
                            <div className="absolute inset-0 bg-stone-900/60 z-10 flex items-center justify-center backdrop-blur-[2px]">
                            <span className="bg-white/95 text-stone-900 px-3 py-1.5 md:px-4 md:py-2 font-black text-[10px] md:text-xs uppercase tracking-widest rounded-lg transform -rotate-6 shadow-xl border border-stone-200">
                                Yakında
                            </span>
                            </div>
                        )}
                        </div>
                        <div className="p-4 md:p-5 bg-white relative">
                            <div className="flex justify-between items-start">
                                <h4 className={`font-bold text-base md:text-lg ${coffee.isComingSoon ? 'text-stone-400' : 'text-stone-800'}`}>{coffee.name}</h4>
                                {selectedCoffee === coffee.id && (
                                    <div className="bg-stone-800 text-white rounded-full p-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            <p className="text-[10px] md:text-xs text-stone-400 mt-1 leading-relaxed">{coffee.description}</p>
                        </div>
                    </div>
                    ))}
                </div>
                
                <div className="flex gap-4 sticky bottom-4 z-10 bg-[#fcfaf7]/90 p-2 backdrop-blur-sm rounded-2xl">
                    <button 
                        type="button"
                        onClick={handlePrevStep}
                        className="flex-1 py-4 bg-white border border-stone-200 text-stone-500 rounded-2xl font-bold uppercase tracking-widest hover:bg-stone-50 transition-all"
                    >
                        Geri
                    </button>
                    <button 
                        type="button"
                        disabled={!selectedCoffee}
                        onClick={handleNextStep}
                        className="flex-[2] py-4 bg-stone-800 text-white rounded-2xl font-bold uppercase tracking-widest hover:bg-stone-900 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-xl"
                    >
                        Devam Et
                    </button>
                </div>
            </div>
        )}

        {/* ADIM 3: AYARLAR VE ONAY */}
        {step === 3 && (
            <div className="animate-fade-in">
                <section className="bg-white p-5 md:p-8 rounded-[1.5rem] md:rounded-3xl shadow-sm border border-stone-100 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                        <div>
                            <label className="block text-[10px] font-black text-stone-400 mb-3 md:mb-4 uppercase tracking-[0.2em]">Bardak Boyutu</label>
                            <div className="flex gap-2 md:gap-3">
                                {SIZES.map(s => (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => setSize(s)}
                                    className={`flex-1 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold text-xs md:text-sm transition-all ${
                                    size === s ? 'bg-stone-800 text-white shadow-xl translate-y-[-2px]' : 'bg-stone-50 text-stone-400 hover:bg-stone-100'
                                    }`}
                                >
                                    {SIZE_LABELS[s]}
                                </button>
                                ))}
                            </div>
                        </div>
                        
                        <div className="space-y-6 md:space-y-8">
                            {/* Sertlik Ayarı */}
                            <div>
                                <div className="flex justify-between mb-3 md:mb-4">
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
                                <div className="flex justify-between mt-2 md:mt-3 text-[9px] text-stone-300 font-black uppercase tracking-widest">
                                <span>Hafif</span>
                                <span>Dengeli</span>
                                <span>Sert</span>
                                </div>
                            </div>

                            {/* Süt Oranı - Sadece Sütlü Kahveler İçin */}
                            {selectedCoffeeDetails?.isMilky && (
                                <div className="animate-fade-in">
                                    <label className="block text-[10px] font-black text-stone-400 mb-3 md:mb-4 uppercase tracking-[0.2em] flex items-center gap-2">
                                    Süt Oranı
                                    <span className="px-1.5 py-0.5 bg-orange-100 text-orange-700 rounded text-[8px]">ÖZEL</span>
                                    </label>
                                    <div className="flex gap-2 md:gap-3">
                                    {(['Az Sütlü', 'Standart', 'Bol Sütlü'] as MilkLevel[]).map(level => (
                                        <button
                                        key={level}
                                        type="button"
                                        onClick={() => setMilkLevel(level)}
                                        className={`flex-1 py-2.5 md:py-3 rounded-xl md:rounded-2xl font-bold text-[10px] md:text-xs transition-all ${
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

                <div className="flex gap-4 sticky bottom-4 z-10 bg-[#fcfaf7]/90 p-2 backdrop-blur-sm rounded-2xl">
                    <button 
                        type="button"
                        onClick={handlePrevStep}
                        disabled={isSubmitting}
                        className="flex-1 py-4 bg-white border border-stone-200 text-stone-500 rounded-2xl font-bold uppercase tracking-widest hover:bg-stone-50 transition-all"
                    >
                        Geri
                    </button>
                    <button 
                        type="submit"
                        disabled={isSubmitting}
                        className={`flex-[2] py-4 rounded-2xl text-lg font-bold shadow-2xl transition-all flex items-center justify-center gap-3 ${
                            isSubmitting
                            ? 'bg-stone-700 cursor-wait'
                            : 'bg-stone-800 hover:bg-stone-900 text-white active:scale-[0.98]'
                        }`}
                    >
                        {isSubmitting ? (
                            <span className="animate-pulse">Gönderiliyor...</span>
                        ) : (
                            'Sipariş Ver'
                        )}
                    </button>
                </div>
            </div>
        )}
      </form>
    </div>
  );
};

export default GuestDashboard;
