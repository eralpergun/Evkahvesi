
import React, { useState, useEffect } from 'react';
import { UserRole, Order } from './types';
import Login from './components/Login';
import Layout from './components/Layout';
import GuestDashboard from './components/GuestDashboard';
import AdminDashboard from './components/AdminDashboard';
import { db } from './services/firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy 
} from 'firebase/firestore';

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole>(UserRole.NONE);
  const [orders, setOrders] = useState<Order[]>([]);

  // Firebase'den verileri gerçek zamanlı dinle
  useEffect(() => {
    try {
      const q = query(collection(db, "orders"), orderBy("timestamp", "desc"));
      
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const ordersArray: Order[] = [];
        querySnapshot.forEach((doc) => {
          ordersArray.push({ id: doc.id, ...doc.data() } as Order);
        });
        setOrders(ordersArray);
      }, (error) => {
        console.error("Firebase Sync Error:", error);
        if (error.code === 'permission-denied') {
          console.error("Lütfen Firebase Console'dan Firestore kurallarını (Rules) güncelleyin!");
        }
      });

      return () => unsubscribe();
    } catch (e) {
      console.error("Firebase initialization error:", e);
    }
  }, []);

  const handlePlaceOrder = async (orderData: Omit<Order, 'id' | 'timestamp' | 'status'>) => {
    try {
      await addDoc(collection(db, "orders"), {
        ...orderData,
        timestamp: Date.now(),
        status: 'PENDING'
      });
    } catch (error) {
      console.error("Order error:", error);
      alert("Sipariş verilirken bir hata oluştu. Lütfen Firebase kurallarını kontrol edin.");
    }
  };

  const handleUpdateStatus = async (id: string, status: Order['status']) => {
    try {
      const orderRef = doc(db, "orders", id);
      await updateDoc(orderRef, { status });
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  const handleClearOrder = async (id: string) => {
    try {
      const orderRef = doc(db, "orders", id);
      await deleteDoc(orderRef);
    } catch (error) {
      console.error("Delete error:", error);
    }
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
