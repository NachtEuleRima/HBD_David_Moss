import { readFileSync } from 'fs';
import { Storage } from '@google-cloud/storage';

const storage = new Storage({
  credentials: {
    audience: "replit", subject_token_type: "access_token",
    token_url: "http://127.0.0.1:1106/token", type: "external_account",
    credential_source: { url: "http://127.0.0.1:1106/credential", format: { type: "json", subject_token_field_name: "access_token" } },
    universe_domain: "googleapis.com",
  }, projectId: "",
});
const publicPath = process.env.PUBLIC_OBJECT_SEARCH_PATHS.split(',')[0].trim();
const parts = publicPath.slice(1).split('/');
const bucket = storage.bucket(parts[0]);
const prefix = parts.slice(1).join('/');

const buf = readFileSync('/tmp/avatars/that1evguyjay_pfp.jpg');
const filename = 'that1evguyjay_pfp.jpg';
await bucket.file(`${prefix}/${filename}`).save(buf, {
  metadata: { contentType: 'image/jpeg', cacheControl: 'public, max-age=86400' }, resumable: false,
});
console.log(`Uploaded ${buf.length}b -> ${prefix}/${filename}`);

const adminPw = process.env.ADMIN_PASSWORD;
const baseUrl = "https://mossman-on-fsd.life";
const r = await fetch(`${baseUrl}/api/pledges/summary`);
const summary = await r.json();
const that = summary.pledges.find(p => p.xUsername === 'that1evguyjay');
if (that) {
  const r2 = await fetch(`${baseUrl}/api/pledges/${that.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", "x-admin-password": adminPw },
    body: JSON.stringify({ xAvatarUrl: `/api/video/${filename}` }),
  });
  console.log(`Patched pledge ${that.id}: ${r2.status}`);
} else {
  console.log('No that1evguyjay in production');
}
