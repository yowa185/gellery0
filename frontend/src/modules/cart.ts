import type { CartItem } from './types';
import { showToast } from './toast';

const CART_KEY = 'gallery0-cart';
const REQUEST_KEY = 'gallery0-requests';

const getCart = (): CartItem[] => JSON.parse(localStorage.getItem(CART_KEY) ?? '[]');
const saveCart = (items: CartItem[]): void => localStorage.setItem(CART_KEY, JSON.stringify(items));

function closeCart(): void { document.body.classList.remove('cart-open'); }

function renderCart(): void {
  const items = getCart();
  document.querySelectorAll<HTMLElement>('[data-cart-count]').forEach((element) => element.textContent = String(items.length));
  const content = document.querySelector<HTMLElement>('.cart-contents');
  if (!content) return;
  content.innerHTML = items.length
    ? `<div class="cart-items">${items.map((item) => `<article class="cart-item"><img src="${item.image}" alt="${item.title}"><div><p>${item.title}</p><small>${item.artist} · ${item.price}</small></div><button class="cart-remove" data-id="${item.id}" aria-label="削除">×</button></article>`).join('')}</div><button class="cart-request">選択した作品のリクエストを送信 <span>→</span></button><p class="cart-note">リクエスト確認後、購入手続きについてご案内します。</p>`
    : `<div class="cart-empty"><span>○</span><p>カートは空です。</p><small>気になる作品を追加してみてください。</small></div>`;
  content.querySelectorAll<HTMLButtonElement>('.cart-remove').forEach((button) => {
    button.addEventListener('click', () => { saveCart(getCart().filter((item) => item.id !== button.dataset.id)); renderCart(); });
  });
  content.querySelector<HTMLButtonElement>('.cart-request')?.addEventListener('click', () => {
    const itemsToRequest = getCart();
    if (!itemsToRequest.length) return;
    localStorage.setItem(REQUEST_KEY, JSON.stringify(itemsToRequest));
    saveCart([]); renderCart(); closeCart();
    showToast(`${itemsToRequest.length}点の購入リクエストを送信しました。`);
  });
}

export function initializeCart(actions: HTMLElement): void {
  const button = document.createElement('button');
  button.className = 'action-button cart-button'; button.type = 'button';
  button.innerHTML = 'CART <span data-cart-count>0</span>';
  actions.append(button);
  const panel = document.createElement('aside');
  panel.className = 'cart-panel';
  panel.innerHTML = `<div class="panel-head"><p>カート <span data-cart-count>0</span></p><button class="panel-close" aria-label="閉じる">×</button></div><div class="cart-contents"></div>`;
  document.body.append(panel);
  const backdrop = document.createElement('button');
  backdrop.className = 'cart-backdrop'; backdrop.type = 'button'; backdrop.setAttribute('aria-label', '閉じる');
  document.body.append(backdrop);
  button.addEventListener('click', () => document.body.classList.add('cart-open'));
  panel.querySelector('.panel-close')?.addEventListener('click', closeCart);
  backdrop.addEventListener('click', closeCart);
  renderCart();
}

export function addToCart(item: CartItem): void {
  if (getCart().some((cartItem) => cartItem.id === item.id)) showToast('この作品はすでにカートに入っています。');
  else { saveCart([...getCart(), item]); showToast('作品をカートに追加しました。'); }
  renderCart();
}
