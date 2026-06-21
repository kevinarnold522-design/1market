const SUPABASE_URL = 'https://ksnzljothfoaefifevch.supabase.co';
const BUCKET = '1Marketphmediafiles';
const MAX_SIZE = 15 * 1024 * 1024;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function serviceHeaders(extra = {}) {
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY is missing');
  return { apikey: key, Authorization: `Bearer ${key}`, ...extra };
}

function safeFolder(folder = 'media') {
  return String(folder || 'media').replace(/^\/+|\/+$/g, '').replace(/[^a-zA-Z0-9/_-]/g, '-') || 'media';
}

function extensionFromType(contentType = '') {
  if (contentType === 'image/jpeg' || contentType === 'image/jpg') return 'jpg';
  if (contentType === 'image/png') return 'png';
  if (contentType === 'image/webp') return 'webp';
  if (contentType === 'image/gif') return 'gif';
  if (contentType === 'image/heic') return 'heic';
  if (contentType === 'image/heif') return 'heif';
  if (contentType === 'application/pdf') return 'pdf';
  return 'bin';
}

function safeName(name = 'upload', contentType = '') {
  const cleaned = String(name || 'upload').toLowerCase().replace(/[^a-z0-9._-]/g, '-').slice(-90) || 'upload';
  if (cleaned.includes('.')) return cleaned;
  return `${cleaned}.${extensionFromType(contentType)}`;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    if (req.method !== 'POST') return Response.json({ error: 'Method not allowed' }, { status: 405, headers: corsHeaders });

    const { file_name, content_type, base64_data, folder = 'media' } = await req.json();
    const contentType = content_type || 'application/octet-stream';
    const allowed = contentType.startsWith('image/') || contentType === 'application/pdf';
    if (!file_name || !base64_data) return Response.json({ error: 'Missing file data' }, { status: 400, headers: corsHeaders });
    if (!allowed) return Response.json({ error: 'Please choose a valid image file' }, { status: 400, headers: corsHeaders });

    const bytes = Uint8Array.from(atob(base64_data), c => c.charCodeAt(0));
    if (bytes.byteLength > MAX_SIZE) return Response.json({ error: 'File must be 15MB or smaller' }, { status: 400, headers: corsHeaders });

    const path = `${safeFolder(folder)}/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}-${safeName(file_name, contentType)}`;
    const uploadResponse = await fetch(`${SUPABASE_URL}/storage/v1/object/${encodeURIComponent(BUCKET)}/${path.split('/').map(encodeURIComponent).join('/')}`, {
      method: 'POST',
      headers: serviceHeaders({ 'Content-Type': contentType, 'Cache-Control': '31536000', 'x-upsert': 'false' }),
      body: bytes,
    });

    if (!uploadResponse.ok) throw new Error(await uploadResponse.text());

    const file_url = `${SUPABASE_URL}/storage/v1/object/public/${encodeURIComponent(BUCKET)}/${path.split('/').map(encodeURIComponent).join('/')}`;
    return Response.json({ success: true, file_url, publicUrl: file_url, path, bucket: BUCKET, content_type: contentType, size: bytes.byteLength }, { headers: corsHeaders });
  } catch (error) {
    console.error('[SUPABASE_UPLOAD_ERROR]', error.message);
    return Response.json({ error: error.message || 'Upload failed' }, { status: 500, headers: corsHeaders });
  }
});