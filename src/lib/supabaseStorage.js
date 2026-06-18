import { requireSupabase } from './supabaseClient';

/**
 * Upload a file to Supabase Storage
 * @param {File} file - The file to upload
 * @param {string} bucket - The bucket name (e.g., 'media', 'avatars')
 * @param {string} path - The path within the bucket (e.g., 'user-avatars/123')
 * @returns {Promise<{file_url: string}>} - The public URL of the uploaded file
 */
export async function uploadFileToSupabase(file, bucket = 'media', path = '') {
  if (!file) throw new Error('No file provided');
  
  const supabase = requireSupabase();
  if (!supabase) throw new Error('Supabase client not initialized');

  try {
    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name}`;
    const fullPath = path ? `${path}/${filename}` : filename;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fullPath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('[v0] Supabase upload error:', error);
      throw new Error(error.message || 'Upload failed');
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return {
      file_url: urlData.publicUrl,
      path: data.path
    };
  } catch (err) {
    console.error('[v0] Upload error:', err);
    throw err;
  }
}

/**
 * Upload media file (image/video) to 'media' bucket
 */
export async function uploadMediaFile(file) {
  return uploadFileToSupabase(file, 'media', 'uploads');
}

/**
 * Upload profile picture to 'avatars' bucket
 */
export async function uploadProfilePicture(file) {
  return uploadFileToSupabase(file, 'avatars', 'profile-pictures');
}
