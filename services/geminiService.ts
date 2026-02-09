
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getBaristaSuggestion = async (mood: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `The user is feeling: ${mood}. As a world-class barista, suggest one of our coffees (Latte Macchiato, Americano, Espresso, or Caramel Macchiato) and give a 1-sentence poetic reason why it fits their mood. Return just the suggestion and the reason.`,
    });
    return response.text || "I recommend an Espresso to kickstart your day!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The barista suggests a Latte Macchiato for a smooth, comforting experience.";
  }
};
