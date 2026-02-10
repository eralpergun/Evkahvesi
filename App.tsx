
import React, { useState, useEffect } from 'react';
import { UserRole, Order } from './types';
import Login from './components/Login';
import Layout from './components/Layout';
import GuestDashboard from './components/GuestDashboard';
import AdminDashboard from './components/AdminDashboard';
import { db, auth } from './services/firebase';
import { 
  ref, 
  onValue, 
  push, 
  update, 
  remove,
  set
} from 'firebase/database';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole>(UserRole.NONE);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);

  // Auth durumunu dinle
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const storedRole = localStorage.getItem('evCoffeeRole');
        if (storedRole === UserRole.ADMIN) {
          setRole(UserRole.ADMIN);
        } else {
          setRole(UserRole.GUEST);
        }
      } else {
        setRole(UserRole.NONE);
        localStorage.removeItem('evCoffeeRole');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Firebase Realtime Database'den verileri dinle
  useEffect(() => {
    if (role === UserRole.NONE) {
      setOrders([]);
      return;
    }

    const ordersRef = ref(db, 'orders');
    
    const unsubscribe = onValue(ordersRef, (snapshot) => {
      setDbError(null); // Başarılı okumada hatayı temizle
      const data = snapshot.val();
      if (data) {
        const ordersArray = Object.entries(data).map(([key, value]) => {
          return {
            id: key,
            ...(value as Omit<Order, 'id'>)
          };
        });
        setOrders(ordersArray.sort((a, b) => b.timestamp - a.timestamp));
      } else {
        setOrders([]);
      }
    }, (error) => {
      console.error("Veri okuma hatası:", error);
      if (error.code === 'PERMISSION_DENIED') {
        setDbError("Erişim Reddedildi: Lütfen Firebase Konsolundan Realtime Database kurallarını (Rules) kontrol edin. '.read' ve '.write' kurallarını 'auth != null' veya test için 'true' yapın.");
      } else {
        setDbError(`Bağlantı Hatası: ${error.message}. databaseURL yapılandırmanızı kontrol edin.`);
      }
    });

    return () => unsubscribe();
  }, [role]);

  const handlePlaceOrder = async (orderData: Omit<Order, 'id' | 'timestamp' | 'status'>) => {
    try {
      const ordersRef = ref(db, 'orders');
      const newOrderRef = push(ordersRef);
      
      await set(newOrderRef, {
        ...orderData,
        timestamp: Date.now(),
        status: 'PENDING'
      });
      return true; // Başarılı
    } catch (error: any) {
      console.error("Sipariş hatası:", error);
      alert("Sipariş gönderilemedi: " + error.message + "\nLütfen internet bağlantınızı veya veritabanı kurallarınızı kontrol edin.");
      throw error;
    }
  };

  const handleUpdateStatus = async (id: string, status: Order['status']) => {
    try {
      const orderRef = ref(db, `orders/${id}`);
      await update(orderRef, { status });
    } catch (error) {
      console.error("Güncelleme hatası:", error);
    }
  };

  const handleClearOrder = async (id: string) => {
    try {
      const orderRef = ref(db, `orders/${id}`);
      await remove(orderRef);
    } catch (error) {
      console.error("Silme hatası:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('evCoffeeRole');
    signOut(auth).catch(err => console.error("Çıkış hatası:", err));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fcfaf7]">
        <div className="animate-pulse text-stone-400 font-serif">Yükleniyor...</div>
      </div>
    );
  }

  if (role === UserRole.NONE) {
    return <Login />;
  }

  return (
    <Layout role={role} onLogout={handleLogout}>
      {dbError && role === UserRole.ADMIN && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm font-bold flex items-center gap-3">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
           {dbError}
        </div>
      )}
      
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
