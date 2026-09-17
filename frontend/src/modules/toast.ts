export function showToast(message: string): void {
  let element = document.querySelector<HTMLElement>('.toast');
  if (!element) {
    element = document.createElement('div');
    element.className = 'toast';
    element.setAttribute('role', 'status');
    document.body.append(element);
  }
  element.textContent = message;
  element.classList.add('is-visible');
  window.setTimeout(() => element?.classList.remove('is-visible'), 2800);
}
