export function VoucherOfficial() {
  return (
    <div className="min-h-screen bg-stone-200 flex items-center justify-center p-6">
      <div className="w-[380px] rounded-sm overflow-hidden shadow-2xl border-4 border-double border-stone-700" style={{ background: "#fdf8f0", fontFamily: "Georgia, serif" }}>
        {/* Header */}
        <div className="bg-stone-800 text-center py-3 px-4">
          <p className="text-yellow-400 text-[10px] tracking-[0.3em] uppercase">Official Document — Serial No. 042069</p>
        </div>

        <div className="px-8 py-6">
          {/* Seal + logo row */}
          <div className="flex items-center justify-between mb-4">
            <div className="w-16 h-16 rounded-full border-2 border-stone-600 flex items-center justify-center bg-stone-100">
              <span className="text-stone-600 text-[8px] text-center leading-tight font-bold tracking-tight">OFFICIAL<br/>SEAL<br/>★</span>
            </div>
            <div className="text-center">
              <p className="text-stone-700 text-lg font-black tracking-[0.2em] uppercase">Certificate</p>
              <p className="text-stone-500 text-[10px] tracking-widest uppercase">of Gift Entitlement</p>
            </div>
            <img src="/tesbros-logo.jpeg" alt="TESbros" className="w-16 h-16 rounded object-cover border border-stone-400" />
          </div>

          <div className="border-t border-b border-stone-400 py-4 my-3 text-center">
            <p className="text-stone-600 text-xs leading-relaxed">
              This hereby certifies that <span className="font-black text-stone-800 underline">DAVID "MOSSMAN" MOSS</span>,<br />
              FSD Knight, LiDAR Skeptic & Birthday Legend, is<br />
              lawfully entitled to the sum of
            </p>
            <p className="text-stone-900 text-5xl font-black my-3">$420.69</p>
            <p className="text-stone-500 text-[10px] italic">FOUR HUNDRED TWENTY DOLLARS AND SIXTY-NINE CENTS</p>
            <p className="text-stone-600 text-xs mt-2">toward TESbros DIY Wrap Club merchandise & supplies.</p>
          </div>

          {/* Red stamp warning */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center justify-center" style={{ transform: "rotate(-8deg)" }}>
              <div className="border-4 border-red-600 rounded px-4 py-2 text-center" style={{ opacity: 0.9 }}>
                <p className="text-red-600 text-[10px] font-black tracking-[0.2em] uppercase">⛔ CLASSIFIED ⛔</p>
                <p className="text-red-600 text-2xl font-black tracking-widest">MOSSMAN</p>
                <p className="text-red-600 text-[10px] font-black tracking-[0.2em] uppercase">ONLY</p>
              </div>
            </div>
            <div style={{ height: "80px" }} />
          </div>

          {/* Signatures */}
          <div className="flex justify-between mt-4 pt-3 border-t border-stone-300">
            <div className="text-center">
              <p className="text-stone-700 text-sm italic" style={{ fontFamily: "cursive" }}>TESbros HQ</p>
              <div className="w-24 h-px bg-stone-500 mt-1" />
              <p className="text-stone-500 text-[9px] mt-1">Authorized Signatory</p>
            </div>
            <div className="text-center">
              <p className="text-stone-700 text-sm italic" style={{ fontFamily: "cursive" }}>April 26, 2025</p>
              <div className="w-24 h-px bg-stone-500 mt-1" />
              <p className="text-stone-500 text-[9px] mt-1">Date of Issue</p>
            </div>
          </div>

          <p className="text-stone-400 text-[8px] text-center mt-4 leading-relaxed">
            Void if transferred to non-Mossmans. Not valid in states that mandate LiDAR. TESbros is not liable for any FSD-induced detours during redemption.
          </p>
        </div>

        <div className="bg-stone-800 text-center py-2">
          <p className="text-yellow-400 text-[9px] tracking-widest uppercase">Issued by TESbros DIY Wrap Club • Est. Mossma Edition</p>
        </div>
      </div>
    </div>
  );
}
