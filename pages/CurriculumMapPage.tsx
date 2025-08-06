import React from 'react';
import PageWrapper from '../components/PageWrapper';
import Card from '../components/ui/Card';
import { AcademicCapIcon } from '../constants';
import { Link } from 'react-router-dom';

// Datos del mapa curricular. Esta estructura es correcta para su propósito.
const curriculumData = [
    {
        mainTopic: 'Introducción a la administración y las Organizaciones',
        subTopics: [
            { name: 'Definición de administración y organización', coverage: <ul><li><Link to="/theories"><strong>Teorías de Administración:</strong></Link> Se exploran las definiciones clásicas y modernas a través del estudio de diferentes escuelas de pensamiento.</li><li><Link to="/"><strong>Inicio:</strong></Link> La página de bienvenida introduce el propósito general de la administración.</li></ul> },
            { name: 'Partes interesadas y Ambiente Organizacional', coverage: <ul><li><Link to="/forums"><strong>Foros de Debate:</strong></Link> Se discuten temas como la cultura y el ambiente laboral, involucrando a diferentes 'stakeholders' de IA.</li><li><Link to="/strategy"><strong>Principios Estratégicos:</strong></Link> Se analiza el entorno como parte fundamental de la planeación.</li></ul> },
            { name: 'Productividad, eficiencia y eficacia', coverage: <ul><li><Link to="/simulation"><strong>Simulación Empresarial:</strong></Link> Las decisiones del estudiante impactan directamente en estos indicadores.</li><li><Link to="/processes"><strong>Optimización de Procesos:</strong></Link> Se enfoca en mejorar la eficiencia operativa.</li><li><Link to="/automation"><strong>Automatización de Tareas:</strong></Link> Se practica la mejora de la productividad mediante la automatización.</li></ul> },
            { name: 'Creación de Valor', coverage: <ul><li><Link to="/simulation"><strong>Simulación Empresarial:</strong></Link> Es el eje central, donde las decisiones estratégicas buscan maximizar el valor.</li></ul> },
            { name: 'Evolución del pensamiento administrativo', coverage: <ul><li><Link to="/theories"><strong>Teorías de Administración:</strong></Link> Módulo dedicado íntegramente a explorar la historia y evolución de las teorías administrativas (Taylor, Fayol, Mayo, Weber, etc.).</li></ul> },
        ]
    },
    {
        mainTopic: 'Planeación',
        subTopics: [
            { name: 'Elementos de la Planeación', coverage: <ul><li><Link to="/smart-goals"><strong>Metas SMART:</strong></Link> Módulo enfocado en la formulación de objetivos, un elemento clave de la planeación.</li><li><Link to="/project-management"><strong>Gestión de Proyectos:</strong></Link> Se practica la planificación de tareas, recursos y tiempos.</li></ul> },
            { name: 'Proceso de planeación estratégica', coverage: <ul><li><Link to="/strategic-planning"><strong>Planificación Estratégica:</strong></Link> Módulo práctico para definir misión, visión, políticas, objetivos y planes de acción.</li><li><Link to="/strategy"><strong>Principios Estratégicos:</strong></Link> Se exploran los fundamentos y el proceso de la planeación estratégica.</li><li><Link to="/simulation"><strong>Simulación Empresarial:</strong></Link> Requiere que el estudiante aplique un pensamiento de planeación estratégica para tomar decisiones a largo plazo.</li><li><Link to="/swot-analysis"><strong>Análisis DOFA:</strong></Link> Se practica el análisis de escenarios de negocio para identificar Fortalezas, Oportunidades, Debilidades y Amenazas.</li></ul> },
        ]
    },
    {
        mainTopic: 'Organización',
        subTopics: [
            { name: 'Teoría, diseño y cambio organizacionales', coverage: <ul><li><Link to="/theories"><strong>Teorías de Administración:</strong></Link> Cubre las teorías de estructura, burocracia y sistemas que fundamentan el diseño organizacional.</li></ul> },
            { name: 'Estructura organizacional (funcional, divisional)', coverage: <ul><li><Link to="/theories"><strong>Teorías de Administración:</strong></Link> Incluye casos de estudio que abordan dilemas sobre la elección de la estructura organizacional.</li></ul> },
            { name: 'Cultura organizacional', coverage: <ul><li><Link to="/forums"><strong>Foros de Debate:</strong></Link> Se debaten temas directamente relacionados con la cultura de la empresa.</li><li><Link to="/hr"><strong>Gestión del Talento:</strong></Link> Los dilemas éticos y de gestión impactan y son impactados por la cultura.</li></ul> },
            { name: 'Funciones organizacionales', coverage: <ul><li>Este es un tema transversal que se observa en la práctica en módulos como <Link to="/processes"><strong>Optimización de Procesos</strong></Link>, <Link to="/analytics"><strong>Análisis Financiero</strong></Link>, y <Link to="/hr"><strong>Gestión del Talento</strong></Link>.</li></ul> },
        ]
    },
     {
        mainTopic: 'Dirección',
        subTopics: [
            { name: 'Creación y administración de la cultura organizacional', coverage: <ul><li><Link to="/forums"><strong>Foros de Debate:</strong></Link> Se discuten activamente los componentes y dilemas de la cultura.</li><li><Link to="/hr"><strong>Gestión del Talento:</strong></Link> Se abordan escenarios donde las decisiones de liderazgo moldean la cultura.</li></ul> },
            { name: 'Liderazgo', coverage: <ul><li><Link to="/hr"><strong>Gestión del Talento:</strong></Link> Se presentan dilemas que requieren liderazgo ético.</li><li><Link to="/skills-integration"><strong>Integración de Habilidades:</strong></Link> Contiene escenarios sobre cómo liderar equipos técnicos.</li><li><Link to="/theories"><strong>Teorías de Administración:</strong></Link> Se estudian las teorías del liderazgo (Transformacional, Servidor, etc.).</li></ul> },
            { name: 'Motivación', coverage: <ul><li><Link to="/hr"><strong>Gestión del Talento:</strong></Link> Se exploran escenarios que afectan la moral y motivación del equipo.</li><li><Link to="/theories"><strong>Teorías de Administración:</strong></Link> Se cubren teorías de la motivación (Maslow, Herzberg, etc.) en el módulo de Teoría del Comportamiento.</li></ul> },
        ]
    },
    {
        mainTopic: 'Control',
        subTopics: [
            { name: 'La naturaleza y propósito del control', coverage: <ul><li><Link to="/kpis"><strong>Definición de KPIs:</strong></Link> Módulo centrado en el control a través de indicadores.</li><li><Link to="/project-management"><strong>Gestión de Proyectos:</strong></Link> El tablero Kanban y el plan de acción son herramientas de control directo.</li></ul> },
            { name: 'Control financiero', coverage: <ul><li><Link to="/analytics"><strong>Análisis Financiero:</strong></Link> Módulo dedicado exclusivamente al control a través de herramientas y problemas financieros.</li></ul> },
            { name: 'Control Estratégico', coverage: <ul><li><Link to="/kpis"><strong>Definición de KPIs:</strong></Link> Herramienta principal para el seguimiento y control de la estrategia.</li><li><Link to="/strategy"><strong>Principios Estratégicos:</strong></Link> Se aprende a formular la estrategia que luego será objeto de control.</li></ul> },
            { name: 'Gestión de la Calidad Total (TQM)', coverage: <ul><li><Link to="/quality-terms"><strong>Términos de Calidad:</strong></Link> Introduce el vocabulario de ISO 9000, base de TQM.</li><li><Link to="/theories"><strong>Teorías de Administración:</strong></Link> TQM se incluye como una de las teorías administrativas a estudiar.</li></ul> },
            { name: 'Tipos de Producción', coverage: <ul><li><Link to="/project-management"><strong>Gestión de Proyectos:</strong></Link> Incluye una simulación de optimización de una línea de producción.</li><li><Link to="/theories"><strong>Teorías de Administración:</strong></Link> Se estudia la Teoría de las Restricciones (TOC), aplicable a la gestión de la producción.</li></ul> },
        ]
    }
];


const CurriculumMapPage: React.FC = () => {
    return (
        <PageWrapper title="Mapa Curricular" titleIcon={<AcademicCapIcon />} subtitle="Una vista detallada de cómo los temas del curso se abordan en la plataforma interactiva.">
            <Card>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-neutral-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Tema Principal</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Subtema</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Módulos Relevantes y Cobertura</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {curriculumData.map((main) => (
                                main.subTopics.map((sub, subIndex) => (
                                    <tr key={`${main.mainTopic}-${sub.name}`} className="hover:bg-neutral-50">
                                        {subIndex === 0 && (
                                            <td rowSpan={main.subTopics.length} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 align-top border-r">{main.mainTopic}</td>
                                        )}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 align-top">{sub.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 align-top">
                                            <div className="prose prose-sm max-w-none [&_a]:text-primary [&_a:hover]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1">
                                                {sub.coverage}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </PageWrapper>
    );
};

export default CurriculumMapPage;
