
import React, { useMemo, useState, useEffect } from 'react';
import { Order } from '../types';
import { SIZE_LABELS } from '../constants';

interface AdminDashboardProps {
  orders: Order[];
  onUpdateStatus: (id: string, status: Order['status']) => void;
  onClearOrder: (id: string) => void;
  isServiceOnline: boolean;
  onToggleService: (status: boolean) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
    orders, 
    onUpdateStatus, 
    onClearOrder, 
    isServiceOnline, 
    onToggleService 
}) => {
  const [lastOrderCount, setLastOrderCount] = useState(orders.length);
  const [newOrderToast, setNewOrderToast] = useState<{ name: string; type: string } | null>(null);
  
  const pendingCount = useMemo(() => orders.filter(o => o.status !== 'COMPLETED').length, [orders]);
  const completedCount = useMemo(() => orders.filter(o => o.status === 'COMPLETED').length, [orders]);
  const sortedOrders = useMemo(() => [...orders].sort((a, b) => b.timestamp - a.timestamp), [orders]);

  useEffect(() => {
    if (orders.length > lastOrderCount) {
      const newestOrder = orders.reduce((prev, current) => (prev.timestamp > current.timestamp) ? prev : current);
      setNewOrderToast({ name: newestOrder.guestName, type: newestOrder.coffeeType });
      const timer = setTimeout(() => setNewOrderToast(null), 6000);
      return () => clearTimeout(timer);
    }
    setLastOrderCount(orders.length);
  }, [orders, lastOrderCount]);

  return (
    <div className="space-y-6 md:space-y-8 relative">
      {newOrderToast && (
        <div className="fixed top-24 right-4 md:right-6 z-[60] animate-bounce-in max-w-[90vw]">
          <div className="bg-stone-900 text-white p-4 md:p-6 rounded-2xl shadow-2xl border border-stone-800 flex items-center gap-4 md:gap-5 min-w-[280px] md:min-w-[340px]">
            <div className="w-10 h-10 md:w-14 md:h-14 bg-white/10 rounded-xl md:rounded-2xl flex items-center justify-center text-xl md:text-2xl shrink-0 backdrop-blur-sm">☕</div>
            <div>
              <div className="text-[8px] md:text-[10px] font-black text-stone-500 uppercase tracking-[0.2em] mb-1">Yeni Sipariş!</div>
              <div className="font-serif text-base md:text-lg leading-tight">{newOrderToast.name} için bir {newOrderToast.type}</div>
            </div>
            <button onClick={() => setNewOrderToast(null)} className="ml-auto p-1 text-stone-600 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Kontrol Paneli Üst Bar */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 justify-between items-start md:items-center bg-white p-5 md:p-6 rounded-3xl shadow-sm border border-stone-100">
         <div className="flex-1">
             <h2 className="text-xl md:text-2xl font-serif text-stone-800">Servis Durumu</h2>
             <p className="text-stone-400 text-xs md:text-sm">Misafirler sipariş verebilsin mi?</p>
         </div>
         <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
             <span className={`text-[10px] md:text-xs font-bold uppercase tracking-widest ${isServiceOnline ? 'text-green-600' : 'text-stone-400'}`}>
                 {isServiceOnline ? 'SERVİS AÇIK' : 'SERVİS KAPALI'}
             </span>
             <button 
                onClick={() => onToggleService(!isServiceOnline)}
                className={`w-14 md:w-16 h-7 md:h-8 rounded-full p-1 transition-all duration-300 ${isServiceOnline ? 'bg-green-500' : 'bg-stone-200'}`}
             >
                 <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full bg-white shadow-md transform transition-all duration-300 ${isServiceOnline ? 'translate-x-7 md:translate-x-8' : 'translate-x-0'}`} />
             </button>
         </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-sm border border-stone-100">
          <div className="text-stone-400 text-[8px] md:text-[9px] font-black uppercase tracking-widest mb-1">Toplam Kuyruk</div>
          <div className="text-2xl md:text-4xl font-serif text-stone-800">{orders.length}</div>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-sm border border-stone-100">
          <div className="text-stone-400 text-[8px] md:text-[9px] font-black uppercase tracking-widest mb-1">Bekleyenler</div>
          <div className="text-2xl md:text-4xl font-serif text-stone-600">{pendingCount}</div>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-sm border border-stone-100">
          <div className="text-stone-400 text-[8px] md:text-[9px] font-black uppercase tracking-widest mb-1">Tamamlanan</div>
          <div className="text-2xl md:text-4xl font-serif text-stone-800">{completedCount}</div>
        </div>
        <div className="bg-stone-900 p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-xl">
          <div className="text-stone-500 text-[8px] md:text-[9px] font-black uppercase tracking-widest mb-1">Hizmet Puanı</div>
          <div className="text-2xl md:text-4xl font-serif text-white">{orders.length > 0 ? Math.round((completedCount / orders.length) * 100) : 0}%</div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="px-6 md:px-8 py-4 md:py-6 border-b border-stone-50 flex justify-between items-center bg-stone-50/20">
          <div>
            <h3 className="text-lg md:text-2xl font-serif text-stone-800 tracking-tight">Sipariş Paneli</h3>
            <p className="text-[10px] md:text-xs text-stone-400 mt-1 font-medium italic">Gerçek zamanlı talepler izleniyor.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full animate-pulse ${isServiceOnline ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span className="text-[9px] md:text-[10px] font-black text-stone-400 uppercase tracking-widest hidden md:inline">
                {isServiceOnline ? 'Canlı Bağlantı' : 'Çevrimdışı'}
            </span>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="p-12 md:p-24 text-center">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-stone-50 rounded-full flex items-center justify-center mx-auto text-stone-200 mb-4 md:mb-6">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-10 md:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-base md:text-lg font-serif text-stone-400">Aktif sipariş bulunmuyor...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-stone-50/50 text-[10px] text-stone-400 font-black uppercase tracking-[0.15em] border-b border-stone-100">
                  <th className="px-6 md:px-8 py-4 md:py-5">Misafir</th>
                  <th className="px-6 md:px-8 py-4 md:py-5">Seçim</th>
                  <th className="px-6 md:px-8 py-4 md:py-5">Sertlik / Süt</th>
                  <th className="px-6 md:px-8 py-4 md:py-5">Durum</th>
                  <th className="px-6 md:px-8 py-4 md:py-5 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {sortedOrders.map(order => (
                  <tr key={order.id} className={`group transition-all ${order.status === 'COMPLETED' ? 'bg-stone-50/20 grayscale' : 'hover:bg-stone-50/30'}`}>
                    <td className="px-6 md:px-8 py-4 md:py-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-9 h-9 md:w-11 md:h-11 rounded-xl md:rounded-2xl flex items-center justify-center font-black text-xs md:text-sm shadow-sm ${
                          order.status === 'COMPLETED' ? 'bg-stone-200 text-stone-500' : 'bg-stone-800 text-white'
                        }`}>
                          {order.guestName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-sm md:text-base text-stone-800">{order.guestName}</div>
                          <div className="text-[9px] md:text-[10px] text-stone-300 font-mono mt-0.5">
                            {new Date(order.timestamp).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 md:px-8 py-4 md:py-6">
                      <div className="text-xs md:text-sm font-black text-stone-700">{order.coffeeType}</div>
                      <div className="text-[9px] md:text-[10px] text-stone-400 font-bold uppercase tracking-tighter mt-1">{SIZE_LABELS[order.size]}</div>
                    </td>
                    <td className="px-6 md:px-8 py-4 md:py-6">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <div className="flex-1 bg-stone-100 h-1.5 rounded-full w-20 md:w-24 overflow-hidden">
                            <div className={`h-full rounded-full transition-all duration-700 ${order.status === 'COMPLETED' ? 'bg-stone-300' : 'bg-stone-800'}`} style={{ width: `${order.percentage}%` }}></div>
                            </div>
                            <span className="text-[9px] md:text-[10px] font-black text-stone-500">%{order.percentage}</span>
                        </div>
                        {order.milkLevel && (
                             <span className="inline-block self-start px-2 py-1 bg-orange-50 text-orange-800 rounded-md text-[8px] md:text-[9px] font-bold uppercase tracking-wide border border-orange-100">
                                {order.milkLevel}
                             </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 md:px-8 py-4 md:py-6">
                      <select 
                        value={order.status}
                        onChange={(e) => onUpdateStatus(order.id, e.target.value as Order['status'])}
                        className={`text-[9px] md:text-[10px] font-black px-3 py-1.5 md:px-4 md:py-2 rounded-xl border transition-all cursor-pointer outline-none ${
                          order.status === 'PENDING' ? 'bg-white text-stone-800 border-stone-200' :
                          order.status === 'PREPARING' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                          'bg-green-50 text-green-700 border-green-100'
                        }`}
                      >
                        <option value="PENDING">BEKLİYOR</option>
                        <option value="PREPARING">HAZIRLANIYOR</option>
                        <option value="COMPLETED">TAMAMLANDI</option>
                      </select>
                    </td>
                    <td className="px-6 md:px-8 py-4 md:py-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        {order.status !== 'COMPLETED' && (
                          <button 
                            onClick={() => onUpdateStatus(order.id, 'COMPLETED')}
                            className="px-3 py-1.5 md:px-4 md:py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all shadow-md"
                          >
                            Servis Et
                          </button>
                        )}
                        <button 
                          onClick={() => onClearOrder(order.id)}
                          className="p-2 md:p-2.5 text-stone-300 md:text-stone-200 hover:text-red-500 transition-all rounded-xl hover:bg-red-50"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`
        @keyframes bounce-in {
          0% { transform: translateX(100%); opacity: 0; }
          60% { transform: translateX(-5%); opacity: 1; }
          100% { transform: translateX(0); }
        }
        .animate-bounce-in {
          animation: bounce-in 0.6s cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
