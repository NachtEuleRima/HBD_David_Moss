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

const usernames = [
  "RimaSukhadia","FutureAZA","Racehooked","scottbuscemi","taysmom1",
  "TechTeslaFusion","TitaniumTomP","MartyEarthy","mikepat711","Jacobperez",
  "ethanmckanna","Heike_Jost","RetiredYoungNW","MstrHappyJustin","ehuna",
  "Its_EV_John","CyberMikeOG","JonBbC_TechGeek","vloudbeer","koby_pierce",
  "OGMarsLife","Oceanswave","congressdj","CyberAmped","herbertong","TeslaVisualized"
];

const results = [];

async function tryFetch(u, attempt = 1) {
  try {
    const r = await fetch(`https://unavatar.io/x/${u}?fallback=false`, {
      headers: { 'User-Agent': `Mozilla/5.0 (FSD-Gift v${attempt})` },
    });
    if (r.status === 429 && attempt < 3) {
      await new Promise(res => setTimeout(res, 30000 * attempt));
      return tryFetch(u, attempt + 1);
    }
    if (!r.ok) return { ok: false, reason: `HTTP ${r.status}` };
    const ct = r.headers.get('content-type') || 'image/jpeg';
    const buf = Buffer.from(await r.arrayBuffer());
    if (buf.length < 200) return { ok: false, reason: `tiny ${buf.length}b` };
    return { ok: true, ct, buf };
  } catch (e) {
    return { ok: false, reason: e.message };
  }
}

for (const u of usernames) {
  process.stdout.write(`${u}... `);
  const res = await tryFetch(u);
  if (!res.ok) {
    console.log(`FAIL ${res.reason}`);
    results.push({ username: u, success: false, reason: res.reason });
    continue;
  }
  const ext = res.ct.includes('png') ? 'png' : res.ct.includes('webp') ? 'webp' : 'jpg';
  // Upload to root public path with _pfp suffix so existing /api/video/ route can serve it
  const filename = `${u}_pfp.${ext}`;
  const objectName = `${prefix}/${filename}`;
  await bucket.file(objectName).save(res.buf, {
    metadata: { contentType: res.ct, cacheControl: 'public, max-age=86400' },
    resumable: false,
  });
  console.log(`OK ${res.buf.length}b -> ${filename}`);
  results.push({ username: u, success: true, filename, size: res.buf.length });
  await new Promise(r => setTimeout(r, 1500)); // gentle pace
}

console.log('\n=== SUMMARY ===');
const ok = results.filter(r => r.success);
const fail = results.filter(r => !r.success);
console.log(`Success: ${ok.length}, Failed: ${fail.length}`);
console.log('\nSQL_UPDATES:');
for (const r of ok) {
  // URL works in production via existing /api/video/:filename route
  console.log(`UPDATE pledges SET x_avatar_url = '/api/video/${r.filename}' WHERE x_username = '${r.username}';`);
}
if (fail.length) {
  console.log('\nFAILED:');
  for (const r of fail) console.log(`  ${r.username}: ${r.reason}`);
}
