import { getAllArtworks, formatPrice, type Artwork } from './artworks';
import { showToast } from './toast';

function cardHtml(artwork: Artwork): string {
  const priceLabel = artwork.status === 'SOLD'
    ? '<b class="sold">SOLD</b>'
    : `<b>${formatPrice(artwork)}</b>`;
  const meta = artwork.productionYear ? `${artwork.artist} / ${artwork.productionYear}` : artwork.artist;
  const media = artwork.category === 'VIDEO'
    ? `<video src="${artwork.image}" muted loop autoplay playsinline></video>`
    : `<img src="${artwork.image}" alt="${artwork.title}" />`;
  return `<article data-category="${artwork.category}"><a href="/artwork.html?id=${artwork.id}">${media}</a><div><h2>${artwork.title}</h2><p>${meta}</p>${priceLabel}</div></article>`;
}

function attachFilters(): void {
  const buttons = document.querySelectorAll<HTMLButtonElement>('[data-filter]');
  const cards = document.querySelectorAll<HTMLElement>('[data-category]');
  buttons.forEach((button) => button.addEventListener('click', () => {
    const selected = button.dataset.filter;
    buttons.forEach((item) => item.classList.toggle('is-active', item === button));
    cards.forEach((card) => { card.hidden = selected !== 'all' && card.dataset.category !== selected; });
  }));
}

export async function renderCollection(): Promise<void> {
  const grid = document.querySelector<HTMLElement>('.work-grid');
  if (!grid) return;
  try {
    const artworks = await getAllArtworks();
    grid.innerHTML = artworks.map(cardHtml).join('');
    attachFilters();
  } catch (error) {
    console.error(error);
    showToast('作品を読み込めませんでした。バックエンドサーバーをご確認ください。');
  }
}
