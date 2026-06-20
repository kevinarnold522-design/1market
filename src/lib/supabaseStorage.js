import { requireSupabase } from '@/lib/supabaseClient';

export const SUPABASE_IMAGE_BUCKET = 'base44-images';
export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

const EXTENSION_BY_TYPE = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'application/pdf': 'pdf',
};

function safeFolder(folder = 'uploads') {
  return String(folder || 'uploads')
    .replace(/^\/+|\/+$/g, '')
    .replace(/[^a-zA-Z0-9/_-]/g, '-') || 'uploads';
}

function uniqueFileName(file) {
  const ext = EXTENSION_BY_TYPE[file.type] || file.name?.split('.').pop()?.toLowerCase() || 'bin';
  const uuid = typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `${uuid}.${ext}`;
}

export function validateImageFile(file) {
  if (!file) throw new Error('Please choose an image to upload.');
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) throw new Error('Only PNG, JPG, and WEBP images are allowed.');
  if (file.size > MAX_IMAGE_SIZE_BYTES) throw new Error('Image must be 5MB or smaller.');
  return true;
}

export async function uploadImageToSupabase(file, folder = 'images') {
  validateImageFile(file);
  return uploadFileToSupabase(file, SUPABASE_IMAGE_BUCKET, folder, { validateImage: false });
}

export async function uploadFileToSupabase(file, bucket = SUPABASE_IMAGE_BUCKET, folder = 'uploads', options = {}) {
  if (!file) throw new Error('Please choose a file to upload.');
  const allowPdf = options.allowPdf === true;
  if (options.validateImage !== false) {
    if (allowPdf && file.type === 'application/pdf') {
      if (file.size > MAX_IMAGE_SIZE_BYTES) throw new Error('File must be 5MB or smaller.');
    } else {
      validateImageFile(file);
    }
  }

  const db = requireSupabase();
  const path = `${safeFolder(folder)}/${uniqueFileName(file)}`;
  const { error } = await db.storage.from(bucket).upload(path, file, {
    cacheControl: '31536000',
    upsert: false,
    contentType: file.type,
  });
  if (error) throw new Error(error.message || 'Image upload failed.');

  const { data } = db.storage.from(bucket).getPublicUrl(path);
  if (!data?.publicUrl) throw new Error('Could not create a public image URL.');

  return { file_url: data.publicUrl, publicUrl: data.publicUrl, path, bucket };
}

export async function uploadMediaFile(file, folder = 'media/uploads') {
  return uploadImageToSupabase(file, folder);
}

export async function uploadProfilePicture(file) {
  return uploadImageToSupabase(file, 'avatars/profile-pictures');
}