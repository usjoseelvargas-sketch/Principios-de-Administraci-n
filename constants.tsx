import React from 'react';
import { AdministrativeTheory, CaseStudy, QualityTerm, KpiScenario, SmartGoalScenario, AutomationScenario, SkillIntegrationTopic, ProjectSimulation, DebateTopic, SwotScenario, StrategicPlanningScenario } from './types';

export const APP_TITLE = "2025-2 Profesor José Elías Vargas Mora";
// APP_SUBTITLE is removed as it's no longer used in the layout.

// La clave de la API de Gemini se gestiona de forma segura en el backend (api/gemini.ts)

// Model Names
export const GEMINI_TEXT_MODEL = "gemini-1.5-flash-latest";
// export const GEMINI_IMAGE_MODEL = "imagen-3.0-generate-002"; // If image generation was needed


// SVG Icons (Heroicons & Custom)
export const UniversidadElBosqueLogo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Logo Universidad El Bosque" {...props}>
    <rect width="24" height="24" rx="4" fill="#006934"/> {/* El Bosque Green */}
    <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="bold" fill="white">
      U
    </text>
  </svg>
);

export const HomeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" />
  </svg>
);

export const SimulationIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
  </svg>
);

export const AnalyticsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  </svg>
);

export const StrategyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
  </svg>
);

export const ProcessIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
  </svg>
);

export const HRIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

export const LightbulbIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.311V21m-3.75-2.311V21m0 0a3 3 0 01-3-3V6.75a3 3 0 013-3h3a3 3 0 013 3v6.189a3 3 0 01-3 3H12zm0-9.75h.008v.008H12V8.25z" />
  </svg>
);

export const CheckCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const XCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const ChevronRightIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
  </svg>
);

export const BookOpenIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
  </svg>
);

export const QualityCheckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l3.536-3.536A5.25 5.25 0 0112 6.25v0a5.25 5.25 0 015.464 2.214L21 12m-9 7.5a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" transform="translate(-1, -1) scale(0.8) translate(3,3)" />
     <path d="M17.5 7.5A3.5 3.5 0 0014 4H7.5A3.5 3.5 0 004 7.5v9A3.5 3.5 0 007.5 20H14a.5.5 0 00.5-.5V8a.5.5 0 00-.5-.5h-2a.5.5 0 00-.5.5v2.5a.5.5 0 01-1 0V8a2 2 0 012-2h2.5a.5.5 0 000-1H14a3 3 0 00-3 3v1.5h1.5a.5.5 0 000-1H11V8a1 1 0 00-1-1H7.5a2.5 2.5 0 00-2.5 2.5V16.5A2.5 2.5 0 007.5 19H14a2 2 0 002-2v-1.5a.5.5 0 00-1 0V17a1 1 0 01-1 1H7.5a1.5 1.5 0 01-1.5-1.5V7.5A1.5 1.5 0 017.5 6H14a2 2 0 012 2v-.5a.5.5 0 00.5-.5z" fill="currentColor" transform="scale(0.5) translate(22, 20)"/>
  </svg>
);

export const SpeakerWaveIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
  </svg>
);

export const StopCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 9.563C9 9.254 9.254 9 9.563 9h4.874c.309 0 .563.254.563.563v4.874c0 .309-.254.563-.563.563H9.564A.562.562 0 019 14.437V9.564z" />
  </svg>
);

export const MicrophoneIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15c-1.105 0-2-.895-2-2V7c0-1.105.895-2 2-2s2 .895 2 2v6c0 1.105-.895 2-2 2z" />
  </svg>
);

export const TrendingUpIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.28m5.94 2.28L18.75 3.75M2.25 18v.008" />
  </svg>
);

export const TargetIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M12 20.25a8.25 8.25 0 01-8.25-8.25V12a8.25 8.25 0 0116.5 0v.005a8.25 8.25 0 01-8.25 8.245z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75a.75.75 0 100-1.5.75.75 0 000 1.5z" />
  </svg>
);

export const AutomationIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.82m5.84-2.56a12.022 12.022 0 01-12.13-2.93m12.13 2.93L21 21M9.29 8.37l-3.29-3.29m3.29 3.29a3.003 3.003 0 01-4.24 0l-1.06-1.06a3.003 3.003 0 010-4.24l3.29-3.29m3.29 3.29L12 3m0 0l-3.71 3.71" />
  </svg>
);

export const PuzzlePieceIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.75a.75.75 0 01.75-.75h4.5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0V8.25h-3a.75.75 0 01-.75-.75z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M5.106 18.894a1.5 1.5 0 00-1.5-1.5H3.75a.75.75 0 00-.75.75v4.5a.75.75 0 00.75.75h1.5a1.5 1.5 0 001.5-1.5v-1.5a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v1.5a1.5 1.5 0 001.5 1.5h1.5a.75.75 0 00.75-.75v-4.5a.75.75 0 00-.75-.75H9.75a.75.75 0 01-.75.75v1.5a.75.75 0 00-.75.75h-.01a.75.75 0 00-.75-.75v-1.5a1.5 1.5 0 01-1.5-1.5H5.106zM15 15.75a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v1.5a1.5 1.5 0 001.5 1.5h1.5a.75.75 0 00.75-.75v-4.5a.75.75 0 00-.75-.75h-1.5a1.5 1.5 0 00-1.5 1.5v1.5a.75.75 0 01-.75.75h-.01a.75.75 0 01-.75-.75v-1.5a1.5 1.5 0 00-1.5-1.5H9.75a.75.75 0 00-.75.75v4.5a.75.75 0 00.75.75h1.5a1.5 1.5 0 001.5-1.5v-1.5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75a.75.75 0 01.75-.75h4.5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0V8.25h-3a.75.75 0 01-.75-.75z" />
  </svg>
);

export const ProjectManagementIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

export const ForumIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.72.35c-.863.081-1.72.2-2.583.424a5.982 5.982 0 01-3.416 0c-.863-.224-1.72-.343-2.583-.424l-3.72-.35A2.122 2.122 0 013 14.894V10.608c0-.97.616-1.813 1.5-2.097m14.25 0a2.121 2.121 0 00-1.5-2.097m-11.25 0A2.121 2.121 0 013 8.511m11.25 0c.884-.284 1.5-1.128 1.5-2.097V4.286c0-1.136-.847 2.1-1.98 2.193l-3.72-.35c-.863-.081-1.72-.2-2.583-.424a5.982 5.982 0 00-3.416 0c-.863.224-1.72.343-2.583.424l-3.72-.35A2.122 2.122 0 003 4.106v4.286c0 .97-.616 1.813 1.5 2.097" />
  </svg>
);

export const PencilSquareIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
  </svg>
);

export const AcademicCapIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0l15.482 0m-15.482 0a50.57 50.57 0 012.658-.813m15.482 0a50.57 50.57 0 002.658-.813m0 0l-15.482 0" />
  </svg>
);

export const SwotIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <rect width="18" height="18" x="3" y="3" rx="2" stroke="currentColor" />
    <line x1="12" y1="3" x2="12" y2="21" stroke="currentColor" />
    <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" />
  </svg>
);

export const CompassIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 8.09l-3.82 3.82L8.09 15.91m0-7.82l7.82 7.82" />
    </svg>
);


// Data for Administrative Theories Module
export const ADMINISTRATIVE_THEORIES: AdministrativeTheory[] = [
  {
    id: 'taylor',
    name: 'Administración Científica',
    proponent: 'Frederick W. Taylor',
    year: 'Principios de 1900s',
    shortDescription: 'Enfoque en la eficiencia y la estandarización de tareas mediante el estudio científico del trabajo.',
    keyConcepts: [
      'Estudio de tiempos y movimientos',
      'Estandarización de herramientas y tareas',
      'División del trabajo: planificación (gerencia) vs. ejecución (obreros)',
      'Incentivos salariales basados en la productividad',
      'Selección científica y entrenamiento del trabajador'
    ],
  },
  {
    id: 'fayol',
    name: 'Teoría Clásica de la Administración',
    proponent: 'Henri Fayol',
    year: 'Principios de 1900s',
    shortDescription: 'Se enfoca en la estructura organizacional y las funciones universales de la administración.',
    keyConcepts: [
      '14 Principios de la Administración (ej: división del trabajo, autoridad, disciplina, unidad de mando)',
      'Funciones administrativas: Planificar, Organizar, Dirigir, Coordinar, Controlar (PODCC)',
      'Jerarquía y estructura formal de la organización',
    ],
  },
   {
    id: 'weber',
    name: 'Teoría de la Burocracia',
    proponent: 'Max Weber',
    year: 'Principios de 1900s (ideas), popularizada mediados S.XX',
    shortDescription: 'Modelo organizacional basado en la racionalidad, la jerarquía clara, reglas formales y la impersonalidad.',
    keyConcepts: [
      'Jerarquía de autoridad claramente definida',
      'Reglas y procedimientos formales escritos',
      'División del trabajo basada en la especialización funcional',
      'Impersonalidad en las relaciones',
      'Selección y promoción basadas en la competencia técnica',
      'Racionalidad legal como base de la autoridad',
    ],
  },
  {
    id: 'mayo',
    name: 'Teoría de las Relaciones Humanas',
    proponent: 'Elton Mayo',
    year: '1920s-1930s',
    shortDescription: 'Destaca la importancia de los factores sociales y psicológicos en el trabajo y la productividad.',
    keyConcepts: [
      'El "efecto Hawthorne"',
      'Importancia de los grupos informales y sus normas',
      'Necesidades sociales de los empleados (reconocimiento, pertenencia, aprobación social)',
      'Liderazgo y comunicación participativa',
      'Satisfacción laboral y su impacto en la productividad (aunque la relación es compleja)',
    ],
  },
  {
    id: 'structuralist',
    name: 'Teoría Estructuralista',
    proponent: 'Amitai Etzioni, Renate Mayntz, Chester Barnard (influencias)',
    year: 'Década de 1950',
    shortDescription: 'Busca conciliar la Teoría Clásica y la de Relaciones Humanas. Analiza la organización como una unidad social compleja y su interacción con el ambiente.',
    keyConcepts: [
      'Análisis interorganizacional y ambiental',
      'Múltiples enfoques (formal e informal, recompensas materiales y sociales)',
      'Hombre organizacional (flexible, tolerante a frustraciones, busca recompensas múltiples)',
      'Tipologías de organizaciones (ej: según control, según beneficiario)',
      'Conflictos y dilemas organizacionales como inevitables y funcionales',
    ],
  },
  {
    id: 'systems',
    name: 'Teoría de Sistemas',
    proponent: 'Ludwig von Bertalanffy, Katz & Kahn, Kenneth Boulding',
    year: 'Década de 1950',
    shortDescription: 'Concibe la organización como un sistema abierto, compuesto por partes interdependientes que interactúan con su entorno.',
    keyConcepts: [
      'Entradas (inputs), Procesamiento (throughput), Salidas (outputs), Retroalimentación (feedback)',
      'Entropía y negentropía (tendencia al desorden vs. importación de energía para sobrevivir)',
      'Homeostasis dinámica (equilibrio adaptable)',
      'Subsistemas organizacionales (ej: técnico, social, gerencial)',
      'Fronteras del sistema',
      'Equifinalidad (diferentes caminos para alcanzar el mismo fin)',
    ],
  },
  {
    id: 'behavioral',
    name: 'Teoría del Comportamiento (Conductista)',
    proponent: 'Douglas McGregor, Abraham Maslow, Frederick Herzberg, Rensis Likert, Herbert Simon',
    year: 'Década de 1950',
    shortDescription: 'Énfasis en el comportamiento individual y grupal dentro de las organizaciones. Busca explicar la conducta humana en el trabajo.',
    keyConcepts: [
      'Motivación humana (Jerarquía de necesidades de Maslow, Teoría de los dos factores de Herzberg)',
      'Estilos de liderazgo (Teoría X y Teoría Y de McGregor, Sistemas de Likert)',
      'Proceso de toma de decisiones (Racionalidad limitada de Simon)',
      'Dinámica de grupos y comportamiento organizacional',
      'Participación y desarrollo organizacional',
    ],
  },
  {
    id: 'contingency',
    name: 'Teoría de Contingencia (Situacional)',
    proponent: 'Joan Woodward, Fred Fiedler, Paul Lawrence & Jay Lorsch',
    year: 'Década de 1960',
    shortDescription: 'No existe una única forma óptima de organizar o administrar; la mejor acción depende de las características de la situación (contingencias).',
    keyConcepts: [
      'Relación "si... entonces" (si X es la situación, entonces Y es la mejor acción)',
      'Variables contingentes: ambiente (estable/dinámico, simple/complejo), tecnología, tamaño de la organización, estrategia',
      'Diseño organizacional adaptativo',
      'Liderazgo situacional',
      'Énfasis en el diagnóstico situacional',
    ],
  },
  {
    id: 'theory_z',
    name: 'Teoría Z',
    proponent: 'William Ouchi',
    year: 'Década de 1980',
    shortDescription: 'Propone una mezcla de prácticas administrativas japonesas y estadounidenses para mejorar la productividad y la moral.',
    keyConcepts: [
      'Empleo a largo plazo',
      'Proceso de decisión consensual y participativo',
      'Responsabilidad individual dentro de un contexto grupal',
      'Evaluación y promoción lentas',
      'Control informal implícito (cultura fuerte)',
      'Visión holística del empleado (interés en su bienestar general)',
    ],
  },
  {
    id: 'tqm',
    name: 'Enfoque de Calidad Total (TQM)',
    proponent: 'W. Edwards Deming, Joseph M. Juran, Philip Crosby, Kaoru Ishikawa',
    year: 'Finales del siglo XX',
    shortDescription: 'Filosofía de gestión orientada a la mejora continua de la calidad en todos los aspectos de la organización, con foco en el cliente.',
    keyConcepts: [
      'Enfoque en el cliente (interno y externo)',
      'Mejora continua (Kaizen, ciclo PDCA/PDSA)',
      'Participación y empoderamiento de los empleados',
      'Gestión basada en hechos y datos',
      'Liderazgo comprometido con la calidad',
      'Prevención en lugar de corrección',
      'Relaciones de cooperación con proveedores',
    ],
  },
  {
    id: 'bpr',
    name: 'Reingeniería de Procesos (BPR)',
    proponent: 'Michael Hammer & James Champy',
    year: 'Década de 1990',
    shortDescription: 'Rediseño radical de los procesos de negocio para lograr mejoras drásticas en medidas críticas de rendimiento como costos, calidad, servicio y rapidez.',
    keyConcepts: [
      'Pensamiento fundamental y rediseño radical',
      'Orientación a procesos, no a tareas o funciones',
      'Resultados drásticos y espectaculares (no incrementales)',
      'Uso intensivo de la tecnología de la información',
      'Romper con reglas y supuestos obsoletos',
    ],
  },
  {
    id: 'benchmarking',
    name: 'Benchmarking',
    proponent: 'Conceptual (ampliamente adoptado)',
    year: 'Década de 1990 en adelante',
    shortDescription: 'Proceso continuo de medir productos, servicios y prácticas contra los competidores más duros o aquellas compañías reconocidas como líderes en la industria.',
    keyConcepts: [
      'Identificar qué medir (procesos críticos, KPIs)',
      'Identificar organizaciones comparables (competidores, líderes de industria)',
      'Recopilar datos y analizar brechas de desempeño',
      'Establecer metas de desempeño y desarrollar planes de acción',
      'Implementar y monitorear mejoras',
      'Tipos: interno, competitivo, funcional, genérico',
    ],
  },
  {
    id: 'knowledge_mgmt',
    name: 'Gestión del Conocimiento',
    proponent: 'Ikujiro Nonaka & Hirotaka Takeuchi, Thomas H. Davenport',
    year: 'Finales del siglo XX - Siglo XXI',
    shortDescription: 'Proceso sistemático de identificar, capturar, almacenar, compartir y utilizar el conocimiento dentro de una organización para mejorar el desempeño.',
    keyConcepts: [
      'Conocimiento tácito vs. explícito',
      'Modelo SECI (Socialización, Externalización, Combinación, Internalización) de Nonaka y Takeuchi',
      'Creación de comunidades de práctica',
      'Uso de tecnologías para facilitar el intercambio de conocimiento (ej: intranets, bases de datos)',
      'Cultura organizacional que fomente el compartir conocimiento',
    ],
  },
  {
    id: 'org_learning',
    name: 'Aprendizaje Organizacional',
    proponent: 'Peter Senge, Chris Argyris, Donald Schön',
    year: 'Finales del siglo XX - Siglo XXI',
    shortDescription: 'Proceso por el cual las organizaciones adquieren, crean, transfieren y retienen conocimiento, modificando su comportamiento para reflejar nuevas perspectivas.',
    keyConcepts: [
      'Cinco disciplinas de Senge (Dominio personal, Modelos mentales, Visión compartida, Aprendizaje en equipo, Pensamiento sistémico)',
      'Aprendizaje de ciclo simple vs. doble ciclo (Argyris)',
      'Organizaciones que aprenden (Learning Organizations)',
      'Cultura de experimentación y reflexión',
      'Adaptabilidad y capacidad de cambio',
    ],
  },
  {
    id: 'competency_mgmt',
    name: 'Gestión por Competencias',
    proponent: 'David McClelland (pionero), Lyle & Signe Spencer',
    year: 'Finales del siglo XX - Siglo XXI',
    shortDescription: 'Enfoque para la gestión de RRHH que identifica las competencias (conocimientos, habilidades, actitudes) clave para el éxito organizacional y individual, y las utiliza en selección, desarrollo, evaluación y compensación.',
    keyConcepts: [
      'Identificación y definición de competencias clave (core, funcionales, de liderazgo)',
      'Modelos de competencias',
      'Evaluación de competencias (ej: entrevistas por competencias, assessment centers)',
      'Desarrollo de competencias (capacitación, coaching)',
      'Vinculación de competencias con la estrategia de negocio',
    ],
  },
  {
    id: 'toc',
    name: 'Teoría de las Restricciones (TOC)',
    proponent: 'Eliyahu M. Goldratt',
    year: 'Finales del siglo XX - Siglo XXI',
    shortDescription: 'Filosofía de gestión que se enfoca en identificar y gestionar la restricción (cuello de botella) más importante que limita el logro de los objetivos de un sistema.',
    keyConcepts: [
      'Los Cinco Pasos de Enfoque (Identificar, Explotar, Subordinar, Elevar, Repetir)',
      'Métricas de TOC: Throughput (ingreso), Inventario, Gastos Operativos',
      'Tambor-Amortiguador-Cuerda (DBR) para la programación de la producción',
      'Proceso de Pensamiento (Thinking Processes) para resolver problemas complejos',
    ],
  },
  {
    id: 'strategic_mgmt',
    name: 'Administración Estratégica',
    proponent: 'Michael Porter, Henry Mintzberg, Igor Ansoff (entre muchos otros)',
    year: 'Campo continuo y evolutivo desde el siglo XX',
    shortDescription: 'Proceso de formulación, implementación y evaluación de estrategias para alcanzar los objetivos a largo plazo de una organización, considerando su entorno.',
    keyConcepts: [
      'Análisis del entorno (PESTEL, FODA/SWOT, Cinco Fuerzas de Porter)',
      'Formulación de la estrategia (misión, visión, valores, objetivos estratégicos)',
      'Tipos de estrategias (liderazgo en costos, diferenciación, enfoque)',
      'Implementación de la estrategia (estructura, cultura, recursos)',
      'Control y evaluación estratégica (Balanced Scorecard)',
    ],
  },
  {
    id: 'transformational_servant_leadership',
    name: 'Liderazgo Transformacional/Servidor',
    proponent: 'James MacGregor Burns, Bernard Bass (Transformacional); Robert K. Greenleaf (Servidor)',
    year: 'Evolución desde finales del siglo XX',
    shortDescription: 'Transformacional: inspira y motiva a los seguidores a lograr resultados extraordinarios. Servidor: prioriza el crecimiento y bienestar de los miembros del equipo.',
    keyConcepts: [
      'Liderazgo Transformacional: Influencia idealizada, motivación inspiradora, estimulación intelectual, consideración individualizada.',
      'Liderazgo Servidor: Escucha activa, empatía, sanación, conciencia, persuasión, conceptualización, previsión, mayordomía, compromiso con el crecimiento de las personas, construcción de comunidad.',
    ],
  },
  {
    id: 'csr_sustainability',
    name: 'Sostenibilidad y RSC',
    proponent: 'Conceptual (múltiples contribuyentes, Archie Carroll - Pirámide de RSC)',
    year: 'Creciente importancia desde finales del siglo XX',
    shortDescription: 'Integración voluntaria de preocupaciones sociales, ambientales y económicas en las operaciones de negocio y en las interacciones con los stakeholders.',
    keyConcepts: [
      'Triple Bottom Line (Personas, Planeta, Beneficio)',
      'Gestión de stakeholders',
      'Ética empresarial y gobernanza corporativa',
      'Informes de sostenibilidad (ej: GRI)',
      'Creación de valor compartido',
      'Economía circular',
    ],
  },
  {
    id: 'agile_mgmt',
    name: 'Administración Ágil (Agile)',
    proponent: 'Originado en desarrollo de software (Manifiesto Ágil)',
    year: 'Siglo XXI',
    shortDescription: 'Enfoque iterativo e incremental para la gestión de proyectos, que promueve la flexibilidad, colaboración, retroalimentación continua y entregas rápidas de valor.',
    keyConcepts: [
      'Manifiesto Ágil (valores y principios)',
      'Marcos de trabajo (Scrum, Kanban)',
      'Roles (Product Owner, Scrum Master, Equipo de Desarrollo)',
      'Artefactos (Product Backlog, Sprint Backlog, Incremento)',
      'Eventos (Sprint Planning, Daily Scrum, Sprint Review, Sprint Retrospective)',
      'Adaptabilidad al cambio y respuesta rápida',
    ],
  }
];

export const ADMIN_CASE_STUDIES: CaseStudy[] = [
  {
    id: 'case_taylor_factory',
    title: 'Optimización en Fábrica "Metalurgia Veloz"',
    scenario: 'La fábrica "Metalurgia Veloz" enfrenta baja productividad, altos desperdicios de material y métodos de trabajo inconsistentes. Los obreros a menudo se quejan de fatiga y sienten que sus salarios no reflejan su esfuerzo. La gerencia está presionada para mejorar la eficiencia y reducir costos operativos.',
    relatedTheoryIds: ['taylor'],
    guidingQuestions: [
      '¿Qué principios específicos de la Administración Científica de Taylor podrían aplicarse para abordar los problemas de "Metalurgia Veloz"?',
      '¿Cómo se podría implementar un estudio de tiempos y movimientos en esta fábrica y qué beneficios se esperarían?',
      '¿Qué tipo de sistema de incentivos salariales, basado en las ideas de Taylor, podría proponerse?',
      '¿Cuáles podrían ser los desafíos o la resistencia de los trabajadores a estos cambios y cómo se podrían mitigar?'
    ]
  },
  {
    id: 'case_fayol_expansion',
    title: 'Reestructuración para la Expansión en "Comercializadora Global"',
    scenario: '"Comercializadora Global" es una empresa familiar que ha crecido rápidamente. Sin embargo, la falta de una estructura clara, la duplicidad de funciones y la confusión sobre quién reporta a quién están causando ineficiencias y conflictos. La empresa planea expandirse a nuevos mercados y necesita organizarse mejor.',
    relatedTheoryIds: ['fayol', 'weber'],
    guidingQuestions: [
      'Desde la perspectiva de Henri Fayol, ¿cuáles de sus 14 principios de administración serían más cruciales para "Comercializadora Global" en este momento?',
      '¿Cómo podrían las cinco funciones administrativas de Fayol (Planificar, Organizar, Dirigir, Coordinar, Controlar) guiar el proceso de reestructuración?',
      '¿Qué tipo de estructura organizacional podría ser adecuada y cómo se definirían la autoridad y la responsabilidad?',
      '¿Cómo se podría aplicar el principio de "unidad de mando" para resolver los problemas de reporte?'
    ]
  },
  {
    id: 'case_structure_choice',
    title: 'Decisión Estructural en "TecnoSistemas S.A."',
    scenario: '"TecnoSistemas S.A." es una empresa tecnológica que ha crecido de 50 a 500 empleados en dos años. Actualmente opera con una estructura funcional (departamentos de Ingeniería, Marketing, Ventas, etc.), pero la colaboración entre departamentos para lanzar nuevos productos es lenta y conflictiva. La dirección evalúa cambiar a una estructura divisional por línea de producto (División de Software Empresarial, División de Apps para Consumidor).',
    relatedTheoryIds: ['fayol', 'contingency', 'structuralist'],
    guidingQuestions: [
      '¿Cuáles son las ventajas y desventajas de la actual estructura funcional para "TecnoSistemas S.A."?',
      '¿Qué beneficios y problemas podría traer una estructura divisional? ¿Cómo afectaría a la cultura organizacional?',
      'Considerando que el mercado tecnológico es muy dinámico (ambiente de alta incertidumbre), ¿qué estructura le parece más adecuada según la Teoría de Contingencia?',
      '¿Cómo se podrían mitigar los problemas de la estructura elegida (ej. silos en la divisional, lentitud en la funcional)?'
    ]
  },
  {
    id: 'case_mayo_callcenter',
    title: 'Baja Moral en el Call Center "Atención Inmediata"',
    scenario: 'El call center "Atención Inmediata" tiene una alta rotación de personal y baja moral entre los agentes. A pesar de tener tecnología moderna y salarios competitivos, los empleados se sienten poco valorados, aislados y con poca autonomía. La productividad por agente ha disminuido.',
    relatedTheoryIds: ['mayo', 'behavioral'],
    guidingQuestions: [
      'Basándose en los hallazgos de Elton Mayo y la Teoría de las Relaciones Humanas, ¿qué factores podrían estar contribuyendo a la baja moral y alta rotación en el call center?',
      '¿Qué tipo de cambios en el estilo de liderazgo y la comunicación podrían mejorar el ambiente laboral?',
      '¿Cómo podría la gerencia fomentar la formación de grupos de trabajo cohesivos y el sentido de pertenencia?',
      '¿Qué estrategias, inspiradas en esta teoría, se podrían implementar para aumentar la satisfacción y, potencialmente, la productividad de los agentes?'
    ]
  },
  {
    id: 'case_weber_gov',
    title: 'Modernización de una Entidad Gubernamental',
    scenario: 'Una entidad gubernamental local es conocida por su lentitud, procesos engorrosos y favoritismos en la asignación de tareas. Los ciudadanos se quejan de la falta de transparencia y la ineficiencia. Se busca implementar un modelo más racional y eficiente.',
    relatedTheoryIds: ['weber', 'fayol'],
    guidingQuestions: [
      '¿Cómo podrían los principios de la Teoría de la Burocracia de Max Weber ayudar a mejorar la eficiencia y la equidad en esta entidad?',
      '¿Qué implicaría establecer una jerarquía de autoridad clara y reglas y procedimientos formales?',
      '¿Cómo se abordaría la selección y promoción del personal bajo un modelo burocrático ideal?',
      '¿Cuáles son los posibles inconvenientes o "disfunciones" de la burocracia que se deberían tener en cuenta durante la implementación?'
    ]
  },
  {
    id: 'case_structuralist_university',
    title: 'Dilema de la Universidad "Saber Global"',
    scenario: 'La Universidad "Saber Global" es una institución grande con múltiples facultades. Enfrenta presiones para mejorar su ranking de investigación, aumentar la satisfacción estudiantil, asegurar financiamiento externo y mantener buenas relaciones con la comunidad local. Diferentes departamentos tienen objetivos a veces conflictivos, y la administración central lucha por equilibrar estas demandas.',
    relatedTheoryIds: ['structuralist', 'systems'],
    guidingQuestions: [
      '¿Cómo ayuda la Teoría Estructuralista a entender los conflictos y dilemas que enfrenta la Universidad "Saber Global"?',
      '¿Qué tipos de análisis interorganizacional y ambiental serían relevantes para esta universidad?',
      '¿Cómo se manifiesta el concepto de "hombre organizacional" en los profesores y administradores de la universidad?',
      '¿Qué estrategias podría adoptar la universidad para gestionar las múltiples presiones y objetivos en conflicto?'
    ]
  },
  {
    id: 'case_systems_ecommerce',
    title: 'Crisis en la Cadena de Suministro de "ElectroShop"',
    scenario: '"ElectroShop", una tienda en línea de electrónicos, está experimentando graves retrasos en las entregas, errores en los pedidos y una comunicación deficiente entre los departamentos de ventas, almacén y logística. Los clientes están insatisfechos y la reputación de la empresa está cayendo.',
    relatedTheoryIds: ['systems', 'tqm'],
    guidingQuestions: [
      'Desde la perspectiva de la Teoría de Sistemas, ¿cuáles son los principales subsistemas de "ElectroShop" y cómo están fallando sus interacciones?',
      '¿Cómo podría "ElectroShop" utilizar el concepto de retroalimentación (feedback) para mejorar sus operaciones?',
      '¿Qué significa "entropía" en este contexto y qué medidas "negentrópicas" podría tomar la empresa?',
      '¿Cómo se podría aplicar el concepto de equifinalidad para resolver los problemas de entrega?'
    ]
  },
  {
    id: 'case_behavioral_techstartup',
    title: 'Fomentando la Innovación en "InnovaTech Solutions"',
    scenario: '"InnovaTech Solutions" es una startup de software que necesita fomentar la creatividad y la motivación de sus desarrolladores para mantenerse competitiva. La CEO cree en el potencial de sus empleados y quiere crear un ambiente de trabajo que promuova la autonomía y la autorrealización.',
    relatedTheoryIds: ['behavioral', 'theory_z', 'transformational_servant_leadership'],
    guidingQuestions: [
      '¿Cómo se aplicarían la Teoría X y la Teoría Y de McGregor al estilo de liderazgo en "InnovaTech Solutions"? ¿Cuál sería más apropiada y por qué?',
      '¿De qué manera la Jerarquía de Necesidades de Maslow podría informar las estrategias de motivación de la empresa?',
      '¿Qué tipo de prácticas de gestión, basadas en la Teoría del Comportamiento, podrían implementarse para mejorar la moral y la productividad?',
      '¿Cómo podría la empresa evaluar la efectividad de sus iniciativas de motivación?'
    ]
  },
  {
    id: 'case_contingency_multinational',
    title: 'Adaptación Global de "GlobalFoods Inc."',
    scenario: '"GlobalFoods Inc." es una empresa multinacional de alimentos que opera en diversos países con culturas y condiciones de mercado muy diferentes. La sede central está debatiendo si debe estandarizar sus prácticas de gestión y marketing a nivel global o adaptarlas a cada mercado local.',
    relatedTheoryIds: ['contingency', 'strategic_mgmt'],
    guidingQuestions: [
      '¿Cómo se aplica el principio central de la Teoría de Contingencia a la situación de "GlobalFoods Inc."?',
      '¿Cuáles son las principales variables contingentes que la empresa debe considerar al decidir su estrategia de gestión y marketing en diferentes países?',
      '¿Qué tipo de estructura organizacional y estilo de liderazgo serían más efectivos en un mercado altamente dinámico y complejo versus uno más estable y simple?',
      '¿Cómo puede la empresa desarrollar la capacidad de diagnóstico situacional en sus gerentes locais?'
    ]
  },
  {
    id: 'case_theory_z_manufacturing',
    title: 'Mejorando la Calidad y Lealtad en "AutoPartes Excelencia"',
    scenario: '"AutoPartes Excelencia", una fábrica de componentes automotrices, sufre de alta rotación de personal y problemas de calidad. La nueva gerencia, inspirada en prácticas japonesas, quiere implementar elementos de la Teoría Z para fomentar un mayor compromiso de los empleados y mejorar el desempeño general.',
    relatedTheoryIds: ['theory_z', 'tqm', 'behavioral'],
    guidingQuestions: [
      '¿Qué elementos específicos de la Teoría Z de Ouchi podrían ser más beneficiosos para "AutoPartes Excelencia"?',
      '¿Cómo se podría implementar un proceso de decisión consensual y participativo en esta fábrica?',
      '¿Qué desafíos culturales podrían surgir al intentar aplicar prácticas de la Teoría Z en un contexto no japonés y cómo se podrían abordar?',
      '¿Cómo se relacionan los principios de la Teoría Z con la mejora de la calidad y la reducción de la rotación de personal?'
    ]
  },
  {
    id: 'case_tqm_hospital',
    title: 'Mejora Continua en el Hospital "Salud Óptima"',
    scenario: 'El Hospital "Salud Óptima" busca mejorar la satisfacción de los pacientes, reducir los errores médicos y optimizar el uso de sus recursos. La dirección ha decidido adoptar un enfoque de Calidad Total (TQM) para transformar su cultura y operaciones.',
    relatedTheoryIds: ['tqm', 'systems', 'org_learning'],
    guidingQuestions: [
      '¿Cuáles son los primeros pasos que debería dar el Hospital "Salud Óptima" para implementar TQM?',
      '¿Cómo se podría aplicar el ciclo PDCA (Planificar-Hacer-Verificar-Actuar) para mejorar un proceso específico, como la admisión de pacientes o la administración de medicamentos?',
      '¿De qué manera se puede fomentar la participación de todos los empleados (médicos, enfermeras, personal administrativo) en la iniciativa de calidad total?',
      '¿Qué métricas clave (KPIs) debería utilizar el hospital para medir el éxito de su programa TQM?'
    ]
  },
  {
    id: 'case_bpr_insurance',
    title: 'Rediseño Radical en "Seguros Confianza"',
    scenario: '"Seguros Confianza" enfrenta una creciente insatisfacción de los clientes debido a la lentitud extrema en el procesamiento de reclamos, que puede tomar semanas o incluso meses. La competencia es mucho más ágil. La empresa considera una Reingeniería de Procesos (BPR) para su sistema de gestión de reclamos.',
    relatedTheoryIds: ['bpr', 'systems'],
    guidingQuestions: [
      '¿Cuál es la diferencia entre mejora continua (Kaizen) y Reingeniería de Procesos (BPR) en el contexto de "Seguros Confianza"?',
      '¿Qué procesos específicos dentro de la gestión de reclamos deberían ser objeto de un rediseño radical?',
      '¿Cómo podría la tecnología de la información jugar un papel crucial en la reingeniería del proceso de reclamos?',
      '¿Cuáles son los principales riesgos y desafíos asociados con un proyecto de BPR de esta magnitud?'
    ]
  },
  {
    id: 'case_benchmarking_retail',
    title: 'Aprendiendo del Mejor en "ModaRápida"',
    scenario: '"ModaRápida", una cadena de tiendas de ropa, quiere mejorar su eficiencia logística y la experiencia de compra en línea. Han identificado a "ElectroVeloz", un líder en comercio electrónico de otro sector, como un referente en estas áreas y planean realizar un benchmarking.',
    relatedTheoryIds: ['benchmarking', 'tqm'],
    guidingQuestions: [
      '¿Qué tipo de benchmarking (interno, competitivo, funcional, genérico) está realizando "ModaRápida"? ¿Por qué es apropiado?',
      '¿Qué métricas específicas de logística y experiencia en línea debería "ModaRápida" intentar comparar con "ElectroVeloz"?',
      '¿Cómo puede "ModaRápida" obtener la información necesaria para el benchmarking de manera ética y legal?',
      'Una vez identificadas las brechas de desempeño, ¿cuáles son los siguientes pasos para "ModaRápida"?'
    ]
  },
  {
    id: 'case_knowledge_mgmt_consulting',
    title: 'Capitalizando la Experiencia en "Consultores Globales"',
    scenario: '"Consultores Globales" es una firma de consultoría con expertos en diversas áreas. Sin embargo, gran parte del conocimiento reside en individuos y no se comparte eficazmente, lo que lleva a reinventar la rueda en nuevos proyectos y a una calidad de servicio inconsistente. Quieren implementar un sistema de Gestión del Conocimiento.',
    relatedTheoryIds: ['knowledge_mgmt', 'org_learning'],
    guidingQuestions: [
      '¿Qué tipos de conocimiento (tácito y explícito) son cruciales para "Consultores Globales" y cómo se podrían capturar y compartir cada uno?',
      '¿Cómo podría la empresa utilizar el modelo SECI de Nonaka y Takeuchi para fomentar la creación y transferencia de conocimiento?',
      '¿Qué papel jugarían las comunidades de práctica y la tecnología en su estrategia de gestión del conocimiento?',
      '¿Cómo se puede crear una cultura organizacional que incentive a los consultores a compartir su conocimiento en lugar de acapararlo?'
    ]
  },
  {
    id: 'case_org_learning_market_disruption',
    title: 'La Lección de "Ediciones Clásicas"',
    scenario: '"Ediciones Clásicas", una editorial tradicional de libros impresos, se vio gravemente afectada por el auge de los e-books y las plataformas de autoedición. Inicialmente, la empresa desestimó estas tendencias, pero ahora lucha por sobrevivir. Necesitan transformarse en una organización que aprende.',
    relatedTheoryIds: ['org_learning', 'strategic_mgmt', 'contingency'],
    guidingQuestions: [
      'Según las cinco disciplinas de Peter Senge, ¿cuáles parecen haber estado ausentes o débiles en "Ediciones Clásicas" antes de la crisis?',
      '¿Cómo se manifiesta el aprendizaje de ciclo simple versus el de doble ciclo en la situación de esta editorial?',
      '¿Qué mecanismos podría implementar "Ediciones Clásicas" para fomentar el aprendizaje organizacional y la adaptación continua?',
      '¿Cómo pueden los "modelos mentales" de los directivos haber impedido una respuesta más temprana y efectiva a los cambios del mercado?'
    ]
  },
  {
    id: 'case_competency_hr_development',
    title: 'Desarrollando Talento en "TecnoSoluciones"',
    scenario: 'El departamento de RRHH de "TecnoSoluciones" quiere implementar un sistema de Gestión por Competencias para mejorar la selección, el desarrollo profesional y la evaluación del desempeño de sus empleados, alineándolos con los objetivos estratégicos de la empresa.',
    relatedTheoryIds: ['competency_mgmt', 'behavioral'],
    guidingQuestions: [
      '¿Cómo debería "TecnoSoluciones" identificar las competencias clave (core, funcionales, de liderazgo) necesarias para su éxito?',
      'Una vez definidas las competencias, ¿cómo se pueden integrar en los procesos de selección de personal?',
      '¿Qué métodos se podrían utilizar para evaluar las competencias de los empleados actuales e identificar brechas de desarrollo?',
      '¿Cómo se puede diseñar un plan de desarrollo de competencias que sea efectivo y motivador para los empleados?'
    ]
  },
  {
    id: 'case_toc_production_line',
    title: 'El Cuello de Botella en "Muebles Robustos"',
    scenario: 'La fábrica "Muebles Robustos" tiene una línea de producción de sillas de madera. El proceso completo (corte, ensamblaje, lijado, pintura, empaque) está limitado por la capacidad de la máquina de lijado, que es la más lenta. Se acumulan sillas sin lijar, mientras las otras estaciones a menudo están ociosas. La empresa quiere aplicar la Teoría de las Restricciones (TOC).',
    relatedTheoryIds: ['toc', 'systems'],
    guidingQuestions: [
      'Aplicando los Cinco Pasos de Enfoque de la TOC, ¿cuál es el primer paso y cómo se identifica la restricción en "Muebles Robustos"?',
      '¿Cómo se podría "explotar" la restricción (la máquina de lijado) para maximizar su rendimiento?',
      '¿Qué significa "subordinar" el resto del sistema a la restricción y cómo se aplicaría en este caso?',
      'Si después de explotar y subordinar la restricción sigue siendo un cuello de botella, ¿qué implicaría "elevar" la restricción?'
    ]
  },
  {
    id: 'case_strategic_mgmt_diversification',
    title: 'Nuevos Horizontes para "AgroFrescos"',
    scenario: '"AgroFrescos" es una empresa líder en la producción y comercialización de frutas frescas en el mercado nacional. La junta directiva está considerando dos opciones estratégicas principales para el crecimiento futuro: (1) expandirse a mercados internacionales con sus productos actuales, o (2) diversificarse hacia productos procesados (jugos, mermeladas) para el mercado nacional.',
    relatedTheoryIds: ['strategic_mgmt', 'contingency'],
    guidingQuestions: [
      '¿Qué herramientas de análisis estratégico (ej: FODA, PESTEL, Cinco Fuerzas de Porter) serían más útiles para "AgroFrescos" al evaluar estas dos opciones?',
      '¿Cuáles son los principales riesgos y oportunidades asociados con la expansión internacional versus la diversificación de productos?',
      '¿Cómo deberían la misión, visión y valores de la empresa influir en esta decisión estratégica?',
      '¿Qué factores del entorno (económicos, competitivos, regulatorios) son cruciales para cada opción?'
    ]
  },
  {
    id: 'case_transformational_leadership_turnaround',
    title: 'El Resurgir de "Textiles Innova"',
    scenario: '"Textiles Innova", una empresa textil tradicional, está al borde de la quiebra debido a la competencia de importaciones baratas y a la falta de innovación. Se ha contratado a una nueva CEO, conocida por su estilo de Liderazgo Transformacional, para intentar salvar la compañía.',
    relatedTheoryIds: ['transformational_servant_leadership', 'org_learning', 'strategic_mgmt'],
    guidingQuestions: [
      '¿Cuáles de las cuatro "I" del Liderazgo Transformacional (Influencia Idealizada, Motivación Inspiradora, Estimulación Intelectual, Consideración Individualizada) serían más importantes para la nueva CEO en esta situación?',
      '¿Cómo podría la CEO inspirar una nueva visión compartida y motivar a los empleados desmoralizados?',
      '¿Qué acciones específicas podría tomar para fomentar la estimulación intelectual y la innovación en "Textiles Innova"?',
      '¿Qué desafíos podría enfrentar al intentar cambiar la cultura de una empresa tradicional?'
    ]
  },
  {
    id: 'case_servant_leadership_nonprofit',
    title: 'Liderando con Servicio en "Fundación Esperanza"',
    scenario: '"Fundación Esperanza" es una ONG que trabaja con comunidades vulnerables. El director ejecutivo practica un estilo de Liderazgo Servidor, enfocándose en el crecimiento y bienestar de su equipo y de los beneficiarios de la fundación. Sin embargo, algunos miembros de la junta directiva cuestionan si este enfoque es lo suficientemente "firme" para alcanzar las metas de recaudación de fondos.',
    relatedTheoryIds: ['transformational_servant_leadership', 'behavioral', 'csr_sustainability'],
    guidingQuestions: [
      '¿Cuáles son los principios clave del Liderazgo Servidor que el director ejecutivo parece estar aplicando?',
      '¿Cómo puede el Liderazgo Servidor contribuir al éxito de una ONG como "Fundación Esperanza"?',
      '¿Cómo podría el director responder a las preocupaciones de la junta directiva sobre la "firmeza" de su liderazgo, sin abandonar sus principios?',
      '¿De qué manera este estilo de liderazgo se alinea con la misión y valores de una organización enfocada en el servicio social?'
    ]
  },
  {
    id: 'case_csr_fashion_brand',
    title: 'La Transformación Ética de "GlamourNow"',
    scenario: '"GlamourNow", una marca de moda rápida, ha sido objeto de intensas críticas por sus prácticas laborales en fábricas de países en desarrollo y por el impacto ambiental de sus procesos de producción. Las ventas han comenzado a caer. La empresa necesita desarrollar e implementar una estrategia de Sostenibilidad y Responsabilidad Social Corporativa (RSC) creíble.',
    relatedTheoryIds: ['csr_sustainability', 'strategic_mgmt', 'benchmarking'],
    guidingQuestions: [
      '¿Cuáles son los principales componentes de una estrategia de RSC integral que "GlamourNow" debería considerar (ej: ambiental, social, gobernanza)?',
      '¿Cómo puede la empresa asegurar la transparencia y la veracidad de sus iniciativas de RSC para evitar acusaciones de "greenwashing"?',
      '¿De qué manera la RSC puede pasar de ser un costo a ser una fuente de valor y ventaja competitiva para "GlamourNow"?',
      '¿Cómo se deberían involucrar los diferentes stakeholders (clientes, empleados, inversores, proveedores, ONGs) en el desarrollo e implementación de la estrategia de RSC?'
    ]
  },
  {
    id: 'case_agile_software_project',
    title: 'Entregando Valor en "AppMakers"',
    scenario: '"AppMakers" está desarrollando una nueva aplicación móvil compleja para un cliente importante. Los requisitos del cliente son vagos al principio y es probable que cambien a medida que avanza el proyecto. El equipo de desarrollo ha decidido adoptar un enfoque de Administración Ágil (utilizando Scrum) para gestionar el proyecto.',
    relatedTheoryIds: ['agile_mgmt', 'systems', 'org_learning'],
    guidingQuestions: [
      '¿Cómo ayudan los principios del Manifiesto Ágil a "AppMakers" a enfrentar la incertidumbre de los requisitos del cliente?',
      '¿Cuáles son los roles clave en Scrum (Product Owner, Scrum Master, Equipo de Desarrollo) y cuáles serían sus responsabilidades en este proyecto?',
      '¿Cómo funciona el ciclo de Sprint (planificación, ejecución, revisión, retrospectiva) para entregar valor de forma incremental y adaptarse a los cambios?',
      '¿Qué desafíos comunes podrían enfrentar al implementar Scrum por primera vez y cómo se podrían mitigar?'
    ]
  }
];

// Data for Quality Terms Module (ISO 9000:2015 based)
export const QUALITY_TERMS: QualityTerm[] = [
  {
    id: 'qt1',
    term: 'Calidad',
    definition: 'Grado en el que un conjunto de características inherentes de un objeto cumple con los requisitos.',
    category: 'Fundamentos y Vocabulario (ISO 9000:2015)',
  },
  {
    id: 'qt2',
    term: 'Requisito',
    definition: 'Necesidad o expectativa establecida, generalmente implícita u obligatoria.',
    category: 'Fundamentos y Vocabulario (ISO 9000:2015)',
  },
  {
    id: 'qt3',
    term: 'Sistema de Gestión',
    definition: 'Conjunto de elementos de una organización interrelacionados o que interactúan para establecer políticas, objetivos y procesos para lograr estos objetivos.',
    category: 'Fundamentos y Vocabulario (ISO 9000:2015)',
  },
  {
    id: 'qt4',
    term: 'Mejora Continua',
    definition: 'Actividad recurrente para mejorar el desempeño.',
    category: 'Principios de Gestión de la Calidad (ISO 9000:2015)',
  },
  {
    id: 'qt5',
    term: 'Cliente',
    definition: 'Persona u organización que podría recibir o que recibe un producto o un servicio destinado a esa persona u organización o requerido por ella.',
    category: 'Fundamentos y Vocabulario (ISO 9000:2015)',
  },
  {
    id: 'qt6',
    term: 'Acción Correctiva',
    definition: 'Acción para eliminar la causa de una no conformidad y evitar que vuelva a ocurrir.',
    category: 'Gestión de No Conformidades (ISO 9000:2015)',
  },
  {
    id: 'qt7',
    term: 'No Conformidad',
    definition: 'Incumplimiento de un requisito.',
    category: 'Fundamentos y Vocabulario (ISO 9000:2015)',
  },
];

// Data for KPI Module
export const KPI_SCENARIOS: KpiScenario[] = [
    {id: 'kpi1', title: 'Aumentar la Satisfacción del Cliente', description: 'Una tienda de comercio electrónico de moda quiere mejorar la lealtad de sus clientes y reducir el número de quejas. El objetivo principal es asegurarse de que los clientes estén más contentos con sus compras y el servicio recibido.'},
    {id: 'kpi2', title: 'Reducir los Tiempos de Entrega de Pedidos', description: 'Una empresa de logística busca optimizar sus rutas y procesos de almacén. El objetivo es que los paquetes lleguen a su destino final de manera más rápida y predecible, mejorando la eficiencia operativa.'},
    {id: 'kpi3', title: 'Mejorar el Rendimiento de Campañas de Marketing Digital', description: 'El equipo de marketing ha lanzado varias campañas en redes sociales para un nuevo producto. Necesitan medir de forma fiable qué campañas son más efectivas para atraer y convertir nuevos clientes.'},
    {id: 'kpi4', title: 'Incrementar la Productividad del Equipo de Desarrollo', description: 'Una empresa de software quiere mejorar la velocidad y la calidad de entrega de nuevas funcionalidades. El objetivo es que el equipo de desarrollo sea más productivo sin sacrificar la calidad del código.'},
];

// Data for SMART Goals Module
export const SMART_GOAL_SCENARIOS: SmartGoalScenario[] = [
    {id: 'sg1', title: 'Mejorar la Eficiencia de un Equipo de Soporte', context: 'Eres el líder de un equipo de soporte técnico. Has notado que el tiempo promedio de resolución de tickets es alto y la satisfacción del cliente ha disminuido. Quieres establecer una meta para mejorar esta situación.'},
    {id: 'sg2', title: 'Lanzar una Nueva Característica en un Producto de Software', context: 'Formas parte de un equipo de producto y planean desarrollar una nueva característica muy solicitada por los usuarios. Debes definir una meta para el equipo de desarrollo para este proyecto.'},
    {id: 'sg3', title: 'Aumentar las Ventas en una Región Específica', context: 'Eres el gerente regional de ventas para la zona norte. Las ventas en tu región han estado estancadas durante los últimos dos trimestres. Tu objetivo es revitalizar el crecimiento.'},
    {id: 'sg4', title: 'Desarrollo Profesional y Aprendizaje de Nuevas Habilidades', context: 'Eres un analista de marketing que quiere crecer profesionalmente. Te has dado cuenta de que las habilidades en análisis de datos son cada vez más importantes en tu campo y quieres adquirir nuevas competencias.'},
];
// Data for Automation Exercises Module
export const AUTOMATION_SCENARIOS: AutomationScenario[] = [
  {
    id: 'auto1',
    title: 'Proceso de Reporte de Gastos',
    processDescription: 'Un empleado necesita que le reembolsen los gastos de un viaje de negocios. El proceso actual es el siguiente:',
    steps: [
      { id: 's1-1', description: 'El empleado recopila recibos físicos y completa una hoja de cálculo de gastos.', automatable: false },
      { id: 's1-2', description: 'El empleado envía por correo electrónico la hoja de cálculo y las fotos de los recibos a su gerente.', automatable: true },
      { id: 's1-3', description: 'El gerente revisa el correo, verifica que los gastos se alineen con la política y responde con su aprobación.', automatable: false },
      { id: 's1-4', description: 'El empleado reenvía el correo de aprobación al departamento de finanzas.', automatable: true },
      { id: 's1-5', description: 'Finanzas introduce manualmente los datos de la hoja de cálculo en el sistema contable.', automatable: true },
      { id: 's1-6', description: 'Finanzas programa manualmente el pago para el próximo ciclo de pagos.', automatable: true }
    ]
  },
  {
    id: 'auto2',
    title: 'Onboarding de Nuevos Empleados',
    processDescription: 'Se ha contratado a una nueva persona y debe estar lista para su primer día. El proceso actual es el siguiente:',
    steps: [
      { id: 's2-1', description: 'Recursos Humanos (RRHH) envía manualmente el contrato por correo electrónico para su firma.', automatable: true },
      { id: 's2-2', description: 'Una vez firmado, RRHH crea manualmente el perfil del empleado en el sistema de información de RRHH (HRIS).', automatable: true },
      { id: 's2-3', description: 'RRHH envía un ticket por correo electrónico al departamento de TI para solicitar la creación de cuentas (email, software, etc.).', automatable: true },
      { id: 's2-4', description: 'RRHH notifica al gerente del nuevo empleado para que asigne un "buddy" o compañero de bienvenida.', automatable: false },
      { id: 's2-5', description: 'TI crea las cuentas y responde a RRHH con las credenciales.', automatable: true },
      { id: 's2-6', description: 'RRHH organiza una reunión de orientación para el primer día.', automatable: false }
    ]
  },
  {
    id: 'auto3',
    title: 'Gestión de Contenido para Redes Sociales',
    processDescription: 'Se necesita crear y publicar un informe semanal del rendimiento en redes sociales. El proceso actual es el siguiente:',
    steps: [
      { id: 's3-1', description: 'Un analista de marketing idea y escribe el texto para 5 publicaciones para la próxima semana.', automatable: false },
      { id: 's3-2', description: 'El analista busca y edita imágenes apropiadas para cada publicación.', automatable: false },
      { id: 's3-3', description: 'El gerente de marketing revisa y aprueba cada publicación y texto.', automatable: false },
      { id: 's3-4', description: 'El analista inicia sesión en cada plataforma de redes sociales (Facebook, Instagram, LinkedIn) varias veces al día para publicar en los horarios óptimos.', automatable: true },
      { id: 's3-5', description: 'Al final de la semana, el analista descarga manualmente informes de rendimiento de cada plataforma.', automatable: true },
      { id: 's3-6', description: 'El analista copia y pega los datos en una hoja de cálculo maestra para consolidar los resultados.', automatable: true }
    ]
  }
];

// Data for Skill Integration Module
export const SKILL_INTEGRATION_TOPICS: SkillIntegrationTopic[] = [
  {
    id: 'si1',
    title: 'Presentar Datos a una Audiencia No Técnica',
    concept: 'La habilidad de traducir análisis de datos complejos a una narrativa clara, convincente y accionable para líderes de negocio o equipos de marketing.',
    scenario: 'Has realizado un análisis de ventas detallado y descubriste una tendencia de disminución en un segmento de clientes clave. Debes presentar tus hallazgos a la junta directiva, la cual no tiene conocimientos estadísticos profundos. ¿Cómo estructurarías tu presentación de 5 minutos?',
    skillType: 'Technical influencing Soft'
  },
  {
    id: 'si2',
    title: 'Liderar un Proyecto Técnico con un Equipo Diverso',
    concept: 'Utilizar habilidades blandas como la comunicación, la empatía y la negociación para guiar a un equipo de especialistas (programadores, diseñadores, analistas) hacia un objetivo técnico común, gestionando conflictos y manteniendo la motivación.',
    scenario: 'Eres el líder de un proyecto para lanzar una nueva app. El diseñador de UI quiere una animación compleja que el desarrollador back-end argumenta que retrasará el lanzamiento un mes. ¿Cómo mediarías en esta situación para llegar a una solución que satisfaga los objetivos del proyecto?',
    skillType: 'Soft enabling Technical'
  },
  {
    id: 'si3',
    title: 'Dar Feedback Técnico Constructivo',
    concept: 'Combinar el conocimiento técnico para identificar errores o áreas de mejora en el trabajo de un colega con la inteligencia emocional para comunicar ese feedback de una manera que sea constructiva, respetuosa y que fortalezca la relación laboral.',
    scenario: 'Estás revisando el código de un colega y encuentras varias ineficiencias que podrían causar problemas de rendimiento a futuro. Este colega es conocido por ser sensible a las críticas. ¿Cómo iniciarías la conversación y qué dirías?',
    skillType: 'Technical influencing Soft'
  },
  {
    id: 'si4',
    title: 'Negociar Recursos para un Proyecto de Automatización',
    concept: 'Usar habilidades de persuasión y argumentación basadas en datos para convencer a la alta gerencia de que invierta en una nueva herramienta de software que automatizará un proceso manual, ahorrando tiempo y dinero a largo plazo.',
    scenario: 'Quieres que la empresa compre una licencia de software de RPA que cuesta $10,000 al año. El director financiero es escéptico sobre nuevos gastos. ¿Qué información recopilarías y cómo presentarías tu caso para obtener su aprobación?',
    skillType: 'Soft enabling Technical'
  }
];

// Data for Project Management Module
export const PROJECT_SIMULATIONS: ProjectSimulation[] = [
  {
    id: 'proj1',
    title: 'Lanzamiento de Campaña de Marketing',
    goal: 'Lanzar una campaña de marketing digital para nuestro nuevo producto "EcoBoost" en un plazo de 4 semanas, con el objetivo de generar 500 leads cualificados.',
    tasks: [
      { id: 't1-1', name: 'Definir Público Objetivo y Personas', description: 'Investigar y documentar el perfil del cliente ideal.', priority: 'Alta', estimatedHours: 8 },
      { id: 't1-2', name: 'Crear Contenido para la Campaña', description: 'Redactar textos para anuncios, posts en redes sociales y un artículo de blog.', priority: 'Alta', estimatedHours: 16 },
      { id: 't1-3', name: 'Diseñar Creatividades', description: 'Crear imágenes y videos para los anuncios y redes sociales.', priority: 'Alta', estimatedHours: 20 },
      { id: 't1-4', name: 'Configurar Landing Page', description: 'Desarrollar y publicar la página de destino para la captura de leads.', priority: 'Alta', estimatedHours: 12 },
      { id: 't1-5', name: 'Configurar Campañas de Anuncios', description: 'Implementar las campañas en Google Ads y Facebook Ads.', priority: 'Media', estimatedHours: 10 },
      { id: 't1-6', name: 'Plan de Email Marketing', description: 'Diseñar el flujo de correos para nutrir los leads generados.', priority: 'Media', estimatedHours: 8 },
      { id: 't1-7', name: 'A/B Testing de Anuncios', description: 'Preparar variantes de anuncios para optimizar el rendimiento.', priority: 'Baja', estimatedHours: 6 },
    ]
  },
  {
    id: 'proj2',
    title: 'Organización de Evento Corporativo Anual',
    goal: 'Organizar la conferencia anual de la empresa para 150 empleados y 50 clientes clave, asegurando una alta satisfacción de los asistentes y manteniéndose dentro del presupuesto de $20,000.',
    tasks: [
      { id: 't2-1', name: 'Definir Presupuesto Detallado', description: 'Desglosar todos los costos estimados del evento.', priority: 'Alta', estimatedHours: 10 },
      { id: 't2-2', name: 'Seleccionar y Reservar el Lugar', description: 'Investigar y contratar el espacio para el evento.', priority: 'Alta', estimatedHours: 15 },
      { id: 't2-3', name: 'Contratar Ponentes Principales', description: 'Contactar y confirmar a los oradores clave.', priority: 'Alta', estimatedHours: 18 },
      { id: 't2-4', name: 'Gestionar Proveedores', description: 'Contratar servicios de catering, audiovisuales y decoración.', priority: 'Media', estimatedHours: 20 },
      { id: 't2-5', name: 'Crear Agenda y Contenido', description: 'Definir el cronograma detallado de charlas y actividades.', priority: 'Media', estimatedHours: 12 },
      { id: 't2-6', name: 'Enviar Invitaciones y Gestionar RSVPs', description: 'Diseñar, enviar y rastrear las confirmaciones de asistencia.', priority: 'Media', estimatedHours: 8 },
      { id: 't2-7', name: 'Coordinar Voluntarios del Staff', description: 'Asignar roles y responsabilidades para el día del evento.', priority: 'Baja', estimatedHours: 6 },
    ]
  },
  {
    id: 'proj3',
    title: 'Línea de Producción de "Gadgets Eco"',
    goal: 'Establecer y optimizar una línea de producción para un nuevo gadget ecológico, produciendo 1000 unidades en el primer mes con menos de un 2% de tasa de defectos.',
    tasks: [
      { id: 't3-1', name: 'Adquisición de Materia Prima Sostenible', description: 'Identificar y negociar con proveedores de materiales reciclados.', priority: 'Alta', estimatedHours: 25 },
      { id: 't3-2', name: 'Calibración de Maquinaria de Ensamblaje', description: 'Ajustar y probar la maquinaria para el nuevo producto.', priority: 'Alta', estimatedHours: 16 },
      { id: 't3-3', name: 'Capacitación del Personal de Producción', description: 'Entrenar al equipo en los nuevos procedimientos de ensamblaje y calidad.', priority: 'Alta', estimatedHours: 12 },
      { id: 't3-4', name: 'Realizar Lote de Producción Piloto', description: 'Producir 50 unidades para pruebas y detección de problemas.', priority: 'Media', estimatedHours: 20 },
      { id: 't3-5', name: 'Definir Protocolo de Control de Calidad (QC)', description: 'Establecer puntos de inspección y criterios de aceptación/rechazo.', priority: 'Media', estimatedHours: 10 },
      { id: 't3-6', name: 'Diseñar Empaquetado y Logística de Salida', description: 'Crear empaquetado eficiente y coordinar con transportistas.', priority: 'Baja', estimatedHours: 15 },
    ]
  }
];

// Data for Discussion Forum Module
export const DEBATE_TOPICS: DebateTopic[] = [
    {
        id: 'dt1',
        title: '¿Es el trabajo 100% remoto el futuro para todas las empresas?',
        description: 'La pandemia aceleró la adopción del trabajo remoto. Ahora, muchas empresas debaten si mantenerlo de forma permanente, volver a la oficina o adoptar un modelo híbrido. ¿Cuáles son los verdaderos beneficios y desventajas a largo plazo?',
        aiPersonas: [
            { name: 'Ana, la defensora del trabajo flexible', stance: 'Cree que el trabajo remoto aumenta la productividad, el bienestar del empleado y permite acceder a talento global. Minimiza los desafíos.' },
            { name: 'Roberto, el gerente de operaciones tradicional', stance: 'Le preocupa la cultura de la empresa, la colaboración espontánea y la dificultad para supervisar el rendimiento a distancia. Valora la interacción cara a cara.' },
            { name: 'Sofía, la empleada joven', stance: 'Busca flexibilidad y equilibrio vida-trabajo, pero también le preocupa perder oportunidades de mentoría y socialización al no estar en la oficina.' }
        ]
    },
    {
        id: 'dt2',
        title: '¿Debería la IA reemplazar roles de nivel de entrada?',
        description: 'Con los avances en IA, muchas tareas de análisis, redacción y atención al cliente de nivel de entrada pueden ser automatizadas. ¿Deberían las empresas adoptar agresivamente esta tecnología, o tienen la responsabilidad de preservar estos empleos como un punto de entrada crucial a la fuerza laboral?',
        aiPersonas: [
            { name: 'Carlos, el CFO escéptico', stance: 'Está enfocado puramente en el ROI. Si la IA reduce costos y aumenta la eficiencia, apoya su implementación masiva. Cuestiona los costos a largo plazo del capital humano.' },
            { name: 'Laura, la gerente de RRHH', stance: 'Le preocupa el desarrollo de talento a largo plazo y la moral de la empresa. Cree que los roles de nivel de entrada son esenciales para formar a los futuros líderes.' },
            { name: 'David, el especialista en ética tecnológica', stance: 'Plantea preguntas sobre el impacto social del desplazamiento masivo de empleos y el sesgo algorítmico. Pide una implementación más cautelosa y regulada.' }
        ]
    },
    {
        id: 'dt3',
        title: '¿Son los programas de "bienestar" una solución real o un parche?',
        description: 'Las empresas invierten cada vez más en apps de meditación, clases de yoga y días libres de salud mental. ¿Son estas iniciativas una forma genuina de combatir el burnout, o simplemente un parche que evita abordar las causas raíz del estrés laboral, como la sobrecarga de trabajo y la mala gestión?',
        aiPersonas: [
            { name: 'Elena, la líder de "People & Culture"', stance: 'Defiende estos programas como herramientas valiosas que demuestran que la empresa se preocupa. Cree que empoderan a los empleados para gestionar su propio bienestar.' },
            { name: 'Marcos, el empleado cínico', stance: 'Ve estos beneficios como una distracción. Preferiría tener menos reuniones, una carga de trabajo más razonable y una mejor compensación en lugar de una suscripción a una app de meditación.' },
            { name: 'Isabel, la consultora de productividad', stance: 'Argumenta que el verdadero bienestar proviene de procesos de trabajo eficientes, expectativas claras y una cultura de desconexión real, y que los programas de bienestar son inútiles sin estos fundamentos.' }
        ]
    }
];

// Data for SWOT Analysis Module
export const SWOT_SCENARIOS: SwotScenario[] = [
    {
        id: 'swot1',
        title: 'Cafetería Local "El Rincón del Café"',
        scenario: 'Eres el dueño de "El Rincón del Café", una pequeña cafetería independiente en un barrio concurrido. Tienes una base de clientes leales que adoran tu café de especialidad y el ambiente acogedor. Sin embargo, tus precios son ligeramente más altos que los de la competencia y tu espacio es limitado, lo que a veces disuade a grupos grandes. Recientemente, se ha anunciado la apertura de una gran cadena de cafeterías a dos cuadras de distancia. Al mismo tiempo, ha aumentado el interés local por los productos artesanales y sostenibles, y hay una nueva ley municipal que ofrece incentivos fiscales a los pequeños negocios que implementen prácticas ecológicas.'
    },
    {
        id: 'swot2',
        title: 'Gimnasio "Fitness Total"',
        scenario: 'Gestionas "Fitness Total", un gimnasio tradicional bien equipado con máquinas de pesas y cardio. Tu equipo de entrenadores está muy cualificado y tiene una excelente reputación. No obstante, las instalaciones son algo anticuadas y no ofreces clases en línea, una tendencia en auge. La competencia principal es un nuevo gimnasio boutique que se especializa en clases de alto impacto como HIIT y CrossFit, atrayendo a un público más joven. Existe una creciente conciencia sobre la salud y el bienestar en la ciudad, y las empresas locales están buscando paquetes de membresía corporativa para sus empleados.'
    },
    {
        id: 'swot3',
        title: 'Librería Independiente "Páginas Vivas"',
        scenario: '"Páginas Vivas" es una librería con una cuidada selección de libros y un personal experto que ofrece recomendaciones personalizadas. Organiza eventos literarios que atraen a la comunidad. Sin embargo, su presencia en línea es casi nula y no tiene un sistema de venta por internet. El mercado está dominado por gigantes del comercio electrónico que ofrecen grandes descuentos y envíos rápidos. Hay un movimiento cultural en la ciudad que promueve el consumo local y la valoración de los espacios culturales independientes. Además, una nueva tecnología permite a las pequeñas tiendas crear fácilmente plataformas de e-commerce a bajo costo.'
    },
    {
        id: 'swot4',
        title: 'Startup Tecnológica "CodeStream"',
        scenario: 'Eres el fundador de "CodeStream", una startup que ha desarrollado una innovadora herramienta de colaboración para programadores. El software es más rápido y eficiente que los competidores existentes. Sin embargo, tu equipo es pequeño, no tienes presupuesto de marketing y la marca es completamente desconocida. Grandes empresas tecnológicas como Microsoft (con GitHub) y Atlassian (con Bitbucket) dominan el mercado. Hay una creciente demanda de herramientas de desarrollo remoto y una comunidad de código abierto muy activa que podría adoptar tu producto si lo descubren.'
    },
    {
        id: 'swot5',
        title: 'Restaurante Familiar "La Nonna"',
        scenario: 'Administras "La Nonna", un restaurante italiano con 50 años de historia y recetas familiares secretas que los clientes aman. Tu ubicación es céntrica pero el local es antiguo y necesita remodelación. No tienes servicio a domicilio propio. En el último año, han surgido varias "cocinas fantasma" (ghost kitchens) en tu área que ofrecen precios muy bajos a través de apps de delivery como Rappi y Uber Eats. También hay un creciente interés en la comida "auténtica" y experiencias gastronómicas locales, y un bloguero de comida muy popular ha mostrado interés en visitar tu restaurante.'
    },
    {
        id: 'swot6',
        title: 'ONG - Refugio de Animales "Patitas Seguras"',
        scenario: 'Diriges "Patitas Seguras", una organización sin fines de lucro que rescata animales. Cuentas con un equipo de voluntarios muy dedicados y una fuerte presencia en redes sociales que genera muchas adopciones. Sin embargo, dependes completamente de donaciones irregulares y el espacio del refugio es alquilado y costoso. El gobierno local acaba de anunciar recortes en los subsidios para ONGs, pero también ha lanzado una campaña de concienciación sobre la tenencia responsable de mascotas que podría aumentar el número de voluntarios y donantes individuales.'
    },
    {
        id: 'swot7',
        title: 'Diseñador Gráfico Freelance',
        scenario: 'Eres un diseñador gráfico freelance con un portafolio impresionante y habilidades avanzadas en software de diseño. Te destacas por tu creatividad y atención al detalle. Sin embargo, te cuesta encontrar clientes estables y sientes que tu marketing personal es débil. Plataformas como Fiverr y Upwork están llenas de diseñadores que ofrecen servicios a precios extremadamente bajos. Al mismo tiempo, el contenido visual se ha vuelto crucial para el marketing digital, y muchas pequeñas empresas locales están buscando mejorar su imagen de marca y no saben dónde encontrar talento de calidad.'
    },
    {
        id: 'swot8',
        title: 'Granja Orgánica "Tierra Viva"',
        scenario: 'Eres propietario de "Tierra Viva", una pequeña granja que produce vegetales orgánicos de alta calidad. Tus métodos de cultivo son sostenibles y tienes una certificación orgánica que inspira confianza. El problema es que la granja está lejos de la ciudad, lo que encarece y complica la logística de entrega. Compites con grandes supermercados que han empezado a ofrecer sus propias líneas "orgánicas" a precios más bajos. Hay una tendencia creciente de "mercados de agricultores" en la ciudad y un nuevo programa gubernamental que apoya a los productores locales con subsidios para el transporte.'
    },
    {
        id: 'swot9',
        title: 'Agencia de Ecoturismo "Aventura Natural"',
        scenario: 'Tu agencia, "Aventura Natural", ofrece tours de senderismo y avistamiento de aves en una reserva natural remota y espectacular. Tus guías son biólogos expertos, ofreciendo una experiencia educativa única. El acceso a la zona es difícil y dependes de un único hotel local para alojar a los turistas. La inestabilidad económica global ha reducido el turismo internacional. Sin embargo, el turismo nacional está en auge, con personas buscando escapadas a la naturaleza lejos de las multitudes. Además, una aerolínea de bajo costo está considerando abrir una nueva ruta a una ciudad cercana.'
    },
    {
        id: 'swot10',
        title: 'App de Finanzas Personales "FinTech-Ahora"',
        scenario: 'Has lanzado "FinTech-Ahora", una app móvil que utiliza inteligencia artificial para dar consejos de ahorro personalizados, una característica única en el mercado. El diseño de la app es moderno y fácil de usar. Sin embargo, no tienes una gran base de usuarios y la gente es muy desconfiada a la hora de compartir sus datos financieros con una app nueva. Las regulaciones para las empresas fintech son cada vez más estrictas y costosas de cumplir. Hay un creciente interés en la educación financiera entre los millennials y la Generación Z, y podrías asociarte con influencers de finanzas para ganar credibilidad.'
    }
];

// Data for Strategic Planning Module
export const STRATEGIC_PLANNING_SCENARIOS: StrategicPlanningScenario[] = [
    {
        id: 'plan1',
        title: 'EcoRide - Bicicletas Eléctricas Urbanas',
        scenario: 'Eres el fundador de "EcoRide", una startup que diseña y vende bicicletas eléctricas plegables para habitantes de la ciudad. El mercado de la movilidad sostenible está en auge. Tu producto es innovador, pero la competencia de marcas establecidas es fuerte y los costos de producción son altos. Necesitas un plan estratégico claro para asegurar la financiación y guiar el crecimiento de la empresa durante los próximos tres años.'
    },
    {
        id: 'plan2',
        title: 'Sabor Local - Servicio de Suscripción de Comida',
        scenario: 'Diriges "Sabor Local", un servicio que entrega cajas de suscripción semanales con ingredientes frescos de agricultores locales. Tienes una base de clientes leales pero pequeña. Quieres expandirte a ciudades vecinas y mejorar tu plataforma tecnológica para ofrecer más personalización. Debes crear un plan estratégico que aborde el crecimiento, la logística y la competencia de grandes supermercados que ahora ofrecen servicios similares.'
    },
    {
        id: 'plan3',
        title: 'Codify - Academia de Programación para Niños',
        scenario: '"Codify" es una academia que enseña programación y robótica a niños de 8 a 14 años en un local físico. La demanda es alta, pero estás limitado por el espacio y el número de instructores. Estás considerando lanzar cursos en línea y un modelo de franquicia para escalar el negocio a nivel nacional. Tu plan estratégico debe definir el camino a seguir, manteniendo la alta calidad educativa que te caracteriza.'
    }
];