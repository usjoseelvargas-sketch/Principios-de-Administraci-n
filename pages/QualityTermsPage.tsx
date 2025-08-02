
import React, { useState, useCallback, useEffect, useRef } from 'react';
import PageWrapper from '../components/PageWrapper';
import InteractiveModule from '../components/InteractiveModule';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Card from '../components/ui/Card';
import { QualityCheckIcon, LightbulbIcon, CheckCircleIcon, XCircleIcon, MicrophoneIcon, StopCircleIcon } from '../constants';
import { useGeminiTextQuery } from '../hooks/useGeminiQuery';
import { QualityTerm, SpeechRecognition } from '../types'; 
import { QUALITY_TERMS } from '../constants';

const QualityTermsPage: React.FC = () => {
  const [currentTerm, setCurrentTerm] = useState<QualityTerm | null>(null);
  const [transcribedText, setTranscribedText] = useState<string>('');
  const [isRecording, setIsRecording] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const {
    data: geminiFeedback,
    error: geminiError,
    isLoading: isLoadingGemini,
    executeQuery: fetchGeminiFeedback,
    reset: resetGemini,
  } = useGeminiTextQuery();

  // Setup SpeechRecognition
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
            setTranscribedText(prev => prev ? `${prev} ${transcript}` : transcript);
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


  const loadNewTerm = useCallback(() => {
    if (isRecording) {
        handleToggleRecording();
    }
    resetGemini();
    setTranscribedText('');
    setSpeechError(null);
    if (QUALITY_TERMS.length > 0) {
      const randomIndex = Math.floor(Math.random() * QUALITY_TERMS.length);
      setCurrentTerm(QUALITY_TERMS[randomIndex]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetGemini, isRecording]);

  useEffect(() => {
    loadNewTerm();
  }, [loadNewTerm]);


  const handleSubmitExplanation = useCallback(async () => {
    if (!currentTerm || !transcribedText.trim()) {
        setSpeechError("Por favor, proporciona una explicación antes de enviar.");
        return;
    }
    resetGemini();

    const prompt = `
      Eres un experto en Sistemas de Gestión de la Calidad (ISO 9000) y un tutor evaluando a un estudiante.
      El término a definir es: "${currentTerm.term}" (${currentTerm.category})
      La definición oficial es: "${currentTerm.definition}"

      La explicación del estudiante (transcrita de su audio, o escrita) es:
      "${transcribedText}"

      Por favor, evalúa la explicación del estudiante. Considera:
      1.  **Precisión:** ¿Qué tan bien coincide la explicación del estudiante con la definición oficial?
      2.  **Claridad:** ¿La explicación del estudiante es clara y fácil de entender?
      3.  **Comprensión:** ¿Demuestra el estudiante una comprensión real del término, más allá de la simple memorización de palabras clave?
      4.  **Omisiones o Errores:** ¿Hay alguna omisión importante o error conceptual en la explicación del estudiante?

      Proporciona retroalimentación constructiva en 2-3 párrafos. Destaca los puntos fuertes y las áreas de mejora.
      El tono debe ser alentador y educativo.
    `;
    await fetchGeminiFeedback(prompt, "Eres un tutor de SGC ISO 9000 evaluando la comprensión de un estudiante sobre un término clave.");
  }, [currentTerm, transcribedText, fetchGeminiFeedback, resetGemini]);

  return (
    <PageWrapper title="Términos y Definiciones de Calidad" titleIcon={<QualityCheckIcon />} subtitle="Aprende y define términos clave de ISO 9000.">
      <InteractiveModule
        title="Laboratorio de Terminología de Calidad"
        icon={<LightbulbIcon className="w-6 h-6" />}
        initialInstructions="1. Carga un término. 2. Graba tu explicación (o escríbela). 3. Envía para recibir feedback de la IA."
      >
        <Button onClick={loadNewTerm} disabled={isLoadingGemini || isRecording} className="mb-6">
          Cargar Nuevo Término de Calidad
        </Button>

        {currentTerm && (
          <Card className="mb-6 bg-primary-light border-l-4 border-primary" title={`Término: ${currentTerm.term}`}>
            <p className="text-sm text-neutral-700 mb-1"><strong>Categoría:</strong> {currentTerm.category}</p>
            <h5 className="font-semibold text-neutral-700 mt-2 mb-1">Definición Oficial (ISO 9000:2015):</h5>
            <p className="text-neutral-600 mb-3">{currentTerm.definition}</p>
          </Card>
        )}

        {currentTerm && (
          <Card className="mb-6">
            <h4 className="text-lg font-semibold text-neutral-800 mb-3">Tu Explicación del Término</h4>
            <label htmlFor="transcribed-text" className="block text-sm font-medium text-neutral-700 mb-1">
              {recognitionRef.current ? 'Usa el micrófono o escribe tu explicación:' : 'Escribe tu explicación aquí:'}
            </label>
            <div className="relative w-full">
                <textarea
                  id="transcribed-text"
                  rows={5}
                  value={transcribedText}
                  onChange={(e) => setTranscribedText(e.target.value)}
                  className="w-full p-2 border border-neutral-300 rounded-md shadow-sm focus:ring-primary focus:border-primary pr-12"
                  placeholder={`Explica "${currentTerm.term}" con tus propias palabras...`}
                  onPaste={(e) => e.preventDefault()}
                  disabled={isLoadingGemini || isRecording}
                />
                <Button
                    onClick={handleToggleRecording}
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2 !p-2 h-8 w-8"
                    aria-label={isRecording ? 'Detener grabación' : 'Grabar explicación por voz'}
                    disabled={!recognitionRef.current}
                >
                    {isRecording ? <StopCircleIcon className="w-4 h-4 text-red-500" /> : <MicrophoneIcon className="w-4 h-4" />}
                </Button>
            </div>
            {speechError && <p className="text-sm text-red-600 mt-1">{speechError}</p>}
            {isRecording && <p className="text-sm text-blue-600 animate-pulse mt-1">Escuchando...</p>}

            <Button 
              onClick={handleSubmitExplanation} 
              disabled={isLoadingGemini || isRecording || !transcribedText.trim()} 
              isLoading={isLoadingGemini} 
              className="mt-4"
              aria-live="polite"
            >
              {isLoadingGemini ? 'Enviando Explicación...' : 'Enviar Explicación y Obtener Feedback'}
            </Button>
          </Card>
        )}

        {isLoadingGemini && <div className="my-6"><LoadingSpinner text="Generando retroalimentación de la IA..." /></div>}
        
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
              Retroalimentación de la IA
            </h4>
            <div className="prose prose-sm max-w-none text-neutral-700 whitespace-pre-wrap">
              <p>{geminiFeedback}</p>
            </div>
             <p className="mt-3 text-xs text-neutral-500 italic">Esta retroalimentación es generada por IA. Úsala como guía para tu aprendizaje.</p>
          </Card>
        )}
      </InteractiveModule>
    </PageWrapper>
  );
};

export default QualityTermsPage;
