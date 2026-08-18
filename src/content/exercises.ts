import type { Locale } from "@/lib/i18n";

export interface DaxExerciseCopy {
  title: string;
  prompt: string;
  hint: string;
}

export interface DaxExercise {
  id: string;
  free: boolean;
  expected: number;
  starter: string;
  copy: { en: DaxExerciseCopy } & Partial<Record<Locale, DaxExerciseCopy>>;
}

export function getExerciseCopy(exercise: DaxExercise, locale: Locale) {
  return exercise.copy[locale] ?? exercise.copy.en;
}

export const DAX_EXERCISES: DaxExercise[] = [
  {
    id: "total-sales",
    free: true,
    expected: 2295,
    starter: "Total Sales =\n",
    copy: {
      en: { title: "Total Sales", prompt: "Write a measure that sums Sales[Amount]. The lab model should return 2295.", hint: "SUM(Sales[Amount])" },
      hi: { title: "कुल बिक्री", prompt: "Sales[Amount] का योग। लैब मॉडल में 2295 आना चाहिए।", hint: "SUM(Sales[Amount])" },
      es: { title: "Ventas totales", prompt: "Suma Sales[Amount]. El modelo del lab debe devolver 2295.", hint: "SUM(Sales[Amount])" },
      fr: { title: "Ventes totales", prompt: "Sommez Sales[Amount]. Le modèle du labo doit renvoyer 2295.", hint: "SUM(Sales[Amount])" },
    },
  },
  {
    id: "total-qty",
    free: true,
    expected: 13,
    starter: "Total Qty =\n",
    copy: {
      en: { title: "Total quantity", prompt: "Sum Sales[Quantity]. Expected: 13.", hint: "SUM(Sales[Quantity])" },
      hi: { title: "कुल मात्रा", prompt: "Sales[Quantity] जोड़ें। अपेक्षित: 13।", hint: "SUM(Sales[Quantity])" },
      es: { title: "Cantidad total", prompt: "Suma Sales[Quantity]. Esperado: 13.", hint: "SUM(Sales[Quantity])" },
      fr: { title: "Quantité totale", prompt: "Sommez Sales[Quantity]. Attendu : 13.", hint: "SUM(Sales[Quantity])" },
    },
  },
  {
    id: "row-count",
    free: true,
    expected: 5,
    starter: "Orders =\n",
    copy: {
      en: { title: "Row count", prompt: "How many rows are in Sales right now? Expected: 5.", hint: "COUNTROWS(Sales)" },
      hi: { title: "पंक्ति गिनती", prompt: "Sales में अभी कितनी पंक्तियाँ? अपेक्षित: 5।", hint: "COUNTROWS(Sales)" },
      es: { title: "Conteo de filas", prompt: "¿Cuántas filas hay en Sales? Esperado: 5.", hint: "COUNTROWS(Sales)" },
      fr: { title: "Nombre de lignes", prompt: "Combien de lignes dans Sales ? Attendu : 5.", hint: "COUNTROWS(Sales)" },
    },
  },
  {
    id: "usa-sales",
    free: false,
    expected: 1225,
    starter: "USA Sales =\n",
    copy: {
      en: {
        title: "USA sales",
        prompt: "Total sales as if only Region USA is selected. Expected: 1225.",
        hint: 'CALCULATE(SUM(Sales[Amount]), Sales[Region] = "USA")',
      },
      hi: {
        title: "USA बिक्री",
        prompt: "मानो केवल Region USA चुना हो। अपेक्षित: 1225।",
        hint: 'CALCULATE(SUM(Sales[Amount]), Sales[Region] = "USA")',
      },
      es: {
        title: "Ventas USA",
        prompt: "Ventas como si solo estuviera USA. Esperado: 1225.",
        hint: 'CALCULATE(SUM(Sales[Amount]), Sales[Region] = "USA")',
      },
      fr: {
        title: "Ventes USA",
        prompt: "Ventes comme si seul USA était sélectionné. Attendu : 1225.",
        hint: 'CALCULATE(SUM(Sales[Amount]), Sales[Region] = "USA")',
      },
    },
  },
  {
    id: "avg-sale",
    free: false,
    expected: 459,
    starter: "Avg Ticket =\n",
    copy: {
      en: { title: "Average amount", prompt: "Average of Sales[Amount]. Expected: 459.", hint: "AVERAGE(Sales[Amount]) or DIVIDE(SUM(Sales[Amount]), COUNTROWS(Sales))" },
      hi: { title: "औसत राशि", prompt: "Sales[Amount] का औसत। अपेक्षित: 459।", hint: "AVERAGE(Sales[Amount])" },
      es: { title: "Importe medio", prompt: "Promedio de Sales[Amount]. Esperado: 459.", hint: "AVERAGE(Sales[Amount])" },
      fr: { title: "Montant moyen", prompt: "Moyenne de Sales[Amount]. Attendu : 459.", hint: "AVERAGE(Sales[Amount])" },
    },
  },
];

export function getExercise(id: string) {
  return DAX_EXERCISES.find((e) => e.id === id);
}
