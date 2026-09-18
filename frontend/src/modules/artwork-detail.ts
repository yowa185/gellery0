import { getArtworkById, deleteArtwork, formatPrice } from './artworks';
import { ApiError } from '../lib/api';
import { addToCart } from './cart';
import { showToast } from './toast';
import { escapeHtml } from '../lib/escapeHtml';

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
  if (artistLink) artistLink.innerHTML = `${escapeHtml(artwork.artist)} <span>↗</span>`;

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
      addDeleteButton(button, artwork.id);
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

function addDeleteButton(editButton: HTMLButtonElement, artworkId: string): void {
  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.className = 'button button-danger';
  deleteButton.innerHTML = '削除する  <b>×</b>';
  editButton.insertAdjacentElement('afterend', deleteButton);

  deleteButton.addEventListener('click', () => {
    void handleDelete(artworkId, deleteButton);
  });
}

async function handleDelete(artworkId: string, deleteButton: HTMLButtonElement): Promise<void> {
  if (!window.confirm('この作品を削除しますか?この操作は取り消せません。')) return;

  deleteButton.disabled = true;
  try {
    await deleteArtwork(artworkId);
    showToast('作品を削除しました。');
    location.href = '/collection.html';
  } catch (error) {
    if (error instanceof ApiError && error.status === 409) {
      showToast('購入リクエストが入っている作品は削除できません。');
    } else {
      console.error(error);
      showToast('削除に失敗しました。バックエンドサーバーをご確認ください。');
    }
    deleteButton.disabled = false;
  }
}
