
import React, { useState, useCallback, useEffect, useRef } from 'react';
import PageWrapper from '../components/PageWrapper';
import InteractiveModule from '../components/InteractiveModule';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Card from '../components/ui/Card';
import { PuzzlePieceIcon, LightbulbIcon, CheckCircleIcon, XCircleIcon, MicrophoneIcon, StopCircleIcon } from '../constants';
import { useGeminiTextQuery } from '../hooks/useGeminiQuery';
import { SkillIntegrationTopic, SpeechRecognition } from '../types';
import { SKILL_INTEGRATION_TOPICS } from '../constants';

const SkillIntegrationPage: React.FC = () => {
  const [currentTopic, setCurrentTopic] = useState<SkillIntegrationTopic | null>(null);
  const [userApproach, setUserApproach] = useState('');

  const {
    data: geminiFeedback,
    error: geminiError,
    isLoading: isLoadingGemini,
    executeQuery: fetchGeminiFeedback,
    reset: resetGemini,
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
            setUserApproach(prev => prev ? `${prev} ${transcript}` : transcript);
            setSpeechError(null);
        };
        recognition.onerror = (event) => setSpeechError(`Error: ${event.error}. Por favor, escribe.`);
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

  const loadNewTopic = useCallback(() => {
    if(isRecording) handleToggleRecording();
    resetGemini();
    setUserApproach('');
    setSpeechError(null);
    const randomIndex = Math.floor(Math.random() * SKILL_INTEGRATION_TOPICS.length);
    setCurrentTopic(SKILL_INTEGRATION_TOPICS[randomIndex]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetGemini, isRecording]);

  useEffect(() => {
    loadNewTopic();
  }, [loadNewTopic]);

  const handleSubmit = useCallback(async () => {
    if (!currentTopic || !userApproach.trim()) return;

    resetGemini();

    const prompt = `
      Eres un experimentado coach de carrera y gerente senior, especializado en liderazgo tecnológico y dinámicas de equipo. Estás evaluando el enfoque de un estudiante para una situación que requiere una mezcla de habilidades técnicas y blandas.

      Contexto del Tema:
      Título: "${currentTopic.title}"
      Concepto Clave: "${currentTopic.concept}"
      Escenario: "${currentTopic.scenario}"

      Enfoque propuesto por el estudiante:
      "${userApproach}"

      Por favor, evalúa el enfoque del estudiante. Analiza qué tan bien ha integrado las habilidades técnicas con las blandas para abordar el escenario.
      1.  **Equilibrio:** ¿El estudiante encontró un buen equilibrio, o se inclinó demasiado hacia un lado (por ejemplo, solo soluciones técnicas, o solo generalidades de habilidades blandas sin acción concreta)?
      2.  **Efectividad:** ¿Es probable que el enfoque propuesto sea efectivo en un entorno profesional real? ¿Por qué sí o por qué no?
      3.  **Habilidades Específicas:** Identifica las habilidades técnicas y blandas específicas que el estudiante demostró (o que omitió). Por ejemplo: "Demostraste empatía (habilidad blanda) al considerar la perspectiva de la audiencia, pero tu explicación técnica podría ser más clara (habilidad técnica) si incluyeras un gráfico simple".
      4.  **Feedback Constructivo:** Proporciona consejos accionables sobre cómo crear una respuesta más integrada y potente.
      
      Proporciona la retroalimentación en 2-3 párrafos concisos con un tono de apoyo y de mentoría.
    `;

    await fetchGeminiFeedback(prompt, 'Eres un coach de carrera experto, evaluando la integración de habilidades de un estudiante.');
  }, [currentTopic, userApproach, fetchGeminiFeedback, resetGemini]);

  return (
    <PageWrapper title="Integración de Habilidades Técnicas y Blandas" titleIcon={<PuzzlePieceIcon />} subtitle="Aprende a combinar conocimientos técnicos con inteligencia emocional para el éxito profesional.">
      <InteractiveModule
        title="Laboratorio de Sinergia de Habilidades"
        icon={<LightbulbIcon className="w-6 h-6" />}
        initialInstructions="1. Analiza el escenario presentado. 2. Describe cómo abordarías la situación, combinando habilidades técnicas y blandas. 3. Recibe un análisis de la IA sobre tu enfoque."
      >
        <Button onClick={loadNewTopic} disabled={isLoadingGemini || isRecording} className="mb-6">
          Generar Nuevo Tema
        </Button>

        {currentTopic && (
          <Card className="mb-6 border-l-4 border-cyan-500">
            <h4 className="text-lg font-semibold text-neutral-800 mb-2">{currentTopic.title}</h4>
            <p className="text-sm text-neutral-600 mb-2"><strong>Concepto:</strong> {currentTopic.concept}</p>
            <p className="text-neutral-700 bg-neutral-100 p-3 rounded-md"><strong>Escenario:</strong> {currentTopic.scenario}</p>
          </Card>
        )}

        {currentTopic && (
          <Card className="mb-6">
            <h4 className="text-lg font-semibold text-neutral-800 mb-3">Tu Enfoque Propuesto</h4>
              <div>
                <label htmlFor="user-approach" className="block text-sm font-medium text-neutral-700 mb-1">
                  ¿Cómo manejarías esta situación?
                </label>
                <div className="relative w-full">
                    <textarea
                      id="user-approach"
                      rows={6}
                      value={userApproach}
                      onChange={(e) => setUserApproach(e.target.value)}
                      className="w-full p-2 border border-neutral-300 rounded-md shadow-sm focus:ring-primary focus:border-primary pr-12"
                      placeholder="Describe los pasos que tomarías, las conversaciones que tendrías y las acciones que realizarías, mostrando un equilibrio entre tus habilidades técnicas y blandas..."
                      onPaste={(e) => e.preventDefault()}
                      disabled={isLoadingGemini || isRecording}
                    />
                    <Button
                        onClick={handleToggleRecording}
                        variant="outline"
                        size="sm"
                        className="absolute top-2 right-2 !p-2 h-8 w-8"
                        aria-label={isRecording ? 'Detener grabación' : 'Grabar enfoque por voz'}
                        disabled={!recognitionRef.current}
                    >
                        {isRecording ? <StopCircleIcon className="w-4 h-4 text-red-500" /> : <MicrophoneIcon className="w-4 h-4" />}
                    </Button>
                </div>
                 {speechError && <p className="text-sm text-red-600 mt-1">{speechError}</p>}
                 {isRecording && <p className="text-sm text-blue-600 animate-pulse mt-1">Escuchando...</p>}
              </div>
            <Button
              onClick={handleSubmit}
              disabled={isLoadingGemini || !userApproach.trim() || isRecording}
              isLoading={isLoadingGemini}
              className="mt-4"
            >
              {isLoadingGemini ? 'Analizando Enfoque...' : 'Analizar mi Enfoque'}
            </Button>
          </Card>
        )}

        {isLoadingGemini && <div className="my-6"><LoadingSpinner text="Generando análisis..." /></div>}

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
              Análisis de tu Enfoque
            </h4>
            <div className="prose prose-sm max-w-none text-neutral-700 whitespace-pre-wrap">
              <p>{geminiFeedback}</p>
            </div>
            <p className="mt-3 text-xs text-neutral-500 italic">El dominio de esta integración es clave para el liderazgo y la influencia en cualquier organización.</p>
          </Card>
        )}
      </InteractiveModule>
    </PageWrapper>
  );
};

export default SkillIntegrationPage;
