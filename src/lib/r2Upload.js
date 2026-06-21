import { uploadFileToSupabase, SUPABASE_IMAGE_BUCKET } from '@/lib/supabaseStorage';
import { toast } from '@/components/ui/use-toast';

export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1] || '');
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function uploadMediaFileToR2(file, folder = 'media') {
  const notice = toast({ title: 'Uploading image...', description: 'Please wait while we save your file.' });
  try {
    const result = await uploadFileToSupabase(file, SUPABASE_IMAGE_BUCKET, folder, { allowPdf: true });
    notice.update({ title: 'Upload complete', description: 'Your image is ready to use.' });
    return result;
  } catch (error) {
    notice.update({ title: 'Upload failed', description: error.message || 'Please try another image.', variant: 'destructive' });
    throw error;
  }
}