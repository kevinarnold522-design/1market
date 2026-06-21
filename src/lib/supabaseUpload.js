import { toast } from '@/components/ui/use-toast';
import { uploadFileToSupabase } from '@/lib/supabaseStorage';

export async function uploadMediaFileToSupabase(file, folder = 'media') {
  const notice = toast({ title: 'Uploading image...', description: 'Please wait while we save your file.' });
  try {
    const result = await uploadFileToSupabase(file, undefined, folder, { allowPdf: true });
    notice.update({ title: 'Upload complete', description: 'Your image is ready to use.' });
    return result;
  } catch (error) {
    notice.update({ title: 'Upload failed', description: error.message || 'Please try another image.', variant: 'destructive' });
    throw error;
  }
}