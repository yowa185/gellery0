import { showToast } from './toast';
import { supabase, ARTWORK_IMAGE_BUCKET } from '../lib/supabaseClient';
import { createArtwork, updateArtwork, getArtworkById, type Artwork, type ArtworkInput } from './artworks';

async function uploadArtworkImage(file: File): Promise<string> {
  if (!supabase) throw new Error('Supabase is not configured (missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).');
  const path = `${crypto.randomUUID()}-${file.name}`;
  const { error } = await supabase.storage.from(ARTWORK_IMAGE_BUCKET).upload(path, file);
  if (error) throw error;
  const { data } = supabase.storage.from(ARTWORK_IMAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

function fillFormForEdit(form: HTMLFormElement, artwork: Artwork): void {
  document.title = '作品を編集する — GALLERY 0';
  (form.elements.namedItem('title') as HTMLInputElement).value = artwork.title;
  (form.elements.namedItem('artist') as HTMLInputElement).value = artwork.artist;
  (form.elements.namedItem('price') as HTMLInputElement).value = String(artwork.price);
  (form.elements.namedItem('category') as HTMLSelectElement).value = artwork.category;
  (form.elements.namedItem('productionYear') as HTMLInputElement).value = artwork.productionYear ? String(artwork.productionYear) : '';
  (form.elements.namedItem('material') as HTMLInputElement).value = artwork.material ?? '';
  (form.elements.namedItem('width') as HTMLInputElement).value = artwork.width ? String(artwork.width) : '';
  (form.elements.namedItem('height') as HTMLInputElement).value = artwork.height ? String(artwork.height) : '';
  (form.elements.namedItem('shipping') as HTMLInputElement).value = artwork.shipping ?? '';
  (form.elements.namedItem('description') as HTMLTextAreaElement).value = artwork.description ?? '';

  const fileInput = form.elements.namedItem('imageFile') as HTMLInputElement | null;
  if (fileInput) fileInput.required = false;
  const submitButton = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  if (submitButton) submitButton.innerHTML = '作品を更新する <b>→</b>';
}

export function initializeSellForm(): void {
  const form = document.querySelector<HTMLFormElement>('.sell-form');
  if (!form) return;

  const editId = new URLSearchParams(location.search).get('id');
  let editingArtwork: Artwork | undefined;

  void (async () => {
    if (!editId) return;
    editingArtwork = await getArtworkById(editId);
    if (editingArtwork?.own) fillFormForEdit(form, editingArtwork);
  })();

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    void handleSubmit(form, editId, editingArtwork);
  });
}

function readInput(form: HTMLFormElement, fallbackImageUrl: string | undefined, imageUrl: string): ArtworkInput {
  const data = new FormData(form);
  const numberOrUndefined = (value: FormDataEntryValue | null): number | undefined =>
    value ? Number(value) : undefined;

  return {
    title: String(data.get('title')),
    artistName: String(data.get('artist')),
    description: String(data.get('description') ?? ''),
    price: Number(data.get('price')),
    width: numberOrUndefined(data.get('width')),
    height: numberOrUndefined(data.get('height')),
    material: String(data.get('material') ?? ''),
    productionYear: numberOrUndefined(data.get('productionYear')),
    category: String(data.get('category')),
    imageUrl: imageUrl || fallbackImageUrl || '',
    shippingInfo: String(data.get('shipping') ?? ''),
  };
}

async function handleSubmit(form: HTMLFormElement, editId: string | null, editingArtwork?: Artwork): Promise<void> {
  const submitButton = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  const fileInput = form.querySelector<HTMLInputElement>('input[name="imageFile"]');
  const file = fileInput?.files?.[0];

  if (!editId && !file) {
    showToast('画像を選択してください。');
    return;
  }

  if (submitButton) submitButton.disabled = true;
  try {
    const uploadedUrl = file ? await uploadArtworkImage(file) : '';
    const input = readInput(form, editingArtwork?.image, uploadedUrl);

    if (editId) {
      await updateArtwork(editId, input);
      showToast('作品を更新しました。');
      location.href = `/artwork.html?id=${editId}`;
    } else {
      await createArtwork(input);
      form.reset();
      document.querySelector('.sell-success')?.classList.add('is-visible');
      showToast('作品を登録しました。');
    }
  } catch (error) {
    console.error(error);
    showToast(editId ? '更新に失敗しました。' : '登録に失敗しました。バックエンドサーバーをご確認ください。');
  } finally {
    if (submitButton) submitButton.disabled = false;
  }
}
