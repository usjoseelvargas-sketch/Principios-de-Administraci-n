import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import BusinessSimulationPage from './pages/BusinessSimulationPage';
import FinancialAnalyticsPage from './pages/FinancialAnalyticsPage';
import StrategicPrinciplesPage from './pages/StrategicPrinciplesPage';
import ProcessOptimizationPage from './pages/ProcessOptimizationPage';
import TalentManagementPage from './pages/TalentManagementPage';
import AdministrativeTheoriesPage from './pages/AdministrativeTheoriesPage';
import QualityTermsPage from './pages/QualityTermsPage'; // Import the new page
import KpiTrackingPage from './pages/KpiTrackingPage';
import SmartGoalsPage from './pages/SmartGoalsPage';
import AutomationExercisesPage from './pages/AutomationExercisesPage';
import SkillIntegrationPage from './pages/SkillIntegrationPage';
import ProjectManagementPage from './pages/ProjectManagementPage';
import DiscussionForumPage from './pages/DiscussionForumPage';
import OrthographyPracticePage from './pages/OrthographyPracticePage';
import SwotAnalysisPage from './pages/SwotAnalysisPage';
import CurriculumMapPage from './pages/CurriculumMapPage';
import StrategicPlanningPage from './pages/StrategicPlanningPage';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/simulation" element={<BusinessSimulationPage />} />
          <Route path="/analytics" element={<FinancialAnalyticsPage />} />
          <Route path="/strategy" element={<StrategicPrinciplesPage />} />
          <Route path="/theories" element={<AdministrativeTheoriesPage />} />
          <Route path="/processes" element={<ProcessOptimizationPage />} />
          <Route path="/kpis" element={<KpiTrackingPage />} />
          <Route path="/smart-goals" element={<SmartGoalsPage />} />
          <Route path="/automation" element={<AutomationExercisesPage />} />
          <Route path="/hr" element={<TalentManagementPage />} />
          <Route path="/quality-terms" element={<QualityTermsPage />} />
          <Route path="/skills-integration" element={<SkillIntegrationPage />} />
          <Route path="/project-management" element={<ProjectManagementPage />} />
          <Route path="/forums" element={<DiscussionForumPage />} />
          <Route path="/orthography" element={<OrthographyPracticePage />} />
          <Route path="/swot-analysis" element={<SwotAnalysisPage />} />
          <Route path="/strategic-planning" element={<StrategicPlanningPage />} />
          <Route path="/curriculum-map" element={<CurriculumMapPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;