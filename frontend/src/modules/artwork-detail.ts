import { getArtworkById, formatPrice } from './artworks';
import { addToCart } from './cart';
import { showToast } from './toast';

export async function renderArtworkDetail(): Promise<void> {
  const id = new URLSearchParams(location.search).get('id');
  if (!id) return;

  const artwork = await getArtworkById(id);
  if (!artwork) {
    showToast('作品を読み込めませんでした。バックエンドサーバーをご確認ください。');
    return;
  }

  document.title = `${artwork.title} — GALLERY 0`;

  const mediaContainer = document.querySelector<HTMLElement>('.artwork-image');
  const currentMedia = mediaContainer?.querySelector('img, video');
  if (mediaContainer && currentMedia) {
    if (artwork.category === 'VIDEO') {
      const video = document.createElement('video');
      video.src = artwork.image;
      video.controls = true;
      currentMedia.replaceWith(video);
    } else if (currentMedia instanceof HTMLImageElement) {
      currentMedia.src = artwork.image;
      currentMedia.alt = `${artwork.title}、${artwork.artist}の作品`;
    } else {
      const image = document.createElement('img');
      image.src = artwork.image;
      image.alt = `${artwork.title}、${artwork.artist}の作品`;
      currentMedia.replaceWith(image);
    }
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
    const [year, material, size, shipping] = dl.querySelectorAll('dd');
    if (year) year.textContent = artwork.productionYear ? String(artwork.productionYear) : '—';
    if (material) material.textContent = artwork.material ?? '—';
    if (size) size.textContent = artwork.width && artwork.height ? `${artwork.width} × ${artwork.height} cm` : '—';
    if (shipping) shipping.textContent = artwork.shipping ?? '—';
  }

  const button = document.querySelector<HTMLButtonElement>('.purchase-button');
  if (button) {
    if (artwork.own) {
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
