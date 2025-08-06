import React, { useState, useCallback, useEffect, useRef } from 'react';
import { generateContent } from '../services/geminiService'; // CAMBIO: Importamos nuestro servicio único

// Componentes y Constantes
import PageWrapper from '../components/PageWrapper';
import InteractiveModule from '../components/InteractiveModule';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Card from '../components/ui/Card';
import { PencilSquareIcon, LightbulbIcon, CheckCircleIcon, XCircleIcon, MicrophoneIcon, StopCircleIcon } from '../constants';
import { SpeechRecognition } from '../types';

// --- TIPOS Y CONSTANTES LOCALES ---
type PracticeMode = 'creative' | 'correction' | 'structured' | 'paragraph_types';

interface StructuredInputs {
    topic: string;
    support: string;
    conclusion: string;
}

interface ParagraphType {
    id: 'narrative' | 'descriptive' | 'argumentative' | 'comparison';
    name: string;
    description: string;
    example: string;
}

const PARAGRAPH_TYPES: ParagraphType[] = [
    { id: 'narrative', name: 'Párrafo Narrativo', description: 'Cuenta una historia o una secuencia de eventos. Suelen seguir una cronología.', example: 'Ejemplo: "Era una tarde lluviosa cuando Ana decidió salir. Caminó por las calles vacías, observando cómo las gotas resbalaban por las ventanas..."' },
    { id: 'descriptive', name: 'Párrafo Descriptivo', description: 'Se enfoca en describir personas, lugares u objetos para crear una imagen vívida.', example: 'Ejemplo: "El viejo caserón se alzaba imponente. Sus ventanas rotas parecían ojos vacíos y la pintura descascarada revelaba décadas de abandono."' },
    { id: 'argumentative', name: 'Párrafo Argumentativo', description: 'Presenta un punto de vista y busca convencer al lector de su validez.', example: 'Ejemplo: "La educación a distancia es indispensable. Permite el acceso al conocimiento a personas con limitaciones geográficas o de tiempo..."' },
    { id: 'comparison', name: 'Párrafo de Comparación/Contraste', description: 'Explora similitudes y diferencias entre dos o más elementos.', example: 'Ejemplo: "Mientras que los libros impresos ofrecen la experiencia táctil, los electrónicos destacan por su portabilidad..."' }
];

const OrthographyPracticePage: React.FC = () => {
    const [mode, setMode] = useState<PracticeMode>('creative');

    // --- ESTADOS DEL COMPONENTE ---
    const [creativeTopic, setCreativeTopic] = useState<string | null>(null);
    const [creativeInputs, setCreativeInputs] = useState<StructuredInputs>({ topic: '', support: '', conclusion: '' });
    const [incorrectText, setIncorrectText] = useState<string | null>(null);
    const [originalCorrectText, setOriginalCorrectText] = useState<string | null>(null);
    const [structuredTopic, setStructuredTopic] = useState<string | null>(null);
    const [structuredInputs, setStructuredInputs] = useState<StructuredInputs>({ topic: '', support: '', conclusion: '' });
    const [selectedParagraphType, setSelectedParagraphType] = useState<ParagraphType | null>(null);
    const [paragraphTypeTopic, setParagraphTypeTopic] = useState<string | null>(null);
    const [userText, setUserText] = useState('');
    const [feedback, setFeedback] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const [recordingTarget, setRecordingTarget] = useState<{ mode: PracticeMode, field?: keyof StructuredInputs } | null>(null);
    const [speechError, setSpeechError] = useState<string | null>(null);
    const isRecording = !!recordingTarget;

    // --- LÓGICA DE RECONOCIMIENTO DE VOZ ---
    useEffect(() => {
        const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognitionAPI) {
            recognitionRef.current = new SpeechRecognitionAPI();
            const recognition = recognitionRef.current;
            recognition.continuous = false;
            recognition.lang = 'es-ES';
            recognition.interimResults = false;
            recognition.onresult = (event) => {
                if (!recordingTarget) return;
                const transcript = event.results[0][0].transcript;

                if (recordingTarget.mode === 'structured' && recordingTarget.field) {
                    setStructuredInputs(prev => ({ ...prev, [recordingTarget.field!]: prev[recordingTarget.field!] ? `${prev[recordingTarget.field!]} ${transcript}` : transcript }));
                } else if (recordingTarget.mode === 'creative' && recordingTarget.field) {
                    setCreativeInputs(prev => ({ ...prev, [recordingTarget.field!]: prev[recordingTarget.field!] ? `${prev[recordingTarget.field!]} ${transcript}` : transcript }));
                } else {
                    setUserText(prev => prev ? `${prev} ${transcript}` : transcript);
                }
                setSpeechError(null);
            };
            recognition.onerror = (event) => setSpeechError(`Error de reconocimiento: ${event.error}.`);
            recognition.onend = () => setRecordingTarget(null);
        }
        return () => recognitionRef.current?.stop();
    }, [recordingTarget]);

    const handleToggleRecording = useCallback((field?: keyof StructuredInputs) => {
        if (!recognitionRef.current) {
            setSpeechError("El reconocimiento de voz no es compatible con este navegador.");
            return;
        }
        if (isRecording) {
            recognitionRef.current.stop();
        } else {
            setSpeechError(null);
            setRecordingTarget({ mode, field });
            recognitionRef.current.start();
        }
    }, [isRecording, mode]);

    // --- LÓGICA DE MANEJO DE ESTADO Y GENERACIÓN DE CONTENIDO ---
    const resetAllState = useCallback(() => {
        setIsLoading(false);
        setError(null);
        setFeedback(null);
        setCreativeTopic(null);
        setCreativeInputs({ topic: '', support: '', conclusion: '' });
        setIncorrectText(null);
        setOriginalCorrectText(null);
        setStructuredTopic(null);
        setStructuredInputs({ topic: '', support: '', conclusion: '' });
        setSelectedParagraphType(null);
        setParagraphTypeTopic(null);
        setUserText('');
        setSpeechError(null);
        if (isRecording) recognitionRef.current?.stop();
    }, [isRecording]);

    const handleModeChange = useCallback((newMode: PracticeMode) => {
        setMode(newMode);
        resetAllState();
    }, [resetAllState]);

    const generateAndSetContent = useCallback(async (prompt: string, type: 'creative' | 'correction' | 'structured' | 'paragraph') => {
        resetAllState();
        setIsLoading(true);
        try {
            const response = await generateContent(prompt);
            switch (type) {
                case 'creative': setCreativeTopic(response); break;
                case 'correction':
                    const parts = response.split('\n---\n');
                    if (parts.length === 2) {
                        setIncorrectText(parts[0].trim());
                        setOriginalCorrectText(parts[1].trim());
                    } else { throw new Error("Formato de respuesta de IA incorrecto."); }
                    break;
                case 'structured': setStructuredTopic(response); break;
                case 'paragraph': setParagraphTypeTopic(response); break;
            }
        } catch (e) {
            setError(e instanceof Error ? e.message : "Error al generar contenido.");
        } finally {
            setIsLoading(false);
        }
    }, [resetAllState]);
    
    const handleGenerateCreativeTopic = useCallback(() => {
        generateAndSetContent("Genera un único tema de escritura creativo y abierto para un estudiante de habla hispana. Proporciona solo el tema.", 'creative');
    }, [generateAndSetContent]);

    const handleGenerateCorrectionText = useCallback(() => {
        generateAndSetContent("Genera un párrafo corto en español (3-5 frases) con 3-4 errores comunes de ortografía/puntuación. Formato: [Texto con errores]\n---\n[Texto corregido]", 'correction');
    }, [generateAndSetContent]);

    const handleGenerateStructuredTopic = useCallback(() => {
        generateAndSetContent("Genera un tema o pregunta simple para un párrafo estructurado (oración temática, apoyo, cierre). Proporciona solo el tema.", 'structured');
    }, [generateAndSetContent]);

    const handleGenerateParagraphTypeTopic = useCallback(() => {
        if (!selectedParagraphType) return;
        generateAndSetContent(`Genera un tema de escritura específico para un párrafo de tipo "${selectedParagraphType.name}". Proporciona solo el tema.`, 'paragraph');
    }, [generateAndSetContent, selectedParagraphType]);


    // --- LÓGICA DE ENVÍO Y EVALUACIÓN ---
    const handleSubmit = useCallback(async () => {
        setFeedback(null);
        setError(null);
        setIsLoading(true);

        let prompt = '';
        if (mode === 'creative' && creativeTopic && Object.values(creativeInputs).every(v => v.trim())) {
            prompt = `Evalúa el siguiente párrafo creativo estructurado del estudiante sobre el tema "${creativeTopic}".\nOración Temática: "${creativeInputs.topic}"\nOraciones de Apoyo: "${creativeInputs.support}"\nOración de Cierre: "${creativeInputs.conclusion}"\nAnaliza: ### Creatividad y Relevancia al Tema\n### Cohesión y Fluidez de la Estructura\n### Ortografía y Puntuación\n### Resumen General y Ánimo`;
        } else if (mode === 'correction' && incorrectText && originalCorrectText && userText.trim()) {
            prompt = `Texto Original con Errores: \`\`\`${incorrectText}\`\`\`\nVersión Correcta: \`\`\`${originalCorrectText}\`\`\`\nCorrección del Estudiante: \`\`\`${userText}\`\`\`\nEvalúa la corrección del estudiante usando estos encabezados: ### Aciertos\n### Errores Omitidos\n### Nuevos Errores Introducidos\n### Resumen y Recomendación`;
        } else if (mode === 'structured' && structuredTopic && Object.values(structuredInputs).every(v => v.trim())) {
            prompt = `Un estudiante debe escribir un párrafo estructurado sobre "${structuredTopic}".\nOración Temática: "${structuredInputs.topic}"\nOraciones de Apoyo: "${structuredInputs.support}"\nOración de Cierre: "${structuredInputs.conclusion}"\nEvalúa la cohesión, lógica y claridad de cada parte y del párrafo en conjunto, usando estos encabezados: ### Evaluación de la Oración Temática\n### Evaluación de las Oraciones de Apoyo\n### Evaluación de la Oración de Cierre\n### Cohesión y Fluidez General`;
        } else if (mode === 'paragraph_types' && selectedParagraphType && paragraphTypeTopic && userText.trim()) {
            prompt = `El estudiante debía escribir un párrafo de tipo "${selectedParagraphType.name}" sobre el tema "${paragraphTypeTopic}".\nDescripción del tipo de párrafo: "${selectedParagraphType.description}"\nPárrafo del estudiante: "${userText}"\nEvalúa si el párrafo cumple con las características del tipo solicitado, la estructura, y la corrección gramatical, usando estos encabezados: ### Evaluación del Tipo de Párrafo\n### Estructura y Cohesión\n### Ortografía y Gramática\n### Sugerencia para Mejorar`;
        } else {
            setIsLoading(false);
            return;
        }

        try {
            const response = await generateContent(prompt);
            setFeedback(response);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Error al obtener la evaluación.");
        } finally {
            setIsLoading(false);
        }
    }, [mode, creativeTopic, creativeInputs, incorrectText, originalCorrectText, userText, structuredTopic, structuredInputs, selectedParagraphType, paragraphTypeTopic]);

    // --- LÓGICA DE RENDERIZADO ---
    const formattedFeedback = (text: string) => text.split('### ').map((section, index) => {
        if (index === 0 && section.trim() === '') return null;
        const lines = section.split('\n');
        const title = lines.shift()?.trim();
        const content = lines.join('\n').trim();
        if (!title) return <p key={index} className="whitespace-pre-wrap">{content}</p>;
        return (
            <div key={index} className="mb-4">
                <h4 className="text-md font-semibold text-primary mb-1">{title}</h4>
                <p className="text-neutral-700 whitespace-pre-wrap">{content}</p>
            </div>
        );
    });

    const renderModeTabs = () => (
        <div className="flex justify-center flex-wrap mb-6 border-b border-neutral-200">
            {(['creative', 'correction', 'structured', 'paragraph_types'] as PracticeMode[]).map(m => (
                <button
                    key={m}
                    onClick={() => handleModeChange(m)}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${mode === m ? 'border-b-2 border-primary text-primary' : 'text-neutral-500 hover:text-neutral-700'}`}
                    aria-pressed={mode === m}
                >
                    {{ creative: 'Escritura Creativa', correction: 'Corrección de Texto', structured: 'Párrafo Estructurado', paragraph_types: 'Tipos de Párrafo' }[m]}
                </button>
            ))}
        </div>
    );
    
    return (
        <PageWrapper title="Práctica de Ortografía y Gramática" titleIcon={<PencilSquareIcon />} subtitle="Perfecciona tu escritura con análisis detallado de la IA.">
            <InteractiveModule title="Laboratorio de Escritura" icon={<LightbulbIcon className="w-6 h-6" />}>
                {renderModeTabs()}
                
                {error && <Card className="mb-6 bg-red-50 border-red-500"><div className="flex items-center text-red-700"><XCircleIcon className="w-6 h-6 mr-2" /><p><strong>Error:</strong> {error}</p></div></Card>}
                {speechError && <p className="text-sm text-red-600 mb-2">{speechError}</p>}

                {mode === 'creative' && (
                    <>
                        <Button onClick={handleGenerateCreativeTopic} disabled={isLoading || isRecording} isLoading={isLoading && !creativeTopic} className="mb-6">Generar Nuevo Tema</Button>
                        {isLoading && !creativeTopic && <div className="my-6"><LoadingSpinner text="Buscando inspiración..."/></div>}
                        {creativeTopic && <Card className="mb-6 border-l-4 border-amber-500"><h4 className="text-lg font-semibold text-neutral-800 mb-2">Tema:</h4><p className="text-neutral-700 text-xl italic">"{creativeTopic}"</p></Card>}
                        {creativeTopic && (
                            <Card className="mb-6">
                                <h3 className="text-lg font-semibold text-neutral-800 mb-3">Estructura tu Párrafo Creativo</h3>
                                <div className="space-y-4">
                                    {(Object.keys(creativeInputs) as Array<keyof StructuredInputs>).map(key => (
                                        <div key={key}>
                                            <label className="block text-md font-semibold text-neutral-700 mb-1 capitalize">{{ topic: 'Oración Temática', support: 'Oraciones de Apoyo', conclusion: 'Oración de Cierre' }[key]}</label>
                                            <div className="relative w-full">
                                                <textarea rows={key === 'support' ? 4 : 2} value={creativeInputs[key]} onChange={(e) => setCreativeInputs(prev => ({ ...prev, [key]: e.target.value }))} className="w-full p-2 border border-neutral-300 rounded-md pr-12" disabled={isLoading || isRecording} />
                                                <Button onClick={() => handleToggleRecording(key)} variant="outline" size="icon" className="absolute top-2 right-2 h-8 w-8" disabled={!recognitionRef.current || (isRecording && recordingTarget?.field !== key)}>
                                                    {isRecording && recordingTarget?.field === key ? <StopCircleIcon className="w-4 h-4 text-red-500" /> : <MicrophoneIcon className="w-4 h-4" />}
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {isRecording && recordingTarget?.mode === 'creative' && <p className="text-sm text-blue-600 animate-pulse mt-2">Escuchando para el campo '{ {topic: 'Oración Temática', support: 'Oraciones de Apoyo', conclusion: 'Oración de Cierre'}[recordingTarget.field!] }'...</p>}
                                <Button onClick={handleSubmit} disabled={isLoading || !Object.values(creativeInputs).every(v => v.trim()) || isRecording} isLoading={isLoading && !!creativeTopic} className="mt-4">Evaluar Párrafo</Button>
                            </Card>
                        )}
                    </>
                )}

                {mode === 'correction' && (
                    <>
                        <Button onClick={handleGenerateCorrectionText} disabled={isLoading || isRecording} isLoading={isLoading && !incorrectText} className="mb-6">Generar Texto para Corregir</Button>
                        {isLoading && !incorrectText && <div className="my-6"><LoadingSpinner text="Preparando ejercicio..."/></div>}
                        {incorrectText && <Card className="mb-6 border-l-4 border-amber-500"><h4 className="text-lg font-semibold text-neutral-800 mb-2">Texto a Corregir:</h4><p className="text-neutral-700 bg-amber-50 p-3 rounded-md italic">"{incorrectText}"</p></Card>}
                    </>
                )}

                {mode === 'structured' && (
                     <>
                        <Button onClick={handleGenerateStructuredTopic} disabled={isLoading || isRecording} isLoading={isLoading && !structuredTopic} className="mb-6">Generar Tema</Button>
                        {isLoading && !structuredTopic && <div className="my-6"><LoadingSpinner text="Generando tema..."/></div>}
                        {structuredTopic && <Card className="mb-6 border-l-4 border-amber-500"><h4 className="text-lg font-semibold text-neutral-800 mb-2">Tema:</h4><p className="text-neutral-700 text-xl italic">"{structuredTopic}"</p></Card>}
                        {structuredTopic && (
                            <Card className="mb-6 space-y-4">
                                {(Object.keys(structuredInputs) as Array<keyof StructuredInputs>).map(key => (
                                    <div key={key}>
                                        <label className="block text-md font-semibold text-neutral-700 mb-1 capitalize">{{ topic: 'Oración Temática', support: 'Oraciones de Apoyo', conclusion: 'Oración de Cierre' }[key]}</label>
                                        <div className="relative w-full">
                                            <textarea rows={key === 'support' ? 4 : 2} value={structuredInputs[key]} onChange={(e) => setStructuredInputs(prev => ({ ...prev, [key]: e.target.value }))} className="w-full p-2 border border-neutral-300 rounded-md pr-12" disabled={isLoading || isRecording} />
                                            <Button onClick={() => handleToggleRecording(key)} variant="outline" size="icon" className="absolute top-2 right-2 h-8 w-8" disabled={!recognitionRef.current || (isRecording && recordingTarget?.field !== key)}>
                                                {isRecording && recordingTarget?.field === key ? <StopCircleIcon className="w-4 h-4 text-red-500" /> : <MicrophoneIcon className="w-4 h-4" />}
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                {isRecording && recordingTarget?.mode === 'structured' && <p className="text-sm text-blue-600 animate-pulse mt-1">Escuchando para el campo '{ {topic: 'Oración Temática', support: 'Oraciones de Apoyo', conclusion: 'Oración de Cierre'}[recordingTarget.field!] }'...</p>}
                                <Button onClick={handleSubmit} disabled={isLoading || !Object.values(structuredInputs).every(v => v.trim()) || isRecording} isLoading={isLoading && !!structuredTopic} className="mt-4">Evaluar Párrafo</Button>
                            </Card>
                        )}
                    </>
                )}

                {mode === 'paragraph_types' && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            {PARAGRAPH_TYPES.map(type => (
                                <button key={type.id} onClick={() => { setSelectedParagraphType(type); setParagraphTypeTopic(null); setFeedback(null); }} className={`p-4 rounded-lg text-left transition-all duration-200 border-2 ${selectedParagraphType?.id === type.id ? 'bg-primary-light border-primary shadow-lg' : 'bg-white border-transparent hover:border-primary'}`}>
                                    <h4 className="font-bold text-primary">{type.name}</h4>
                                    <p className="text-sm text-neutral-600">{type.description}</p>
                                </button>
                            ))}
                        </div>
                        {selectedParagraphType && (
                            <Card className="mb-6 border-l-4 border-amber-500">
                                <h3 className="font-bold text-lg text-neutral-800">Práctica de {selectedParagraphType.name}</h3>
                                <p className="text-sm text-neutral-600 my-2">{selectedParagraphType.example}</p>
                                <Button onClick={handleGenerateParagraphTypeTopic} disabled={isLoading || isRecording} isLoading={isLoading && !paragraphTypeTopic} className="mt-2">Generar Tema para este Tipo</Button>
                                {isLoading && !paragraphTypeTopic && <div className="my-4"><LoadingSpinner text="Generando tema..."/></div>}
                                {paragraphTypeTopic && <p className="text-neutral-700 text-xl italic mt-4 bg-amber-50 p-3 rounded-md">Tema: "{paragraphTypeTopic}"</p>}
                            </Card>
                        )}
                    </>
                )}

                {/* Shared Input Area */}
                {(mode === 'correction' && incorrectText) || (mode === 'paragraph_types' && paragraphTypeTopic) ? (
                    <Card className="mb-6">
                        <label htmlFor="user-text" className="block text-lg font-semibold text-neutral-700 mb-2">
                            {{ correction: 'Tu Versión Corregida', paragraph_types: 'Tu Párrafo' }[mode]!}
                        </label>
                        <div className="relative w-full">
                            <textarea id="user-text" rows={10} value={userText} onChange={(e) => setUserText(e.target.value)} className="w-full p-2 border border-neutral-300 rounded-md pr-12" disabled={isLoading || isRecording} />
                            <Button onClick={() => handleToggleRecording()} variant="outline" size="icon" className="absolute top-2 right-2 h-8 w-8" disabled={!recognitionRef.current || isRecording}>
                                {isRecording && !recordingTarget?.field ? <StopCircleIcon className="w-4 h-4 text-red-500" /> : <MicrophoneIcon className="w-4 h-4" />}
                            </Button>
                        </div>
                        {isRecording && !recordingTarget?.field && <p className="text-sm text-blue-600 animate-pulse mt-1">Escuchando...</p>}
                        <Button onClick={handleSubmit} disabled={isLoading || !userText.trim() || isRecording} isLoading={isLoading && (!!incorrectText || !!paragraphTypeTopic)} className="mt-4">Evaluar mi Texto</Button>
                    </Card>
                ) : null}

                {/* Shared Feedback Section */}
                {isLoading && feedback === null && <div className="my-6"><LoadingSpinner text="Analizando tu texto..." /></div>}
                {feedback && !isLoading && (
                    <Card className="border-l-4 border-green-500">
                        <h3 className="text-xl font-semibold text-neutral-800 mb-3 flex items-center"><CheckCircleIcon className="w-6 h-6 mr-2 text-green-600" />Análisis de tu Escritura</h3>
                        <div className="prose prose-sm max-w-none text-neutral-700">{formattedFeedback(feedback)}</div>
                        <p className="mt-4 text-xs text-neutral-500 italic">Esta evaluación es una guía para ayudarte a crecer como escritor. ¡Sigue practicando!</p>
                    </Card>
                )}
            </InteractiveModule>
        </PageWrapper>
    );
};

export default OrthographyPracticePage;
