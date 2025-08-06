import React, { useState, useCallback, useEffect, useRef } from 'react';
import { generateContent } from '../services/geminiService'; // CAMBIO: Importamos nuestro servicio

// Componentes y Constantes
import PageWrapper from '../components/PageWrapper';
import InteractiveModule from '../components/InteractiveModule';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Card from '../components/ui/Card';
import { HRIcon, LightbulbIcon, CheckCircleIcon, XCircleIcon, MicrophoneIcon, StopCircleIcon } from '../constants';
import { HrDilemma, SpeechRecognition } from '../types';
import { HR_DILEMMAS } from '../constants';

const TalentManagementPage: React.FC = () => {
    const [currentDilemma, setCurrentDilemma] = useState<HrDilemma | null>(null);
    const [userResponse, setUserResponse] = useState('');

    // CAMBIO: Estados locales para manejar la llamada a la API
    const [geminiFeedback, setGeminiFeedback] = useState<string | null>(null);
    const [geminiError, setGeminiError] = useState<string | null>(null);
    const [isLoadingGemini, setIsLoadingGemini] = useState<boolean>(false);

    // Speech-to-text state
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [speechError, setSpeechError] = useState<string | null>(null);

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
                setUserResponse(prev => prev ? `${prev} ${transcript}` : transcript);
                setSpeechError(null);
            };
            recognition.onerror = (event) => setSpeechError(`Error en reconocimiento: ${event.error}. Por favor, escribe.`);
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

    const resetGemini = useCallback(() => {
        setGeminiFeedback(null);
        setGeminiError(null);
        setIsLoadingGemini(false);
    }, []);

    const loadNewDilemma = useCallback(() => {
        if(isRecording) handleToggleRecording();
        resetGemini();
        setUserResponse('');
        setSpeechError(null);
        const randomIndex = Math.floor(Math.random() * HR_DILEMMAS.length);
        setCurrentDilemma(HR_DILEMMAS[randomIndex]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resetGemini, isRecording]);

    useEffect(() => {
        loadNewDilemma();
    }, [loadNewDilemma]);

    const handleSubmit = useCallback(async () => {
        if (!currentDilemma || !userResponse.trim()) return;

        resetGemini();
        setIsLoadingGemini(true);

        const prompt = `
            Eres un experimentado Director de Recursos Humanos y un coach de liderazgo ético. Estás evaluando la respuesta de un estudiante a un complejo dilema de gestión de talento.

            Contexto del Dilema:
            Título: "${currentDilemma.title}"
            Escenario: "${currentDilemma.scenario}"
            Pregunta Clave: "${currentDilemma.question}"

            Respuesta del Estudiante:
            "${userResponse}"

            Por favor, evalúa la respuesta del estudiante. Analiza los siguientes aspectos:
            1.  **Ética y Valores:** ¿La respuesta demuestra una base ética sólida? ¿Considera la justicia, la equidad y el respeto por los individuos?
            2.  **Visión a Largo Plazo vs. Corto Plazo:** ¿La solución propuesta es un parche rápido o considera las consecuencias a largo plazo para la cultura de la empresa, la moral del equipo y la retención del talento?
            3.  **Consideración de las Partes Interesadas:** ¿La respuesta tiene en cuenta el impacto en todas las partes involucradas (el empleado, el equipo, la gerencia, la empresa)?
            4.  **Cumplimiento y Riesgo Legal:** Aunque no eres un abogado, ¿la respuesta parece sensata desde una perspectiva de riesgo laboral básico? ¿Evita decisiones impulsivas que podrían tener consecuencias legales?
            5.  **Comunicación y Liderazgo:** ¿El plan de acción propuesto demuestra habilidades de comunicación y liderazgo? (Ej: conversaciones difíciles, transparencia, etc.).

            Proporciona una retroalimentación constructiva y profunda en 2-4 párrafos.
            - Comienza reconociendo la complejidad del dilema y los aspectos positivos del enfoque del estudiante.
            - Ofrece perspectivas alternativas que el estudiante podría no haber considerado.
            - Concluye con un principio general de liderazgo o gestión de talento que se pueda extraer de este caso.
            - Tu tono debe ser el de un mentor sabio y empático.
        `;

        try {
            const feedback = await generateContent(prompt);
            setGeminiFeedback(feedback);
        } catch (e) {
            console.error("Error al enviar respuesta de talento:", e);
            setGeminiError(e instanceof Error ? e.message : "Ocurrió un error al obtener la retroalimentación.");
        } finally {
            setIsLoadingGemini(false);
        }
    }, [currentDilemma, userResponse, resetGemini]);

    return (
        <PageWrapper title="Gestión del Talento y Dilemas Éticos" titleIcon={<HRIcon />} subtitle="Enfrenta escenarios complejos de liderazgo, ética y gestión de personas.">
            <InteractiveModule
                title="Laboratorio de Liderazgo y RR.HH."
                icon={<LightbulbIcon className="w-6 h-6" />}
                initialInstructions="1. Analiza el dilema de gestión de talento. 2. Describe cómo abordarías la situación como líder. 3. Recibe feedback experto sobre las implicaciones de tu decisión."
            >
                <Button onClick={loadNewDilemma} disabled={isLoadingGemini || isRecording} className="mb-6">
                    Generar Nuevo Dilema
                </Button>

                {currentDilemma && (
                    <Card className="mb-6 border-l-4 border-teal-500">
                        <h4 className="text-lg font-semibold text-neutral-800 mb-2">{currentDilemma.title}</h4>
                        <p className="text-neutral-700 mb-4 bg-neutral-100 p-3 rounded-md">{currentDilemma.scenario}</p>
                        <p className="font-bold text-primary">{currentDilemma.question}</p>
                    </Card>
                )}

                {currentDilemma && (
                    <Card className="mb-6">
                        <h4 className="text-lg font-semibold text-neutral-800 mb-3">Tu Plan de Acción</h4>
                        <div>
                            <label htmlFor="user-response" className="block text-sm font-medium text-neutral-700 mb-1">
                                ¿Cómo procederías?
                            </label>
                            <div className="relative w-full">
                                <textarea
                                    id="user-response"
                                    rows={6}
                                    value={userResponse}
                                    onChange={(e) => setUserResponse(e.target.value)}
                                    className="w-full p-2 border border-neutral-300 rounded-md shadow-sm focus:ring-primary focus:border-primary pr-12"
                                    placeholder="Describe los pasos que tomarías, las conversaciones que tendrías y las decisiones que harías, justificando tu enfoque..."
                                    disabled={isLoadingGemini || isRecording}
                                />
                                <Button
                                    onClick={handleToggleRecording}
                                    variant="outline"
                                    size="icon"
                                    className="absolute top-2 right-2 h-8 w-8"
                                    aria-label={isRecording ? 'Detener grabación' : 'Grabar plan por voz'}
                                    disabled={!recognitionRef.current || isLoadingGemini}
                                >
                                    {isRecording ? <StopCircleIcon className="w-5 h-5 text-red-500" /> : <MicrophoneIcon className="w-5 h-5" />}
                                </Button>
                            </div>
                            {speechError && <p className="text-sm text-red-600 mt-1">{speechError}</p>}
                            {isRecording && <p className="text-sm text-blue-600 animate-pulse mt-1">Escuchando...</p>}
                        </div>
                        <Button
                            onClick={handleSubmit}
                            disabled={isLoadingGemini || !userResponse.trim() || isRecording}
                            isLoading={isLoadingGemini}
                            className="mt-4"
                        >
                            {isLoadingGemini ? 'Analizando Decisión...' : 'Analizar mi Decisión'}
                        </Button>
                    </Card>
                )}

                {isLoadingGemini && <div className="my-6"><LoadingSpinner text="Generando análisis..." /></div>}

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
                            Análisis de tu Enfoque
                        </h4>
                        <div className="prose prose-sm max-w-none text-neutral-700 whitespace-pre-wrap">
                            <p>{geminiFeedback}</p>
                        </div>
                        <p className="mt-3 text-xs text-neutral-500 italic">Las decisiones de talento definen la cultura y el futuro de una organización.</p>
                    </Card>
                )}
            </InteractiveModule>
        </PageWrapper>
    );
};

export default TalentManagementPage;
