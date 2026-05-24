const CLASS_BADGE = {
  KTP:      'bg-blue-50 text-blue-700 border-blue-200',
  SIM:      'bg-emerald-50 text-emerald-700 border-emerald-200',
  Passport: 'bg-violet-50 text-violet-700 border-violet-200',
  Other:    'bg-amber-50 text-amber-700 border-amber-200',
}

function formatTime(date) {
  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  }).format(date)
}

export default function HistoryPanel({ history, onClear }) {
  if (!history.length) return null
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Riwayat</p>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-mono">{history.length} dokumen</span>
          <button onClick={onClear} className="text-xs text-red-400 hover:text-red-600 transition-colors">
            Hapus semua
          </button>
        </div>
      </div>
      <div className="space-y-1 max-h-52 overflow-y-auto">
        {history.map((item, i) => (
          <div key={i} className="flex items-center gap-3 hover:bg-slate-50 rounded-xl p-2 transition-colors">
            {item.previewUrl && (
              <div className="shrink-0 w-9 h-7 rounded-lg overflow-hidden border border-slate-200">
                <img src={item.previewUrl} alt="" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-700 truncate font-medium">{item.filename}</p>
              <p className="text-xs text-slate-400 font-mono">{formatTime(item.timestamp)}</p>
            </div>
            <span className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${CLASS_BADGE[item.class] || ''}`}>
              {item.class} · {item.confidence}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}