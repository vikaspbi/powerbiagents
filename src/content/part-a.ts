import { makeLesson, makePath, type LearningPath } from "@/content/schema";

function lesson(
  id: string,
  title: string,
  minutes: number,
  body: string[],
  example: string,
  takeaway: string,
  question: string,
  options: string[],
  answer: number,
) {
  return makeLesson("tmp", 0, false, id, {
    title,
    minutes,
    body,
    exampleTitle: "Example",
    example,
    takeaway,
    check: { question, options, answer },
  });
}

export const CURRICULUM_PART_A: LearningPath[] = [
  makePath(1, "ch01-intro", "Foundations", "Introduction to Data Analytics & Power BI", "Analytics vs BI, the Power BI ecosystem, connectivity modes, and how real projects run", [
    lesson("analytics-vs-bi", "What data analytics is — and how BI is different", 8, [
      "Data analytics is the practice of turning raw records into answers: what happened, why it happened, what might happen next, and what we should do. It includes reporting, statistical analysis, and sometimes machine learning.",
      "Business intelligence (BI) is the subset of analytics that business users consume every day: trusted metrics, interactive reports, and a semantic layer so Finance and Sales argue about the business — not about whose Excel file is correct.",
      "Power BI sits in the BI layer. It is not a replacement for a warehouse or a data-science notebook. It is the place where a modeled dataset becomes a filterable story.",
    ], "A retailer has POS tickets in SQL, promotions in Excel, and store targets in SharePoint. Analytics engineering cleans that into a star schema. Power BI then publishes same-store sales vs target so managers can slice by week.", "BI is curated, repeatable decision support. Analytics is the broader craft of finding answers in data.", "Which statement is most accurate?", ["Power BI replaces SQL databases", "BI delivers trusted, repeatable metrics; analytics is the wider discipline", "Data analytics only means machine learning", "BI and Excel are the same product"], 1),
    lesson("what-why-power-bi", "What Power BI is and why teams use it", 8, [
      "Power BI is Microsoft’s platform for connecting to data, shaping it (Power Query), modeling it (relationships + DAX), visualizing it, and sharing it (the Service). Desktop is the authoring tool; the Service is where people consume and operate reports.",
      "Teams pick it because it sits next to Excel, Teams, Azure, and Microsoft 365, supports self-service, and can still sit on an enterprise semantic model.",
      "This app is independent teaching material — not affiliated with Microsoft. Power BI is a Microsoft trademark.",
    ], "A CFO asks for margin % by product line, last 12 months vs prior 12, excluding one-off write-offs. You model Sales and GL facts, write Margin measures, and let slicers change the window — instead of a fragile Excel pivot.", "Use Power BI when many people must explore the same trusted model.", "Where do you normally author a Power BI report?", ["Power BI Mobile only", "Power BI Desktop (and sometimes the web editor)", "SQL Server Agent", "Paint"], 1),
    lesson("ecosystem-modes-lifecycle", "Ecosystem, licensing, connectivity, and project lifecycle", 12, [
      "Ecosystem: Desktop (build), Service (share, refresh, apps), Mobile (consume), Report Server (on-premises), Microsoft Fabric (OneLake, lakehouse, Direct Lake). Licensing is typically Free, Pro, Premium Per User, or Fabric/Premium capacity.",
      "Import copies data into VertiPaq. DirectQuery queries the source at view time. Live Connection points at an existing semantic model. Composite models mix modes. Choose using freshness, volume, and source power.",
      "Workflow: connect → transform → model → DAX → visuals → validate → publish → refresh → share. Lifecycle starts with KPIs and source analysis, not with picking a pie chart.",
    ], "40 million nightly sales rows: Import + incremental refresh, or Direct Lake. A 200-row board pack that must match ERP at click-time: DirectQuery to a curated view. A certified gold model: Live Connection so authors do not duplicate measures.", "Pick connectivity for freshness vs speed; start the project with KPIs.", "Import mode mainly means…", ["Power BI never stores data", "Data is loaded into the Power BI model (VertiPaq) and refreshed on a schedule", "Only Excel can be used", "Reports cannot be shared"], 1),
  ]),
  makePath(2, "ch02-interface", "Foundations", "Power BI Interface & Fundamentals", "Desktop views, panes, themes, and the tools you click every day", [
    lesson("install-ribbons-views", "Install Desktop and learn the three views", 9, [
      "Install Power BI Desktop from the Microsoft Store or the download center. The Home ribbon is for Get data, transform, visuals, and publish.",
      "Report view is the canvas. Data view inspects imported tables. Model view is for relationships, hidden columns, and default summarization.",
      "Train this order: Model view for structure, Data view for sanity checks, Report view last.",
    ], "Sales and Products load. In Data view ProductKey is text with leading zeros. In Model view you relate ProductKey to Products (many-to-one). Then you build a matrix. That order prevents blank products.", "Report / Data / Model are three jobs, not three themes.", "Which view is for relationships?", ["Report view", "Model view", "Bookmarks pane", "Mobile layout only"], 1),
    lesson("panes-formula-dax-editor", "Fields, Visualizations, Filters, and the formula bar", 9, [
      "Fields lists tables. Visualizations is the field well plus format. The Filters pane has This visual / This page / All pages — the usual reason a number disagrees with Excel.",
      "The formula bar is for measures. Name them as the business speaks: Total Sales, not Sum of Amount.",
      "Column properties (type, sort by column, display folder, Q&A synonyms) are modeling. Sort by column is why months appear Jan–Dec.",
    ], "Calendar[MonthName] sorted by Calendar[MonthNumber] shows January first. Without it, April sorts before February.", "If a number disagrees with Excel, read the Filters pane before rewriting DAX.", "A page-level filter affects…", ["Only one visual", "Every visual on that report page", "Every report in the tenant", "SQL Server"], 1),
    lesson("selection-bookmarks-themes", "Selection, bookmarks, sync slicers, Performance Analyzer, themes", 10, [
      "Selection pane names and shows/hides visuals. Bookmarks capture page state. Sync slicers keep Region aligned across pages. Performance Analyzer times each visual.",
      "Options holds preview features, privacy, and locale. JSON themes lock brand colors. Save .pbix; publish when the model is ready for others.",
      "Treat bookmarks as navigation, not 40 hidden copies of the same page.",
    ], "A button 'See detail' uses a bookmark to show a hidden breakdown. Performance Analyzer shows the matrix at 1800 ms — you slim it while you optimize DAX.", "Bookmarks control the story. Performance Analyzer provides evidence.", "Performance Analyzer is for…", ["Changing license SKU", "Measuring how long visuals and DAX take", "Creating RLS roles", "Installing gateways"], 1),
  ]),
  makePath(3, "ch03-sources", "Foundations", "Data Sources & Connecting to Data", "Files, databases, SaaS, credentials, privacy levels, and multi-source models", [
    lesson("files-folders-sharepoint", "Files, folders, and SharePoint", 9, [
      "Excel, CSV, and text files work if headers are stable and decorative merged cells are gone. Folder and SharePoint Folder combine many files with the same shape.",
      "SharePoint/OneDrive can refresh in the Service without your PC. A file on C:\\Users\\you cannot.",
      "Land files as tables, not as pretty finance templates with titles in rows 1–4.",
    ], "12 monthly CSVs in a SharePoint folder: Get Data → SharePoint Folder → Combine files. Next month is a new file, not a new report.", "If it must refresh unattended, do not leave the source on a laptop disk.", "Why is SharePoint often better than a local Excel file?", ["Excel cannot be used in Power BI", "The Service can refresh cloud files without your PC", "SharePoint is a database", "CSV is illegal"], 1),
    lesson("databases-saas-fabric", "Databases, web/APIs, SaaS, and Fabric", 10, [
      "SQL Server, Azure SQL, Oracle, MySQL, PostgreSQL, Snowflake, Databricks, and Fabric lakehouse/warehouse are typical systems of record. Web and OData pull feeds. Dataflows centralize Power Query.",
      "Salesforce, SAP, Google Analytics, and Power Platform connectors have their own auth and pagination limits. Read them before promising live GA in a board pack.",
      "Keep a source map: table, system, grain, owner.",
    ], "Orders from Azure SQL (Import + incremental), budgets from SharePoint Excel, FX from a web API. You relate on Date and CurrencyCode only after confirming grain (daily rate vs monthly budget).", "Connectors are easy. Grain and keys are the work.", "A dataflow is most useful when…", ["You want to avoid Power BI", "Several reports should reuse the same prepared tables", "You only ever have one .pbix", "You need to draw shapes"], 1),
    lesson("credentials-privacy", "Credentials, privacy levels, and data source settings", 8, [
      "Sources use Windows, SQL, OAuth, or keys. Desktop: Data source settings. Service: semantic model or gateway. Bad credentials are the #1 refresh failure.",
      "Privacy levels (Private / Organizational / Public) stop Query from mixing a public web page into a private HR table. Do not 'ignore privacy' in production.",
      "Document who owns credentials when people leave.",
    ], "Combining a public FX page with Organizational SQL can block folding. Stage FX into a warehouse table so both sides are Organizational.", "Refresh is credential and privacy design, not a checkbox.", "The most common scheduled refresh failure is…", ["Wrong theme color", "Expired or missing credentials", "Too many bookmarks", "Using a card visual"], 1),
  ]),
];
