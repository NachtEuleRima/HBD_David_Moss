export function VoucherTesbros() {
  return (
    <div className="min-h-screen bg-zinc-200 flex items-center justify-center p-6">
      {/* Horizontal check card */}
      <div
        className="relative overflow-hidden rounded-xl shadow-2xl border border-zinc-300"
        style={{
          width: "620px",
          background: "#fafaf5",
          fontFamily: "Georgia, serif",
        }}
      >
        {/* Red left accent stripe */}
        <div className="absolute left-0 top-0 bottom-0 w-2 bg-red-600" />

        {/* !! SLANTED WARNING WATERMARK !! */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ zIndex: 10 }}
        >
          <div
            style={{ transform: "rotate(-22deg)", userSelect: "none" }}
            className="text-center"
          >
            <p
              className="font-black text-red-600 leading-none tracking-widest"
              style={{ fontSize: "52px", opacity: 0.13, letterSpacing: "0.08em" }}
            >
              ! MOSSMAN ONLY !
            </p>
            <p
              className="font-black text-red-600 leading-none tracking-widest"
              style={{ fontSize: "52px", opacity: 0.13, letterSpacing: "0.08em" }}
            >
              ! MOSSMAN ONLY !
            </p>
          </div>
        </div>

        {/* CHECK CONTENT */}
        <div className="pl-6 pr-6 pt-5 pb-4">
          {/* Top row: logo + check number + date */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <img
                src="/tesbros-logo.jpeg"
                alt="TESbros"
                className="w-12 h-12 rounded-md object-cover border border-zinc-300"
              />
              <div>
                <p className="text-black text-sm font-black tracking-tight leading-none">TESbros</p>
                <p className="text-red-600 text-[10px] font-bold tracking-widest uppercase leading-none mt-0.5">DIY Wrap Club</p>
                <p className="text-zinc-500 text-[9px] mt-0.5">tesbros.com · Est. Who knows</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-zinc-500 text-[9px] uppercase tracking-wider">Check No.</p>
              <p className="text-zinc-800 text-sm font-bold font-mono">042069</p>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-zinc-500 text-[9px] uppercase tracking-wider">Date</p>
                <p className="text-zinc-800 text-[11px] font-bold">April 26, 2025</p>
              </div>
            </div>
          </div>

          {/* Pay to the order of */}
          <div className="flex items-end gap-3 mb-3">
            <p className="text-zinc-500 text-[10px] uppercase tracking-wider whitespace-nowrap">Pay to the order of</p>
            <div className="flex-1 border-b border-zinc-400">
              <p className="text-zinc-900 text-base font-black pb-0.5">David &ldquo;Mossman&rdquo; Moss</p>
            </div>
            <div className="border border-zinc-400 rounded px-3 py-1 min-w-[110px] text-center">
              <p className="text-zinc-500 text-[9px] uppercase tracking-wide leading-none">$</p>
              <p className="text-zinc-900 text-xl font-black tracking-tight leading-tight">420.69</p>
            </div>
          </div>

          {/* Amount written out */}
          <div className="flex items-end gap-3 mb-4">
            <div className="flex-1 border-b border-zinc-400">
              <p className="text-zinc-700 text-[11px] pb-0.5 italic">
                Four hundred twenty and <span className="font-bold not-italic">69/100</span> Dollars ··············································
              </p>
            </div>
            <p className="text-zinc-400 text-[9px] uppercase tracking-wide whitespace-nowrap">Dollars</p>
          </div>

          {/* Memo + Signature row */}
          <div className="flex items-end justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-end gap-2">
                <p className="text-zinc-500 text-[9px] uppercase tracking-wider whitespace-nowrap">Memo</p>
                <div className="flex-1 border-b border-zinc-400">
                  <p className="text-zinc-600 text-[10px] pb-0.5 italic">Birthday gift · Wraps, gear & vibes</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="border-b border-zinc-400 w-40 mb-0.5">
                <p className="text-zinc-700 text-sm italic pb-0.5" style={{ fontFamily: "cursive" }}>TESbros HQ</p>
              </div>
              <p className="text-zinc-400 text-[9px] uppercase tracking-wider">Authorized Signature</p>
            </div>
          </div>
        </div>

        {/* MICR / routing line */}
        <div className="border-t border-zinc-200 bg-zinc-50 px-6 py-2.5 flex items-center justify-between">
          <p className="text-zinc-400 text-[10px] font-mono tracking-widest">⑆ 042069042 ⑆ 0420690042069 ⑇ 042069</p>
          <div className="flex items-center gap-2">
            <div className="bg-red-600 rounded px-2 py-0.5">
              <p className="text-white text-[9px] font-black tracking-widest uppercase">! MOSSMAN ONLY !</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
