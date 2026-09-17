import './components.css';
import { addToCart } from './modules/cart';
import { initializeHeader } from './modules/header';
import { initializeSellForm } from './modules/sell-form';
import type { ArtworkCategory, CartItem } from './modules/types';

const blueRoom: CartItem = {
  id: 'blue-room',
  title: 'Blue Room',
  artist: '김다혜',
  price: '₩ 800,000',
  image: 'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=400&q=80',
};

function initializeArtworkFilters(): void {
  const buttons = document.querySelectorAll<HTMLButtonElement>('[data-filter]');
  const cards = document.querySelectorAll<HTMLElement>('[data-category]');
  buttons.forEach((button) => button.addEventListener('click', () => {
    const selected = button.dataset.filter as ArtworkCategory;
    buttons.forEach((item) => item.classList.toggle('is-active', item === button));
    cards.forEach((card) => { card.hidden = selected !== 'all' && card.dataset.category !== selected; });
  }));
}

function initializeArtworkDetail(): void {
  const button = document.querySelector<HTMLButtonElement>('.purchase-button');
  if (!button) return;
  button.textContent = 'カートに入れる  →';
  button.addEventListener('click', () => addToCart(blueRoom));
}

initializeHeader();
initializeArtworkFilters();
initializeArtworkDetail();
initializeSellForm();
