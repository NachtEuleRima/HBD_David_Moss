import { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

function VoucherContent() {
  return (
    <div
      className="relative overflow-hidden rounded-xl border border-zinc-600/40 select-none"
      style={{ background: "#fafaf5", fontFamily: "Georgia, serif" }}
    >
      {/* Red left accent stripe */}
      <div className="absolute left-0 top-0 bottom-0 w-2 bg-red-600" />

      {/* WATERMARK */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
        style={{ zIndex: 1 }}
        aria-hidden="true"
      >
        <div style={{ transform: "rotate(-18deg)", userSelect: "none", whiteSpace: "nowrap" }}>
          <p className="font-black text-red-600 tracking-widest leading-none"
            style={{ fontSize: "clamp(40px, 8vw, 72px)", opacity: 0.10 }}>
            !! MOSSMAN ONLY !!
          </p>
        </div>
      </div>

      {/* CHECK CONTENT */}
      <div className="relative pl-6 pr-5 pt-4 pb-0" style={{ zIndex: 2 }}>
        {/* Top row */}
        <div className="flex items-start justify-between mb-4">
          <img
            src="/tesbros-logo.jpeg"
            alt="TESbros DIY Wrap Club"
            className="h-12 w-auto object-contain"
            draggable={false}
          />
          <div className="text-right">
            <p className="text-zinc-400 text-[9px] uppercase tracking-wider">Check No.</p>
            <p className="text-zinc-800 text-sm font-bold font-mono">042069</p>
            <div className="flex items-center gap-1.5 mt-0.5 justify-end">
              <p className="text-zinc-400 text-[9px] uppercase tracking-wider">Date</p>
              <p className="text-zinc-800 text-[11px] font-bold">April 26, 2025</p>
            </div>
          </div>
        </div>

        {/* Pay to */}
        <div className="flex items-end gap-2 mb-2">
          <p className="text-zinc-400 text-[9px] uppercase tracking-wider whitespace-nowrap">Pay to the order of</p>
          <div className="flex-1 border-b border-zinc-400">
            <p className="text-zinc-900 text-sm font-black pb-0.5">David Moss</p>
          </div>
          <div className="border border-zinc-400 rounded px-2 py-0.5 min-w-[90px] text-center">
            <p className="text-zinc-400 text-[9px] leading-none">$</p>
            <p className="text-zinc-900 text-lg font-black tracking-tight leading-tight">420.69</p>
          </div>
        </div>

        {/* Written amount */}
        <div className="flex items-end gap-2 mb-3">
          <div className="flex-1 border-b border-zinc-400">
            <p className="text-zinc-600 text-[10px] pb-0.5 italic">
              Four hundred twenty and <span className="font-bold not-italic">69/100</span> Dollars ··········································
            </p>
          </div>
          <p className="text-zinc-400 text-[9px] uppercase tracking-wide whitespace-nowrap">Dollars</p>
        </div>

        {/* Memo + Signature */}
        <div className="flex items-end justify-between gap-4">
          <div className="flex items-end gap-1.5">
            <p className="text-zinc-400 text-[9px] uppercase tracking-wider whitespace-nowrap">Memo</p>
            <div className="border-b border-zinc-400 w-36">
              <p className="text-zinc-600 text-[10px] pb-0.5 italic">NAS only · DIY wrap</p>
            </div>
          </div>
          <div className="text-right">
            <div className="border-b border-zinc-400 w-36 mb-0.5">
              <p className="text-zinc-700 text-xs italic pb-0.5" style={{ fontFamily: "cursive" }}>TESbros HQ</p>
            </div>
            <p className="text-zinc-400 text-[8px] uppercase tracking-wider">Authorized Signature</p>
          </div>
        </div>
      </div>

      {/* MICR line */}
      <div className="border-t border-zinc-200 bg-zinc-50 px-6 py-2 flex items-center justify-between mt-3"
        style={{ zIndex: 2, position: "relative" }}>
        <p className="text-zinc-400 text-[9px] font-mono tracking-widest">⑆ 042069042 ⑆ 0420690042069 ⑇ 042069</p>
        <p className="text-zinc-400 text-[8px] uppercase tracking-wider">tesbros.com</p>
      </div>
    </div>
  );
}

export function ScratchVoucher() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const isDrawing = useRef(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [hintVisible, setHintVisible] = useState(true);

  const drawSilver = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;

    ctx.globalCompositeOperation = "source-over";
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0,    "#b8b8b8");
    grad.addColorStop(0.15, "#e0e0e0");
    grad.addColorStop(0.3,  "#a0a0a0");
    grad.addColorStop(0.5,  "#d8d8d8");
    grad.addColorStop(0.65, "#c0c0c0");
    grad.addColorStop(0.8,  "#e8e8e8");
    grad.addColorStop(1,    "#a8a8a8");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Subtle sheen lines
    ctx.globalAlpha = 0.18;
    for (let i = 0; i < w; i += 8) {
      const lg = ctx.createLinearGradient(i, 0, i + 4, h);
      lg.addColorStop(0, "rgba(255,255,255,0)");
      lg.addColorStop(0.5, "rgba(255,255,255,0.6)");
      lg.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = lg;
      ctx.fillRect(i, 0, 2, h);
    }
    ctx.globalAlpha = 1;

    // Hint text
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "rgba(80,80,80,0.7)";
    ctx.font = `bold ${Math.max(13, Math.floor(h / 7))}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("✦  Scratch to Reveal  ✦", w / 2, h / 2);
  }, []);

  useEffect(() => {
    if (isRevealed) return;
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const rect = wrap.getBoundingClientRect();
    canvas.width = rect.width || 600;
    canvas.height = rect.height || 200;
    drawSilver();
  }, [isRevealed, drawSilver]);

  const getPos = (e: MouseEvent | Touch, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const scratchAt = useCallback((x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    setHintVisible(false);
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, Math.max(22, canvas.width / 18), 0, Math.PI * 2);
    ctx.fill();

    if (Math.random() < 0.12) {
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let transparent = 0;
      for (let i = 3; i < data.length; i += 4 * 16) {
        if (data[i] < 128) transparent++;
      }
      if (transparent / (data.length / (4 * 16)) > 0.55) {
        setIsRevealed(true);
      }
    }
  }, [isRevealed]);

  const onMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    isDrawing.current = true;
    const pos = getPos(e.nativeEvent, canvasRef.current!);
    scratchAt(pos.x, pos.y);
  }, [scratchAt]);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    const pos = getPos(e.nativeEvent, canvasRef.current!);
    scratchAt(pos.x, pos.y);
  }, [scratchAt]);

  const onMouseUp = () => { isDrawing.current = false; };

  const onTouchStart = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    isDrawing.current = true;
    const pos = getPos(e.touches[0], canvasRef.current!);
    scratchAt(pos.x, pos.y);
  }, [scratchAt]);

  const onTouchMove = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing.current) return;
    const pos = getPos(e.touches[0], canvasRef.current!);
    scratchAt(pos.x, pos.y);
  }, [scratchAt]);

  return (
    <div id="voucher-section" className="scroll-mt-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs font-mono tracking-[0.2em] uppercase text-muted-foreground">
          🎁 Birthday Bonus
        </span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <div ref={wrapRef} className="relative rounded-xl overflow-hidden">
        <VoucherContent />

        <AnimatePresence>
          {!isRevealed && (
            <motion.canvas
              ref={canvasRef}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 w-full h-full rounded-xl"
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

        {isRevealed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-2 right-3 bg-red-600 text-white text-[10px] font-black tracking-widest px-2 py-1 rounded"
            style={{ fontStyle: "italic" }}
          >
            !! MOSSMAN ONLY !!
          </motion.div>
        )}
      </div>

      {isRevealed && (
        <motion.p
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-xs text-muted-foreground mt-2 font-mono"
        >
          🎉 Surprise! A little something extra for the birthday legend.
        </motion.p>
      )}
    </div>
  );
}
