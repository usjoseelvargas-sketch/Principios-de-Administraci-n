
import React, { useState, useCallback, useEffect, useRef } from 'react';
import PageWrapper from '../components/PageWrapper';
import InteractiveModule from '../components/InteractiveModule';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Card from '../components/ui/Card';
import { PencilSquareIcon, LightbulbIcon, CheckCircleIcon, XCircleIcon, MicrophoneIcon, StopCircleIcon } from '../constants';
import { useGeminiTextQuery } from '../hooks/useGeminiQuery';
import { SpeechRecognition } from '../types';

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
  {
    id: 'narrative',
    name: 'Párrafo Narrativo',
    description: 'Cuenta una historia o una secuencia de eventos. Suelen seguir una cronología. La "introducción" puede ser el planteamiento de la situación, el "desarrollo" los eventos en orden temporal, y la "conclusión" el desenlace.',
    example: 'Ejemplo: "Era una tarde lluviosa cuando Ana decidió salir. Caminó por las calles vacías, observando cómo las gotas resbalaban por las ventanas de las casas. De repente, un pequeño gato maulló desde un callejón oscuro, y Ana supo que su tarde había tomado un giro inesperado."'
  },
  {
    id: 'descriptive',
    name: 'Párrafo Descriptivo',
    description: 'Se enfoca en describir personas, lugares, objetos o ideas para crear una imagen vívida en la mente del lector. Empiezan con una impresión general, seguida de detalles específicos.',
    example: 'Ejemplo: "El viejo caserón se alzaba imponente contra el cielo gris. Sus ventanas rotas parecían ojos vacíos, y la pintura descascarada revelaba décadas de abandono. Un aire frío y húmedo emanaba de su interior, invitando al misterio y al olvido."'
  },
  {
    id: 'argumentative',
    name: 'Párrafo Argumentativo',
    description: 'Presentan un punto de vista y buscan convencer al lector de su validez. Inician con la afirmación o tesis, la desarrollan con evidencias y concluyen reafirmando la tesis.',
    example: 'Ejemplo: "La educación a distancia es una herramienta indispensable en el mundo actual. Permite el acceso al conocimiento a personas con limitaciones geográficas o de tiempo... Por lo tanto, invertir en plataformas educativas virtuales es esencial para el progreso social."'
  },
  {
    id: 'comparison',
    name: 'Párrafo de Comparación/Contraste',
    description: 'Exploran similitudes y diferencias entre dos o más elementos. Pueden organizarse punto por punto (comparando una característica a la vez) o en bloque (describiendo un elemento y luego el otro).',
    example: 'Ejemplo: "Mientras que los libros impresos ofrecen la experiencia táctil y el aroma del papel, los libros electrónicos destacan por su portabilidad y capacidad de almacenamiento. Ambos formatos brindan acceso a la literatura, pero uno se enfoca en la tradición y el otro en la conveniencia tecnológica."'
  }
];

const OrthographyPracticePage: React.FC = () => {
    const [mode, setMode] = useState<PracticeMode>('creative');
    
    // Creative Mode State
    const [creativeTopic, setCreativeTopic] = useState<string | null>(null);
    const [creativeInputs, setCreativeInputs] = useState<StructuredInputs>({ topic: '', support: '', conclusion: '' });

    // Correction Mode State
    const [incorrectText, setIncorrectText] = useState<string | null>(null);
    const [originalCorrectText, setOriginalCorrectText] = useState<string | null>(null);
    const [parsingError, setParsingError] = useState<string | null>(null);

    // Structured Mode State
    const [structuredTopic, setStructuredTopic] = useState<string | null>(null);
    const [structuredInputs, setStructuredInputs] = useState<StructuredInputs>({ topic: '', support: '', conclusion: '' });
    
    // Paragraph Types Mode State
    const [selectedParagraphType, setSelectedParagraphType] = useState<ParagraphType | null>(null);
    const [paragraphTypeTopic, setParagraphTypeTopic] = useState<string | null>(null);
    
    // Shared State
    const [userText, setUserText] = useState(''); // For correction and paragraph_types modes
    
    // Gemini Hooks
    const { data: topicData, error: topicError, isLoading: isLoadingTopic, executeQuery: fetchTopic, reset: resetTopic } = useGeminiTextQuery();
    const { data: textToCorrectData, error: textToCorrectError, isLoading: isLoadingTextToCorrect, executeQuery: fetchTextToCorrect, reset: resetTextToCorrect } = useGeminiTextQuery();
    const { data: structuredTopicData, error: structuredTopicError, isLoading: isLoadingStructuredTopic, executeQuery: fetchStructuredTopic, reset: resetStructuredTopic } = useGeminiTextQuery();
    const { data: paragraphTypeTopicData, error: paragraphTypeTopicError, isLoading: isLoadingParagraphTypeTopic, executeQuery: fetchParagraphTypeTopic, reset: resetParagraphTypeTopic } = useGeminiTextQuery();
    const { data: feedbackData, error: feedbackError, isLoading: isLoadingFeedback, executeQuery: fetchFeedback, reset: resetFeedback } = useGeminiTextQuery();

    // Speech Recognition State
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const [recordingTarget, setRecordingTarget] = useState<{ mode: PracticeMode, field?: keyof StructuredInputs } | null>(null);
    const [speechError, setSpeechError] = useState<string | null>(null);
    const isRecording = !!recordingTarget;

    // --- Speech Recognition Logic ---
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
            recognition.onerror = (event) => setSpeechError(`Error de reconocimiento: ${event.error}. Por favor, escribe tu respuesta.`);
            recognition.onend = () => {
                setRecordingTarget(null);
            };
        }
        return () => recognitionRef.current?.stop();
    }, [recordingTarget]);

    const handleToggleRecording = (field?: keyof StructuredInputs) => {
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
    };
    
    // --- Mode and Content Generation ---
    const resetAllState = useCallback(() => {
        resetTopic();
        resetTextToCorrect();
        resetStructuredTopic();
        resetParagraphTypeTopic();
        resetFeedback();
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
        setParsingError(null);
        if (isRecording) recognitionRef.current?.stop();
    }, [isRecording, resetFeedback, resetParagraphTypeTopic, resetStructuredTopic, resetTextToCorrect, resetTopic]);

    const handleModeChange = (newMode: PracticeMode) => {
        setMode(newMode);
        resetAllState();
    };
    
    // Content Generators
    const handleGenerateCreativeTopic = useCallback(() => {
        resetAllState();
        fetchTopic("Genera un único tema de escritura creativo y abierto para un estudiante de habla hispana. El tema debe invitar a la redacción de uno o dos párrafos. Proporciona solo el tema, sin adornos.", "Eres un asistente creativo que genera ideas para escribir.");
    }, [resetAllState, fetchTopic]);

    const handleGenerateCorrectionText = useCallback(() => {
        resetAllState();
        const prompt = `Genera un párrafo corto en español (de 3 a 5 frases) sobre un tema de interés general. Debes introducir intencionadamente de 3 a 4 errores comunes de ortografía y puntuación en español (omisión de tildes, uso incorrecto de b/v, c/s/z, comas mal puestas).
Formato de respuesta OBLIGATORIO:
[Párrafo con errores]
---
[Párrafo corregido]`;
        fetchTextToCorrect(prompt, "Eres un generador de ejercicios de corrección de textos en español.");
    }, [resetAllState, fetchTextToCorrect]);

    const handleGenerateStructuredTopic = useCallback(() => {
        resetAllState();
        fetchStructuredTopic("Genera un tema o una pregunta simple para que un estudiante escriba un párrafo estructurado (oración temática, apoyo, cierre). Ejemplo: 'Los beneficios de hacer ejercicio' o 'Describe tu estación del año favorita'. Proporciona solo el tema.", "Eres un generador de temas de escritura.");
    }, [resetAllState, fetchStructuredTopic]);
    
    const handleGenerateParagraphTypeTopic = useCallback(() => {
        if (!selectedParagraphType) return;
        setParagraphTypeTopic(null);
        resetFeedback();
        const prompt = `Genera un tema de escritura específico para un párrafo de tipo "${selectedParagraphType.name}". El tema debe ser conciso e inspirador. Proporciona solo el tema.`;
        fetchParagraphTypeTopic(prompt, "Eres un generador de temas de escritura clasificados por tipo.");
    }, [selectedParagraphType, fetchParagraphTypeTopic, resetFeedback]);


    // Data Processing Effects
    useEffect(() => { if (topicData) setCreativeTopic(topicData) }, [topicData]);
    useEffect(() => { if (structuredTopicData) setStructuredTopic(structuredTopicData) }, [structuredTopicData]);
    useEffect(() => { if (paragraphTypeTopicData) setParagraphTypeTopic(paragraphTypeTopicData) }, [paragraphTypeTopicData]);
    useEffect(() => {
        if (textToCorrectData) {
            const parts = textToCorrectData.split('\n---\n');
            if (parts.length === 2) {
                setIncorrectText(parts[0].trim());
                setOriginalCorrectText(parts[1].trim());
                setParsingError(null);
            } else {
                setParsingError("La IA no generó el texto en el formato esperado. Intenta de nuevo.");
            }
        }
    }, [textToCorrectData]);
    
    // --- Submission Logic ---
    const handleSubmit = useCallback(() => {
        resetFeedback();
        if (mode === 'creative' && creativeTopic && Object.values(creativeInputs).every(v => v.trim())) {
            const prompt = `Evalúa el siguiente párrafo creativo estructurado del estudiante sobre el tema "${creativeTopic}".\nOración Temática: "${creativeInputs.topic}"\nOraciones de Apoyo: "${creativeInputs.support}"\nOración de Cierre: "${creativeInputs.conclusion}"\nAnaliza: ### Creatividad y Relevancia al Tema\n### Cohesión y Fluidez de la Estructura\n### Ortografía y Puntuación\n### Resumen General y Ánimo`;
            fetchFeedback(prompt, "Eres un profesor de español y coach de escritura creativa.");
        } else if (mode === 'correction' && incorrectText && originalCorrectText && userText.trim()) {
            const prompt = `Texto Original con Errores: \`\`\`${incorrectText}\`\`\`\nVersión Correcta: \`\`\`${originalCorrectText}\`\`\`\nCorrección del Estudiante: \`\`\`${userText}\`\`\`\nEvalúa la corrección del estudiante usando estos encabezados: ### Aciertos\n### Errores Omitidos\n### Nuevos Errores Introducidos\n### Resumen y Recomendación`;
            fetchFeedback(prompt, "Eres un profesor de español evaluando la corrección de un texto.");
        } else if (mode === 'structured' && structuredTopic && Object.values(structuredInputs).every(v => v.trim())) {
             const prompt = `Un estudiante debe escribir un párrafo estructurado sobre "${structuredTopic}".\nOración Temática: "${structuredInputs.topic}"\nOraciones de Apoyo: "${structuredInputs.support}"\nOración de Cierre: "${structuredInputs.conclusion}"\nEvalúa la cohesión, lógica y claridad de cada parte y del párrafo en conjunto, usando estos encabezados: ### Evaluación de la Oración Temática\n### Evaluación de las Oraciones de Apoyo\n### Evaluación de la Oración de Cierre\n### Cohesión y Fluidez General`;
             fetchFeedback(prompt, "Eres un profesor de escritura que analiza la estructura de párrafos.");
        } else if (mode === 'paragraph_types' && selectedParagraphType && paragraphTypeTopic && userText.trim()) {
            const prompt = `El estudiante debía escribir un párrafo de tipo "${selectedParagraphType.name}" sobre el tema "${paragraphTypeTopic}".\nDescripción del tipo de párrafo: "${selectedParagraphType.description}"\nPárrafo del estudiante: "${userText}"\nEvalúa si el párrafo cumple con las características del tipo solicitado, la estructura, y la corrección gramatical, usando estos encabezados: ### Evaluación del Tipo de Párrafo\n### Estructura y Cohesión\n### Ortografía y Gramática\n### Sugerencia para Mejorar`;
            fetchFeedback(prompt, "Eres un experto profesor de escritura y composición.");
        }
    }, [resetFeedback, mode, creativeTopic, userText, incorrectText, originalCorrectText, structuredTopic, structuredInputs, selectedParagraphType, paragraphTypeTopic, fetchFeedback, creativeInputs]);
    
    // --- Rendering Logic ---
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
                    { {creative: 'Escritura Creativa', correction: 'Corrección de Texto', structured: 'Párrafo Estructurado', paragraph_types: 'Tipos de Párrafo'}[m] }
                </button>
            ))}
        </div>
    );

    return (
        <PageWrapper title="Práctica de Ortografía y Gramática" titleIcon={<PencilSquareIcon />} subtitle="Perfecciona tu escritura con análisis detallado de la IA.">
            <InteractiveModule title="Laboratorio de Escritura" icon={<LightbulbIcon className="w-6 h-6" />}>
                {renderModeTabs()}

                {/* --- CREATIVE MODE UI --- */}
                {mode === 'creative' && <>
                    <Button onClick={handleGenerateCreativeTopic} disabled={isLoadingTopic || isRecording} isLoading={isLoadingTopic} className="mb-6">Generar Nuevo Tema</Button>
                    {topicError && <Card className="mb-6 bg-red-50 border-red-500"><div className="flex items-center text-red-700"><XCircleIcon className="w-6 h-6 mr-2" /><p><strong>Error:</strong> {topicError}</p></div></Card>}
                    {isLoadingTopic && <div className="my-6"><LoadingSpinner text="Buscando inspiración..."/></div>}
                    {creativeTopic && <Card className="mb-6 border-l-4 border-amber-500"><h4 className="text-lg font-semibold text-neutral-800 mb-2">Tema:</h4><p className="text-neutral-700 text-xl italic">"{creativeTopic}"</p></Card>}
                    {creativeTopic && (
                        <Card className="mb-6">
                            <h3 className="text-lg font-semibold text-neutral-800 mb-3">Estructura tu Párrafo Creativo</h3>
                            <div className="space-y-4">
                                {(Object.keys(creativeInputs) as Array<keyof StructuredInputs>).map(key => (
                                    <div key={key}>
                                        <label className="block text-md font-semibold text-neutral-700 mb-1 capitalize">{ {topic: 'Oración Temática', support: 'Oraciones de Apoyo', conclusion: 'Oración de Cierre'}[key] }</label>
                                        <div className="relative w-full">
                                            <textarea
                                                rows={key === 'support' ? 4 : 2}
                                                value={creativeInputs[key]}
                                                onChange={(e) => setCreativeInputs(prev => ({...prev, [key]: e.target.value}))}
                                                className="w-full p-2 border border-neutral-300 rounded-md pr-12"
                                                onPaste={(e) => e.preventDefault()}
                                                disabled={isLoadingFeedback || isRecording}
                                            />
                                            <Button
                                                onClick={() => handleToggleRecording(key)}
                                                variant="outline" size="sm" className="absolute top-2 right-2 !p-2 h-8 w-8"
                                                disabled={!recognitionRef.current || (isRecording && recordingTarget?.field !== key)}
                                            >
                                                {isRecording && recordingTarget?.mode === 'creative' && recordingTarget?.field === key ? <StopCircleIcon className="w-4 h-4 text-red-500"/> : <MicrophoneIcon className="w-4 h-4"/>}
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {speechError && <p className="text-sm text-red-600 mt-1">{speechError}</p>}
                            {isRecording && recordingTarget?.mode === 'creative' && <p className="text-sm text-blue-600 animate-pulse mt-1">Escuchando para el campo '{ {topic: 'Oración Temática', support: 'Oraciones de Apoyo', conclusion: 'Oración de Cierre'}[recordingTarget.field!] }'...</p>}
                            <Button onClick={handleSubmit} disabled={isLoadingFeedback || !Object.values(creativeInputs).every(v => v.trim()) || isRecording} isLoading={isLoadingFeedback} className="mt-4">Evaluar Párrafo Creativo</Button>
                        </Card>
                    )}
                </>}

                {/* --- CORRECTION MODE UI --- */}
                {mode === 'correction' && <>
                    <Button onClick={handleGenerateCorrectionText} disabled={isLoadingTextToCorrect || isRecording} isLoading={isLoadingTextToCorrect} className="mb-6">Generar Texto para Corregir</Button>
                    {(textToCorrectError || parsingError) && <Card className="mb-6 bg-red-50 border-red-500"><div className="flex items-center text-red-700"><XCircleIcon className="w-6 h-6 mr-2" /><p><strong>Error:</strong> {textToCorrectError || parsingError}</p></div></Card>}
                    {isLoadingTextToCorrect && <div className="my-6"><LoadingSpinner text="Preparando ejercicio..."/></div>}
                    {incorrectText && <Card className="mb-6 border-l-4 border-amber-500"><h4 className="text-lg font-semibold text-neutral-800 mb-2">Texto a Corregir:</h4><p className="text-neutral-700 bg-amber-50 p-3 rounded-md italic">"{incorrectText}"</p></Card>}
                </>}
                
                {/* --- STRUCTURED PARAGRAPH MODE UI --- */}
                {mode === 'structured' && <>
                    <Button onClick={handleGenerateStructuredTopic} disabled={isLoadingStructuredTopic || isRecording} isLoading={isLoadingStructuredTopic} className="mb-6">Generar Tema</Button>
                    {structuredTopicError && <Card className="mb-6 bg-red-50 border-red-500"><div className="flex items-center text-red-700"><XCircleIcon className="w-6 h-6 mr-2" /><p><strong>Error:</strong> {structuredTopicError}</p></div></Card>}
                    {isLoadingStructuredTopic && <div className="my-6"><LoadingSpinner text="Generando tema..."/></div>}
                    {structuredTopic && <Card className="mb-6 border-l-4 border-amber-500"><h4 className="text-lg font-semibold text-neutral-800 mb-2">Tema:</h4><p className="text-neutral-700 text-xl italic">"{structuredTopic}"</p></Card>}
                    {structuredTopic && <Card className="mb-6 space-y-4">
                        {(Object.keys(structuredInputs) as Array<keyof StructuredInputs>).map(key => (
                            <div key={key}>
                                <label className="block text-md font-semibold text-neutral-700 mb-1 capitalize">{ {topic: 'Oración Temática', support: 'Oraciones de Apoyo', conclusion: 'Oración de Cierre'}[key] }</label>
                                <div className="relative w-full">
                                    <textarea rows={key === 'support' ? 4 : 2} value={structuredInputs[key]} onChange={(e) => setStructuredInputs(prev => ({...prev, [key]: e.target.value}))} className="w-full p-2 border border-neutral-300 rounded-md pr-12" onPaste={(e) => e.preventDefault()} disabled={isLoadingFeedback || isRecording} />
                                    <Button onClick={() => handleToggleRecording(key)} variant="outline" size="sm" className="absolute top-2 right-2 !p-2 h-8 w-8" disabled={!recognitionRef.current || (isRecording && recordingTarget?.field !== key)}>{isRecording && recordingTarget?.mode === 'structured' && recordingTarget?.field === key ? <StopCircleIcon className="w-4 h-4 text-red-500"/> : <MicrophoneIcon className="w-4 h-4"/>}</Button>
                                </div>
                            </div>
                        ))}
                        {speechError && <p className="text-sm text-red-600 mt-1">{speechError}</p>}
                        {isRecording && recordingTarget?.mode === 'structured' && <p className="text-sm text-blue-600 animate-pulse mt-1">Escuchando para el campo '{ {topic: 'Oración Temática', support: 'Oraciones de Apoyo', conclusion: 'Oración de Cierre'}[recordingTarget.field!] }'...</p>}
                        <Button onClick={handleSubmit} disabled={isLoadingFeedback || !Object.values(structuredInputs).every(v => v.trim()) || isRecording} isLoading={isLoadingFeedback} className="mt-4">Evaluar Párrafo</Button>
                    </Card>}
                </>}

                 {/* --- PARAGRAPH TYPES MODE UI --- */}
                {mode === 'paragraph_types' && <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {PARAGRAPH_TYPES.map(type => (
                            <button key={type.id} onClick={() => { setSelectedParagraphType(type); setParagraphTypeTopic(null); resetFeedback(); }} className={`p-4 rounded-lg text-left transition-all duration-200 border-2 ${selectedParagraphType?.id === type.id ? 'bg-primary-light border-primary shadow-lg' : 'bg-white border-transparent hover:border-primary'}`}>
                                <h4 className="font-bold text-primary">{type.name}</h4>
                                <p className="text-sm text-neutral-600">{type.description}</p>
                            </button>
                        ))}
                    </div>
                    {selectedParagraphType && <Card className="mb-6 border-l-4 border-amber-500">
                        <h3 className="font-bold text-lg text-neutral-800">Práctica de {selectedParagraphType.name}</h3>
                        <p className="text-sm text-neutral-600 my-2">{selectedParagraphType.example}</p>
                        <Button onClick={handleGenerateParagraphTypeTopic} disabled={isLoadingParagraphTypeTopic || isRecording} isLoading={isLoadingParagraphTypeTopic} className="mt-2">Generar Tema para este Tipo</Button>
                         {paragraphTypeTopicError && <div className="text-red-600 mt-2">{paragraphTypeTopicError}</div>}
                         {isLoadingParagraphTypeTopic && <div className="my-4"><LoadingSpinner text="Generando tema..."/></div>}
                         {paragraphTypeTopic && <p className="text-neutral-700 text-xl italic mt-4 bg-amber-50 p-3 rounded-md">Tema: "{paragraphTypeTopic}"</p>}
                    </Card>}
                </>}

                {/* --- SHARED USER INPUT (for correction, paragraph_types) --- */}
                {(mode === 'correction' || mode === 'paragraph_types') && (incorrectText || (selectedParagraphType && paragraphTypeTopic)) && (
                     <Card className="mb-6">
                        <label htmlFor="user-text" className="block text-lg font-semibold text-neutral-700 mb-2">
                            { {correction: 'Tu Versión Corregida', paragraph_types: 'Tu Párrafo'}[mode]! }
                        </label>
                        <div className="relative w-full">
                            <textarea id="user-text" rows={10} value={userText} onChange={(e) => setUserText(e.target.value)} className="w-full p-2 border border-neutral-300 rounded-md pr-12" onPaste={(e) => e.preventDefault()} disabled={isLoadingFeedback || isRecording} />
                            <Button onClick={() => handleToggleRecording()} variant="outline" size="sm" className="absolute top-2 right-2 !p-2 h-8 w-8" disabled={!recognitionRef.current || isRecording}>
                                {isRecording && recordingTarget?.mode === mode ? <StopCircleIcon className="w-4 h-4 text-red-500"/> : <MicrophoneIcon className="w-4 h-4"/>}
                            </Button>
                        </div>
                        {speechError && <p className="text-sm text-red-600 mt-1">{speechError}</p>}
                        {isRecording && recordingTarget?.mode === mode && <p className="text-sm text-blue-600 animate-pulse mt-1">Escuchando...</p>}
                        <Button onClick={handleSubmit} disabled={isLoadingFeedback || !userText.trim() || isRecording} isLoading={isLoadingFeedback} className="mt-4">Evaluar mi Texto</Button>
                    </Card>
                )}

                {/* --- SHARED FEEDBACK SECTION --- */}
                {isLoadingFeedback && <div className="my-6"><LoadingSpinner text="Analizando tu texto..." /></div>}
                {feedbackError && <Card className="my-6 bg-red-50 border-red-500"><div className="flex items-center text-red-700"><XCircleIcon className="w-6 h-6 mr-2" /><p><strong>Error:</strong> {feedbackError}</p></div></Card>}
                {feedbackData && !isLoadingFeedback && (
                    <Card className="border-l-4 border-green-500">
                        <h3 className="text-xl font-semibold text-neutral-800 mb-3 flex items-center"><CheckCircleIcon className="w-6 h-6 mr-2 text-green-600" />Análisis de tu Escritura</h3>
                        <div className="prose prose-sm max-w-none text-neutral-700">{formattedFeedback(feedbackData)}</div>
                        <p className="mt-4 text-xs text-neutral-500 italic">Esta evaluación es una guía para ayudarte a crecer como escritor. ¡Sigue practicando!</p>
                    </Card>
                )}
            </InteractiveModule>
        </PageWrapper>
    );
};

export default OrthographyPracticePage;
