const SUPABASE_URL = 'https://ksnzljothfoaefifevch.supabase.co';
const BUCKET = '1Marketphmediafiles';
const MAX_SIZE = 10 * 1024 * 1024;
const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];

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

function safeName(name = 'upload') {
  return String(name || 'upload').toLowerCase().replace(/[^a-z0-9._-]/g, '-').slice(-90) || 'upload';
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    if (req.method !== 'POST') return Response.json({ error: 'Method not allowed' }, { status: 405, headers: corsHeaders });

    const { file_name, content_type, base64_data, folder = 'media' } = await req.json();
    if (!file_name || !content_type || !base64_data) return Response.json({ error: 'Missing file data' }, { status: 400, headers: corsHeaders });
    if (!allowedTypes.includes(content_type)) return Response.json({ error: 'Unsupported file type' }, { status: 400, headers: corsHeaders });

    const bytes = Uint8Array.from(atob(base64_data), c => c.charCodeAt(0));
    if (bytes.byteLength > MAX_SIZE) return Response.json({ error: 'File must be 10MB or smaller' }, { status: 400, headers: corsHeaders });

    const path = `${safeFolder(folder)}/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}-${safeName(file_name)}`;
    const uploadResponse = await fetch(`${SUPABASE_URL}/storage/v1/object/${encodeURIComponent(BUCKET)}/${path.split('/').map(encodeURIComponent).join('/')}`, {
      method: 'POST',
      headers: serviceHeaders({ 'Content-Type': content_type, 'Cache-Control': '31536000', 'x-upsert': 'false' }),
      body: bytes,
    });

    if (!uploadResponse.ok) throw new Error(await uploadResponse.text());

    const file_url = `${SUPABASE_URL}/storage/v1/object/public/${encodeURIComponent(BUCKET)}/${path.split('/').map(encodeURIComponent).join('/')}`;
    return Response.json({ success: true, file_url, publicUrl: file_url, path, bucket: BUCKET, content_type, size: bytes.byteLength }, { headers: corsHeaders });
  } catch (error) {
    console.error('[SUPABASE_UPLOAD_ERROR]', error.message);
    return Response.json({ error: error.message || 'Upload failed' }, { status: 500, headers: corsHeaders });
  }
});