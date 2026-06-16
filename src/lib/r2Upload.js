import { base44 } from '@/api/base44Client';

export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1] || '');
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function uploadMediaFileToR2(file, folder = 'media') {
  const base64_data = await fileToBase64(file);
  const res = await base44.functions.invoke('uploadMediaToR2', {
    file_name: file.name,
    content_type: file.type,
    base64_data,
    folder,
  });
  return res.data;
}