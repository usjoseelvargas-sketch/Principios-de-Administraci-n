
import React, { useState, useCallback, useEffect, useRef } from 'react';
import PageWrapper from '../components/PageWrapper';
import InteractiveModule from '../components/InteractiveModule';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Card from '../components/ui/Card';
import { TargetIcon, LightbulbIcon, CheckCircleIcon, XCircleIcon, MicrophoneIcon, StopCircleIcon } from '../constants';
import { useGeminiTextQuery } from '../hooks/useGeminiQuery';
import { SmartGoalScenario, SpeechRecognition } from '../types';
import { SMART_GOAL_SCENARIOS } from '../constants';

interface SmartGoalInputs {
    specific: string;
    measurable: string;
    achievable: string;
    relevant: string;
    timeBound: string;
}

const labels = {
    specific: { 
        label: "S - Específico (Specific)", 
        placeholder: "¿Qué quieres lograr exactamente? Sé claro y conciso.",
        description: "El objetivo debe ser claro y detallado. Debe responder a preguntas como: ¿Qué quiero lograr exactamente? ¿Quién está involucrado? ¿Dónde se realizará? ¿Por qué es importante? Cuanto más específico sea, más fácil será trazar un plan para alcanzarlo."
    },
    measurable: { 
        label: "M - Medible (Measurable)", 
        placeholder: "¿Cómo sabrás que lo has logrado? ¿Qué métricas usarás?",
        description: "Es crucial poder cuantificar el progreso y determinar cuándo se ha alcanzado la meta. Esto implica establecer indicadores o criterios claros que permitan seguir el avance y evaluar el éxito. Se debe poder responder: ¿Cuánto o cuántos? ¿Cómo sabré que lo he logrado?"
    },
    achievable: { 
        label: "A - Alcanzable (Achievable)", 
        placeholder: "¿Es esta meta realista con los recursos y tiempo disponibles? ¿Cómo?",
        description: "El objetivo debe ser realista y posible de lograr con los recursos y capacidades disponibles. Si bien puede ser desafiante, no debe ser imposible. Es importante considerar si se tienen las habilidades, el tiempo y los recursos necesarios para alcanzarlo."
    },
    relevant: { 
        label: "R - Relevante (Relevant)", 
        placeholder: "¿Por qué es importante esta meta para el escenario actual?",
        description: "La meta debe ser significativa y alinearse con tus objetivos generales, tanto personales como profesionales. Debe tener un impacto positivo y contribuir a un propósito mayor. Pregúntate: ¿Es importante este objetivo para mí/mi equipo/mi empresa? ¿Está alineado con mis otras prioridades?"
    },
    timeBound: { 
        label: "T - Limitado en el Tiempo (Time-bound)", 
        placeholder: "¿Cuál es la fecha límite para alcanzar esta meta?",
        description: "Es fundamental establecer una fecha límite clara para el cumplimiento del objetivo. Esto crea un sentido de urgencia, ayuda a mantener el enfoque y permite evaluar el éxito en un período determinado. Se debe responder: ¿Cuándo se espera lograr el objetivo?"
    }
};

const SmartGoalsPage: React.FC = () => {
  const [currentScenario, setCurrentScenario] = useState<SmartGoalScenario | null>(null);
  const [goalInputs, setGoalInputs] = useState<SmartGoalInputs>({
      specific: '',
      measurable: '',
      achievable: '',
      relevant: '',
      timeBound: '',
  });

  const {
    data: geminiFeedback,
    error: geminiError,
    isLoading: isLoadingGemini,
    executeQuery: fetchGeminiFeedback,
    reset: resetGemini,
  } = useGeminiTextQuery();

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [recordingField, setRecordingField] = useState<keyof SmartGoalInputs | null>(null);
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
            if (recordingField) {
                setGoalInputs(prev => ({...prev, [recordingField]: prev[recordingField] ? `${prev[recordingField]} ${transcript}`: transcript }));
            }
            setSpeechError(null);
        };
        recognition.onerror = (event) => setSpeechError(`Error: ${event.error}. Por favor, escribe.`);
        recognition.onend = () => setRecordingField(null);
    }
    return () => {
        if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, [recordingField]);

  const handleToggleRecording = (field: keyof SmartGoalInputs) => {
      if (!recognitionRef.current) {
          setSpeechError("El reconocimiento de voz no es compatible con este navegador.");
          return;
      }
      if (recordingField === field) {
          recognitionRef.current.stop();
      } else {
          if(recordingField) recognitionRef.current.stop();
          setSpeechError(null);
          setRecordingField(field);
          recognitionRef.current.start();
      }
  };


  const loadNewScenario = useCallback(() => {
    if(recordingField) recognitionRef.current?.stop();
    resetGemini();
    setGoalInputs({ specific: '', measurable: '', achievable: '', relevant: '', timeBound: '' });
    const randomIndex = Math.floor(Math.random() * SMART_GOAL_SCENARIOS.length);
    setCurrentScenario(SMART_GOAL_SCENARIOS[randomIndex]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetGemini, recordingField]);

  useEffect(() => {
    loadNewScenario();
  }, [loadNewScenario]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setGoalInputs(prev => ({...prev, [name]: value}));
  }

  const isFormComplete = Object.values(goalInputs).every(value => value.trim() !== '');

  const handleSubmitGoal = useCallback(async () => {
    if (!currentScenario || !isFormComplete) return;

    resetGemini();

    const prompt = `
      Eres un coach de productividad y liderazgo. Estás evaluando una meta SMART definida por un estudiante o profesional.

      Contexto del Objetivo:
      Título del Escenario: "${currentScenario.title}"
      Descripción: "${currentScenario.context}"

      Meta SMART propuesta por el usuario:
      - Específico (Specific): "${goalInputs.specific}"
      - Medible (Measurable): "${goalInputs.measurable}"
      - Alcanzable (Achievable): "${goalInputs.achievable}"
      - Relevante (Relevant): "${goalInputs.relevant}"
      - Limitado en el Tiempo (Time-bound): "${goalInputs.timeBound}"

      Por favor, evalúa esta meta de forma integral. No evalúes cada punto por separado, sino cómo funcionan juntos para formar una meta cohesiva y efectiva.
      
      Considera lo siguiente en tu análisis:
      1.  **Claridad y Cohesión:** ¿Los componentes de la meta se conectan lógicamente? ¿El componente 'Específico' está bien cuantificado en 'Medible' y enmarcado en 'Limitado en el Tiempo'?
      2.  **Alineación con el Contexto:** ¿La meta definida es una respuesta adecuada y potente al desafío descrito en el escenario? ¿Es verdaderamente 'Relevante'?
      3.  **Realismo y Ambición:** ¿El componente 'Alcanzable' describe un plan o una justificación creíble? ¿La meta parece un buen equilibrio entre ser desafiante y ser posible?
      4.  **Accionabilidad:** ¿La meta es lo suficientemente clara como para que alguien pueda empezar a trabajar en ella?

      Proporciona retroalimentación constructiva en 2-4 párrafos.
      - Comienza con un resumen de los puntos fuertes de la meta.
      - Luego, ofrece sugerencias específicas para mejorar la claridad, el impacto o la alineación de la meta. Por ejemplo, "Para hacerla aún más específica, podrías considerar...".
      - Finaliza con una nota de aliento.
    `;

    await fetchGeminiFeedback(prompt, 'Eres un coach de productividad experto en metas SMART, evaluando la propuesta de un usuario.');
  }, [currentScenario, goalInputs, fetchGeminiFeedback, resetGemini, isFormComplete]);

  return (
    <PageWrapper title="Definición de Metas SMART" titleIcon={<TargetIcon />} subtitle="Aprende a transformar deseos en objetivos claros y alcanzables.">
      <InteractiveModule
        title="Laboratorio de Creación de Metas SMART"
        icon={<LightbulbIcon className="w-6 h-6" />}
        initialInstructions="1. Analiza el escenario. 2. Completa cada uno de los campos del marco SMART para definir tu meta. 3. Envía tu meta para recibir una evaluación detallada de la IA."
      >
        <Button onClick={loadNewScenario} disabled={isLoadingGemini || !!recordingField} className="mb-6">
          Generar Nuevo Escenario
        </Button>

        {currentScenario && (
          <Card className="mb-6 border-l-4 border-amber-500">
            <h4 className="text-lg font-semibold text-neutral-800 mb-2">Escenario: {currentScenario.title}</h4>
            <p className="text-neutral-700">{currentScenario.context}</p>
          </Card>
        )}

        {currentScenario && (
          <Card className="mb-6">
            <h4 className="text-lg font-semibold text-neutral-800 mb-3">Construye tu Meta SMART</h4>
            <div className="space-y-4">
              {(Object.keys(goalInputs) as Array<keyof SmartGoalInputs>).map((key) => {
                const {label, placeholder, description} = labels[key];

                return (
                  <div key={key}>
                    <label htmlFor={`goal-${key}`} className="block text-sm font-bold text-neutral-700">
                      {label}
                    </label>
                    <p className="text-xs text-neutral-600 mb-2">{description}</p>
                     <div className="relative w-full">
                        <textarea
                          id={`goal-${key}`}
                          name={key}
                          rows={2}
                          value={goalInputs[key]}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-neutral-300 rounded-md shadow-sm focus:ring-primary focus:border-primary pr-12"
                          placeholder={placeholder}
                          onPaste={(e) => e.preventDefault()}
                          disabled={isLoadingGemini || !!recordingField}
                        />
                         <Button
                            onClick={() => handleToggleRecording(key)}
                            variant="outline" size="sm"
                            className="absolute top-2 right-2 !p-2 h-8 w-8"
                            aria-label={recordingField === key ? 'Detener grabación' : `Grabar campo ${label} por voz`}
                            disabled={!recognitionRef.current}
                        >
                            {recordingField === key ? <StopCircleIcon className="w-4 h-4 text-red-500" /> : <MicrophoneIcon className="w-4 h-4" />}
                        </Button>
                    </div>
                  </div>
              )})}
            </div>
             {speechError && <p className="text-sm text-red-600 mt-2">{speechError}</p>}
             {!!recordingField && <p className="text-sm text-blue-600 animate-pulse mt-2">Escuchando para el campo '{recordingField}'...</p>}
            <Button
              onClick={handleSubmitGoal}
              disabled={isLoadingGemini || !isFormComplete || !!recordingField}
              isLoading={isLoadingGemini}
              className="mt-4"
            >
              {isLoadingGemini ? 'Evaluando Meta...' : 'Evaluar mi Meta SMART'}
            </Button>
          </Card>
        )}

        {isLoadingGemini && <div className="my-6"><LoadingSpinner text="Generando retroalimentación..." /></div>}

        {geminiError && (
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
              Análisis de tu Meta SMART
            </h4>
            <div className="prose prose-sm max-w-none text-neutral-700 whitespace-pre-wrap">
              <p>{geminiFeedback}</p>
            </div>
            <p className="mt-3 text-xs text-neutral-500 italic">Usa este análisis para perfeccionar tu habilidad de establecer objetivos efectivos.</p>
          </Card>
        )}
      </InteractiveModule>
    </PageWrapper>
  );
};

export default SmartGoalsPage;
