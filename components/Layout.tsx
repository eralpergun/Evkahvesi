
import React from 'react';
import { UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  role: UserRole;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, role, onLogout }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-orange-100 px-4 md:px-6 py-3 md:py-4 sticky top-0 z-50 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-stone-800 rounded-xl flex items-center justify-center text-white font-bold text-lg md:text-xl italic">E</div>
          <h1 className="text-xl md:text-2xl font-serif text-stone-800">Ev Coffee</h1>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          <span className="hidden md:inline-block px-3 py-1 bg-stone-50 text-stone-600 text-[10px] font-bold rounded-full uppercase tracking-widest border border-stone-100">
            {role === UserRole.ADMIN ? 'Yönetici Paneli' : 'Misafir Deneyimi'}
          </span>
          <button 
            onClick={onLogout}
            className="text-stone-400 hover:text-orange-600 transition-colors text-[10px] md:text-xs font-bold uppercase tracking-tighter border border-stone-200 md:border-none px-3 py-1.5 md:p-0 rounded-lg md:rounded-none"
          >
            Çıkış Yap
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8">
        {children}
      </main>

      <footer className="py-6 md:py-8 text-center text-stone-300 text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-bold">
        &copy; {new Date().getFullYear()} Ev Coffee Systems &bull; Her Bardakta Bir Hikaye
      </footer>
    </div>
  );
};

export default Layout;
