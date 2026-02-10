
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
  const [permissionError, setPermissionError] = useState(false);

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
      setDbError(null); 
      setPermissionError(false);
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
      if (error.code === 'PERMISSION_DENIED' || error.message.includes('permission_denied')) {
        setPermissionError(true);
        setDbError("Erişim Reddedildi: Veritabanı kuralları (Rules) yapılandırılmamış.");
      } else {
        setDbError(`Bağlantı Hatası: ${error.message}. Lütfen services/firebase.ts dosyasındaki databaseURL ayarını kontrol edin.`);
      }
    });

    return () => unsubscribe();
  }, [role]);

  const handlePlaceOrder = async (orderData: Omit<Order, 'id' | 'timestamp' | 'status'>) => {
    try {
      const ordersRef = ref(db, 'orders');
      const newOrderRef = push(ordersRef);
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Zaman Aşımı")), 10000)
      );

      const savePromise = set(newOrderRef, {
        ...orderData,
        timestamp: Date.now(),
        status: 'PENDING'
      });

      await Promise.race([savePromise, timeoutPromise]);
      
      return newOrderRef.key; // Return the ID so GuestDashboard can track it
    } catch (error: any) {
      console.error("Sipariş hatası:", error);
      
      let errorMessage = "Sipariş gönderilemedi.";
      if (error.code === 'PERMISSION_DENIED' || error.message.includes('permission_denied')) {
        setPermissionError(true);
        errorMessage = "Yetki Hatası: Veritabanı kuralları yazmaya izin vermiyor.";
      } else if (error.message === "Zaman Aşımı") {
        errorMessage = "Veritabanına ulaşılamadı. İnternet bağlantınızı kontrol edin.";
      } else {
        errorMessage += " " + error.message;
      }
      
      if (!permissionError && error.code !== 'PERMISSION_DENIED' && !error.message.includes('permission_denied')) {
          alert(errorMessage);
      }
      throw error;
    }
  };

  const handleUpdateStatus = async (id: string, status: Order['status']) => {
    try {
      const orderRef = ref(db, `orders/${id}`);
      await update(orderRef, { status });
    } catch (error: any) {
      console.error("Güncelleme hatası:", error);
      if (error.code === 'PERMISSION_DENIED' || error.message.includes('permission_denied')) {
         setPermissionError(true);
      } else {
         alert("Durum güncellenemedi: " + error.message);
      }
    }
  };

  const handleClearOrder = async (id: string) => {
    try {
      const orderRef = ref(db, `orders/${id}`);
      await remove(orderRef);
    } catch (error: any) {
      console.error("Silme hatası:", error);
      if (error.code === 'PERMISSION_DENIED' || error.message.includes('permission_denied')) {
         setPermissionError(true);
      }
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

  // Permission Error Modal
  if (permissionError) {
    return (
      <div className="fixed inset-0 z-[100] bg-stone-900/90 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl border-4 border-red-100">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center shrink-0">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
               </svg>
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-serif text-stone-900">Veritabanı Kuralları Eksik</h2>
              <p className="text-stone-600">
                Uygulama veritabanına bağlandı ancak <strong>yazma/okuma izni alamadı</strong>. <br/>
                Bu hatayı düzeltmek için Firebase Konsolu'nda şu adımları izleyin:
              </p>
              
              <ol className="list-decimal list-inside text-sm text-stone-600 space-y-1 ml-1">
                <li>Firebase Konsolu &gt; <strong>Realtime Database</strong> sekmesine gidin.</li>
                <li>Yukarıdaki <strong>Rules (Kurallar)</strong> sekmesine tıklayın.</li>
                <li>Mevcut kodları silin ve aşağıdakini yapıştırın:</li>
              </ol>

              <div className="bg-stone-900 rounded-xl p-4 relative group text-left">
                <code className="text-green-400 font-mono text-sm whitespace-pre block">
{`{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}`}
                </code>
              </div>

              <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                <p className="text-orange-800 text-xs font-bold">
                  İPUCU: "Publish" (Yayınla) butonuna basmayı unutmayın.
                </p>
              </div>

              <button 
                onClick={() => window.location.reload()}
                className="w-full py-4 bg-stone-800 hover:bg-stone-900 text-white rounded-xl font-bold transition-all mt-2"
              >
                Kuralları Güncelledim, Yeniden Dene
              </button>
            </div>
          </div>
        </div>
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
        <GuestDashboard orders={orders} onPlaceOrder={handlePlaceOrder} />
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
