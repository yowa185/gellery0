import { getArtworkById, formatPrice, isOwnListing } from './artworks';
import { addToCart } from './cart';

export function renderArtworkDetail(): void {
  const id = new URLSearchParams(location.search).get('id');
  const artwork = id ? getArtworkById(id) : undefined;
  if (!artwork) return;

  document.title = `${artwork.title} — GALLERY 0`;

  const image = document.querySelector<HTMLImageElement>('.artwork-image img');
  if (image) {
    image.src = artwork.image;
    image.alt = `${artwork.title}、${artwork.artist}の作品`;
  }

  const heading = document.querySelector('.artwork-info h1');
  if (heading) heading.textContent = artwork.title;

  const artistLink = document.querySelector('.artist-link');
  if (artistLink) artistLink.innerHTML = `${artwork.artist} <span>↗</span>`;

  const price = document.querySelector('.price');
  if (price) price.innerHTML = `${formatPrice(artwork)} <small>税込</small>`;

  const description = document.querySelector('.artwork-description');
  if (description) description.textContent = artwork.description ?? '';

  const dl = document.querySelector('dl');
  if (dl) {
    const [year, material, size] = dl.querySelectorAll('dd');
    if (year) year.textContent = artwork.productionYear ? String(artwork.productionYear) : '—';
    if (material) material.textContent = artwork.material ?? '—';
    if (size) size.textContent = artwork.width && artwork.height ? `${artwork.width} × ${artwork.height} cm` : '—';
  }

  const button = document.querySelector<HTMLButtonElement>('.purchase-button');
  if (button) {
    if (isOwnListing(artwork.id)) {
      button.textContent = '編集する  →';
      button.addEventListener('click', () => { location.href = `/sell.html?id=${artwork.id}`; });
    } else if (artwork.status !== 'ON_SALE') {
      button.style.display = 'none';
    } else {
      button.textContent = 'カートに入れる  →';
      button.addEventListener('click', () => addToCart({
        id: artwork.id,
        title: artwork.title,
        artist: artwork.artist,
        price: formatPrice(artwork),
        image: artwork.image,
      }));
    }
  }
}
