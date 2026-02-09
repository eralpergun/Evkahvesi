
import { CoffeeOption, CoffeeSize } from './types';

export const COFFEE_OPTIONS: CoffeeOption[] = [
  {
    id: 'Latte Macchiato',
    name: 'Latte Macchiato',
    description: 'Sıcak sütün üzerine eklenen yoğun espresso katmanı.',
    image: 'https://images.unsplash.com/photo-1599398054066-846f28917f38?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'Americano',
    name: 'Americano',
    description: 'Sıcak su ile yumuşatılmış yoğun espresso çekimleri.',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'Espresso',
    name: 'Espresso',
    description: 'Zengin aromalı, konsantre ve güçlü bir kahve deneyimi.',
    image: 'https://images.unsplash.com/photo-1541173103231-c967538fe7d2?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'Caramel Macchiato',
    name: 'Karamel Macchiato',
    description: 'Vanilya şurubu, süt ve espressonun karamel sosuyla mükemmel uyumu.',
    image: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'Iced Latte Macchiato',
    name: 'Buzlu Latte Macchiato',
    description: 'Soğuk süt, buz ve yoğun espressonun ferahlatıcı buluşması.',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'Iced Caramel Macchiato',
    name: 'Buzlu Karamel Macchiato',
    description: 'Soğuk süt, karamel sosu ve espressonun buzlu eşsiz dengesi.',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=600&auto=format&fit=crop'
  }
];

export const SIZES: CoffeeSize[] = [CoffeeSize.SMALL, CoffeeSize.MEDIUM, CoffeeSize.LARGE];

export const SIZE_LABELS: Record<CoffeeSize, string> = {
  [CoffeeSize.SMALL]: 'Küçük',
  [CoffeeSize.MEDIUM]: 'Orta',
  [CoffeeSize.LARGE]: 'Büyük'
};
