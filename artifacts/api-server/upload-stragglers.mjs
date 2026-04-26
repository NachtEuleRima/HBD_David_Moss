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

const adminPw = process.env.ADMIN_PASSWORD;
const baseUrl = "https://mossman-on-fsd.life";

const summary = await fetch(`${baseUrl}/api/pledges/summary`).then(r => r.json());

const users = ['TeslaVisualized', 'herbertong', 'CyberAmped', 'congressdj', 'Oceanswave'];

for (const u of users) {
  const filename = `${u}_pfp.jpg`;
  const buf = readFileSync(`/tmp/avatars/${filename}`);
  await bucket.file(`${prefix}/${filename}`).save(buf, {
    metadata: { contentType: 'image/jpeg', cacheControl: 'public, max-age=86400' }, resumable: false,
  });
  process.stdout.write(`${u}: uploaded ${buf.length}b`);

  const matches = summary.pledges.filter(p => p.xUsername === u);
  if (matches.length === 0) { console.log(` -> not in production`); continue; }
  for (const p of matches) {
    const r = await fetch(`${baseUrl}/api/pledges/${p.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-password": adminPw },
      body: JSON.stringify({ xAvatarUrl: `/api/video/${filename}` }),
    });
    process.stdout.write(` -> patched #${p.id}: ${r.status}`);
  }
  console.log();
}
