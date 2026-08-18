import { makeLesson, makePath, type LearningPath } from "@/content/schema";

function lesson(id: string, title: string, minutes: number, body: string[], example: string, takeaway: string, question: string, options: string[], answer: number) {
  return makeLesson("tmp", 0, false, id, { title, minutes, body, exampleTitle: "Example", example, takeaway, check: { question, options, answer } });
}

export const CURRICULUM_PART_B: LearningPath[] = [
  makePath(4, "ch04-power-query", "Foundations", "Power Query Fundamentals", "ETL in the Query Editor: types, reshape, text/date/number tools, custom columns", [
    lesson("etl-editor-steps", "ETL, Query Editor, and Applied Steps", 9, [
      "Power Query is ETL (extract, transform, load) inside Power BI. Each query is an M expression that returns a table. Applied Steps are a replayable recipe — unlike silently editing Excel cells.",
      "Name steps like a human: Removed cancelled orders, not Changed Type1. Preview is a sample and can hide full-refresh errors.",
      "Reference a staging query when you need two outputs from one cleanup. Duplicate copies the recipe and the copies drift.",
    ], "Sales_Raw strips extra header rows. Sales references it, filters Status <> Cancelled, types Amount as decimal. Later a dataflow can publish the same recipe to many reports.", "If you cannot name the Applied Step, you do not understand it yet.", "Applied Steps are…", ["Random screenshots", "A replayable list of transformations", "DAX measures", "RLS roles"], 1),
    lesson("reshape-clean", "Types, columns, filters, replace, split, and errors", 10, [
      "Set types explicitly. Text '123' will not SUM. MDY vs DMY locale silently swaps dates. Rename/remove/reorder toward the model you want.",
      "Filter early when you legally can. Remove duplicates only when you have a real key. Keep errors visible until you choose a rule.",
      "Split 'Last, First' and trim in Power Query once — not in DAX on every visual.",
    ], "OrderDate typed as Date with locale English (United Kingdom) because the CSV is DMY. A US locale would turn 05/04/2024 (5 April) into May 4 and every MTD measure would lie.", "Wrong type or locale is a logic bug, not a visual bug.", "Remove duplicates only when…", ["The chart looks busy", "You know the business key and duplicates are truly wrong", "Power BI asks nicely", "You use DirectQuery"], 1),
    lesson("custom-conditional", "Text/date/number tools, conditional and index columns", 9, [
      "Trim, lowercase, and extract text before building relationships. Derive year and month starts from dates. Fix SAP scientific number dumps here.",
      "Conditional columns are UI IF. Custom columns are M when logic is richer. Index columns can help surrogate keys.",
      "Prefer a mapping table (code → name) over a 40-branch nested IF.",
    ], "StatusCode 01/02/03 merged to dim_Status instead of nested ifs. A fourth status is a new mapping row, not a formula rewrite.", "Shape rows in Power Query. Aggregate in DAX.", "A mapping table beats a huge nested IF because…", ["IF is illegal in M", "Business can add codes without rewriting the formula", "Merge is always faster than Import", "Index columns replace keys"], 1),
  ]),
  makePath(5, "ch05-advanced-pq", "Foundations", "Advanced Power Query & M Language", "Merge, append, pivot, parameters, functions, M types, APIs, JSON", [
    lesson("merge-append-group-pivot", "Merge, append, Group By, pivot/unpivot, combine files", 11, [
      "Merge is JOIN (left/inner/full, etc.). Append is UNION of same-shaped tables. Group By aggregates in ETL when the grain should change before the model.",
      "Unpivot turns 'Jan, Feb, Mar' columns into Date + Amount rows — the most common Excel-to-model rescue. Pivot is the reverse. Transpose swaps rows/columns for awkward exports.",
      "Combine Files / Folder ingestion is append + a sample transform. Parameters make server names and file paths environment-specific.",
    ], "A finance dump has one column per month. Unpivot Other Columns, parse Month as date, and you finally have a fact table at month grain instead of a crosstab.", "Wide monthly columns almost always want Unpivot before modeling.", "Unpivot is used to…", ["Create DAX measures", "Turn month columns into rows with a date and a value", "Set RLS", "Publish apps"], 1),
    lesson("m-language", "M fundamentals: variables, lists, records, tables, functions, errors", 12, [
      "M is a functional language. Each step is an expression. 'let a = 1, b = a + 1 in b' is the shape of every query. Lists {}, records [], tables #table() are the core types.",
      "Custom functions wrap a query so you can invoke it per file or per API page. try … otherwise handles errors without killing the refresh.",
      "Query dependencies view shows the graph. Dynamic data sources (a URL built from a parameter) can block Service refresh unless you use documented patterns.",
    ], "A function GetPage(url) returns JSON. List.Generate pages until an empty nextLink. You expand to a table. That is pagination in M, not in DAX.", "If the Service says 'dynamic data source', the URL was built in a way it cannot fold/refresh.", "M is primarily used in…", ["Measures on the canvas", "Power Query transformations", "Row-level security", "Bookmarks"], 1),
    lesson("api-json-frameworks", "API ingestion, JSON/XML, pagination, reusable frameworks", 10, [
      "Web.Contents with headers and RelativePath is the Service-friendly API pattern. Parse JSON/XML, expand records, then type columns.",
      "Pagination: next-link, page number, or skip/take. Always cap pages in development. Web scraping HTML is brittle — prefer official APIs.",
      "Reusable frameworks: a staging dataflow per source system, parameters for environment, and a documented invoke function so analysts do not copy-paste 200 lines of M.",
    ], "Graph or a SaaS API needs an Authorization header. Web.Contents('https://api.example.com', [RelativePath='v1/orders', Headers=[Authorization=token]]) can refresh in the Service; concatenating the full URL in a custom column often cannot.", "RelativePath + headers beat string-glued URLs.", "A common reason an API query refreshes in Desktop but not in the Service is…", ["Too many visuals", "Dynamic data source / URL built unsafely", "The report uses a slicer", "Yellow themes"], 1),
  ]),
  makePath(6, "ch06-cleaning", "Foundations", "Data Cleaning & Data Preparation", "Nulls, duplicates, profiling, standardization, large-data strategy", [
    lesson("nulls-dupes-invalid", "Missing values, duplicates, invalid types, and outliers", 10, [
      "Null vs blank vs empty string are three different bugs. SQL nulls, Excel empty cells, and 'N/A' text need explicit rules: keep, replace, or split 'unknown' members in a dimension.",
      "Duplicates: decide if they are load errors or true grain (two order lines). Invalid dates (31/02) and mixed decimals (1,2 vs 1.2) belong in Power Query tests.",
      "Outliers: a $0 or $9,999,999 sale might be a default system value. Flag them with a column IsAnomaly rather than deleting history.",
    ], "OrderAmount 0.01 for 8,000 rows is a placeholder from the POS. You keep the rows, set IsPlaceholder = true, and exclude them in the Sales Amount measure — so operations can still see the tickets.", "Do not delete history to make a chart look nice. Flag it.", "Null and blank…", ["Are always identical", "Can behave differently in filters and relationships", "Only exist in DirectQuery", "Break bookmarks"], 1),
    lesson("profiling-standardizing", "Profiling, column quality, mapping, validation", 9, [
      "Power Query profiling (column quality, distribution, stats) is your first test suite: % empty, distinct count, min/max. High cardinality on a 'comment' column is a VertiPaq tax.",
      "Standardize categories with mapping tables (channel 'Web'/'WEB'/'Online' → Online). Data validation rules belong in the pipeline, not in a red font on a visual.",
      "A cleansing strategy: raw (bronze) → conformed (silver) → analytics-ready (gold). Even in a single .pbix, keep a Raw query and a Clean query.",
    ], "CustomerType has 14 spellings of 'Enterprise'. A map table with 14 rows and one canonical name fixes every report. Profiling showed 14 distinct values in 2 minutes; guessing in DAX would take weeks.", "Profile first. Map second. Aggregate last.", "Column quality in Power Query helps you see…", ["DAX filter context", "Empty, error, and valid percentages before you model", "Workspace roles", "Gateway clusters"], 1),
    lesson("large-incremental-prep", "Large datasets and incremental preparation", 8, [
      "For large sources, filter in the source (SQL view / warehouse) so Power Query is not the extract engine. Enable query folding: transformations that the source can run.",
      "Incremental data preparation: only new files or new dates enter the gold table. Staging by date partition keeps refresh windows predictable.",
      "If folding breaks (a custom function on each row), you will pull millions of rows into the gateway. Watch Query Diagnostics.",
    ], "Sales in SQL with a view WHERE OrderDate >= DATEADD(year, -3, GETDATE()) plus incremental refresh in Power BI. Power Query only types and renames — the database does the heavy filter.", "Fold filters to the source. Treat Desktop as a modeling tool, not a warehouse.", "Query folding means…", ["DAX is faster", "The source system runs the transformation instead of Power BI pulling every row first", "Visuals fold on the canvas", "Bookmarks collapse"], 1),
  ]),
  makePath(7, "ch07-modeling", "Modeling", "Data Modeling Fundamentals", "Facts, dimensions, star vs snowflake, keys, cardinality, grain", [
    lesson("tables-keys-facts-dims", "Tables, keys, facts, and dimensions", 10, [
      "A table is rows of a grain you can state in one sentence. Columns are either keys, attributes, or numeric facts. Measures are not stored per row — they aggregate in filter context.",
      "Primary key uniquely identifies a dimension row. Foreign keys on the fact point at those keys. Fact tables are events (orders, invoices, tickets). Dimension tables are the who/what/where/when.",
      "If you cannot say 'one row in Sales is one invoice line', you do not have a model yet — you have a dump.",
    ], "Sales(OrderLineKey, DateKey, ProductKey, CustomerKey, Qty, Amount) + Product + Customer + Date is a star. Amount is a fact. Product[Category] is a dimension attribute. Total Sales is a measure: SUM(Sales[Amount]).", "Facts record events. Dimensions describe them. Measures answer questions.", "Where should transaction Amount usually live?", ["Every dimension", "The fact table", "A bookmark", "A theme JSON"], 1),
    lesson("star-snowflake-grain", "Star vs snowflake, grain, and cardinality", 10, [
      "Star schema: facts in the middle, denormalized dimensions around. Snowflake normalizes dimensions (Product → Category table). Stars are easier in DAX; snowflakes are not evil but add relationship hops.",
      "Grain is the meaning of one fact row. Cardinality is one-to-many, many-to-one, one-to-one, many-to-many. Power BI relationships are usually many-to-one from fact to dimension.",
      "Normalization vs denormalization: warehouses may snowflake; Power BI models usually flatten Category onto Product to keep DAX simple.",
    ], "If Sales is one row per order (not per line) you cannot put Product on a visual without double-counting or blanks. That is a grain mistake, not a DAX mistake.", "Wrong grain creates wrong numbers even with perfect SUM.", "A typical Power BI relationship from Sales to Product is…", ["Many-to-many by default", "Many sales rows to one product", "One-to-one only", "No relationship"], 1),
    lesson("relationships-filter-dir", "Relationship types, both-direction filters, date and role-playing", 10, [
      "Active vs inactive: two paths from Sales to Date (OrderDate vs ShipDate) need one active relationship; the other is activated with USERELATIONSHIP.",
      "Single vs both-direction filtering: both-direction can fix 'slicer on a disconnected table' but also creates ambiguous loops. Prefer single direction plus DAX.",
      "Date dimension is mandatory for time intelligence. Role-playing dimensions are the same Date table used for Order, Ship, and Due dates.",
    ], "Active relationship Sales[OrderDateKey] → Date[DateKey]. Inactive Sales[ShipDateKey] → Date[DateKey]. Shipped Amount = CALCULATE([Total Sales], USERELATIONSHIP(Sales[ShipDateKey], Date[DateKey])).", "One active path. Extra date roles are inactive + USERELATIONSHIP.", "Two date relationships from one fact table usually require…", ["Two Date tables only", "One active and one inactive relationship", "Removing the Date table", "DirectQuery"], 1),
  ]),
  makePath(8, "ch08-advanced-model", "Modeling", "Advanced Data Modeling", "Multiple facts, bridges, M2M, composite, calc groups, field parameters", [
    lesson("multi-fact-bridge-m2m", "Multiple facts, bridges, many-to-many, factless facts", 11, [
      "Multiple fact tables (Sales, Inventory, Budget) share conformed dimensions (Date, Product). Never relate two facts directly if you can share a dimension.",
      "Bridge tables resolve many-to-many (Student–Class). Factless facts record events without a measure (attendance). Degenerate dimensions are fact attributes that act like dims (OrderNumber).",
      "Slowly changing dimensions (SCD1 overwrite vs SCD2 history) decide whether yesterday's report still shows the old sales region.",
    ], "Budget is monthly by Product and Region; Sales is daily by Product. Both relate to Date (month vs day) and Product. A matrix of Sales vs Budget works because dimensions are conformed — not because you merged the facts into one monster table.", "Conformed dimensions glue facts together. Do not merge facts into spaghetti.", "Two fact tables should usually connect by…", ["A direct fact-to-fact relationship", "Shared dimensions", "A bookmark", "Copy-paste DAX"], 1),
    lesson("composite-aggs-disconnected", "Composite models, aggregations, disconnected tables, what-if", 10, [
      "Composite models mix Import and DirectQuery. Aggregation tables store pre-sums so a billion-row DirectQuery fact can still feel fast for totals. Dual storage mode helps dimensions filter both.",
      "Disconnected tables (what-if parameters, calculation selectors) do not relate to facts; measures read SELECTEDVALUE and branch.",
      "Enterprise semantic models are certified, documented, and reused via Live Connection or OneLake.",
    ], "A what-if table Discount% from 0 to 20. Measure Projected Sales = [Total Sales] * (1 - SELECTEDVALUE(WhatIf[Discount%], 0)). No relationship to Sales is required.", "Disconnected tables drive scenarios. They are not broken relationships.", "A what-if parameter is typically…", ["A relationship to SQL", "A disconnected generated table plus a measure that reads SELECTEDVALUE", "An RLS role", "A gateway"], 1),
    lesson("calc-groups-field-params", "Calculation groups, field parameters, dynamic dimensions, optimization", 10, [
      "Calculation groups (Tabular Editor) apply Time intelligence or format strings to many measures without copying YTD 80 times. Field parameters let users pick measures or dimensions from a slicer.",
      "Dynamic dimensions (slicer-driven group-by) often use field parameters rather than giant SWITCH tables.",
      "Optimize: hide keys, reduce cardinality, integer keys, star schema, remove unused columns. That is cheaper than a faster laptop.",
    ], "A field parameter 'Metric' with Total Sales, Margin, Margin %. One line chart, one slicer, no duplicate pages. A calculation group 'Time Intel' with Current, YTD, PY on that selected metric.", "Multiply measures with calc groups and field parameters — do not duplicate pages.", "Field parameters are mainly for…", ["Gateway clustering", "Letting users swap fields/measures in a visual", "Importing CSV", "RLS"], 1),
  ]),
  makePath(9, "ch09-dax-fundamentals", "DAX", "DAX Fundamentals", "Syntax, columns vs measures, aggregations, IF/SWITCH, RELATED", [
    lesson("syntax-objects", "What DAX is: columns, measures, tables, operators, variables", 10, [
      "DAX is the formula language of the model. Calculated columns compute per row at refresh (row context). Measures compute at query time in filter context. Calculated tables materialize DAX results.",
      "Operators: arithmetic, comparison, IN, && ||. VAR ... RETURN makes formulas readable. Comments: // and /* */. Types: numeric, text, date, boolean, variant.",
      "If you need a value on every row for slicing (Age group), a column or a dimension is right. If you need a number that changes with slicers, a measure is right.",
    ], "Profit column: Sales[Amount] - Sales[Cost] (row-level, stored). Profit measure: SUM(Sales[Amount]) - SUM(Sales[Cost]) (correct with filters). The column version misleads when you filter a subset if you accidentally SUM the stored profit incorrectly — prefer measures for additive facts.", "Columns are row grain. Measures are questions.", "A measure is evaluated…", ["Once at install", "In filter context when a visual queries it", "Only in Power Query", "Only on Mobile"], 1),
    lesson("aggregations", "SUM, AVERAGE, MIN, MAX, COUNT, DISTINCTCOUNT, DIVIDE", 8, [
      "SUM/AVERAGE/MIN/MAX/COUNT/DISTINCTCOUNT are the starter kit. COUNT counts numbers; COUNTA counts non-blanks; DISTINCTCOUNT is cardinality of a column.",
      "Always DIVIDE(num, den) instead of / so divide-by-zero becomes BLANK rather than Infinity.",
      "Name measures Total Sales, Order Count, Unique Customers — not Measure 1.",
    ], "Unique Customers = DISTINCTCOUNT(Sales[CustomerKey]). Average Order Value = DIVIDE([Total Sales], DISTINCTCOUNT(Sales[OrderKey])). On the Sales Lab sample, SUM(Sales[Amount]) is 2295.", "DIVIDE is the professional slash.", "DIVIDE is preferred because…", ["It is shorter than SUM", "It handles divide-by-zero safely", "It only works in Excel", "It creates relationships"], 1),
    lesson("if-switch-related-naming", "IF, SWITCH, RELATED, and naming conventions", 8, [
      "IF and SWITCH belong in measures for buckets and KPI color logic — but heavy branching per row is often a dimension column instead.",
      "RELATED pulls a dimension column into a fact calculated column (row context + relationship). RELATEDTABLE goes the other way. Prefer measures over RELATED columns when possible.",
      "Naming: no spaces issues if you use 'Total Sales'. Display folders group Finance / Sales. Avoid SUM of Amount as the public name.",
    ], "Margin Band = SWITCH(TRUE(), [Margin %] < 0.2, \"Low\", [Margin %] < 0.4, \"Medium\", \"High\"). Better: a Product[MarginBand] column if the band is an attribute used as a slicer.", "SWITCH is for logic. Slicers want columns.", "RELATED is used in a calculated column to…", ["Refresh the gateway", "Bring a column from a related table in row context", "Create a workspace", "Embed Power Apps"], 1),
  ]),
  makePath(10, "ch10-context", "DAX", "DAX Evaluation Context", "Row vs filter context, CALCULATE, ALL family, VALUES, debugging", [
    lesson("row-filter-transition", "Row context, filter context, and context transition", 11, [
      "Row context: the current row in a calculated column or an iterator (SUMX). Filter context: the filters from slicers, rows/columns of a visual, and CALCULATE.",
      "Context transition: when a measure is evaluated in row context, CALCULATE (or a measure call) turns the row into filters. This is why SUMX(Sales, [Total Sales]) is dangerous — it can explode into per-row filter transitions.",
      "A card has fewer filters than a matrix cell. The same measure can show 100 and 80 for that reason.",
    ], "Matrix row 'USA' + slicer Year 2024 puts two filters on [Total Sales]. A card with only Year 2024 does not filter Region. That is context, not a bug.", "When a number looks wrong, list the filters.", "CALCULATE is mainly used to…", ["Import CSV", "Change filter context for an expression", "Create bookmarks", "Install Desktop"], 1),
    lesson("calculate-filter-all", "CALCULATE, FILTER, ALL, ALLEXCEPT, ALLSELECTED, REMOVEFILTERS, KEEPFILTERS", 12, [
      "CALCULATE(expression, filters…) is the heart of DAX. FILTER is an iterator that returns a table of rows you keep. ALL removes filters from a table or column. ALLEXCEPT keeps some. ALLSELECTED respects the outer visual but ignores inner. REMOVEFILTERS is the modern ALL. KEEPFILTERS intersects instead of overwriting.",
      "USA Sales = CALCULATE([Total Sales], Sales[Region] = \"USA\") on the lab model returns 1225.",
      "Over-using ALL() in every measure is how % of total works — and also how you accidentally ignore a slicer the business still wanted.",
    ], "% of All Sales = DIVIDE([Total Sales], CALCULATE([Total Sales], ALL(Sales))). % of Visible = DIVIDE([Total Sales], CALCULATE([Total Sales], ALLSELECTED(Sales))). The first ignores slicers; the second keeps them.", "ALL vs ALLSELECTED is a product decision: percent of everything vs percent of what I filtered.", "ALLSELECTED is typically for…", ["Deleting data", "Percent of the values still visible after slicers", "Gateway setup", "Paginated headers"], 1),
    lesson("values-selectedvalue-debug", "VALUES, DISTINCT, SELECTEDVALUE, HASONEVALUE, ISFILTERED, debugging", 10, [
      "VALUES returns unique visible values (includes BLANK from relationships). DISTINCT is similar without the extra blank in some cases. SELECTEDVALUE(col, default) is the safe 'what is on the slicer'. HASONEVALUE tests a single selection.",
      "ISFILTERED / ISCROSSFILTERED tell you if a column or table is being filtered — useful in dynamic titles and in debugging unexpected blanks.",
      "Filter propagation follows relationships. Evaluation order inside CALCULATE is: apply remove/keep modifiers, then add filters. Debug with DAX Studio, Performance Analyzer, and 'show as table'.",
    ], "Title = \"Sales for \" & SELECTEDVALUE(Sales[Region], \"all regions\"). When two regions are selected, HASONEVALUE is false and you show 'multiple regions' instead of a blank.", "SELECTEDVALUE is the slicer reader. VALUES is the set.", "SELECTEDVALUE returns blank (or default) when…", ["The model is Import", "More than one value is in filter context", "You use a card", "You hide a column"], 1),
  ]),
  makePath(11, "ch11-time", "DAX", "DAX Time Intelligence", "Date tables, YTD/QTD/MTD, DATEADD, YoY, rolling periods, fiscal calendars", [
    lesson("date-table-mark", "Date tables and Mark as Date Table", 8, [
      "Time intelligence functions require a real Date table: one row per day, no gaps, a Date column of type date, covering all facts (plus future if you forecast).",
      "Mark as Date Table tells the engine which column is the date. Relationships from facts must use that date (or a DateKey related to it).",
      "Do not use the auto date/time hidden tables for enterprise models — they multiply and confuse.",
    ], "CALENDAR(DATE(2020,1,1), DATE(2026,12,31)) plus Year, Month, MonthNo, Quarter. Mark Date[Date] as date table. Relate Sales[OrderDate] to Date[Date].", "No continuous date table = broken time intelligence.", "Mark as Date Table is required so that…", ["Themes apply", "Time intelligence functions know the date column", "SQL folds", "Mobile works"], 1),
    lesson("ytd-dateadd-parallel", "TOTALYTD, DATESYTD, DATEADD, SAMEPERIODLASTYEAR, PARALLELPERIOD", 11, [
      "TOTALYTD / TOTALQTD / TOTALMTD wrap CALCULATE + DATESYTD/QTD/MTD. DATEADD shifts a date column by interval. SAMEPERIODLASTYEAR is a special shift. PREVIOUSMONTH/QUARTER/YEAR and PARALLELPERIOD are relatives.",
      "STARTOFMONTH / ENDOFMONTH help period bookends. YoY % = DIVIDE([Total Sales] - [PY Sales], [PY Sales]).",
      "These functions follow the filter on the date table. If Date is filtered to a week, YTD still needs a well-formed calendar.",
    ], "Sales YTD = TOTALYTD([Total Sales], Date[Date]). Sales PY = CALCULATE([Total Sales], SAMEPERIODLASTYEAR(Date[Date])). YoY % = DIVIDE([Total Sales] - [Sales PY], [Sales PY]).", "Shift the date filter; do not hard-code years in measures.", "SAMEPERIODLASTYEAR needs…", ["A Power App", "A marked date table related to the fact", "DirectQuery only", "Python"], 1),
    lesson("rolling-fiscal", "Rolling periods, moving averages, fiscal and custom calendars", 10, [
      "Rolling 12 months: DATESINPERIOD(Date[Date], MAX(Date[Date]), -12, MONTH). Moving average: DIVIDE([Rolling Sales], DISTINCTCOUNT of months in that window).",
      "Fiscal calendars: a Date table with FiscalYear that starts in April (or 4-4-5 retail weeks). Time intel still works if the date table is complete; some functions assume calendar year — then write custom DATESYTD(..., \"03-31\").",
      "Custom calendars (ISO weeks, 4-5-4) usually need custom DAX, not TOTALYTD defaults.",
    ], "Sales R12 = CALCULATE([Total Sales], DATESINPERIOD(Date[Date], MAX(Date[Date]), -12, MONTH)). Fiscal YTD = TOTALYTD([Total Sales], Date[Date], \"03-31\") for a year ending 31 March.", "Fiscal is a date-table property plus the year-end argument — not a different engine.", "DATESINPERIOD is a typical building block for…", ["RLS", "Rolling windows such as last 12 months", "Gateways", "Themes"], 1),
  ]),
  makePath(12, "ch12-advanced-dax", "DAX", "Advanced DAX", "Iterators, RANKX, TOPN, virtual tables, TREATAS, USERELATIONSHIP", [
    lesson("iterators-rank-topn", "SUMX, AVERAGEX, RANKX, TOPN, CONCATENATEX", 11, [
      "Iterators walk a table in row context: SUMX(Sales, Sales[Qty] * Sales[Price]). Use them when the math is per row then sum — not when SUM(Qty)*SUM(Price) would mix grains.",
      "RANKX ranks in the current filter context. TOPN returns a table of the N best rows. CONCATENATEX builds a text list of visible products.",
      "FILTER patterns inside CALCULATE/CALCULATETABLE are how you express 'customers whose first purchase was this year'.",
    ], "Revenue = SUMX(Sales, Sales[Qty] * Sales[UnitPrice]). Rank in category = RANKX(ALLSELECTED(Product[Product]), [Total Sales]). Top 5 table = TOPN(5, VALUES(Product[Product]), [Total Sales]).", "X functions iterate. SUM of products is not product of SUMs.", "SUMX is needed when…", ["You publish an app", "You must compute an expression per row then aggregate", "You sync slicers", "You set a theme"], 1),
    lesson("segmentation-running-dynamic", "Segmentation, Pareto, % of total, running totals, dynamic titles", 10, [
      "Dynamic segmentation: classify customers by a measure (high/med/low spend) using a disconnected band table + FILTER. Pareto: cumulative % of sales after ranking. ABC analysis is Pareto with A/B/C cutoffs.",
      "Running total = CALCULATE([Total Sales], FILTER(ALLSELECTED(Date[Date]), Date[Date] <= MAX(Date[Date]))). Percent of total uses ALL or ALLSELECTED as you chose in chapter 10.",
      "Dynamic titles and KPI colors are SWITCH/SELECTEDVALUE, not extra report pages.",
    ], "Customer band table: Min 0, 1000, 5000. Band = FILTER(Bands, [Customer Sales] >= Bands[Min] && [Customer Sales] < Bands[Max]). Put Band on rows — that is dynamic segmentation.", "Band tables + FILTER beat hardcoded IF for analytics buckets.", "A running total typically uses…", ["Removing the Date table", "CALCULATE with a date filter through MAX(Date)", "A pie chart", "OLS"], 1),
    lesson("virtual-tables-treatas", "Virtual tables, UNION/INTERSECT/EXCEPT/CROSSJOIN, TREATAS, USERELATIONSHIP, CROSSFILTER", 12, [
      "Virtual tables exist only during the calculation: FILTER, SUMMARIZE, ADDCOLUMNS, DATATABLE, { } constructors. UNION/INTERSECT/EXCEPT/CROSSJOIN combine tables.",
      "TREATAS applies a table of values as filters on another column (useful when there is no relationship). USERELATIONSHIP activates an inactive relationship. CROSSFILTER changes filter direction for a calculation.",
      "Advanced variables store tables in VAR for readability and performance (compute once).",
    ], "Sales for products in a promotion list table with no relationship: CALCULATE([Total Sales], TREATAS(VALUES(Promo[ProductKey]), Product[ProductKey])). Shipped Amount uses USERELATIONSHIP as in chapter 7.", "TREATAS is a virtual relationship. USERELATIONSHIP is a real inactive one.", "USERELATIONSHIP is used to…", ["Create a gateway", "Activate an inactive relationship inside CALCULATE", "Unpivot columns", "Embed a report"], 1),
  ]),
];
