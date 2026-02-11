
export enum UserRole {
  GUEST = 'GUEST',
  ADMIN = 'ADMIN',
  NONE = 'NONE'
}

export enum CoffeeSize {
  SMALL = 'Small',
  MEDIUM = 'Medium',
  LARGE = 'Large'
}

export type CoffeeType = 
  | 'Latte Macchiato' 
  | 'Caffe Latte'
  | 'Flat White'
  | 'Cappuccino' // Bu listede yoktu ama Caffe Latte vb ile genelde istenir, user istemediği için eklemiyorum.
  | 'Americano' 
  | 'Espresso' 
  | 'Ristretto'
  | 'Espresso Lungo'
  | 'Caramel Macchiato' 
  | 'Iced Latte Macchiato' 
  | 'Iced Caramel Macchiato' 
  | 'Cafe Crema';

export type MilkLevel = 'Az Sütlü' | 'Standart' | 'Bol Sütlü';

export interface Order {
  id: string;
  guestName: string;
  coffeeType: CoffeeType;
  size: CoffeeSize;
  percentage: number;
  milkLevel?: MilkLevel; // İsteğe bağlı süt oranı
  timestamp: number;
  status: 'PENDING' | 'PREPARING' | 'COMPLETED';
}

export interface CoffeeOption {
  id: CoffeeType;
  name: string;
  description: string;
  image: string;
  isMilky?: boolean;      // Süt ayarı yapılabilir mi?
  isComingSoon?: boolean; // Henüz siparişe açık değil mi?
}
