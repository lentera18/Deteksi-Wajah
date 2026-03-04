
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import CameraCard from './components/CameraCard';
import AnalysisDashboard from './components/AnalysisDashboard';
import { analyzeFace } from './services/geminiService';
import { EmotionData, AnalysisHistory } from './types';

const App: React.FC = () => {
  const [currentAnalysis, setCurrentAnalysis] = useState<EmotionData | null>(null);
  const [history, setHistory] = useState<AnalysisHistory[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCapture = useCallback(async (base64: string) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const result = await analyzeFace(base64);
      setCurrentAnalysis(result);
      
      setHistory(prev => {
        const newEntry: AnalysisHistory = {
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          emotion: result.emotion,
          stressLevel: result.stressLevel,
          focusScore: result.focusScore
        };
        // Simpan 15 pembacaan terakhir
        const next = [newEntry, ...prev];
        return next.slice(0, 15).reverse();
      });
    } catch (err) {
      console.error("Analisis Gagal:", err);
      setError("Gagal menganalisis gambar. Pastikan pencahayaan Anda cukup.");
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Kolom Kiri: Kamera dan Tips */}
          <div className="lg:col-span-5 space-y-8">
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Monitoring Langsung</h2>
                <div className="flex items-center gap-1">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Umpan Real-time</span>
                </div>
              </div>
              <CameraCard onCapture={handleCapture} isAnalyzing={isAnalyzing} />
              
              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="text-xs font-medium">{error}</p>
                </div>
              )}
            </section>

            <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM13.464 15.05a1 1 0 010 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 16a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1z" />
                </svg>
                Privasi & Etika
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                MindGuard AI menggunakan pemetaan gerakan wajah anonim untuk menghitung indeks kesejahteraan. Kami tidak menyimpan data video pribadi atau gambar yang dapat diidentifikasi. Privasi Anda dilindungi oleh standar etika AI kami.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Pemrosesan Data</span>
                  <span className="text-xs font-semibold text-slate-700">Client-Side + API</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Tingkat Keamanan</span>
                  <span className="text-xs font-semibold text-slate-700">Enkripsi End-to-End</span>
                </div>
              </div>
            </section>
          </div>

          {/* Kolom Kanan: Dashboard */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Analitik Kesejahteraan</h2>
              <span className="text-[10px] font-medium text-slate-400 italic">Diperbarui pada {new Date().toLocaleTimeString()}</span>
            </div>
            <AnalysisDashboard currentData={currentAnalysis} history={history} />
          </div>

        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs text-slate-400 font-medium tracking-wide">
            © 2024 MindGuard AI - Infrastruktur Kesejahteraan Tempat Kerja Tingkat Lanjut. Ditenagai oleh Google Gemini 3.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
