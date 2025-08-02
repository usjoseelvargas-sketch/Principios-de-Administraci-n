import React, { useState, useCallback } from 'react';
import PageWrapper from '../components/PageWrapper';
import InteractiveModule from '../components/InteractiveModule';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Card from '../components/ui/Card';
import { SimulationIcon, LightbulbIcon, CheckCircleIcon, XCircleIcon } from '../constants';
import { useGeminiTextQuery } from '../hooks/useGeminiQuery';
import { SimulationResult } from '../types';

// NUEVAS IMPORTACIONES PARA FIRESTORE
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getApp } from 'firebase/app';

interface DecisionOption {
  id: string;
  text: string;
}

interface Scenario {
  id: string;
  title: string;
  description: string;
  options: DecisionOption[];
  kpiNames: string[]; // e.g., ["Sales Change (%)", "Brand Awareness (1-10)"]
}

// Se comenta el array de escenarios fijos para usar la generación por IA
/*
const scenarios: Scenario[] = [
...
];
*/

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


const BusinessSimulationPage: React.FC = () => {
  // El estado ahora comienza en null, ya que no hay un escenario precargado
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);
  const [selectedOption, setSelectedOption] = useState<DecisionOption | null>(null);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [studentName, setStudentName] = useState<string>('');
  
  // Nuevo estado para manejar la carga y errores al generar el escenario
  const [isLoadingScenario, setIsLoadingScenario] = useState<boolean>(false);
  const [scenarioError, setScenarioError] = useState<string | null>(null);
  
  const { data: geminiResponse, error, isLoading, executeQuery, reset: resetGemini } = useGeminiTextQuery();

  // Nueva función para generar un escenario usando la API de Gemini
  const generateNewScenario = useCallback(async () => {
    setIsLoadingScenario(true);
    setScenarioError(null);
    setCurrentScenario(null);
    setSelectedOption(null);
    setSimulationResult(null);
    resetGemini();

    const prompt = `
        Genera un escenario de simulación de negocios único para estudiantes.
        El escenario debe incluir un título, una descripción, 3-4 opciones de decisión y 3-4 KPIs relevantes con sus nombres.
        El formato debe ser JSON.
    `;

    // Define el esquema para asegurar que la respuesta JSON de la IA tenga la estructura correcta
    const payload = {
        contents: [{
            parts: [{ text: prompt }]
        }],
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
                type: "OBJECT",
                properties: {
                    id: { type: "STRING" },
                    title: { type: "STRING" },
                    description: { type: "STRING" },
                    options: {
                        type: "ARRAY",
                        items: {
                            type: "OBJECT",
                            properties: {
                                id: { type: "STRING" },
                                text: { type: "STRING" }
                            }
                        }
                    },
                    kpiNames: {
                        type: "ARRAY",
                        items: { type: "STRING" }
                    }
                },
                "propertyOrdering": ["id", "title", "description", "options", "kpiNames"]
            }
        }
    };
    
    // Configuración de la API para generar JSON
    const apiKey = "";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    // Llama a la API de forma segura con reintentos
    let retryCount = 0;
    const maxRetries = 3;
    const initialDelay = 1000;

    while (retryCount < maxRetries) {
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                if (response.status === 429) {
                    const delay = initialDelay * Math.pow(2, retryCount);
                    await new Promise(res => setTimeout(res, delay));
                    retryCount++;
                    continue; // Retry the request
                } else {
                    throw new Error(`API Error: ${response.statusText}`);
                }
            }

            const result = await response.json();
            const jsonText = result?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (jsonText) {
                const newScenario = JSON.parse(jsonText);
                setCurrentScenario(newScenario);
                break; // Exit the loop on success
            } else {
                throw new Error("Respuesta de la IA vacía o con formato incorrecto.");
            }
        } catch (e) {
            console.error("Error generating scenario:", e);
            setScenarioError(`Hubo un error al generar el escenario: ${e.message}`);
            break; // Exit the loop on a non-retryable error
        }
    }
    setIsLoadingScenario(false);
  }, [resetGemini]);

  const handleDecision = useCallback(async () => {
    if (!currentScenario || !selectedOption) return;

    if (!studentName.trim()) {
        alert("Por favor, ingresa tu nombre para continuar.");
        return;
    }
    setSimulationResult(null);

    const prompt = `
      Eres un IA de simulación de negocios para estudiantes.
      Escenario: ${currentScenario.title} - ${currentScenario.description}
      Decisión del estudiante: ${selectedOption.text}

      Describe el resultado probable de esta decisión en 1-2 párrafos concisos.
      Incluye el impacto potencial en los siguientes KPIs (usa el formato exacto incluyendo el nombre del KPI):
      ${currentScenario.kpiNames.map(kpi => `- ${kpi}: [valor numérico o descriptivo breve]`).join('\n')}
      
      Concéntrate en un lenguaje claro y educativo.
    `;
    
    await executeQuery(prompt, "Eres un simulador de negocios que ayuda a los estudiantes a comprender las consecuencias de sus decisiones.");
  
    try {
        const db = getFirestore(getApp());
        await addDoc(collection(db, "decisiones_estudiantes"), {
            nombreEstudiante: studentName.trim(),
            escenario: currentScenario.title,
            decision: selectedOption.text,
            timestamp: new Date()
        });
        console.log("Decisión guardada en Firestore.");
    } catch (e) {
        console.error("Error al guardar en Firestore:", e);
        alert("Hubo un error al guardar tu decisión. Intenta de nuevo.");
    }

  }, [currentScenario, selectedOption, executeQuery, studentName]);
  
  React.useEffect(() => {
    if (geminiResponse && currentScenario) {
      const narrative = geminiResponse;
      const kpis = parseKpisFromString(geminiResponse, currentScenario.kpiNames);
      setSimulationResult({ narrative, kpis });
    }
  }, [geminiResponse, currentScenario]);

  // Se ejecuta la generación del escenario la primera vez que se carga el componente
  React.useEffect(() => {
    if (!currentScenario && !isLoadingScenario) {
      generateNewScenario();
    }
  }, [currentScenario, isLoadingScenario, generateNewScenario]);

  return (
    <PageWrapper title="Laboratorio de Simulación Empresarial" titleIcon={<SimulationIcon />}>
      <InteractiveModule
        title="Escenarios de Decisión"
        icon={<LightbulbIcon className="w-6 h-6" />}
        initialInstructions="Haz clic en 'Generar Nuevo Escenario' para empezar. Luego, elige una opción y observa los resultados simulados por la IA."
      >
        <div className="mb-6">
          <label htmlFor="studentNameInput" className="block text-sm font-medium text-neutral-700 mb-1">
            Nombre del Estudiante:
          </label>
          <input
            id="studentNameInput"
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="Escribe tu nombre"
            className="w-full p-2 border border-neutral-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
          />
        </div>

        <Button
          onClick={generateNewScenario}
          isLoading={isLoadingScenario}
          className="w-full mb-6"
        >
          {isLoadingScenario ? 'Generando...' : 'Generar Nuevo Escenario'}
        </Button>

        {scenarioError && (
          <Card className="mt-6 bg-red-50 border-red-500">
            <div className="flex items-center text-red-700">
              <XCircleIcon className="w-6 h-6 mr-2" />
              <p><strong>Error:</strong> {scenarioError}</p>
            </div>
          </Card>
        )}

        {currentScenario && (
          <>
            <h3 className="text-lg font-semibold text-neutral-800 mb-2">{currentScenario.title}</h3>
            <p className="text-neutral-600 mb-4">{currentScenario.description}</p>
            
            <div className="space-y-3 mb-6">
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
              disabled={!selectedOption || isLoading || isLoadingScenario || !studentName.trim()}
              isLoading={isLoading}
            >
              {isLoading ? 'Simulando...' : 'Tomar Decisión y Ver Resultado'}
            </Button>
          </>
        )}

        {error && (
          <Card className="mt-6 bg-red-50 border-red-500">
            <div className="flex items-center text-red-700">
              <XCircleIcon className="w-6 h-6 mr-2" />
              <p><strong>Error:</strong> {error}</p>
            </div>
          </Card>
        )}

        {simulationResult && !isLoading && (
          <Card className="mt-6 border-l-4 border-green-500">
            <h4 className="text-xl font-semibold text-neutral-800 mb-3 flex items-center">
                <CheckCircleIcon className="w-6 h-6 mr-2 text-green-600"/>
                Resultado de la Simulación
            </h4>
            <div className="prose prose-sm max-w-none text-neutral-700 mb-4">
                <p>{simulationResult.narrative}</p>
            </div>
            {simulationResult.kpis && simulationResult.kpis.length > 0 && (
              <div>
                <h5 className="font-semibold text-neutral-700 mb-2">Indicadores Clave (KPIs):</h5>
                <ul className="list-disc list-inside space-y-1 text-neutral-600">
                  {simulationResult.kpis.map(kpi => (
                    <li key={kpi.name}><strong>{kpi.name}:</strong> {kpi.value}</li>
                  ))}
                </ul>
              </div>
            )}
            <p className="mt-4 text-sm text-neutral-500 italic">
              Recuerda: Esta es una simulación simplificada. En el mundo real, múltiples factores influirían en el resultado. Usa esto como una herramienta de aprendizaje y reflexión.
            </p>
          </Card>
        )}
        {isLoading && !simulationResult && <div className="mt-6"><LoadingSpinner text="Generando resultado de la simulación..."/></div>}
        {isLoadingScenario && <div className="mt-6"><LoadingSpinner text="Generando nuevo escenario..."/></div>}
      </InteractiveModule>
    </PageWrapper>
  );
};

export default BusinessSimulationPage;
