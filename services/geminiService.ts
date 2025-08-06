// src/services/geminiService.ts

import { GoogleGenerativeAI, GenerationConfig, SafetySetting, HarmCategory } from "@google/generative-ai";

// Obtiene la API Key desde las variables de entorno de Vite
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// Valida que la API Key exista
if (!apiKey) {
  throw new Error("VITE_GEMINI_API_KEY no está definida en el archivo .env");
}

// Inicializa el cliente de Google Generative AI
const genAI = new GoogleGenerativeAI(apiKey);

// Configuración del modelo
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash", // O el modelo que prefieras
});

/**
 * Función para generar contenido basado en un prompt.
 * @param {string} prompt - El texto de entrada para el modelo.
 * @returns {Promise<string>} - La respuesta generada por el modelo.
 */
export const generateContent = async (prompt: string): Promise<string> => {
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error al generar contenido:", error);
    return "No se pudo obtener una respuesta del modelo. Por favor, inténtalo de nuevo.";
  }
};