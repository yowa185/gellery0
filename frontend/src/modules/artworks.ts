import { LISTING_KEY } from './sell-form';

export type ArtworkStatus = 'ON_SALE' | 'RESERVED' | 'SOLD';

export type Artwork = {
  id: string;
  title: string;
  artist: string;
  price: number;
  image: string;
  category: string;
  status: ArtworkStatus;
  description?: string;
  productionYear?: number;
  material?: string;
  width?: number;
  height?: number;
  createdAt: string;
};

const STATIC_ARTWORKS: Artwork[] = [
  {
    id: 'blue-room',
    title: 'Blue Room',
    artist: 'キム・ダヘ',
    price: 800000,
    image: 'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=1400&q=85',
    category: 'PAINTING',
    status: 'ON_SALE',
    productionYear: 2024,
    material: 'キャンバスに油彩',
    width: 53,
    height: 45.5,
    createdAt: '2024-01-04T00:00:00.000Z',
  },
  {
    id: 'soft-geometry',
    title: 'Soft Geometry',
    artist: 'パク・ソユン',
    price: 1200000,
    image: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1400&q=85',
    category: 'OBJECT',
    status: 'ON_SALE',
    productionYear: 2024,
    createdAt: '2024-01-03T00:00:00.000Z',
  },
  {
    id: 'a-quiet-day',
    title: 'A Quiet Day',
    artist: 'イ・ミンジュ',
    price: 0,
    image: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&w=1400&q=85',
    category: 'PHOTOGRAPHY',
    status: 'SOLD',
    productionYear: 2023,
    createdAt: '2024-01-02T00:00:00.000Z',
  },
  {
    id: 'light-in-between',
    title: 'Light in Between',
    artist: 'ハン・ジユ',
    price: 950000,
    image: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&w=1400&q=85',
    category: 'PAINTING',
    status: 'ON_SALE',
    productionYear: 2024,
    createdAt: '2024-01-01T00:00:00.000Z',
  },
];

type StoredListing = {
  id: string;
  title: string;
  artist?: string;
  price: string;
  category: string;
  productionYear?: string;
  material?: string;
  width?: string;
  height?: string;
  imageUrl: string;
  description?: string;
  status: ArtworkStatus;
  createdAt?: string;
};

function getStoredListings(): Artwork[] {
  const raw: StoredListing[] = JSON.parse(localStorage.getItem(LISTING_KEY) ?? '[]');
  return raw.map((item) => ({
    id: item.id,
    title: item.title,
    artist: item.artist || 'GALLERY 0 VISITOR',
    price: Number(item.price) || 0,
    image: item.imageUrl,
    category: item.category,
    status: item.status,
    description: item.description,
    productionYear: item.productionYear ? Number(item.productionYear) : undefined,
    material: item.material,
    width: item.width ? Number(item.width) : undefined,
    height: item.height ? Number(item.height) : undefined,
    createdAt: item.createdAt ?? new Date(0).toISOString(),
  }));
}

export function getAllArtworks(): Artwork[] {
  return [...STATIC_ARTWORKS, ...getStoredListings()]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getArtworkById(id: string): Artwork | undefined {
  return getAllArtworks().find((artwork) => artwork.id === id);
}

export function isOwnListing(id: string): boolean {
  const raw: StoredListing[] = JSON.parse(localStorage.getItem(LISTING_KEY) ?? '[]');
  return raw.some((item) => item.id === id);
}

export function formatPrice(artwork: Pick<Artwork, 'price' | 'status'>): string {
  return artwork.status === 'SOLD' ? 'SOLD' : `¥ ${artwork.price.toLocaleString()}`;
}
