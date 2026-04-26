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

const targets = [
  [10,"TeslaVisualized"],[11,"herbertong"],[12,"CyberAmped"],
  [13,"congressdj"],[14,"Oceanswave"],
];

let ok = 0;
for (const [id,u] of targets) {
  process.stdout.write(`${u}: `);
  let success = false;
  for (let attempt=1; attempt<=3 && !success; attempt++) {
    const r = await fetch(`https://unavatar.io/x/${u}?fallback=false`, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });
    if (r.ok) {
      const ct = r.headers.get('content-type') || 'image/jpeg';
      const buf = Buffer.from(await r.arrayBuffer());
      if (buf.length >= 200) {
        const ext = ct.includes('png') ? 'png' : ct.includes('webp') ? 'webp' : 'jpg';
        const filename = `${u}_pfp.${ext}`;
        await bucket.file(`${prefix}/${filename}`).save(buf, {
          metadata: { contentType: ct, cacheControl: 'public, max-age=86400' }, resumable: false,
        });
        const r2 = await fetch(`${baseUrl}/api/pledges/${id}`, {
          method: "PATCH", headers: { "Content-Type": "application/json", "x-admin-password": adminPw },
          body: JSON.stringify({ xAvatarUrl: `/api/video/${filename}` }),
        });
        console.log(`OK ${buf.length}b -> ${r2.ok ? 'PATCHED' : 'patch FAIL'}`);
        ok++; success = true;
      } else { console.log(`tiny ${buf.length}b`); break; }
    } else {
      process.stdout.write(`[${attempt}:${r.status}] `);
      await new Promise(r => setTimeout(r, 30000));
    }
  }
  if (!success) console.log('GAVE UP');
  await new Promise(r => setTimeout(r, 20000));
}
console.log(`\n${ok}/5 succeeded`);
