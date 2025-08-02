
import React, { useState, useCallback, useEffect, useRef } from 'react';
import PageWrapper from '../components/PageWrapper';
import InteractiveModule from '../components/InteractiveModule';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import { StrategyIcon, LightbulbIcon, XCircleIcon, MicrophoneIcon, StopCircleIcon, CheckCircleIcon } from '../constants';
import { useGeminiJsonQuery, useGeminiTextQuery } from '../hooks/useGeminiQuery';
import { SpeechRecognition } from '../types';

interface Principle {
  id: string;
  name: string;
  shortDescription: string;
  category?: string;
}

interface PrincipleDetails {
    explanation: string;
    example: string;
    caseStudy: string;
    question: string;
}

const modernPrinciples: Principle[] = [
  { id: 'p1', name: 'Planificación Estratégica', shortDescription: 'Definir metas a largo plazo y trazar el camino para alcanzarlas.', category: 'Principios de Administración Moderna' },
  { id: 'p2', name: 'Enfoque en el Cliente (General)', shortDescription: 'Entender y satisfacer las necesidades y expectativas de los clientes.', category: 'Principios de Administración Moderna' },
  { id: 'p3', name: 'Optimización de Procesos', shortDescription: 'Mejorar continuamente la eficiencia y efectividad de las operaciones.', category: 'Principios de Administración Moderna' },
  { id: 'p4', name: 'Toma de Decisiones Informada', shortDescription: 'Basar las decisiones en datos y análisis rigurosos.', category: 'Principios de Administración Moderna' },
  { id: 'p5', name: 'Adaptación al Cambio', shortDescription: 'Ser flexible y receptivo a los cambios del entorno.', category: 'Principios de Administración Moderna' },
  { id: 'p6', name: 'Sostenibilidad a Largo Plazo', shortDescription: 'Considerar el impacto social, ambiental y económico de las acciones.', category: 'Principios de Administración Moderna' },
  { id: 'p7', name: 'Liderazgo (General)', shortDescription: 'Guiar a la organización a través de la complejidad y la incertidumbre.', category: 'Principios de Administración Moderna' },
  { id: 'iso1', name: 'Enfoque al Cliente (ISO 9000)', shortDescription: 'El foco principal de la gestión de la calidad es cumplir los requisitos del cliente y tratar de exceder sus expectativas.', category: 'Principios de Gestión de Calidad ISO 9000:2015' },
  { id: 'iso2', name: 'Liderazgo (ISO 9000)', shortDescription: 'Los líderes en todos los niveles establecen la unidad de propósito y la dirección, y crean condiciones en las que las personas se implican en el logro de los objetivos de la calidad de la organización.', category: 'Principios de Gestión de Calidad ISO 9000:2015' },
  { id: 'iso3', name: 'Compromiso de las Personas', shortDescription: 'Las personas competentes, empoderadas y comprometidas en todos los niveles de la organización son esenciales para aumentar la capacidad de la organización para crear y proporcionar valor.', category: 'Principios de Gestión de Calidad ISO 9000:2015' },
  { id: 'iso4', name: 'Enfoque a Procesos', shortDescription: 'Se alcanzan resultados coherentes y previsibles de manera más eficaz y eficiente cuando las actividades se entienden y gestionan como procesos interrelacionados que funcionan como un sistema coherente.', category: 'Principios de Gestión de Calidad ISO 9000:2015' },
  { id: 'iso5', name: 'Mejora', shortDescription: 'Las organizaciones con éxito tienen un enfoque continuo hacia la mejora.', category: 'Principios de Gestión de Calidad ISO 9000:2015' },
  { id: 'iso6', name: 'Toma de Decisiones Basada en la Evidencia', shortDescription: 'Las decisiones basadas en el análisis y la evaluación de datos e información tienen mayor probabilidad de producir los resultados deseados.', category: 'Principios de Gestión de Calidad ISO 9000:2015' },
  { id: 'iso7', name: 'Gestión de las Relaciones', shortDescription: 'Para el éxito sostenido, las organizaciones gestionan sus relaciones con las partes interesadas pertinentes, tales como los proveedores.', category: 'Principios de Gestión de Calidad ISO 9000:2015' },
];

const groupPrinciplesByCategory = (principles: Principle[]) => {
  return principles.reduce((acc, principle) => {
    const category = principle.category || 'Otros Principios';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(principle);
    return acc;
  }, {} as Record<string, Principle[]>);
};


const StrategicPrinciplesPage: React.FC = () => {
    const [selectedPrinciple, setSelectedPrinciple] = useState<Principle | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userResponse, setUserResponse] = useState('');

    const { 
        data: principleDetails, 
        error: detailsError, 
        isLoading: isLoadingDetails, 
        executeQuery: fetchPrincipleDetails,
        reset: resetDetails 
    } = useGeminiJsonQuery<PrincipleDetails>();

    const { 
        data: feedback, 
        error: feedbackError, 
        isLoading: isLoadingFeedback, 
        executeQuery: fetchFeedback,
        reset: resetFeedback
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
                setUserResponse(prev => prev ? `${prev} ${transcript}` : transcript);
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

    const handleCloseModal = () => {
        setIsModalOpen(false);
        if (isRecording) {
            recognitionRef.current?.stop();
        }
    };

    const handleExplorePrinciple = useCallback((principle: Principle) => {
        setSelectedPrinciple(principle);
        setIsModalOpen(true);
        resetDetails();
        resetFeedback();
        setUserResponse('');
        setSpeechError(null);

        const prompt = `
          Genera contenido educativo interactivo para el principio de administración: "${principle.name}".
          La respuesta DEBE ser un objeto JSON válido con la siguiente estructura y nada más:
          {
            "explanation": "Una explicación detallada (2-3 párrafos) del principio.",
            "example": "Un ejemplo práctico claro de una empresa conocida o un escenario hipotético.",
            "caseStudy": "Un mini-caso de estudio conciso (1 párrafo) donde este principio podría ser aplicado.",
            "question": "Una pregunta específica y abierta dirigida al estudiante, pidiéndole que sugiera una acción concreta basada en el principio y el mini-caso."
          }
          Si el principio es de ISO 9000, contextualízalo dentro de un sistema de gestión de calidad.
          Asegúrate de que el JSON es válido.
        `;
        fetchPrincipleDetails(prompt, "Eres un experto en administración y creador de contenido educativo.");
    }, [fetchPrincipleDetails, resetDetails, resetFeedback]);
    
    const handleSubmitResponse = useCallback(() => {
        if (!selectedPrinciple || !principleDetails || !userResponse) return;
        
        resetFeedback();

        const prompt = `
            Un estudiante está aplicando el principio de "${selectedPrinciple.name}" a un caso de estudio.
            Principio: ${principleDetails.explanation}
            Caso de estudio: "${principleDetails.caseStudy}"
            Pregunta que se le hizo: "${principleDetails.question}"
            Respuesta del estudiante: "${userResponse}"

            Evalúa la respuesta del estudiante. Considera:
            1. ¿Aplicó correctamente el principio para la planeación estratégica?
            2. ¿Su propuesta es concreta y relevante para el caso?
            3. ¿La solución es viable y específica?
            Proporciona una retroalimentación constructiva y concisa (2 párrafos) que guíe al estudiante, destacando aciertos y puntos a mejorar. No des la solución, guía su pensamiento.
        `;
        fetchFeedback(prompt, "Eres un coach de negocios y profesor, evaluando la aplicación práctica de principios de gestión.");

    }, [selectedPrinciple, principleDetails, userResponse, fetchFeedback, resetFeedback]);


  const groupedPrinciples = groupPrinciplesByCategory(modernPrinciples);

  return (
    <PageWrapper title="Principios Estratégicos y de Calidad" titleIcon={<StrategyIcon />}>
      <InteractiveModule
        title="Laboratorio de Aplicación de Principios"
        icon={<LightbulbIcon className="w-6 h-6" />}
        initialInstructions="Selecciona un principio, analiza el caso de estudio propuesto por la IA y aplica tus conocimientos para resolverlo. Recibirás feedback sobre tu propuesta."
      >
        {Object.entries(groupedPrinciples).map(([category, principles]) => (
          <div key={category} className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-700 mb-4 pb-2 border-b border-neutral-300">{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {principles.map(principle => (
                <Card key={principle.id} className="hover:shadow-lg transition-shadow flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-primary mb-2">{principle.name}</h3>
                    <p className="text-sm text-neutral-600 mb-4 flex-grow">{principle.shortDescription}</p>
                  </div>
                  <Button 
                    onClick={() => handleExplorePrinciple(principle)} 
                    variant="outline" 
                    size="sm"
                    className="mt-auto"
                  >
                    Explorar y Aplicar
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </InteractiveModule>

      {selectedPrinciple && (
        <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={selectedPrinciple.name} size="xl">
            <div className="overflow-y-auto max-h-[75vh] p-1">
                {isLoadingDetails && <div className="py-10"><LoadingSpinner text="Generando lección interactiva..."/></div>}
                
                {detailsError && (
                    <Card className="my-4 bg-red-50 border-red-500">
                        <div className="flex items-center text-red-700">
                            <XCircleIcon className="w-6 h-6 mr-2" />
                            <p><strong>Error:</strong> {detailsError}</p>
                        </div>
                    </Card>
                )}
                
                {principleDetails && !isLoadingDetails && (
                    <div className="space-y-4">
                        <Card title="Explicación Detallada" className="bg-neutral-50">
                             <p className="text-neutral-700 whitespace-pre-wrap">{principleDetails.explanation}</p>
                        </Card>
                         <Card title="Ejemplo Práctico" className="bg-neutral-50">
                             <p className="text-neutral-700 whitespace-pre-wrap">{principleDetails.example}</p>
                        </Card>
                        <Card title="Mini-Caso de Estudio" className="border-l-4 border-secondary">
                             <p className="font-semibold text-neutral-700 mb-2">{principleDetails.caseStudy}</p>
                             <p className="font-bold text-primary mt-4">{principleDetails.question}</p>
                        </Card>

                        {/* User Response Section */}
                        <Card>
                            <label htmlFor="user-response" className="block text-md font-semibold text-neutral-700 mb-2">Tu Propuesta</label>
                            <div className="relative w-full">
                                <textarea
                                    id="user-response"
                                    rows={5}
                                    value={userResponse}
                                    onChange={(e) => setUserResponse(e.target.value)}
                                    className="w-full p-2 border border-neutral-300 rounded-md shadow-sm focus:ring-primary focus:border-primary pr-12"
                                    placeholder="Basado en el principio, describe aquí tu acción o solución concreta..."
                                    onPaste={(e) => e.preventDefault()}
                                    disabled={isLoadingFeedback || isRecording}
                                />
                                <Button
                                    onClick={handleToggleRecording}
                                    variant="outline"
                                    size="sm"
                                    className="absolute top-2 right-2 !p-2 h-8 w-8"
                                    aria-label={isRecording ? 'Detener grabación' : 'Grabar respuesta por voz'}
                                    disabled={!recognitionRef.current || isLoadingFeedback}
                                >
                                    {isRecording ? <StopCircleIcon className="w-4 h-4 text-red-500" /> : <MicrophoneIcon className="w-4 h-4" />}
                                </Button>
                            </div>
                            {speechError && <p className="text-sm text-red-600 mt-1">{speechError}</p>}
                            {isRecording && <p className="text-sm text-blue-600 animate-pulse mt-1">Escuchando...</p>}
                            <Button onClick={handleSubmitResponse} disabled={isLoadingFeedback || !userResponse.trim() || isRecording} isLoading={isLoadingFeedback} className="mt-4">
                                {isLoadingFeedback ? 'Analizando...' : 'Enviar Propuesta y Recibir Feedback'}
                            </Button>
                        </Card>
                        
                        {/* Feedback Section */}
                        {isLoadingFeedback && <div className="py-6"><LoadingSpinner text="Generando retroalimentación..."/></div>}
                        
                        {feedbackError && (
                            <Card className="my-4 bg-red-50 border-red-500">
                                <div className="flex items-center text-red-700">
                                    <XCircleIcon className="w-6 h-6 mr-2" />
                                    <p><strong>Error de Feedback:</strong> {feedbackError}</p>
                                </div>
                            </Card>
                        )}

                        {feedback && !isLoadingFeedback && (
                            <Card className="border-l-4 border-green-500">
                                <h4 className="text-lg font-semibold text-neutral-800 mb-2 flex items-center">
                                    <CheckCircleIcon className="w-6 h-6 mr-2 text-green-600" />
                                    Retroalimentación
                                </h4>
                                <p className="text-neutral-700 whitespace-pre-wrap">{feedback}</p>
                            </Card>
                        )}
                    </div>
                )}
                 <Button onClick={handleCloseModal} variant="primary" className="mt-6 w-full">
                    Cerrar
                </Button>
            </div>
        </Modal>
      )}
    </PageWrapper>
  );
};

export default StrategicPrinciplesPage;
