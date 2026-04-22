import { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

function VoucherContent() {
  return (
    <div
      className="relative overflow-hidden select-none rounded-2xl"
      style={{ background: "#0d0d0d", minHeight: "220px" }}
    >
      {/* Decorative corner accents */}
      {[
        "top-0 left-0 border-t-2 border-l-2 rounded-tl-2xl",
        "top-0 right-0 border-t-2 border-r-2 rounded-tr-2xl",
        "bottom-0 left-0 border-b-2 border-l-2 rounded-bl-2xl",
        "bottom-0 right-0 border-b-2 border-r-2 rounded-br-2xl",
      ].map((cls, i) => (
        <div key={i} className={`absolute w-8 h-8 border-red-600/60 ${cls}`} />
      ))}

      {/* Outer decorative border */}
      <div className="absolute inset-[6px] rounded-xl border border-zinc-700/40 pointer-events-none" />

      {/* !! DIAGONAL WATERMARK !! */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
        aria-hidden="true"
        style={{ zIndex: 1 }}
      >
        <p
          className="font-black text-red-600 tracking-widest whitespace-nowrap leading-none"
          style={{
            fontSize: "clamp(36px, 7vw, 68px)",
            opacity: 0.09,
            transform: "rotate(-20deg)",
            userSelect: "none",
          }}
        >
          !! MOSSMAN ONLY !!
        </p>
      </div>

      {/* CONTENT */}
      <div className="relative flex h-full" style={{ zIndex: 2 }}>

        {/* Left red stripe panel */}
        <div className="flex flex-col items-center justify-center bg-red-600 px-4 py-6" style={{ minWidth: "90px" }}>
          <span
            className="text-white font-black tracking-[0.25em] uppercase"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", fontSize: "11px", letterSpacing: "0.25em" }}
          >
            GIFT VOUCHER
          </span>
        </div>

        {/* Main body */}
        <div className="flex-1 px-6 py-5 flex flex-col justify-between">

          {/* Top: logo + validity */}
          <div className="flex items-start justify-between mb-3">
            <img
              src="/tesbros-logo.jpeg"
              alt="TESbros DIY Wrap Club"
              className="h-14 w-auto object-contain rounded-lg"
              draggable={false}
              style={{ filter: "brightness(1.05)" }}
            />
            <div className="text-right">
              <p className="text-zinc-500 text-[9px] uppercase tracking-[0.18em] font-mono">Valid from</p>
              <p className="text-zinc-300 text-xs font-bold font-mono mt-0.5">April 26, 2025</p>
              <p className="text-zinc-600 text-[9px] font-mono mt-0.5">Non-transferable</p>
            </div>
          </div>

          {/* Amount — the hero */}
          <div className="my-1">
            <p className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-mono mb-1">Gift Value</p>
            <div className="flex items-baseline gap-1">
              <span className="text-red-500 text-2xl font-black font-mono leading-none">$</span>
              <span
                className="text-white font-black leading-none"
                style={{ fontSize: "clamp(42px, 9vw, 72px)", fontFamily: "system-ui, sans-serif", letterSpacing: "-0.02em" }}
              >
                420
              </span>
              <span className="text-red-500 font-black text-3xl leading-none self-end mb-1">.69</span>
            </div>
            <p className="text-zinc-500 text-[10px] italic font-mono mt-1">
              Four hundred twenty and 69/100 — because legends deserve legendary numbers
            </p>
          </div>

          {/* Bottom: recipient + description */}
          <div className="mt-3 pt-3 border-t border-zinc-800 flex items-end justify-between gap-4">
            <div>
              <p className="text-zinc-600 text-[9px] uppercase tracking-[0.18em] font-mono">Issued to</p>
              <p className="text-white text-sm font-black mt-0.5">David Moss</p>
              <p className="text-zinc-400 text-[10px] mt-0.5">DIY Wrap supplies, gear & club benefits</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-zinc-600 text-[9px] uppercase tracking-wider font-mono">Voucher No.</p>
              <p className="text-zinc-400 text-[10px] font-mono font-bold">MOSSM-042069</p>
            </div>
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

    // Base silver gradient
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0,    "#8a8a8a");
    grad.addColorStop(0.1,  "#d4d4d4");
    grad.addColorStop(0.2,  "#9a9a9a");
    grad.addColorStop(0.35, "#e8e8e8");
    grad.addColorStop(0.5,  "#b0b0b0");
    grad.addColorStop(0.65, "#f0f0f0");
    grad.addColorStop(0.8,  "#a8a8a8");
    grad.addColorStop(0.9,  "#e0e0e0");
    grad.addColorStop(1,    "#909090");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Metallic sheen streaks
    ctx.globalAlpha = 0.22;
    for (let i = 0; i < w; i += 10) {
      const streakGrad = ctx.createLinearGradient(i, 0, i + 5, h);
      streakGrad.addColorStop(0,   "rgba(255,255,255,0)");
      streakGrad.addColorStop(0.4, "rgba(255,255,255,0.7)");
      streakGrad.addColorStop(0.6, "rgba(255,255,255,0.7)");
      streakGrad.addColorStop(1,   "rgba(255,255,255,0)");
      ctx.fillStyle = streakGrad;
      ctx.fillRect(i, 0, 3, h);
    }
    ctx.globalAlpha = 1;

    // Scratch hint text
    ctx.fillStyle = "rgba(60,60,60,0.75)";
    ctx.font = `bold ${Math.max(14, Math.floor(h / 6))}px system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("✦  Scratch to Reveal  ✦", w / 2, h / 2 - h / 12);
    ctx.font = `${Math.max(10, Math.floor(h / 10))}px system-ui, sans-serif`;
    ctx.fillStyle = "rgba(60,60,60,0.5)";
    ctx.fillText("🎁 Birthday gift from the community", w / 2, h / 2 + h / 9);
  }, []);

  useEffect(() => {
    if (isRevealed) return;
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const rect = wrap.getBoundingClientRect();
    canvas.width = rect.width || 700;
    canvas.height = rect.height || 220;
    drawSilver();
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
      let transparent = 0;
      for (let i = 3; i < data.length; i += 4 * 20) if (data[i] < 128) transparent++;
      if (transparent / (data.length / (4 * 20)) > 0.55) setIsRevealed(true);
    }
  }, [isRevealed]);

  const onMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    isDrawing.current = true;
    scratchAt(...Object.values(getPos(e.nativeEvent, canvasRef.current!)) as [number, number]);
  }, [scratchAt]);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    scratchAt(...Object.values(getPos(e.nativeEvent, canvasRef.current!)) as [number, number]);
  }, [scratchAt]);

  const onMouseUp = () => { isDrawing.current = false; };

  const onTouchStart = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    isDrawing.current = true;
    scratchAt(...Object.values(getPos(e.touches[0], canvasRef.current!)) as [number, number]);
  }, [scratchAt]);

  const onTouchMove = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing.current) return;
    scratchAt(...Object.values(getPos(e.touches[0], canvasRef.current!)) as [number, number]);
  }, [scratchAt]);

  return (
    <div id="voucher-section" className="scroll-mt-8">
      <div className="flex items-center gap-3 mb-5">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs font-mono tracking-[0.2em] uppercase text-muted-foreground px-2">
          🎁 Birthday Bonus
        </span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <div ref={wrapRef} className="relative rounded-2xl overflow-hidden shadow-2xl">
        <VoucherContent />

        <AnimatePresence>
          {!isRevealed && (
            <motion.canvas
              ref={canvasRef}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute inset-0 w-full h-full rounded-2xl"
              style={{ cursor: "crosshair", touchAction: "none" }}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseUp}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onMouseUp}
            />
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isRevealed && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-xs text-muted-foreground mt-3 font-mono"
          >
            🎉 Surprise from the community — happy birthday, Mossman!
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
