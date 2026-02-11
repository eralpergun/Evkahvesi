
import React, { useState } from 'react';
import { auth } from '../services/firebase';
import { signInAnonymously } from 'firebase/auth';
import { UserRole } from '../types';

const Login: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');

  const handleLogin = async (targetRole: UserRole) => {
    setLoading(true);
    setError(null);
    
    // Role ve Zamanı Kaydet
    localStorage.setItem('evCoffeeRole', targetRole);
    // Yönetici ise giriş zamanını kaydet (2 gün kontrolü için)
    if (targetRole === UserRole.ADMIN) {
        localStorage.setItem('evCoffeeLoginTime', Date.now().toString());
    }

    try {
      await signInAnonymously(auth);
    } catch (err: any) {
      console.error("Giriş hatası:", err);
      // Hata durumunda storage'ı temizle
      localStorage.removeItem('evCoffeeRole');
      localStorage.removeItem('evCoffeeLoginTime');
      
      if (err.code === 'auth/configuration-not-found') {
        setError("Firebase Konsolunda 'Anonymous' oturum açma yöntemi etkinleştirilmemiş.");
      } else {
        setError("Giriş yapılamadı: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAdminClick = () => {
      setShowPassword(true);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (password === '2908') {
          handleLogin(UserRole.ADMIN);
      } else {
          setError("Hatalı Şifre");
          setPassword('');
      }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-6 bg-[#fcfaf7]">
      <div className="max-w-md w-full">
        <div className="text-center mb-10 md:mb-16">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-stone-800 rounded-2xl flex items-center justify-center text-white font-bold text-3xl md:text-4xl mx-auto shadow-2xl mb-6 md:mb-8 italic">E</div>
          <h1 className="text-4xl md:text-5xl font-serif text-stone-800 mb-3 tracking-tighter">Ev Coffee</h1>
          <p className="text-stone-400 font-medium italic text-sm">Evinizdeki kahve ritüeli.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-bold">
            {error}
          </div>
        )}

        <div className="space-y-4 md:space-y-5">
          {!showPassword ? (
              <>
                {/* Misafir Girişi Butonu */}
                <button 
                    onClick={() => handleLogin(UserRole.GUEST)}
                    disabled={loading}
                    className="w-full p-6 md:p-8 bg-white border border-stone-100 rounded-3xl shadow-sm hover:shadow-2xl hover:translate-y-[-4px] transition-all text-left group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <div className="relative z-10 flex items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl md:text-2xl font-serif text-stone-800">Misafir Girişi</h2>
                        <p className="text-[10px] md:text-xs text-stone-400 mt-1 md:mt-2 font-bold uppercase tracking-widest">
                        {loading ? 'Giriş Yapılıyor...' : 'Kahveni Sipariş Et'}
                        </p>
                    </div>
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-stone-50 flex items-center justify-center text-stone-800 group-hover:bg-stone-800 group-hover:text-white transition-all duration-500 shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </div>
                    </div>
                </button>

                {/* Barista Girişi Butonu (Şifre Ekranını Açar) */}
                <button 
                    onClick={handleAdminClick}
                    disabled={loading}
                    className="w-full p-6 md:p-8 bg-stone-800 border border-stone-700 rounded-3xl shadow-lg hover:shadow-2xl hover:translate-y-[-4px] transition-all text-left group text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <div className="flex items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl md:text-2xl font-serif">Barista Paneli</h2>
                        <p className="text-[10px] md:text-xs text-stone-500 mt-1 md:mt-2 font-bold uppercase tracking-widest">
                        {loading ? 'Giriş Yapılıyor...' : 'Yönetici Girişi'}
                        </p>
                    </div>
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-stone-700 flex items-center justify-center text-stone-400 group-hover:bg-white group-hover:text-stone-800 transition-all duration-500 shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                    </div>
                </button>
            </>
          ) : (
              <form onSubmit={handlePasswordSubmit} className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-stone-100 animate-fade-in">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg md:text-xl font-serif text-stone-800">Şifre Giriniz</h2>
                    <button type="button" onClick={() => setShowPassword(false)} className="text-stone-400 hover:text-stone-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                  </div>
                  <input 
                    type="password" 
                    autoFocus
                    placeholder="****"
                    className="w-full text-center text-3xl tracking-[1em] py-4 border-b-2 border-stone-200 focus:border-stone-800 outline-none mb-6 font-serif"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    maxLength={4}
                  />
                  <button 
                    type="submit" 
                    className="w-full py-4 bg-stone-800 text-white rounded-xl font-bold uppercase tracking-widest hover:bg-stone-900 transition-all"
                  >
                      Giriş Yap
                  </button>
              </form>
          )}
        </div>

        <p className="text-center mt-12 md:mt-20 text-stone-300 text-[9px] font-black uppercase tracking-[0.3em]">
          Handcrafted by Ev Coffee &bull; v2.2
        </p>
      </div>
    </div>
  );
};

export default Login;
