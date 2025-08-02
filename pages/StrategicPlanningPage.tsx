import React, { useState, useCallback, useEffect, useRef } from 'react';
import PageWrapper from '../components/PageWrapper';
import InteractiveModule from '../components/InteractiveModule';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Card from '../components/ui/Card';
import { CompassIcon, LightbulbIcon, CheckCircleIcon, XCircleIcon, MicrophoneIcon, StopCircleIcon } from '../constants';
import { useGeminiTextQuery } from '../hooks/useGeminiQuery';
import { StrategicPlanningScenario, StrategicPlanInputs, SpeechRecognition } from '../types';
import { STRATEGIC_PLANNING_SCENARIOS } from '../constants';

const planComponentLabels: Record<keyof StrategicPlanInputs, { title: string, placeholder: string }> = {
    mission: { title: 'Misión', placeholder: '¿Cuál es el propósito fundamental de la organización? ¿Por qué existe? (Ej: "Organizar la información del mundo...")' },
    vision: { title: 'Visión', placeholder: '¿Qué aspira a ser la organización en el futuro? ¿Cuál es su meta a largo plazo? (Ej: "Crear un futuro sostenible...")' },
    qualityPolicy: { title: 'Política de la Calidad', placeholder: '¿Cuál es el compromiso de la empresa con la calidad y la satisfacción del cliente? (Ej: "Nos comprometemos a la mejora continua...")' },
    objectives: { title: 'Objetivos Estratégicos', placeholder: 'Enumera 3-5 objetivos SMART. (Ej: "1. Aumentar la cuota de mercado en un 15% en 2 años. 2. Lanzar 3 nuevos productos...")' },
    actionPlans: { title: 'Planes de Acción', placeholder: 'Describe las acciones clave para alcanzar cada objetivo. (Ej: "Para el Objetivo 1: Lanzar campaña de marketing digital en Q3...")' },
};


const StrategicPlanningPage: React.FC = () => {
    const [currentScenario, setCurrentScenario] = useState<StrategicPlanningScenario | null>(null);
    const [planInputs, setPlanInputs] = useState<StrategicPlanInputs>({ mission: '', vision: '', qualityPolicy: '', objectives: '', actionPlans: '' });

    const {
        data: geminiFeedback,
        error: geminiError,
        isLoading: isLoadingGemini,
        executeQuery: fetchGeminiFeedback,
        reset: resetGemini,
    } = useGeminiTextQuery();

    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const [recordingField, setRecordingField] = useState<keyof StrategicPlanInputs | null>(null);
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
                    setPlanInputs(prev => ({ ...prev, [recordingField]: prev[recordingField] ? `${prev[recordingField]} ${transcript}` : transcript }));
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

    const handleToggleRecording = (field: keyof StrategicPlanInputs) => {
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

    const loadNewScenario = useCallback(() => {
        if (recordingField) recognitionRef.current?.stop();
        resetGemini();
        setPlanInputs({ mission: '', vision: '', qualityPolicy: '', objectives: '', actionPlans: '' });
        const randomIndex = Math.floor(Math.random() * STRATEGIC_PLANNING_SCENARIOS.length);
        setCurrentScenario(STRATEGIC_PLANNING_SCENARIOS[randomIndex]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resetGemini, recordingField]);

    useEffect(() => {
        loadNewScenario();
    }, [loadNewScenario]);
    
    const handleInputChange = (field: keyof StrategicPlanInputs, value: string) => {
        setPlanInputs(prev => ({ ...prev, [field]: value }));
    };
    
    const isFormComplete = Object.values(planInputs).every(value => value.trim() !== '');

    const handleSubmit = useCallback(async () => {
        if (!currentScenario || !isFormComplete) return;
        resetGemini();

        const prompt = `
            Eres un consultor de estrategia empresarial de alto nivel (como de McKinsey o BCG) y un coach ejecutivo. Estás evaluando un borrador de plan estratégico creado por un estudiante de administración para un escenario de negocio específico.

            ### Contexto del Escenario:
            **Título:** "${currentScenario.title}"
            **Descripción:** "${currentScenario.scenario}"

            ### Plan Estratégico del Estudiante:
            **Misión:**
            ${planInputs.mission}

            **Visión:**
            ${planInputs.vision}

            **Política de la Calidad:**
            ${planInputs.qualityPolicy}

            **Objetivos Estratégicos:**
            ${planInputs.objectives}

            **Planes de Acción:**
            ${planInputs.actionPlans}

            ### Tu Tarea de Evaluación:
            Proporciona una crítica constructiva y experta del plan, evaluando cada componente individualmente y en conjunto. Usa **exactamente** los siguientes encabezados en formato Markdown (iniciando con \`###\`).

            ### Evaluación de la Misión
            - ¿Es inspiradora y define el propósito fundamental de la organización?
            - ¿Es clara, concisa y fácil de recordar?
            - ¿Se enfoca en el "por qué" de la empresa?

            ### Evaluación de la Visión
            - ¿Describe un futuro deseable y ambicioso?
            - ¿Es motivadora y establece una dirección clara a largo plazo?
            - ¿Es creíble pero desafiante?

            ### Evaluación de la Política de la Calidad
            - ¿Refleja un compromiso con la calidad y la satisfacción del cliente?
            - ¿Está alineada con la misión y la visión?
            - ¿Es una guía para la mejora continua?

            ### Evaluación de los Objetivos Estratégicos
            - ¿Son los objetivos SMART (Específicos, Medibles, Alcanzables, Relevantes, con Plazo)? Analiza si cumplen con estos criterios.
            - ¿Se derivan lógicamente de la misión y la visión?
            - ¿Cubren áreas clave del negocio (financiera, clientes, procesos, etc.)?

            ### Evaluación de los Planes de Acción
            - ¿Son los planes de acción concretos y detallados?
            - ¿Se vinculan claramente con los objetivos estratégicos?
            - ¿Parecen realistas en términos de recursos y tiempo? ¿Identifican responsables (aunque sea implícitamente)?

            ### Cohesión y Alineación General
            - ¿Hay una "línea dorada" que conecta la misión, la visión, los objetivos y los planes de acción?
            - ¿El plan estratégico en su conjunto es una respuesta coherente al escenario presentado?

            ### Recomendación General de un Consultor
            - Ofrece 2 o 3 consejos de alto nivel que el estudiante podría considerar para fortalecer su pensamiento estratégico. Anima al estudiante a seguir desarrollando esta habilidad crítica.

            Mantén un tono de mentor experto: exigente pero justo y alentador.
        `;
        await fetchGeminiFeedback(prompt, 'Eres un consultor de estrategia empresarial y coach ejecutivo, evaluando un plan estratégico.');
    }, [currentScenario, planInputs, fetchGeminiFeedback, resetGemini, isFormComplete]);
    
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
        <PageWrapper title="Práctica de Planificación Estratégica" titleIcon={<CompassIcon />} subtitle="Define el rumbo de una empresa construyendo su plan estratégico fundamental.">
            <InteractiveModule
                title="Laboratorio de Estrategia Empresarial"
                icon={<LightbulbIcon className="w-6 h-6" />}
                initialInstructions="1. Analiza el escenario empresarial. 2. Define cada componente del plan estratégico. 3. Envía tu plan completo para recibir una evaluación experta de la IA."
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
                        {(Object.keys(planInputs) as Array<keyof StrategicPlanInputs>).map(key => {
                            const { title, placeholder } = planComponentLabels[key];
                            const isLargeField = key === 'objectives' || key === 'actionPlans';
                            return (
                                <Card key={key} title={title}>
                                    <div className="relative w-full">
                                        <textarea
                                            rows={isLargeField ? 5 : 2}
                                            value={planInputs[key]}
                                            onChange={(e) => handleInputChange(key, e.target.value)}
                                            className="w-full p-2 border border-neutral-300 rounded-md shadow-sm focus:ring-primary focus:border-primary pr-12"
                                            placeholder={placeholder}
                                            onPaste={(e) => e.preventDefault()}
                                            disabled={isLoadingGemini || !!recordingField}
                                        />
                                        <Button
                                            onClick={() => handleToggleRecording(key)}
                                            variant="outline" size="sm"
                                            className="absolute top-2 right-2 !p-2 h-8 w-8"
                                            aria-label={recordingField === key ? `Detener grabación para ${title}` : `Grabar ${title} por voz`}
                                            disabled={!recognitionRef.current}
                                        >
                                            {recordingField === key ? <StopCircleIcon className="w-4 h-4 text-red-500" /> : <MicrophoneIcon className="w-4 h-4" />}
                                        </Button>
                                    </div>
                                </Card>
                            );
                        })}
                        {speechError && <p className="text-sm text-red-600 mt-2 text-center">{speechError}</p>}
                        {!!recordingField && <p className="text-sm text-blue-600 animate-pulse mt-2 text-center">Escuchando para el campo '{planComponentLabels[recordingField].title}'...</p>}
                        <div className="text-center">
                            <Button
                                onClick={handleSubmit}
                                disabled={isLoadingGemini || !isFormComplete || !!recordingField}
                                isLoading={isLoadingGemini}
                                size="lg"
                            >
                                {isLoadingGemini ? 'Evaluando Plan Estratégico...' : 'Evaluar mi Plan Estratégico'}
                            </Button>
                        </div>
                    </div>
                )}
                
                {isLoadingGemini && <div className="my-6"><LoadingSpinner text="Generando análisis de consultoría..." /></div>}

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
                        <h3 className="text-xl font-semibold text-neutral-800 mb-3 flex items-center">
                            <CheckCircleIcon className="w-6 h-6 mr-2 text-green-600" />
                            Análisis de tu Plan Estratégico
                        </h3>
                        {formattedFeedback(geminiFeedback)}
                        <p className="mt-3 text-xs text-neutral-500 italic">Este análisis te ayuda a desarrollar una visión estratégica integral.</p>
                    </Card>
                )}
            </InteractiveModule>
        </PageWrapper>
    );
};

export default StrategicPlanningPage;