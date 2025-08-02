
import React, { useState, useCallback, useEffect, useRef } from 'react';
import PageWrapper from '../components/PageWrapper';
import InteractiveModule from '../components/InteractiveModule';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Card from '../components/ui/Card';
import { AnalyticsIcon, LightbulbIcon, CheckCircleIcon, XCircleIcon, MicrophoneIcon, StopCircleIcon, ChevronRightIcon } from '../constants';
import { useGeminiJsonQuery, useGeminiTextQuery } from '../hooks/useGeminiQuery';
import { SpeechRecognition } from '../types';

interface FinancialProblemData {
  problemType: string;
  statement: string;
  theory: {
    title: string;
    definition: string;
    formula: string;
    interpretation: string;
  };
}

const FinancialAnalyticsPage: React.FC = () => {
  const [problem, setProblem] = useState<FinancialProblemData | null>(null);
  const [isTheoryVisible, setIsTheoryVisible] = useState(false);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const { 
    data: problemData, 
    error: problemError, 
    isLoading: isLoadingProblem, 
    executeQuery: fetchProblem,
    reset: resetProblem
  } = useGeminiJsonQuery<FinancialProblemData>();

  const { 
    data: feedbackData, 
    error: feedbackError, 
    isLoading: isLoadingFeedback, 
    executeQuery: fetchFeedback,
    reset: resetFeedback
  } = useGeminiTextQuery();

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);

  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognitionAPI) {
        recognitionRef.current = new SpeechRecognitionAPI();
        const recognition = recognitionRef.current;
        recognition.continuous = false;
        recognition.lang = 'es-ES';
        recognition.interimResults = false;

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setUserAnswer(prev => prev ? `${prev} ${transcript}` : transcript);
            setSpeechError(null);
        };

        recognition.onerror = (event) => {
            setSpeechError(`Error de reconocimiento: ${event.error}. Por favor, escribe tu respuesta.`);
        };
        
        recognition.onend = () => {
            setIsRecording(false);
        };
    }

    return () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
    };
  }, []);

  const handleToggleRecording = () => {
      if (!recognitionRef.current) {
          setSpeechError("El reconocimiento de voz no es compatible con este navegador.");
          return;
      }
      
      if (isRecording) {
          recognitionRef.current.stop();
      } else {
          setSpeechError(null);
          recognitionRef.current.start();
      }
      setIsRecording(!isRecording);
  };

  const handleGenerateProblem = useCallback(() => {
    resetProblem();
    resetFeedback();
    setProblem(null);
    setUserAnswer('');
    setFeedback(null);
    setIsTheoryVisible(false);
    if (isRecording) {
        handleToggleRecording();
    }
    const prompt = `
      Genera un problema financiero para un estudiante de administración de pregrado. El problema debe requerir un cálculo y una decisión.
      Devuelve la respuesta EXCLUSIVAMENTE en formato JSON con la siguiente estructura:
      {
        "problemType": "string (e.g., 'Valor Actual Neto (VAN)', 'Tasa Interna de Retorno (TIR)', 'Punto de Equilibrio')",
        "statement": "string (el enunciado completo del problema)",
        "theory": {
          "title": "string (El nombre del concepto teórico principal, e.g., 'Cálculo del Valor Actual Neto')",
          "definition": "string (Una breve definición del concepto)",
          "formula": "string (La fórmula matemática principal, usa texto plano como 'VAN = Sumatoria [FCt / (1+r)^t] - Inversión Inicial')",
          "interpretation": "string (Una breve explicación de cómo interpretar el resultado, e.g., 'Un VAN positivo sugiere que el proyecto es rentable...')"
        }
      }
      Asegúrate de que el JSON sea válido y completo, sin texto adicional antes o después del JSON.
    `;
    fetchProblem(prompt, "Eres un tutor de finanzas que crea problemas prácticos con explicaciones teóricas.");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchProblem, isRecording]);
  
  useEffect(() => {
    if (problemData) {
      if (problemData.statement && problemData.theory?.formula) {
        setProblem(problemData);
      } else {
        console.error("Received invalid JSON structure from AI, retrying:", problemData);
        handleGenerateProblem();
      }
    }
  }, [problemData, handleGenerateProblem]);

  const handleSubmitAnswer = useCallback(async () => {
    if (!problem || !userAnswer) return;
    resetFeedback();
    setFeedback(null);
    const prompt = `
      Un estudiante recibió el siguiente problema financiero sobre ${problem.problemType}: "${problem.statement}"
      La respuesta del estudiante fue: "${userAnswer}"

      Evalúa brevemente si el enfoque del estudiante parece razonable o si hay errores comunes relacionados con este tipo de problema.
      No resuelvas el problema numéricamente ni des la respuesta correcta.
      Proporciona comentarios generales sobre su posible proceso de pensamiento o errores comunes, considerando la fórmula: ${problem.theory.formula}.
      Si la respuesta es textual, comenta su claridad o enfoque. Sé constructivo.
    `;
    await fetchFeedback(prompt, "Eres un tutor de finanzas que proporciona retroalimentación sobre las respuestas de los estudiantes.");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [problem, userAnswer, fetchFeedback]);

  useEffect(() => {
    if (feedbackData) {
      setFeedback(feedbackData);
    }
  }, [feedbackData]);

  return (
    <PageWrapper title="Análisis Financiero y Toma de Decisiones" titleIcon={<AnalyticsIcon />}>
      <InteractiveModule
        title="Resolución de Problemas Financieros con IA"
        icon={<LightbulbIcon className="w-6 h-6" />}
        initialInstructions="Haz clic en 'Generar Problema' para recibir un ejercicio financiero de la IA. Revisa la teoría si es necesario, resuélvelo y envía tu respuesta para obtener retroalimentación."
      >
        <Button onClick={handleGenerateProblem} disabled={isLoadingProblem} isLoading={isLoadingProblem} className="mb-6">
          {isLoadingProblem ? 'Generando Problema...' : 'Generar Nuevo Problema Financiero'}
        </Button>

        {problemError && (
          <Card className="mb-6 bg-red-50 border-red-500">
             <div className="flex items-center text-red-700">
                <XCircleIcon className="w-6 h-6 mr-2" />
                <p><strong>Error al generar problema:</strong> {problemError}</p>
            </div>
          </Card>
        )}

        {isLoadingProblem && !problem && <div className="my-6"><LoadingSpinner text="Cargando problema..."/></div> }

        {problem && (
          <Card className="mb-6 border-l-4 border-blue-500">
            <h4 className="text-lg font-semibold text-neutral-800 mb-2">Problema Propuesto: {problem.problemType}</h4>
            <p className="text-neutral-700 whitespace-pre-wrap mb-4">{problem.statement}</p>
            
            {/* Theory Section */}
            <div className="bg-neutral-50 rounded-lg border border-neutral-200">
                <button
                    onClick={() => setIsTheoryVisible(!isTheoryVisible)}
                    className="w-full flex justify-between items-center p-3 text-left font-medium text-primary"
                >
                    <span>Ver Teoría y Fórmula Relevante</span>
                    <ChevronRightIcon className={`w-5 h-5 transition-transform ${isTheoryVisible ? 'rotate-90' : ''}`} />
                </button>
                {isTheoryVisible && (
                    <div className="px-4 pb-4 border-t border-neutral-200 space-y-3">
                        <h5 className="font-bold mt-3 text-neutral-700">{problem.theory.title}</h5>
                        <p className="text-sm text-neutral-600">{problem.theory.definition}</p>
                        <div>
                            <p className="text-sm font-semibold text-neutral-700">Fórmula:</p>
                            <p className="text-sm text-neutral-600 bg-neutral-200 p-2 rounded-md font-mono">{problem.theory.formula}</p>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-neutral-700">Interpretación:</p>
                            <p className="text-sm text-neutral-600">{problem.theory.interpretation}</p>
                        </div>
                    </div>
                )}
            </div>
            
            <div className="mt-6">
              <label htmlFor="user-answer" className="block text-sm font-medium text-neutral-700 mb-1">
                Tu Respuesta:
              </label>
               <div className="relative w-full">
                <textarea
                  id="user-answer"
                  rows={4}
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="w-full p-2 border border-neutral-300 rounded-md shadow-sm focus:ring-primary focus:border-primary pr-12"
                  placeholder="Ingresa tu solución o análisis aquí..."
                  onPaste={(e) => e.preventDefault()}
                  disabled={isRecording}
                />
                <Button
                    onClick={handleToggleRecording}
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2 !p-2 h-8 w-8"
                    aria-label={isRecording ? 'Detener grabación' : 'Grabar respuesta por voz'}
                    disabled={!recognitionRef.current}
                >
                    {isRecording ? <StopCircleIcon className="w-4 h-4 text-red-500" /> : <MicrophoneIcon className="w-4 h-4" />}
                </Button>
              </div>
               {speechError && <p className="text-sm text-red-600 mt-1">{speechError}</p>}
               {isRecording && <p className="text-sm text-blue-600 animate-pulse mt-1">Escuchando...</p>}
            </div>
            <Button onClick={handleSubmitAnswer} disabled={isLoadingFeedback || !userAnswer} isLoading={isLoadingFeedback} className="mt-4">
              {isLoadingFeedback ? 'Evaluando...' : 'Enviar Respuesta y Obtener Retroalimentación'}
            </Button>
          </Card>
        )}

        {feedbackError && (
          <Card className="mb-6 bg-red-50 border-red-500">
             <div className="flex items-center text-red-700">
                <XCircleIcon className="w-6 h-6 mr-2" />
                <p><strong>Error al obtener retroalimentación:</strong> {feedbackError}</p>
            </div>
          </Card>
        )}

        {isLoadingFeedback && !feedback && <div className="my-6"><LoadingSpinner text="Generando retroalimentación..."/></div> }
        
        {feedback && (
          <Card className="border-l-4 border-green-500">
            <h4 className="text-lg font-semibold text-neutral-800 mb-2 flex items-center">
                <CheckCircleIcon className="w-6 h-6 mr-2 text-green-600" />
                Retroalimentación de la IA:
            </h4>
            <p className="text-neutral-700 whitespace-pre-wrap">{feedback}</p>
            <p className="mt-3 text-xs text-neutral-500 italic">Esta retroalimentación es generada por IA y tiene fines educativos. No sustituye la revisión de un instructor calificado.</p>
          </Card>
        )}
      </InteractiveModule>
    </PageWrapper>
  );
};

export default FinancialAnalyticsPage;
