// Este archivo DEBE estar en la carpeta `api` en la raíz de tu proyecto.
// Ejemplo: /api/gemini.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

type ApiResponse = { text?: string; message?: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  // 1. Solo aceptar peticiones POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { prompt } = req.body;
  
  // 2. Leer la clave de API de forma segura desde las variables de entorno del servidor
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error("Error: La clave API de Gemini no está configurada en el servidor.");
    return res.status(500).json({ message: 'La clave API de Gemini no está configurada en el servidor.' });
  }

  if (!prompt) {
    return res.status(400).json({ message: 'El prompt es requerido.' });
  }

  try {
    // 3. Inicializar el cliente de la IA con la clave segura
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest",
      // Es una buena práctica configurar los ajustes de seguridad
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
    });

    // 4. Hacer la llamada a la API de Google
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 5. Enviar la respuesta de vuelta al frontend
    res.status(200).json({ text });
  } catch (error) {
    console.error('Error en la API de Gemini:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error al comunicarse con la API de Gemini.';
    res.status(500).json({ message: errorMessage });
  }
}
