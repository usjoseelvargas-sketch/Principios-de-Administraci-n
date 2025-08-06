import React, { useState, useCallback, useEffect } from 'react';
import { generateContent } from '../services/geminiService'; // CAMBIO: Importamos nuestro servicio unificado

// Componentes y Constantes
import PageWrapper from '../components/PageWrapper';
import InteractiveModule from '../components/InteractiveModule';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Card from '../components/ui/Card';
import { SimulationIcon, LightbulbIcon, CheckCircleIcon, XCircleIcon } from '../constants';
import { SimulationResult } from '../types';

// Importaciones de Firebase
import { getFirestore, collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { getApp } from 'firebase/app';

// Definiciones de tipos locales para mayor claridad
interface DecisionOption {
  id: string;
  text: string;
}

interface Scenario {
  id: string;
  title: string;
  description: string;
  options: DecisionOption[];
  kpiNames: string[];
}

// Funciones de parseo (sin cambios, están bien)
const parseKpisFromString = (text: string, kpiNames: string[]): { name: string; value: string }[] => {
    const kpis: { name: string; value: string }[] = [];
    kpiNames.forEach(kpiName => {
        const regex = new RegExp(`${kpiName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}:\\s*([\\d.,+\\- %$]+)`, 'i');
        const match = text.match(regex);
        if (match && match[1]) {
            kpis.push({ name: kpiName, value: match[1].trim() });
        }
    });
    return kpis;
};

const parseScoreFromString = (text: string): number | null => {
  const regex = /Calificación:\s*([\d.]+)/;
  const match = text.match(regex);
  if (match && match[1]) {
    const score = parseFloat(match[1]);
    return isNaN(score) ? null : score;
  }
  return null;
};


const BusinessSimulationPage: React.FC = () => {
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);
  const [selectedOption, setSelectedOption] = useState<DecisionOption | null>(null);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [studentName, setStudentName] = useState<string>('');
  
  // CAMBIO: Estados unificados para las llamadas a la API
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Función para limpiar estados
  const resetAll = useCallback(() => {
    setError(null);
    setIsLoading(false);
    setCurrentScenario(null);
    setSelectedOption(null);
    setSimulationResult(null);
  }, []);

  const generateNewScenario = useCallback(async () => {
    resetAll();
    setIsLoading(true);

    const prompt = `
        Genera un escenario de simulación de negocios único y conciso para un estudiante de administración.
        El escenario debe estar en formato JSON y contener:
        1. "id": un string único (puedes usar un timestamp numérico como string).
        2. "title": un título breve y atractivo para el escenario.
        3. "description": una descripción de 2-3 frases sobre un dilema empresarial.
        4. "options": un array de 3 o 4 objetos, cada uno con "id" (e.g., "A", "B", "C") y "text" (la decisión a tomar).
        5. "kpiNames": un array de 3 o 4 strings que representen los indicadores clave de rendimiento relevantes (e.g., "Ventas Mensuales", "Satisfacción del Cliente (1-10)", "Costos Operativos").
        
        Asegúrate de que el JSON sea válido. Ejemplo de estructura:
        {
          "id": "1678886400000",
          "title": "Crisis de Redes Sociales",
          "description": "Una reseña negativa de un influencer se ha vuelto viral. Las ventas online han caído un 20%. ¿Qué acción priorizas?",
          "options": [
            { "id": "A", "text": "Lanzar una campaña de marketing de contraataque con otros influencers." },
            { "id": "B", "text": "Ignorar la reseña y esperar a que pase la tormenta." },
            { "id": "C", "text": "Publicar una disculpa oficial y ofrecer un descuento a todos los clientes." }
          ],
          "kpiNames": ["Ventas Online", "Sentimiento de Marca", "Costo de Adquisición de Cliente"]
        }
    `;

    try {
      // CAMBIO: Usamos nuestro servicio. La API de Gemini puede generar JSON directamente.
      const responseText = await generateContent(prompt);
      // Limpiamos la respuesta para asegurarnos de que sea un JSON válido
      const cleanedJsonString = responseText.replace(/```json|```/g, '').trim();
      const newScenario = JSON.parse(cleanedJsonString);
      setCurrentScenario(newScenario);
    } catch (e) {
      console.error("Error al generar escenario:", e);
      setError(e instanceof Error ? e.message : "No se pudo generar el escenario. Revisa el formato de la respuesta.");
    } finally {
      setIsLoading(false);
    }
  }, [resetAll]);

  const handleDecision = useCallback(async () => {
    if (!currentScenario || !selectedOption || !studentName.trim()) {
      alert("Por favor, ingresa tu nombre y selecciona una opción.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSimulationResult(null);

    const prompt = `
      Eres un IA de simulación de negocios para estudiantes.
      Escenario: ${currentScenario.title} - ${currentScenario.description}
      Decisión del estudiante: ${selectedOption.text}

      1.  **Describe el resultado probable** de esta decisión en 1-2 párrafos concisos y educativos.
      2.  **Calcula el impacto** en los siguientes KPIs (usa el formato exacto "KPI: valor"):
          ${currentScenario.kpiNames.map(kpi => `- ${kpi}: [valor numérico o descriptivo breve]`).join('\n')}
      3.  **Proporciona una calificación** entre 0.0 y 5.0 (un decimal) para esta decisión. Usa el formato exacto: "Calificación: [valor]".
    `;

    try {
      // CAMBIO: Llamada directa a nuestro servicio
      const responseText = await generateContent(prompt);
      
      const narrative = responseText;
      const kpis = parseKpisFromString(responseText, currentScenario.kpiNames);
      const score = parseScoreFromString(responseText);
      
      const resultData = { narrative, kpis, score };
      setSimulationResult(resultData);

      // CAMBIO: Guardar en Firestore DESPUÉS de tener el resultado
      try {
        const db = getFirestore(getApp());
        await addDoc(collection(db, "decisiones_estudiantes"), {
            nombreEstudiante: studentName.trim(),
            escenario: currentScenario,
            decision: selectedOption,
            resultado: resultData, // Guardamos el resultado completo
            timestamp: new Date()
        });
        console.log("Decisión y resultado guardados en Firestore.");
      } catch (dbError) {
          console.error("Error al guardar en Firestore:", dbError);
          // No mostramos alert al usuario, es un fallo de fondo
      }

    } catch (e) {
      console.error("Error al simular decisión:", e);
      setError(e instanceof Error ? e.message : "No se pudo simular el resultado.");
    } finally {
      setIsLoading(false);
    }
  }, [currentScenario, selectedOption, studentName]);
  
  // Generar escenario al cargar la página por primera vez
  useEffect(() => {
    generateNewScenario();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageWrapper title="Laboratorio de Simulación Empresarial" titleIcon={<SimulationIcon />}>
      <InteractiveModule
        title="Escenarios de Decisión"
        icon={<LightbulbIcon className="w-6 h-6" />}
        initialInstructions="Ingresa tu nombre, genera un escenario, elige una opción y observa los resultados simulados por la IA."
      >
        <div className="mb-4">
          <label htmlFor="studentNameInput" className="block text-sm font-medium text-neutral-700 mb-1">
            Nombre del Estudiante:
          </label>
          <input
            id="studentNameInput"
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="Escribe tu nombre para empezar"
            className="w-full p-2 border border-neutral-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
            disabled={isLoading}
          />
        </div>

        <Button
          onClick={generateNewScenario}
          isLoading={isLoading && !currentScenario}
          disabled={isLoading}
          className="w-full mb-6"
        >
          {isLoading && !currentScenario ? 'Generando Escenario...' : 'Generar Nuevo Escenario'}
        </Button>

        {error && (
          <Card className="my-4 bg-red-50 border-red-500">
            <div className="flex items-center text-red-700">
              <XCircleIcon className="w-6 h-6 mr-2" />
              <p><strong>Error:</strong> {error}</p>
            </div>
          </Card>
        )}

        {currentScenario && !isLoading && (
          <Card className="mb-4">
            <h3 className="text-xl font-semibold text-neutral-800 mb-2">{currentScenario.title}</h3>
            <p className="text-neutral-600 mb-4">{currentScenario.description}</p>
            
            <div className="space-y-3 mb-4">
              {currentScenario.options.map(option => (
                <Button
                  key={option.id}
                  variant={selectedOption?.id === option.id ? 'primary' : 'outline'}
                  onClick={() => setSelectedOption(option)}
                  className="w-full justify-start text-left"
                  disabled={isLoading}
                >
                  {option.text}
                </Button>
              ))}
            </div>

            <Button
              onClick={handleDecision}
              disabled={!selectedOption || isLoading || !studentName.trim()}
              isLoading={isLoading && !!selectedOption}
            >
              {isLoading && !!selectedOption ? 'Simulando...' : 'Tomar Decisión y Ver Resultado'}
            </Button>
          </Card>
        )}

        {simulationResult && !isLoading && (
          <Card className="mt-6 border-l-4 border-green-500">
            <h4 className="text-xl font-semibold text-neutral-800 mb-3 flex items-center">
                <CheckCircleIcon className="w-6 h-6 mr-2 text-green-600"/>
                Resultado de la Simulación
            </h4>
            
            {simulationResult.score !== null && (
              <div className="my-4 p-4 bg-primary-light rounded-md border border-primary">
                <p className="text-xl font-bold text-neutral-800 text-center">
                  Calificación de la Decisión: <span className="text-primary-dark">{simulationResult.score.toFixed(1)} / 5.0</span>
                </p>
              </div>
            )}

            <div className="prose prose-sm max-w-none text-neutral-700 mb-4 whitespace-pre-wrap">
                {simulationResult.narrative}
            </div>

            {simulationResult.kpis && simulationResult.kpis.length > 0 && (
              <div>
                <h5 className="font-semibold text-neutral-700 mb-2">Impacto en Indicadores (KPIs):</h5>
                <ul className="list-disc list-inside space-y-1 text-neutral-600">
                  {simulationResult.kpis.map(kpi => (
                    <li key={kpi.name}><strong>{kpi.name}:</strong> {kpi.value}</li>
                  ))}
                </ul>
              </div>
            )}
            <p className="mt-4 text-xs text-neutral-500 italic">
              Recuerda: Esta es una simulación simplificada. En el mundo real, múltiples factores influirían en el resultado.
            </p>
          </Card>
        )}
        
        {isLoading && <div className="mt-6"><LoadingSpinner text={currentScenario ? "Simulando resultado..." : "Generando escenario..."}/></div>}

      </InteractiveModule>
    </PageWrapper>
  );
};

export default BusinessSimulationPage;
