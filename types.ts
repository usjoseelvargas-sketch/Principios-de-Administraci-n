import React from 'react';
import { GenerateContentResponse } from "@google/genai";

export interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

export interface ModuleCardProps {
  title: string;
  description: string;
  navigateTo: string;
  icon?: React.ReactNode;
}

export enum SimulationDecisionOutcome {
  POSITIVE = "Positive",
  NEUTRAL = "Neutral",
  NEGATIVE = "Negative",
}

export interface SimulationResult {
  narrative: string;
  kpis?: { name: string; value: string | number; change?: string }[];
}

export interface FinancialProblem {
  id: string;
  statement: string;
  type: string; // e.g., "ROI", "NPV", "Breakeven"
}

export interface GeminiServiceError {
  message: string;
}

export interface GenerateContentGeminiResponse extends GenerateContentResponse {}

// New types for Administrative Theories module
export interface AdministrativeTheory {
  id: string;
  name: string;
  shortDescription: string;
  keyConcepts: string[];
  year?: string; // Approximate year or period
  proponent?: string; // Main figure associated
}

export interface CaseStudy {
  id:string;
  title: string;
  scenario: string;
  relatedTheoryIds: string[]; // IDs of theories this case can relate to
  guidingQuestions?: string[];
}

// New type for Quality Terms module
export interface QualityTerm {
  id: string;
  term: string;
  definition: string;
  category: string; // e.g., "Fundamentos", "Gestión"
}

// New type for KPI Module
export interface KpiScenario {
  id: string;
  title: string;
  description: string;
}

// New type for SMART Goals Module
export interface SmartGoalScenario {
  id: string;
  title: string;
  context: string;
}

// New type for Automation Exercises Module
export interface AutomationScenario {
  id: string;
  title: string;
  processDescription: string;
  steps: {
    id: string;
    description: string;
    automatable: boolean; // For internal reference/prompt generation
  }[];
}

// New type for Skill Integration Module
export interface SkillIntegrationTopic {
  id: string;
  title: string;
  concept: string; // The core idea of the integration
  scenario: string; // A practical situation
  skillType: 'Technical influencing Soft' | 'Soft enabling Technical';
}

// New types for Project Management Module
export interface ProjectTask {
  id: string;
  name: string;
  description: string;
  priority: 'Alta' | 'Media' | 'Baja';
  estimatedHours: number;
}

export interface ProjectSimulation {
  id: string;
  title: string;
  goal: string;
  tasks: ProjectTask[];
}

// New types for Discussion Forum Module
export interface AIPersona {
  name: string;
  stance: string; // e.g., "Skeptical CFO focused on ROI"
}

export interface DebateTopic {
  id: string;
  title: string;
  description: string;
  aiPersonas: AIPersona[];
}

export interface ChatMessage {
  author: string; // e.g., "Tú" or an AI persona's name
  message: string;
}

// New type for SWOT Analysis Module
export interface SwotScenario {
  id: string;
  title: string;
  scenario: string;
}

// New types for Strategic Planning Module
export interface StrategicPlanningScenario {
  id: string;
  title: string;
  scenario: string;
}

export interface StrategicPlanInputs {
    mission: string;
    vision: string;
    qualityPolicy: string;
    objectives: string;
    actionPlans: string;
}


// Web Speech API interfaces
export interface SpeechRecognition {
  grammars: SpeechGrammarList;
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  serviceURI?: string; // Optional as per some specs

  onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onnomatch: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onsoundend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;

  abort(): void;
  start(): void;
  stop(): void;

  // Non-standard property used in the code for checking active recognition state
  recognizing?: boolean; 
}

export interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
  readonly interpretation?: any;
  readonly emma?: Document | null; // XMLDocument in some typings
}

export interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

export interface SpeechRecognitionResult {
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  readonly isFinal: boolean;
}

export interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

export interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string; // DOMException-like error codes, e.g., "not-allowed", "no-speech"
  readonly message: string;
}

export interface SpeechGrammar {
  src: string;
  weight: number;
}
export interface SpeechGrammarList {
  readonly length: number;
  item(index: number): SpeechGrammar;
  [index: number]: SpeechGrammar;
  addFromString(string: string, weight?: number): void;
  addFromURI(src: string, weight?: number): void;
}

// Constructor type
export interface SpeechRecognitionStatic {
  new(): SpeechRecognition;
}

// Augment Window interface to inform TypeScript about these global constructors
declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionStatic;
    webkitSpeechRecognition?: SpeechRecognitionStatic;
  }
}


// Specific type for grounding chunks if used - not used in this iteration
// export interface GroundingChunkWeb {
//   uri: string;
//   title: string;
// }
// export interface GroundingChunk {
//   web?: GroundingChunkWeb;
//   // Other types of chunks if applicable
// }
// export interface GroundingMetadata {
//   groundingChunks?: GroundingChunk[];
//   // Other grounding metadata fields
// }
// export interface CandidateWithGrounding extends Candidate {
//   groundingMetadata?: GroundingMetadata;
// }
// export interface GenerateContentResponseWithGrounding extends GenerateContentResponse {
//  candidates?: CandidateWithGrounding[];
// }