import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { generateContent } from '../services/geminiService';

// Componentes y Constantes
import PageWrapper from '../components/PageWrapper';
import InteractiveModule from '../components/InteractiveModule';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Card from '../components/ui/Card';
import { TargetIcon, LightbulbIcon, CheckCircleIcon, XCircleIcon, MicrophoneIcon, StopCircleIcon } from '../constants';
import { SmartGoalScenario, SmartGoalInputs, SpeechRecognition } from '../types';
import { SMART_GOAL_SCENARIOS } from '../constants';

// --- TIPOS Y CONSTANTES ---
const labels: Record<keyof SmartGoalInputs, { label: string; placeholder: string; description: string }> = {
    specific: { label: "S - Específico (Specific)", placeholder: "¿Qué quieres lograr exactamente? Sé claro y conciso.", description: "El objetivo debe ser claro y detallado." },
    measurable: { label: "M - Medible (Measurable)", placeholder: "¿Cómo sabrás que lo has logrado? ¿Qué métricas usarás?", description: "Establece indicadores claros para seguir el avance." },
    achievable: { label: "A - Alcanzable (Achievable)", placeholder: "¿Es esta meta realista con los recursos y tiempo disponibles?", description: "El objetivo debe ser realista y posible de lograr." },
    relevant: { label: "R - Relevante (Relevant)", placeholder: "¿Por qué es importante esta meta para el escenario actual?", description: "La meta debe ser significativa y alinearse con tus objetivos." },
    timeBound: { label: "T - Limitado en el Tiempo (Time-bound)", placeholder: "¿Cuál es la fecha límite para alcanzar esta meta?", description: "Establecer una fecha límite crea un sentido de urgencia." }
};

// --- COMPONENTE PRINCIPAL ---
const SmartGoalsPage = () => {
    const [currentScenario, setCurrentScenario] = useState<SmartGoalScenario | null>(null);
    const [goalInputs, setGoalInputs] = useState<SmartGoalInputs>({ specific: '', measurable: '', achievable: '', relevant: '', timeBound: '' });
    const [geminiFeedback, setGeminiFeedback] = useState<string | null>(null);
    const [geminiError, setGeminiError] = useState<string | null>(null);
    const [isLoadingGemini, setIsLoadingGemini] = useState<boolean>(false);

    // Speech-to-text state
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const [recordingField, setRecordingField] = useState<keyof SmartGoalInputs | null>(null);
    const [speechError, setSpeechError] = useState<string | null>(null);

    const resetGemini = useCallback(() => {
        setGeminiFeedback(null);
        setGeminiError(null);
        setIsLoadingGemini(false);
    }, []);
    
    const loadNewScenario = useCallback(() => {
        if (recordingField) recognitionRef.current?.stop();
        resetGemini();
        setGoalInputs({ specific: '', measurable: '', achievable: '', relevant: '', timeBound: '' });
        setSpeechError(null);
        const randomIndex = Math.floor(Math.random() * SMART_GOAL_SCENARIOS.length);
        setCurrentScenario(SMART_GOAL_SCENARIOS[randomIndex]);
    }, [resetGemini, recordingField]);

    useEffect(() => {
        loadNewScenario();
    }, [loadNewScenario]);

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
                    setGoalInputs(prev => ({ ...prev, [recordingField]: prev[recordingField] ? `${prev[recordingField]} ${transcript}` : transcript }));
                }
                setSpeechError(null);
            };
            recognition.onerror = (event) => setSpeechError(`Error en reconocimiento: ${event.error}. Por favor, escribe.`);
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
            if (recordingField) recognitionRef.current.stop();
            setSpeechError(null);
            setRecordingField(field);
            recognitionRef.current.start();
        }
    };

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target as { name: keyof SmartGoalInputs, value: string };
        setGoalInputs(prev => ({ ...prev, [name]: value }));
    }, []);

    const isFormComplete = useMemo(() => Object.values(goalInputs).every(value => value.trim() !== ''), [goalInputs]);

    const handleSubmitGoal = useCallback(async () => {
        if (!currentScenario || !isFormComplete) return;
        
        resetGemini();
        setIsLoadingGemini(true);
        
        const prompt = `
            Actúa como un coach experto en productividad y establecimiento de metas.
            Evalúa la siguiente meta SMART de forma integral, constructiva y alentadora.
            Ofrece un párrafo de análisis general y luego 1 o 2 sugerencias específicas y accionables para mejorarla.
            Mantén un tono positivo y motivador.

            Contexto: "${currentScenario.title}" - ${currentScenario.context}.
            
            Meta SMART definida por el usuario:
            - Específico (S): "${goalInputs.specific}"
            - Medible (M): "${goalInputs.measurable}"
            - Alcanzable (A): "${goalInputs.achievable}"
            - Relevante (R): "${goalInputs.relevant}"
            - Limitado en Tiempo (T): "${goalInputs.timeBound}"
        `;
        
        try {
            const feedback = await generateContent(prompt); 
            setGeminiFeedback(feedback);
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : "Ocurrió un error desconocido.";
            setGeminiError(`No se pudo generar la evaluación. Por favor, inténtalo de nuevo más tarde. (${errorMessage})`);
        } finally {
            setIsLoadingGemini(false);
        }
    }, [currentScenario, goalInputs, isFormComplete, resetGemini]);

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
                    <>
                        <Card className="mb-6 border-l-4 border-amber-500">
                            <h4 className="text-lg font-semibold text-slate-800 mb-2">Escenario: {currentScenario.title}</h4>
                            <p className="text-slate-700">{currentScenario.context}</p>
                        </Card>
                        <Card className="mb-6">
                            <h4 className="text-lg font-semibold text-slate-800 mb-4">Construye tu Meta SMART</h4>
                            <div className="space-y-5">
                                {(Object.keys(goalInputs) as Array<keyof SmartGoalInputs>).map((key) => (
                                    <div key={key}>
                                        <label htmlFor={`goal-${key}`} className="block text-base font-bold text-slate-700">{labels[key].label}</label>
                                        <p className="text-sm text-slate-600 mb-2">{labels[key].description}</p>
                                        <div className="relative w-full">
                                            <textarea
                                                id={`goal-${key}`} name={key} rows={2} value={goalInputs[key]}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border border-neutral-300 rounded-md shadow-sm focus:ring-primary focus:border-primary pr-12"
                                                placeholder={labels[key].placeholder}
                                                disabled={isLoadingGemini || !!recordingField}
                                            />
                                            <Button
                                                onClick={() => handleToggleRecording(key)}
                                                variant="outline" size="icon"
                                                className="absolute top-2 right-2 h-8 w-8"
                                                aria-label={recordingField === key ? `Detener grabación para ${labels[key].label}` : `Grabar ${labels[key].label} por voz`}
                                                disabled={!recognitionRef.current || (isLoadingGemini && recordingField !== key)}
                                            >
                                                {recordingField === key ? <StopCircleIcon className="w-5 h-5 text-red-500" /> : <MicrophoneIcon className="w-5 h-5" />}
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {speechError && <p className="text-sm text-red-600 mt-2 text-center">{speechError}</p>}
                            {!!recordingField && <p className="text-sm text-blue-600 animate-pulse mt-2 text-center">Escuchando para el campo '{labels[recordingField].label}'...</p>}
                            <Button
                                onClick={handleSubmitGoal}
                                disabled={isLoadingGemini || !isFormComplete || !!recordingField}
                                isLoading={isLoadingGemini}
                                className="mt-6"
                            >
                                {isLoadingGemini ? 'Evaluando Meta...' : 'Evaluar mi Meta SMART'}
                            </Button>
                        </Card>
                    </>
                )}
                
                {isLoadingGemini && <div className="my-6"><LoadingSpinner text="Generando retroalimentación..." /></div>}
                
                {geminiError && !isLoadingGemini && ( 
                    <Card className="my-6 bg-red-50 border-red-500">
                        <div className="flex items-center text-red-800"> 
                            <XCircleIcon className="w-6 h-6 mr-2" /> 
                            <p><strong>Error al obtener retroalimentación:</strong> {geminiError}</p> 
                        </div> 
                    </Card> 
                )}
                
                {geminiFeedback && !isLoadingGemini && ( 
                    <Card className="my-6 border-l-4 border-green-500">
                        <h4 className="text-xl font-semibold text-slate-800 mb-3 flex items-center"> 
                            <CheckCircleIcon className="w-6 h-6 mr-2 text-green-600" /> Análisis de tu Meta SMART 
                        </h4>
                        <div className="prose prose-sm max-w-none text-neutral-700 whitespace-pre-wrap">
                            <p>{geminiFeedback}</p>
                        </div>
                        <p className="mt-4 text-sm text-slate-500 italic">Usa este análisis para perfeccionar tu habilidad de establecer objetivos efectivos.</p> 
                    </Card> 
                )}
            </InteractiveModule>
        </PageWrapper>
    );
};

export default SmartGoalsPage;
