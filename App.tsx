
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

  // Auth durumunu dinle
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Kullanıcı giriş yapmış.
        // Hem Misafir hem Admin artık Anonim giriş kullanıyor.
        // Rolü belirlemek için localStorage'a bakıyoruz.
        const storedRole = localStorage.getItem('evCoffeeRole');
        
        if (storedRole === UserRole.ADMIN) {
          setRole(UserRole.ADMIN);
        } else {
          // Varsayılan olarak Guest
          setRole(UserRole.GUEST);
        }
      } else {
        // Kullanıcı çıkış yapmış
        setRole(UserRole.NONE);
        // Çıkış yapıldığında tercihi temizlemiyoruz, bir sonraki girişte Login.tsx zaten üzerine yazacak.
        // Ancak temiz bir state için temizleyebiliriz de.
        localStorage.removeItem('evCoffeeRole');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Firebase Realtime Database'den verileri dinle
  useEffect(() => {
    // Sadece giriş yapılmışsa veri çek
    if (role === UserRole.NONE) {
      setOrders([]);
      return;
    }

    const ordersRef = ref(db, 'orders');
    
    const unsubscribe = onValue(ordersRef, (snapshot) => {
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
        // İzin hatası
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
    } catch (error: any) {
      console.error("Sipariş hatası:", error);
      alert("Sipariş gönderilemedi. Lütfen bağlantınızı kontrol edin.");
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
    // Çıkış yaparken storage'ı temizle
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
