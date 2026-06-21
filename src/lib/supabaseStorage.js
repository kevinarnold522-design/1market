export const SUPABASE_IMAGE_BUCKET = '1Marketphmediafiles';
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_uHaBIgBzuhgPuUe0cTK0Qw_PDktWO2c';
export const MAX_IMAGE_SIZE_BYTES = 15 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif', 'image/heic', 'image/heif'];

function inferContentType(file) {
  const explicit = String(file?.type || '').trim();
  if (explicit) return explicit;
  const name = String(file?.name || '').toLowerCase();
  if (name.endsWith('.jpg') || name.endsWith('.jpeg')) return 'image/jpeg';
  if (name.endsWith('.png')) return 'image/png';
  if (name.endsWith('.webp')) return 'image/webp';
  if (name.endsWith('.gif')) return 'image/gif';
  if (name.endsWith('.heic')) return 'image/heic';
  if (name.endsWith('.heif')) return 'image/heif';
  if (name.endsWith('.pdf')) return 'application/pdf';
  return 'application/octet-stream';
}

function isImageFile(file) {
  return inferContentType(file).startsWith('image/');
}

function safeFolder(folder = 'uploads') {
  return String(folder || 'uploads').replace(/^\/+|\/+$/g, '').replace(/[^a-zA-Z0-9/_-]/g, '-') || 'uploads';
}

function safeFileName(file, contentType) {
  const name = String(file?.name || 'upload').toLowerCase().replace(/[^a-z0-9._-]/g, '-').slice(-90) || 'upload';
  if (name.includes('.')) return name;
  const ext = contentType === 'image/png' ? 'png' : contentType === 'image/webp' ? 'webp' : contentType === 'image/gif' ? 'gif' : contentType === 'application/pdf' ? 'pdf' : 'jpg';
  return `${name}.${ext}`;
}

export function validateImageFile(file) {
  if (!file) throw new Error('Please choose an image to upload.');
  if (!isImageFile(file)) throw new Error('Please choose a valid image file.');
  if (file.size > MAX_IMAGE_SIZE_BYTES) throw new Error('Image must be 15MB or smaller.');
  return true;
}

export async function uploadFileToSupabase(file, bucket = SUPABASE_IMAGE_BUCKET, folder = 'uploads', options = {}) {
  if (!file) throw new Error('Please choose a file to upload.');
  const allowPdf = options.allowPdf === true;
  const contentType = inferContentType(file);
  const isImage = contentType.startsWith('image/');
  if (!isImage && !(allowPdf && contentType === 'application/pdf')) throw new Error('Please choose an image file.');
  if (file.size > MAX_IMAGE_SIZE_BYTES) throw new Error('File must be 15MB or smaller.');

  const path = `${safeFolder(folder)}/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}-${safeFileName(file, contentType)}`;
  const encodedPath = path.split('/').map(encodeURIComponent).join('/');
  const response = await fetch(`https://ksnzljothfoaefifevch.supabase.co/storage/v1/object/${encodeURIComponent(bucket)}/${encodedPath}`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_PUBLISHABLE_KEY,
      Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
      'Content-Type': contentType,
      'Cache-Control': '31536000',
      'x-upsert': 'false',
    },
    body: file,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || data.message || 'Image upload failed.');

  const file_url = `https://ksnzljothfoaefifevch.supabase.co/storage/v1/object/public/${encodeURIComponent(bucket)}/${encodedPath}`;
  return { success: true, file_url, publicUrl: file_url, path, bucket, content_type: contentType, size: file.size };
}

export async function uploadImageToSupabase(file, folder = 'images') {
  validateImageFile(file);
  return uploadFileToSupabase(file, SUPABASE_IMAGE_BUCKET, folder, { validateImage: false });
}

export async function uploadMediaFile(file, folder = 'media/uploads') {
  return uploadImageToSupabase(file, folder);
}

export async function uploadProfilePicture(file) {
  return uploadImageToSupabase(file, 'avatars/profile-pictures');
}