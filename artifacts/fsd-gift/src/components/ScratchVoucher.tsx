import { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Site theme colours
const C = {
  bg:      "#07101f",   // near-site background
  card:    "#0c1628",   // card surface
  cyan:    "#00e5f5",   // site primary
  cyanDim: "#00aabb",
  glow:    "rgba(0,229,245,0.12)",
  white:   "#f8fafc",
  silver:  "#c0cdd8",
  muted:   "#5d7a90",
  faint:   "#1e3045",
  border:  "#162035",
};

function VoucherContent() {
  return (
    <div style={{
      background: C.bg,
      borderRadius: 16,
      overflow: "hidden",
      position: "relative",
      userSelect: "none",
      display: "flex",
      fontFamily: "'Outfit', system-ui, sans-serif",
      border: `1px solid ${C.border}`,
    }}>
      {/* Corner brackets */}
      {([
        { top: 8, left: 8,   borderTop: `1.5px solid ${C.cyan}`, borderLeft:  `1.5px solid ${C.cyan}`, borderRadius: "6px 0 0 0" },
        { top: 8, right: 8,  borderTop: `1.5px solid ${C.cyan}`, borderRight: `1.5px solid ${C.cyan}`, borderRadius: "0 6px 0 0" },
        { bottom: 8, left: 8,  borderBottom: `1.5px solid ${C.cyan}`, borderLeft:  `1.5px solid ${C.cyan}`, borderRadius: "0 0 0 6px" },
        { bottom: 8, right: 8, borderBottom: `1.5px solid ${C.cyan}`, borderRight: `1.5px solid ${C.cyan}`, borderRadius: "0 0 6px 0" },
      ] as React.CSSProperties[]).map((s, i) => (
        <div key={i} style={{ position: "absolute", width: 20, height: 20, zIndex: 3, ...s }} />
      ))}

      {/* Watermark */}
      <div style={{
        position: "absolute", inset: 0, display: "flex", alignItems: "center",
        justifyContent: "center", pointerEvents: "none", overflow: "hidden", zIndex: 1,
      }}>
        <span style={{
          color: C.cyan, fontWeight: 900, fontSize: "clamp(30px, 6vw, 58px)",
          opacity: 0.06, transform: "rotate(-18deg)", whiteSpace: "nowrap", letterSpacing: "0.1em",
        }}>⚡ MOSSMAN ONLY ⚡</span>
      </div>

      {/* Cyan glow left accent */}
      <div style={{
        width: 6,
        background: `linear-gradient(to bottom, ${C.cyan}, ${C.cyanDim})`,
        flexShrink: 0,
        zIndex: 2,
      }} />

      {/* Left dark panel */}
      <div style={{
        background: C.card,
        minWidth: 76,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px 10px",
        gap: 8,
        zIndex: 2,
        borderRight: `1px solid ${C.faint}`,
      }}>
        <span style={{
          color: C.cyan,
          fontWeight: 800,
          fontSize: 9,
          letterSpacing: "0.35em",
          textTransform: "uppercase",
          writingMode: "vertical-rl" as const,
          transform: "rotate(180deg)",
        }}>GIFT VOUCHER</span>
        <span style={{
          color: C.muted, fontSize: 9, letterSpacing: "0.2em",
          writingMode: "vertical-rl" as const, transform: "rotate(180deg)",
        }}>⚡</span>
      </div>

      {/* Main body */}
      <div style={{ flex: 1, padding: "20px 22px", display: "flex", flexDirection: "column", gap: 10, zIndex: 2 }}>

        {/* Top row */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <img
            src="/tesbros-logo.jpeg"
            alt="TESbros DIY Wrap Club"
            style={{ height: 48, width: "auto", objectFit: "contain", borderRadius: 8 }}
            draggable={false}
          />
          <div style={{ textAlign: "right" }}>
            <div style={{ color: C.muted, fontSize: 9, textTransform: "uppercase", letterSpacing: "0.18em" }}>Valid from</div>
            <div style={{ color: C.silver, fontSize: 11, fontWeight: 700, marginTop: 2 }}>April 26, 2025</div>
            <div style={{
              display: "inline-block", marginTop: 4, padding: "2px 7px",
              border: `1px solid ${C.faint}`, borderRadius: 99,
              color: C.muted, fontSize: 8, letterSpacing: "0.15em", textTransform: "uppercase",
            }}>Non-transferable</div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: `linear-gradient(to right, ${C.cyan}44, transparent)` }} />

        {/* Amount */}
        <div>
          <div style={{ color: C.muted, fontSize: 9, textTransform: "uppercase", letterSpacing: "0.22em", marginBottom: 4 }}>Gift Value</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 1, lineHeight: 1 }}>
            <span style={{ color: C.cyan, fontSize: 26, fontWeight: 900, marginBottom: 6 }}>$</span>
            <span style={{
              color: C.white, fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1,
              fontSize: "clamp(44px, 8vw, 68px)",
              textShadow: `0 0 40px ${C.cyan}55`,
            }}>420</span>
            <span style={{ color: C.cyan, fontSize: 26, fontWeight: 900, marginBottom: 6 }}>.69</span>
          </div>
          <div style={{ color: C.muted, fontSize: 9, fontStyle: "italic", marginTop: 2 }}>
            Four hundred twenty and 69/100 — numbers as legendary as the man
          </div>
        </div>

        {/* Bottom divider */}
        <div style={{ height: 1, background: C.faint }} />

        {/* Footer */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div>
            <div style={{ color: C.muted, fontSize: 9, textTransform: "uppercase", letterSpacing: "0.18em" }}>Issued to</div>
            <div style={{ color: C.white, fontSize: 14, fontWeight: 800, marginTop: 2 }}>David Moss</div>
            <div style={{ color: C.muted, fontSize: 10, marginTop: 2 }}>DIY Wrap supplies, gear &amp; club benefits</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: C.muted, fontSize: 9, textTransform: "uppercase", letterSpacing: "0.12em" }}>Voucher No.</div>
            <div style={{
              color: C.cyan, fontSize: 10, fontWeight: 700,
              fontFamily: "'Space Grotesk', monospace", marginTop: 2,
            }}>MOSSM-042069</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Draw a ⚡ lightning bolt shape centred at (x,y) with given size
function drawBolt(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.beginPath();
  ctx.moveTo(x + size * 0.22,  y - size);           // top-right of upper wing
  ctx.lineTo(x - size * 0.18,  y - size * 0.08);    // mid-left notch
  ctx.lineTo(x + size * 0.10,  y - size * 0.08);    // mid-right notch
  ctx.lineTo(x - size * 0.22,  y + size);            // bottom-left tip
  ctx.lineTo(x + size * 0.18,  y + size * 0.08);    // lower-mid right
  ctx.lineTo(x - size * 0.10,  y + size * 0.08);    // lower-mid left
  ctx.closePath();
  ctx.fill();
}

export function ScratchVoucher() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef   = useRef<HTMLDivElement>(null);
  const isDrawing = useRef(false);
  const [isRevealed, setIsRevealed] = useState(false);

  const drawSilver = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = canvas.width, h = canvas.height;

    ctx.globalCompositeOperation = "source-over";

    // Dark navy base (matches site) with subtle silver sheen
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0,    "#7a8a96");
    grad.addColorStop(0.12, "#c8d4de");
    grad.addColorStop(0.25, "#8a9aaa");
    grad.addColorStop(0.42, "#e0eaf0");
    grad.addColorStop(0.58, "#9aaabb");
    grad.addColorStop(0.72, "#d8e4ec");
    grad.addColorStop(0.88, "#8898a8");
    grad.addColorStop(1,    "#b0c0cc");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Sheen streaks
    ctx.globalAlpha = 0.22;
    for (let i = 0; i < w; i += 9) {
      const sg = ctx.createLinearGradient(i, 0, i + 4, h);
      sg.addColorStop(0,   "rgba(255,255,255,0)");
      sg.addColorStop(0.5, "rgba(255,255,255,0.65)");
      sg.addColorStop(1,   "rgba(255,255,255,0)");
      ctx.fillStyle = sg;
      ctx.fillRect(i, 0, 2, h);
    }
    ctx.globalAlpha = 1;
  }, []);

  useEffect(() => {
    if (isRevealed) return;
    const canvas = canvasRef.current;
    const wrap   = wrapRef.current;
    if (!canvas || !wrap) return;

    const init = () => {
      const w = wrap.offsetWidth;
      const h = wrap.offsetHeight;
      if (!w || !h) return;
      canvas.width  = w;
      canvas.height = h;
      drawSilver();
    };

    init();
    const ro = new ResizeObserver(() => { if (!isRevealed) init(); });
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [isRevealed, drawSilver]);

  const getPos = (e: MouseEvent | Touch, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width  / rect.width),
      y: (e.clientY - rect.top)  * (canvas.height / rect.height),
    };
  };

  const scratchAt = useCallback((x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.globalCompositeOperation = "destination-out";
    const size = Math.max(20, canvas.width / 14);
    drawBolt(ctx, x, y, size);

    if (Math.random() < 0.1) {
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let t = 0;
      for (let i = 3; i < data.length; i += 4 * 20) if (data[i] < 128) t++;
      if (t / (data.length / (4 * 20)) > 0.55) setIsRevealed(true);
    }
  }, [isRevealed]);

  const onMD = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    isDrawing.current = true;
    const p = getPos(e.nativeEvent, canvasRef.current!);
    scratchAt(p.x, p.y);
  }, [scratchAt]);

  const onMM = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    const p = getPos(e.nativeEvent, canvasRef.current!);
    scratchAt(p.x, p.y);
  }, [scratchAt]);

  const onMU = () => { isDrawing.current = false; };

  const onTS = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    isDrawing.current = true;
    const p = getPos(e.touches[0], canvasRef.current!);
    scratchAt(p.x, p.y);
  }, [scratchAt]);

  const onTM = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing.current) return;
    const p = getPos(e.touches[0], canvasRef.current!);
    scratchAt(p.x, p.y);
  }, [scratchAt]);

  return (
    <div id="voucher-section" style={{ scrollMarginTop: 32 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
        <span style={{
          fontSize: 11, fontFamily: "'Space Grotesk', monospace",
          letterSpacing: "0.2em", textTransform: "uppercase", color: "#5d7a90",
        }}>⚡ Birthday Bonus</span>
        <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
      </div>

      <div
        ref={wrapRef}
        style={{ position: "relative", borderRadius: 16, overflow: "hidden", boxShadow: "0 25px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,229,245,0.08)" }}
      >
        <VoucherContent />

        <AnimatePresence>
          {!isRevealed && (
            <motion.canvas
              ref={canvasRef}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              style={{
                position: "absolute", inset: 0, width: "100%", height: "100%",
                borderRadius: 16, cursor: "crosshair", touchAction: "none", zIndex: 20,
              }}
              onMouseDown={onMD}
              onMouseMove={onMM}
              onMouseUp={onMU}
              onMouseLeave={onMU}
              onTouchStart={onTS}
              onTouchMove={onTM}
              onTouchEnd={onMU}
            />
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isRevealed && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              textAlign: "center", fontSize: 12, color: "#5d7a90",
              marginTop: 12, fontFamily: "'Space Grotesk', monospace",
            }}
          >
            ⚡ Surprise from the community — happy birthday, Mossman!
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
