import { getTable, type Row, type SampleModel } from "@/lib/sample-model";

export interface DaxResult {
  ok: boolean;
  value?: number;
  error?: string;
  explanation?: string;
}

function stripMeasureName(input: string): string {
  const trimmed = input.replace(/\/\/.*$/gm, "").trim();
  const eq = trimmed.indexOf("=");
  if (eq > 0 && !trimmed.slice(0, eq).includes("(")) {
    return trimmed.slice(eq + 1).trim();
  }
  return trimmed;
}

function normalize(expr: string): string {
  return stripMeasureName(expr).replace(/\s+/g, " ").trim();
}

function numericValues(rows: Row[], column: string): number[] {
  const key = Object.keys(rows[0] ?? {}).find((k) => k.toLowerCase() === column.toLowerCase());
  if (!key) return [];
  return rows.map((r) => Number(r[key])).filter((n) => Number.isFinite(n));
}

function filterRows(rows: Row[], column: string, expected: string): Row[] {
  const key = Object.keys(rows[0] ?? {}).find((k) => k.toLowerCase() === column.toLowerCase());
  if (!key) return [];
  const want = expected.toLowerCase();
  return rows.filter((r) => String(r[key]).toLowerCase() === want);
}

function splitTopLevelArgs(inner: string): string[] {
  const args: string[] = [];
  let depth = 0;
  let current = "";
  for (const ch of inner) {
    if (ch === "(") depth += 1;
    if (ch === ")") depth -= 1;
    if (ch === "," && depth === 0) {
      args.push(current.trim());
      current = "";
      continue;
    }
    current += ch;
  }
  if (current.trim()) args.push(current.trim());
  return args;
}

function evalAgg(fn: string, rows: Row[], column: string): DaxResult {
  const values = numericValues(rows, column);
  if (!rows.length) {
    return { ok: true, value: fn === "COUNT" || fn === "DISTINCTCOUNT" ? 0 : 0, explanation: "Empty filter context returned a blank-like 0 in this teaching engine." };
  }
  if (!values.length && fn !== "COUNT" && fn !== "DISTINCTCOUNT") {
    return { ok: false, error: `Column [${column}] is not numeric or was not found.` };
  }
  switch (fn) {
    case "SUM":
      return { ok: true, value: values.reduce((a, b) => a + b, 0), explanation: `SUM of ${values.length} values.` };
    case "AVERAGE":
      return { ok: true, value: values.reduce((a, b) => a + b, 0) / values.length, explanation: "AVERAGE = total / count of non-blank numbers." };
    case "MIN":
      return { ok: true, value: Math.min(...values), explanation: "MIN of the column in the current filter context." };
    case "MAX":
      return { ok: true, value: Math.max(...values), explanation: "MAX of the column in the current filter context." };
    case "COUNT":
      return { ok: true, value: values.length, explanation: "COUNT of numeric values (teaching engine)." };
    case "DISTINCTCOUNT":
      return {
        ok: true,
        value: new Set(values.map((v) => v)).size,
        explanation: "DISTINCTCOUNT of numeric values (teaching engine).",
      };
    default:
      return { ok: false, error: `Unsupported aggregate ${fn}.` };
  }
}

function evalCore(expr: string, model: SampleModel, rowsOverride?: Row[]): DaxResult {
  const text = normalize(expr);

  const divide = text.match(/^DIVIDE\s*\(\s*(.+)\s*\)$/i);
  if (divide) {
    const [numExpr, denExpr] = splitTopLevelArgs(divide[1]);
    if (!numExpr || !denExpr) return { ok: false, error: "DIVIDE needs two arguments." };
    const num = evalCore(numExpr, model, rowsOverride);
    const den = evalCore(denExpr, model, rowsOverride);
    if (!num.ok) return num;
    if (!den.ok) return den;
    if (!den.value) return { ok: true, value: 0, explanation: "DIVIDE returned 0 because the denominator was 0 (safe divide)." };
    return { ok: true, value: (num.value ?? 0) / den.value, explanation: "DIVIDE(numerator, denominator)." };
  }

  const calculate = text.match(/^CALCULATE\s*\(\s*(.+)\s*\)$/i);
  if (calculate) {
    const args = splitTopLevelArgs(calculate[1]);
    const inner = args[0];
    if (!inner) return { ok: false, error: "CALCULATE needs an expression." };
    let rows = rowsOverride;
    for (const filter of args.slice(1)) {
      const m = filter.match(/^(\w+)\[(\w+)\]\s*=\s*"([^"]+)"$/i);
      if (!m) {
        return {
          ok: false,
          error: `This teaching engine only supports simple filters like Sales[Region] = "USA". Got: ${filter}`,
        };
      }
      const table = getTable(model, m[1]);
      if (!table) return { ok: false, error: `Unknown table ${m[1]}.` };
      const base = rows ?? table.rows;
      rows = filterRows(base, m[2], m[3]);
    }
    return evalCore(inner, model, rows);
  }

  const countrows = text.match(/^COUNTROWS\s*\(\s*(\w+)\s*\)$/i);
  if (countrows) {
    const table = getTable(model, countrows[1]);
    if (!table) return { ok: false, error: `Unknown table ${countrows[1]}.` };
    const rows = rowsOverride ?? table.rows;
    return { ok: true, value: rows.length, explanation: `COUNTROWS(${table.name}) in the current filter context.` };
  }

  const agg = text.match(/^(SUM|AVERAGE|MIN|MAX|COUNT|DISTINCTCOUNT)\s*\(\s*(\w+)\[(\w+)\]\s*\)$/i);
  if (agg) {
    const fn = agg[1].toUpperCase();
    const table = getTable(model, agg[2]);
    if (!table) return { ok: false, error: `Unknown table ${agg[2]}.` };
    const rows = rowsOverride ?? table.rows;
    return evalAgg(fn, rows, agg[3]);
  }

  const number = text.match(/^-?\d+(\.\d+)?$/);
  if (number) return { ok: true, value: Number(text), explanation: "Numeric literal." };

  return {
    ok: false,
    error:
      "This practice engine supports SUM, AVERAGE, MIN, MAX, COUNT, DISTINCTCOUNT, COUNTROWS, DIVIDE, and CALCULATE with simple equality filters. Example: CALCULATE(SUM(Sales[Amount]), Sales[Region] = \"USA\")",
  };
}

export function evaluateDax(expression: string, model: SampleModel): DaxResult {
  if (!expression.trim()) {
    return { ok: false, error: "Write a DAX expression first." };
  }
  try {
    const result = evalCore(expression, model);
    if (result.ok && typeof result.value === "number" && Number.isFinite(result.value)) {
      result.value = Math.round(result.value * 10000) / 10000;
    }
    return result;
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Could not evaluate that formula." };
  }
}

export function valuesMatch(actual: number, expected: number, tolerance = 0.01): boolean {
  return Math.abs(actual - expected) <= tolerance;
}
