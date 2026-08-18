import { makeLesson, makePath, type LearningPath } from "@/content/schema";

function lesson(id: string, title: string, minutes: number, body: string[], example: string, takeaway: string, question: string, options: string[], answer: number) {
  return makeLesson("tmp", 0, false, id, { title, minutes, body, exampleTitle: "Example", example, takeaway, check: { question, options, answer } });
}

export const CURRICULUM_PART_D: LearningPath[] = [
  makePath(25, "ch25-fabric", "Data platform", "Power BI + Microsoft Fabric", "OneLake, lakehouse, Direct Lake, pipelines, medallion, notebooks", [
    lesson("fabric-onelake-workloads", "What Fabric is: OneLake and the workloads", 9, [
      "Microsoft Fabric is a unified analytics SaaS: OneLake storage, lakehouse, warehouse, Data Factory, Spark data engineering, data science, Real-Time Intelligence, Dataflows Gen2, notebooks, and Power BI semantic models.",
      "Shortcuts point at ADLS/S3 without copy. Medallion (bronze/silver/gold) fits lakehouse tables. Direct Lake lets Power BI read Delta without Import duplication (with rules).",
      "Power BI did not disappear — it is the consumption and semantic layer on Fabric.",
    ], "CSV lands in bronze. Spark notebook cleans to silver Delta. Gold star tables. Semantic model in Direct Lake. Report in an app. One platform instead of five contracts.", "OneLake is the lake. Power BI is still the semantic/report layer.", "OneLake is…", ["A DAX function", "The unified data lake storage in Fabric", "A slicer type", "A gateway SKU"], 1),
    lesson("directlake-pipelines-security", "Direct Lake, pipelines, shortcuts, Fabric security", 9, [
      "Direct Lake architecture: Delta tables + semantic model + fallback. Fabric pipelines and Data Factory move/transform. Dataflows Gen2 write to OneLake. Notebooks for heavy transforms.",
      "Security: workspace roles, OneLake data access, sensitivity labels, and still RLS on the semantic model. End-to-end Fabric analytics is a platform design, not a connector choice.",
      "Do not mix random Import from production SQL and Direct Lake on ungoverned bronze.",
    ], "Pipeline: copy ERP → bronze; notebook silver; stored proc/spark gold; semantic model binds gold; RLS by region as today.", "Govern gold. Experiment in bronze.", "Direct Lake reads…", ["Only Excel", "Delta tables in OneLake (with fallback rules)", "Printers", "Bookmarks"], 1),
  ]),
  makePath(26, "ch26-enterprise-arch", "Enterprise", "Enterprise Data Architecture for Power BI", "Warehouses, lakes, ETL/ELT, semantic layer, governance", [
    lesson("wh-lake-medallion", "Warehouse, lake, lakehouse, ETL vs ELT, medallion", 9, [
      "Warehouse: structured, governed SQL. Data lake: files at scale. Lakehouse: both. ETL transforms before load; ELT loads then transforms in the platform (typical for lakes).",
      "Bronze raw, silver cleaned, gold dimensional. Power BI should hit gold (or a warehouse mart), not bronze.",
      "Semantic layer: the gold model that defines metrics once.",
    ], "ELT: land JSON in bronze (cheap), Spark to silver, dimensional gold, Import/Direct Lake. ETL: SSIS cleans then loads a warehouse — Power BI Import from warehouse views.", "Reports on gold. Metrics in the semantic layer.", "Bronze/Silver/Gold is…", ["A theme", "Medallion layers of increasing quality and modeling", "RLS levels", "Three workspaces only"], 1),
    lesson("semantic-governance-operating", "Marts, MDM, lineage, centralized vs self-service", 9, [
      "Data marts are subject-area models (Sales mart). Master data (customer, product) needs an owner or every report spells 'Acme' differently. Metadata and lineage (Purview) answer 'where did this KPI come from?'.",
      "Source-to-report architecture is a diagram you actually maintain. Centralized BI vs self-service vs hybrid (certified gold + analyst sandboxes) is an operating model.",
      "Enterprise BI architecture is people + platform + rules.",
    ], "CoE publishes certified Sales Gold. Analysts can connect Live and build thin reports. They cannot republish a duplicate 'Sales Gold (2)'.", "Self-service without a gold layer is spreadsheet chaos with extra steps.", "A certified semantic model is meant to…", ["Block all reports", "Be the reused, trusted metric layer", "Replace Entra ID", "Disable refresh"], 1),
  ]),
  makePath(27, "ch27-devops", "Enterprise", "Power BI Deployment & DevOps", "DEV/TEST/PROD, pipelines, PBIP, Git, CI/CD, rollback", [
    lesson("environments-pipelines-params", "Environments, pipelines, parameters, rules", 8, [
      "DEV for building, TEST for UAT, PROD for consumers. Deployment pipelines copy content and apply rules (data source, parameter Server=prod).",
      "Never author in PROD. Parameters for connection strings and 'is_prod' flags keep M and DAX honest.",
      "Rollback: keep the previous pipeline stage artifact / Git tag so you can redeploy.",
    ], "Parameter pServer = 'sql-dev'. Pipeline rule in Prod sets pServer = 'sql-prod'. The same M runs everywhere.", "Parameters make environments boring — that is the goal.", "Authoring directly in production is…", ["A best practice", "How untested changes reach executives", "Required for RLS", "Faster folding"], 1),
    lesson("pbip-git-cicd", "PBIP, Git integration, CI/CD, testing, change management", 9, [
      "PBIP (Power BI Project) stores reports/models as text for Git. Fabric/Power BI Git integration syncs workspaces to Azure DevOps/GitHub. CI/CD can run tests (DAX queries, refresh) then deploy.",
      "Version control is the history of measures. Release management is who presses go. Change management is communicating KPI definition changes.",
      "If it is not in Git, it is a rumor.",
    ], "Feature branch: new Margin measure. PR review. Pipeline deploys to Test. UAT sign-off. Pipeline deploys to Prod. Tag v2026.08.18.", "Git for history. Pipelines for promotion. Humans for KPI meaning.", "PBIP is valuable because…", ["It 3D-prints reports", "It stores artifacts as text for source control", "It disables DAX", "It replaces SQL"], 1),
  ]),
  makePath(28, "ch28-admin", "Enterprise", "Power BI Administration & Governance", "Tenant settings, capacity, naming, monitoring, cost", [
    lesson("tenant-capacity-workspaces", "Admin portal, tenant settings, capacity, workspace strategy", 9, [
      "Tenant settings control export, publish-to-web, guest access, Copilot, XMLA. Capacity (Premium/Fabric SKU) is CPU/memory for refresh and query. Overload = slow reports for everyone.",
      "Workspace strategy: by domain + environment (Sales-Prod), not one workspace named 'Reports'. Naming standards for datasets and reports.",
      "Dataset ownership: a named team with an email, not a former intern's account.",
    ], "Publish to web disabled tenant-wide. Export to Excel allowed only for Pro. Sales-Prod workspace on a Fabric capacity; sandboxes on shared Pro.", "Tenant settings are security. Capacity is performance. Names are findability.", "Publish to web should be…", ["On for all finance models", "Locked down unless you truly need public anonymous reports", "A replacement for RLS", "Used for HR"], 1),
    lesson("governance-monitoring-cost", "Certification, lineage, usage, audit, labels, cost", 9, [
      "Governance framework: who can certify, naming, endorsement. Usage metrics and audit logs show what is actually used — delete the rest. Sensitivity labels and data classification travel on exports.",
      "Monitoring: refresh failures, capacity metrics, dead reports. Cost management: capacity size vs Pro licenses vs who needs what.",
      "Policies written in a wiki that nobody reads fail. Policies in tenant settings + reviews work.",
    ], "Monthly: usage metrics show 3 of 40 reports have viewers. You archive 37 after talking to owners. Capacity CPU drops and the remaining 3 get faster.", "Usage is the governance instrument.", "Usage metrics help you…", ["Write M", "Retire unused reports and justify capacity", "Unpivot", "Create date tables"], 1),
  ]),
  makePath(29, "ch29-paginated", "Enterprise", "Power BI Paginated Reports", "Pixel-perfect, Report Builder, parameters, export", [
    lesson("paginated-vs-interactive", "When paginated reports win", 8, [
      "Paginated (RDL) reports are pixel-perfect: invoices, financial statements, 40-page operational PDFs. Power BI interactive reports are for exploration. Use both.",
      "Report Builder is the authoring tool. Tables/matrix, parameters, headers/footers, page breaks, PDF/Excel export, subscriptions, embedding.",
      "Do not fake an invoice with 12 Power BI pages and bookmarks.",
    ], "Month-end P&L to PDF with repeating headers and page numbers: paginated. Margin exploration by sellers: interactive Power BI.", "Interactive = explore. Paginated = print/export contract.", "Paginated reports are the right tool for…", ["Ad-hoc slicing by 200 sellers", "Pixel-perfect invoices and financial prints", "What-if sliders", "Copilot chat only"], 1),
  ]),
  makePath(30, "ch30-report-builder", "Enterprise", "Power BI Report Builder & Pixel-Perfect Reporting", "Tablix, groups, expressions, print layouts", [
    lesson("builder-tablix-params", "Interface, datasets, tablix, groups, expressions, parameters", 10, [
      "Report Builder: data sources, datasets (often DAX or SQL), tablix (table/matrix), row/column groups, sort, expressions (VB-style), parameters that map to dataset filters.",
      "Charts, headers, footers, page numbering, print margins, export formats. Financial and invoice-style layouts are the point.",
      "Expressions calculate text/visibility — they are not a replacement for a proper semantic model.",
    ], "Dataset: EVALUATE SUMMARIZECOLUMNS(...). Parameter @Entity. Header: company logo + 'Confidential'. Footer: PageNumber of TotalPages. Export Excel for controllers who still live in grids.", "Tablix + parameters + headers = operational reporting.", "A tablix is…", ["A gateway cluster", "The table/matrix layout surface in paginated reports", "A DAX iterator", "A Fabric shortcut"], 1),
  ]),
  makePath(31, "ch31-embedded", "Enterprise", "Power BI Embedded & APIs", "Embed tokens, REST APIs, app-owns-data", [
    lesson("embed-models-tokens", "Embedded analytics, app-owns-data vs user-owns-data", 9, [
      "Power BI Embedded puts reports in your app. App owns data: your service authenticates with a service principal and embeds with tokens — users may not need Power BI licenses (capacity-based). User owns data: each user needs a license and AAD.",
      "Embed tokens are short-lived. Architecture: your API obtains a token, the JS SDK shows the report, RLS identity is passed in the token.",
      "Licensing mistakes here are expensive. Read the current Microsoft licensing guide.",
    ], "A SaaS product shows each tenant only their rows: service principal + embed token with EffectiveIdentity matching RLS. Customers never see the Power BI portal.", "Embedding is an identity design.", "App-owns-data embedding typically uses…", ["Everyone as workspace Admin", "A service principal and embed tokens", "Publish to web", "Personal gateway on a laptop"], 1),
    lesson("rest-apis-automation", "REST APIs for workspaces, datasets, refresh, export, automation", 8, [
      "Power BI REST APIs cover groups (workspaces), datasets, refreshes, reports, exports to PDF/PPTX. Automation: Azure Automation / Fabric pipelines / your CI calling refresh after ETL.",
      "Export APIs have throttling. Treat them as batch, not click-time for 10k users.",
      "Automation without monitoring is a silent failure.",
    ], "Nightly: warehouse job succeeds → API POST refreshes the gold dataset → on success, export a PDF pack to SharePoint for the board pack that still wants email.", "Refresh then export. Never export during refresh.", "The REST refresh API is used to…", ["Draw visuals", "Trigger semantic model refresh from an external orchestrator", "Unpivot", "Set a theme JSON by hand only"], 1),
  ]),
  makePath(32, "ch32-automate", "Power Platform", "Power Automate + Power BI", "Triggers, refresh, alerts, email, approvals", [
    lesson("flows-refresh-notify", "Triggers, actions, refresh, notifications, exports", 8, [
      "Power Automate can trigger on a Power BI data alert, or run on a schedule to refresh a dataset, export a report, email stakeholders, start an approval.",
      "Exception handling: if refresh fails, post to Teams and open a ticket. Do not email 400 people a failure screenshot of credentials.",
      "Power Apps + Automate + BI is a business process, not a demo if you add owners and environments (Dev/Test/Prod).",
    ], "When [Late Orders] > 50, a data alert starts a flow: Teams message to Ops, email with a filtered report link, optional approval to expedite shipping.", "Automate the exception, not the entire BI platform.", "A data-driven Power Automate flow often starts from…", ["A theme change", "A Power BI data alert or a completed refresh", "Sort by column", "Unpivot"], 1),
  ]),
  makePath(33, "ch33-power-apps", "Power Platform", "Power Apps + Power BI", "Power Apps visual, write-back, operational loops", [
    lesson("apps-visual-writeback", "Integration patterns and write-back", 8, [
      "Power Apps visual inside a report passes the current filter context to an app (e.g. selected OrderId). Users update a comment or status in Dataverse/SQL. Next refresh (or DirectQuery) shows it.",
      "Write-back is operational, not a warehouse gold layer. Architect: who owns the write table, security, audit.",
      "Opening Power Apps from a button with a deep link is sometimes cleaner than embedding a cramped visual.",
    ], "Matrix of disputed invoices. Power Apps visual submits a reason code to SQL. DirectQuery report updates. Finance stops collecting reasons in email.", "Write-back needs an owned store and audit, not a hidden Excel.", "The Power Apps visual is used to…", ["Replace DAX", "Pass report context into an app for operational actions", "Create date tables", "Host gateways"], 1),
  ]),
  makePath(34, "ch34-excel", "Power Platform", "Excel + Power BI", "Power Query/Pivot in Excel, Analyze in Excel, hybrid", [
    lesson("excel-bi-bridge", "Tables, pivots, Power Query/Pivot, Analyze in Excel", 9, [
      "Excel remains the analyst sandbox: Tables, PivotTables, Power Query, Power Pivot (the same tabular engine family), DAX in Excel.",
      "Analyze in Excel / live connected pivots against a Power BI semantic model give controllers a pivot while measures stay certified. Export is a snapshot; live connection is a contract.",
      "Excel vs Power BI: workbooks for personal analysis; Power BI for shared, secured, refreshed distribution. Hybrid: gold model + Excel for ad-hoc, not 15 competing models.",
    ], "Controllers connect Analyze in Excel to Finance Gold, pivot Actual vs Budget. They cannot silently redefine Margin %. They can still add Excel calculations on the side.", "Let Excel consume the model. Do not let Excel become a second model.", "Analyze in Excel is powerful because…", ["It bypasses RLS", "It reuses the certified semantic model in a pivot", "It deletes the date table", "It is paginated RDL"], 1),
  ]),
  makePath(35, "ch35-advanced-analytics", "AI", "Advanced Analytics in Power BI", "Forecasting, clustering, influencers, R/Python, ML concepts", [
    lesson("stats-ai-visuals", "Forecast, clustering, outliers, key influencers, decomposition", 9, [
      "Line chart forecast (exponential smoothing) is a helper, not a planning system. Clustering on scatter finds groups. Outlier detection needs a business rule, not just a red point.",
      "Key influencers and decomposition tree are ML-assisted visuals: they suggest drivers. Always validate with a known KPI definition.",
      "Correlation is not causation. Regression basics: a line is a model with assumptions.",
    ], "Key influencers on Churn Flag might say 'contract month 11' and 'support tickets > 5'. You still check with a proper retention definition before presenting to the CMO.", "AI visuals propose. The KPI dictionary disposes.", "Key influencers should be…", ["Copied untested into the annual report", "Validated against metric definitions and samples", "Used instead of a date table", "A gateway"], 1),
    lesson("r-python-ml-whatif", "R/Python, ML concepts, what-if, scenarios", 8, [
      "R/Python visuals and scripts have service limitations (and security). Prefer precomputed scores in the warehouse (Azure ML / Fabric) and display in Power BI.",
      "What-if and scenario modeling belong in disconnected tables or external models. Machine learning concepts: train/test, leakage, drift — do not 'train' on your report filters.",
      "AI-assisted analytics is a pipeline with owners.",
    ], "A churn probability column from a Fabric notebook lands on DimCustomer. Power BI only slices it. Retrain is a scheduled notebook, not a Python visual on a page.", "Score in the platform. Visualize in Power BI.", "Running Python inside a Power BI visual is often worse than…", ["A precomputed warehouse/lake score", "Deleting the model", "Publish to web", "Both-direction filters everywhere"], 0),
  ]),
  makePath(36, "ch36-copilot", "AI", "Power BI Copilot & AI Capabilities", "Copilot, Q&A, smart narrative, responsible AI", [
    lesson("copilot-qa-narrative", "Copilot, Q&A, smart narrative, AI summaries", 8, [
      "Copilot can draft reports and DAX; Q&A answers natural language against synonyms you set on columns. Smart narrative writes sentences from visuals.",
      "Limitations: wrong grain, hallucinated measures, tenant preview flags, data that was never in the model. Prompting helps; validation is mandatory.",
      "Responsible AI: no sensitive attributes in Q&A without policy, human sign-off on external numbers.",
    ], "You ask Copilot for 'YTD sales vs last year by region'. It creates a page. You check the measures match Finance Gold definitions and that the date table is marked — then you keep it.", "Copilot is an intern. You are the author.", "AI-generated DAX should be…", ["Published immediately", "Reviewed against grain, filters, and the KPI dictionary", "Used to replace RLS", "Stored in bookmarks only"], 1),
  ]),
];
