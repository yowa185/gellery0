import { initializeCart } from './cart';

export function initializeHeader(): void {
  const header = document.querySelector<HTMLElement>('.header');
  if (!header) return;
  header.querySelector('.header-cta')?.remove();
  const actions = document.createElement('div');
  actions.className = 'header-actions';
  actions.innerHTML = `<a class="action-button sell-button" href="/sell.html">SELL</a><button class="action-button profile-button" type="button"><span>○</span> PROFILE</button>`;
  header.append(actions);
  createProfilePanel(actions.querySelector<HTMLButtonElement>('.profile-button')!);
  initializeCart(actions);
}

function createProfilePanel(trigger: HTMLButtonElement): void {
  const panel = document.createElement('aside');
  panel.className = 'profile-panel';
  panel.innerHTML = `<div class="panel-head"><p>MY PAGE</p><button class="panel-close" aria-label="閉じる">×</button></div><div class="profile-user"><span>G0</span><div><b>GALLERY 0 VISITOR</b><small>作品を買う、作品を売る。</small></div></div><nav class="profile-links"><a href="/sell.html">作品を出品する <i>→</i></a><a href="/collection.html">リクエスト履歴 <i>→</i></a></nav><p class="profile-note">ログインなしで、すべての機能をご利用いただけます。</p>`;
  document.body.append(panel);
  const backdrop = document.createElement('button');
  backdrop.className = 'profile-backdrop'; backdrop.type = 'button'; backdrop.setAttribute('aria-label', '閉じる');
  document.body.append(backdrop);
  const close = () => document.body.classList.remove('profile-open');
  trigger.addEventListener('click', () => document.body.classList.add('profile-open'));
  panel.querySelector('.panel-close')?.addEventListener('click', close);
  backdrop.addEventListener('click', close);
}
