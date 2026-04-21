export function VoucherTesbros() {
  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-6">
      <div className="w-[380px] rounded-2xl overflow-hidden shadow-2xl" style={{ background: "#111111" }}>
        {/* Top red bar */}
        <div className="bg-red-600 px-6 py-3 flex items-center justify-between">
          <span className="text-white text-xs font-black tracking-[0.2em] uppercase">DIY Wrap Club</span>
          <span className="text-white/80 text-xs font-bold">The Mossma Edition™</span>
        </div>

        {/* Logo section */}
        <div className="flex items-center gap-4 px-6 pt-6 pb-4">
          <img src="/tesbros-logo.jpeg" alt="TESbros" className="w-20 h-20 rounded-lg object-cover" />
          <div>
            <p className="text-zinc-400 text-[10px] tracking-widest uppercase">Gift Card</p>
            <p className="text-white text-2xl font-black tracking-tight leading-tight">TESBROS<br/>OFFICIAL</p>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-6 h-px bg-zinc-800" />

        {/* Amount */}
        <div className="px-6 py-5 text-center">
          <p className="text-zinc-500 text-xs tracking-widest uppercase mb-1">Gift Value</p>
          <p className="text-white text-7xl font-black tracking-tight">$420</p>
          <p className="text-red-500 text-2xl font-black">.69</p>
          <p className="text-zinc-500 text-xs mt-1">Because legends deserve legendary numbers</p>
        </div>

        {/* Warning */}
        <div className="mx-0 bg-red-600 py-4 px-6 text-center">
          <p className="text-white text-[10px] font-black tracking-[0.3em] uppercase mb-0.5">⚠️ ATTENTION ⚠️</p>
          <p className="text-white text-3xl font-black tracking-widest">MOSSMAN ONLY</p>
          <p className="text-red-200 text-xs mt-1 font-medium">Non-Mossmans will be denied at the wrap table</p>
        </div>

        {/* Details */}
        <div className="px-6 py-5 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-zinc-500 text-xs uppercase tracking-wider">Valid For</span>
            <span className="text-white text-xs font-bold">Wraps, Gear & All Things TESbros</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-zinc-500 text-xs uppercase tracking-wider">Expires</span>
            <span className="text-white text-xs font-bold">Never (it's Mossman's)</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-zinc-500 text-xs uppercase tracking-wider">Transferable</span>
            <span className="text-red-500 text-xs font-black">ABSOLUTELY NOT</span>
          </div>
        </div>

        {/* Barcode-style footer */}
        <div className="px-6 pb-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-center">
            <div className="flex justify-center gap-px mb-2">
              {Array.from({ length: 40 }).map((_, i) => (
                <div key={i} className="bg-zinc-300" style={{ width: i % 3 === 0 ? "3px" : "1.5px", height: "32px" }} />
              ))}
            </div>
            <p className="text-zinc-500 text-[9px] tracking-widest font-mono">MOSSM-042069-TESBRO</p>
          </div>
        </div>

        {/* Bottom */}
        <div className="bg-red-600 h-1.5 w-full" />
      </div>
    </div>
  );
}
