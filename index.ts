import {onCall, HttpsError} from "firebase-functions/v2/https";
import {initializeApp} from "firebase-admin/app";
import {GoogleGenerativeAI} from "@google/generative-ai";
import * as logger from "firebase-functions/logger";

// Inicializar Firebase Admin SDK. No se necesitan credenciales si se ejecuta en el entorno de Firebase.
initializeApp();

// La API Key se gestiona como un secreto en Firebase.
// Para configurar, ejecuta desde la raíz de tu proyecto:
// firebase functions:secrets:set GEMINI_API_KEY
// y pega tu clave cuando se te solicite.

export const generateContent = onCall({secrets: ["GEMINI_API_KEY"]}, async (request) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    logger.error(
      "No se encontró la API Key de Gemini en los secretos de la función.",
      "Asegúrate de haber configurado el secreto 'GEMINI_API_KEY' y desplegado la función."
    );
    throw new HttpsError(
      "failed-precondition",
      "La API Key de Gemini no está configurada en el servidor."
    );
  }

  const {prompt} = request.data;

  if (!prompt || typeof prompt !== "string") {
    throw new HttpsError(
      "invalid-argument",
      "La función debe ser llamada con un argumento 'prompt' de tipo string."
    );
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({model: "gemini-1.5-flash-latest"});

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return {text};
  } catch (error) {
    logger.error("Error al llamar a la API de Gemini:", error);
    const err = error as Error;
    throw new HttpsError("internal", err.message, {stack: err.stack});
  }
});