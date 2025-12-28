
import { GoogleGenAI, Type } from "@google/genai";

// Fix: Always use process.env.API_KEY directly as a named parameter
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const geminiService = {
  async generateMarketingCopy(campaignType: string, targetAudience: string) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Create a professional and engaging marketing message for a barbershop campaign. 
        Type: ${campaignType}
        Target: ${targetAudience}
        Tone: Modern, Masculine, Inviting.
        Return as a short WhatsApp message template.`,
      });
      // Fix: response.text is a property
      return response.text;
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Unable to generate message at this time.";
    }
  },

  async analyzePerformance(metrics: any) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze these barbershop performance metrics and provide 3 actionable insights: ${JSON.stringify(metrics)}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              insights: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["insights"]
          }
        }
      });
      // Fix: response.text is a property
      return JSON.parse(response.text || '{"insights": []}');
    } catch (error) {
      console.error("Gemini Analysis Error:", error);
      return { insights: ["Focus on increasing recurring clients", "Review commission structures", "Promote beard services"] };
    }
  }
};
