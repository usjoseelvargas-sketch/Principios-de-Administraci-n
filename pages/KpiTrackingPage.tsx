import React, { useState, useCallback, useEffect, useRef } from 'react';
import { generateContent } from '../services/geminiService'; // CAMBIO: Importamos nuestro servicio

// Componentes y Constantes
import PageWrapper from '../components/PageWrapper';
import InteractiveModule from '../components/InteractiveModule';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Card from '../components/ui/Card';
import { TrendingUpIcon, LightbulbIcon, CheckCircleIcon, XCircleIcon, MicrophoneIcon, StopCircleIcon } from '../constants';
import { KpiScenario, SpeechRecognition } from '../types';
import { KPI_SCENARIOS } from '../constants';

const KpiTrackingPage: React.FC = () => {
    const [currentScenario, setCurrentScenario] = useState<KpiScenario | null>(null);
    const [kpiTitle, setKpiTitle] = useState('');
    const [kpiDefinition, setKpiDefinition] = useState('');

    // CAMBIO: Estados locales para manejar la llamada a la API
    const [geminiFeedback, setGeminiFeedback] = useState<string | null>(null);
    const [geminiError, setGeminiError] = useState<string | null>(null);
    const [isLoadingGemini, setIsLoadingGemini] = useState<boolean>(false);

    // Speech-to-text state
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const [recordingField, setRecordingField] = useState<'title' | 'definition' | null>(null);
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
                if (recordingField === 'title') {
                    setKpiTitle(prev => prev ? `${prev} ${transcript}` : transcript);
                } else if (recordingField === 'definition') {
                    setKpiDefinition(prev => prev ? `${prev} ${transcript}` : transcript);
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

    const handleToggleRecording = (field: 'title' | 'definition') => {
        if (!recognitionRef.current) {
            setSpeechError("El reconocimiento de voz no es compatible con este navegador.");
            return;
        }
        if (recordingField === field) {
            recognitionRef.current.stop();
            setRecordingField(null);
        } else {
            if(recordingField) recognitionRef.current.stop();
            setSpeechError(null);
            setRecordingField(field);
            recognitionRef.current.start();
        }
    };
    
    // Función para limpiar el estado de Gemini
    const resetGemini = useCallback(() => {
        setGeminiFeedback(null);
        setGeminiError(null);
        setIsLoadingGemini(false);
    }, []);

    const loadNewScenario = useCallback(() => {
        if (recordingField) recognitionRef.current?.stop();
        resetGemini();
        setKpiTitle('');
        setKpiDefinition('');
        setSpeechError(null);
        const randomIndex = Math.floor(Math.random() * KPI_SCENARIOS.length);
        setCurrentScenario(KPI_SCENARIOS[randomIndex]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resetGemini, recordingField]);

    useEffect(() => {
        loadNewScenario();
    }, [loadNewScenario]);

    const handleSubmitKpi = useCallback(async () => {
        if (!currentScenario || !kpiTitle.trim() || !kpiDefinition.trim()) return;

        resetGemini();
        setIsLoadingGemini(true);

        const prompt = `
            Eres un experto en gestión de rendimiento y un coach de negocios. Estás evaluando la definición de un Indicador Clave de Desempeño (KPI) propuesta por un estudiante de administración.

            Contexto del Negocio:
            Título del Escenario: "${currentScenario.title}"
            Descripción: "${currentScenario.description}"

            Definición del KPI por parte del estudiante:
            Nombre del KPI: "${kpiTitle}"
            Descripción/Definición (cómo se medirá y qué lo hace SMART): "${kpiDefinition}"

            Por favor, evalúa esta propuesta de KPI utilizando los criterios SMART como guía:
            - **Específico (Specific):** ¿El KPI es claro y se enfoca en un área de mejora concreta?
            - **Medible (Measurable):** ¿La definición deja claro cómo se cuantificará el KPI? ¿La métrica es objetiva?
            - **Alcanzable (Achievable):** ¿Parece realista que la organización pueda medir y afectar este KPI?
            - **Relevante (Relevant):** ¿Este KPI está directamente relacionado con el objetivo del escenario ("${currentScenario.title}")? ¿Es importante para el éxito del negocio?
            - **Limitado en el Tiempo (Time-bound):** ¿La definición incluye o implica un marco de tiempo para su seguimiento o consecución?

            Proporciona retroalimentación constructiva en 2-4 párrafos.
            1. Comienza con un resumen general de la propuesta del estudiante.
            2. Luego, analiza de forma integrada los criterios SMART, destacando los puntos fuertes y las áreas de mejora.
            3. Ofrece sugerencias concretas para hacer el KPI más robusto.
            4. Mantén un tono positivo y educativo.
        `;

        try {
            const feedback = await generateContent(prompt);
            setGeminiFeedback(feedback);
        } catch (e) {
            console.error("Error al enviar KPI:", e);
            setGeminiError(e instanceof Error ? e.message : "Ocurrió un error al evaluar el KPI.");
        } finally {
            setIsLoadingGemini(false);
        }
    }, [currentScenario, kpiTitle, kpiDefinition, resetGemini]);

    return (
        <PageWrapper title="Definición y Seguimiento de KPIs" titleIcon={<TrendingUpIcon />} subtitle="Aprende a crear indicadores que realmente impulsen el rendimiento.">
            <InteractiveModule
                title="Laboratorio de Creación de KPIs"
                icon={<LightbulbIcon className="w-6 h-6" />}
                initialInstructions="1. Analiza el escenario de negocio. 2. Define un KPI utilizando el marco SMART. 3. Envía tu propuesta para recibir feedback detallado de la IA."
            >
                <Button onClick={loadNewScenario} disabled={isLoadingGemini || !!recordingField} className="mb-6">
                    Generar Nuevo Escenario
                </Button>

                {currentScenario && (
                    <Card className="mb-6 border-l-4 border-amber-500">
                        <h4 className="text-lg font-semibold text-neutral-800 mb-2">Escenario de Negocio: {currentScenario.title}</h4>
                        <p className="text-neutral-700">{currentScenario.description}</p>
                    </Card>
                )}

                {currentScenario && (
                    <Card className="mb-6">
                        <h4 className="text-lg font-semibold text-neutral-800 mb-3">Define tu KPI</h4>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="kpi-title" className="block text-sm font-medium text-neutral-700 mb-1">
                                    Nombre del KPI
                                </label>
                                <div className="relative w-full">
                                    <input
                                        type="text"
                                        id="kpi-title"
                                        value={kpiTitle}
                                        onChange={(e) => setKpiTitle(e.target.value)}
                                        className="w-full p-2 border border-neutral-300 rounded-md shadow-sm focus:ring-primary focus:border-primary pr-12"
                                        placeholder="Ej: Tasa de Retención de Clientes Trimestral"
                                        disabled={isLoadingGemini || !!recordingField}
                                    />
                                    <Button
                                        onClick={() => handleToggleRecording('title')}
                                        variant="outline" size="icon"
                                        className="absolute top-1/2 right-2 -translate-y-1/2 h-8 w-8"
                                        aria-label={recordingField === 'title' ? 'Detener grabación' : 'Grabar nombre por voz'}
                                        disabled={!recognitionRef.current || isLoadingGemini}
                                    >
                                        {recordingField === 'title' ? <StopCircleIcon className="w-5 h-5 text-red-500" /> : <MicrophoneIcon className="w-5 h-5" />}
                                    </Button>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="kpi-definition" className="block text-sm font-medium text-neutral-700 mb-1">
                                    Definición (Aplicando SMART)
                                </label>
                                <div className="relative w-full">
                                    <textarea
                                        id="kpi-definition"
                                        rows={5}
                                        value={kpiDefinition}
                                        onChange={(e) => setKpiDefinition(e.target.value)}
                                        className="w-full p-2 border border-neutral-300 rounded-md shadow-sm focus:ring-primary focus:border-primary pr-12"
                                        placeholder="Describe cómo se medirá el KPI. Sé específico sobre la fórmula, la fuente de datos, la frecuencia de medición y el objetivo. Por ejemplo: Aumentar el porcentaje de clientes que realizan una segunda compra dentro de los 90 días posteriores a su primera compra, del 25% actual al 30% para el final del Q3. Se medirá mensualmente usando datos del CRM."
                                        disabled={isLoadingGemini || !!recordingField}
                                    />
                                    <Button
                                        onClick={() => handleToggleRecording('definition')}
                                        variant="outline" size="icon"
                                        className="absolute top-2 right-2 h-8 w-8"
                                        aria-label={recordingField === 'definition' ? 'Detener grabación' : 'Grabar definición por voz'}
                                        disabled={!recognitionRef.current || isLoadingGemini}
                                    >
                                        {recordingField === 'definition' ? <StopCircleIcon className="w-5 h-5 text-red-500" /> : <MicrophoneIcon className="w-5 h-5" />}
                                    </Button>
                                </div>
                            </div>
                        </div>
                        {speechError && <p className="text-sm text-red-600 mt-2">{speechError}</p>}
                        {!!recordingField && <p className="text-sm text-blue-600 animate-pulse mt-2">Escuchando para el campo '{recordingField}'...</p>}
                        <Button
                            onClick={handleSubmitKpi}
                            disabled={isLoadingGemini || !kpiTitle.trim() || !kpiDefinition.trim() || !!recordingField}
                            isLoading={isLoadingGemini}
                            className="mt-4"
                        >
                            {isLoadingGemini ? 'Evaluando KPI...' : 'Evaluar mi KPI'}
                        </Button>
                    </Card>
                )}

                {isLoadingGemini && <div className="my-6"><LoadingSpinner text="Generando retroalimentación..." /></div>}

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
                            Feedback sobre tu KPI
                        </h4>
                        <div className="prose prose-sm max-w-none text-neutral-700 whitespace-pre-wrap">
                            <p>{geminiFeedback}</p>
                        </div>
                        <p className="mt-3 text-xs text-neutral-500 italic">Usa esta retroalimentación para refinar tu entendimiento sobre cómo construir KPIs poderosos.</p>
                    </Card>
                )}
            </InteractiveModule>
        </PageWrapper>
    );
};

export default KpiTrackingPage;
