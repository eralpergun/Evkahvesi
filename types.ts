
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

export type CoffeeType = 'Latte Macchiato' | 'Americano' | 'Espresso' | 'Caramel Macchiato' | 'Iced Latte Macchiato' | 'Iced Caramel Macchiato' | 'Cafe Crema' | 'Chefs Special';

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
