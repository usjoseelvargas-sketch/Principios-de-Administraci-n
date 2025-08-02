import React, { useState, useCallback } from 'react';
import PageWrapper from '../components/PageWrapper';
import InteractiveModule from '../components/InteractiveModule';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Card from '../components/ui/Card';
import { SimulationIcon, LightbulbIcon, CheckCircleIcon, XCircleIcon } from '../constants';
import { useGeminiTextQuery } from '../hooks/useGeminiQuery';
import { SimulationResult } from '../types';

interface DecisionOption {
  id: string;
  text: string;
}

interface Scenario {
  id: string;
  title: string;
  description: string;
  options: DecisionOption[];
  kpiNames: string[]; // e.g., ["Sales Change (%)", "Brand Awareness (1-10)"]
}

const scenarios: Scenario[] = [
  {
    id: 'marketing_campaign',
    title: 'Decisión de Campaña de Marketing',
    description: 'Tu empresa está lanzando un nuevo producto. Tienes un presupuesto limitado para la campaña de marketing inicial. ¿Cómo lo distribuirías?',
    options: [
      { id: 'social_media', text: 'Invertir fuertemente en redes sociales y marketing de influencers.' },
      { id: 'traditional_media', text: 'Enfocarse en medios tradicionales (TV, radio, prensa).' },
      { id: 'balanced_approach', text: 'Un enfoque equilibrado entre digital y tradicional.' },
    ],
    kpiNames: ["Cambio en Ventas (%)", "Conciencia de Marca (1-10)", "Gasto de Presupuesto (%)"]
  },
  {
    id: 'product_pricing',
    title: 'Estrategia de Precios del Producto',
    description: 'Estás definiendo el precio para un nuevo producto innovador. Considera el mercado objetivo y los costos de producción.',
    options: [
      { id: 'premium_pricing', text: 'Precio premium para posicionarlo como producto de alta gama.' },
      { id: 'competitive_pricing', text: 'Precio competitivo, similar al de los principales competidores.' },
      { id: 'penetration_pricing', text: 'Precio bajo para ganar cuota de mercado rápidamente.' },
    ],
    kpiNames: ["Margen de Ganancia (%)", "Volumen de Ventas (Unidades)", "Percepción de Calidad (1-5)"]
  },
  {
    id: 'pr_crisis',
    title: 'Gestión de Crisis de Relaciones Públicas',
    description: 'Un lote defectuoso de tu producto ha llegado a los clientes, y las quejas están escalando en redes sociales. ¿Cuál es tu primera acción pública?',
    options: [
        { id: 'acknowledge_promise', text: 'Emitir un comunicado reconociendo el problema y prometiendo una solución.' },
        { id: 'ignore_investigate', text: 'Ignorar las quejas y esperar a que pase la tormenta, investigando internamente.' },
        { id: 'proactive_refund', text: 'Ofrecer reembolsos proactivamente a todos los clientes afectados en redes sociales.' },
        { id: 'deny_problem', text: 'Negar públicamente la existencia de un problema y atribuirlo a casos aislados.' },
    ],
    kpiNames: ["Confianza del Cliente (1-10)", "Impacto en Reputación (-10 a +10)", "Costo de Solución ($)"]
  },
  {
    id: 'international_expansion',
    title: 'Estrategia de Expansión Internacional',
    description: 'Tu empresa ha tenido éxito a nivel nacional y está considerando expandirse a un nuevo mercado internacional. ¿Qué estrategia de entrada eliges?',
    options: [
        { id: 'direct_export', text: 'Exportación directa: Vender tus productos directamente a clientes en el nuevo mercado.' },
        { id: 'joint_venture', text: 'Joint Venture: Formar una alianza estratégica con una empresa local.' },
        { id: 'fdi', text: 'Inversión Extranjera Directa: Establecer tus propias operaciones en el país.' },
        { id: 'franchise', text: 'Franquicia: Otorgar licencias a operadores locales para usar tu marca y modelo.' },
    ],
    kpiNames: ["Inversión Inicial ($)", "Potencial de Crecimiento (%)", "Nivel de Control (1-5)", "Riesgo (1-5)"]
  },
  {
    id: 'key_hire',
    title: 'Decisión de Contratación para un Rol Clave',
    description: 'Necesitas contratar un nuevo Director de Marketing. Tienes dos candidatos finales. ¿A quién contratas?',
    options: [
        { id: 'veteran', text: 'Candidato A: Un veterano de la industria con 20 años de experiencia pero poca exposición al marketing digital.' },
        { id: 'rising_star', text: 'Candidato B: Una estrella en ascenso con 5 años de experiencia, experto en marketing digital, pero sin experiencia en gestión.' },
        { id: 'reopen_search', text: 'Reabrir el proceso de búsqueda para encontrar un candidato "perfecto", arriesgando perder a los dos actuales.' },
    ],
    kpiNames: ["Costo de Contratación ($)", "Tiempo para Impacto (meses)", "Moral del Equipo (1-5)", "Potencial de Innovación (1-5)"]
  },
  {
    id: 'tech_investment',
    title: 'Inversión en Nueva Tecnología',
    description: 'El departamento de operaciones propone una inversión significativa en un nuevo sistema de automatización que promete aumentar la eficiencia pero requiere una alta inversión inicial y capacitación.',
    options: [
        { id: 'full_investment', text: 'Aprobar la inversión completa inmediatamente.' },
        { id: 'pilot_project', text: 'Realizar un proyecto piloto en un área para evaluar el impacto real antes de una implementación total.' },
        { id: 'reject_proposal', text: 'Rechazar la propuesta para mantener los costos bajos este año fiscal.' },
        { id: 'cheaper_solution', text: 'Buscar una solución tecnológica más barata, aunque menos potente, de otro proveedor.' },
    ],
    kpiNames: ["Productividad (unidades/hora)", "Retorno de Inversión (ROI %)", "Satisfacción del Empleado (1-5)", "Gasto de Capital ($)"]
  }
];

const parseKpisFromString = (text: string, kpiNames: string[]): { name: string; value: string }[] => {
    const kpis: { name: string; value: string }[] = [];
    kpiNames.forEach(kpiName => {
        const regex = new RegExp(`${kpiName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}:\\s*([\\d.,+\\- %$]+)`, 'i');
        const match = text.match(regex);
        if (match && match[1]) {
            kpis.push({ name: kpiName, value: match[1].trim() });
        }
    });
    return kpis;
};


const BusinessSimulationPage: React.FC = () => {
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(scenarios[0]);
  const [selectedOption, setSelectedOption] = useState<DecisionOption | null>(null);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  
  const { data: geminiResponse, error, isLoading, executeQuery, reset: resetGemini } = useGeminiTextQuery();

  const handleScenarioChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const scenarioId = event.target.value;
    const newScenario = scenarios.find(s => s.id === scenarioId) || null;
    setCurrentScenario(newScenario);
    setSelectedOption(null);
    setSimulationResult(null);
    resetGemini();
  };

  const handleDecision = useCallback(async () => {
    if (!currentScenario || !selectedOption) return;

    setSimulationResult(null); // Clear previous results before new query

    const prompt = `
      Eres un IA de simulación de negocios para estudiantes.
      Escenario: ${currentScenario.title} - ${currentScenario.description}
      Decisión del estudiante: ${selectedOption.text}

      Describe el resultado probable de esta decisión en 1-2 párrafos concisos.
      Incluye el impacto potencial en los siguientes KPIs (usa el formato exacto incluyendo el nombre del KPI):
      ${currentScenario.kpiNames.map(kpi => `- ${kpi}: [valor numérico o descriptivo breve]`).join('\n')}
      
      Concéntrate en un lenguaje claro y educativo.
    `;
    
    await executeQuery(prompt, "Eres un simulador de negocios que ayuda a los estudiantes a comprender las consecuencias de sus decisiones.");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentScenario, selectedOption, executeQuery]);
  
  // Process Gemini response when it arrives
  React.useEffect(() => {
    if (geminiResponse && currentScenario) {
      const narrative = geminiResponse; // The whole text is the narrative
      const kpis = parseKpisFromString(geminiResponse, currentScenario.kpiNames);
      setSimulationResult({ narrative, kpis });
    }
  }, [geminiResponse, currentScenario]);


  return (
    <PageWrapper title="Laboratorio de Simulación Empresarial" titleIcon={<SimulationIcon />}>
      <InteractiveModule
        title="Escenarios de Decisión"
        icon={<LightbulbIcon className="w-6 h-6" />}
        initialInstructions="Selecciona un escenario, elige una opción y observa los resultados simulados por la IA. Reflexiona sobre las consecuencias de cada decisión."
      >
        <div className="mb-6">
          <label htmlFor="scenario-select" className="block text-sm font-medium text-neutral-700 mb-1">
            Seleccionar Escenario:
          </label>
          <select
            id="scenario-select"
            value={currentScenario?.id || ''}
            onChange={handleScenarioChange}
            className="w-full p-2 border border-neutral-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
          >
            {scenarios.map(s => (
              <option key={s.id} value={s.id}>{s.title}</option>
            ))}
          </select>
        </div>

        {currentScenario && (
          <>
            <h3 className="text-lg font-semibold text-neutral-800 mb-2">{currentScenario.title}</h3>
            <p className="text-neutral-600 mb-4">{currentScenario.description}</p>
            
            <div className="space-y-3 mb-6">
              {currentScenario.options.map(option => (
                <Button
                  key={option.id}
                  variant={selectedOption?.id === option.id ? 'primary' : 'outline'}
                  onClick={() => setSelectedOption(option)}
                  className="w-full justify-start text-left"
                  disabled={isLoading}
                >
                  {option.text}
                </Button>
              ))}
            </div>

            <Button
              onClick={handleDecision}
              disabled={!selectedOption || isLoading}
              isLoading={isLoading}
            >
              {isLoading ? 'Simulando...' : 'Tomar Decisión y Ver Resultado'}
            </Button>
          </>
        )}

        {error && (
          <Card className="mt-6 bg-red-50 border-red-500">
            <div className="flex items-center text-red-700">
              <XCircleIcon className="w-6 h-6 mr-2" />
              <p><strong>Error:</strong> {error}</p>
            </div>
          </Card>
        )}

        {simulationResult && !isLoading && (
          <Card className="mt-6 border-l-4 border-green-500">
            <h4 className="text-xl font-semibold text-neutral-800 mb-3 flex items-center">
                <CheckCircleIcon className="w-6 h-6 mr-2 text-green-600"/>
                Resultado de la Simulación
            </h4>
            <div className="prose prose-sm max-w-none text-neutral-700 mb-4">
                <p>{simulationResult.narrative}</p>
            </div>
            {simulationResult.kpis && simulationResult.kpis.length > 0 && (
              <div>
                <h5 className="font-semibold text-neutral-700 mb-2">Indicadores Clave (KPIs):</h5>
                <ul className="list-disc list-inside space-y-1 text-neutral-600">
                  {simulationResult.kpis.map(kpi => (
                    <li key={kpi.name}><strong>{kpi.name}:</strong> {kpi.value}</li>
                  ))}
                </ul>
              </div>
            )}
            <p className="mt-4 text-sm text-neutral-500 italic">
              Recuerda: Esta es una simulación simplificada. En el mundo real, múltiples factores influirían en el resultado. Usa esto como una herramienta de aprendizaje y reflexión.
            </p>
          </Card>
        )}
         {isLoading && !simulationResult && <div className="mt-6"><LoadingSpinner text="Generando resultado de la simulación..."/></div>}
      </InteractiveModule>
    </PageWrapper>
  );
};

export default BusinessSimulationPage;