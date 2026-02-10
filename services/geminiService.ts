
import { GoogleGenAI } from "@google/genai";

// Vercel ortam değişkenlerine erişim için process.env kullanılır
const apiKey = process.env.API_KEY || "";

export const getBaristaSuggestion = async (mood: string): Promise<string> => {
  if (!apiKey) {
    return "Barista, yumuşak ve rahatlatıcı bir deneyim için Latte Macchiato öneriyor.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Kullanıcı şu an böyle hissediyor: ${mood}. Dünya standartlarında bir barista olarak, menümüzdeki kahvelerden birini (Latte Macchiato, Americano, Espresso, Cafe Crema veya Karamel Macchiato) öner ve neden bu moduna uygun olduğuna dair Türkçe, şiirsel tek bir cümle yaz. Sadece öneriyi ve sebebi döndür.`,
    });
    return response.text || "Güne enerjik başlamanız için bir Espresso öneririm!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Barista, yumuşak ve rahatlatıcı bir deneyim için Latte Macchiato öneriyor.";
  }
};
