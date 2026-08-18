export type Row = Record<string, string | number>;

export interface SampleTable {
  name: string;
  columns: { name: string; type: "text" | "number" }[];
  rows: Row[];
}

export interface SampleModel {
  id: string;
  name: string;
  description: string;
  tables: SampleTable[];
}

export const SALES_MODEL: SampleModel = {
  id: "sales-lab",
  name: "LearnInPowerBI Sales Lab",
  description: "A tiny star-schema style model for practicing DAX aggregates and CALCULATE.",
  tables: [
    {
      name: "Sales",
      columns: [
        { name: "Date", type: "text" },
        { name: "Product", type: "text" },
        { name: "Region", type: "text" },
        { name: "Amount", type: "number" },
        { name: "Quantity", type: "number" },
      ],
      rows: [
        { Date: "2024-01-10", Product: "Laptop", Region: "USA", Amount: 1200, Quantity: 1 },
        { Date: "2024-01-11", Product: "Laptop", Region: "India", Amount: 900, Quantity: 1 },
        { Date: "2024-02-01", Product: "Mouse", Region: "USA", Amount: 25, Quantity: 5 },
        { Date: "2024-02-03", Product: "Mouse", Region: "India", Amount: 20, Quantity: 4 },
        { Date: "2024-03-01", Product: "Chair", Region: "UK", Amount: 150, Quantity: 2 },
      ],
    },
    {
      name: "Products",
      columns: [
        { name: "Product", type: "text" },
        { name: "Category", type: "text" },
      ],
      rows: [
        { Product: "Laptop", Category: "Electronics" },
        { Product: "Mouse", Category: "Electronics" },
        { Product: "Chair", Category: "Furniture" },
      ],
    },
  ],
};

export function getTable(model: SampleModel, name: string): SampleTable | undefined {
  const needle = name.toLowerCase();
  return model.tables.find((t) => t.name.toLowerCase() === needle);
}
