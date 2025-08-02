
import React, { useState, useCallback, useEffect, useRef } from 'react';
import PageWrapper from '../components/PageWrapper';
import InteractiveModule from '../components/InteractiveModule';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Card from '../components/ui/Card';
import { ForumIcon, LightbulbIcon, XCircleIcon, MicrophoneIcon, StopCircleIcon } from '../constants';
import { useGeminiTextQuery } from '../hooks/useGeminiQuery';
import { DebateTopic, ChatMessage, SpeechRecognition } from '../types';
import { DEBATE_TOPICS } from '../constants';

const DiscussionForumPage: React.FC = () => {
    const [currentTopic, setCurrentTopic] = useState<DebateTopic | null>(DEBATE_TOPICS[0]);
    const [conversation, setConversation] = useState<ChatMessage[]>([]);
    const [userMessage, setUserMessage] = useState('');
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const {
        data: geminiResponse,
        error: geminiError,
        isLoading: isLoadingGemini,
        executeQuery: fetchGeminiResponse,
        reset: resetGemini,
    } = useGeminiTextQuery();
    
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const [isRecording, setIsRecording] = useState(false);
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
                setUserMessage(prev => prev ? `${prev} ${transcript}` : transcript);
                setSpeechError(null);
            };
            recognition.onerror = (event) => setSpeechError(`Error: ${event.error}. Por favor, escribe.`);
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

    const handleTopicChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const topicId = event.target.value;
        const newTopic = DEBATE_TOPICS.find(t => t.id === topicId) || null;
        setCurrentTopic(newTopic);
        resetConversation();
    };

    const resetConversation = () => {
        if (isRecording) handleToggleRecording();
        resetGemini();
        setConversation([]);
        setUserMessage('');
        setSpeechError(null);
    };

    const handleSendMessage = useCallback(async () => {
        if (!userMessage.trim() || !currentTopic) return;

        const newUserMessage: ChatMessage = { author: 'Tú', message: userMessage };
        const updatedConversation = [...conversation, newUserMessage];
        setConversation(updatedConversation);
        setUserMessage('');

        const conversationHistoryForPrompt = updatedConversation
            .map(msg => `${msg.author}: ${msg.message}`)
            .join('\n');

        const prompt = `
            Eres un participante en un foro de debate para estudiantes de administración. Tu tarea es adoptar una de las siguientes personalidades y responder al último mensaje del estudiante ("Tú").

            Tema del Debate: ${currentTopic.title}
            Descripción: ${currentTopic.description}

            Personalidades disponibles para la IA:
            ${currentTopic.aiPersonas.map(p => `- ${p.name}: ${p.stance}`).join('\n')}

            Historial de la Conversación:
            ${conversationHistoryForPrompt}

            Instrucciones para la IA:
            1.  Lee todo el historial para entender el contexto.
            2.  Elige la personalidad MÁS APROPIADA de la lista para responder al último mensaje del estudiante.
            3.  Tu respuesta debe ser CONCISA (1-3 frases, como en un foro real), EN CARÁCTER con la personalidad elegida, y debe DESAFIAR o AÑADIR una nueva perspectiva al argumento del estudiante.
            4.  **IMPORTANTE**: Comienza tu respuesta con el nombre de la personalidad que has elegido seguido de dos puntos. Ejemplo: "Ana, la defensora del trabajo flexible: [Tu mensaje aquí]".
        `;

        await fetchGeminiResponse(prompt, "Eres un participante en un foro de debate, actuando como una de varias personalidades definidas.");
    }, [userMessage, currentTopic, conversation, fetchGeminiResponse]);

    useEffect(() => {
        if (geminiResponse) {
            const separatorIndex = geminiResponse.indexOf(':');
            let author = 'IA Participante';
            let message = geminiResponse;

            if (separatorIndex > 0) {
                author = geminiResponse.substring(0, separatorIndex).trim();
                message = geminiResponse.substring(separatorIndex + 1).trim();
            }

            const newAiMessage: ChatMessage = { author, message };
            setConversation(prev => [...prev, newAiMessage]);
        }
    }, [geminiResponse]);

    useEffect(() => {
        // Scroll to bottom of chat container
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [conversation]);

    return (
        <PageWrapper title="Foros de Debate Guiados" titleIcon={<ForumIcon />} subtitle="Pon a prueba tus argumentos frente a diferentes perspectivas.">
            <InteractiveModule
                title="Mesa Redonda Virtual"
                icon={<LightbulbIcon className="w-6 h-6" />}
                initialInstructions="1. Elige un tema de debate. 2. Escribe tu postura inicial. 3. Responde a los contraargumentos de los 'participantes' de la IA para refinar tu punto de vista."
            >
                <div className="mb-6">
                    <label htmlFor="topic-select" className="block text-sm font-medium text-neutral-700 mb-1">
                        Selecciona un Tema de Debate:
                    </label>
                    <select
                        id="topic-select"
                        value={currentTopic?.id || ''}
                        onChange={handleTopicChange}
                        className="w-full p-2 border border-neutral-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                        disabled={isRecording || isLoadingGemini}
                    >
                        {DEBATE_TOPICS.map(topic => (
                            <option key={topic.id} value={topic.id}>{topic.title}</option>
                        ))}
                    </select>
                </div>

                {currentTopic && (
                    <Card className="mb-6 border-l-4 border-purple-500">
                        <h4 className="text-lg font-semibold text-neutral-800 mb-2">{currentTopic.title}</h4>
                        <p className="text-neutral-600 mb-3">{currentTopic.description}</p>
                        <details>
                            <summary className="cursor-pointer text-sm font-medium text-primary hover:underline">Ver participantes del debate</summary>
                            <ul className="list-disc list-inside mt-2 text-sm text-neutral-500 space-y-1">
                                {currentTopic.aiPersonas.map(p => (
                                    <li key={p.name}><strong>{p.name}:</strong> {p.stance}</li>
                                ))}
                            </ul>
                        </details>
                    </Card>
                )}

                <Card>
                    <div ref={chatContainerRef} className="h-80 overflow-y-auto p-4 bg-neutral-100 rounded-lg mb-4 space-y-4">
                        {conversation.length === 0 && (
                            <div className="flex justify-center items-center h-full">
                                <p className="text-neutral-500">El debate aún no ha comenzado. ¡Escribe tu primer mensaje!</p>
                            </div>
                        )}
                        {conversation.map((msg, index) => (
                            <div key={index} className={`flex ${msg.author === 'Tú' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-md p-3 rounded-lg ${msg.author === 'Tú' ? 'bg-primary text-white' : 'bg-white shadow-sm'}`}>
                                    <p className={`text-sm font-bold mb-1 ${msg.author === 'Tú' ? 'text-primary-light' : 'text-secondary'}`}>{msg.author}</p>
                                    <p className="text-sm">{msg.message}</p>
                                </div>
                            </div>
                        ))}
                         {isLoadingGemini && (
                            <div className="flex justify-start">
                               <div className="max-w-md p-3 rounded-lg bg-white shadow-sm">
                                    <p className="text-sm font-bold mb-1 text-secondary">Participante de IA</p>
                                    <LoadingSpinner size="sm" text="está escribiendo..." />
                               </div>
                            </div>
                        )}
                    </div>
                    
                    {geminiError && (
                         <div className="flex items-center text-red-700 bg-red-50 p-3 rounded-md mb-4">
                            <XCircleIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                            <p className="text-sm"><strong>Error:</strong> {geminiError}</p>
                        </div>
                    )}
                    {speechError && <p className="text-sm text-red-600 mb-2">{speechError}</p>}

                    <div className="flex gap-3">
                        <textarea
                            value={userMessage}
                            onChange={(e) => setUserMessage(e.target.value)}
                            onKeyPress={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                            className="flex-grow p-2 border border-neutral-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                            placeholder="Escribe tu argumento..."
                            onPaste={(e) => e.preventDefault()}
                            rows={2}
                            disabled={isLoadingGemini || isRecording}
                        />
                         <Button
                            onClick={handleToggleRecording}
                            variant="outline"
                            size="sm"
                            className="!p-2 h-10 w-10 flex-shrink-0"
                            aria-label={isRecording ? 'Detener grabación' : 'Grabar mensaje por voz'}
                            disabled={!recognitionRef.current || isLoadingGemini}
                        >
                            {isRecording ? <StopCircleIcon className="w-5 h-5 text-red-500" /> : <MicrophoneIcon className="w-5 h-5" />}
                        </Button>
                        <Button onClick={handleSendMessage} disabled={isLoadingGemini || isRecording || !userMessage.trim()}>
                            Enviar
                        </Button>
                    </div>
                </Card>

            </InteractiveModule>
        </PageWrapper>
    );
};

export default DiscussionForumPage;
