import { useState, useRef, useCallback } from 'react'

const ACCEPTED = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

const IconUpload = () => (
  <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
  </svg>
)

const IconSun = () => (
  <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
  </svg>
)

const IconFrame = () => (
  <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
  </svg>
)

const IconZoom = () => (
  <svg className="w-4 h-4 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
  </svg>
)

export default function UploadZone({ onFileSelect, isLoading, previewUrl }) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState(null)
  const inputRef = useRef(null)

  const handleFile = useCallback((file) => {
    if (!ACCEPTED.includes(file.type)) {
      setError('Format tidak didukung. Gunakan JPG, PNG, atau WEBP.')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Ukuran file maksimal 10MB.')
      return
    }
    setError(null)
    onFileSelect(file)
  }, [onFileSelect])

  const handleDrop = (e) => {
    e.preventDefault(); setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <div className="space-y-3">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onClick={() => !isLoading && inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl transition-all duration-200 overflow-hidden ${
          isLoading ? 'border-blue-200 bg-blue-50 cursor-wait' :
          isDragging ? 'border-blue-500 bg-blue-50 scale-[1.01]' :
          'border-slate-200 hover:border-blue-400 hover:bg-slate-50 cursor-pointer'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          onChange={(e) => { const f = e.target.files[0]; if (f) handleFile(f); e.target.value = '' }}
          className="hidden"
          disabled={isLoading}
        />

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-14 gap-4">
            <div className="relative">
              <div className="w-14 h-14 border-[3px] border-blue-100 rounded-full" />
              <div className="w-14 h-14 border-[3px] border-blue-600 border-t-transparent rounded-full animate-spin absolute inset-0" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-blue-700">Menganalisis dokumen...</p>
              <p className="text-xs text-slate-400 mt-1">Model deep learning sedang berjalan</p>
            </div>
          </div>
        ) : previewUrl ? (
          <div className="relative">
            <img src={previewUrl} alt="preview" className="w-full max-h-56 object-contain bg-slate-50 py-4" />
            <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center">
              <span className="opacity-0 hover:opacity-100 text-xs font-medium text-white bg-black/50 px-3 py-1.5 rounded-full transition-opacity">
                Klik untuk ganti
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            {/* Ilustrasi dokumen */}
            <div className="relative">
              <div className="w-20 h-24 bg-white border-2 border-slate-200 rounded-xl shadow-sm flex flex-col p-2 gap-1.5">
                <div className="h-1.5 bg-slate-200 rounded-full w-3/4" />
                <div className="h-1.5 bg-slate-200 rounded-full w-full" />
                <div className="h-1.5 bg-slate-200 rounded-full w-5/6" />
                <div className="mt-1 w-8 h-8 bg-slate-100 rounded-lg mx-auto" />
                <div className="h-1.5 bg-slate-200 rounded-full w-2/3 mx-auto" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-md">
                <IconUpload />
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm font-semibold text-gray-900 mb-1">
                {isDragging ? 'Lepaskan file di sini' : 'Upload foto dokumen'}
              </p>
              <p className="text-xs text-slate-400">Drag & drop atau klik untuk pilih file</p>
            </div>

            <div className="flex items-center gap-2">
              {['JPG', 'PNG', 'WEBP'].map(f => (
                <span key={f} className="px-2 py-0.5 bg-slate-100 text-slate-500 text-xs font-mono rounded-md">{f}</span>
              ))}
              <span className="text-slate-300 text-xs">· Maks 10MB</span>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5 text-red-700 text-xs">
          <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
          </svg>
          {error}
        </div>
      )}

      {/* Tips — SVG icon, bukan emoji */}
      <div className="grid grid-cols-3 gap-2">
        {[
          [<IconSun />, 'Pencahayaan cukup & merata'],
          [<IconFrame />, 'Seluruh dokumen terlihat'],
          [<IconZoom />, 'Resolusi minimal 300px'],
        ].map(([icon, text], i) => (
          <div key={i} className="flex items-start gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2.5">
            <span className="mt-0.5 shrink-0">{icon}</span>
            <span className="text-xs text-slate-500 leading-snug">{text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}