export function VoucherTesbros() {
  return (
    <div className="min-h-screen bg-zinc-300 flex items-center justify-center p-8">
      <div
        className="relative overflow-hidden rounded-xl shadow-2xl border border-zinc-300"
        style={{ width: "660px", background: "#fafaf5", fontFamily: "Georgia, serif" }}
      >
        {/* Red left accent stripe */}
        <div className="absolute left-0 top-0 bottom-0 w-2 bg-red-600" />

        {/* CHECK CONTENT */}
        <div className="pl-7 pr-6 pt-5 pb-4">
          {/* Top row: logo + check number + date */}
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-3">
              <img
                src="/tesbros-logo.jpeg"
                alt="TESbros"
                className="w-11 h-11 rounded-md object-cover border border-zinc-300"
              />
              <div>
                <p className="text-black text-sm font-black tracking-tight leading-none">TESbros</p>
                <p className="text-red-600 text-[10px] font-bold tracking-widest uppercase leading-none mt-0.5">DIY Wrap Club</p>
                <p className="text-zinc-400 text-[9px] mt-0.5">tesbros.com</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-zinc-400 text-[9px] uppercase tracking-wider">Check No.</p>
              <p className="text-zinc-800 text-sm font-bold font-mono">042069</p>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-zinc-400 text-[9px] uppercase tracking-wider">Date</p>
                <p className="text-zinc-800 text-[11px] font-bold">April 26, 2025</p>
              </div>
            </div>
          </div>

          {/* Pay to the order of */}
          <div className="flex items-end gap-3 mb-3">
            <p className="text-zinc-400 text-[10px] uppercase tracking-wider whitespace-nowrap">Pay to the order of</p>
            <div className="flex-1 border-b border-zinc-400">
              <p className="text-zinc-900 text-base font-black pb-0.5">David Moss</p>
            </div>
            <div className="border border-zinc-400 rounded px-3 py-1 min-w-[110px] text-center">
              <p className="text-zinc-400 text-[9px] uppercase tracking-wide leading-none">$</p>
              <p className="text-zinc-900 text-xl font-black tracking-tight leading-tight">420.69</p>
            </div>
          </div>

          {/* Amount written out */}
          <div className="flex items-end gap-3 mb-5">
            <div className="flex-1 border-b border-zinc-400">
              <p className="text-zinc-600 text-[11px] pb-0.5 italic">
                Four hundred twenty and <span className="font-bold not-italic">69/100</span> Dollars ··············································
              </p>
            </div>
            <p className="text-zinc-400 text-[9px] uppercase tracking-wide whitespace-nowrap">Dollars</p>
          </div>

          {/* Memo + Signature row */}
          <div className="flex items-end justify-between gap-6">
            <div className="flex items-end gap-2">
              <p className="text-zinc-400 text-[9px] uppercase tracking-wider whitespace-nowrap">Memo</p>
              <div className="border-b border-zinc-400 w-52">
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
        <div className="border-t border-zinc-200 bg-zinc-50 px-7 py-2.5 flex items-center justify-between">
          <p className="text-zinc-400 text-[10px] font-mono tracking-widest">⑆ 042069042 ⑆ 0420690042069 ⑇ 042069</p>
          <div className="bg-red-600 rounded px-3 py-1 flex items-center gap-1.5">
            <span className="text-white text-sm font-black" style={{ transform: "rotate(-10deg)", display: "inline-block" }}>!</span>
            <p className="text-white text-[10px] font-black tracking-widest uppercase" style={{ fontStyle: "italic" }}>MOSSMAN ONLY</p>
            <span className="text-white text-sm font-black" style={{ transform: "rotate(10deg)", display: "inline-block" }}>!</span>
          </div>
        </div>
      </div>
    </div>
  );
}
