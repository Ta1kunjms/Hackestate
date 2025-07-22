export interface Property {
  id: number;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
}

export const mockProperties: Property[] = [
  {
    id: 1,
    title: 'Modern Family Home',
    price: 500000,
    location: 'San Francisco',
    bedrooms: 3,
    bathrooms: 2,
  },
  {
    id: 2,
    title: 'Luxury Villa',
    price: 1200000,
    location: 'Los Angeles',
    bedrooms: 5,
    bathrooms: 4,
  },
  {
    id: 3,
    title: 'Cozy Cottage',
    price: 350000,
    location: 'Portland',
    bedrooms: 2,
    bathrooms: 1,
  },
  {
    id: 4,
    title: 'Downtown Apartment',
    price: 750000,
    location: 'New York',
    bedrooms: 2,
    bathrooms: 2,
  },
  {
    id: 5,
    title: 'Suburban House',
    price: 600000,
    location: 'Austin',
    bedrooms: 4,
    bathrooms: 3,
  },
]; 