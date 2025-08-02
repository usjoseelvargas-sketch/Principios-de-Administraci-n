import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { NavItem } from '../types';
import { APP_TITLE, HomeIcon, SimulationIcon, AnalyticsIcon, StrategyIcon, ProcessIcon, HRIcon, BookOpenIcon, QualityCheckIcon, UniversidadElBosqueLogo, TrendingUpIcon, TargetIcon, AutomationIcon, PuzzlePieceIcon, ProjectManagementIcon, ForumIcon, PencilSquareIcon, AcademicCapIcon, SwotIcon, CompassIcon } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
}

const navItems: NavItem[] = [
  { name: 'Inicio', path: '/', icon: <HomeIcon className="w-5 h-5" /> },
  { name: 'Mapa Curricular', path: '/curriculum-map', icon: <AcademicCapIcon className="w-5 h-5" /> },
  { name: 'Simulación Empresarial', path: '/simulation', icon: <SimulationIcon className="w-5 h-5" /> },
  { name: 'Análisis Financiero', path: '/analytics', icon: <AnalyticsIcon className="w-5 h-5" /> },
  { name: 'Principios Estratégicos', path: '/strategy', icon: <StrategyIcon className="w-5 h-5" /> },
  { name: 'Planificación Estratégica', path: '/strategic-planning', icon: <CompassIcon className="w-5 h-5" /> },
  { name: 'Análisis DOFA', path: '/swot-analysis', icon: <SwotIcon className="w-5 h-5" /> },
  { name: 'Teorías de Administración', path: '/theories', icon: <BookOpenIcon className="w-5 h-5" /> },
  { name: 'Optimización de Procesos', path: '/processes', icon: <ProcessIcon className="w-5 h-5" /> },
  { name: 'Definición de KPIs', path: '/kpis', icon: <TrendingUpIcon className="w-5 h-5" /> },
  { name: 'Metas SMART', path: '/smart-goals', icon: <TargetIcon className="w-5 h-5" /> },
  { name: 'Automatización de Tareas', path: '/automation', icon: <AutomationIcon className="w-5 h-5" /> },
  { name: 'Gestión de Proyectos', path: '/project-management', icon: <ProjectManagementIcon className="w-5 h-5" /> },
  { name: 'Términos de Calidad', path: '/quality-terms', icon: <QualityCheckIcon className="w-5 h-5" /> }, 
  { name: 'Gestión del Talento', path: '/hr', icon: <HRIcon className="w-5 h-5" /> },
  { name: 'Integración de Habilidades', path: '/skills-integration', icon: <PuzzlePieceIcon className="w-5 h-5" /> },
  { name: 'Ortografía y Gramática', path: '/orthography', icon: <PencilSquareIcon className="w-5 h-5" /> },
  { name: 'Foros de Debate', path: '/forums', icon: <ForumIcon className="w-5 h-5" /> },
];

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-neutral-100">
      {/* Sidebar */}
      <aside className={`bg-neutral-800 text-neutral-100 w-72 flex flex-col py-7 px-2 absolute inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition duration-200 ease-in-out z-30 shadow-lg`}>
        <div className="px-4 flex items-center space-x-3 mb-6 flex-shrink-0">
          <UniversidadElBosqueLogo className="w-10 h-10 flex-shrink-0" />
          <div>
            <h2 className="text-lg font-semibold text-white leading-tight">{APP_TITLE}</h2>
            {/* APP_SUBTITLE removed from display */}
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center space-x-3 py-3 px-4 rounded-lg transition-colors duration-150 hover:bg-neutral-700 ${
                  isActive ? 'bg-primary text-white shadow-md' : 'hover:text-primary-light'
                }`
              }
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar for mobile */}
        <header className="md:hidden bg-white shadow-md p-4 flex justify-between items-center z-20">
          <div className="flex items-center space-x-2">
            <UniversidadElBosqueLogo className="w-8 h-8 flex-shrink-0" />
            <span className="text-md font-bold text-primary leading-tight">{APP_TITLE}</span>
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-neutral-700 focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={sidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
            </svg>
          </button>
        </header>
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-neutral-100 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;