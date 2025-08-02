import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { ModuleCardProps } from '../types';
import { HomeIcon, SimulationIcon, AnalyticsIcon, StrategyIcon, ProcessIcon, HRIcon, BookOpenIcon, ChevronRightIcon, LightbulbIcon, QualityCheckIcon, TrendingUpIcon, TargetIcon, AutomationIcon, PuzzlePieceIcon, ProjectManagementIcon, ForumIcon, PencilSquareIcon, AcademicCapIcon, SwotIcon, CompassIcon } from '../constants';

const modules: ModuleCardProps[] = [
  {
    title: 'Mapa Curricular',
    description: 'Visualiza cómo los temas del curso se conectan y desarrollan a través de los módulos interactivos de la plataforma.',
    navigateTo: '/curriculum-map',
    icon: <AcademicCapIcon className="w-12 h-12 text-primary" />,
  },
  {
    title: 'Simulación Empresarial',
    description: 'Toma decisiones en escenarios virtuales y observa su implicación en la creación de valor, eficiencia y eficacia.',
    navigateTo: '/simulation',
    icon: <SimulationIcon className="w-12 h-12 text-primary" />,
  },
  {
    title: 'Análisis y Control Financiero',
    description: 'Domina el control financiero, analiza estados de resultados y toma decisiones basadas en datos con ejercicios prácticos.',
    navigateTo: '/analytics',
    icon: <AnalyticsIcon className="w-12 h-12 text-primary" />,
  },
  {
    title: 'Planificación Estratégica',
    description: 'Define la misión, visión, objetivos y planes de acción para un negocio en un escenario simulado.',
    navigateTo: '/strategic-planning',
    icon: <CompassIcon className="w-12 h-12 text-primary" />,
  },
  {
    title: 'Análisis DOFA (SWOT)',
    description: 'Analiza escenarios de negocio para identificar Fortalezas, Oportunidades, Debilidades y Amenazas.',
    navigateTo: '/swot-analysis',
    icon: <SwotIcon className="w-12 h-12 text-primary" />,
  },
  {
    title: 'Principios de Planeación Estratégica',
    description: 'Aprende sobre el proceso de planeación, los principios de la administración moderna y casos de éxito de empresas líderes.',
    navigateTo: '/strategy',
    icon: <StrategyIcon className="w-12 h-12 text-primary" />,
  },
  {
    title: 'Teorías y Organización',
    description: 'Estudia la evolución del pensamiento administrativo (Taylor, Fayol, etc.) y los modelos de estructura organizacional.',
    navigateTo: '/theories',
    icon: <BookOpenIcon className="w-12 h-12 text-primary" />,
  },
  {
    title: 'Optimización de Procesos',
    description: 'Simula la gestión de PQRS y aprende sobre la automatización de tareas para mejorar la eficiencia operativa y productividad.',
    navigateTo: '/processes',
    icon: <ProcessIcon className="w-12 h-12 text-primary" />,
  },
  {
    title: 'Definición de KPIs (Control)',
    description: 'Aprende a definir y evaluar Indicadores Clave de Desempeño (KPIs) como herramienta de control estratégico.',
    navigateTo: '/kpis',
    icon: <TrendingUpIcon className="w-12 h-12 text-primary" />,
  },
   {
    title: 'Metas SMART (Planeación)',
    description: 'Aprende a formular objetivos Específicos, Medibles, Alcanzables, Relevantes y con Plazo, un elemento clave de la planeación.',
    navigateTo: '/smart-goals',
    icon: <TargetIcon className="w-12 h-12 text-primary" />,
  },
  {
    title: 'Automatización de Tareas',
    description: 'Analiza procesos de negocio, identifica oportunidades de automatización y justifica el impacto en la eficiencia.',
    navigateTo: '/automation',
    icon: <AutomationIcon className="w-12 h-12 text-primary" />,
  },
   {
    title: 'Gestión y Control de Proyectos',
    description: 'Organiza tareas, establece prioridades y ejerce el control sobre el alcance, tiempo y recursos de un proyecto.',
    navigateTo: '/project-management',
    icon: <ProjectManagementIcon className="w-12 h-12 text-primary" />,
  },
  {
    title: 'Gestión de la Calidad Total',
    description: 'Aprende términos de ISO 9000 y los fundamentos de la Gestión de la Calidad Total. Explícalos y recibe feedback.',
    navigateTo: '/quality-terms',
    icon: <QualityCheckIcon className="w-12 h-12 text-primary" />,
  },
  {
    title: 'Dirección y Talento Humano',
    description: 'Desarrolla habilidades de liderazgo, motivación y gestión ética del talento en entornos colaborativos y de cambio.',
    navigateTo: '/hr',
    icon: <HRIcon className="w-12 h-12 text-primary" />,
  },
   {
    title: 'Integración de Habilidades',
    description: 'Practica cómo combinar habilidades técnicas y blandas para resolver problemas complejos del mundo real y profesional.',
    navigateTo: '/skills-integration',
    icon: <PuzzlePieceIcon className="w-12 h-12 text-primary" />,
  },
  {
    title: 'Ortografía y Gramática',
    description: 'Recibe un tema, escribe un párrafo y obtén un análisis detallado de tu escritura, incluyendo ortografía, gramática y estructura.',
    navigateTo: '/orthography',
    icon: <PencilSquareIcon className="w-12 h-12 text-primary" />,
  },
  {
    title: 'Foros de Debate Guiados',
    description: 'Defiende tu postura sobre temas de gestión controvertidos (cultura, ambiente organizacional) frente a personalidades de IA.',
    navigateTo: '/forums',
    icon: <ForumIcon className="w-12 h-12 text-primary" />,
  },
];

const ModuleDisplayCard: React.FC<ModuleCardProps> = ({ title, description, navigateTo, icon }) => {
  const navigate = useNavigate();
  return (
    <Card className="hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between">
      <div>
        <div className="flex justify-center mb-4 text-primary">{icon || <LightbulbIcon className="w-12 h-12" />}</div>
        <h3 className="text-xl font-semibold text-neutral-800 mb-2 text-center">{title}</h3>
        <p className="text-neutral-600 text-sm mb-4 text-center">{description}</p>
      </div>
      <div className="mt-auto pt-4">
        <Button onClick={() => navigate(navigateTo)} variant="outline" className="w-full" rightIcon={<ChevronRightIcon className="w-4 h-4"/>}>
          Explorar Módulo
        </Button>
      </div>
    </Card>
  );
};

const HomePage: React.FC = () => {
  return (
    <PageWrapper title="Bienvenidos al curso de Principios de Administración y Organizaciones" titleIcon={<HomeIcon />} subtitle="Tu plataforma interactiva para dominar los principios de administración.">
      <div className="text-center mb-10">
        <p className="text-lg text-neutral-700 max-w-3xl mx-auto">
          "Principios" es una herramienta didáctica activa y experiencial diseñada para cerrar la brecha entre la teoría y la práctica en la administración. 
          Explora nuestros módulos interactivos, participa en simulaciones y desarrolla habilidades esenciales para tu futuro profesional.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {modules.map((module) => (
          <ModuleDisplayCard key={module.title} {...module} />
        ))}
      </div>
    </PageWrapper>
  );
};

export default HomePage;