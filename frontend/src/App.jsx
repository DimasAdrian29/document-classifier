import { useState, useCallback, useRef, useEffect } from "react";

const API_BASE = "";

const DOC_TYPES = [
  {
    key: "KTP",
    label: "Kartu Tanda Penduduk",
    icon: "ti-id",
    color: "#1d4ed8",
    bg: "#eff6ff",
    border: "#bfdbfe",
  },
  {
    key: "SIM",
    label: "Surat Izin Mengemudi",
    icon: "ti-steering-wheel",
    color: "#16a34a",
    bg: "#f0fdf4",
    border: "#bbf7d0",
  },
  {
    key: "Passport",
    label: "Passport Internasional",
    icon: "ti-world",
    color: "#7c3aed",
    bg: "#f5f3ff",
    border: "#ddd6fe",
  },
  {
    key: "Other",
    label: "Dokumen Lainnya",
    icon: "ti-file-description",
    color: "#b45309",
    bg: "#fffbeb",
    border: "#fde68a",
  },
];

const MODEL_INFO = [
  { label: "Arsitektur", value: "MobileNetV2" },
  { label: "Pretrained", value: "ImageNet" },
  { label: "Dataset", value: "2.388 gambar" },
  { label: "Val. Accuracy", value: "89.14%" },
  { label: "Macro F1", value: "0.8923" },
  { label: "Inferensi", value: "~150ms" },
];

function Header({ page, setPage, modelLoaded }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navItems = [
    { key: "classifier", label: "Classifier" },
    { key: "history", label: "Riwayat" },
    { key: "about", label: "Tentang Model" },
  ];
  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        height: 48,
        background: "white",
        borderBottom: "1px solid #f1f5f9",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            background: "#1e40af",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <i
            className="ti ti-file-certificate"
            style={{ fontSize: 16, color: "white" }}
          />
        </div>
        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "#0f172a",
            letterSpacing: "-0.01em",
          }}
        >
          DocID Classifier
        </span>
        <span
          style={{
            fontSize: 11,
            color: "#94a3b8",
            borderLeft: "1px solid #e2e8f0",
            paddingLeft: 8,
            marginLeft: 2,
            display: window.innerWidth < 480 ? "none" : "inline",
          }}
        >
          Sistem Klasifikasi Dokumen
        </span>
      </div>

      {/* Desktop nav */}
      <nav
        style={{ display: "flex", alignItems: "center", gap: 20 }}
        className="desktop-nav"
      >
        {navItems.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setPage(key)}
            style={{
              fontSize: 13,
              color: page === key ? "#0f172a" : "#94a3b8",
              fontWeight: page === key ? 500 : 400,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            {label}
          </button>
        ))}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            padding: "4px 10px",
            borderRadius: 20,
            background: modelLoaded ? "#f0fdf4" : "#fef2f2",
            fontSize: 11,
            fontWeight: 500,
            color: modelLoaded ? "#15803d" : "#dc2626",
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: modelLoaded ? "#22c55e" : "#ef4444",
            }}
          />
          {modelLoaded ? "Model aktif" : "Offline"}
        </div>
      </nav>

      {/* Mobile hamburger */}
      <div
        style={{ display: "flex", alignItems: "center", gap: 8 }}
        className="mobile-nav"
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            padding: "3px 8px",
            borderRadius: 20,
            background: modelLoaded ? "#f0fdf4" : "#fef2f2",
            fontSize: 10,
            fontWeight: 500,
            color: modelLoaded ? "#15803d" : "#dc2626",
          }}
        >
          <div
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: modelLoaded ? "#22c55e" : "#ef4444",
            }}
          />
          {modelLoaded ? "Aktif" : "Offline"}
        </div>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <i
            className={`ti ${menuOpen ? "ti-x" : "ti-menu-2"}`}
            style={{ fontSize: 18, color: "#374151" }}
          />
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div
          style={{
            position: "absolute",
            top: 48,
            left: 0,
            right: 0,
            background: "white",
            borderBottom: "1px solid #f1f5f9",
            padding: "8px 16px",
          }}
          className="mobile-dropdown"
        >
          {navItems.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => {
                setPage(key);
                setMenuOpen(false);
              }}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                padding: "10px 0",
                fontSize: 14,
                color: page === key ? "#1e40af" : "#374151",
                fontWeight: page === key ? 600 : 400,
                background: "none",
                border: "none",
                borderBottom: "1px solid #f8fafc",
                cursor: "pointer",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}

function Sidebar({ activeKey }) {
  return (
    <aside
      style={{
        width: 240,
        flexShrink: 0,
        background: "white",
        borderRight: "1px solid #f1f5f9",
        padding: "16px 14px",
        display: "flex",
        flexDirection: "column",
        gap: 20,
        overflowY: "auto",
      }}
      className="sidebar"
    >
      <section>
        <p
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: "#94a3b8",
            letterSpacing: "0.08em",
            marginBottom: 8,
          }}
        >
          JENIS DOKUMEN
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {DOC_TYPES.map(({ key, label, icon, color, bg, border }) => {
            const active = activeKey === key;
            return (
              <div
                key={key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 10px",
                  borderRadius: 8,
                  border: active
                    ? `1.5px solid ${border}`
                    : "1px solid transparent",
                  background: active ? bg : "transparent",
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    background: active ? "white" : "#f8fafc",
                    border: active
                      ? `1px solid ${border}`
                      : "1px solid #f1f5f9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <i
                    className={`ti ${icon}`}
                    style={{ fontSize: 14, color: active ? color : "#94a3b8" }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: active ? color : "#374151",
                    }}
                  >
                    {key}
                  </div>
                  <div
                    style={{ fontSize: 10, color: "#94a3b8", lineHeight: 1.3 }}
                  >
                    {label}
                  </div>
                </div>
                {active && (
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      background: color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <i
                      className="ti ti-check"
                      style={{ fontSize: 10, color: "white" }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <p
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: "#94a3b8",
            letterSpacing: "0.08em",
            marginBottom: 8,
          }}
        >
          INFORMASI MODEL
        </p>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {MODEL_INFO.map(({ label, value }, i) => (
            <div
              key={label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "6px 0",
                borderBottom:
                  i < MODEL_INFO.length - 1 ? "1px solid #f8fafc" : "none",
              }}
            >
              <span style={{ fontSize: 11, color: "#94a3b8" }}>{label}</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#0f172a" }}>
                {value}
              </span>
            </div>
          ))}
        </div>
      </section>
    </aside>
  );
}

function Steps({ step }) {
  const items = ["Input Dokumen", "Analisis Model", "Hasil Klasifikasi"];
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        background: "white",
        border: "1px solid #f1f5f9",
        borderRadius: 10,
        padding: "10px 16px",
        marginBottom: 14,
      }}
    >
      {items.map((label, i) => (
        <div
          key={i}
          style={{ display: "flex", alignItems: "center", flex: i < 2 ? 1 : 0 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: "50%",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                  step > i ? "#1e40af" : step === i ? "#eff6ff" : "#f8fafc",
                border:
                  step === i
                    ? "1.5px solid #1e40af"
                    : step > i
                      ? "none"
                      : "1px solid #e2e8f0",
                fontSize: 10,
                fontWeight: 600,
                color: step > i ? "white" : step === i ? "#1e40af" : "#94a3b8",
              }}
            >
              {step > i ? (
                <i className="ti ti-check" style={{ fontSize: 11 }} />
              ) : (
                i + 1
              )}
            </div>
            <span
              style={{
                fontSize: 11,
                fontWeight: step === i ? 600 : 400,
                color: step >= i ? "#0f172a" : "#94a3b8",
                whiteSpace: "nowrap",
              }}
            >
              {label}
            </span>
          </div>
          {i < 2 && (
            <div
              style={{
                flex: 1,
                height: 1,
                margin: "0 10px",
                background: step > i ? "#1e40af" : "#e2e8f0",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function CameraCapture({ onCapture, loading }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [facingMode, setFacingMode] = useState("environment");

  const startCamera = useCallback(async (mode = "environment") => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
    setCameraError(null);
    setCameraReady(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          setCameraReady(true);
        };
      }
    } catch (err) {
      setCameraError(
        "Tidak dapat mengakses kamera. Pastikan izin kamera diberikan.",
      );
    }
  }, []);

  useEffect(() => {
    startCamera(facingMode);
    return () => {
      if (streamRef.current)
        streamRef.current.getTracks().forEach((t) => t.stop());
    };
  }, [facingMode]);

  const capture = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !cameraReady) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], "kamera_capture.jpg", {
            type: "image/jpeg",
          });
          onCapture(file);
        }
      },
      "image/jpeg",
      0.9,
    );
  }, [cameraReady, onCapture]);

  const flipCamera = () => {
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  };

  if (cameraError) {
    return (
      <div
        style={{
          background: "#fef2f2",
          border: "1px solid #fecaca",
          borderRadius: 12,
          padding: "32px 24px",
          textAlign: "center",
        }}
      >
        <i
          className="ti ti-camera-off"
          style={{ fontSize: 32, color: "#dc2626", marginBottom: 12 }}
        />
        <p
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "#991b1b",
            marginBottom: 6,
          }}
        >
          Kamera tidak tersedia
        </p>
        <p style={{ fontSize: 12, color: "#b91c1c" }}>{cameraError}</p>
        <button
          onClick={() => startCamera(facingMode)}
          style={{
            marginTop: 14,
            padding: "8px 16px",
            background: "#dc2626",
            color: "white",
            border: "none",
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 560, margin: "0 auto" }}>
      {/* Viewfinder */}
      <div
        style={{
          position: "relative",
          borderRadius: 12,
          overflow: "hidden",
          background: "#000",
          width: "100%",
          maxWidth: 560,
          aspectRatio: "16/9",
          margin: "0 auto",
          border: "1px solid #f1f5f9",
          display: "block",
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            transform: "scaleX(-1)",
          }}
        />
        <canvas ref={canvasRef} style={{ display: "none" }} />

        {/* Loading overlay */}
        {!cameraReady && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "#0f172a",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
            }}
          >
            <i
              className="ti ti-loader-2"
              style={{
                fontSize: 28,
                color: "white",
                animation: "spin 1s linear infinite",
              }}
            />
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
              Menyalakan kamera...
            </p>
          </div>
        )}

        {/* Document guide overlay */}
        {cameraReady && !loading && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                width: "75%",
                height: "55%",
                border: "2px solid rgba(255,255,255,0.6)",
                borderRadius: 10,
                boxShadow: "0 0 0 9999px rgba(0,0,0,0.35)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: -20,
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "rgba(0,0,0,0.6)",
                  borderRadius: 6,
                  padding: "3px 10px",
                  whiteSpace: "nowrap",
                }}
              >
                <span style={{ fontSize: 10, color: "white" }}>
                  Arahkan dokumen ke dalam kotak
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Processing overlay */}
        {loading && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.6)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
            }}
          >
            <i
              className="ti ti-loader-2"
              style={{
                fontSize: 28,
                color: "white",
                animation: "spin 1s linear infinite",
              }}
            />
            <p style={{ fontSize: 12, color: "white" }}>
              Menganalisis dokumen...
            </p>
          </div>
        )}

        {/* Flip camera button */}
        {cameraReady && (
          <button
            onClick={flipCamera}
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "rgba(0,0,0,0.5)",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <i
              className="ti ti-camera-rotate"
              style={{ fontSize: 18, color: "white" }}
            />
          </button>
        )}
      </div>

      {/* Capture button */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
        <button
          onClick={capture}
          disabled={!cameraReady || loading}
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: cameraReady && !loading ? "#1e40af" : "#e2e8f0",
            border: `4px solid ${cameraReady && !loading ? "#bfdbfe" : "#f1f5f9"}`,
            cursor: cameraReady && !loading ? "pointer" : "not-allowed",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s",
          }}
        >
          <i
            className="ti ti-camera"
            style={{
              fontSize: 26,
              color: cameraReady && !loading ? "white" : "#94a3b8",
            }}
          />
        </button>
      </div>
      <p
        style={{
          textAlign: "center",
          fontSize: 11,
          color: "#94a3b8",
          marginTop: 8,
        }}
      >
        Tekan tombol untuk mengambil gambar dokumen
      </p>
    </div>
  );
}

function UploadZone({ onUpload, loading }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const handleFile = useCallback(
    (file) => {
      if (!file) return;
      const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!allowed.includes(file.type)) {
        alert("Format tidak didukung.");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert("Ukuran maksimal 10MB.");
        return;
      }
      onUpload(file);
    },
    [onUpload],
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handleFile(e.dataTransfer.files[0]);
      }}
      onClick={() => !loading && inputRef.current?.click()}
      style={{
        border: `1.5px dashed ${dragging ? "#1e40af" : "#e2e8f0"}`,
        borderRadius: 12,
        padding: "40px 24px",
        textAlign: "center",
        cursor: loading ? "default" : "pointer",
        background: dragging ? "#eff6ff" : "white",
        transition: "all 0.2s",
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => handleFile(e.target.files[0])}
      />
      <div
        style={{
          width: 50,
          height: 50,
          borderRadius: 14,
          background: loading ? "#f0fdf4" : "#eff6ff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 12px",
        }}
      >
        <i
          className={`ti ${loading ? "ti-loader-2" : "ti-cloud-upload"}`}
          style={{
            fontSize: 22,
            color: loading ? "#16a34a" : "#1e40af",
            animation: loading ? "spin 1s linear infinite" : "none",
          }}
        />
      </div>
      <p
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: "#0f172a",
          marginBottom: 6,
        }}
      >
        {loading ? "Memproses gambar..." : "Upload foto dokumen"}
      </p>
      <p
        style={{
          fontSize: 12,
          color: "#94a3b8",
          marginBottom: 14,
          lineHeight: 1.5,
        }}
      >
        {loading
          ? "Model sedang menganalisis"
          : "Drag & drop atau klik untuk memilih"}
      </p>
      {!loading && (
        <div
          style={{
            display: "flex",
            gap: 6,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {["JPG", "PNG", "WEBP"].map((f) => (
            <span
              key={f}
              style={{
                fontSize: 10,
                padding: "3px 8px",
                border: "1px solid #e2e8f0",
                borderRadius: 4,
                color: "#64748b",
                fontWeight: 500,
              }}
            >
              {f}
            </span>
          ))}
          <span style={{ fontSize: 11, color: "#94a3b8" }}>· Maks 10MB</span>
        </div>
      )}
    </div>
  );
}

function ResultCard({ result, previewUrl }) {
  if (!result) return null;
  const {
    prediction,
    all_confidences,
    file_info,
    process_time_ms,
    from_cache,
  } = result;
  const doc = DOC_TYPES.find((d) => d.key === prediction.class) || DOC_TYPES[3];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div
        style={{
          background: "white",
          border: "1px solid #f1f5f9",
          borderLeft: `3px solid ${doc.color}`,
          borderRadius: 10,
          padding: "14px 16px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="preview"
            style={{
              width: 58,
              height: 44,
              objectFit: "cover",
              borderRadius: 6,
              flexShrink: 0,
              border: "1px solid #f1f5f9",
            }}
          />
        ) : (
          <div
            style={{
              width: 58,
              height: 44,
              borderRadius: 6,
              flexShrink: 0,
              background: doc.bg,
              border: `1px solid ${doc.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <i
              className={`ti ${doc.icon}`}
              style={{ fontSize: 22, color: doc.color }}
            />
          </div>
        )}
        <div style={{ flex: 1, minWidth: 120 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              marginBottom: 3,
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontSize: 10,
                padding: "2px 7px",
                background: doc.bg,
                color: doc.color,
                borderRadius: 4,
                fontWeight: 600,
                border: `1px solid ${doc.border}`,
              }}
            >
              {prediction.class}
            </span>
            <span style={{ fontSize: 10, color: "#94a3b8" }}>
              {prediction.confidence_level}
            </span>
            {from_cache && (
              <span
                style={{
                  fontSize: 10,
                  padding: "2px 7px",
                  background: "#fffbeb",
                  color: "#b45309",
                  borderRadius: 4,
                  border: "1px solid #fde68a",
                }}
              >
                Cache
              </span>
            )}
          </div>
          <p
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "#0f172a",
              marginBottom: 2,
              letterSpacing: "-0.01em",
            }}
          >
            {prediction.label}
          </p>
          <p style={{ fontSize: 11, color: "#94a3b8" }}>
            {file_info.filename} · {file_info.size_kb} KB · {process_time_ms}ms
          </p>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div
            style={{
              fontSize: 26,
              fontWeight: 700,
              color: doc.color,
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}
          >
            {prediction.confidence}%
          </div>
          <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 2 }}>
            confidence
          </div>
        </div>
      </div>

      <div
        style={{
          background: "white",
          border: "1px solid #f1f5f9",
          borderRadius: 10,
          padding: "14px 16px",
        }}
      >
        <p
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: "#94a3b8",
            letterSpacing: "0.08em",
            marginBottom: 12,
          }}
        >
          DISTRIBUSI CONFIDENCE
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {DOC_TYPES.map(({ key, label, icon, color, bg, border }) => {
            const pct = all_confidences?.[key] ?? 0;
            const isTop = key === prediction.class;
            return (
              <div
                key={key}
                style={{ display: "flex", alignItems: "center", gap: 8 }}
              >
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 6,
                    flexShrink: 0,
                    background: isTop ? bg : "#f8fafc",
                    border: isTop ? `1px solid ${border}` : "1px solid #f1f5f9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <i
                    className={`ti ${icon}`}
                    style={{ fontSize: 13, color: isTop ? color : "#cbd5e1" }}
                  />
                </div>
                <span
                  style={{
                    fontSize: 11,
                    flexShrink: 0,
                    color: isTop ? "#0f172a" : "#94a3b8",
                    fontWeight: isTop ? 600 : 400,
                    width: 130,
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  {label}
                  {isTop && (
                    <span
                      style={{
                        fontSize: 9,
                        padding: "1px 4px",
                        background: bg,
                        color,
                        border: `1px solid ${border}`,
                        borderRadius: 3,
                        fontWeight: 600,
                      }}
                    >
                      ✓
                    </span>
                  )}
                </span>
                <div
                  style={{
                    flex: 1,
                    height: 5,
                    background: "#f1f5f9",
                    borderRadius: 3,
                  }}
                >
                  <div
                    style={{
                      width: `${pct}%`,
                      height: 5,
                      background: isTop ? color : "#e2e8f0",
                      borderRadius: 3,
                      transition: "width 0.6s ease",
                    }}
                  />
                </div>
                <span
                  style={{
                    fontSize: 11,
                    width: 36,
                    textAlign: "right",
                    flexShrink: 0,
                    color: isTop ? "#0f172a" : "#94a3b8",
                    fontWeight: isTop ? 700 : 400,
                  }}
                >
                  {pct}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ClassifierPage({ history, setHistory }) {
  const [mode, setMode] = useState("camera"); // "camera" | "upload"
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState(null);

  const handleFile = async (file) => {
    setLoading(true);
    setError(null);
    setResult(null);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch(`${API_BASE}/predict`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e.detail || "Gagal memproses");
      }
      const data = await res.json();
      setResult(data);
      setHistory((prev) => [
        { ...data, previewUrl: url, timestamp: new Date() },
        ...prev.slice(0, 19),
      ]);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setPreviewUrl(null);
    setError(null);
  };
  const activeKey = result?.prediction?.class ?? null;

  return (
    <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
      <Sidebar activeKey={activeKey} />
      <main style={{ flex: 1, padding: 16, overflowY: "auto" }}>
        <Steps step={result ? 2 : loading ? 1 : 0} />

        {/* Mode switcher */}
        {!result && !loading && (
          <div
            style={{
              display: "flex",
              background: "#f1f5f9",
              borderRadius: 10,
              padding: 3,
              marginBottom: 14,
              gap: 3,
            }}
          >
            {[
              { key: "camera", icon: "ti-camera", label: "Kamera Langsung" },
              { key: "upload", icon: "ti-cloud-upload", label: "Upload File" },
            ].map(({ key, icon, label }) => (
              <button
                key={key}
                onClick={() => {
                  setMode(key);
                  reset();
                }}
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  borderRadius: 8,
                  border: "none",
                  cursor: "pointer",
                  background: mode === key ? "white" : "transparent",
                  boxShadow:
                    mode === key ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                  fontSize: 12,
                  fontWeight: mode === key ? 600 : 400,
                  color: mode === key ? "#0f172a" : "#94a3b8",
                  transition: "all 0.15s",
                }}
              >
                <i className={`ti ${icon}`} style={{ fontSize: 15 }} />
                {label}
              </button>
            ))}
          </div>
        )}

        {error && (
          <div
            style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: 10,
              padding: "12px 14px",
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 12,
            }}
          >
            <i
              className="ti ti-alert-circle"
              style={{ fontSize: 16, color: "#dc2626", flexShrink: 0 }}
            />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: "#991b1b" }}>
                Prediksi gagal
              </p>
              <p style={{ fontSize: 11, color: "#b91c1c", marginTop: 1 }}>
                {error}
              </p>
            </div>
            <button
              onClick={reset}
              style={{
                fontSize: 11,
                color: "#dc2626",
                fontWeight: 500,
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              Coba lagi
            </button>
          </div>
        )}

        {!result && !loading && mode === "camera" && (
          <CameraCapture onCapture={handleFile} loading={loading} />
        )}

        {!result && !loading && mode === "upload" && (
          <UploadZone onUpload={handleFile} loading={false} />
        )}

        {loading && mode === "upload" && (
          <UploadZone onUpload={() => {}} loading={true} />
        )}

        {result && !loading && (
          <>
            <ResultCard result={result} previewUrl={previewUrl} />
            <button
              onClick={reset}
              style={{
                width: "100%",
                marginTop: 12,
                padding: "11px 0",
                background: "#1e40af",
                color: "white",
                border: "none",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Klasifikasikan dokumen lain
            </button>
          </>
        )}
      </main>
    </div>
  );
}

function HistoryPage({ history, setHistory }) {
  const stats = DOC_TYPES.map((doc) => ({
    ...doc,
    count: history.filter((h) => h.prediction.class === doc.key).length,
  }));

  if (history.length === 0) {
    return (
      <main style={{ flex: 1, padding: 20, overflowY: "auto" }}>
        <div
          style={{
            maxWidth: 680,
            margin: "0 auto",
            paddingTop: 60,
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: "#f8fafc",
              border: "1px solid #f1f5f9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 12px",
            }}
          >
            <i
              className="ti ti-history"
              style={{ fontSize: 24, color: "#cbd5e1" }}
            />
          </div>
          <p style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>
            Belum ada riwayat
          </p>
          <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>
            Scan atau upload dokumen di halaman Classifier untuk mulai
          </p>
        </div>
      </main>
    );
  }

  return (
    <main style={{ flex: 1, padding: 16, overflowY: "auto" }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 14,
          }}
        >
          <div>
            <h2
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "#0f172a",
                letterSpacing: "-0.01em",
              }}
            >
              Riwayat Prediksi
            </h2>
            <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
              {history.length} dokumen tersimpan
            </p>
          </div>
          <button
            onClick={() => setHistory([])}
            style={{
              fontSize: 12,
              color: "#dc2626",
              fontWeight: 500,
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <i className="ti ti-trash" style={{ fontSize: 13 }} />
            Hapus semua
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr",
            gap: 8,
            marginBottom: 14,
          }}
        >
          {stats.map(({ key, icon, color, bg, border, count }) => (
            <div
              key={key}
              style={{
                background: count > 0 ? bg : "white",
                border: `1px solid ${count > 0 ? border : "#f1f5f9"}`,
                borderRadius: 10,
                padding: "12px 14px",
              }}
            >
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 6,
                  background: count > 0 ? "white" : "#f8fafc",
                  border: `1px solid ${count > 0 ? border : "#f1f5f9"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 6,
                }}
              >
                <i
                  className={`ti ${icon}`}
                  style={{ fontSize: 13, color: count > 0 ? color : "#cbd5e1" }}
                />
              </div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: count > 0 ? color : "#94a3b8",
                  letterSpacing: "-0.02em",
                }}
              >
                {count}
              </div>
              <div style={{ fontSize: 10, color: "#94a3b8" }}>{key}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {history.map((item, i) => {
            const doc =
              DOC_TYPES.find((d) => d.key === item.prediction.class) ||
              DOC_TYPES[3];
            return (
              <div
                key={i}
                style={{
                  background: "white",
                  border: "1px solid #f1f5f9",
                  borderLeft: `3px solid ${doc.color}`,
                  borderRadius: 10,
                  padding: "11px 14px",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                {item.previewUrl ? (
                  <img
                    src={item.previewUrl}
                    alt=""
                    style={{
                      width: 44,
                      height: 34,
                      objectFit: "cover",
                      borderRadius: 5,
                      flexShrink: 0,
                      border: "1px solid #f1f5f9",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 44,
                      height: 34,
                      borderRadius: 5,
                      flexShrink: 0,
                      background: doc.bg,
                      border: `1px solid ${doc.border}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <i
                      className={`ti ${doc.icon}`}
                      style={{ fontSize: 16, color: doc.color }}
                    />
                  </div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#0f172a",
                      marginBottom: 2,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.file_info.filename}
                  </p>
                  <p style={{ fontSize: 10, color: "#94a3b8" }}>
                    {item.timestamp?.toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {" · "}
                    {item.file_info.size_kb} KB · {item.process_time_ms}ms
                    {item.from_cache && " · Cache"}
                  </p>
                </div>
                <span
                  style={{
                    fontSize: 10,
                    padding: "3px 8px",
                    background: doc.bg,
                    color: doc.color,
                    border: `1px solid ${doc.border}`,
                    borderRadius: 5,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {item.prediction.class} · {item.prediction.confidence}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

function AboutPage() {
  const metrics = [
    {
      label: "Val. Accuracy",
      value: "89.14%",
      icon: "ti-target",
      color: "#16a34a",
      bg: "#f0fdf4",
    },
    {
      label: "Macro F1",
      value: "0.8923",
      icon: "ti-chart-bar",
      color: "#1e40af",
      bg: "#eff6ff",
    },
    {
      label: "Dataset",
      value: "2.388",
      icon: "ti-database",
      color: "#7c3aed",
      bg: "#f5f3ff",
    },
    {
      label: "Inferensi",
      value: "~150ms",
      icon: "ti-bolt",
      color: "#b45309",
      bg: "#fffbeb",
    },
  ];
  const classMetrics = [
    {
      key: "KTP",
      recall: 100.0,
      precision: 73.18,
      f1: 84.52,
      icon: "ti-id",
      color: "#1e40af",
      bg: "#eff6ff",
    },
    {
      key: "SIM",
      recall: 95.45,
      precision: 100.0,
      f1: 97.67,
      icon: "ti-steering-wheel",
      color: "#16a34a",
      bg: "#f0fdf4",
    },
    {
      key: "Passport",
      recall: 93.8,
      precision: 92.37,
      f1: 93.08,
      icon: "ti-world",
      color: "#7c3aed",
      bg: "#f5f3ff",
    },
    {
      key: "Other",
      recall: 69.01,
      precision: 100.0,
      f1: 81.67,
      icon: "ti-file-description",
      color: "#b45309",
      bg: "#fffbeb",
    },
  ];
  const arch = [
    ["Base model", "MobileNetV2 (224×224, 3 channel)"],
    ["Pretrained", "ImageNet (weights frozen: block 1–12)"],
    ["Fine-tuning", "30 layer terakhir MobileNetV2 (block 13–16)"],
    [
      "Head",
      "GAP → BN → Dense(256, ReLU) → Dropout(0.4) → Dense(128, ReLU) → Dropout(0.3) → Softmax(4)",
    ],
    ["Optimizer", "Adam (fase 1: lr=1e-3, fase 2: lr=1e-4)"],
    ["Loss", "Categorical Crossentropy"],
    ["Epochs", "10 (feature extraction) + 5 (fine-tuning)"],
    ["Framework", "TensorFlow / Keras 3"],
  ];

  return (
    <main style={{ flex: 1, padding: 16, overflowY: "auto" }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <div
          style={{
            background: "#eff6ff",
            border: "1px solid #bfdbfe",
            borderRadius: 10,
            padding: "14px 16px",
            marginBottom: 18,
            display: "flex",
            gap: 10,
            alignItems: "flex-start",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              flexShrink: 0,
              background: "white",
              border: "1px solid #bfdbfe",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <i
              className="ti ti-shield-check"
              style={{ fontSize: 16, color: "#1e40af" }}
            />
          </div>
          <div>
            <p
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#1e40af",
                marginBottom: 4,
              }}
            >
              Tujuan Sistem
            </p>
            <p style={{ fontSize: 12, color: "#1e3a8a", lineHeight: 1.7 }}>
              Sistem ini dirancang sebagai{" "}
              <strong>alat bantu klasifikasi otomatis dokumen identitas</strong>{" "}
              pada layanan digital. Dengan scan kamera atau upload foto dokumen,
              sistem mendeteksi jenis dokumen — KTP, SIM, Paspor, atau Other —
              secara instan menggunakan deep learning, sehingga mempercepat
              proses verifikasi tanpa pengecekan manual.
            </p>
          </div>
        </div>

        <div style={{ marginBottom: 18 }}>
          <h2
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "#0f172a",
              letterSpacing: "-0.01em",
              marginBottom: 4,
            }}
          >
            Tentang Model
          </h2>
          <p style={{ fontSize: 12, color: "#64748b", lineHeight: 1.7 }}>
            Klasifikasi dokumen identitas berbasis transfer learning
            MobileNetV2, dilatih dalam dua fase: feature extraction (10 epoch)
            dan fine-tuning (5 epoch) pada dataset 2.388 gambar dari Kaggle.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr",
            gap: 10,
            marginBottom: 14,
          }}
        >
          {metrics.map(({ label, value, icon, color, bg }) => (
            <div
              key={label}
              style={{
                background: "white",
                border: "1px solid #f1f5f9",
                borderRadius: 10,
                padding: 12,
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  background: bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 8,
                }}
              >
                <i className={`ti ${icon}`} style={{ fontSize: 15, color }} />
              </div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#0f172a",
                  letterSpacing: "-0.02em",
                }}
              >
                {value}
              </div>
              <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 2 }}>
                {label}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            background: "white",
            border: "1px solid #f1f5f9",
            borderRadius: 10,
            padding: 14,
            marginBottom: 12,
          }}
        >
          <p
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: "#94a3b8",
              letterSpacing: "0.08em",
              marginBottom: 14,
            }}
          >
            PERFORMA PER KELAS (DATA VALIDASI)
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {classMetrics.map(
              ({ key, recall, precision, f1, icon, color, bg }) => (
                <div key={key}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 6,
                    }}
                  >
                    <div
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 6,
                        background: bg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <i
                        className={`ti ${icon}`}
                        style={{ fontSize: 13, color }}
                      />
                    </div>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#0f172a",
                        width: 64,
                      }}
                    >
                      {key}
                    </span>
                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        marginLeft: "auto",
                        flexWrap: "wrap",
                      }}
                    >
                      <span style={{ fontSize: 10, color: "#94a3b8" }}>
                        Recall{" "}
                        <strong style={{ color: "#0f172a" }}>{recall}%</strong>
                      </span>
                      <span style={{ fontSize: 10, color: "#94a3b8" }}>
                        Precision{" "}
                        <strong style={{ color: "#0f172a" }}>
                          {precision}%
                        </strong>
                      </span>
                      <span style={{ fontSize: 10, color: "#94a3b8" }}>
                        F1 <strong style={{ color }}>{f1}%</strong>
                      </span>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 4, paddingLeft: 34 }}>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: 9,
                          color: "#94a3b8",
                          marginBottom: 2,
                        }}
                      >
                        Recall
                      </div>
                      <div
                        style={{
                          height: 5,
                          background: "#f1f5f9",
                          borderRadius: 3,
                        }}
                      >
                        <div
                          style={{
                            width: `${recall}%`,
                            height: 5,
                            background: color,
                            borderRadius: 3,
                          }}
                        />
                      </div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: 9,
                          color: "#94a3b8",
                          marginBottom: 2,
                        }}
                      >
                        F1-Score
                      </div>
                      <div
                        style={{
                          height: 5,
                          background: "#f1f5f9",
                          borderRadius: 3,
                        }}
                      >
                        <div
                          style={{
                            width: `${f1}%`,
                            height: 5,
                            background: color,
                            borderRadius: 3,
                            opacity: 0.5,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
          <div
            style={{
              marginTop: 14,
              padding: "10px 12px",
              background: "#fffbeb",
              border: "1px solid #fde68a",
              borderRadius: 8,
              display: "flex",
              gap: 8,
              alignItems: "flex-start",
            }}
          >
            <i
              className="ti ti-alert-triangle"
              style={{
                fontSize: 13,
                color: "#b45309",
                flexShrink: 0,
                marginTop: 1,
              }}
            />
            <p style={{ fontSize: 11, color: "#92400e", lineHeight: 1.6 }}>
              Kelas <strong>Other</strong> memiliki recall terendah (69.01%)
              karena variasi visual yang tinggi — 34 dari 142 sampel salah
              diprediksi sebagai KTP.
            </p>
          </div>
        </div>

        <div
          style={{
            background: "white",
            border: "1px solid #f1f5f9",
            borderRadius: 10,
            padding: 14,
          }}
        >
          <p
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: "#94a3b8",
              letterSpacing: "0.08em",
              marginBottom: 12,
            }}
          >
            ARSITEKTUR MODEL
          </p>
          {arch.map(([k, v], i) => (
            <div
              key={k}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                padding: "7px 0",
                borderBottom:
                  i < arch.length - 1 ? "1px solid #f8fafc" : "none",
                gap: 12,
              }}
            >
              <span style={{ fontSize: 11, color: "#94a3b8", flexShrink: 0 }}>
                {k}
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  color: "#0f172a",
                  textAlign: "right",
                  lineHeight: 1.5,
                }}
              >
                {v}
              </span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default function App() {
  const [page, setPage] = useState("classifier");
  const [history, setHistory] = useState([]);
  const [modelLoaded, setModelLoaded] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/health`)
      .then((r) => r.json())
      .then((d) => setModelLoaded(d.model_loaded))
      .catch(() => setModelLoaded(false));
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: "#f8fafc",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <style>{`
        @import url('https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css');
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { margin: 0; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 2px; }

        .desktop-nav { display: flex; }
        .mobile-nav { display: none; }
        .mobile-dropdown { display: block; }
        .sidebar { display: flex; }

        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-nav { display: flex !important; }
          .sidebar { display: none !important; }
        }
      `}</style>

      <Header page={page} setPage={setPage} modelLoaded={modelLoaded} />

      <div
        style={{ display: "flex", flex: 1, marginTop: 48, overflow: "hidden" }}
      >
        {page === "classifier" && (
          <ClassifierPage history={history} setHistory={setHistory} />
        )}
        {page === "history" && (
          <HistoryPage history={history} setHistory={setHistory} />
        )}
        {page === "about" && <AboutPage />}
      </div>
    </div>
  );
}
