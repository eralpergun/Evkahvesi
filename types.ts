
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

export type CoffeeType = 'Latte Macchiato' | 'Americano' | 'Espresso' | 'Caramel Macchiato' | 'Iced Latte Macchiato' | 'Iced Caramel Macchiato' | 'Cafe Crema';

export interface Order {
  id: string;
  guestName: string;
  coffeeType: CoffeeType;
  size: CoffeeSize;
  percentage: number;
  timestamp: number;
  status: 'PENDING' | 'PREPARING' | 'COMPLETED';
}

export interface CoffeeOption {
  id: CoffeeType;
  name: string;
  description: string;
  image: string;
}
