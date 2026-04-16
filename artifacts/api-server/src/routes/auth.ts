import { Router, type Request, type Response } from "express";
import { createHash, randomBytes } from "crypto";

declare module "express-session" {
  interface SessionData {
    oauthState: string;
    codeVerifier: string;
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

router.get("/x", (req: Request, res: Response) => {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);
  const state = base64URLEncode(randomBytes(16));

  req.session.oauthState = state;
  req.session.codeVerifier = codeVerifier;

  const callbackUrl = `${getBaseUrl(req)}/api/auth/x/callback`;

  const params = new URLSearchParams({
    response_type: "code",
    client_id: process.env.X_CLIENT_ID!,
    redirect_uri: callbackUrl,
    scope: "tweet.read users.read",
    state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  });

  res.redirect(`https://twitter.com/i/oauth2/authorize?${params}`);
});

router.get("/x/callback", async (req: Request, res: Response) => {
  const { code, state, error } = req.query;

  if (error) {
    console.error("X OAuth error from callback:", error, req.query.error_description);
    res.redirect(`/?auth_error=${error}`);
    return;
  }

  if (!code || state !== req.session.oauthState) {
    console.error("State mismatch:", { receivedState: state, sessionState: req.session.oauthState, hasCode: !!code });
    res.redirect("/?auth_error=state");
    return;
  }

  const callbackUrl = `${getBaseUrl(req)}/api/auth/x/callback`;
  console.log("OAuth callback - callbackUrl:", callbackUrl, "clientId prefix:", process.env.X_CLIENT_ID?.slice(0, 8));

  try {
    const clientId = process.env.X_CLIENT_ID!;

    const tokenRes = await fetch("https://api.twitter.com/2/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: code as string,
        redirect_uri: callbackUrl,
        code_verifier: req.session.codeVerifier!,
        client_id: clientId,
      }),
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

    delete req.session.oauthState;
    delete req.session.codeVerifier;

    res.redirect("/");
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
