
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Order } from '../types';

interface AdminDashboardProps {
  orders: Order[];
  onUpdateStatus: (id: string, status: Order['status']) => void;
  onClearOrder: (id: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ orders, onUpdateStatus, onClearOrder }) => {
  const [lastOrderCount, setLastOrderCount] = useState(orders.length);
  const [newOrderToast, setNewOrderToast] = useState<{ name: string; type: string } | null>(null);
  
  const pendingCount = useMemo(() => orders.filter(o => o.status !== 'COMPLETED').length, [orders]);
  const completedCount = useMemo(() => orders.filter(o => o.status === 'COMPLETED').length, [orders]);
  const sortedOrders = useMemo(() => [...orders].sort((a, b) => b.timestamp - a.timestamp), [orders]);

  // Detect new orders for "Pop up" notification
  useEffect(() => {
    if (orders.length > lastOrderCount) {
      const newestOrder = orders.reduce((prev, current) => (prev.timestamp > current.timestamp) ? prev : current);
      setNewOrderToast({ name: newestOrder.guestName, type: newestOrder.coffeeType });
      
      // Auto-hide toast
      const timer = setTimeout(() => setNewOrderToast(null), 5000);
      return () => clearTimeout(timer);
    }
    setLastOrderCount(orders.length);
  }, [orders, lastOrderCount]);

  return (
    <div className="space-y-8 relative">
      {/* Pop-up Notification for New Orders */}
      {newOrderToast && (
        <div className="fixed top-24 right-6 z-[60] animate-bounce-in">
          <div className="bg-stone-900 text-white p-5 rounded-2xl shadow-2xl border border-stone-700 flex items-center gap-4 min-w-[300px]">
            <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center text-xl shrink-0">☕</div>
            <div>
              <div className="text-xs font-bold text-orange-400 uppercase tracking-widest">New Order Incoming!</div>
              <div className="font-serif text-lg leading-tight">{newOrderToast.name} ordered a {newOrderToast.type}</div>
            </div>
            <button onClick={() => setNewOrderToast(null)} className="ml-auto text-stone-500 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100">
          <div className="text-stone-400 text-[10px] font-bold uppercase tracking-widest mb-1">Total Queue</div>
          <div className="text-4xl font-serif text-stone-800">{orders.length}</div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100">
          <div className="text-orange-500 text-[10px] font-bold uppercase tracking-widest mb-1">Active Orders</div>
          <div className="text-4xl font-serif text-orange-600">{pendingCount}</div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100">
          <div className="text-green-500 text-[10px] font-bold uppercase tracking-widest mb-1">Completed</div>
          <div className="text-4xl font-serif text-green-600">{completedCount}</div>
        </div>
        <div className="bg-stone-900 p-6 rounded-3xl shadow-xl border border-stone-800">
          <div className="text-stone-500 text-[10px] font-bold uppercase tracking-widest mb-1">Barista Efficiency</div>
          <div className="text-4xl font-serif text-white">{orders.length > 0 ? Math.round((completedCount / orders.length) * 100) : 0}%</div>
        </div>
      </div>

      {/* Live Order Feed */}
      <div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="px-8 py-6 border-b border-stone-50 flex justify-between items-center bg-stone-50/30">
          <div>
            <h3 className="text-2xl font-serif text-stone-800">Order Management</h3>
            <p className="text-xs text-stone-500 mt-1 font-medium italic">Processing your guest requests in real-time.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 text-[10px] font-bold rounded-full border border-green-100">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              Live Sync Active
            </span>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="p-24 text-center">
            <div className="w-24 h-24 bg-stone-50 rounded-full flex items-center justify-center mx-auto text-stone-200 mb-6">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <p className="text-xl font-serif text-stone-400">Your coffee queue is currently empty</p>
            <p className="text-sm text-stone-300 mt-2">New orders from guests will appear here automatically.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-stone-50/50 text-[10px] text-stone-400 font-bold uppercase tracking-widest border-b border-stone-100">
                  <th className="px-8 py-5">Guest Information</th>
                  <th className="px-8 py-5">Coffee Selection</th>
                  <th className="px-8 py-5">Details</th>
                  <th className="px-8 py-5">Current Status</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {sortedOrders.map(order => (
                  <tr key={order.id} className={`group hover:bg-stone-50/50 transition-all ${order.status === 'COMPLETED' ? 'bg-stone-50/20 grayscale-[0.3]' : ''}`}>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg ${
                          order.status === 'COMPLETED' ? 'bg-stone-200 text-stone-500' : 'bg-orange-100 text-orange-600'
                        }`}>
                          {order.guestName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-stone-800 text-base">{order.guestName}</div>
                          <div className="text-[10px] text-stone-400 font-mono uppercase tracking-tighter mt-0.5">
                            {new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-sm font-bold text-stone-700">{order.coffeeType}</div>
                      <div className="inline-block px-2 py-0.5 bg-stone-100 text-stone-500 rounded text-[10px] font-bold uppercase mt-1 tracking-tight">
                        {order.size}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-stone-100 h-1.5 rounded-full w-24 overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 ${
                              order.status === 'COMPLETED' ? 'bg-stone-400' : 'bg-orange-500'
                            }`} 
                            style={{ width: `${order.percentage}%` }}
                          ></div>
                        </div>
                        <span className={`text-xs font-black ${order.status === 'COMPLETED' ? 'text-stone-400' : 'text-orange-600'}`}>
                          {order.percentage}%
                        </span>
                      </div>
                      <div className="text-[9px] text-stone-400 uppercase font-bold mt-1.5 tracking-tighter">Strength Profile</div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                         <select 
                          value={order.status}
                          onChange={(e) => onUpdateStatus(order.id, e.target.value as Order['status'])}
                          className={`text-[11px] font-black px-4 py-2 rounded-xl outline-none border-2 shadow-sm transition-all cursor-pointer ${
                            order.status === 'PENDING' ? 'bg-orange-50 text-orange-700 border-orange-100 hover:border-orange-300' :
                            order.status === 'PREPARING' ? 'bg-blue-50 text-blue-700 border-blue-100 hover:border-blue-300' :
                            'bg-green-50 text-green-700 border-green-100 hover:border-green-300'
                          }`}
                        >
                          <option value="PENDING">WAITING</option>
                          <option value="PREPARING">BREWING</option>
                          <option value="COMPLETED">SERVED</option>
                        </select>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {order.status !== 'COMPLETED' && (
                          <button 
                            onClick={() => onUpdateStatus(order.id, 'COMPLETED')}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
                            title="Mark as Completed"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                            Complete
                          </button>
                        )}
                        <button 
                          onClick={() => onClearOrder(order.id)}
                          className="p-2.5 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          title="Archive Order"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
          animation: bounce-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
