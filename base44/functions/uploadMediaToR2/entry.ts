import { S3Client, PutObjectCommand } from 'npm:@aws-sdk/client-s3@3.699.0';

const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm', 'video/quicktime'];

Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') return Response.json({ error: 'Method not allowed' }, { status: 405 });
    const { file_name, content_type, base64_data, folder = 'media' } = await req.json();
    if (!file_name || !content_type || !base64_data) return Response.json({ error: 'Missing file data' }, { status: 400 });
    if (!allowedTypes.includes(content_type)) return Response.json({ error: 'Unsupported media type' }, { status: 400 });

    const bytes = Uint8Array.from(atob(base64_data), c => c.charCodeAt(0));
    if (bytes.byteLength > 25 * 1024 * 1024) return Response.json({ error: 'File must be 25MB or smaller' }, { status: 400 });

    const accountId = Deno.env.get('CLOUDFLARE_R2_ACCOUNT_ID');
    const bucket = Deno.env.get('CLOUDFLARE_R2_BUCKET_NAME');
    const accessKeyId = Deno.env.get('CLOUDFLARE_R2_ACCESS_KEY_ID');
    const secretAccessKey = Deno.env.get('CLOUDFLARE_R2_SECRET_ACCESS_KEY');
    if (!accountId || !bucket || !accessKeyId || !secretAccessKey) return Response.json({ error: 'Cloudflare R2 is not configured' }, { status: 500 });

    const safeName = file_name.toLowerCase().replace(/[^a-z0-9._-]/g, '-').slice(-90);
    const key = `${folder}/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}-${safeName}`;
    const client = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId, secretAccessKey },
      forcePathStyle: true,
    });

    await client.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: bytes, ContentType: content_type }));
    const file_url = `https://${bucket}.${accountId}.r2.cloudflarestorage.com/${key}`;
    return Response.json({ success: true, file_url, object_key: key, content_type, size: bytes.byteLength });
  } catch (error) {
    console.error('[R2_UPLOAD_ERROR]', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});