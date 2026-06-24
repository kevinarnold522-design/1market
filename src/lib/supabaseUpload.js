import { toast } from '@/components/ui/use-toast';
import { base44 } from '@/api/base44Client';
import { uploadFileToSupabase } from '@/lib/supabaseStorage';

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || '').split(',')[1] || '');
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function uploadMediaFileToSupabase(file, folder = 'media') {
  try {
    return await uploadFileToSupabase(file, undefined, folder, { allowPdf: true });
  } catch (error) {
    try {
      const base64_data = await fileToBase64(file);
      const response = await base44.functions.invoke('uploadMediaToSupabase', {
        file_name: file.name || 'upload.jpg',
        content_type: file.type || 'image/jpeg',
        base64_data,
        folder,
      });
      return response.data;
    } catch (fallbackError) {
      toast({ title: 'Upload failed', description: fallbackError.message || error.message || 'Please try another image.', variant: 'destructive' });
      throw fallbackError;
    }
  }
}