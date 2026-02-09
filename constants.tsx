
import React from 'react';
import { CoffeeOption, CoffeeSize } from './types';

export const COFFEE_OPTIONS: CoffeeOption[] = [
  {
    id: 'Latte Macchiato',
    name: 'Latte Macchiato',
    description: 'Steamed milk stained with a shot of espresso.',
    image: 'https://images.unsplash.com/photo-1599398054066-846f28917f38?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'Americano',
    name: 'Americano',
    description: 'Espresso shots topped with hot water.',
    image: 'https://images.unsplash.com/photo-1551033406-611cf9a28f67?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'Espresso',
    name: 'Espresso',
    description: 'Intense and concentrated coffee shot.',
    image: 'https://images.unsplash.com/photo-1510707577719-aeef47895246?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'Caramel Macchiato',
    name: 'Caramel Macchiato',
    description: 'Freshly steamed milk with vanilla-flavored syrup marked with espresso and topped with a caramel drizzle.',
    image: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&q=80&w=400'
  }
];

export const SIZES: CoffeeSize[] = [CoffeeSize.SMALL, CoffeeSize.MEDIUM, CoffeeSize.LARGE];
