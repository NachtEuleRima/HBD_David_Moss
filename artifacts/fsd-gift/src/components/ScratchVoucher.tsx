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
      fontFamily: "'Outfit', system-ui, sans-serif",
      border: `1px solid ${C.border}`,
      padding: "32px 36px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 20,
    }}>

      {/* BIG background watermark */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        pointerEvents: "none", overflow: "hidden", zIndex: 1,
      }}>
        <span style={{
          color: C.white,
          fontWeight: 900,
          fontSize: "clamp(40px, 9vw, 80px)",
          opacity: 0.04,
          transform: "rotate(-16deg)",
          whiteSpace: "nowrap",
          letterSpacing: "0.08em",
          fontFamily: "'Outfit', system-ui, sans-serif",
        }}>MOSSMAN ONLY!!</span>
      </div>

      {/* Top: logo + "from" */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, zIndex: 2 }}>
        <img
          src="/tesbros-logo.jpeg"
          alt="TESbros DIY Wrap Club"
          style={{ height: 56, width: "auto", objectFit: "contain", borderRadius: 10 }}
          draggable={false}
        />
        <span style={{ color: C.muted, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.22em" }}>
          DIY Wrap Club
        </span>
      </div>

      {/* Thin cyan rule */}
      <div style={{ width: "60%", height: 1, background: `linear-gradient(to right, transparent, ${C.cyan}, transparent)`, zIndex: 2 }} />

      {/* Amount — hero */}
      <div style={{ textAlign: "center", zIndex: 2, lineHeight: 1 }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 2 }}>
          <span style={{ color: C.cyan, fontSize: 28, fontWeight: 900, marginBottom: 8 }}>$</span>
          <span style={{
            color: C.white, fontWeight: 900, letterSpacing: "-0.03em",
            fontSize: "clamp(60px, 14vw, 96px)",
            textShadow: `0 0 60px ${C.cyan}44`,
          }}>420</span>
          <span style={{ color: C.cyan, fontSize: 28, fontWeight: 900, marginBottom: 8 }}>.69</span>
        </div>
      </div>

      {/* Thin rule */}
      <div style={{ width: "60%", height: 1, background: `linear-gradient(to right, transparent, ${C.cyan}, transparent)`, zIndex: 2 }} />

      {/* To + purpose */}
      <div style={{ textAlign: "center", zIndex: 2, display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ color: C.muted, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.22em" }}>To</span>
        <span style={{ color: C.white, fontWeight: 800, fontSize: 22 }}>David Moss</span>
        <span style={{
          color: C.cyan, fontSize: 11, letterSpacing: "0.18em",
          textTransform: "uppercase", marginTop: 2, fontFamily: "'Space Grotesk', monospace",
        }}>NAS Wrap Only</span>
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
        }}>⚡ Birthday Bonus</span>
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
                background: "rgba(0,229,245,0.15)", backdropFilter: "blur(8px)",
                border: "1px solid rgba(0,229,245,0.35)", borderRadius: 99,
                padding: "7px 18px", whiteSpace: "nowrap",
                color: "#00e5f5", fontWeight: 700, fontSize: 13,
                fontFamily: "'Outfit', system-ui, sans-serif",
                boxShadow: "0 4px 20px rgba(0,229,245,0.2)",
              }}
            >
              {halfwayMsg}
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
