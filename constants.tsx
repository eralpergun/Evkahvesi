
import { CoffeeOption, CoffeeSize } from './types';

export const COFFEE_OPTIONS: CoffeeOption[] = [
  {
    id: 'Latte Macchiato',
    name: 'Latte Macchiato',
    description: 'Sıcak sütün üzerine eklenen yoğun espresso katmanı.',
    image: 'https://images.unsplash.com/photo-1599398054066-846f28917f38?auto=format&fit=crop&q=80&w=600',
    isMilky: true
  },
  {
    id: 'Caffe Latte',
    name: 'Caffe Latte',
    description: 'Espresso ve sıcak sütün pürüzsüz uyumu, hafif köpük katmanıyla.',
    image: 'https://images.unsplash.com/photo-1534040385115-33dcb3acba5b?auto=format&fit=crop&q=80&w=600',
    isMilky: true
  },
  {
    id: 'Flat White',
    name: 'Flat White',
    description: 'İpeksi mikro köpük süt ile sunulan yoğun espresso deneyimi.',
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&q=80&w=600',
    isMilky: true
  },
  {
    id: 'Cafe Crema',
    name: 'Cafe Crema',
    description: 'Espresso bazlı, üzerinde ipeksi bir krema tabakası bulunan uzun içimli klasik.',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=600',
    isMilky: false
  },
  {
    id: 'Americano',
    name: 'Americano',
    description: 'Sıcak su ile yumuşatılmış yoğun espresso çekimleri.',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600&auto=format&fit=crop',
    isMilky: false
  },
  {
    id: 'Espresso',
    name: 'Espresso',
    description: 'Zengin aromalı, konsantre ve güçlü bir kahve deneyimi.',
    image: 'https://images.unsplash.com/photo-1610889556283-1f1997327704?auto=format&fit=crop&q=80&w=600',
    isMilky: false
  },
  {
    id: 'Ristretto',
    name: 'Ristretto',
    description: 'Espressonun en yoğun, en aromatik ve kısa çekim hali.',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600',
    isMilky: false
  },
  {
    id: 'Espresso Lungo',
    name: 'Espresso Lungo',
    description: 'Tadı ve aroması uzun süre damakta kalan uzun çekim espresso.',
    image: 'https://images.unsplash.com/photo-1518832553480-cd0e625ed3e6?auto=format&fit=crop&q=80&w=600',
    isMilky: false
  },
  {
    id: 'Caramel Macchiato',
    name: 'Karamel Macchiato',
    description: 'Vanilya şurubu, süt ve espressonun karamel sosuyla mükemmel uyumu.',
    image: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&q=80&w=600',
    isMilky: true
  },
  {
    id: 'Iced Latte Macchiato',
    name: 'Buzlu Latte Macchiato',
    description: 'Soğuk süt, buz ve yoğun espressonun ferahlatıcı buluşması.',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=600&auto=format&fit=crop',
    isMilky: true
  },
  {
    id: 'Iced Caramel Macchiato',
    name: 'Buzlu Karamel Macchiato',
    description: 'Soğuk süt, karamel sosu ve espressonun buzlu eşsiz dengesi.',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=600&auto=format&fit=crop',
    isMilky: true
  }
];

export const SIZES: CoffeeSize[] = [CoffeeSize.SMALL, CoffeeSize.MEDIUM, CoffeeSize.LARGE];

export const SIZE_LABELS: Record<CoffeeSize, string> = {
  [CoffeeSize.SMALL]: 'Küçük',
  [CoffeeSize.MEDIUM]: 'Orta',
  [CoffeeSize.LARGE]: 'Büyük'
};
