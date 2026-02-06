type Product = {
  id: number
  name: string
  category: string
  price: number
  description: string
  imgUrl: string
}

export const products: Product[] = [
  {
    id: 1,
    name: 'Retatrutide 10mg',
    category: 'vial',
    price: 90,
    description: 'Research-grade Retatrutide peptide, 10mg per vial.',
    imgUrl:
      'https://kltckzffzhprvaaytscz.supabase.co/storage/v1/object/public/assets/reta_10mg.webp',
  },
  {
    id: 2,
    name: 'Retatrutide 20mg',
    category: 'vial',
    price: 100,
    description: 'Research-grade Retatrutide peptide, 20mg per vial.',
    imgUrl:
      'https://kltckzffzhprvaaytscz.supabase.co/storage/v1/object/public/assets/reta_20mg.webp',
  },
  {
    id: 3,
    name: 'Retatrutide 30mg',
    category: 'vial',
    price: 110,
    description: 'Higher dosage Retatrutide, ideal for advanced research.',
    imgUrl:
      'https://kltckzffzhprvaaytscz.supabase.co/storage/v1/object/public/assets/reta_30mg.webp',
  },
  {
    id: 4,
    name: 'Ghk-Cu 50mg',
    category: 'vial',
    price: 50,
    description: 'Copper peptide GHK-Cu, 50mg per vial for laboratory use.',
    imgUrl:
      'https://kltckzffzhprvaaytscz.supabase.co/storage/v1/object/public/assets/ghk_50mg.webp',
  },
  {
    id: 5,
    name: 'Ghk-Cu 100mg',
    category: 'vial',
    price: 80,
    description: 'GHK-Cu high dose, research formula, 100mg per vial.',
    imgUrl:
      'https://kltckzffzhprvaaytscz.supabase.co/storage/v1/object/public/assets/ghk_100mg.webp',
  },
  {
    id: 6,
    name: 'Bacteriostatic Water 3ml',
    category: 'vial',
    price: 30,
    description:
      '3ml vial of bacteriostatic water, suitable for peptide reconstitution.',
    imgUrl:
      'https://kltckzffzhprvaaytscz.supabase.co/storage/v1/object/public/assets/water_3ml.webp',
  },
]
