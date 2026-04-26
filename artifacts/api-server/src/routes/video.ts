import { Router, type IRouter, type Request, type Response } from "express";
import { getPublicVideoFile } from "../lib/videoStorage";

const router: IRouter = Router();

router.get("/video/:filename", async (req: Request, res: Response) => {
  try {
    const { filename } = req.params;
    if (!/^[a-zA-Z0-9._-]+$/.test(filename)) {
      res.status(400).json({ error: "Invalid filename" });
      return;
    }

    const file = getPublicVideoFile(filename);
    const [exists] = await file.exists();
    if (!exists) {
      res.status(404).json({ error: "Not found" });
      return;
    }

    const [metadata] = await file.getMetadata();
    const totalSize = Number(metadata.size || 0);
    const contentType = (metadata.contentType as string) || "video/mp4";

    res.setHeader("Content-Type", contentType);
    res.setHeader("Accept-Ranges", "bytes");
    res.setHeader("Cache-Control", "no-cache, must-revalidate");

    const range = req.headers.range;
    if (range) {
      const match = /^bytes=(\d*)-(\d*)$/.exec(range);
      if (!match || (match[1] === "" && match[2] === "")) {
        res.status(416).setHeader("Content-Range", `bytes */${totalSize}`).end();
        return;
      }

      let start: number;
      let end: number;
      if (match[1] === "") {
        // Suffix range: last N bytes (RFC 7233)
        const suffixLen = parseInt(match[2], 10);
        if (!Number.isFinite(suffixLen) || suffixLen <= 0) {
          res.status(416).setHeader("Content-Range", `bytes */${totalSize}`).end();
          return;
        }
        start = Math.max(0, totalSize - suffixLen);
        end = totalSize - 1;
      } else {
        start = parseInt(match[1], 10);
        end = match[2] === "" ? totalSize - 1 : parseInt(match[2], 10);
        if (end >= totalSize) end = totalSize - 1;
      }

      if (!Number.isFinite(start) || !Number.isFinite(end) || start < 0 || start >= totalSize || start > end) {
        res.status(416).setHeader("Content-Range", `bytes */${totalSize}`).end();
        return;
      }

      const chunkSize = end - start + 1;
      res.status(206);
      res.setHeader("Content-Range", `bytes ${start}-${end}/${totalSize}`);
      res.setHeader("Content-Length", String(chunkSize));
      const stream = file.createReadStream({ start, end });
      const cleanup = () => stream.destroy();
      req.on("close", cleanup);
      stream.on("error", (err) => {
        req.log?.error({ err }, "Video stream error");
        if (!res.headersSent) res.status(500).end();
        else res.destroy(err);
      });
      stream.pipe(res);
      return;
    }

    res.setHeader("Content-Length", String(totalSize));
    const stream = file.createReadStream();
    const cleanup = () => stream.destroy();
    req.on("close", cleanup);
    stream.on("error", (err) => {
      req.log?.error({ err }, "Video stream error");
      if (!res.headersSent) res.status(500).end();
      else res.destroy(err);
    });
    stream.pipe(res);
  } catch (error) {
    req.log?.error({ err: error }, "Error serving video");
    if (!res.headersSent) res.status(500).json({ error: "Failed to serve video" });
  }
});

export default router;
