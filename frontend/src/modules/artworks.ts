import { api } from '../lib/api';

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
  shipping?: string;
  own?: boolean;
};

export type ArtworkInput = {
  title: string;
  artistName: string;
  description?: string;
  price: number;
  width?: number;
  height?: number;
  material?: string;
  productionYear?: number;
  category: string;
  imageUrl: string;
  shippingInfo?: string;
};

type ArtworkSummaryResponse = {
  id: number;
  title: string;
  artistName: string;
  price: number;
  imageUrl: string;
  category: string;
  status: ArtworkStatus;
  productionYear: number | null;
};

type ArtworkDetailResponse = ArtworkSummaryResponse & {
  description: string | null;
  width: number | null;
  height: number | null;
  material: string | null;
  shippingInfo: string | null;
  own: boolean;
};

function fromSummary(dto: ArtworkSummaryResponse): Artwork {
  return {
    id: String(dto.id),
    title: dto.title,
    artist: dto.artistName,
    price: dto.price,
    image: dto.imageUrl,
    category: dto.category,
    status: dto.status,
    productionYear: dto.productionYear ?? undefined,
  };
}

function fromDetail(dto: ArtworkDetailResponse): Artwork {
  return {
    ...fromSummary(dto),
    description: dto.description ?? undefined,
    width: dto.width ?? undefined,
    height: dto.height ?? undefined,
    material: dto.material ?? undefined,
    shipping: dto.shippingInfo ?? undefined,
    own: dto.own,
  };
}

export async function getAllArtworks(category?: string): Promise<Artwork[]> {
  const query = category && category !== 'all' ? `?category=${encodeURIComponent(category)}` : '';
  const artworks = await api.get<ArtworkSummaryResponse[]>(`/artworks${query}`);
  return artworks.map(fromSummary);
}

export async function getMyListings(): Promise<Artwork[]> {
  const artworks = await api.get<ArtworkSummaryResponse[]>('/artworks/mine');
  return artworks.map(fromSummary);
}

export async function getArtworkById(id: string): Promise<Artwork | undefined> {
  try {
    const dto = await api.get<ArtworkDetailResponse>(`/artworks/${id}`);
    return fromDetail(dto);
  } catch {
    return undefined;
  }
}

export async function createArtwork(input: ArtworkInput): Promise<Artwork> {
  const dto = await api.post<ArtworkDetailResponse>('/artworks', input);
  return fromDetail(dto);
}

export async function updateArtwork(id: string, input: ArtworkInput): Promise<Artwork> {
  const dto = await api.put<ArtworkDetailResponse>(`/artworks/${id}`, input);
  return fromDetail(dto);
}

export function formatPrice(artwork: Pick<Artwork, 'price' | 'status'>): string {
  return artwork.status === 'SOLD' ? 'SOLD' : `¥ ${artwork.price.toLocaleString()}`;
}
