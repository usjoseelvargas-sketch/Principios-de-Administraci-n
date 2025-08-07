import { getFunctions, httpsCallable, FunctionsError } from 'firebase/functions';
import { getApp } from 'firebase/app';

// Inicializa Firebase Functions
const functions = getFunctions(getApp());

// Crea una referencia a la función 'generateContent' que desplegamos.
// Firebase convierte los nombres a minúsculas.
const generateContentCallable = httpsCallable(functions, 'generatecontent');

/**
 * Llama a la función de Firebase en el backend para generar contenido con Gemini.
 * @param prompt El prompt para enviar a la IA.