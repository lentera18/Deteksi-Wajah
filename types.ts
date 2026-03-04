
export interface EmotionData {
  emotion: 'Senang' | 'Sedih' | 'Marah' | 'Netral' | 'Stres' | 'Lelah' | 'Fokus' | 'Cemas';
  confidence: number;
  mentalState: string;
  stressLevel: number; // 0-100
  focusScore: number; // 0-100
  burnoutRisk: 'Rendah' | 'Sedang' | 'Tinggi';
  recommendation: string;
}

export interface AnalysisHistory {
  timestamp: string;
  emotion: string;
  stressLevel: number;
  focusScore: number;
}
