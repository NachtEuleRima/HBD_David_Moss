export function VoucherLuxury() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
      <div className="w-[380px] rounded-2xl overflow-hidden border border-yellow-500/30 shadow-2xl shadow-yellow-900/20" style={{ background: "linear-gradient(135deg, #0f0f1a 0%, #1a1228 50%, #0f0f1a 100%)" }}>
        {/* Gold top stripe */}
        <div className="h-1.5 w-full" style={{ background: "linear-gradient(90deg, #b8860b, #ffd700, #b8860b)" }} />

        {/* Header */}
        <div className="flex flex-col items-center pt-8 pb-4 px-6">
          <img src="/tesbros-logo.jpeg" alt="TESbros" className="w-24 h-24 rounded-xl object-cover mb-4 border border-yellow-600/30" />
          <p className="text-yellow-500/70 text-xs tracking-[0.3em] uppercase font-light">Presents</p>
          <h1 className="text-yellow-400 text-2xl font-bold tracking-widest mt-1" style={{ fontFamily: "Georgia, serif" }}>GIFT CERTIFICATE</h1>
          <div className="w-24 h-px mt-3" style={{ background: "linear-gradient(90deg, transparent, #ffd700, transparent)" }} />
        </div>

        {/* Amount */}
        <div className="text-center py-4 px-6">
          <p className="text-yellow-500/60 text-xs tracking-[0.25em] uppercase mb-1">Value</p>
          <p className="text-white text-6xl font-bold tracking-tight" style={{ fontFamily: "Georgia, serif" }}>$420.69</p>
          <p className="text-yellow-500/50 text-xs mt-2 italic">Four hundred twenty dollars and sixty-nine cents</p>
        </div>

        {/* Red warning */}
        <div className="mx-4 my-3 bg-red-600 rounded-lg py-3 px-4 text-center border border-red-400/30 shadow-lg shadow-red-900/40">
          <p className="text-white text-xs tracking-[0.2em] uppercase font-bold">⛔ WARNING ⛔</p>
          <p className="text-white text-xl font-black tracking-widest mt-0.5">MOSSMAN ONLY</p>
          <p className="text-red-200 text-xs mt-0.5 italic">Unauthorized use is technically impossible — you're not the Mossma</p>
        </div>

        {/* Details */}
        <div className="px-6 py-4 text-center space-y-1">
          <p className="text-yellow-400/80 text-sm font-medium">TESbros DIY Wrap Club</p>
          <p className="text-zinc-400 text-xs">Redeemable for wrapping supplies, gear & vibes</p>
          <p className="text-zinc-500 text-xs">Valid: April 26th, 2025 — Forever (for Mossman)</p>
        </div>

        {/* Fine print */}
        <div className="px-6 pb-6 text-center">
          <div className="w-24 h-px mx-auto mb-3" style={{ background: "linear-gradient(90deg, transparent, #ffd700, transparent)" }} />
          <p className="text-zinc-600 text-[9px] leading-relaxed">
            Not valid for non-Mossmans. Cannot be combined with FSD autonomy. TESbros reserves the right to revoke if David installs LiDAR. Not responsible for wrap decisions made under the influence of v14.3.x.
          </p>
        </div>

        {/* Gold bottom stripe */}
        <div className="h-1.5 w-full" style={{ background: "linear-gradient(90deg, #b8860b, #ffd700, #b8860b)" }} />
      </div>
    </div>
  );
}
