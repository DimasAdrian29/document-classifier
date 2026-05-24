export default function Header({ apiStatus }) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="1" width="5" height="5" rx="1" fill="white"/>
              <rect x="8" y="1" width="5" height="5" rx="1" fill="white" opacity="0.6"/>
              <rect x="1" y="8" width="5" height="5" rx="1" fill="white" opacity="0.6"/>
              <rect x="8" y="8" width="5" height="5" rx="1" fill="white"/>
            </svg>
          </div>
          <span className="font-semibold text-gray-900 text-sm">DocID Classifier</span>
          <span className="text-slate-300 text-xs hidden sm:block">|</span>
          <span className="text-slate-400 text-xs hidden sm:block">Sistem Klasifikasi Dokumen Identitas</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${
            apiStatus === 'online' ? 'bg-emerald-500' :
            apiStatus === 'offline' ? 'bg-red-500' : 'bg-amber-400 animate-pulse'
          }`} />
          <span className="text-xs text-slate-500 font-mono">
            {apiStatus === 'online' ? 'Model aktif' :
             apiStatus === 'offline' ? 'Server offline' : 'Menghubungkan...'}
          </span>
        </div>
      </div>
    </header>
  )
}