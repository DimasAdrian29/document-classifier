import { useEffect, useState } from 'react'

const CLASS_CONFIG = {
  KTP: {
    label: 'Kartu Tanda Penduduk',
    bar: 'bg-blue-500',
    badge: 'bg-blue-50 text-blue-700 border-blue-200',
    dot: 'bg-blue-500',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z"/>
      </svg>
    )
  },
  SIM: {
    label: 'Surat Izin Mengemudi',
    bar: 'bg-emerald-500',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"/>
      </svg>
    )
  },
  Passport: {
    label: 'Paspor',
    bar: 'bg-violet-500',
    badge: 'bg-violet-50 text-violet-700 border-violet-200',
    dot: 'bg-violet-500',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"/>
      </svg>
    )
  },
  Other: {
    label: 'Dokumen Lainnya',
    bar: 'bg-amber-500',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/>
      </svg>
    )
  }
}

function Bar({ label, cfg, value, isMain, delay }) {
  const [width, setWidth] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setWidth(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])

  return (
    <div className={`rounded-xl transition-colors ${isMain ? 'bg-slate-50 border border-slate-200 p-3' : 'px-0 py-2'}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={isMain ? `text-${cfg.bar.split('-')[1]}-600` : 'text-slate-300'}>
            {cfg.icon}
          </span>
          <span className={`text-sm font-medium ${isMain ? 'text-gray-900' : 'text-slate-400'}`}>{label}</span>
          {isMain && (
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${cfg.badge}`}>
              Prediksi
            </span>
          )}
        </div>
        <span className={`font-mono text-sm font-semibold ${isMain ? 'text-gray-900' : 'text-slate-300'}`}>
          {value.toFixed(1)}%
        </span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${cfg.bar} ${isMain ? '' : 'opacity-40'}`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  )
}

export default function ResultCard({ result, previewUrl, onReset }) {
  const { prediction, all_confidences, file_info, process_time_ms } = result
  const cfg = CLASS_CONFIG[prediction.class] || CLASS_CONFIG.Other
  const classOrder = ['KTP', 'SIM', 'Passport', 'Other']

  const confColor =
    prediction.confidence >= 90 ? 'text-emerald-600' :
    prediction.confidence >= 75 ? 'text-blue-600' :
    prediction.confidence >= 50 ? 'text-amber-600' : 'text-red-600'

  return (
    <div className="space-y-4 fade-up">
      {/* Result utama */}
      <div className="card p-5 border-l-4" style={{ borderLeftColor: cfg.bar.includes('blue') ? '#3b82f6' : cfg.bar.includes('emerald') ? '#10b981' : cfg.bar.includes('violet') ? '#8b5cf6' : '#f59e0b' }}>
        <div className="flex items-start gap-4">
          {previewUrl && (
            <div className="shrink-0 w-20 h-14 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
              <img src={previewUrl} alt="dokumen" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cfg.badge}`}>
                {prediction.class}
              </span>
              <span className={`text-xs font-medium ${confColor}`}>
                {prediction.confidence_level}
              </span>
            </div>
            <h2 className="font-bold text-gray-900 text-lg leading-snug">{prediction.label}</h2>
            <p className="text-slate-400 text-xs mt-0.5 font-mono truncate">{file_info.filename}</p>
          </div>
          <div className="shrink-0 text-right">
            <p className={`font-mono font-bold text-3xl leading-none ${confColor}`}>
              {prediction.confidence.toFixed(1)}%
            </p>
            <p className="text-xs text-slate-400 mt-1">confidence</p>
          </div>
        </div>

        {/* Meta */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 flex-wrap text-xs font-mono text-slate-400">
          <span>{file_info.size_kb} KB</span>
          <span>·</span>
          <span>{file_info.type?.split('/')[1]?.toUpperCase()}</span>
          <span>·</span>
          {result.from_cache ? (
            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-sans font-medium">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
              Dari cache — instan
            </span>
          ) : (
            <span>Diproses dalam {process_time_ms} ms</span>
          )}
        </div>
      </div>

      {/* Confidence breakdown */}
      <div className="card p-5">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Distribusi Confidence</p>
        <div className="space-y-1">
          {classOrder.map((cls, i) => (
            <Bar
              key={cls}
              label={CLASS_CONFIG[cls]?.label || cls}
              cfg={CLASS_CONFIG[cls] || CLASS_CONFIG.Other}
              value={all_confidences[cls] || 0}
              isMain={cls === prediction.class}
              delay={i * 80}
            />
          ))}
        </div>
      </div>

      <button onClick={onReset} className="btn-primary w-full">
        Klasifikasikan dokumen lain
      </button>
    </div>
  )
}