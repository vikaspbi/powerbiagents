import { makeLesson, makePath, type LearningPath } from "@/content/schema";

function lesson(id: string, title: string, minutes: number, body: string[], example: string, takeaway: string, question: string, options: string[], answer: number) {
  return makeLesson("tmp", 0, false, id, { title, minutes, body, exampleTitle: "Example", example, takeaway, check: { question, options, answer } });
}

export const CURRICULUM_PART_E: LearningPath[] = [
  makePath(37, "ch37-troubleshooting", "Delivery", "Power BI Troubleshooting", "Refresh, relationships, DAX, M, folding, blanks, Desktop vs Service", [
    lesson("refresh-gateway-creds", "Refresh, gateway, and credential errors", 8, [
      "Read the error to the last sentence. Credential expired, gateway offline, timeout, privacy firewall, dynamic data source, capacity throttle have different fixes.",
      "Reproduce in Desktop with the same parameters. Test the gateway connection. Check source logs.",
      "A screenshot of 'something went wrong' is not a ticket. The request ID and timestamp are.",
    ], "Scheduled refresh fails 07:02. History: 'The credentials provided cannot be used'. The SQL password rotated Friday. Update Service credentials; document the rotation in the runbook.", "Most 'Power BI is down' is credentials or gateway.", "The first place to inspect a failed schedule is…", ["The pie chart", "Refresh history (and gateway status)", "The theme JSON", "Mobile layout"], 1),
    lesson("model-dax-m-visual", "Relationships, circular DAX, folding, blanks, visual errors", 9, [
      "Ambiguous relationship paths and both-direction filters cause 'circular' or unexpected filters. Circular DAX dependencies: two measures reference each other. M errors: a step assumes a column that was renamed.",
      "Query folding issues: a step that cannot fold. Performance: see chapter 20. Visual errors: wrong field types, too many categories.",
      "Data mismatch / missing / duplicate / blank results: start from grain and filters, not from the visual skin. Desktop vs Service: different credentials, gateway, preview features, or an old published model.",
    ], "Blanks in a matrix: unmatched keys (orphan facts) or a filter that removed the dimension row. Show items with no data is a bandage; fix keys in ETL.", "Blanks are usually keys or filters, not 'DAX is broken'.", "Orphan fact keys typically show…", ["Faster refresh", "Blank dimension labels or missing rows", "Better RLS", "Automatic certification"], 1),
    lesson("diagnostic-method", "A repeatable diagnostic methodology", 7, [
      "1) Reproduce. 2) Isolate: one visual, one measure, one filter. 3) Check grain and relationships. 4) Check Filters pane. 5) Performance Analyzer / DAX Studio. 6) Compare Desktop vs Service. 7) Write the root cause in the ticket.",
      "Do not change five things at once. You will not know what fixed it.",
      "Keep a known-good .pbix and a sample of the source.",
    ], "Bug: 'YTD is double'. Isolate: card vs matrix. Filters pane has a leftover page filter on Date. Remove it. Document 'do not put Date on page filter when using YTD measures'.", "Isolate, then change one variable.", "Changing five things at once makes it…", ["More scientific", "Hard to know the actual fix", "Required by PL-300", "A Fabric shortcut"], 1),
  ]),
  makePath(38, "ch38-methodology", "Delivery", "Power BI Project Development Methodology", "From requirements to production support", [
    lesson("discover-kpis-sources", "Requirements, business questions, KPIs, source analysis, profiling", 8, [
      "Start with decisions and questions, not with a list of visuals. KPI definition includes formula, grain, time, filters, owner. Source analysis and profiling kill surprises (null keys, late facts).",
      "Architecture: mode, gateway, workspace, RLS. Then model, transform, DAX, design.",
      "If stakeholders cannot name the comparison (vs budget / vs last year), you do not have a requirement yet.",
    ], "Question: 'Are we on track for gross margin this quarter vs budget in EU?' KPI: Gross Margin % as (Revenue-COGS)/Revenue, posted invoices, EU as Region, quarter as fiscal. Sources: ERP + budget file. Profile 10 minutes later you find COGS nulls.", "A KPI is a contract. A screenshot is not.", "A complete KPI definition includes…", ["Only the color", "Formula, grain, time window, filters, owner", "The pie chart", "The intern's laptop path"], 1),
    lesson("build-uat-run", "Build, test, UAT, docs, deploy, train, maintain, change requests", 8, [
      "Build in DEV. Test with reconcilations (chapter 39). UAT with real users and real security. Document. Deploy via pipeline. Train with scenarios, not a 90-minute click tour. Production support: an alias, SLAs, a change-request path.",
      "Maintenance is refresh, user access, and metric changes. Treat change requests as mini projects if they alter grain.",
      "Go-live is the start of operations.",
    ], "UAT script: 12 business questions, expected numbers from Finance, RLS test users, mobile check. Sign-off is a dated email, not a thumbs-up in a hallway.", "UAT is evidence. Hallway yes is folklore.", "Changing grain after go-live should be…", ["A silent DAX tweak", "A change request because historical comparisons may break", "Done only in bookmarks", "Impossible"], 1),
  ]),
  makePath(39, "ch39-testing", "Delivery", "Power BI Testing & Data Validation", "Reconciliation, DAX tests, RLS, refresh, UAT", [
    lesson("reconcile-kpis-dax", "Source-to-report, counts, aggregations, KPI and DAX tests", 9, [
      "Reconcile row counts and sums from source (or gold) to the model to the visual. Aggregation checks: SUM of parts equals card (or you can explain the filter).",
      "DAX testing: known fixtures (the Sales Lab 2295), edge dates, no-rows, divide by zero. Filter and drill-through tests: a script of clicks.",
      "Automated testing concepts: DAX queries in CI, Best Practice Analyzer, compare folders in Git.",
    ], "SQL: SUM(Amount) WHERE region='USA' = 1225. Power BI card with Region=USA = 1225. Matrix USA row = 1225. If the card differs, Filters pane or a hidden measure filter is guilty.", "Three-way match: source, model, visual.", "A fixture in DAX testing is…", ["A lightbulb", "A known input and expected measure result", "A gateway VM", "A theme"], 1),
    lesson("rls-refresh-perf-regression", "RLS, refresh, performance, regression, UAT, production checks", 8, [
      "RLS testing: View as each role + a real AAD test account. Refresh testing: full and incremental, failure injection (bad password) to see alerts. Performance: Analyzer budgets (e.g. page < 3s on capacity).",
      "Regression: a suite of DAX queries saved from last release. UAT: business signs numbers. Production validation: first refresh, first-hour usage, a 'known question' card.",
      "If you cannot re-run the test, it was a demo.",
    ], "Store EVALUATE queries for [Total Sales], [YTD], [USA Sales] in Git. CI runs them against a tiny Import fixture after each PR.", "Tests that run in CI survive holidays.", "View as role is used to…", ["Change themes", "Test RLS as another user", "Unpivot", "Create capacities"], 1),
  ]),
  makePath(40, "ch40-docs-standards", "Delivery", "Power BI Documentation & Best Practices", "Dictionaries, naming, folders, comments, standards", [
    lesson("dictionaries-docs", "Data dictionary, KPI dictionary, report and DAX docs, architecture", 8, [
      "Data dictionary: tables, columns, grain, source. KPI dictionary: the contract from chapter 38. Report docs: audience, refresh SLA, how to filter. DAX docs: measure definitions in display folders + comments.",
      "Architecture and source mapping: a one-page diagram. Transformation docs: the non-obvious Applied Steps.",
      "If it only lives in someone's head, it is not a standard.",
    ], "Measure Total Sales in folder 'Sales / Core' with description 'Sum of Sales[Amount] for posted invoices, excludes placeholders.' That description shows in the Fields pane.", "Descriptions are documentation that travels with the model.", "A KPI dictionary is…", ["Optional clip art", "The agreed formula and grain for each metric", "A bookmark", "A Python notebook only"], 1),
    lesson("naming-folders-vcs", "Naming, folders, comments, version control, checklists", 7, [
      "Naming conventions: dim_/fact_ or business names, no spaces in technical keys, measures as nouns. Display folders beat 200 measures in a pile. Comments in DAX and M for the next human.",
      "Folder structure in repos: /models /reports /docs. Version control every certified model. Governance checklist before certification (RLS tested, dictionary updated, performance budget met).",
      "Standards are how a CoE scales.",
    ], "Checklist: [ ] grain stated [ ] date table marked [ ] RLS tested [ ] Analyzer < 3s [ ] descriptions filled [ ] pipeline parameter set. No check, no certified badge.", "Certification without a checklist is marketing.", "Display folders help by…", ["Speeding SQL", "Grouping measures/columns for authors", "Replacing RLS", "Turning off refresh"], 1),
  ]),
  makePath(41, "ch41-domain", "Business", "Business Intelligence Domain Knowledge", "Sales, finance, supply chain, HR, marketing, KPI frameworks", [
    lesson("commercial-ops-finance", "Sales, finance, procurement, supply chain, inventory, manufacturing", 9, [
      "Sales: pipeline, bookings, billings, same-store, discount leakage. Finance: P&L, BS, cash, actual vs budget, close calendar. Procurement: savings, on-time, supplier risk. Supply chain/inventory: turns, days on hand, stockouts (snapshot grain!). Manufacturing: OEE, scrap, yield.",
      "Each domain has additive vs non-additive metrics. Learn the language or your model will be technically pretty and commercially wrong.",
      "Sit with a domain expert for one hour before modeling.",
    ], "Inventory turns = COGS / average stock. Average stock is not SUM of daily stock. If you get this wrong, Operations will never trust the report again.", "Domain grain beats fancy DAX.", "Days on hand is typically based on…", ["SUM of all snapshot rows in the month as if additive", "Stock relative to demand, using a snapshot-aware stock measure", "A pie", "USERNAME()"], 1),
    lesson("people-customer-exec", "HR, marketing, customer, service, project, executive metrics", 8, [
      "HR: headcount (snapshot), attrition, time to hire. Marketing: funnel, CAC, campaign ROI (attribution fights). Customer: NPS, LTV, churn definitions. Service: SLA, backlog. Project: earned value, RAID logs as factless facts.",
      "KPI frameworks (OKR vs balanced scorecard) decide what the exec pack contains. Executive reporting is variance and risk, not 80 operational columns.",
      "Write definitions in the language of that function.",
    ], "Attrition % = leavers in period / average headcount. Average headcount uses start/end snapshots, not SUM of daily badges through a turnstile fact without design.", "HR metrics are snapshot math until proven otherwise.", "Executive packs should emphasize…", ["Every factory sensor", "Variance, risk, and a few owned KPIs", "M query steps", "Gateway versions"], 1),
  ]),
  makePath(42, "ch42-case-studies", "Business", "Real-World Power BI Case Studies", "Classic dashboards and the metrics they hang on", [
    lesson("sales-finance-hr-cases", "Sales, finance, HR, procurement, inventory packs", 9, [
      "Sales dashboard: trend, pipeline or actuals, product/region mix, vs target. Finance: actual vs budget waterfall, working capital. HR: headcount movement bridge. Procurement: spend cube + on-time. Inventory: stock vs cover days.",
      "Each pack needs a date grain, a grain statement, and one 'so what' KPI.",
      "Copy layouts, not someone else's wrong grain.",
    ], "Sales: cards for MTD, vs target, vs PY; line for 12 months; bars for region; drill-through to SKU. Target is a monthly fact. Do not allocate annual target equally if seasonality exists.", "Seasonality belongs in the target fact, not in hope.", "A sales vs target report needs…", ["Only a pie", "Aligned grain between actuals and target facts", "Publish to web", "Python in a visual"], 1),
    lesson("customer-marketing-exec-time", "Customer, marketing, projects, exec, MTD/QTD/YTD, actual vs forecast", 8, [
      "Customer profitability: revenue − cost-to-serve (often incomplete — show coverage). Marketing: funnel conversion with clear attribution caveat. Project dashboard: status, dates, cost. Executive: 5 KPIs + exceptions.",
      "MTD/QTD/YTD and actual vs forecast are chapter 11+13 applied. Supplier performance: OTIF. Customer profitability: contribution margin after discounts.",
      "State caveats on the page. Trust dies in footnotes nobody reads — put them in the subtitle.",
    ], "Subtitle: 'Profitability excludes unallocated warehouse overhead (see dictionary).' Users may dislike it; auditors will like you.", "Caveats on the canvas beat caveats in a wiki.", "Contribution margin is typically…", ["Revenue minus variable costs (per your dictionary)", "Always equal to cash", "A bookmark", "USERNAME()"], 0),
  ]),
  makePath(43, "ch43-enterprise-cases", "Business", "Advanced Enterprise Case Studies", "Multi-country, currency, language, scale, CoE patterns", [
    lesson("global-currency-language", "Multi-country, multi-currency, multi-language", 9, [
      "Multi-country: conformed Date (with local holidays as attributes), Region hierarchy, RLS by country. Multi-currency: store amounts in transaction currency + a rate fact, report in a presentation currency measure. Do not multiply rates at the wrong grain (monthly rate on a daily fact without a rule).",
      "Multi-language: translations in the model (XMLA/Tabular Editor) or a label table + field parameters. Do not duplicate 3 models for 3 languages if you can translate captions.",
      "Global rollups need an FX policy written down.",
    ], "Sales[Amount] in txn currency. Rate[Date, From, To, Rate]. Amount USD = SUMX(Sales, Sales[Amount] * LOOKUPVALUE of daily rate). Policy: rate of posting date, not invoice print date — written in the dictionary.", "FX is a policy plus a rate fact.", "Applying a monthly FX rate to daily facts without a rule can…", ["Improve RLS", "Misstate revenue vs the accounting policy", "Fix folding", "Replace a date table"], 1),
    lesson("scale-security-release", "Multiple facts, heavy RLS, large data, DirectQuery/composite, CoE release", 9, [
      "Multiple facts + complex RLS + incremental + composite is a program, not a weekend .pbix. Centralized reporting vs self-service: gold model Live connected. DEV/TEST/PROD from chapter 27.",
      "Production deployment: freeze, refresh, smoke test, communicate. Enterprise semantic model: one Sales Gold, versioned.",
      "If only one hero knows the model, you do not have an enterprise model — you have a bus factor of 1.",
    ], "Sales Gold v14 in Prod, v15 in Test with a new RLS map. Pipeline on Friday after UAT. Monday smoke: USA manager, EU manager, auditor OLS role.", "Release like software. Heroes do not scale.", "A bus factor of 1 means…", ["Great clustering", "Only one person can change the model safely", "Direct Lake is on", "The theme is yellow"], 1),
  ]),
  makePath(44, "ch44-interview", "Career", "Power BI Interview Preparation", "Fundamentals through scenario and architecture questions", [
    lesson("interview-core", "Fundamentals, PQ, modeling, DAX, visuals, Service, gateway, RLS", 9, [
      "Expect: Import vs DQ, query folding, star vs snowflake, CALCULATE in one sentence, ALL vs ALLSELECTED, why a date table, how refresh works, static vs dynamic RLS.",
      "Scenario: 'Numbers don't match Excel' — you talk Filters pane, grain, duplicates, hidden page filters. Architecture: gold model, pipelines, capacity.",
      "Speak with an example, not a slogan.",
    ], "Q: 'What is CALCULATE?' A: 'It evaluates an expression in a modified filter context. Example: USA Sales = CALCULATE([Total Sales], Sales[Region]=\"USA\") which is 1225 on the lab model.'", "Interview answers need a tiny example.", "ALL vs ALLSELECTED is a classic question because…", ["They are identical", "They differ on whether slicers stay in % of total", "They are M functions", "They set tenant settings"], 1),
    lesson("interview-scenario-managerial", "Scenario, troubleshooting, project, and managerial questions", 8, [
      "Scenario-based: design a model from a messy Excel. Troubleshooting: refresh failed. Project: how you gathered KPIs. Managerial: how you say no to 40 visuals, how you run UAT, how you handle a director who wants publish-to-web.",
      "Structure: context, options, recommendation, risk.",
      "You are hired for judgment, not for remembering every DAX function name.",
    ], "Director wants Publish to web for the margin report. You explain anonymous access, recommend app + Pro, offer a paginated PDF subscription if email is the real need.", "Translate the ask (email/PDF/share) before jumping to a feature.", "A good 'numbers don't match' answer starts with…", ["Rewriting the whole model", "Grain, filters, and a reconciliation to source", "Changing the theme", "Deleting Date"], 1),
  ]),
  makePath(45, "ch45-portfolio", "Career", "Power BI Portfolio Projects", "Beginner to enterprise end-to-end", [
    lesson("portfolio-levels", "Beginner, intermediate, advanced, domain packs, enterprise path", 8, [
      "Beginner: one fact, one date, five measures, one page, documented grain. Intermediate: two facts, RLS demo, bookmarks, incremental on a sample. Advanced: composite or Direct Lake, calc groups, performance notes.",
      "Domain packs (sales/finance/HR/procurement/supply/manufacturing/exec) show you speak business. Enterprise project: requirements → data → model → DAX → report → deployment notes.",
      "A public sample with a fake 'certified' badge is weaker than a README that admits limitations.",
    ], "Portfolio README: source (Contoso), grain, measures list, RLS roles, refresh, what you would do with a real warehouse. Screenshots of Analyzer. Link to this app's DAX lab exercises you passed.", "Show your thinking. Hide nothing that an interviewer will poke.", "A strong portfolio project includes…", ["Only colors", "Grain, measures, security, and refresh/deployment notes", "Publish to web of real HR data", "Unexplained 30 pages"], 1),
  ]),
  makePath(46, "ch46-pl300", "Career", "Power BI Certification Preparation", "PL-300 skills, traps, mock strategy", [
    lesson("pl300-skills-strategy", "Syllabus areas, practice, traps, exam strategy", 9, [
      "PL-300 (name/skills can evolve — check Microsoft Learn): prepare data, model, visualize, analyze, deploy & maintain (Service, security). Practice: Microsoft Learn labs + this curriculum's checks.",
      "Traps: auto date/time, bi-directional defaults, ALL vs ALLSELECTED, gateway vs cloud, RLS vs sharing, paginated vs interactive, Import vs DQ.",
      "Exam strategy: read what's asked (the business constraint), eliminate impossible SKUs, do not overfit your workplace's odd setup.",
    ], "Question stem: 'users must see only their region and the dataset is Import'. Answer involves RLS, not DirectQuery row predicates at source — unless they specify source security.", "The constraint in the stem beats your company's habits.", "A frequent PL-300 trap is…", ["Forgetting that RLS is not the same as workspace Viewer vs a filter on a page", "Using a bar chart", "Saving a file", "Naming a measure"], 0),
  ]),
  makePath(47, "ch47-mastery", "Career", "Power BI Mastery & Architecture", "Semantic strategy, CoE, capacity, future-ready BI", [
    lesson("semantic-strategy-coe", "Enterprise semantic models, CoE, self-service, operating model", 9, [
      "Semantic model strategy: few certified models, thin reports, XMLA for advanced ops. BI architecture with Fabric: OneLake + gold + Direct Lake or warehouse + Import.",
      "Capacity planning: refresh windows, interactive CPU, DirectQuery load. Governance and security architecture from earlier chapters. Deployment architecture: Git + pipelines.",
      "Self-service BI strategy: sandboxes + promotion path. Center of Excellence: standards, reviews, office hours. Operating model: who pays capacity, who certifies, who supports.",
    ], "CoE office hours twice a week. Promotion path: sandbox model → checklist → certified. Capacity dashboard owned by the platform team. Product owners own KPI dictionaries.", "Architecture is operating model plus platform. Skew either and it fails.", "A Center of Excellence typically owns…", ["Every pie color in the tenant", "Standards, certification, enablement — not every report", "SQL Server patches only", "Phone MDM"], 1),
    lesson("cost-scale-future", "Cost, scalability, future-ready architecture", 8, [
      "Cost optimization: kill unused reports, right-size capacity, prefer Import/Direct Lake over chatty DQ, don't embed 200 visuals. Scalability: incremental, aggs, gold grain, not a bigger laptop.",
      "Future-ready: lakehouse-friendly grains, documented metrics, Git, identities in Entra, labels, Copilot with validation, not a single .pbix hero file.",
      "Mastery is boring operations that keep being right.",
    ], "You move a 12GB Import that refreshes 4 hours onto gold Delta + Direct Lake + an agg table. Cost drops, SLA holds, Copilot answers against certified measures only.", "Scale the data platform. Keep the semantic layer strict.", "The most future-ready Power BI estate is…", ["One undocumented 3 GB .pbix on a laptop", "Governed gold data + certified models + pipelines + identity security", "Publish to web by default", "Both-direction filters on every relationship"], 1),
  ]),
];
