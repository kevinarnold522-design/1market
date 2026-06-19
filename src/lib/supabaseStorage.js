import { uploadMediaFileToR2 } from '@/lib/r2Upload';

/**
 * Compatibility wrapper: app media now uploads to Cloudflare R2.
 */
export async function uploadFileToSupabase(file, bucket = 'media', path = '') {
  const folder = [bucket, path].filter(Boolean).join('/');
  return uploadMediaFileToR2(file, folder || 'media');
}

export async function uploadMediaFile(file) {
  return uploadMediaFileToR2(file, 'media/uploads');
}

export async function uploadProfilePicture(file) {
  return uploadMediaFileToR2(file, 'avatars/profile-pictures');
}