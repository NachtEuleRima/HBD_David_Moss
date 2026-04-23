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
  const shownMilestones = useRef<Set<number>>(new Set());
  const [isRevealed,    setIsRevealed]    = useState(false);
  const [halfwayMsg,    setHalfwayMsg]    = useState<string | null>(null);
  const [badgeY,        setBadgeY]        = useState(0);
  const [showHint,      setShowHint]      = useState(true);

  const ALL_QUIPS = [
    "Almost there, Mossman! ⚡",
    "Your FSD fingers are doing work 🔥",
    "Keep scratching, legend 👀",
    "LiDAR couldn't see this coming 😂",
  ];

  // Shuffle once at mount for a unique order every session
  const quipQueue = useRef<string[]>(
    [...ALL_QUIPS].sort(() => Math.random() - 0.5)
  );
  const quipIndex = useRef(0);

  const BANNER_THRESHOLDS = [10, 30, 50, 70];

  const drawSilver = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = canvas.width, h = canvas.height;

    ctx.globalCompositeOperation = "source-over";

    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0,    "#5c6e7a");
    grad.addColorStop(0.12, "#a8b8c4");
    grad.addColorStop(0.25, "#6e8090");
    grad.addColorStop(0.42, "#c2ced8");
    grad.addColorStop(0.58, "#7c9098");
    grad.addColorStop(0.72, "#b8c8d2");
    grad.addColorStop(0.88, "#6a7a88");
    grad.addColorStop(1,    "#92a4b0");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // White sheen streaks — subtly slanted ~10°
    const diag = Math.ceil(Math.sqrt(w * w + h * h));
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.rotate(Math.PI / 18); // 10 degrees
    const sg = ctx.createLinearGradient(0, -diag, 0, diag);
    sg.addColorStop(0,    "rgba(255,255,255,0)");
    sg.addColorStop(0.42, "rgba(220,252,255,0.45)");  // barely-cyan fade-in
    sg.addColorStop(0.5,  "rgba(0,229,245,0.65)");    // site cyan at peak
    sg.addColorStop(0.58, "rgba(220,252,255,0.45)");  // barely-cyan fade-out
    sg.addColorStop(1,    "rgba(255,255,255,0)");
    ctx.fillStyle = sg;
    ctx.globalAlpha = 0.20;
    for (let i = -diag; i < diag; i += 9) {
      ctx.fillRect(i, -diag, 2, diag * 2);
    }
    ctx.restore();
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
    const size = Math.max(18, canvas.width / 14);
    drawBolt(ctx, x, y, size);

    if (Math.random() < 0.25) {
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let t = 0;
      for (let i = 3; i < data.length; i += 4 * 20) if (data[i] < 128) t++;
      const pct = t / (data.length / (4 * 20));

      if (showHint && pct > 0.10) setShowHint(false);

      for (const t of BANNER_THRESHOLDS) {
        if (!shownMilestones.current.has(t) && pct * 100 >= t) {
          shownMilestones.current.add(t);
          const quip = quipQueue.current[quipIndex.current % quipQueue.current.length];
          quipIndex.current += 1;
          if (wrapRef.current) {
            const rect = wrapRef.current.getBoundingClientRect();
            setBadgeY(rect.bottom);
          }
          setHalfwayMsg(quip);
          setTimeout(() => setHalfwayMsg(null), 3200);
          break;
        }
      }

      if (pct > 0.75) setIsRevealed(true);
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
    <div id="voucher-section" style={{ scrollMarginTop: 32, position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
        <span style={{
          fontSize: 11, fontFamily: "'Space Grotesk', monospace",
          letterSpacing: "0.2em", textTransform: "uppercase", color: "#5d7a90",
        }}>Birthday Bonus</span>
        <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
      </div>

      <div
        ref={wrapRef}
        style={{ position: "relative", borderRadius: 16, overflow: "hidden", boxShadow: "0 25px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,229,245,0.08)" }}
      >
        <VoucherContent />

        {/* "Scratch me" hint — fades out at 10% */}
        <AnimatePresence>
          {showHint && (
            <motion.div
              key="scratch-hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.80 }}
              exit={{ opacity: 0, transition: { duration: 0.5 } }}
              style={{
                position: "absolute", top: "50%", left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 28, pointerEvents: "none",
                color: "#1a2e3a", fontSize: 12, fontWeight: 700,
                fontFamily: "'Space Grotesk', monospace",
                letterSpacing: "0.25em", textTransform: "uppercase",
                whiteSpace: "nowrap",
                textShadow: "0 1px 3px rgba(255,255,255,0.55), 0 0 8px rgba(255,255,255,0.25)",
              }}
            >
              ✦ &nbsp;scratch me&nbsp; ✦
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

      {/* Milestone badge — fixed to viewport so nothing can clip it */}
      <AnimatePresence>
        {halfwayMsg && (
          <motion.div
            key={halfwayMsg + Date.now()}
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: [0, 1, 1, 0], y: [0, -16, -55, -100] }}
            transition={{ duration: 3.2, times: [0, 0.12, 0.65, 1], ease: "easeOut" }}
            style={{
              position: "fixed",
              top: badgeY - 16, left: "37%", transform: "translateX(-50%)",
              zIndex: 9999, pointerEvents: "none",
              maxWidth: "calc(100vw - 48px)", textAlign: "center",
              background: "rgba(6,15,30,0.62)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(0,229,245,0.25)",
              borderRadius: 99,
              padding: "7px 16px",
              whiteSpace: "nowrap",
              color: "#00e5f5",
              fontWeight: 600,
              fontSize: 11,
              fontFamily: "'Outfit', system-ui, sans-serif",
              boxShadow: "0 0 16px rgba(0,229,245,0.10)",
              letterSpacing: "0.02em",
              display: "flex", alignItems: "center", gap: 6,
            }}
          >
            <span style={{ opacity: 0.6, fontSize: 10 }}>⚡</span>
            {halfwayMsg}
            <span style={{ opacity: 0.6, fontSize: 10 }}>⚡</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
