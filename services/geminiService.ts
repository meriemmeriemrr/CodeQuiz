
import { GoogleGenAI, Type } from "@google/genai";
import { Challenge, Difficulty } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateAIChallenge = async (topic: string, difficulty: Difficulty): Promise<Challenge> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a short Python coding micro-challenge about ${topic} for a ${difficulty} level learner. 
    The challenge should be a code snippet with a missing part (or a question about its output). 
    Provide 4 multiple choice options.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          topic: { type: Type.STRING },
          description: { type: Type.STRING },
          code: { type: Type.STRING },
          options: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          correctAnswer: { type: Type.STRING },
          explanation: { type: Type.STRING }
        },
        required: ["topic", "description", "code", "options", "correctAnswer", "explanation"]
      }
    }
  });

  const data = JSON.parse(response.text);
  return {
    ...data,
    id: `ai-${Date.now()}`,
    difficulty
  };
};

export const getAIExplanation = async (code: string, userAnswer: string, correctAnswer: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `The student answered "${userAnswer}" for the following Python code:\n\n${code}\n\nThe correct answer was "${correctAnswer}". Explain why the student was wrong and why the correct answer is right in 2 short sentences. Be encouraging.`,
  });
  return response.text || "Keep practicing! You'll get it next time.";
};
