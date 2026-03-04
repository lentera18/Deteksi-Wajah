
import React, { useRef, useEffect, useState } from 'react';

interface CameraCardProps {
  onCapture: (base64: string) => void;
  isAnalyzing: boolean;
}

const CameraCard: React.FC<CameraCardProps> = ({ onCapture, isAnalyzing }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user"
        } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsActive(true);
      }
    } catch (err) {
      setError("Tidak dapat mengakses kamera. Silakan periksa izin perangkat.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const captureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const base64 = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
        onCapture(base64);
      }
    }
  };

  useEffect(() => {
    if (isActive && !isAnalyzing) {
      const timer = setTimeout(captureFrame, 8000); // Analisis setiap 8 detik
      return () => clearTimeout(timer);
    }
  }, [isActive, isAnalyzing]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm relative group">
      <div className="aspect-video bg-slate-900 relative">
        {error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-slate-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <p className="text-sm font-medium">{error}</p>
          </div>
        ) : (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className="w-full h-full object-cover mirror"
            style={{ transform: 'scaleX(-1)' }}
          />
        )}
        
        {isAnalyzing && (
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="mt-3 text-white text-xs font-bold uppercase tracking-wider">Menganalisis Pola...</span>
            </div>
          </div>
        )}

        <div className="absolute top-4 left-4 flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-black/50 backdrop-blur-md rounded-full border border-white/20">
            <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            <span className="text-[10px] text-white font-bold uppercase tracking-widest">{isActive ? 'Aktif' : 'Mati'}</span>
          </div>
        </div>

        {!isAnalyzing && isActive && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="w-full h-[2px] bg-blue-400/50 shadow-[0_0_15px_rgba(96,165,250,0.8)] absolute animate-scan-line"></div>
          </div>
        )}
      </div>
      
      <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">Antarmuka Pekerja</h3>
          <p className="text-[10px] text-slate-500">Mendeteksi mikro-ekspresi wajah</p>
        </div>
        <button 
          onClick={captureFrame}
          disabled={isAnalyzing}
          className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
        >
          Periksa Sekarang
        </button>
      </div>

      <canvas ref={canvasRef} className="hidden" />

      <style>{`
        @keyframes scan-line {
          0% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scan-line {
          animation: scan-line 4s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default CameraCard;
