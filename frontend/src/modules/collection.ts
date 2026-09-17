import { getAllArtworks, formatPrice, type Artwork } from './artworks';

function cardHtml(artwork: Artwork): string {
  const priceLabel = artwork.status === 'SOLD'
    ? '<b class="sold">SOLD</b>'
    : `<b>${formatPrice(artwork)}</b>`;
  const meta = artwork.productionYear ? `${artwork.artist} / ${artwork.productionYear}` : artwork.artist;
  return `<article data-category="${artwork.category}"><a href="/artwork.html?id=${artwork.id}"><img src="${artwork.image}" alt="${artwork.title}" /></a><div><h2>${artwork.title}</h2><p>${meta}</p>${priceLabel}</div></article>`;
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

export function renderCollection(): void {
  const grid = document.querySelector<HTMLElement>('.work-grid');
  if (!grid) return;
  grid.innerHTML = getAllArtworks().map(cardHtml).join('');
  attachFilters();
}
