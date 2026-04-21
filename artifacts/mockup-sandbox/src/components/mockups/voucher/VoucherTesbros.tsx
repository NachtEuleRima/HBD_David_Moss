export function VoucherTesbros() {
  return (
    <div className="min-h-screen bg-zinc-300 flex items-center justify-center">
      <div
        className="relative overflow-hidden shadow-2xl border border-zinc-300"
        style={{
          width: "680px",
          height: "300px",
          background: "#fafaf5",
          fontFamily: "Georgia, serif",
          borderRadius: "10px",
        }}
      >
        {/* Red left accent stripe */}
        <div className="absolute left-0 top-0 bottom-0 w-2 bg-red-600" />

        {/* BACKGROUND WATERMARK */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
          style={{ zIndex: 1 }}
        >
          <div style={{ transform: "rotate(-18deg)", userSelect: "none", whiteSpace: "nowrap" }}>
            <p
              className="font-black text-red-600 tracking-widest leading-none"
              style={{ fontSize: "72px", opacity: 0.10 }}
            >
              ! MOSSMAN ONLY !
            </p>
          </div>
        </div>

        {/* CHECK CONTENT */}
        <div className="relative pl-7 pr-6 pt-5 pb-0" style={{ zIndex: 2 }}>
          {/* Top row: logo image + check number + date */}
          <div className="flex items-start justify-between mb-4">
            <img
              src="/tesbros-logo.jpeg"
              alt="TESbros DIY Wrap Club"
              className="h-14 w-auto object-contain"
            />
            <div className="text-right">
              <p className="text-zinc-400 text-[9px] uppercase tracking-wider">Check No.</p>
              <p className="text-zinc-800 text-sm font-bold font-mono">042069</p>
              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-zinc-400 text-[9px] uppercase tracking-wider">Date</p>
                <p className="text-zinc-800 text-[11px] font-bold">April 26, 2025</p>
              </div>
            </div>
          </div>

          {/* Pay to the order of */}
          <div className="flex items-end gap-3 mb-2">
            <p className="text-zinc-400 text-[10px] uppercase tracking-wider whitespace-nowrap">Pay to the order of</p>
            <div className="flex-1 border-b border-zinc-400">
              <p className="text-zinc-900 text-base font-black pb-0.5">David Moss</p>
            </div>
            <div className="border border-zinc-400 rounded px-3 py-1 min-w-[110px] text-center">
              <p className="text-zinc-400 text-[9px] uppercase leading-none">$</p>
              <p className="text-zinc-900 text-xl font-black tracking-tight leading-tight">420.69</p>
            </div>
          </div>

          {/* Amount written out */}
          <div className="flex items-end gap-3 mb-4">
            <div className="flex-1 border-b border-zinc-400">
              <p className="text-zinc-600 text-[11px] pb-0.5 italic">
                Four hundred twenty and <span className="font-bold not-italic">69/100</span> Dollars ···················································
              </p>
            </div>
            <p className="text-zinc-400 text-[9px] uppercase tracking-wide whitespace-nowrap">Dollars</p>
          </div>

          {/* Memo + Signature */}
          <div className="flex items-end justify-between gap-6">
            <div className="flex items-end gap-2">
              <p className="text-zinc-400 text-[9px] uppercase tracking-wider whitespace-nowrap">Memo</p>
              <div className="border-b border-zinc-400 w-48">
                <p className="text-zinc-600 text-[10px] pb-0.5 italic">NAS only · DIY wrap</p>
              </div>
            </div>
            <div className="text-right">
              <div className="border-b border-zinc-400 w-44 mb-0.5">
                <p className="text-zinc-700 text-sm italic pb-0.5" style={{ fontFamily: "cursive" }}>TESbros HQ</p>
              </div>
              <p className="text-zinc-400 text-[9px] uppercase tracking-wider">Authorized Signature</p>
            </div>
          </div>
        </div>

        {/* MICR / routing line */}
        <div
          className="absolute bottom-0 left-0 right-0 border-t border-zinc-200 bg-zinc-50 px-7 py-2 flex items-center justify-between"
          style={{ zIndex: 2 }}
        >
          <p className="text-zinc-400 text-[10px] font-mono tracking-widest">⑆ 042069042 ⑆ 0420690042069 ⑇ 042069</p>
          <p className="text-zinc-400 text-[9px] uppercase tracking-wider">tesbros.com</p>
        </div>
      </div>
    </div>
  );
}
