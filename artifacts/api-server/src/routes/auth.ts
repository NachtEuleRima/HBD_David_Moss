import { Router, type Request, type Response } from "express";
import { createHash, randomBytes } from "crypto";
import { db, oauthStatesTable } from "@workspace/db";
import { eq, lt } from "drizzle-orm";

declare module "express-session" {
  interface SessionData {
    xUser: { id: string; username: string; name: string } | null;
  }
}

const router = Router();

function base64URLEncode(buffer: Buffer): string {
  return buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

function generateCodeVerifier(): string {
  return base64URLEncode(randomBytes(32));
}

function generateCodeChallenge(verifier: string): string {
  return base64URLEncode(createHash("sha256").update(verifier).digest());
}

function getBaseUrl(req: Request): string {
  const proto =
    (req.headers["x-forwarded-proto"] as string) || req.protocol;
  const host =
    (req.headers["x-forwarded-host"] as string) || req.get("host");
  return `${proto}://${host}`;
}

router.get("/x", async (req: Request, res: Response) => {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);
  const state = base64URLEncode(randomBytes(16));
  const baseUrl = process.env.CALLBACK_BASE_URL || getBaseUrl(req);
  const callbackUrl = `${baseUrl}/api/auth/x/callback`;
  console.log("OAuth start — callbackUrl:", callbackUrl);

  // Store state in DB so it survives across browser contexts (mobile OAuth)
  await db.insert(oauthStatesTable).values({ state, codeVerifier, callbackUrl });

  // Clean up states older than 10 minutes
  await db.delete(oauthStatesTable).where(
    lt(oauthStatesTable.createdAt, new Date(Date.now() - 10 * 60 * 1000))
  ).catch(() => {});

  const params = new URLSearchParams({
    response_type: "code",
    client_id: process.env.X_CLIENT_ID!,
    redirect_uri: callbackUrl,
    scope: "tweet.read users.read",
    state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  });

  // The '#_' fragment bypasses iOS Universal Links (Apple docs: Universal Links
  // don't trigger when the URL contains a fragment), keeping auth in Safari.
  const authorizeUrl = `https://twitter.com/i/oauth2/authorize?${params}#_`;
  // Use JS redirect instead of 302 to prevent iOS Universal Links from
  // intercepting and opening the X native app (which can't show the OAuth page)
  res.type("html").send(
    `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1">` +
    `<style>body{background:#000;color:#fff;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0}</style>` +
    `</head><body><p>Redirecting to X...</p>` +
    `<script>window.location.href=${JSON.stringify(authorizeUrl)};</script>` +
    `</body></html>`
  );
});

router.get("/x/callback", async (req: Request, res: Response) => {
  const { code, state, error } = req.query;

  if (error) {
    console.error("X OAuth error from callback:", error, req.query.error_description);
    res.redirect(`/?auth_error=${error}`);
    return;
  }

  if (!code || !state) {
    console.error("Missing code or state in callback");
    res.redirect("/?auth_error=state");
    return;
  }

  // Look up state in DB (works regardless of session/browser context)
  const rows = await db
    .select()
    .from(oauthStatesTable)
    .where(eq(oauthStatesTable.state, state as string))
    .limit(1);

  if (rows.length === 0) {
    console.error("State not found in DB:", state);
    res.redirect("/?auth_error=state");
    return;
  }

  const { codeVerifier, callbackUrl } = rows[0];

  // Clean up used state
  await db.delete(oauthStatesTable).where(eq(oauthStatesTable.state, state as string)).catch(() => {});

  const clientId = process.env.X_CLIENT_ID!;
  const clientSecret = process.env.X_CLIENT_SECRET;

  try {
    let tokenBody: URLSearchParams;
    const headers: Record<string, string> = {
      "Content-Type": "application/x-www-form-urlencoded",
    };

    if (clientSecret) {
      headers.Authorization = `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`;
      tokenBody = new URLSearchParams({
        grant_type: "authorization_code",
        code: code as string,
        redirect_uri: callbackUrl,
        code_verifier: codeVerifier,
      });
    } else {
      tokenBody = new URLSearchParams({
        grant_type: "authorization_code",
        code: code as string,
        redirect_uri: callbackUrl,
        code_verifier: codeVerifier,
        client_id: clientId,
      });
    }

    const tokenRes = await fetch("https://api.twitter.com/2/oauth2/token", {
      method: "POST",
      headers,
      body: tokenBody,
    });

    if (!tokenRes.ok) {
      const err = await tokenRes.text();
      console.error("Token exchange failed:", err);
      res.redirect("/?auth_error=token");
      return;
    }

    const tokenData = (await tokenRes.json()) as { access_token: string };

    const userRes = await fetch("https://api.twitter.com/2/users/me", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    if (!userRes.ok) {
      const userErr = await userRes.text();
      console.error("User fetch failed:", userErr);
      res.redirect("/?auth_error=user");
      return;
    }

    const userData = (await userRes.json()) as {
      data: { id: string; username: string; name: string };
    };

    req.session.xUser = {
      id: userData.data.id,
      username: userData.data.username,
      name: userData.data.name,
    };

    req.session.save((saveErr) => {
      if (saveErr) console.error("Session save error:", saveErr);
      res.redirect("/");
    });
  } catch (err) {
    console.error("OAuth error:", err);
    res.redirect("/?auth_error=unknown");
  }
});

router.get("/me", (req: Request, res: Response) => {
  res.json({ user: req.session.xUser || null });
});

router.post("/logout", (req: Request, res: Response) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

export default router;
