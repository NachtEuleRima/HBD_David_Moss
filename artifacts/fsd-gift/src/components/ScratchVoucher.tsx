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
      background: "linear-gradient(135deg, #0b1829 0%, #07101f 45%, #0a1520 100%)",
      borderRadius: 14,
      overflow: "hidden",
      position: "relative",
      userSelect: "none",
      fontFamily: "'Outfit', system-ui, sans-serif",
      border: `1px solid #1c2e48`,
      boxShadow: `inset 0 0 60px rgba(0,229,245,0.04)`,
    }}>

      {/* Inner dashed decorative frame */}
      <div style={{
        position: "absolute", inset: 10,
        border: `1px dashed rgba(0,229,245,0.18)`,
        borderRadius: 8,
        pointerEvents: "none",
        zIndex: 1,
      }} />

      {/* Corner ornaments ✦ */}
      {([
        { top: 5,  left: 5  },
        { top: 5,  right: 5 },
        { bottom: 5, left: 5  },
        { bottom: 5, right: 5 },
      ] as React.CSSProperties[]).map((pos, i) => (
        <span key={i} style={{
          position: "absolute", zIndex: 4,
          color: C.cyan, fontSize: 11, opacity: 0.55,
          lineHeight: 1, ...pos,
        }}>✦</span>
      ))}

      {/* Watermark */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        pointerEvents: "none", overflow: "hidden", zIndex: 1,
      }}>
        <span style={{
          color: C.white, fontWeight: 900,
          fontSize: "clamp(38px, 8vw, 72px)",
          opacity: 0.035, transform: "rotate(-14deg)",
          whiteSpace: "nowrap", letterSpacing: "0.1em",
        }}>MOSSMAN ONLY!!</span>
      </div>

      {/* Subtle top cyan glow bar */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(to right, transparent, ${C.cyan}88, transparent)`,
        zIndex: 2,
      }} />
      {/* Subtle bottom cyan glow bar */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(to right, transparent, ${C.cyan}44, transparent)`,
        zIndex: 2,
      }} />

      {/* 3-column body */}
      <div style={{
        display: "flex", alignItems: "stretch",
        padding: "20px 16px", gap: 0,
        position: "relative", zIndex: 2,
      }}>

        {/* LEFT — vertical "DIY Wrap Club" bar */}
        <div style={{
          flex: "0 0 40px", width: 40,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          borderRight: `1px solid ${C.faint}`,
        }}>
          <span style={{
            color: C.cyan,
            fontWeight: 800,
            fontSize: 10,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            writingMode: "vertical-rl" as const,
            transform: "rotate(180deg)",
          }}>DIY Wrap Club</span>
        </div>

        {/* CENTER — Amount */}
        <div style={{
          flex: 1,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 6,
          paddingLeft: 12,
        }}>
          <div style={{ color: C.muted, fontSize: 8, textTransform: "uppercase", letterSpacing: "0.3em" }}>Gift Value</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 1, lineHeight: 1 }}>
            <span style={{ color: C.cyan, fontSize: 20, fontWeight: 900, marginBottom: 8 }}>$</span>
            <span style={{
              color: C.white, fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1,
              fontSize: "clamp(52px, 10vw, 76px)",
              textShadow: `0 0 50px ${C.cyan}55, 0 0 100px ${C.cyan}22`,
            }}>420</span>
            <span style={{ color: C.cyan, fontSize: 20, fontWeight: 900, marginBottom: 8 }}>.69</span>
          </div>
          {/* Mini ornamental rule under amount */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 28, height: 1, background: `linear-gradient(to left, ${C.cyan}88, transparent)` }} />
            <span style={{ color: C.cyan, fontSize: 8, opacity: 0.6 }}>✦</span>
            <div style={{ width: 28, height: 1, background: `linear-gradient(to right, ${C.cyan}88, transparent)` }} />
          </div>
          <div style={{ color: C.muted, fontSize: 8, letterSpacing: "0.3em", textTransform: "uppercase" }}>April 26 · 2025</div>
        </div>

        {/* Vertical divider */}
        <div style={{
          width: 1, margin: "4px 14px",
          background: `linear-gradient(to bottom, transparent, ${C.cyan}55, transparent)`,
          flexShrink: 0,
        }} />

        {/* RIGHT — To + purpose */}
        <div style={{
          flex: 1,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 8,
          minWidth: 0,
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: C.muted, fontSize: 8, textTransform: "uppercase", letterSpacing: "0.25em" }}>To</div>
            <div style={{ color: C.white, fontSize: 15, fontWeight: 800, marginTop: 4, letterSpacing: "0.02em", whiteSpace: "nowrap" }}>David Moss</div>
          </div>
          <div style={{
            padding: "4px 10px",
            border: `1px solid ${C.cyan}44`,
            borderRadius: 99,
            color: C.cyan, fontSize: 8,
            textTransform: "uppercase", letterSpacing: "0.15em",
            fontFamily: "'Space Grotesk', monospace",
            whiteSpace: "nowrap",
          }}>NAS Wrap Only</div>
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
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const wrapRef      = useRef<HTMLDivElement>(null);
  const isDrawing    = useRef(false);
  const halfwayShown = useRef(false);
  const [isRevealed,  setIsRevealed]  = useState(false);
  const [halfwayMsg,  setHalfwayMsg]  = useState<string | null>(null);

  const HALFWAY_QUIPS = [
    "Almost there, Mossman! ⚡",
    "Your FSD fingers are doing work 🔥",
    "Keep scratching, legend 👀",
    "Getting warmer... 🌡️",
    "LiDAR couldn't see this coming 😂",
  ];

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

  const getPos = (e: MouseEvent | Touch, canvas: HTMLCanvasElement | null) => {
    if (!canvas) return null;
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
    const size = Math.max(32, canvas.width / 8);
    drawBolt(ctx, x, y, size);

    if (Math.random() < 0.25) {
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let t = 0;
      for (let i = 3; i < data.length; i += 4 * 20) if (data[i] < 128) t++;
      const pct = t / (data.length / (4 * 20));

      if (!halfwayShown.current && pct > 0.15) {
        halfwayShown.current = true;
        const quip = HALFWAY_QUIPS[Math.floor(Math.random() * HALFWAY_QUIPS.length)];
        setHalfwayMsg(quip);
        setTimeout(() => setHalfwayMsg(null), 2200);
      }

      if (pct > 0.30) setIsRevealed(true);
    }
  }, [isRevealed]);

  const onMD = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    isDrawing.current = true;
    const p = getPos(e.nativeEvent, canvasRef.current);
    if (p) scratchAt(p.x, p.y);
  }, [scratchAt]);

  const onMM = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    const p = getPos(e.nativeEvent, canvasRef.current);
    if (p) scratchAt(p.x, p.y);
  }, [scratchAt]);

  const onMU = () => { isDrawing.current = false; };

  const onTS = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    isDrawing.current = true;
    const p = getPos(e.touches[0], canvasRef.current);
    if (p) scratchAt(p.x, p.y);
  }, [scratchAt]);

  const onTM = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing.current) return;
    const p = getPos(e.touches[0], canvasRef.current);
    if (p) scratchAt(p.x, p.y);
  }, [scratchAt]);

  return (
    <div id="voucher-section" style={{ scrollMarginTop: 32 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
        <span style={{
          fontSize: 11, fontFamily: "'Space Grotesk', monospace",
          letterSpacing: "0.2em", textTransform: "uppercase", color: "#5d7a90",
        }}>🎁 Birthday Bonus</span>
        <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
      </div>

      <div
        ref={wrapRef}
        style={{ position: "relative", borderRadius: 16, overflow: "hidden", boxShadow: "0 25px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,229,245,0.08)" }}
      >
        <VoucherContent />

        <AnimatePresence>
          {halfwayMsg && (
            <motion.div
              key="halfway"
              initial={{ opacity: 0, y: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.9 }}
              transition={{ duration: 0.25 }}
              style={{
                position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)",
                zIndex: 30, pointerEvents: "none",
                background: "linear-gradient(135deg, #060f1e 0%, #0a1828 100%)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(0,229,245,0.3)",
                borderRadius: 99,
                padding: "9px 22px",
                whiteSpace: "nowrap",
                color: "#00e5f5",
                fontWeight: 700,
                fontSize: 13,
                fontFamily: "'Outfit', system-ui, sans-serif",
                boxShadow: "0 0 0 1px rgba(0,229,245,0.08), 0 8px 32px rgba(0,0,0,0.7), 0 0 20px rgba(0,229,245,0.12)",
                letterSpacing: "0.02em",
                display: "flex", alignItems: "center", gap: 8,
              }}
            >
              <span style={{ opacity: 0.7, fontSize: 11 }}>⚡</span>
              {halfwayMsg}
              <span style={{ opacity: 0.7, fontSize: 11 }}>⚡</span>
            </motion.div>
          )}
        </AnimatePresence>

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

    </div>
  );
}
