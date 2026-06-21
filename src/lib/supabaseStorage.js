import { base44 } from '@/api/base44Client';

export const SUPABASE_IMAGE_BUCKET = '1Marketphmediafiles';
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

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1] || '');
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
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

  const base64_data = await fileToBase64(file);
  const response = await base44.functions.invoke('uploadMediaToSupabase', {
    file_name: file.name || 'upload',
    content_type: contentType,
    base64_data,
    folder,
    bucket,
  });
  return response.data;
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