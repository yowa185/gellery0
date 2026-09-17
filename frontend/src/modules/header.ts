import { initializeCart, REQUEST_KEY } from './cart';
import { LISTING_KEY } from './sell-form';
import { formatPrice, type ArtworkStatus } from './artworks';

type SoldListing = { id: string; title: string; price: string; imageUrl: string; status: ArtworkStatus; createdAt?: string };
type BoughtRequest = { id: string; title: string; artist: string; price: string; image: string; createdAt?: string };

function sortByRecency<T extends { createdAt?: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime());
}

export function initializeHeader(): void {
  const header = document.querySelector<HTMLElement>('.header');
  if (!header) return;
  header.querySelector('.header-cta')?.remove();
  const actions = document.createElement('div');
  actions.className = 'header-actions';
  actions.innerHTML = `<button class="action-button profile-button" type="button"><span>○</span> PROFILE</button><a class="action-button sell-button" href="/sell.html">SELL</a>`;
  header.append(actions);
  createProfilePanel(actions.querySelector<HTMLButtonElement>('.profile-button')!);
  initializeCart(actions);
}

function listRow(id: string, image: string, title: string, meta: string, status: string): string {
  return `<a class="cart-item" href="/artwork.html?id=${id}"><img src="${image}" alt="${title}"><div><p>${title}</p><small>${meta}</small></div><span class="cart-item-status">${status}</span></a>`;
}

function emptyState(message: string): string {
  return `<div class="cart-empty"><span>○</span><p>${message}</p></div>`;
}

function renderSoldList(items: SoldListing[]): string {
  if (!items.length) return emptyState('出品した作品はまだありません。');
  return sortByRecency(items).map((item) => listRow(item.id, item.imageUrl, item.title, formatPrice({ price: Number(item.price), status: item.status }), item.status)).join('');
}

function renderBoughtList(items: BoughtRequest[]): string {
  if (!items.length) return emptyState('購入をリクエストした作品はまだありません。');
  return sortByRecency(items).map((item) => listRow(item.id, item.image, item.title, `${item.artist} · ${item.price}`, 'REQUESTED')).join('');
}

function createProfilePanel(trigger: HTMLButtonElement): void {
  const panel = document.createElement('aside');
  panel.className = 'profile-panel';
  panel.innerHTML = `<div class="panel-head"><p>MY PAGE</p><button class="panel-close" aria-label="閉じる">×</button></div><div class="profile-user"><span>G0</span><div><b>GALLERY 0 VISITOR</b><small>作品を買う、作品を売る。</small></div></div><section class="profile-section"><h3>販売した作品</h3><div class="profile-sold"></div></section><section class="profile-section"><h3>購入をリクエストした作品</h3><div class="profile-bought"></div></section><p class="profile-note">ログインなしで、すべての機能をご利用いただけます。</p>`;
  document.body.append(panel);

  const backdrop = document.createElement('button');
  backdrop.className = 'profile-backdrop';
  backdrop.type = 'button';
  backdrop.setAttribute('aria-label', '閉じる');
  document.body.append(backdrop);

  function render(): void {
    const sold: SoldListing[] = JSON.parse(localStorage.getItem(LISTING_KEY) ?? '[]');
    const bought: BoughtRequest[] = JSON.parse(localStorage.getItem(REQUEST_KEY) ?? '[]');
    panel.querySelector('.profile-sold')!.innerHTML = renderSoldList(sold);
    panel.querySelector('.profile-bought')!.innerHTML = renderBoughtList(bought);
  }

  const open = () => { render(); document.body.classList.add('profile-open'); };
  const close = () => document.body.classList.remove('profile-open');
  trigger.addEventListener('click', open);
  panel.querySelector('.panel-close')?.addEventListener('click', close);
  backdrop.addEventListener('click', close);
}
