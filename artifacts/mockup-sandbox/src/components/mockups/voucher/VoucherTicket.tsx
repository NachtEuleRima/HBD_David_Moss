export function VoucherTicket() {
  return (
    <div className="min-h-screen bg-zinc-800 flex items-center justify-center p-6">
      <div className="w-[380px]">
        {/* Main ticket body */}
        <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #0f2040 100%)" }}>
          {/* Top header */}
          <div className="px-6 pt-6 pb-3 flex items-start justify-between">
            <div>
              <p className="text-blue-300 text-[10px] tracking-[0.3em] uppercase font-bold">TESbros DIY Wrap Club</p>
              <p className="text-white text-3xl font-black tracking-tight mt-1">ADMIT ONE</p>
            </div>
            <img src="/tesbros-logo.jpeg" alt="TESbros" className="w-16 h-16 rounded-lg object-cover border-2 border-blue-400/30" />
          </div>

          {/* Non-transferable banner */}
          <div className="mx-0 bg-red-600/90 py-2.5 px-6 flex items-center gap-3">
            <span className="text-white text-sm">⛔</span>
            <p className="text-white text-sm font-black tracking-[0.15em] uppercase">NON-TRANSFERABLE — MOSSMAN ONLY</p>
          </div>

          {/* Event info */}
          <div className="px-6 py-5">
            <p className="text-blue-200 text-xs uppercase tracking-widest mb-1">Ticket Holder</p>
            <p className="text-white text-2xl font-black mb-4">David "Mossman" Moss</p>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-blue-300 text-[9px] uppercase tracking-wider">Event</p>
                <p className="text-white text-sm font-bold">Birthday Wrap Haul</p>
              </div>
              <div>
                <p className="text-blue-300 text-[9px] uppercase tracking-wider">Date</p>
                <p className="text-white text-sm font-bold">April 26, 2025</p>
              </div>
              <div>
                <p className="text-blue-300 text-[9px] uppercase tracking-wider">Seat</p>
                <p className="text-white text-sm font-bold">Front Row, Coast-to-Coast</p>
              </div>
              <div>
                <p className="text-blue-300 text-[9px] uppercase tracking-wider">Section</p>
                <p className="text-white text-sm font-bold">FSD Knight Class</p>
              </div>
            </div>

            {/* Amount */}
            <div className="bg-white/10 rounded-xl p-4 text-center border border-white/10">
              <p className="text-blue-200 text-[10px] uppercase tracking-widest mb-1">Gift Value</p>
              <p className="text-white text-5xl font-black">$420.69</p>
              <p className="text-blue-200/70 text-xs mt-1 italic">"Nice." — David, probably</p>
            </div>
          </div>

          {/* Perforated edge */}
          <div className="flex items-center px-3 my-1">
            <div className="w-5 h-5 rounded-full bg-zinc-800 -ml-8" />
            <div className="flex-1 border-t-2 border-dashed border-blue-400/20 mx-2" />
            <div className="w-5 h-5 rounded-full bg-zinc-800 -mr-8" />
          </div>

          {/* Stub */}
          <div className="px-6 pb-5 pt-3 flex items-center justify-between">
            <div>
              <p className="text-blue-300 text-[9px] uppercase tracking-widest">Stub / Keepsake</p>
              <p className="text-white text-xs font-bold font-mono mt-1">MOSSM • 042069 • TBRWC</p>
            </div>
            <div className="flex justify-center gap-px">
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="bg-blue-300/60" style={{ width: i % 3 === 0 ? "3px" : "1.5px", height: "28px" }} />
              ))}
            </div>
          </div>
        </div>

        <p className="text-zinc-500 text-[9px] text-center mt-3 tracking-wide">
          Valid for Mossman exclusively. FSD autonomy not included. Not responsible for LiDAR-related incidents.
        </p>
      </div>
    </div>
  );
}
