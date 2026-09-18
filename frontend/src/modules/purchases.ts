import { api } from '../lib/api';

export type Purchase = {
  id: string;
  artworkId: string;
  title: string;
  artist: string;
  image: string;
  price: number;
  status: string;
};

type PurchaseSummaryResponse = {
  id: number;
  artworkId: number;
  title: string;
  artistName: string;
  imageUrl: string;
  price: number;
  status: string;
};

function fromResponse(dto: PurchaseSummaryResponse): Purchase {
  return {
    id: String(dto.id),
    artworkId: String(dto.artworkId),
    title: dto.title,
    artist: dto.artistName,
    image: dto.imageUrl,
    price: dto.price,
    status: dto.status,
  };
}

export async function getMyPurchases(): Promise<Purchase[]> {
  const purchases = await api.get<PurchaseSummaryResponse[]>('/purchases/mine');
  return purchases.map(fromResponse);
}

export async function requestPurchase(artworkId: string): Promise<Purchase> {
  const dto = await api.post<PurchaseSummaryResponse>('/purchases', { artworkId: Number(artworkId) });
  return fromResponse(dto);
}
