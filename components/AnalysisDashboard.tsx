
import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import { EmotionData, AnalysisHistory } from '../types';

interface AnalysisDashboardProps {
  currentData: EmotionData | null;
  history: AnalysisHistory[];
}

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ currentData, history }) => {
  if (!currentData) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <p className="text-sm font-medium">Menunggu data analisis...</p>
        <p className="text-xs mt-1">Posisikan wajah Anda di depan kamera.</p>
      </div>
    );
  }

  const getEmotionColor = (emotion: string) => {
    switch (emotion) {
      case 'Senang': return 'bg-emerald-500';
      case 'Stres': return 'bg-orange-500';
      case 'Cemas': return 'bg-yellow-500';
      case 'Marah': return 'bg-red-500';
      case 'Lelah': return 'bg-slate-500';
      case 'Fokus': return 'bg-blue-500';
      default: return 'bg-indigo-500';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Rendah': return 'text-emerald-600 bg-emerald-50';
      case 'Sedang': return 'text-amber-600 bg-amber-50';
      case 'Tinggi': return 'text-red-600 bg-red-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Emosi Utama</p>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getEmotionColor(currentData.emotion)}`}></div>
            <span className="text-lg font-bold text-slate-800">{currentData.emotion}</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Tingkat Stres</p>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-slate-800">{currentData.stressLevel}%</span>
            <span className="text-[10px] text-slate-400">Indeks</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Skor Fokus</p>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-slate-800">{currentData.focusScore}%</span>
            <span className="text-[10px] text-slate-400">Poin</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Risiko Burnout</p>
          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${getRiskColor(currentData.burnoutRisk)}`}>
            {currentData.burnoutRisk}
          </span>
        </div>
      </div>

      {/* Main Analysis Text */}
      <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-xl shadow-indigo-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="font-bold text-lg">Wawasan Kondisi Mental AI</h3>
        </div>
        <p className="text-indigo-50 leading-relaxed mb-4 text-sm font-medium">
          {currentData.mentalState}
        </p>
        <div className="pt-4 border-t border-indigo-500/50">
          <p className="text-xs text-indigo-200 uppercase tracking-widest font-bold mb-2">Rekomendasi</p>
          <p className="text-white text-sm italic">"{currentData.recommendation}"</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h4 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            Tren Performa
          </h4>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history}>
                <defs>
                  <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="timestamp" hide />
                <YAxis hide domain={[0, 100]} />
                <Tooltip 
                  labelFormatter={() => "Waktu"}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Area name="Fokus" type="monotone" dataKey="focusScore" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorFocus)" />
                <Area name="Stres" type="monotone" dataKey="stressLevel" stroke="#ef4444" strokeWidth={3} fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Fokus</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Stres</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h4 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
            Metrik Terkini
          </h4>
          <div className="h-[200px]">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { name: 'Stres', value: currentData.stressLevel },
                  { name: 'Fokus', value: currentData.focusScore },
                  { name: 'Akurasi', value: currentData.confidence * 100 }
                ]}>
                  <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: '#f8fafc'}} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={30}>
                    {
                      [0,1,2].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#f43f5e' : index === 1 ? '#3b82f6' : '#6366f1'} />
                      ))
                    }
                  </Bar>
                </BarChart>
             </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisDashboard;
