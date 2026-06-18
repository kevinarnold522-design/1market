import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm', 'video/quicktime'];

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const { file_name, content_type, base64_data, folder = 'media' } = req.body || {};
    if (!file_name || !content_type || !base64_data) return res.status(400).json({ error: 'Missing file data' });
    if (!allowedTypes.includes(content_type)) return res.status(400).json({ error: 'Unsupported media type' });

    const bytes = Buffer.from(base64_data, 'base64');
    if (bytes.byteLength > 25 * 1024 * 1024) return res.status(400).json({ error: 'File must be 25MB or smaller' });

    const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID;
    const bucket = process.env.CLOUDFLARE_R2_BUCKET_NAME;
    const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
    if (!accountId || !bucket || !accessKeyId || !secretAccessKey) return res.status(500).json({ error: 'Cloudflare R2 is not configured' });

    const safeName = file_name.toLowerCase().replace(/[^a-z0-9._-]/g, '-').slice(-90);
    const key = `${folder}/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}-${safeName}`;
    const client = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId, secretAccessKey },
      forcePathStyle: true,
    });

    await client.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: bytes, ContentType: content_type }));
    const publicBaseUrl = process.env.CLOUDFLARE_R2_PUBLIC_BASE_URL;
    const file_url = publicBaseUrl ? `${publicBaseUrl.replace(/\/$/, '')}/${key}` : `https://${bucket}.${accountId}.r2.cloudflarestorage.com/${key}`;
    return res.status(200).json({ success: true, file_url, object_key: key, content_type, size: bytes.byteLength });
  } catch (error) {
    console.error('[R2_UPLOAD_ERROR]', error);
    return res.status(500).json({ error: error.message });
  }
}