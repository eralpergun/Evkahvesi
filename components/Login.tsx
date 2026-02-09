
import React from 'react';
import { UserRole } from '../types';

interface LoginProps {
  onSelectRole: (role: UserRole) => void;
}

const Login: React.FC<LoginProps> = ({ onSelectRole }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#fcfaf7]">
      <div className="max-w-md w-full">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl mx-auto shadow-xl mb-6">B</div>
          <h1 className="text-4xl font-serif text-stone-800 mb-2">BrewPulse</h1>
          <p className="text-stone-500 font-medium italic">Elevating the coffee ritual.</p>
        </div>

        <div className="space-y-4">
          <button 
            onClick={() => onSelectRole(UserRole.GUEST)}
            className="w-full p-8 bg-white border border-stone-100 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all text-left group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-serif text-stone-800">Guest Order</h2>
                <p className="text-sm text-stone-400 mt-1">Browse and customize your free coffee.</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>
          </button>

          <button 
            onClick={() => onSelectRole(UserRole.ADMIN)}
            className="w-full p-8 bg-stone-800 border border-stone-700 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all text-left group text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-serif">Barista Admin</h2>
                <p className="text-stone-400 mt-1">Manage incoming orders in real-time.</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-stone-700 flex items-center justify-center text-stone-400 group-hover:bg-white group-hover:text-stone-800 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </button>
        </div>

        <p className="text-center mt-12 text-stone-400 text-xs">
          Handcrafted by BrewPulse Coffee Systems
        </p>
      </div>
    </div>
  );
};

export default Login;
