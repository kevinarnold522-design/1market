import { base44 } from '@/api/base44Client';
import { toast } from '@/components/ui/use-toast';

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1] || '');
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function uploadMediaFileToSupabase(file, folder = 'media') {
  const notice = toast({ title: 'Uploading image...', description: 'Please wait while we save your file.' });
  try {
    const base64_data = await fileToBase64(file);
    const response = await base44.functions.invoke('uploadMediaToSupabase', {
      file_name: file.name,
      content_type: file.type,
      base64_data,
      folder,
    });
    notice.update({ title: 'Upload complete', description: 'Your image is ready to use.' });
    return response.data;
  } catch (error) {
    notice.update({ title: 'Upload failed', description: error.message || 'Please try another image.', variant: 'destructive' });
    throw error;
  }
}