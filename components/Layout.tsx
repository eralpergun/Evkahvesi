
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
      <header className="bg-white border-b border-orange-100 px-6 py-4 sticky top-0 z-50 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">B</div>
          <h1 className="text-2xl font-serif text-stone-800">BrewPulse</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="px-3 py-1 bg-orange-50 text-orange-700 text-xs font-bold rounded-full uppercase tracking-wider">
            {role === UserRole.ADMIN ? 'Admin Portal' : 'Guest Experience'}
          </span>
          <button 
            onClick={onLogout}
            className="text-stone-500 hover:text-orange-600 transition-colors text-sm font-medium"
          >
            Sign Out
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8">
        {children}
      </main>

      <footer className="py-6 text-center text-stone-400 text-xs">
        &copy; {new Date().getFullYear()} BrewPulse Systems. Crafting excellence one cup at a time.
      </footer>
    </div>
  );
};

export default Layout;
