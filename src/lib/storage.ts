import { v4 as uuidv4 } from "uuid";
import {
  AGENT_ORDER,
  createEmptyStages,
  type AgentId,
  type Project,
  type ProjectSettings,
} from "./types";

const PROJECTS_KEY = "report-desk-projects";
const SETTINGS_KEY = "report-desk-settings";

function canUseStorage(): boolean {
  return typeof window !== "undefined" && !!window.localStorage;
}

export function loadSettings(): ProjectSettings {
  if (!canUseStorage()) return { model: "gpt-4o-mini" };
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { model: "gpt-4o-mini" };
    return { model: "gpt-4o-mini", ...JSON.parse(raw) };
  } catch {
    return { model: "gpt-4o-mini" };
  }
}

export function saveSettings(settings: ProjectSettings): void {
  if (!canUseStorage()) return;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function listProjects(): Project[] {
  if (!canUseStorage()) return [];
  try {
    const raw = localStorage.getItem(PROJECTS_KEY);
    if (!raw) return [];
    const projects = JSON.parse(raw) as Project[];
    return projects.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  } catch {
    return [];
  }
}

export function getProject(id: string): Project | null {
  return listProjects().find((p) => p.id === id) ?? null;
}

export function saveProject(project: Project): void {
  if (!canUseStorage()) return;
  const all = listProjects().filter((p) => p.id !== project.id);
  all.push({ ...project, updatedAt: new Date().toISOString() });
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(all));
}

export function deleteProject(id: string): void {
  if (!canUseStorage()) return;
  const all = listProjects().filter((p) => p.id !== id);
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(all));
}

export function createProject(name: string, description: string): Project {
  const now = new Date().toISOString();
  const project: Project = {
    id: uuidv4(),
    name: name.trim() || "Untitled report project",
    description: description.trim(),
    createdAt: now,
    updatedAt: now,
    currentAgent: "requirements",
    stages: createEmptyStages(),
  };
  saveProject(project);
  return project;
}

export function approveStage(project: Project, agentId: AgentId): Project {
  const next = structuredClone(project);
  next.stages[agentId].status = "approved";
  next.stages[agentId].lockedAt = new Date().toISOString();
  const idx = AGENT_ORDER.indexOf(agentId);
  if (idx < AGENT_ORDER.length - 1) {
    const nextId = AGENT_ORDER[idx + 1];
    if (next.stages[nextId].status === "locked") {
      next.stages[nextId].status = "active";
    }
    next.currentAgent = nextId;
  }
  saveProject(next);
  return next;
}

export function reopenStage(project: Project, agentId: AgentId): Project {
  const next = structuredClone(project);
  next.stages[agentId].status = "active";
  next.currentAgent = agentId;
  saveProject(next);
  return next;
}

export function collectHandoffs(
  project: Project,
): Partial<Record<AgentId, Record<string, unknown> | null>> {
  const out: Partial<Record<AgentId, Record<string, unknown> | null>> = {};
  for (const id of AGENT_ORDER) {
    out[id] = project.stages[id].handoffJson;
  }
  return out;
}

export function extractJsonBlock(
  text: string,
): Record<string, unknown> | null {
  const fence = text.match(/```json\s*([\s\S]*?)```/i);
  const raw = fence?.[1]?.trim();
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function extractLivingDoc(text: string): string {
  // Prefer markdown without the JSON handoff block for the living-doc panel
  return text.replace(/```json\s*[\s\S]*?```/gi, "").trim();
}

export function downloadText(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
