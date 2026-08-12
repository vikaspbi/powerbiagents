import type { AgentId, Project, StageState } from "./types";
import { createEmptyStages } from "./types";
import { saveProject } from "./storage";
import { v4 as uuidv4 } from "uuid";

function stageWithDoc(
  base: StageState,
  markdown: string,
  json: Record<string, unknown>,
  status: StageState["status"] = "approved",
): StageState {
  return {
    ...base,
    status,
    livingDocMarkdown: markdown,
    handoffJson: json,
    messages: [
      {
        id: uuidv4(),
        role: "assistant",
        content: `${markdown}\n\n\`\`\`json\n${JSON.stringify(json, null, 2)}\n\`\`\``,
        createdAt: new Date().toISOString(),
      },
    ],
    changelog: [`${new Date().toLocaleString()}: sample content loaded`],
    lockedAt: status === "approved" ? new Date().toISOString() : undefined,
  };
}

export function createSampleProject(): Project {
  const now = new Date().toISOString();
  const stages = createEmptyStages();

  const reqJson = {
    requirements_matrix: [
      {
        id: "R1",
        requirement: "Total Revenue",
        definition_status: "Ambiguous",
        grain: "per day / company total",
        filters: ["Year", "Region"],
        priority: "Must",
        source_hypothesis: "HYPOTHESIS: Orders.Amount",
        confidence: 55,
      },
      {
        id: "R2",
        requirement: "Revenue by Region",
        definition_status: "Confirmed",
        grain: "per region",
        filters: ["Year"],
        priority: "Must",
        source_hypothesis: "HYPOTHESIS: Orders + Customers.Region",
        confidence: 70,
      },
      {
        id: "R3",
        requirement: "Top 10 Products by Revenue",
        definition_status: "Confirmed",
        grain: "per product",
        filters: ["Year", "Region"],
        priority: "Should",
        source_hypothesis: "HYPOTHESIS: Orders + Products",
        confidence: 65,
      },
    ],
    proposal: {
      tools_required: ["Power BI Pro", "On-premises data gateway (if SQL on-prem)"],
      licensing_notes: "Approx. 15 viewers on Pro; 2 authors.",
      estimated_pages: 2,
      page_scope_summary: [
        "Executive Summary — KPIs and trend",
        "Regional Breakdown — bars + product ranking",
      ],
      feature_checklist: {
        rls: "Maybe — confirm if regional managers need row filters",
        mobile_layout: false,
        drill_through: true,
        bookmarks: false,
        export_print: true,
      },
      open_questions: [
        "What is the definition of Revenue (gross vs net)?",
        "Is RLS required by region?",
      ],
      effort_estimate_band: "Estimate only: small (about 2 report pages) once definitions are confirmed",
    },
  };

  stages.requirements = stageWithDoc(
    stages.requirements,
    `## Classification
- Scenario: rough idea
- Project type: NEW (proposal included)

## Requirements matrix

| ID | Requirement | Definition Status | Grain | Filters | Priority | Source Hypothesis | Confidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| R1 | Total Revenue | Ambiguous — is this gross or net? | company total / day | Year, Region | Must | HYPOTHESIS: Orders.Amount | 55 |
| R2 | Revenue by Region | Confirmed | per region | Year | Must | HYPOTHESIS: Orders + Customers.Region | 70 |
| R3 | Top 10 Products by Revenue | Confirmed | per product | Year, Region | Should | HYPOTHESIS: Orders + Products | 65 |

Open: R1 definition. Ready to approve after you confirm gross vs net.`,
    reqJson,
  );

  stages.architecture = {
    ...stages.architecture,
    status: "active",
    messages: [],
    livingDocMarkdown: "",
    handoffJson: null,
    changelog: [],
  };

  const project: Project = {
    id: uuidv4(),
    name: "Sample: Sales Executive Dashboard",
    description:
      "Demo project so you can click around. Stage 1 is pre-filled — open Settings, add an API key, then continue from Stage 2 or re-run Stage 1.",
    createdAt: now,
    updatedAt: now,
    currentAgent: "architecture" as AgentId,
    stages,
  };

  saveProject(project);
  return project;
}
