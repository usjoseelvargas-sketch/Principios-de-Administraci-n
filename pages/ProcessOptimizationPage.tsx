import React, { useState, useCallback, useEffect, useRef } from 'react';
import { generateContent } from '../services/geminiService'; // CAMBIO: Importamos nuestro servicio

// Componentes y Constantes
import PageWrapper from '../components/PageWrapper';
import InteractiveModule from '../components/InteractiveModule';
import { ProcessIcon, LightbulbIcon, XCircleIcon, MicrophoneIcon, StopCircleIcon } from '../constants';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { SpeechRecognition } from '../types';

// Tipos y datos locales
interface PqrsScenario {
    id: string;
    type: 'Petición' | 'Queja' | 'Reclamo' | 'Sugerencia';
    situation: string;
}

const pqrsScenarios: PqrsScenario[] = [
    {id: 'q1', type: 'Queja', situation: 'Un cliente se queja de que el producto que recibió está dañado y el servicio al cliente no ha respondido en 48 horas.'},
    {id: 'r1', type: 'Reclamo', situation: 'Un usuario reclama que se le cobró dos veces por el mismo servicio y exige un reembolso inmediato.'},
    {id: 's1', type: 'Sugerencia', situation: 'Un cliente fiel sugiere una nueva funcionalidad para la aplicación móvil que mejoraría la experiencia de usuario.'},
    {id: 'p1', type: 'Petición', situation: 'Un estudiante solicita información detallada sobre el proceso de inscripción a un curso extracurricular.'},
];


const ProcessOptimizationPage: React.FC = () => {
    const [currentPqrs, setCurrentPqrs] = useState<PqrsScenario | null>(null);
    const [userResponse, setUserResponse] = useState('');
    
    // CAMBIO: Estados locales para manejar la llamada a la API
    const [geminiFeedback, setGeminiFeedback] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

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
    
    // CAMBIO: Función de reseteo unificada
    const resetState = useCallback(() => {
        if (isRecording) handleToggleRecording();
        setGeminiFeedback(null);
        setError(null);
        setIsLoading(false);
        setUserResponse('');
        setSpeechError(null);
    }, [isRecording]);

    const handleGeneratePqrsScenario = useCallback(() => {
        resetState();
        const randomIndex = Math.floor(Math.random() * pqrsScenarios.length);
        setCurrentPqrs(pqrsScenarios[randomIndex]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resetState]);

    const handleSubmitPqrsResponse = useCallback(async () => {
        if (!currentPqrs || !userResponse) return;
        
        setIsLoading(true);
        setError(null);
        setGeminiFeedback(null);

        const prompt = `
            Contexto: Simulación de gestión de PQRS para un estudiante de administración.
            Escenario (${currentPqrs.type}): ${currentPqrs.situation}
            Respuesta del estudiante: "${userResponse}"

            Evalúa la respuesta del estudiante. Considera:
            1. Tono y profesionalismo.
            2. Claridad de la comunicación.
            3. Propuesta de solución o siguientes pasos (si aplica).
            4. Empatía (si aplica).
            Proporciona retroalimentación constructiva en 2-3 párrafos. No des una 'respuesta modelo', sino comenta sobre la calidad de la respuesta del estudiante.
        `;
        
        try {
            const feedback = await generateContent(prompt);
            setGeminiFeedback(feedback);
        } catch (e) {
            console.error("Error al enviar respuesta PQRS:", e);
            setError(e instanceof Error ? e.message : "Ocurrió un error al obtener la retroalimentación.");
        } finally {
            setIsLoading(false);
        }
    }, [currentPqrs, userResponse]);

    // Cargar escenario inicial al montar el componente
    useEffect(() => {
        handleGeneratePqrsScenario();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <PageWrapper title="Optimización de Procesos y Atención al Usuario" titleIcon={<ProcessIcon />}>
            <InteractiveModule
                title="Simulador de Gestión de PQRS"
                icon={<LightbulbIcon className="w-6 h-6" />}
                initialInstructions="Recibe un escenario de Petición, Queja, Reclamo o Sugerencia. Redacta una respuesta apropiada y obtén retroalimentación de la IA."
            >
                <Button onClick={handleGeneratePqrsScenario} disabled={isLoading || isRecording} className="mb-4">
                    Generar Nuevo Escenario PQRS
                </Button>

                {currentPqrs && (
                    <Card className="mb-6 border-l-4 border-amber-500">
                        <h4 className="text-lg font-semibold text-neutral-800 mb-1">Escenario ({currentPqrs.type}):</h4>
                        <p className="text-neutral-700">{currentPqrs.situation}</p>
                        <div className="mt-4">
                            <label htmlFor="pqrs-response" className="block text-sm font-medium text-neutral-700 mb-1">
                                Tu Respuesta:
                            </label>
                            <div className="relative w-full">
                                <textarea
                                    id="pqrs-response"
                                    rows={5}
                                    value={userResponse}
                                    onChange={(e) => setUserResponse(e.target.value)}
                                    className="w-full p-2 border border-neutral-300 rounded-md shadow-sm focus:ring-primary focus:border-primary pr-12"
                                    placeholder="Escribe aquí cómo responderías a esta situación..."
                                    disabled={isLoading || isRecording}
                                />
                                <Button
                                    onClick={handleToggleRecording}
                                    variant="outline"
                                    size="icon"
                                    className="absolute top-2 right-2 h-8 w-8"
                                    aria-label={isRecording ? 'Detener grabación' : 'Grabar respuesta por voz'}
                                    disabled={!recognitionRef.current || isLoading}
                                >
                                    {isRecording ? <StopCircleIcon className="w-5 h-5 text-red-500" /> : <MicrophoneIcon className="w-5 h-5" />}
                                </Button>
                            </div>
                            {speechError && <p className="text-sm text-red-600 mt-1">{speechError}</p>}
                            {isRecording && <p className="text-sm text-blue-600 animate-pulse mt-1">Escuchando...</p>}
                        </div>
                        <Button onClick={handleSubmitPqrsResponse} disabled={isLoading || !userResponse.trim() || isRecording} isLoading={isLoading} className="mt-3">
                            {isLoading ? 'Evaluando Respuesta...' : 'Enviar Respuesta y Obtener Feedback'}
                        </Button>
                    </Card>
                )}
                
                {isLoading && !geminiFeedback && <div className="my-6"><LoadingSpinner text="Procesando..."/></div> }

                {error && (
                    <Card className="mb-6 bg-red-50 border-red-500">
                        <div className="flex items-center text-red-700">
                            <XCircleIcon className="w-6 h-6 mr-2" />
                            <p><strong>Error:</strong> {error}</p>
                        </div>
                    </Card>
                )}

                {geminiFeedback && !isLoading && (
                    <Card className="border-l-4 border-green-500">
                        <h4 className="text-lg font-semibold text-neutral-800 mb-2">Retroalimentación de la IA:</h4>
                        <p className="text-neutral-700 whitespace-pre-wrap">{geminiFeedback}</p>
                    </Card>
                )}

                <Card title="Módulos Relacionados" className="mt-8">
                    <p className="text-neutral-600">
                        Expande tus conocimientos en optimización con estos temas:
                    </p>
                    <ul className="list-disc list-inside text-neutral-600 mt-2 space-y-2">
                        <li>
                            <a href="/#/kpis" className="text-primary hover:underline font-medium">
                                Definición y seguimiento de Indicadores Clave de Desempeño (KPIs)
                            </a>
                        </li>
                        <li>
                            <a href="/#/smart-goals" className="text-primary hover:underline font-medium">
                                Definición de Metas SMART
                            </a>
                        </li>
                        <li>
                            <a href="/#/automation" className="text-primary hover:underline font-medium">
                                Ejercicios de automatización de tareas simuladas
                            </a>
                        </li>
                    </ul>
                </Card>
            </InteractiveModule>
        </PageWrapper>
    );
};

export default ProcessOptimizationPage;
