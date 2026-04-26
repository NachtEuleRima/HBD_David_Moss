import { Storage } from "@google-cloud/storage";

const REPLIT_SIDECAR_ENDPOINT = "http://127.0.0.1:1106";

export const objectStorageClient = new Storage({
  credentials: {
    audience: "replit",
    subject_token_type: "access_token",
    token_url: `${REPLIT_SIDECAR_ENDPOINT}/token`,
    type: "external_account",
    credential_source: {
      url: `${REPLIT_SIDECAR_ENDPOINT}/credential`,
      format: {
        type: "json",
        subject_token_field_name: "access_token",
      },
    },
    universe_domain: "googleapis.com",
  },
  projectId: "",
});

function parsePath(fullPath: string): { bucketName: string; objectName: string } {
  if (!fullPath.startsWith("/")) {
    throw new Error("Path must start with /");
  }
  const parts = fullPath.slice(1).split("/");
  const bucketName = parts[0];
  const objectName = parts.slice(1).join("/");
  return { bucketName, objectName };
}

export function getPublicVideoFile(filename: string) {
  const publicPaths = (process.env.PUBLIC_OBJECT_SEARCH_PATHS || "")
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
  if (publicPaths.length === 0) {
    throw new Error("PUBLIC_OBJECT_SEARCH_PATHS not set");
  }
  const fullPath = `${publicPaths[0]}/${filename}`;
  const { bucketName, objectName } = parsePath(fullPath);
  return objectStorageClient.bucket(bucketName).file(objectName);
}
