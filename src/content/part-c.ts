import { makeLesson, makePath, type LearningPath } from "@/content/schema";

function lesson(id: string, title: string, minutes: number, body: string[], example: string, takeaway: string, question: string, options: string[], answer: number) {
  return makeLesson("tmp", 0, false, id, { title, minutes, body, exampleTitle: "Example", example, takeaway, check: { question, options, answer } });
}

export const CURRICULUM_PART_C: LearningPath[] = [
  makePath(13, "ch13-business-dax", "DAX", "DAX for Real-World Business Problems", "Sales, finance, customers, inventory, targets, MTD/YTD, churn, scenarios", [
    lesson("sales-profit-growth", "Sales, revenue, profit, margin, and growth", 10, [
      "Business measures are just named CALCULATE patterns. Revenue, discounts, net sales, COGS, profit, margin % should be a small family with consistent filters (exclude placeholders, include only posted invoices).",
      "Growth is almost always current vs previous using time intelligence — not a hardcoded 2024 minus 2023 column.",
      "Keep a KPI sheet: definition, grain, formula, owner. If two teams disagree, the dictionary wins.",
    ], "Net Sales = SUM(Sales[Amount]) - SUM(Sales[Discount]). Profit = [Net Sales] - [COGS]. Margin % = DIVIDE([Profit], [Net Sales]). Growth % = DIVIDE([Net Sales] - [Net Sales PY], [Net Sales PY]).", "Name the business metric first, then write DAX that matches the dictionary.", "Margin % should use DIVIDE of profit over…", ["Row count", "Net sales (or the dictionary's agreed base)", "Distinct customers", "Page count"], 1),
    lesson("customer-product-inventory-hr", "Customer, product, inventory, procurement, finance, HR patterns", 10, [
      "Customer: new vs existing (first purchase date vs selected period), churn (active last period, silent this period), retention. Product: mix, contribution, cannibalization (advanced).",
      "Inventory: snapshot facts (stock on hand by day) are not additive across dates — use last-known stock, not SUM across days. Procurement: on-time %, price variance. Finance: actual vs budget via two facts. HR: headcount as a snapshot, not SUM of people across months.",
      "Wrong additivity is the classic inventory/HR bug.",
    ], "Stock On Hand = CALCULATE(SUM(Inventory[Qty]), LASTDATE(Date[Date])). Summing inventory across January days would 31× count the warehouse.", "Snapshots are not additive across the snapshot date.", "Inventory quantity across a month should usually…", ["SUM every daily snapshot", "Use the last (or average) snapshot, not a sum of days", "Be a pie chart", "Ignore the date table"], 1),
    lesson("targets-forecast-whatif", "Targets, actual vs budget/forecast, rolling 12, market share, what-if", 10, [
      "Actual vs Budget needs aligned grain (month × product × region) and DIVIDE([Actual] - [Budget], [Budget]). Forecast is another fact or a measure from Copilot/Python — treat it as a version dimension.",
      "MTD/QTD/YTD and rolling 12 are chapter 11 patterns applied to these facts. Market share = DIVIDE([Our Sales], [Market Sales]) from an industry fact or assumed total.",
      "Scenario / what-if: disconnected parameter tables. Complex rules (if customer is gold and region is EU then extra rebate) belong in a rules table, not 12 nested IFs.",
    ], "Variance % = DIVIDE([Total Sales] - [Budget Amount], [Budget Amount]). A What-if PriceLift% measure: [Total Sales] * (1 + SELECTEDVALUE(Lift[Value])).", "Version (Actual/Budget/Forecast) is a dimension. Do not hide it in measure names only.", "Actual vs Budget works best when…", ["They share conformed dimensions at a declared grain", "You merge them into one text column", "You use pie charts only", "You disable relationships"], 1),
  ]),
  makePath(14, "ch14-visuals", "Visuals", "Power BI Visualizations", "The standard visual library, slicers, buttons, custom visuals", [
    lesson("comparison-trend-part", "Bars, columns, lines, areas, combo, pie/donut", 9, [
      "Bars/columns compare categories. Lines/areas show time. Combo = bar + line for volume vs rate. Pies/donuts only for 2–5 parts of a whole — never 20 slices.",
      "The question picks the visual. Ranking → bar. Trend → line. Composition over time → stacked column (with care) or small multiples.",
      "If two visuals say the same thing, delete one.",
    ], "Five regions, one KPI: clustered bar, sorted descending. Month-over-month revenue: line, not pie. Executive 'share of total' for three channels: donut with a card of the total in the hole.", "Question first, visual second.", "Best default for month-over-month revenue?", ["Pie", "Line chart", "Filled map", "Decomposition tree"], 1),
    lesson("geo-table-kpi", "Scatter, maps, table, matrix, card, KPI, gauge, funnel, waterfall, treemap", 9, [
      "Scatter is relationship (discount % vs margin). Maps need real geo fields and a reason — not decoration. Table is lookup; matrix is pivot.",
      "Cards/KPI/gauge are for one number plus target. Funnel is stages. Waterfall is walk from start to end (actual vs budget bridge). Treemap is hierarchical composition.",
      "Ribbon, decomposition tree, key influencers are analytical — put them on analyst pages, not the CEO's first screen.",
    ], "Profit walk: opening profit → price → volume → mix → cost → closing profit as a waterfall. The board understands a bridge; they do not understand 14 cards.", "Waterfalls explain movement. Cards state a point.", "A waterfall chart is ideal for…", ["A 50-slice composition", "Bridging from one total to another through drivers", "Maps", "RLS testing"], 1),
    lesson("slicers-buttons-custom", "Slicers, buttons, images, shapes, smart narrative, custom visuals, Azure Maps", 8, [
      "Slicers are filters with UI. Buttons + bookmarks navigate. Images/shapes/text boxes are chrome — keep them light. Smart narrative generates sentences from measures; always verify numbers.",
      "Custom visuals (AppSource) have licensing, accessibility, and performance costs. Azure Maps replaces older map visuals in many tenants.",
      "Less chrome, more signal.",
    ], "A reset button that clears slicers via a bookmark of the default page state. One custom visual for a Gantt; everything else native.", "Native visuals first. Custom visuals are exceptions with owners.", "Smart narrative should be…", ["Trusted blindly", "Checked against the measures it cites", "Used instead of a model", "A replacement for RLS"], 1),
  ]),
  makePath(15, "ch15-design", "Visuals", "Data Visualization & Dashboard Design", "Layout, color, accessibility, dashboard types, storytelling", [
    lesson("selection-hierarchy-layout", "Visual selection, hierarchy, canvas, spacing, alignment", 9, [
      "Put the decision KPI top-left (or top-center). Supporting trends next. Detail tables last. Alignment and spacing are how busy screens become readable.",
      "Consistency: same color for Actual vs Budget on every page. Same date slicer position. Same number format (1.2k vs 1,200).",
      "Mobile layouts are a separate design: one column, big touch targets, no tiny matrices.",
    ], "Page 1: three cards (Sales, Margin %, vs Budget) + 12-month line + region bar. Page 2: matrix. Not six charts fighting on page 1.", "Hierarchy is a layout decision, not a DAX function.", "The primary KPI should usually sit…", ["In a hidden bookmark", "In a strong position at the top of the page", "Only on Mobile", "In Power Query"], 1),
    lesson("color-type-access-cf", "Color, typography, accessibility, conditional formatting, tooltips, titles", 9, [
      "Yellow-gold palettes work when text stays dark (or cream on dark). Never yellow text on white. Colorblind-safe: do not encode meaning in red/green only — use icons or labels too.",
      "Conditional formatting is for exceptions, not rainbow tables. Tooltips should add a definition or a small trend, not 20 extra fields. Titles should state the question: 'Revenue vs budget by region' not 'Chart 1'.",
      "Accessibility: tab order, alt text, report theme contrast, don't rely on hover alone.",
    ], "Margin % under 15% gets an amber tag plus the word Low — not just a red cell. Dynamic title: \"Sales in \" & SELECTEDVALUE(Date[Year]).", "Encode meaning twice: color and text.", "Conditional formatting works best when…", ["Every cell is a different color", "It highlights exceptions against a rule", "It replaces measures", "It hides the Filters pane"], 1),
    lesson("dashboard-types-story", "Executive vs operational vs analytical dashboards and common mistakes", 8, [
      "Executive: few KPIs, traffic vs last period, links to detail. Operational: near-real-time queues, exceptions. Analytical: decomposition, influencers, what-if.",
      "Storytelling: a beginning (KPI), middle (why), end (action or drill-through). Common mistakes: dual axis without labels, 3D pies, too many slices, rainbow maps, tables of 80 columns.",
      "If the user cannot answer 'what should I do?' the page is a data dump.",
    ], "Ops dashboard: orders stuck in 'picking' > 4 hours, refresh DirectQuery. Exec dashboard: Import, yesterday's close, three KPIs. Do not mix them on one canvas.", "Audience first. Freshness second. Chart type third.", "An executive dashboard should emphasize…", ["Every source column", "A few decision KPIs and variance", "Gateway logs", "M code"], 1),
  ]),
  makePath(16, "ch16-interactivity", "Visuals", "Advanced Report Interactivity", "Drill, bookmarks, sync slicers, field parameters, show/hide", [
    lesson("drill-tooltip-hierarchies", "Drill-down, drill-through, tooltips, report page tooltips, hierarchies", 9, [
      "Drill-down walks a hierarchy on the same visual (Year → Quarter → Month). Drill-through navigates to a dedicated page with filters from the source point. Report page tooltips are mini pages on hover.",
      "Hierarchies live in the model (Date YQM, Product Category→SKU). Edit interactions control whether a bar click filters or highlights peers.",
      "Cross-filter vs cross-highlight changes how busy the page feels. Default highlight on a busy dashboard is often noise.",
    ], "Category bar drill-through to 'SKU detail' page. Filters: Category, Date. The detail page has a back button. Tooltip page shows last 6 months sparkline for that category.", "Drill-through is a page. Drill-down is a hierarchy.", "A report page tooltip is shown when…", ["A gateway refreshes", "The user hovers a visual configured to use that page", "You publish", "You create RLS"], 1),
    lesson("bookmarks-nav-sync", "Bookmarks, buttons, selection pane, sync slicers, navigation architecture", 9, [
      "Page navigation buttons use the 'Page navigation' action. Bookmark navigation toggles states. Selection pane must name visuals ('KPI row', 'Detail matrix') or bookmarks become unmaintainable.",
      "Sync slicers: Region synced across all pages; a 'debug' slicer not synced. Personalized navigation: a landing page with buttons to personas (Finance / Sales).",
      "Architecture: one landing, few topic pages, one glossary page. Avoid 30 tabs of twins.",
    ], "Landing with three buttons: Sales, Finance, Quality. Each goes to a section. Date is synced everywhere. A 'Reset' bookmark restores defaults.", "Navigation is a product. Name every visual.", "Sync slicers are for…", ["Copying DAX", "Keeping the same filter aligned across pages", "Import mode only", "OLS"], 1),
    lesson("field-params-dynamic-showhide", "Field parameters, what-if, dynamic measures/visuals, show/hide", 8, [
      "Field parameters swap axis or measures. Dynamic measures via SWITCH(SELECTEDVALUE(MeasurePicker[Metric])). Show/hide with bookmarks for beginner vs advanced modes.",
      "What-if parameters from chapter 8 belong on analytical pages with a reset button.",
      "Do not hide 12 overlapping visuals if a field parameter would suffice — bookmarks will rot.",
    ], "Measure picker table: Sales, Margin, Orders. One line chart. SWITCH(SELECTEDVALUE(Picker[Metric]), \"Sales\", [Total Sales], \"Margin\", [Margin], [Orders]). Or a field parameter doing the same with less DAX.", "Prefer field parameters over a stack of hidden charts.", "Show/hide via bookmarks is best for…", ["Replacing the date table", "Occasional layout modes, not 20 stacked twins", "Gateway install", "CSV import"], 1),
  ]),
  makePath(17, "ch17-service", "Service", "Power BI Service", "Workspaces, apps, sharing, lineage, pipelines, roles", [
    lesson("workspaces-artifacts", "Interface, workspaces, reports, dashboards, semantic models, apps", 9, [
      "The Service is the cloud ops plane. Workspaces hold semantic models, reports, dashboards, dataflows. Apps package content for a wide audience with a cleaner nav than a raw workspace.",
      "Publishing from Desktop lands in a workspace. Dashboards (pinned tiles) are not the same as reports — they are a thin layer, often overused. Prefer well-designed reports + apps.",
      "My Workspace is a sandbox, not a department production area.",
    ], "Team 'Commercial BI' workspace contains the gold semantic model and 4 reports. An app 'Commercial' is published to 200 sellers with only the reports they need, not the dataset settings.", "Apps for consumers. Workspaces for authors.", "End users should typically consume via…", ["Gateway VM RDP", "A published app (or a controlled share)", "Editing the gold model", "My Workspace of the developer"], 1),
    lesson("share-collab-endorsement", "Sharing, subscriptions, alerts, comments, endorsement, certification", 8, [
      "Sharing a report vs granting workspace roles vs distributing an app are different security surfaces. Subscriptions email a snapshot. Alerts fire on a dashboard tile metric.",
      "Comments are collaboration, not a data dictionary. Favorites are personal. Endorsement (promoted/certified) signals trust. Certification should require a review checklist.",
      "Lineage view and impact analysis show what breaks if you change the gold model.",
    ], "Certified semantic model 'Finance Gold' with lineage from Azure SQL → dataflow → model → 12 reports. Impact analysis before renaming a measure used everywhere.", "Certification is a process, not a badge click.", "Lineage view helps you…", ["Choose a pie chart", "See source-to-report dependencies before a change", "Write M", "Create bookmarks"], 1),
    lesson("pipelines-roles-distribution", "Deployment pipelines, workspace roles, distribution strategy", 8, [
      "Deployment pipelines move Dev → Test → Prod with rules (connection strings, parameters). Workspace roles: Viewer, Contributor, Member, Admin — least privilege.",
      "Distribution: app for scale, share for exceptions, embed for products. Do not email .pbix as the release process.",
      "Content strategy: one gold model, many thin reports, one app per audience.",
    ], "Dev workspace uses a small Import sample. Pipeline rule switches the parameter ServerName to prod SQL in the Prod stage.", "Parameters + pipelines beat hand-editing production.", "Viewer vs Admin is an example of…", ["DAX context", "Workspace roles / least privilege", "Unpivot", "Sort by column"], 1),
  ]),
  makePath(18, "ch18-security", "Service", "Power BI Security", "Roles, RLS, OLS, sensitivity labels, sharing", [
    lesson("authz-workspace", "Authentication, authorization, workspace roles", 8, [
      "Authentication is who you are (Microsoft Entra ID). Authorization is what you can see (workspace roles, app audiences, RLS, OLS, sharing links).",
      "Viewer: consume. Contributor: edit content. Member: plus some permissions. Admin: the break-glass role. External users (B2B) need a plan for licensing and RLS.",
      "Never use a single Admin-only workspace for 200 consumers.",
    ], "Sellers are Viewers of the app. Two analysts are Contributors in the workspace. One BI lead is Admin. Sharing 'anyone in org' links is disabled in tenant settings.", "Roles scale. Links leak.", "Consumers of an app are usually…", ["Admins of the gold workspace", "Viewers (or app audience members) without model edit rights", "Gateway service accounts", "SQL sysadmins"], 1),
    lesson("rls-static-dynamic", "Static and dynamic RLS, USERNAME, mapping tables, testing", 10, [
      "Row-Level Security filters fact/dimension rows per role. Static RLS: [Region] = \"West\" in a role. Dynamic RLS: [Email] = USERPRINCIPALNAME() or a mapping table of user → region.",
      "USERNAME() vs USERPRINCIPALNAME() depends on whether you get domain\\user or email. Always test with 'View as' in Desktop and as a real user in the Service.",
      "Map users to dimensions in a table, do not maintain 50 static roles.",
    ], "Table UserRegion(UserEmail, Region). Role SalesPeople: [Region] IN VALUES related to FILTER(UserRegion, UserRegion[UserEmail] = USERPRINCIPALNAME()). A seller sees only their regions.", "Dynamic RLS + a mapping table scales. Static roles do not.", "Dynamic RLS typically filters using…", ["Theme colors", "USERPRINCIPALNAME() (or USERNAME) plus a mapping table", "Bookmarks", "Sort by column"], 1),
    lesson("ols-labels-purview", "Object-level security, sensitivity labels, Purview, secure sharing", 8, [
      "OLS hides tables or columns (e.g. Cost) from a role. Combine with RLS carefully. Sensitivity labels (Microsoft Purview / Information Protection) travel with files and exports.",
      "Secure sharing: no 'publish to web' for confidential data. External users in Entra B2B. Best practice: gold model in a locked workspace, thin reports, RLS tested, labels on.",
      "Security is a design, reviewed, not an afterthought before go-live.",
    ], "Role ExternalAuditor can see Sales[Amount] but OLS hides Sales[UnitCost] and the Profit measure depending on those columns.", "RLS filters rows. OLS hides objects.", "Publish to web is inappropriate for…", ["Public marketing stats you intend to share", "Confidential HR or finance models", "Sample Contoso", "Training screenshots of demo data"], 1),
  ]),
  makePath(19, "ch19-refresh-gateway", "Service", "Power BI Refresh & Gateway", "Schedules, gateways, credentials, incremental, troubleshooting", [
    lesson("refresh-types-history", "Scheduled, on-demand, history, and failures", 8, [
      "Import models refresh on a schedule (count depends on license/capacity). On-demand is the manual button. History shows duration and errors. Failure emails should go to an on-call mailbox, not one person on holiday.",
      "Cloud sources can refresh without a gateway. On-premises SQL/files need a gateway.",
      "Watch duration trending up — that is your capacity warning.",
    ], "Refresh 05:30 after the ERP load at 04:30. History shows 18 minutes; last month it was 7. You investigate incremental windows and a folding break.", "Refresh is an SLA, not a convenience.", "On-premises SQL usually needs…", ["A pie chart", "An on-premises data gateway", "Publish to web", "A bookmark"], 1),
    lesson("gateway-arch", "Personal vs standard gateway, clusters, credentials, cloud vs on-prem", 9, [
      "Personal gateway runs as a user and dies when the PC sleeps — do not use it for production. Standard gateway is a service on a server, clusterable for HA.",
      "Data source credentials on the gateway must match the source (SPN preferred over a named employee). Architecture: sources → gateway VM(s) → Service.",
      "Limitations: some sources cannot fold; some refresh counts; query timeouts.",
    ], "Two gateway VMs in a cluster named 'Corp-GW'. SQL data source uses a service account. If one VM patches, the other takes traffic.", "Production gateways are servers in a cluster, not laptops.", "A personal gateway is risky in production because…", ["It is too fast", "It depends on a user session/PC being online", "It forbids Import", "It disables DAX"], 1),
    lesson("incremental-troubleshoot", "Incremental refresh, troubleshooting, monitoring", 9, [
      "Incremental refresh partitions by date (RangeStart/RangeEnd parameters). Only recent partitions refresh. Detect data changes can re-import a partition if a watermark column moved.",
      "Troubleshoot: credentials, privacy, gateway online, source timeout, dynamic data source, capacity throttle. Monitoring: refresh history, tenant audit, Fabric monitoring hub.",
      "Fix the source or folding before buying more refreshes.",
    ], "RangeStart/RangeEnd on OrderDate, store 5 years, refresh last 10 days. A late-arriving sale from 12 days ago needs a slightly larger window or change detection.", "Incremental is a date partition strategy.", "RangeStart and RangeEnd are used for…", ["Bookmarks", "Incremental refresh partitions", "RLS mapping", "Themes"], 1),
  ]),
  makePath(20, "ch20-performance", "Service", "Power BI Performance Optimization", "Analyzer, model, DAX, VertiPaq, aggregations, tools", [
    lesson("analyzer-visual-query", "Performance Analyzer, visual cost, query reduction", 8, [
      "Performance Analyzer tells you DAX query vs visual display time. Too many visuals, high-cardinality slicers, and bidirectional filters are usual suspects.",
      "Query reduction: apply button on slicers so every click does not fire 20 queries. Remove unused fields from field wells.",
      "DirectQuery: every interaction is a SQL round trip — design fewer, simpler visuals.",
    ], "Analyzer: matrix 2200 ms DAX, 50 ms visual. You rewrite the measure and add an aggregation table. The next run is 180 ms.", "Measure the slow visual. Do not guess.", "An Apply button on slicers helps by…", ["Changing licenses", "Reducing the number of queries fired while users click", "Hiding RLS", "Unpivoting"], 1),
    lesson("model-dax-vertipaq", "Model optimization, cardinality, star schema, VertiPaq, engines", 10, [
      "Reduce cardinality (split datetime, group codes), drop unused columns, integer surrogate keys, star schema, single-direction filters. VertiPaq compresses repeating values — unique GUIDs and comments compress poorly.",
      "Storage engine (SE) handles scans; formula engine (FE) handles iterators and callbacks. Heavy SUMX over huge tables is FE pain.",
      "DAX optimization: avoid late FILTER on full facts when CALCULATE filters suffice; materialize VAR tables once.",
    ], "Split OrderDateTime into Date and Time. Cardinality of Date is ~2,000, Time is 1,440, vs 2M unique datetimes. VertiPaq loves that.", "Cardinality is the silent file-size and speed tax.", "High-cardinality text columns usually…", ["Compress extremely well", "Hurt VertiPaq compression and speed", "Speed up DirectQuery always", "Replace a date table"], 1),
    lesson("aggs-tools", "Aggregations, composite, DAX Studio, Tabular Editor, VertiPaq Analyzer", 9, [
      "Aggregation tables answer totals from a small Import table while detail stays DirectQuery. Composite + Dual mode on dimensions is the usual pattern.",
      "DAX Studio: server timings, query plans. Tabular Editor: calc groups, batch property edits. VertiPaq Analyzer: column sizes. Query Diagnostics: Power Query folding.",
      "Tools show facts. Opinions do not.",
    ], "Agg table SalesMonthly(YearMonth, ProductKey, Amount). User hits a year card → agg. User drills to invoice → detail DirectQuery. Manage aggregations binds them.", "Aggregations are a hot-path cache with a fallback to detail.", "DAX Studio is primarily used to…", ["Draw shapes", "Inspect DAX query plans and timings", "Set themes", "Create gateways"], 1),
  ]),
  makePath(21, "ch21-modes", "Service", "Power BI Connectivity Modes", "Import, DirectQuery, Live, Dual, Direct Lake, trade-offs", [
    lesson("import-dq-live", "Import vs DirectQuery vs Live Connection", 9, [
      "Import: fastest interactive DAX, scheduled freshness. DirectQuery: source freshness, source security possible, slower, DAX/model limits. Live Connection: no local model (or limited), measures live in the remote dataset/SSAS.",
      "Modeling limitations in DQ: fewer calculated tables, some time intel patterns hurt SQL. DAX limitations: avoid huge iterators.",
      "Choose with a table: freshness SLA, row counts, source power, author skill.",
    ], "HR headcount must match SAP now: DirectQuery to a view. Last night's sales for 2,000 users: Import. A certified gold model: Live Connection from thin reports.", "Mode is an architecture choice, not a checkbox you flip late.", "Live Connection means…", ["You always use a gateway laptop", "The report uses a remote semantic model rather than its own Import copy", "CSV only", "No slicers"], 1),
    lesson("composite-dual-directlake", "Composite, Dual, Direct Lake, and how to choose", 10, [
      "Composite: mixed storage. Dual: a dimension that can filter both Import aggs and DQ facts. Direct Lake (Fabric): reads Delta in OneLake with near-Import speed without classic Import copy — with its own fallback and capacity rules.",
      "Trade-offs: Direct Lake freshness vs Import's modeled calculated tables. DQ vs Direct Lake vs Import for data freshness.",
      "Document the mode on the model one-pager so nobody 'switches to DQ' in panic.",
    ], "Fabric lakehouse gold tables + Direct Lake semantic model for yesterday-T+2 hours sales. Fallback to DirectQuery when the lake cannot serve the query.", "Direct Lake is Fabric-era Import-like speed on lake data.", "Dual storage mode is useful when…", ["You need a dimension to filter both Import and DirectQuery tables", "You hide the Fields pane", "You export PDF", "You disable DAX"], 1),
  ]),
  makePath(22, "ch22-incremental-large", "Service", "Incremental Refresh & Large Data", "RangeStart/End, hybrid tables, partitioning, enterprise scale", [
    lesson("why-config-incremental", "Why incremental refresh and how to configure it", 9, [
      "Full refresh of 500M rows every night will fail or crowd the gateway. Incremental refresh reloads recent partitions only.",
      "Create RangeStart/RangeEnd DateTime parameters, filter the fact query with them, configure policy: store 5 years, refresh 7 days, optionally detect data changes.",
      "Historical data stays; only the hot window moves. Hybrid tables can keep the latest partition in DirectQuery (Premium/Fabric).",
    ], "Filter: [OrderDate] >= RangeStart and [OrderDate] < RangeEnd. Policy: 5 years stored, 10 days refreshed. Late facts older than 10 days need change detection or a bigger window.", "Parameters first, policy second, test with a small date range in Desktop.", "RangeStart/RangeEnd must…", ["Be bookmarks", "Filter the fact query to define partitions", "Be measures", "Be RLS users"], 1),
    lesson("partitions-hybrid-large", "Partitions, hybrid tables, large semantic models, troubleshooting", 9, [
      "Partitioning is what incremental refresh actually is. Large semantic models (Premium) allow bigger memory with specific settings. Hybrid: hot data DQ, cold Import.",
      "Performance: sort by date in the source, integer keys, aggregations on top. Troubleshoot: partition not updating, timezone off-by-one on RangeStart, query not folding the date filter.",
      "Enterprise datasets need an owner, an SLA, and a size dashboard — not hope.",
    ], "Timezone: RangeStart stored UTC while OrderDate is local — the 00:00 partition misses a night shift. Align timezone explicitly in M.", "Partition filters must match the real business date and timezone.", "A hybrid table typically…", ["Stores everything in Excel", "Keeps a hot DirectQuery partition plus Import history", "Disables the date table", "Removes gateways"], 1),
  ]),
  makePath(23, "ch23-sql", "Data platform", "Power BI with SQL & Databases", "SQL for analysts, folding, views, warehouse concepts", [
    lesson("sql-basics", "SELECT, WHERE, GROUP BY, JOINs, subqueries, CTEs, windows", 11, [
      "Analysts who can write SQL debug Power BI faster. SELECT the columns you need. WHERE pushes filters. GROUP BY is a grain change. JOINs must state grain or you duplicate facts (the classic fan-out).",
      "CTEs and window functions (ROW_NUMBER, SUM() OVER) belong in warehouse views when the logic is reusable. Stored procedures as sources have folding and parameter limits — prefer views/tables.",
      "Temporary tables are for database work, not for Power BI refresh contracts.",
    ], "A join of Orders to OrderLines without aggregation duplicates order header freight on every line. SUM(Freight) then explodes. Fix in SQL with a header-grain freight fact or allocate freight once.", "Join fan-out is a grain bug. SQL makes it visible.", "A JOIN that duplicates fact rows will…", ["Always improve compression", "Inflate measures if you SUM the duplicated column", "Fix RLS", "Replace DAX"], 1),
    lesson("folding-native-vs-pq", "Query folding, native SQL, where to transform", 9, [
      "Query folding: Power Query steps become SQL. Native SQL (Value.NativeQuery) can be a folding friend or a refresh blocker depending on how you wrap it.",
      "Database-side transformations (views) are better when many tools need the same grain. Power Query is better for light typing and file sources.",
      "Build analytical views: one row per fact grain, clean keys, no formatting. That is a mini warehouse.",
    ], "View vw_SalesLines with keys and amounts. Power Query only sets types. Folding stays intact. A custom M function per row would break folding and pull the whole table.", "Views for grain. Power Query for last-mile.", "If query folding breaks, Power BI may…", ["Run faster always", "Pull far more rows and refresh slowly", "Delete RLS", "Upgrade licenses automatically"], 1),
    lesson("dw-concepts", "Warehouse ideas: keys, facts, conformed dimensions", 7, [
      "A warehouse (or lakehouse gold layer) is where enterprise Power BI should sit. Keys, slowly changing dimensions, and conformed dates live there so 15 reports do not reinvent them.",
      "Connecting Power BI to enterprise databases: least-privilege SQL user, views not base tables, documented SLAs.",
      "Power BI is not your warehouse. It can pretend until the first 200M-row surprise.",
    ], "Gold.FactSales + Gold.DimDate + Gold.DimProduct. Power BI Import or Direct Lake on those objects only — never on raw bronze landing tables.", "Report on gold. Land in bronze.", "Conformed dimensions exist so that…", ["Pies look 3D", "Multiple facts share the same Product/Date meaning", "Gateways sleep", "DAX is disabled"], 1),
  ]),
  makePath(24, "ch24-apis-cloud", "Data platform", "Power BI with APIs & Cloud Data", "REST, OAuth, JSON, pagination, lakes, Fabric sources", [
    lesson("rest-auth-json", "REST APIs, auth, headers, JSON, parameters", 9, [
      "REST returns JSON (or XML). You need a URL, method, headers (Authorization, Accept), and sometimes a body. OAuth is delegated tokens that expire — refresh patterns belong in a service, not a manual paste every week.",
      "Power Query Web.Contents with RelativePath and Query records is the refresh-safe pattern. Expand JSON records/lists to tables, then type.",
      "API errors (401, 429, 500) should retry with backoff in the service that owns the extract, or fail the refresh loudly.",
    ], "GET /orders?page=1 with Bearer token. JSON list data[]. Expand, then page=2 until empty. 429 Too Many Requests: wait; do not hammer in a tight List.Generate without delay.", "Treat APIs as systems with rate limits, not as CSVs.", "A 401 from an API usually means…", ["Wrong visual", "Authentication/token problem", "Need a pie chart", "Mark as date table"], 1),
    lesson("pagination-dynamic-graph", "Pagination, dynamic calls, Graph, SaaS, lakes", 9, [
      "Pagination styles: page index, skip/take, nextLink. Dynamic API calls (URL from a column) often break Service refresh — stage lists of IDs in a table first.",
      "Microsoft Graph, Azure, SaaS connectors, cloud databases, and data lakes (ADLS, OneLake) are all 'cloud data' with different security models. Fabric sources (lakehouse tables, warehouses, eventhouses) are first-class in Fabric tenants.",
      "Error handling: keep raw JSON in bronze for replay.",
    ], "You need 500 customer IDs from SQL, then GET /customers/{id}. Better: a bulk API or a warehouse job. Row-by-row Web.Contents in Power Query will be slow and fragile.", "Bulk extract in the platform. Thin Power Query on top.", "nextLink pagination means…", ["A DAX function", "Each response tells you the URL of the next page", "A bookmark", "OLS"], 1),
  ]),
];
