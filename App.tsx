
import React, { useState, useEffect, useCallback } from 'react';
import { UserRole, Order } from './types';
import Login from './components/Login';
import Layout from './components/Layout';
import GuestDashboard from './components/GuestDashboard';
import AdminDashboard from './components/AdminDashboard';

const STORAGE_KEY = 'evcoffee_orders_v1';
const CHANNEL_NAME = 'evcoffee_sync_channel';

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole>(UserRole.NONE);
  const [orders, setOrders] = useState<Order[]>([]);
  const [channel, setChannel] = useState<BroadcastChannel | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setOrders(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load orders");
      }
    }

    const bc = new BroadcastChannel(CHANNEL_NAME);
    bc.onmessage = (event) => {
      if (event.data.type === 'SYNC_ORDERS') {
        setOrders(event.data.payload);
      }
    };
    setChannel(bc);

    return () => bc.close();
  }, []);

  const syncOrders = useCallback((newOrders: Order[]) => {
    setOrders(newOrders);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newOrders));
    if (channel) {
      channel.postMessage({ type: 'SYNC_ORDERS', payload: newOrders });
    }
  }, [channel]);

  const handlePlaceOrder = (orderData: Omit<Order, 'id' | 'timestamp' | 'status'>) => {
    const newOrder: Order = {
      ...orderData,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      status: 'PENDING'
    };
    syncOrders([...orders, newOrder]);
  };

  const handleUpdateStatus = (id: string, status: Order['status']) => {
    const updated = orders.map(o => o.id === id ? { ...o, status } : o);
    syncOrders(updated);
  };

  const handleClearOrder = (id: string) => {
    const updated = orders.filter(o => o.id !== id);
    syncOrders(updated);
  };

  const handleLogout = () => {
    setRole(UserRole.NONE);
  };

  if (role === UserRole.NONE) {
    return <Login onSelectRole={setRole} />;
  }

  return (
    <Layout role={role} onLogout={handleLogout}>
      {role === UserRole.GUEST ? (
        <GuestDashboard onPlaceOrder={handlePlaceOrder} />
      ) : (
        <AdminDashboard 
          orders={orders} 
          onUpdateStatus={handleUpdateStatus} 
          onClearOrder={handleClearOrder} 
        />
      )}
    </Layout>
  );
};

export default App;
