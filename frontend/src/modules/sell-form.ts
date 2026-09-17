import { showToast } from './toast';
import { supabase, ARTWORK_IMAGE_BUCKET } from '../lib/supabaseClient';

export const LISTING_KEY = 'gallery0-listings';

type Listing = { id: string; imageUrl: string; status: string; createdAt: string } & Record<string, string>;

function getListings(): Listing[] {
  return JSON.parse(localStorage.getItem(LISTING_KEY) ?? '[]');
}

function saveListings(listings: Listing[]): void {
  localStorage.setItem(LISTING_KEY, JSON.stringify(listings));
}

async function uploadArtworkImage(file: File): Promise<string> {
  if (!supabase) throw new Error('Supabase is not configured (missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).');
  const path = `${crypto.randomUUID()}-${file.name}`;
  const { error } = await supabase.storage.from(ARTWORK_IMAGE_BUCKET).upload(path, file);
  if (error) throw error;
  const { data } = supabase.storage.from(ARTWORK_IMAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

function fillFormForEdit(form: HTMLFormElement, listing: Listing): void {
  document.title = '作品を編集する — GALLERY 0';
  for (const field of ['title', 'price', 'category', 'productionYear', 'material', 'width', 'height', 'description']) {
    const input = form.elements.namedItem(field) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null;
    if (input && listing[field] !== undefined) input.value = listing[field];
  }
  const fileInput = form.elements.namedItem('imageFile') as HTMLInputElement | null;
  if (fileInput) fileInput.required = false;
  const submitButton = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  if (submitButton) submitButton.innerHTML = '作品を更新する <b>→</b>';
}

export function initializeSellForm(): void {
  const form = document.querySelector<HTMLFormElement>('.sell-form');
  if (!form) return;

  const editId = new URLSearchParams(location.search).get('id');
  const editing = editId ? getListings().find((item) => item.id === editId) : undefined;
  if (editing) fillFormForEdit(form, editing);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    void handleSubmit(form, editing);
  });
}

async function handleSubmit(form: HTMLFormElement, editing?: Listing): Promise<void> {
  const submitButton = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  const fileInput = form.querySelector<HTMLInputElement>('input[name="imageFile"]');
  const file = fileInput?.files?.[0];

  if (!editing && !file) {
    showToast('画像を選択してください。');
    return;
  }

  if (submitButton) submitButton.disabled = true;
  try {
    const imageUrl = file ? await uploadArtworkImage(file) : editing!.imageUrl;
    const entries = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    delete entries.imageFile;

    const listings = getListings();
    if (editing) {
      const index = listings.findIndex((item) => item.id === editing.id);
      listings[index] = { ...editing, ...entries, imageUrl };
      saveListings(listings);
      showToast('作品を更新しました。');
      location.href = `/artwork.html?id=${editing.id}`;
    } else {
      listings.push({ id: crypto.randomUUID(), ...entries, imageUrl, status: 'ON_SALE', createdAt: new Date().toISOString() });
      saveListings(listings);
      form.reset();
      document.querySelector('.sell-success')?.classList.add('is-visible');
      showToast('作品を登録しました。');
    }
  } catch (error) {
    console.error(error);
    showToast(editing ? '更新に失敗しました。' : '画像のアップロードに失敗しました。');
  } finally {
    if (submitButton) submitButton.disabled = false;
  }
}
