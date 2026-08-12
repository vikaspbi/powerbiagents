export type AgentId =
  | "requirements"
  | "architecture"
  | "feasibility"
  | "build"
  | "qa"
  | "documentation";

export type StageStatus = "locked" | "active" | "in_review" | "approved";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: string;
}

export interface StageState {
  status: StageStatus;
  messages: ChatMessage[];
  livingDocMarkdown: string;
  handoffJson: Record<string, unknown> | null;
  changelog: string[];
  lockedAt?: string;
}

export interface ProjectSettings {
  openaiApiKey?: string;
  model?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  currentAgent: AgentId;
  stages: Record<AgentId, StageState>;
}

export interface AgentMeta {
  id: AgentId;
  number: number;
  shortName: string;
  title: string;
  plainDescription: string;
  whatYouDo: string;
  outputLabel: string;
  nextId?: AgentId;
}

export const AGENT_ORDER: AgentId[] = [
  "requirements",
  "architecture",
  "feasibility",
  "build",
  "qa",
  "documentation",
];

export const AGENTS: Record<AgentId, AgentMeta> = {
  requirements: {
    id: "requirements",
    number: 1,
    shortName: "Requirements",
    title: "Requirements & Proposal",
    plainDescription:
      "Turn your idea, notes, or existing report request into a clear requirements list (and a proposal if this is a new project).",
    whatYouDo:
      "Paste your request, meeting notes, or RSD/PRD. Answer clarifying questions. Approve when the list looks right.",
    outputLabel: "Requirements Matrix + Proposal",
    nextId: "architecture",
  },
  architecture: {
    id: "architecture",
    number: 2,
    shortName: "Design",
    title: "Architecture & Layout",
    plainDescription:
      "Draw how data will flow into Power BI, then sketch the report page layouts.",
    whatYouDo:
      "Review the diagram and page layouts. Ask for changes like adding a page or moving filters. Approve when ready.",
    outputLabel: "Architecture + Wireframes",
    nextId: "feasibility",
  },
  feasibility: {
    id: "feasibility",
    number: 3,
    shortName: "Data Check",
    title: "Data Feasibility",
    plainDescription:
      "Check that the loaded data can actually support every requirement — columns, relationships, and measure logic.",
    whatYouDo:
      "Paste your table/column list (or sample). Confirm mappings and relationships. Approve when coverage looks solid.",
    outputLabel: "Coverage + Relationships + Draft Measures",
    nextId: "build",
  },
  build: {
    id: "build",
    number: 4,
    shortName: "Build Guide",
    title: "Build Guidance",
    plainDescription:
      "Produce a step-by-step build checklist: Power Query, relationships, DAX, and visuals.",
    whatYouDo:
      "Review the checklist with your developer (or yourself). Request tweaks. Approve when ready to build.",
    outputLabel: "Build Checklist",
    nextId: "qa",
  },
  qa: {
    id: "qa",
    number: 5,
    shortName: "QA",
    title: "QA / Validation",
    plainDescription:
      "Create test cases for every requirement and track Pass/Fail. You decide go/no-go — the agent never self-approves release.",
    whatYouDo:
      "Confirm the test sheet format, run or report results, then review failures. Approve the QA pack when complete.",
    outputLabel: "Test Case Sheet",
    nextId: "documentation",
  },
  documentation: {
    id: "documentation",
    number: 6,
    shortName: "Docs",
    title: "Documentation",
    plainDescription:
      "Compile the final technical documentation from everything already approved — no reinventing.",
    whatYouDo:
      "Pick a template (or use the default). Review the compiled doc. Request edits. Approve when finalized.",
    outputLabel: "Project Documentation",
  },
};

export function emptyStage(): StageState {
  return {
    status: "locked",
    messages: [],
    livingDocMarkdown: "",
    handoffJson: null,
    changelog: [],
  };
}

export function createEmptyStages(): Record<AgentId, StageState> {
  const stages = {} as Record<AgentId, StageState>;
  for (const id of AGENT_ORDER) {
    stages[id] = emptyStage();
  }
  stages.requirements.status = "active";
  return stages;
}
