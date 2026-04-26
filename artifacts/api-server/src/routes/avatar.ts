import { Router, type IRouter, type Request, type Response } from "express";
import { getPublicVideoFile } from "../lib/videoStorage";

const router: IRouter = Router();

type CacheEntry = {
  data: Buffer;
  contentType: string;
  fetchedAt: number;
  notFound?: boolean;
};

const cache = new Map<string, CacheEntry>();
const inflight = new Map<string, Promise<CacheEntry>>();

const SUCCESS_TTL_MS = 6 * 60 * 60 * 1000;
const NEGATIVE_TTL_MS = 5 * 60 * 1000;
const MAX_CACHE_ENTRIES = 500;
const FETCH_TIMEOUT_MS = 8000;

function pruneCache(): void {
  if (cache.size <= MAX_CACHE_ENTRIES) return;
  const oldest = [...cache.entries()]
    .sort((a, b) => a[1].fetchedAt - b[1].fetchedAt)
    .slice(0, cache.size - MAX_CACHE_ENTRIES);
  for (const [k] of oldest) cache.delete(k);
}

async function fetchFromUnavatar(username: string): Promise<CacheEntry> {
  const url = `https://unavatar.io/x/${encodeURIComponent(username)}?fallback=false`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
    });
    if (!res.ok) {
      return {
        data: Buffer.alloc(0),
        contentType: "application/octet-stream",
        fetchedAt: Date.now(),
        notFound: true,
      };
    }
    const arrayBuffer = await res.arrayBuffer();
    const buf = Buffer.from(arrayBuffer);
    if (buf.length === 0) {
      return {
        data: Buffer.alloc(0),
        contentType: "application/octet-stream",
        fetchedAt: Date.now(),
        notFound: true,
      };
    }
    return {
      data: buf,
      contentType: res.headers.get("content-type") || "image/jpeg",
      fetchedAt: Date.now(),
    };
  } catch (err) {
    return {
      data: Buffer.alloc(0),
      contentType: "application/octet-stream",
      fetchedAt: Date.now(),
      notFound: true,
    };
  } finally {
    clearTimeout(timer);
  }
}

async function tryStoredFallback(username: string): Promise<CacheEntry | null> {
  try {
    const file = getPublicVideoFile(`${username}_pfp.jpg`);
    const [exists] = await file.exists();
    if (!exists) return null;
    const [metadata] = await file.getMetadata();
    const [buf] = await file.download();
    return {
      data: buf,
      contentType: (metadata.contentType as string) || "image/jpeg",
      fetchedAt: Date.now(),
    };
  } catch {
    return null;
  }
}

async function getAvatar(username: string): Promise<CacheEntry> {
  const cached = cache.get(username);
  if (cached) {
    const age = Date.now() - cached.fetchedAt;
    const ttl = cached.notFound ? NEGATIVE_TTL_MS : SUCCESS_TTL_MS;
    if (age < ttl) return cached;
  }

  const existing = inflight.get(username);
  if (existing) return existing;

  const promise = (async () => {
    let entry = await fetchFromUnavatar(username);
    if (entry.notFound) {
      const stored = await tryStoredFallback(username);
      if (stored) entry = stored;
    }
    cache.set(username, entry);
    pruneCache();
    return entry;
  })().finally(() => {
    inflight.delete(username);
  });

  inflight.set(username, promise);
  return promise;
}

router.get("/avatar/x/:username", async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    if (!/^[a-zA-Z0-9_]{1,30}$/.test(username)) {
      res.status(400).json({ error: "Invalid username" });
      return;
    }

    const entry = await getAvatar(username);
    if (entry.notFound) {
      res.setHeader("Cache-Control", "public, max-age=300");
      res.status(404).end();
      return;
    }

    res.setHeader("Content-Type", entry.contentType);
    res.setHeader("Content-Length", String(entry.data.length));
    res.setHeader("Cache-Control", "public, max-age=21600, stale-while-revalidate=86400");
    res.status(200).send(entry.data);
  } catch (error) {
    req.log?.error({ err: error }, "Error serving avatar");
    if (!res.headersSent) res.status(500).json({ error: "Failed to serve avatar" });
  }
});

export default router;
