import { initializeCart } from './cart';
import { getMyListings, formatPrice, type Artwork } from './artworks';
import { getMyPurchases, type Purchase } from './purchases';
import { escapeHtml } from '../lib/escapeHtml';

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
  const safeImage = escapeHtml(image);
  const safeTitle = escapeHtml(title);
  const safeMeta = escapeHtml(meta);
  const safeStatus = escapeHtml(status);
  return `<a class="cart-item" href="/artwork.html?id=${id}"><img src="${safeImage}" alt="${safeTitle}"><div><p>${safeTitle}</p><small>${safeMeta}</small></div><span class="cart-item-status">${safeStatus}</span></a>`;
}

function emptyState(message: string): string {
  return `<div class="cart-empty"><span>○</span><p>${message}</p></div>`;
}

function renderSoldList(items: Artwork[]): string {
  if (!items.length) return emptyState('出品した作品はまだありません。');
  return items.map((item) => listRow(item.id, item.image, item.title, formatPrice(item), item.status)).join('');
}

function renderBoughtList(items: Purchase[]): string {
  if (!items.length) return emptyState('購入をリクエストした作品はまだありません。');
  return items.map((item) => listRow(item.artworkId, item.image, item.title, `${item.artist} · ¥ ${item.price.toLocaleString()}`, item.status)).join('');
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

  async function render(): Promise<void> {
    try {
      const [sold, bought] = await Promise.all([getMyListings(), getMyPurchases()]);
      panel.querySelector('.profile-sold')!.innerHTML = renderSoldList(sold);
      panel.querySelector('.profile-bought')!.innerHTML = renderBoughtList(bought);
    } catch (error) {
      console.error(error);
      const message = emptyState('読み込めませんでした。バックエンドサーバーをご確認ください。');
      panel.querySelector('.profile-sold')!.innerHTML = message;
      panel.querySelector('.profile-bought')!.innerHTML = '';
    }
  }

  const open = () => { void render(); document.body.classList.add('profile-open'); };
  const close = () => document.body.classList.remove('profile-open');
  trigger.addEventListener('click', open);
  panel.querySelector('.panel-close')?.addEventListener('click', close);
  backdrop.addEventListener('click', close);
}
