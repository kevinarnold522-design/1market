import fs from 'node:fs';
import path from 'node:path';

const functionNames = [
  'adminViewMessages',
  'analyzeListingImages',
  'autoWelcomeEmail',
  'createGhostAccount',
  'listingApprovalNotify',
  'sendBusinessWelcomeEmail',
  'sendFeedback',
  'sendOtp',
  'sendSellerWelcomeEmail',
  'sendVerifiedPartnerEmail',
  'sendWelcomeEmail',
  'uploadMediaToR2',
  'export1MarketphSql'
];

for (const name of functionNames) {
  const source = path.join('functions', name);
  if (!fs.existsSync(source)) continue;
  const targetDir = path.join('supabase', 'functions', name);
  fs.mkdirSync(targetDir, { recursive: true });
  fs.copyFileSync(source, path.join(targetDir, 'index.ts'));
}

console.log('Prepared Supabase function folders. Run: supabase functions deploy <functionName>');