import assert from "node:assert/strict";
import { evaluateDax, valuesMatch } from "./dax-engine";
import { SALES_MODEL } from "./sample-model";

function run(expr: string) {
  const result = evaluateDax(expr, SALES_MODEL);
  assert.equal(result.ok, true, result.error);
  return result.value as number;
}

assert.equal(run("SUM(Sales[Amount])"), 2295);
assert.equal(run("Total Sales = SUM(Sales[Amount])"), 2295);
assert.equal(run("SUM(Sales[Quantity])"), 13);
assert.equal(run("COUNTROWS(Sales)"), 5);
assert.equal(run('CALCULATE(SUM(Sales[Amount]), Sales[Region] = "USA")'), 1225);
assert.equal(run('CALCULATE(COUNTROWS(Sales), Sales[Region] = "India")'), 2);
assert.ok(valuesMatch(run("AVERAGE(Sales[Amount])"), 459));
assert.equal(run("DIVIDE(SUM(Sales[Amount]), COUNTROWS(Sales))"), 459);

const bad = evaluateDax("SUMX(Sales, [Amount])", SALES_MODEL);
assert.equal(bad.ok, false);

console.log("dax-engine tests passed");
