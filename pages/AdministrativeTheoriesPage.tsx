import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { generateContent } from '../services/geminiService'; // CAMBIO: Importamos nuestro nuevo servicio

// Componentes y Constantes (asumimos que estos existen y están correctos)
import PageWrapper from '../components/PageWrapper';
import InteractiveModule from '../components/InteractiveModule';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Card from '../components/ui/Card';
import { BookOpenIcon, LightbulbIcon, CheckCircleIcon, XCircleIcon, SpeakerWaveIcon, StopCircleIcon, MicrophoneIcon } from '../constants'; // Asegúrate de que estos iconos existan
import { AdministrativeTheory, CaseStudy, SpeechRecognition } from '../types'; // Asegúrate de que estos tipos existan
import { ADMINISTRATIVE_THEORIES, ADMIN_CASE_STUDIES } from '../constants'; // Asegúrate de que estas constantes existan

const AdministrativeTheoriesPage: React.FC = () => {
  const [selectedTheoryId, setSelectedTheoryId] = useState<string | null>(ADMINISTRATIVE_THEORIES[0]?.id || null);
  const [selectedCaseStudyId, setSelectedCaseStudyId] = useState<string | null>(null);
  const [userResponse, setUserResponse] = useState<string>('');
  
  // CAMBIO: Estados locales para manejar la llamada a la API en lugar del hook
  const [geminiFeedback, setGeminiFeedback] = useState<string | null>(null);
  const [geminiError, setGeminiError] = useState<string | null>(null);
  const [isLoadingGemini, setIsLoadingGemini] = useState<boolean>(false);

  // Text-to-speech state
  const [speakingSource, setSpeakingSource] = useState<string | null>(null);

  // Speech-to-text state
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);

  // Función para limpiar el estado de Gemini
  const resetGemini = useCallback(() => {
    setGeminiFeedback(null);
    setGeminiError(null);
    setIsLoadingGemini(false);
  }, []);

  // Speech-to-text setup (sin cambios, se mantiene igual)
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
            setUserResponse(prev => prev ? `${prev} ${transcript}` : transcript);
            setSpeechError(null);
        };
        recognition.onerror = (event) => setSpeechError(`Error en reconocimiento: ${event.error}. Por favor, escribe tu respuesta.`);
        recognition.onend = () => setIsVoiceRecording(false);
    }
    // Cleanup
    return () => {
        if (recognitionRef.current) recognitionRef.current.stop();
        if (window.speechSynthesis && speechSynthesis.speaking) speechSynthesis.cancel();
    };
  }, []);

  const handleToggleVoiceRecording = () => {
      if (!recognitionRef.current) {
          setSpeechError("El reconocimiento de voz no es compatible con este navegador.");
          return;
      }
      if (isVoiceRecording) {
          recognitionRef.current.stop();
      } else {
          if(speechSynthesis.speaking) handleToggleAudio('', ''); // Detener TTS si está activo
          setSpeechError(null);
          recognitionRef.current.start();
      }
      setIsVoiceRecording(!isVoiceRecording);
  };

  const currentTheory = useMemo(() => 
    ADMINISTRATIVE_THEORIES.find(t => t.id === selectedTheoryId)
  , [selectedTheoryId]);

  const filteredCaseStudies = useMemo(() => 
    ADMIN_CASE_STUDIES.filter(cs => cs.relatedTheoryIds.includes(selectedTheoryId || ''))
  , [selectedTheoryId]);

  const currentCaseStudy = useMemo(() =>
    filteredCaseStudies.find(cs => cs.id === selectedCaseStudyId)
  , [selectedCaseStudyId, filteredCaseStudies]);

  const theoryTextToSpeak = useMemo(() => {
    if (!currentTheory) return '';
    return `${currentTheory.name}. Proponente: ${currentTheory.proponent || 'N/A'}. Época: ${currentTheory.year || 'N/A'}. Descripción: ${currentTheory.shortDescription}. Conceptos Clave: ${currentTheory.keyConcepts.join(', ')}.`;
  }, [currentTheory]);


  // Text-to-speech handler (sin cambios, se mantiene igual)
  const handleToggleAudio = (text: string, sourceIdentifier: string) => {
    if (!window.speechSynthesis) {
      // Usamos un simple console.warn en lugar de alert
      console.warn("Lo sentimos, tu navegador no soporta la síntesis de voz.");
      return;
    }

    if (speechSynthesis.speaking && speakingSource === sourceIdentifier) {
      speechSynthesis.cancel();
      setSpeakingSource(null);
    } else {
      if (speechSynthesis.speaking) speechSynthesis.cancel();
      if(isVoiceRecording) handleToggleVoiceRecording(); // Detener STT si está activo
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.pitch = 1;
      utterance.rate = 0.95;
      
      utterance.onstart = () => setSpeakingSource(sourceIdentifier);
      utterance.onend = () => setSpeakingSource(null);
      utterance.onerror = (event) => {
        console.error('Error en SpeechSynthesis:', event);
        setSpeakingSource(null);
      };
      speechSynthesis.speak(utterance);
    }
  };
  
  // Efecto para limpiar estados cuando cambia la teoría
  useEffect(() => {
    setSelectedCaseStudyId(null);
    setUserResponse('');
    resetGemini();
    if (speechSynthesis.speaking) speechSynthesis.cancel();
    setSpeakingSource(null);
    if(isVoiceRecording) handleToggleVoiceRecording();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTheoryId, resetGemini]);
  
  // Efecto para seleccionar el primer caso de estudio disponible
  useEffect(() => {
    if (filteredCaseStudies.length > 0) {
        setSelectedCaseStudyId(filteredCaseStudies[0].id); 
    } else {
        setSelectedCaseStudyId(null);
    }
  }, [filteredCaseStudies]);


  const handleTheoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTheoryId(event.target.value);
  };

  const handleCaseStudyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCaseStudyId(event.target.value);
    setUserResponse('');
    resetGemini();
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
      setSpeakingSource(null);
    }
  };

  // CAMBIO: La función que llama a la API ahora es un async/await directo
  const handleSubmitResponse = useCallback(async () => {
    if (!currentTheory || !currentCaseStudy || !userResponse) return;

    resetGemini(); // Limpia resultados anteriores
    setIsLoadingGemini(true); // Activa el estado de carga
    if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
        setSpeakingSource(null);
    }

    // El prompt se mantiene igual, es excelente.
    const prompt = `
      Eres un tutor experto en teorías de la administración (como Taylorismo, Fayolismo, Teoría de las Relaciones Humanas de Mayo, Burocracia de Weber, etc.).
      El estudiante está aplicando la teoría de: "${currentTheory.name}" (Propuesta por ${currentTheory.proponent || 'varios autores'}, alrededor de ${currentTheory.year || 'principios del siglo XX'}).
      Principios clave de esta teoría: ${currentTheory.keyConcepts.join('; ')}.

      El caso de estudio presentado es:
      Título: "${currentCaseStudy.title}"
      Escenario: "${currentCaseStudy.scenario}"
      ${currentCaseStudy.guidingQuestions ? `Preguntas guía para el estudiante: ${currentCaseStudy.guidingQuestions.join(' ')}` : ''}

      La respuesta analítica del estudiante es:
      "${userResponse}"

      Por favor, evalúa la respuesta del estudiante de forma constructiva. Considera los siguientes aspectos:
      1.  **Aplicación de la Teoría:** ¿El estudiante aplicó correctamente los conceptos y principios de la teoría de "${currentTheory.name}" al caso?
      2.  **Análisis del Caso:** ¿El estudiante analizó el caso de manera efectiva, identificando los problemas o puntos clave?
      3.  **Profundidad y Claridad:** ¿La respuesta es suficientemente profunda y clara?
      4.  **Relación con Funciones Administrativas:** ¿Cómo se relaciona la solución propuesta con las funciones de planeación, organización, dirección y control?

      Proporciona retroalimentación en 2-4 párrafos. Destaca los puntos fuertes y las áreas de mejora. Si es posible, enmarca tu feedback mencionando cómo la teoría se aplica a las funciones administrativas de planeación, organización, dirección y control.
      Evita dar una 'solución perfecta', en su lugar, guía al estudiante para que reflexione y profundice su comprensión.
      El tono debe ser alentador y educativo.
    `;

    try {
      // Llamada directa a nuestro servicio
      const feedback = await generateContent(prompt);
      setGeminiFeedback(feedback);
    } catch (error) {
      console.error("Error en handleSubmitResponse:", error);
      setGeminiError(error instanceof Error ? error.message : "Ocurrió un error desconocido.");
    } finally {
      setIsLoadingGemini(false); // Desactiva el estado de carga
    }
  }, [currentTheory, currentCaseStudy, userResponse, resetGemini]);

  // El JSX se mantiene casi idéntico, solo se asegura de usar los nuevos estados locales.
  return (
    <PageWrapper title="Teorías de la Administración" titleIcon={<BookOpenIcon />} subtitle="Explora, analiza casos y aprende de los grandes pensadores de la administración.">
      <InteractiveModule
        title="Estudio Interactivo de Teorías Administrativas"
        icon={<LightbulbIcon className="w-6 h-6" />}
        initialInstructions="Selecciona una teoría administrativa, luego elige un caso de estudio relacionado. Lee el caso, redacta tu análisis aplicando la teoría y recibe retroalimentación de la IA. ¡Ahora también puedes escuchar la teoría y la retroalimentación!"
      >
        {/* Theory Selection */}
        <div className="mb-6">
          <label htmlFor="theory-select" className="block text-sm font-medium text-neutral-700 mb-1">
            1. Selecciona una Teoría Administrativa:
          </label>
          <select
            id="theory-select"
            value={selectedTheoryId || ''}
            onChange={handleTheoryChange}
            className="w-full p-2 border border-neutral-300 rounded-md shadow-sm focus:ring-primary focus:border-primary bg-white"
          >
            <option value="" disabled>-- Elige una teoría --</option>
            {ADMINISTRATIVE_THEORIES.map(theory => (
              <option key={theory.id} value={theory.id}>{theory.name} ({theory.proponent})</option>
            ))}
          </select>
        </div>

        {/* Theory Details */}
        {currentTheory && (
          <Card className="mb-6 bg-primary-light border-l-4 border-primary" title={`Teoría: ${currentTheory.name}`}>
            <p className="text-sm text-neutral-700 mb-1"><strong>Proponente Principal:</strong> {currentTheory.proponent || 'N/A'}</p>
            <p className="text-sm text-neutral-700 mb-2"><strong>Época Aproximada:</strong> {currentTheory.year || 'N/A'}</p>
            <p className="text-neutral-700 mb-3">{currentTheory.shortDescription}</p>
            <h5 className="font-semibold text-neutral-700 mb-1">Conceptos Clave:</h5>
            <ul className="list-disc list-inside space-y-1 text-sm text-neutral-600">
              {currentTheory.keyConcepts.map((concept, index) => (
                <li key={index}>{concept}</li>
              ))}
            </ul>
            {theoryTextToSpeak && (
              <Button
                onClick={() => handleToggleAudio(theoryTextToSpeak, `theory-${currentTheory.id}`)}
                variant="outline"
                size="sm"
                leftIcon={speakingSource === `theory-${currentTheory.id}` ? <StopCircleIcon className="w-5 h-5" /> : <SpeakerWaveIcon className="w-5 h-5" />}
                className="mt-3 text-sm"
                aria-live="polite"
                aria-label={speakingSource === `theory-${currentTheory.id}` ? `Detener audio de ${currentTheory.name}` : `Escuchar audio de ${currentTheory.name}`}
              >
                {speakingSource === `theory-${currentTheory.id}` ? 'Detener Audio' : 'Escuchar Teoría'}
              </Button>
            )}
          </Card>
        )}

        {/* Case Study Selection */}
        {selectedTheoryId && filteredCaseStudies.length > 0 && (
          <div className="mb-6">
            <label htmlFor="case-study-select" className="block text-sm font-medium text-neutral-700 mb-1">
              2. Selecciona un Caso de Estudio para <span className="font-semibold">{currentTheory?.name || ''}</span>:
            </label>
            <select
              id="case-study-select"
              value={selectedCaseStudyId || ''}
              onChange={handleCaseStudyChange}
              className="w-full p-2 border border-neutral-300 rounded-md shadow-sm focus:ring-primary focus:border-primary bg-white"
              disabled={!selectedTheoryId}
            >
              <option value="" disabled>-- Elige un caso --</option>
              {filteredCaseStudies.map(cs => (
                <option key={cs.id} value={cs.id}>{cs.title}</option>
              ))}
            </select>
          </div>
        )}
        {selectedTheoryId && filteredCaseStudies.length === 0 && (
            <p className="text-neutral-600 mb-6">No hay casos de estudio específicos para esta teoría en este momento. Intenta con otra teoría.</p>
        )}


        {/* Case Study Details & Response Area */}
        {currentCaseStudy && (
          <Card className="mb-6 border-l-4 border-secondary" title={`Caso: ${currentCaseStudy.title}`}>
            <h5 className="font-semibold text-neutral-700 mb-1">Escenario:</h5>
            <p className="text-neutral-600 mb-3 whitespace-pre-wrap">{currentCaseStudy.scenario}</p>
            {currentCaseStudy.guidingQuestions && currentCaseStudy.guidingQuestions.length > 0 && (
              <>
                <h5 className="font-semibold text-neutral-700 mb-1">Preguntas Guía:</h5>
                <ul className="list-disc list-inside space-y-1 text-sm text-neutral-600 mb-4">
                  {currentCaseStudy.guidingQuestions.map((q, index) => (
                    <li key={index}>{q}</li>
                  ))}
                </ul>
              </>
            )}
            
            <div>
              <label htmlFor="user-response" className="block text-sm font-medium text-neutral-700 mb-1">
                3. Tu Análisis del Caso (aplicando la teoría de <span className="font-semibold">{currentTheory?.name || ''}</span>):
              </label>
              <div className="relative w-full">
                <textarea
                  id="user-response"
                  rows={8}
                  value={userResponse}
                  onChange={(e) => setUserResponse(e.target.value)}
                  className="w-full p-2 border border-neutral-300 rounded-md shadow-sm focus:ring-primary focus:border-primary pr-12"
                  placeholder={`Escribe aquí tu análisis detallado del caso "${currentCaseStudy.title}" utilizando los principios de ${currentTheory?.name}...`}
                  // CAMBIO: Removido onPaste para permitir pegar texto. Si quieres prevenirlo, puedes volver a añadirlo.
                  disabled={isLoadingGemini || !!speakingSource || isVoiceRecording}
                />
                 <Button
                    onClick={handleToggleVoiceRecording}
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2 !p-2 h-8 w-8"
                    aria-label={isVoiceRecording ? 'Detener grabación de voz' : 'Grabar análisis por voz'}
                    disabled={!recognitionRef.current || !!speakingSource || isLoadingGemini}
                >
                    {isVoiceRecording ? <StopCircleIcon className="w-4 h-4 text-red-500" /> : <MicrophoneIcon className="w-4 h-4" />}
                </Button>
              </div>
                {speechError && <p className="text-sm text-red-600 mt-1">{speechError}</p>}
                {isVoiceRecording && <p className="text-sm text-blue-600 animate-pulse mt-1">Escuchando...</p>}
            </div>
            <Button 
              onClick={handleSubmitResponse} 
              disabled={isLoadingGemini || !userResponse.trim() || !!speakingSource || isVoiceRecording} 
              isLoading={isLoadingGemini} 
              className="mt-4"
            >
              {isLoadingGemini ? 'Enviando Análisis...' : 'Enviar Análisis y Obtener Retroalimentación'}
            </Button>
          </Card>
        )}

        {/* Gemini Feedback or Error */}
        {isLoadingGemini && <div className="my-6"><LoadingSpinner text="Generando retroalimentación de la IA..." /></div>}
        
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
              Retroalimentación de la IA
            </h4>
            <div className="prose prose-sm max-w-none text-neutral-700 whitespace-pre-wrap">
              {/* CAMBIO: Se usa un div en lugar de <p> para mejor renderizado de párrafos múltiples */}
              <div>{geminiFeedback}</div>
            </div>
            <Button
                onClick={() => handleToggleAudio(geminiFeedback, `feedback-${currentCaseStudy?.id || 'current'}`)}
                variant="outline"
                size="sm"
                leftIcon={speakingSource === `feedback-${currentCaseStudy?.id || 'current'}` ? <StopCircleIcon className="w-5 h-5" /> : <SpeakerWaveIcon className="w-5 h-5" />}
                className="mt-3 text-sm"
                aria-live="polite"
                aria-label={speakingSource === `feedback-${currentCaseStudy?.id || 'current'}` ? 'Detener audio de la retroalimentación' : 'Escuchar audio de la retroalimentación'}
              >
                {speakingSource === `feedback-${currentCaseStudy?.id || 'current'}` ? 'Detener Audio' : 'Escuchar Retroalimentación'}
            </Button>
             <p className="mt-3 text-xs text-neutral-500 italic">Esta retroalimentación es generada por IA y tiene fines educativos. Úsala como guía para tu aprendizaje y contrasta con otras fuentes.</p>
          </Card>
        )}

      </InteractiveModule>
    </PageWrapper>
  );
};

export default AdministrativeTheoriesPage;
