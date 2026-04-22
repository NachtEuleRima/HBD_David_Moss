import { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const C = {
  bg:        "#111111",
  red:       "#dc2626",
  redStripe: "#b91c1c",
  white:     "#ffffff",
  silver:    "#e2e2e2",
  muted:     "#9ca3af",
  faint:     "#4b5563",
  border:    "#2a2a2a",
};

function VoucherContent() {
  return (
    <div
      style={{
        background: C.bg,
        borderRadius: "16px",
        overflow: "hidden",
        position: "relative",
        userSelect: "none",
        display: "flex",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Corner brackets */}
      {([
        { top: 6, left: 6, borderTop: `2px solid ${C.red}`, borderLeft: `2px solid ${C.red}`, borderRadius: "6px 0 0 0" },
        { top: 6, right: 6, borderTop: `2px solid ${C.red}`, borderRight: `2px solid ${C.red}`, borderRadius: "0 6px 0 0" },
        { bottom: 6, left: 6, borderBottom: `2px solid ${C.red}`, borderLeft: `2px solid ${C.red}`, borderRadius: "0 0 0 6px" },
        { bottom: 6, right: 6, borderBottom: `2px solid ${C.red}`, borderRight: `2px solid ${C.red}`, borderRadius: "0 0 6px 0" },
      ] as React.CSSProperties[]).map((s, i) => (
        <div key={i} style={{ position: "absolute", width: 24, height: 24, zIndex: 3, ...s }} />
      ))}

      {/* Watermark */}
      <div style={{
        position: "absolute", inset: 0, display: "flex", alignItems: "center",
        justifyContent: "center", pointerEvents: "none", overflow: "hidden", zIndex: 1,
      }}>
        <span style={{
          color: C.red, fontWeight: 900, fontSize: "clamp(32px, 6vw, 60px)",
          opacity: 0.08, transform: "rotate(-20deg)", whiteSpace: "nowrap",
          letterSpacing: "0.12em",
        }}>!! MOSSMAN ONLY !!</span>
      </div>

      {/* Left red panel */}
      <div style={{
        background: C.red, minWidth: 80, display: "flex",
        alignItems: "center", justifyContent: "center", padding: "20px 12px", zIndex: 2,
      }}>
        <span style={{
          color: C.white, fontWeight: 900, fontSize: 10,
          letterSpacing: "0.3em", textTransform: "uppercase",
          writingMode: "vertical-rl" as const, transform: "rotate(180deg)",
        }}>GIFT VOUCHER</span>
      </div>

      {/* Main body */}
      <div style={{ flex: 1, padding: "20px 24px", display: "flex", flexDirection: "column", gap: 12, zIndex: 2 }}>

        {/* Top row: logo + meta */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <img
            src="/tesbros-logo.jpeg"
            alt="TESbros DIY Wrap Club"
            style={{ height: 52, width: "auto", objectFit: "contain", borderRadius: 8 }}
            draggable={false}
          />
          <div style={{ textAlign: "right" }}>
            <div style={{ color: C.muted, fontSize: 9, textTransform: "uppercase", letterSpacing: "0.18em" }}>Valid from</div>
            <div style={{ color: C.silver, fontSize: 11, fontWeight: 700, marginTop: 2 }}>April 26, 2025</div>
            <div style={{ color: C.faint, fontSize: 9, marginTop: 2 }}>Non-transferable</div>
          </div>
        </div>

        {/* Amount */}
        <div>
          <div style={{ color: C.muted, fontSize: 9, textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 4 }}>Gift Value</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 2, lineHeight: 1 }}>
            <span style={{ color: C.red, fontSize: 28, fontWeight: 900 }}>$</span>
            <span style={{ color: C.white, fontSize: "clamp(48px, 9vw, 72px)", fontWeight: 900, letterSpacing: "-0.02em", lineHeight: 1 }}>420</span>
            <span style={{ color: C.red, fontSize: 28, fontWeight: 900, marginBottom: 4 }}>.69</span>
          </div>
          <div style={{ color: C.faint, fontSize: 9, fontStyle: "italic", marginTop: 4 }}>
            Four hundred twenty and 69/100 — because legends deserve legendary numbers
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: `1px solid ${C.border}` }} />

        {/* Footer row */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div>
            <div style={{ color: C.muted, fontSize: 9, textTransform: "uppercase", letterSpacing: "0.18em" }}>Issued to</div>
            <div style={{ color: C.white, fontSize: 15, fontWeight: 900, marginTop: 2 }}>David Moss</div>
            <div style={{ color: C.muted, fontSize: 10, marginTop: 2 }}>DIY Wrap supplies, gear &amp; club benefits</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: C.faint, fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em" }}>Voucher No.</div>
            <div style={{ color: C.muted, fontSize: 10, fontWeight: 700, fontFamily: "monospace", marginTop: 2 }}>MOSSM-042069</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ScratchVoucher() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const isDrawing = useRef(false);
  const [isRevealed, setIsRevealed] = useState(false);

  const drawSilver = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;

    ctx.globalCompositeOperation = "source-over";
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0,    "#888");
    grad.addColorStop(0.1,  "#d4d4d4");
    grad.addColorStop(0.2,  "#999");
    grad.addColorStop(0.35, "#ebebeb");
    grad.addColorStop(0.5,  "#b0b0b0");
    grad.addColorStop(0.65, "#f2f2f2");
    grad.addColorStop(0.8,  "#a8a8a8");
    grad.addColorStop(0.9,  "#e0e0e0");
    grad.addColorStop(1,    "#909090");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Metallic sheen streaks
    ctx.globalAlpha = 0.2;
    for (let i = 0; i < w; i += 10) {
      const sg = ctx.createLinearGradient(i, 0, i + 5, h);
      sg.addColorStop(0,   "rgba(255,255,255,0)");
      sg.addColorStop(0.5, "rgba(255,255,255,0.7)");
      sg.addColorStop(1,   "rgba(255,255,255,0)");
      ctx.fillStyle = sg;
      ctx.fillRect(i, 0, 3, h);
    }
    ctx.globalAlpha = 1;
  }, []);

  useEffect(() => {
    if (isRevealed) return;
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const init = () => {
      const w = wrap.offsetWidth;
      const h = wrap.offsetHeight;
      if (!w || !h) return;
      canvas.width = w;
      canvas.height = h;
      drawSilver();
    };

    // Draw immediately once layout is ready
    init();

    // Re-draw if the wrapper ever changes size (e.g. image loads, font renders)
    const ro = new ResizeObserver(() => {
      if (!isRevealed) init();
    });
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [isRevealed, drawSilver]);

  const getPos = (e: MouseEvent | Touch, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const scratchAt = useCallback((x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, Math.max(24, canvas.width / 16), 0, Math.PI * 2);
    ctx.fill();
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
        <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
        <span style={{ fontSize: 11, fontFamily: "monospace", letterSpacing: "0.2em", textTransform: "uppercase", color: "#6b7280" }}>
          🎁 Birthday Bonus
        </span>
        <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
      </div>

      <div ref={wrapRef} style={{ position: "relative", borderRadius: 16, overflow: "hidden", boxShadow: "0 25px 50px rgba(0,0,0,0.5)" }}>
        <VoucherContent />

        <AnimatePresence>
          {!isRevealed && (
            <motion.canvas
              ref={canvasRef}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              style={{
                position: "absolute", inset: 0, width: "100%", height: "100%",
                borderRadius: 16, cursor: "crosshair", touchAction: "none",
                zIndex: 20,
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
            style={{ textAlign: "center", fontSize: 12, color: "#6b7280", marginTop: 12, fontFamily: "monospace" }}
          >
            🎉 Surprise from the community — happy birthday, Mossman!
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
