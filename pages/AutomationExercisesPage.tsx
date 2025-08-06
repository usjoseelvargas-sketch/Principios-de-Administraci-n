import React, { useState, useCallback, useEffect, useRef } from 'react';
import { generateContent } from '../services/geminiService'; // CAMBIO: Importamos nuestro servicio

// Componentes y Constantes (asumimos que existen y están correctos)
import PageWrapper from '../components/PageWrapper';
import InteractiveModule from '../components/InteractiveModule';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Card from '../components/ui/Card';
import { AutomationIcon, LightbulbIcon, CheckCircleIcon, XCircleIcon, MicrophoneIcon, StopCircleIcon } from '../constants'; // Asegúrate de que estos iconos existan
import { AutomationScenario, SpeechRecognition } from '../types'; // Asegúrate de que estos tipos existan
import { AUTOMATION_SCENARIOS } from '../constants'; // Asegúrate de que estas constantes existan

const AutomationExercisesPage: React.FC = () => {
  const [currentScenario, setCurrentScenario] = useState<AutomationScenario | null>(null);
  const [selectedStepIds, setSelectedStepIds] = useState<Set<string>>(new Set());
  const [justification, setJustification] = useState('');

  // CAMBIO: Estados locales para manejar la llamada a la API en lugar del hook
  const [geminiFeedback, setGeminiFeedback] = useState<string | null>(null);
  const [geminiError, setGeminiError] = useState<string | null>(null);
  const [isLoadingGemini, setIsLoadingGemini] = useState<boolean>(false);
  
  // Speech-to-text state
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);

  // Función para limpiar el estado de Gemini
  const resetGemini = useCallback(() => {
    setGeminiFeedback(null);
    setGeminiError(null);
    setIsLoadingGemini(false);
  }, []);

  // Speech-to-text setup (sin cambios)
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
            setJustification(prev => prev ? `${prev} ${transcript}` : transcript);
            setSpeechError(null);
        };
        recognition.onerror = (event) => setSpeechError(`Error en reconocimiento: ${event.error}. Por favor, escribe tu respuesta.`);
        recognition.onend = () => setIsRecording(false);
    }
    return () => {
        if (recognitionRef.current) recognitionRef.current.stop();
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

  const loadNewScenario = useCallback(() => {
    if(isRecording) handleToggleRecording();
    resetGemini();
    setSelectedStepIds(new Set());
    setJustification('');
    setSpeechError(null);
    const randomIndex = Math.floor(Math.random() * AUTOMATION_SCENARIOS.length);
    setCurrentScenario(AUTOMATION_SCENARIOS[randomIndex]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetGemini, isRecording]);

  useEffect(() => {
    loadNewScenario();
  }, [loadNewScenario]);

  const handleStepToggle = (stepId: string) => {
    setSelectedStepIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(stepId)) {
        newSet.delete(stepId);
      } else {
        newSet.add(stepId);
      }
      return newSet;
    });
  };

  // CAMBIO: La función que llama a la API ahora es un async/await directo
  const handleSubmit = useCallback(async () => {
    if (!currentScenario || selectedStepIds.size === 0 || !justification.trim()) return;

    resetGemini();
    setIsLoadingGemini(true);

    const selectedStepsDescriptions = currentScenario.steps
        .filter(step => selectedStepIds.has(step.id))
        .map(step => step.description);

    // El prompt se mantiene igual, es excelente.
    const prompt = `
      Eres un consultor experto en optimización de procesos y automatización (RPA, Workflows). Estás evaluando el análisis de un estudiante sobre un proceso de negocio.

      Contexto del Proceso:
      Título del Escenario: "${currentScenario.title}"
      Descripción: "${currentScenario.processDescription}"
      Pasos del proceso:
      ${currentScenario.steps.map((s, i) => `${i + 1}. ${s.description}`).join('\n')}

      Análisis del Estudiante:
      Pasos seleccionados para automatizar:
      ${selectedStepsDescriptions.length > 0 ? selectedStepsDescriptions.map(d => `- ${d}`).join('\n') : "Ninguno"}

      Justificación del estudiante: "${justification}"

      Por favor, evalúa la propuesta del estudiante con los siguientes criterios:
      1.  **Selección de Tareas:** ¿El estudiante identificó correctamente las tareas repetitivas, basadas en reglas y de bajo valor añadido que son ideales para la automatización? ¿Omitió alguna evidente? ¿Seleccionó alguna que requiera juicio humano complejo?
      2.  **Calidad de la Justificación:** ¿La justificación explica claramente los beneficios esperados? (Ej: reducción de tiempo, disminución de errores, aumento de la productividad, mejora de la moral del empleado, etc.). ¿Es una justificación sólida y orientada al negocio?
      3.  **Visión de Proceso:** ¿El estudiante demuestra entender cómo la automatización de ciertos pasos impacta el proceso en general?

      Proporciona retroalimentación constructiva y detallada en 2-4 párrafos:
      - Comienza con un resumen de los aciertos del estudiante.
      - Analiza su selección de pasos, explicando por qué son buenas (o malas) elecciones. Menciona si olvidó algún candidato claro.
      - Evalúa su justificación, sugiriendo cómo podría ser más fuerte o completa.
      - Concluye con una visión más amplia, quizás mencionando qué tipo de tecnologías (como RPA para data entry, o software de workflow para aprobaciones) podrían aplicarse. El tono debe ser el de un mentor experto.
    `;

    try {
      // Llamada directa a nuestro servicio
      const feedback = await generateContent(prompt);
      setGeminiFeedback(feedback);
    } catch (error) {
      console.error("Error en handleSubmit:", error);
      setGeminiError(error instanceof Error ? error.message : "Ocurrió un error desconocido.");
    } finally {
      setIsLoadingGemini(false);
    }
  }, [currentScenario, selectedStepIds, justification, resetGemini]);

  // El JSX se mantiene casi idéntico.
  return (
    <PageWrapper title="Ejercicios de Automatización de Tareas" titleIcon={<AutomationIcon />} subtitle="Identifica ineficiencias y propone soluciones de automatización en procesos reales.">
      <InteractiveModule
        title="Laboratorio de Automatización de Procesos"
        icon={<LightbulbIcon className="w-6 h-6" />}
        initialInstructions="1. Analiza el proceso de negocio. 2. Selecciona los pasos que automatizarías. 3. Justifica tu elección explicando los beneficios. 4. Recibe feedback experto de la IA."
      >
        <Button onClick={loadNewScenario} disabled={isLoadingGemini || isRecording} className="mb-6">
          Generar Nuevo Escenario de Proceso
        </Button>

        {currentScenario && (
          <Card className="mb-6 border-l-4 border-indigo-500">
            <h4 className="text-lg font-semibold text-neutral-800 mb-2">Escenario: {currentScenario.title}</h4>
            <p className="text-neutral-600 mb-4">{currentScenario.processDescription}</p>

            <fieldset>
              <legend className="text-md font-semibold text-neutral-700 mb-2">Pasos del Proceso (selecciona los que automatizarías):</legend>
              <div className="space-y-3">
                {currentScenario.steps.map((step) => (
                  <label key={step.id} htmlFor={step.id} className="flex items-center p-3 border rounded-lg hover:bg-neutral-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      id={step.id}
                      name="automation_step"
                      checked={selectedStepIds.has(step.id)}
                      onChange={() => handleStepToggle(step.id)}
                      className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                      disabled={isLoadingGemini || isRecording}
                    />
                    <span className="ml-3 text-sm text-neutral-700">{step.description}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="mt-6">
              <label htmlFor="justification" className="block text-md font-semibold text-neutral-700 mb-2">
                Justificación de tu Selección
              </label>
              <div className="relative w-full">
                  <textarea
                    id="justification"
                    rows={5}
                    value={justification}
                    onChange={(e) => setJustification(e.target.value)}
                    className="w-full p-2 border border-neutral-300 rounded-md shadow-sm focus:ring-primary focus:border-primary pr-12"
                    placeholder="Explica por qué elegiste estos pasos. ¿Qué beneficios traerá la automatización (ahorro de tiempo, reducción de errores, etc.)?"
                    disabled={isLoadingGemini || isRecording}
                  />
                  <Button
                      onClick={handleToggleRecording}
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2 !p-2 h-8 w-8"
                      aria-label={isRecording ? 'Detener grabación' : 'Grabar justificación por voz'}
                      disabled={!recognitionRef.current || isLoadingGemini}
                  >
                      {isRecording ? <StopCircleIcon className="w-4 h-4 text-red-500" /> : <MicrophoneIcon className="w-4 h-4" />}
                  </Button>
              </div>
              {speechError && <p className="text-sm text-red-600 mt-1">{speechError}</p>}
              {isRecording && <p className="text-sm text-blue-600 animate-pulse mt-1">Escuchando...</p>}
            </div>

            <Button
              onClick={handleSubmit}
              disabled={isLoadingGemini || selectedStepIds.size === 0 || !justification.trim() || isRecording}
              isLoading={isLoadingGemini}
              className="mt-4"
            >
              {isLoadingGemini ? 'Enviando Análisis...' : 'Evaluar mi Propuesta'}
            </Button>
          </Card>
        )}

        {isLoadingGemini && <div className="my-6"><LoadingSpinner text="Generando análisis experto..." /></div>}

        {geminiError && !isLoadingGemini && (
          <Card className="my-6 bg-red-50 border-red-500">
            <div className="flex items-center text-red-700">
              <XCircleIcon className="w-6 h-6 mr-2" />
              <p><strong>Error al obtener retroalimentación:</strong> {geminiError}</p>
            </div>
          </Card>
        )}

        {geminiFeedback && !isLoadingGemini && (
          <Card className="my-6 border-l-4 border-green-500">
            <h4 className="text-xl font-semibold text-neutral-800 mb-3 flex items-center">
              <CheckCircleIcon className="w-6 h-6 mr-2 text-green-600" />
              Análisis de tu Propuesta de Automatización
            </h4>
            <div className="prose prose-sm max-w-none text-neutral-700 whitespace-pre-wrap">
              <div>{geminiFeedback}</div>
            </div>
            <p className="mt-3 text-xs text-neutral-500 italic">Este análisis te ayudará a desarrollar un ojo crítico para la optimización de procesos.</p>
          </Card>
        )}
      </InteractiveModule>
    </PageWrapper>
  );
};

export default AutomationExercisesPage;
