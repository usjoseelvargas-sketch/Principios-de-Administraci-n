
import React, { useState, useCallback, useEffect, useRef } from 'react';
import PageWrapper from '../components/PageWrapper';
import InteractiveModule from '../components/InteractiveModule';
import { HRIcon, LightbulbIcon, XCircleIcon, MicrophoneIcon, StopCircleIcon } from '../constants';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useGeminiTextQuery } from '../hooks/useGeminiQuery';
import { SpeechRecognition } from '../types';


interface Dilemma {
    id: string;
    title: string;
    scenario: string;
}

const ethicalDilemmas: Dilemma[] = [
    {
        id: 'd1',
        title: 'Conflicto de Intereses',
        scenario: 'Eres gerente de compras y un proveedor te ofrece un viaje de lujo "sin compromiso" justo antes de una gran licitación. Sabes que este proveedor es competitivo, pero aceptar el viaje podría ser malinterpretado. ¿Cómo manejas esta situación?'
    },
    {
        id: 'd2',
        title: 'Privacidad del Empleado vs. Seguridad de la Empresa',
        scenario: 'Sospechas que un empleado está filtrando información confidencial a la competencia. Tienes la capacidad técnica de monitorear sus comunicaciones personales en dispositivos de la empresa. ¿Es ético hacerlo? ¿Qué pasos tomarías?'
    },
    {
        id: 'd3',
        title: 'Reducción de Personal con Impacto Social',
        scenario: 'Tu empresa necesita reducir costos urgentemente. La opción más rápida es despedir al 15% del personal, muchos de ellos con familias y antigüedad. ¿Qué factores éticos considerarías al tomar esta decisión y cómo la comunicarías?'
    }
];

const TalentManagementPage: React.FC = () => {
  const [currentDilemma, setCurrentDilemma] = useState<Dilemma | null>(null);
  const [userApproach, setUserApproach] = useState('');
  const { data: geminiCritique, error, isLoading, executeQuery, reset } = useGeminiTextQuery();
  
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
            setUserApproach(prev => prev ? `${prev} ${transcript}` : transcript);
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


  const handleGenerateDilemma = () => {
    if(isRecording) handleToggleRecording();
    reset();
    setUserApproach('');
    setSpeechError(null);
    const randomIndex = Math.floor(Math.random() * ethicalDilemmas.length);
    setCurrentDilemma(ethicalDilemmas[randomIndex]);
  };

  const handleSubmitApproach = useCallback(() => {
    if (!currentDilemma || !userApproach) return;
    const prompt = `
        Contexto: Un estudiante de administración está analizando un dilema ético en la gestión del talento.
        Dilema: "${currentDilemma.title}" - ${currentDilemma.scenario}
        Enfoque propuesto por el estudiante: "${userApproach}"

        Analiza el enfoque del estudiante. Considera:
        1. Identificación de los principios éticos en juego.
        2. Posibles consecuencias de su enfoque.
        3. Alternativas o consideraciones adicionales que podría haber omitido.
        Proporciona una crítica constructiva en 2-3 párrafos, fomentando la reflexión. No des 'la solución correcta', sino ayuda a pensar más profundamente.
    `;
    executeQuery(prompt, "Eres un consejero ético y profesor de administración, guiando a estudiantes en dilemas complejos.");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDilemma, userApproach, executeQuery]);

  // Set initial dilemma on mount
  React.useEffect(() => {
    handleGenerateDilemma();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <PageWrapper title="Gestión del Talento Humano y Colaboración" titleIcon={<HRIcon />}>
      <InteractiveModule
        title="Análisis de Dilemas Éticos en RRHH"
        icon={<LightbulbIcon className="w-6 h-6" />}
        initialInstructions="Analiza un dilema ético presentado por la IA, describe tu enfoque para resolverlo y recibe una crítica constructiva."
      >
        <Button onClick={handleGenerateDilemma} disabled={isLoading} className="mb-4">
            Presentar Nuevo Dilema Ético
        </Button>

        {currentDilemma && (
             <Card className="mb-6 border-l-4 border-purple-500">
                <h4 className="text-lg font-semibold text-neutral-800 mb-1">Dilema Ético: {currentDilemma.title}</h4>
                <p className="text-neutral-700">{currentDilemma.scenario}</p>
                <div className="mt-4">
                    <label htmlFor="dilemma-approach" className="block text-sm font-medium text-neutral-700 mb-1">
                        Tu Enfoque Propuesto:
                    </label>
                    <div className="relative w-full">
                        <textarea
                            id="dilemma-approach"
                            rows={5}
                            value={userApproach}
                            onChange={(e) => setUserApproach(e.target.value)}
                            className="w-full p-2 border border-neutral-300 rounded-md shadow-sm focus:ring-primary focus:border-primary pr-12"
                            placeholder="Describe cómo abordarías esta situación, considerando los aspectos éticos y prácticos..."
                            onPaste={(e) => e.preventDefault()}
                            disabled={isLoading || isRecording}
                        />
                         <Button
                            onClick={handleToggleRecording}
                            variant="outline"
                            size="sm"
                            className="absolute top-2 right-2 !p-2 h-8 w-8"
                            aria-label={isRecording ? 'Detener grabación' : 'Grabar respuesta por voz'}
                            disabled={!recognitionRef.current}
                        >
                            {isRecording ? <StopCircleIcon className="w-4 h-4 text-red-500" /> : <MicrophoneIcon className="w-4 h-4" />}
                        </Button>
                    </div>
                     {speechError && <p className="text-sm text-red-600 mt-1">{speechError}</p>}
                     {isRecording && <p className="text-sm text-blue-600 animate-pulse mt-1">Escuchando...</p>}
                </div>
                <Button onClick={handleSubmitApproach} disabled={isLoading || !userApproach} isLoading={isLoading} className="mt-3">
                    {isLoading ? 'Analizando Enfoque...' : 'Enviar Enfoque y Obtener Crítica'}
                </Button>
            </Card>
        )}

        {isLoading && !geminiCritique && <div className="my-6"><LoadingSpinner text="Procesando..."/></div> }

        {error && (
            <Card className="mb-6 bg-red-50 border-red-500">
                <div className="flex items-center text-red-700">
                    <XCircleIcon className="w-6 h-6 mr-2" />
                    <p><strong>Error:</strong> {error}</p>
                </div>
            </Card>
        )}

        {geminiCritique && !isLoading && (
            <Card className="border-l-4 border-teal-500">
                <h4 className="text-lg font-semibold text-neutral-800 mb-2">Crítica Constructiva de la IA:</h4>
                <p className="text-neutral-700 whitespace-pre-wrap">{geminiCritique}</p>
            </Card>
        )}

        <Card title="Próximamente y Módulos Relacionados" className="mt-8">
            <p className="text-neutral-600">
                Expande tus habilidades con estos temas:
            </p>
            <ul className="list-disc list-inside text-neutral-600 mt-2 space-y-2">
                 <li>
                    <a href="/#/skills-integration" className="text-primary hover:underline font-medium">
                        Integración de habilidades técnicas y blandas
                    </a>
                </li>
                <li>
                    <a href="/#/project-management" className="text-primary hover:underline font-medium">
                        Herramientas simuladas de gestión de tareas y proyectos
                    </a>
                </li>
                 <li>
                    <a href="/#/forums" className="text-primary hover:underline font-medium">
                        Foros de debate guiados por IA
                    </a>
                </li>
            </ul>
        </Card>
      </InteractiveModule>
    </PageWrapper>
  );
};

export default TalentManagementPage;
