import { showToast } from './toast';

const LISTING_KEY = 'gallery0-listings';

export function initializeSellForm(): void {
  const form = document.querySelector<HTMLFormElement>('.sell-form');
  if (!form) return;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const listings = JSON.parse(localStorage.getItem(LISTING_KEY) ?? '[]');
    listings.push({ id: crypto.randomUUID(), ...Object.fromEntries(new FormData(form).entries()), status: 'ON_SALE' });
    localStorage.setItem(LISTING_KEY, JSON.stringify(listings));
    form.reset();
    document.querySelector('.sell-success')?.classList.add('is-visible');
    showToast('作品を登録しました。');
  });
}
