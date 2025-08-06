import React, { useState, useCallback, useEffect, useRef } from 'react';
import { generateContent } from '../services/geminiService'; // CAMBIO: Importamos nuestro servicio

// Componentes y Constantes
import PageWrapper from '../components/PageWrapper';
import InteractiveModule from '../components/InteractiveModule';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Card from '../components/ui/Card';
import { SwotIcon, LightbulbIcon, CheckCircleIcon, XCircleIcon, MicrophoneIcon, StopCircleIcon } from '../constants';
import { SwotScenario, SpeechRecognition } from '../types';
import { SWOT_SCENARIOS } from '../constants';

// --- TIPOS Y CONSTANTES LOCALES ---
interface SwotInputs {
    strengths: string;
    weaknesses: string;
    opportunities: string;
    threats: string;
}

const quadrantLabels: Record<keyof SwotInputs, { title: string, subtitle: string, color: string }> = {
    strengths: { title: 'Fortalezas', subtitle: 'Internas / Positivas', color: 'border-green-500' },
    weaknesses: { title: 'Debilidades', subtitle: 'Internas / Negativas', color: 'border-red-500' },
    opportunities: { title: 'Oportunidades', subtitle: 'Externas / Positivas', color: 'border-blue-500' },
    threats: { title: 'Amenazas', subtitle: 'Externas / Negativas', color: 'border-yellow-500' },
};

const SwotAnalysisPage: React.FC = () => {
    const [currentScenario, setCurrentScenario] = useState<SwotScenario | null>(null);
    const [swotInputs, setSwotInputs] = useState<SwotInputs>({ strengths: '', weaknesses: '', opportunities: '', threats: '' });

    // CAMBIO: Estados locales para manejar la llamada a la API
    const [geminiFeedback, setGeminiFeedback] = useState<string | null>(null);
    const [geminiError, setGeminiError] = useState<string | null>(null);
    const [isLoadingGemini, setIsLoadingGemini] = useState<boolean>(false);

    // Speech-to-text state
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const [recordingField, setRecordingField] = useState<keyof SwotInputs | null>(null);
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
                if (recordingField) {
                    setSwotInputs(prev => ({ ...prev, [recordingField]: prev[recordingField] ? `${prev[recordingField]} ${transcript}` : transcript }));
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

    const handleToggleRecording = (field: keyof SwotInputs) => {
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

    const resetGemini = useCallback(() => {
        setGeminiFeedback(null);
        setGeminiError(null);
        setIsLoadingGemini(false);
    }, []);

    const loadNewScenario = useCallback(() => {
        if (recordingField) recognitionRef.current?.stop();
        resetGemini();
        setSwotInputs({ strengths: '', weaknesses: '', opportunities: '', threats: '' });
        setSpeechError(null);
        const randomIndex = Math.floor(Math.random() * SWOT_SCENARIOS.length);
        setCurrentScenario(SWOT_SCENARIOS[randomIndex]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resetGemini, recordingField]);

    useEffect(() => {
        loadNewScenario();
    }, [loadNewScenario]);

    const handleInputChange = (field: keyof SwotInputs, value: string) => {
        setSwotInputs(prev => ({ ...prev, [field]: value }));
    };
    
    const isFormComplete = Object.values(swotInputs).every(value => value.trim() !== '');

    const handleSubmit = useCallback(async () => {
        if (!currentScenario || !isFormComplete) return;

        resetGemini();
        setIsLoadingGemini(true);

        const prompt = `
            Eres un consultor experto en estrategia de negocios y un coach académico. Estás evaluando un análisis DOFA (Fortalezas, Oportunidades, Debilidades, Amenazas) realizado por un estudiante.

            ### Contexto del Escenario:
            **Título:** "${currentScenario.title}"
            **Descripción:** "${currentScenario.scenario}"

            ### Análisis DOFA del Estudiante:
            **Fortalezas (Internas, Positivas):** ${swotInputs.strengths || "No proporcionadas"}
            **Debilidades (Internas, Negativas):** ${swotInputs.weaknesses || "No proporcionadas"}
            **Oportunidades (Externas, Positivas):** ${swotInputs.opportunities || "No proporcionadas"}
            **Amenazas (Externas, Negativas):** ${swotInputs.threats || "No proporcionadas"}

            ### Tu Tarea de Evaluación:
            Proporciona una retroalimentación detallada y constructiva usando **exactamente** los siguientes encabezados en formato Markdown (iniciando con \`###\`).

            ### Evaluación de Fortalezas
            - ¿Son realmente fortalezas internas y controlables? Evalúa la selección del estudiante.
            - ¿Hay alguna fortaleza clave del escenario que el estudiante omitió?

            ### Evaluación de Debilidades
            - ¿Son realmente debilidades internas y controlables? Evalúa la selección.
            - ¿Hay alguna debilidad clave que el estudiante no vio?

            ### Evaluación de Oportunidades
            - ¿Son realmente oportunidades externas del entorno?
            - ¿Omitió el estudiante alguna oportunidad obvia mencionada en el escenario?

            ### Evaluación de Amenazas
            - ¿Son realmente amenazas externas e incontrolables?
            - ¿Pasó por alto alguna amenaza importante?

            ### Comprensión General (Interno vs. Externo)
            - Evalúa si el estudiante comprende la diferencia fundamental entre factores internos (Fortalezas, Debilidades) y externos (Oportunidades, Amenazas). Comenta sobre cualquier punto mal clasificado.

            ### Conclusión y Siguiente Paso Estratégico
            - Resume tu análisis y sugiere cuál podría ser el siguiente paso. Por ejemplo, "¿Cómo se pueden usar las fortalezas para aprovechar las oportunidades (Estrategias FO)?" o "¿Cómo se pueden usar las fortalezas para mitigar las amenazas (Estrategias FA)?". Sé breve y fomenta el pensamiento estratégico.

            Mantén un tono de mentor, positivo y educativo.
        `;
        
        try {
            const feedback = await generateContent(prompt);
            setGeminiFeedback(feedback);
        } catch (e) {
            console.error("Error al enviar análisis DOFA:", e);
            setGeminiError(e instanceof Error ? e.message : "Ocurrió un error al obtener la retroalimentación.");
        } finally {
            setIsLoadingGemini(false);
        }
    }, [currentScenario, swotInputs, resetGemini, isFormComplete]);
    
    const formattedFeedback = (text: string) => text.split('### ').map((section, index) => {
        if (index === 0 && section.trim() === '') return null;
        const lines = section.split('\n');
        const title = lines.shift()?.trim();
        const content = lines.join('\n').trim();
        if (!title) return <p key={index} className="whitespace-pre-wrap">{content}</p>;
        return (
            <div key={index} className="mb-4">
                <h4 className="text-md font-semibold text-primary mb-1">{title}</h4>
                <div className="prose prose-sm max-w-none text-neutral-700 whitespace-pre-wrap">{content}</div>
            </div>
        );
    });

    return (
        <PageWrapper title="Análisis Estratégico DOFA (SWOT)" titleIcon={<SwotIcon />} subtitle="Aprende a diagnosticar una situación de negocio identificando factores internos y externos.">
            <InteractiveModule
                title="Laboratorio de Análisis DOFA"
                icon={<LightbulbIcon className="w-6 h-6" />}
                initialInstructions="1. Analiza el escenario. 2. Completa los cuatro cuadrantes del análisis DOFA. 3. Envía tu análisis para recibir una evaluación detallada de la IA."
            >
                <Button onClick={loadNewScenario} disabled={isLoadingGemini || !!recordingField} className="mb-6">
                    Generar Nuevo Escenario
                </Button>

                {currentScenario && (
                    <Card className="mb-6 border-l-4 border-amber-500">
                        <h4 className="text-lg font-semibold text-neutral-800 mb-2">Escenario: {currentScenario.title}</h4>
                        <p className="text-neutral-700">{currentScenario.scenario}</p>
                    </Card>
                )}

                {currentScenario && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {(Object.keys(swotInputs) as Array<keyof SwotInputs>).map(key => {
                                const { title, subtitle, color } = quadrantLabels[key];
                                return (
                                    <Card key={key} className={`border-l-4 ${color}`}>
                                        <h3 className="text-lg font-bold text-neutral-800">{title}</h3>
                                        <p className="text-sm text-neutral-500 mb-3">{subtitle}</p>
                                        <div className="relative w-full">
                                            <textarea
                                                rows={6}
                                                value={swotInputs[key]}
                                                onChange={(e) => handleInputChange(key, e.target.value)}
                                                className="w-full p-2 border border-neutral-300 rounded-md shadow-sm focus:ring-primary focus:border-primary pr-12"
                                                placeholder={`Enumera las ${title.toLowerCase()} aquí...`}
                                                disabled={isLoadingGemini || !!recordingField}
                                            />
                                            <Button
                                                onClick={() => handleToggleRecording(key)}
                                                variant="outline" size="icon"
                                                className="absolute top-2 right-2 h-8 w-8"
                                                aria-label={recordingField === key ? `Detener grabación para ${title}` : `Grabar ${title} por voz`}
                                                disabled={!recognitionRef.current || (isLoadingGemini && recordingField !== key)}
                                            >
                                                {recordingField === key ? <StopCircleIcon className="w-5 h-5 text-red-500" /> : <MicrophoneIcon className="w-5 h-5" />}
                                            </Button>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                        {speechError && <p className="text-sm text-red-600 mt-2 text-center">{speechError}</p>}
                        {!!recordingField && <p className="text-sm text-blue-600 animate-pulse mt-2 text-center">Escuchando para el campo '{quadrantLabels[recordingField].title}'...</p>}
                        <div className="text-center">
                            <Button
                                onClick={handleSubmit}
                                disabled={isLoadingGemini || !isFormComplete || !!recordingField}
                                isLoading={isLoadingGemini}
                                size="lg"
                            >
                                {isLoadingGemini ? 'Evaluando Análisis...' : 'Evaluar mi Análisis DOFA'}
                            </Button>
                        </div>
                    </div>
                )}
                
                {isLoadingGemini && <div className="my-6"><LoadingSpinner text="Generando retroalimentación estratégica..." /></div>}

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
                        <h3 className="text-xl font-semibold text-neutral-800 mb-3 flex items-center">
                            <CheckCircleIcon className="w-6 h-6 mr-2 text-green-600" />
                            Análisis de tu Matriz DOFA
                        </h3>
                        {formattedFeedback(geminiFeedback)}
                        <p className="mt-3 text-xs text-neutral-500 italic">Usa este análisis para refinar tu pensamiento estratégico.</p>
                    </Card>
                )}

            </InteractiveModule>
        </PageWrapper>
    );
};

export default SwotAnalysisPage;
