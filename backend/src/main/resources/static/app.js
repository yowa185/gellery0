const filterButton = document.querySelector('#filterButton');
const filterPanel = document.querySelector('#filterPanel');
const dialog = document.querySelector('#artDialog');
const toast = document.querySelector('#toast');

filterButton.addEventListener('click', () => filterPanel.classList.toggle('open'));
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-filter]').forEach(item => item.classList.remove('active'));
  button.classList.add('active');
  document.querySelectorAll('.art-card').forEach(card => {
    card.style.display = button.dataset.filter === 'all' || card.dataset.category === button.dataset.filter ? '' : 'none';
  });
}));
document.querySelectorAll('.art-card').forEach(card => card.querySelector('.art-image').addEventListener('click', () => {
  const {title, artist, price, image} = card.dataset;
  dialog.querySelector('.modal-image img').src = image;
  dialog.querySelector('.modal-image img').alt = `${title} 작품`;
  dialog.querySelector('.modal-copy h2').textContent = title;
  dialog.querySelector('.artist-name').textContent = `${artist} · 2024`;
  dialog.querySelector('.modal-price').textContent = price;
  dialog.querySelector('.purchase-button').style.display = price === 'SOLD' ? 'none' : 'block';
  dialog.showModal();
}));
document.querySelector('.modal-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
document.querySelector('.purchase-button').addEventListener('click', () => { dialog.close(); toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 3200); });
document.querySelector('.announcement button').addEventListener('click', event => event.currentTarget.parentElement.remove());
