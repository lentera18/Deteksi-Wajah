
import { GoogleGenAI, Type } from "@google/genai";
import { EmotionData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeFace = async (base64Image: string): Promise<EmotionData> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image,
            },
          },
          {
            text: "Analisis gerakan wajah orang ini untuk mendeteksi emosi dan kondisi mental mereka dalam konteks lingkungan kerja profesional. Cari tanda-tanda kelelahan, stres, konsentrasi, atau kegembiraan. Berikan output dalam format JSON dan gunakan Bahasa Indonesia untuk semua nilai teks.",
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            emotion: {
              type: Type.STRING,
              description: "Emosi utama yang terdeteksi: Senang, Sedih, Marah, Netral, Stres, Lelah, Fokus, atau Cemas.",
            },
            confidence: {
              type: Type.NUMBER,
              description: "Tingkat kepercayaan deteksi dari 0 ke 1.",
            },
            mentalState: {
              type: Type.STRING,
              description: "Deskripsi singkat tentang kondisi mental pengguna dalam Bahasa Indonesia.",
            },
            stressLevel: {
              type: Type.NUMBER,
              description: "Estimasi tingkat stres dari 0 ke 100.",
            },
            focusScore: {
              type: Type.NUMBER,
              description: "Estimasi tingkat fokus atau konsentrasi dari 0 ke 100.",
            },
            burnoutRisk: {
              type: Type.STRING,
              description: "Penilaian risiko burnout: Rendah, Sedang, atau Tinggi.",
            },
            recommendation: {
              type: Type.STRING,
              description: "Tips kesejahteraan praktis untuk karyawan dalam Bahasa Indonesia.",
            },
          },
          required: ["emotion", "confidence", "mentalState", "stressLevel", "focusScore", "burnoutRisk", "recommendation"],
        },
      },
    });

    const jsonText = response.text || "{}";
    return JSON.parse(jsonText) as EmotionData;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};
