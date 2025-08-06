import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { generateContent } from '../services/geminiService'; // CAMBIO: Importamos nuestro servicio

// Componentes y Constantes
import PageWrapper from '../components/PageWrapper';
import InteractiveModule from '../components/InteractiveModule';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Card from '../components/ui/Card';
import { ProjectManagementIcon, LightbulbIcon, CheckCircleIcon, XCircleIcon, MicrophoneIcon, StopCircleIcon } from '../constants';
import { ProjectSimulation, ProjectTask, SpeechRecognition } from '../types';
import { PROJECT_SIMULATIONS } from '../constants';

// --- TIPOS Y COMPONENTES LOCALES ---
type TaskStatus = 'Por Hacer' | 'En Progreso' | 'Hecho';
type Statuses = Record<string, TaskStatus>;

const TaskCard: React.FC<{ task: ProjectTask; status: TaskStatus; onStatusChange: (taskId: string, newStatus: TaskStatus) => void; disabled: boolean }> = ({ task, status, onStatusChange, disabled }) => {
    const priorityColors = {
        'Alta': 'bg-red-100 text-red-800 border-red-400',
        'Media': 'bg-yellow-100 text-yellow-800 border-yellow-400',
        'Baja': 'bg-blue-100 text-blue-800 border-blue-400',
    };
    return (
        <div className="bg-white p-3 rounded-lg shadow border border-neutral-200 space-y-2">
            <h5 className="font-semibold text-neutral-800">{task.name}</h5>
            <p className="text-sm text-neutral-600">{task.description}</p>
            <div className="flex justify-between items-center text-sm">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>{task.priority}</span>
                <span className="text-neutral-500">{task.estimatedHours} horas</span>
            </div>
            <div className="flex justify-end space-x-2 pt-2">
                {(['Por Hacer', 'En Progreso', 'Hecho'] as TaskStatus[]).map(s => (
                    s !== status && <Button key={s} size="sm" variant="outline" onClick={() => onStatusChange(task.id, s)} disabled={disabled}>{s}</Button>
                ))}
            </div>
        </div>
    );
};

const KanbanColumn: React.FC<{ title: string; tasks: ProjectTask[]; statuses: Statuses; onStatusChange: (taskId: string, newStatus: TaskStatus) => void; disabled: boolean }> = ({ title, tasks, statuses, onStatusChange, disabled }) => {
    const columnColors = {
        'Por Hacer': 'bg-neutral-200',
        'En Progreso': 'bg-blue-200',
        'Hecho': 'bg-green-200',
    };
    return (
        <div className="flex-1 bg-neutral-100 rounded-lg p-3 min-w-[280px]">
            <h4 className={`font-semibold text-center text-neutral-700 mb-3 p-2 rounded-md ${columnColors[title as TaskStatus]}`}>{title}</h4>
            <div className="space-y-3 h-[400px] overflow-y-auto p-1">
                {tasks.map(task => (
                    <TaskCard key={task.id} task={task} status={statuses[task.id]} onStatusChange={onStatusChange} disabled={disabled} />
                ))}
            </div>
        </div>
    );
};


const ProjectManagementPage: React.FC = () => {
    const [currentProject, setCurrentProject] = useState<ProjectSimulation | null>(null);
    const [taskStatuses, setTaskStatuses] = useState<Statuses>({});
    const [userPlan, setUserPlan] = useState('');
    
    // CAMBIO: Estados locales para manejar la llamada a la API
    const [geminiFeedback, setGeminiFeedback] = useState<string | null>(null);
    const [geminiError, setGeminiError] = useState<string | null>(null);
    const [isLoadingGemini, setIsLoadingGemini] = useState<boolean>(false);

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
                setUserPlan(prev => prev ? `${prev} ${transcript}` : transcript);
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
    
    const resetGemini = useCallback(() => {
        setGeminiFeedback(null);
        setGeminiError(null);
        setIsLoadingGemini(false);
    }, []);

    const loadNewProject = useCallback(() => {
        if(isRecording) handleToggleRecording();
        resetGemini();
        setUserPlan('');
        setSpeechError(null);
        const randomIndex = Math.floor(Math.random() * PROJECT_SIMULATIONS.length);
        const project = PROJECT_SIMULATIONS[randomIndex];
        setCurrentProject(project);
        const initialStatuses = project.tasks.reduce((acc, task) => {
            acc[task.id] = 'Por Hacer';
            return acc;
        }, {} as Statuses);
        setTaskStatuses(initialStatuses);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resetGemini, isRecording]);

    useEffect(() => {
        loadNewProject();
    }, [loadNewProject]);

    const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
        setTaskStatuses(prev => ({ ...prev, [taskId]: newStatus }));
    };

    const tasksByStatus = useMemo(() => {
        const columns: Record<TaskStatus, ProjectTask[]> = { 'Por Hacer': [], 'En Progreso': [], 'Hecho': [] };
        currentProject?.tasks.forEach(task => {
            const status = taskStatuses[task.id];
            if (status) {
                columns[status].push(task);
            }
        });
        return columns;
    }, [currentProject, taskStatuses]);

    const handleSubmit = useCallback(async () => {
        if (!currentProject || !userPlan.trim()) return;
        
        resetGemini();
        setIsLoadingGemini(true);
        
        const statusReport = currentProject.tasks.map(t => `- ${t.name}: ${taskStatuses[t.id]}`).join('\n');

        const prompt = `
            Eres un experimentado Director de Proyectos (PMP) y coach. Estás evaluando la planificación de un proyecto por parte de un estudiante.

            Contexto del Proyecto:
            Título: "${currentProject.title}"
            Objetivo: "${currentProject.goal}"
            
            Tareas del Proyecto (con prioridad y estimación):
            ${currentProject.tasks.map(t => `- ${t.name} (Prioridad: ${t.priority}, Horas: ${t.estimatedHours})`).join('\n')}

            Estado Actual de las Tareas según el Estudiante:
            ${statusReport}
            
            Plan de Acción/Justificación del Estudiante:
            "${userPlan}"

            Por favor, evalúa el enfoque de gestión del estudiante. Considera lo siguiente:
            1.  **Priorización y Secuenciación:** ¿El estudiante ha comenzado a trabajar ('En Progreso') en las tareas de alta prioridad primero? ¿El orden de las tareas tiene sentido lógico?
            2.  **Gestión del Flujo de Trabajo (WIP):** ¿Hay demasiadas tareas 'En Progreso' a la vez? Esto podría indicar una falta de enfoque.
            3.  **Alineación con el Plan:** ¿El plan de acción escrito es coherente con el estado de las tareas en el tablero?
            4.  **Mecanismo de Control:** ¿Cómo funciona el plan y el tablero Kanban como una herramienta de control del proyecto?
            5.  **Realismo y Riesgos:** ¿El plan del estudiante es realista? ¿Menciona posibles riesgos o dependencias?

            Proporciona retroalimentación constructiva en 2-4 párrafos, manteniendo un tono de mentor que guía.
        `;

        try {
            const feedback = await generateContent(prompt);
            setGeminiFeedback(feedback);
        } catch (e) {
            console.error("Error al enviar plan de proyecto:", e);
            setGeminiError(e instanceof Error ? e.message : "Ocurrió un error al obtener la retroalimentación.");
        } finally {
            setIsLoadingGemini(false);
        }
    }, [currentProject, taskStatuses, userPlan, resetGemini]);

    return (
        <PageWrapper title="Gestión de Proyectos Simulada" titleIcon={<ProjectManagementIcon />} subtitle="Organiza, prioriza y ejecuta proyectos. Desarrolla tu visión de gestor.">
            <InteractiveModule
                title="Laboratorio de Gestión de Proyectos"
                icon={<LightbulbIcon className="w-6 h-6" />}
                initialInstructions="1. Analiza el proyecto y sus tareas. 2. Mueve las tareas entre columnas para reflejar tu plan de trabajo. 3. Escribe tu plan de acción. 4. Recibe feedback experto."
            >
                <Button onClick={loadNewProject} disabled={isLoadingGemini || isRecording} className="mb-6">
                    Cargar Nuevo Proyecto
                </Button>

                {currentProject && (
                    <>
                        <Card className="mb-6 border-l-4 border-purple-500">
                            <h3 className="text-xl font-bold text-neutral-800 mb-2">{currentProject.title}</h3>
                            <p className="text-md text-neutral-700"><strong>Objetivo:</strong> {currentProject.goal}</p>
                        </Card>

                        <div className="mb-6 flex flex-col md:flex-row gap-4 overflow-x-auto pb-4">
                            <KanbanColumn title="Por Hacer" tasks={tasksByStatus['Por Hacer']} statuses={taskStatuses} onStatusChange={handleStatusChange} disabled={isLoadingGemini || isRecording} />
                            <KanbanColumn title="En Progreso" tasks={tasksByStatus['En Progreso']} statuses={taskStatuses} onStatusChange={handleStatusChange} disabled={isLoadingGemini || isRecording} />
                            <KanbanColumn title="Hecho" tasks={tasksByStatus['Hecho']} statuses={taskStatuses} onStatusChange={handleStatusChange} disabled={isLoadingGemini || isRecording} />
                        </div>
                        
                        <Card className="mb-6">
                            <label htmlFor="user-plan" className="block text-lg font-semibold text-neutral-700 mb-2">
                                Tu Plan de Acción
                            </label>
                            <div className="relative w-full">
                                <textarea
                                    id="user-plan"
                                    rows={5}
                                    value={userPlan}
                                    onChange={(e) => setUserPlan(e.target.value)}
                                    className="w-full p-2 border border-neutral-300 rounded-md shadow-sm focus:ring-primary focus:border-primary pr-12"
                                    placeholder="Describe tu estrategia. ¿Por qué comenzaste con esas tareas? ¿Cuáles son los próximos pasos críticos? ¿Qué riesgos anticipas?"
                                    disabled={isLoadingGemini || isRecording}
                                />
                                <Button
                                    onClick={handleToggleRecording}
                                    variant="outline"
                                    size="icon"
                                    className="absolute top-2 right-2 h-8 w-8"
                                    aria-label={isRecording ? 'Detener grabación' : 'Grabar plan por voz'}
                                    disabled={!recognitionRef.current || isLoadingGemini}
                                >
                                    {isRecording ? <StopCircleIcon className="w-5 h-5 text-red-500" /> : <MicrophoneIcon className="w-5 h-5" />}
                                </Button>
                            </div>
                            {speechError && <p className="text-sm text-red-600 mt-1">{speechError}</p>}
                            {isRecording && <p className="text-sm text-blue-600 animate-pulse mt-1">Escuchando...</p>}
                            <Button
                                onClick={handleSubmit}
                                disabled={isLoadingGemini || !userPlan.trim() || isRecording}
                                isLoading={isLoadingGemini}
                                className="mt-4"
                            >
                                {isLoadingGemini ? 'Evaluando Gestión...' : 'Evaluar mi Gestión'}
                            </Button>
                        </Card>
                    </>
                )}

                {isLoadingGemini && <div className="my-6"><LoadingSpinner text="Generando feedback del experto..." /></div>}

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
                        Análisis de tu Gestión del Proyecto
                        </h4>
                        <div className="prose prose-sm max-w-none text-neutral-700 whitespace-pre-wrap">
                        <p>{geminiFeedback}</p>
                        </div>
                        <p className="mt-3 text-xs text-neutral-500 italic">Este análisis te ayuda a pensar como un Project Manager.</p>
                    </Card>
                )}

            </InteractiveModule>
        </PageWrapper>
    );
};

export default ProjectManagementPage;
