import type { Locale } from "@/lib/i18n";

export interface QuizQuestion {
  id: string;
  topic: string;
  copy: { en: { prompt: string; options: string[]; explanation: string } } & Partial<
    Record<Locale, { prompt: string; options: string[]; explanation: string }>
  >;
  answer: number;
}

export function getQuizCopy(question: QuizQuestion, locale: Locale) {
  return question.copy[locale] ?? question.copy.en;
}

export const QUIZ_BANK: QuizQuestion[] = [
  {
    id: "q1",
    topic: "model",
    answer: 1,
    copy: {
      en: {
        prompt: "In a star schema, where do transaction numbers usually live?",
        options: ["In every dimension table", "In the fact table (e.g. Sales)", "Only in bookmarks", "In the Power BI Service theme"],
        explanation: "Facts store events and additive numbers. Dimensions describe those events.",
      },
      hi: {
        prompt: "स्टार स्कीमा में लेन-देन की संख्याएँ आमतौर पर कहाँ होती हैं?",
        options: ["हर डाइमेंशन में", "फैक्ट टेबल (जैसे Sales)", "केवल bookmarks में", "Service थीम में"],
        explanation: "फैक्ट में घटनाएँ और जोड़ने योग्य संख्याएँ रहती हैं। डाइमेंशन उन्हें वर्णन करते हैं।",
      },
      es: {
        prompt: "En un esquema en estrella, ¿dónde suelen vivir los importes de transacción?",
        options: ["En cada dimensión", "En la tabla de hechos (Sales)", "Solo en marcadores", "En el tema del Servicio"],
        explanation: "Los hechos guardan eventos y números aditivos. Las dimensiones los describen.",
      },
      fr: {
        prompt: "Dans un schéma en étoile, où vivent en général les montants de transaction ?",
        options: ["Dans chaque dimension", "Dans la table de faits (Sales)", "Uniquement dans les signets", "Dans le thème du Service"],
        explanation: "Les faits stockent les événements et les chiffres additifs. Les dimensions les décrivent.",
      },
    },
  },
  {
    id: "q2",
    topic: "dax",
    answer: 2,
    copy: {
      en: {
        prompt: "A measure shows 100 on a card but 80 on a matrix row. The usual reason is…",
        options: ["The file is corrupt", "You need a bigger Premium capacity", "Different filter context", "DAX cannot run on Android"],
        explanation: "The matrix row has extra filters (the row label). The card often does not.",
      },
      hi: {
        prompt: "कार्ड पर 100 और मैट्रिक्स पंक्ति पर 80 — आम कारण?",
        options: ["फ़ाइल खराब", "ज़्यादा Premium चाहिए", "अलग फ़िल्टर कॉन्टेक्स्ट", "Android पर DAX नहीं चलता"],
        explanation: "मैट्रिक्स पंक्ति में अतिरिक्त फ़िल्टर होते हैं; कार्ड में अक्सर नहीं।",
      },
      es: {
        prompt: "Una medida muestra 100 en una tarjeta y 80 en una fila de matriz. Lo habitual es…",
        options: ["Archivo corrupto", "Hace falta más Premium", "Distinto contexto de filtro", "DAX no corre en Android"],
        explanation: "La fila de la matriz añade filtros; la tarjeta suele no tenerlos.",
      },
      fr: {
        prompt: "Une mesure affiche 100 sur une carte et 80 sur une ligne de matrice. Cause usuelle…",
        options: ["Fichier corrompu", "Il faut plus de Premium", "Contexte de filtre différent", "DAX ne tourne pas sur Android"],
        explanation: "La ligne de matrice ajoute des filtres ; la carte souvent non.",
      },
    },
  },
  {
    id: "q3",
    topic: "visuals",
    answer: 0,
    copy: {
      en: {
        prompt: "You need to compare five regions on the same metric. Best default visual?",
        options: ["Bar chart", "3D pie", "Filled map with 40 tooltips", "A screenshot of Excel"],
        explanation: "Bars make length comparisons easy. Pies hide small differences.",
      },
      hi: {
        prompt: "पाँच क्षेत्रों की एक मेट्रिक तुलना — सबसे अच्छा डिफ़ॉल्ट?",
        options: ["बार चार्ट", "3D पाई", "40 टूलटिप वाला मैप", "Excel स्क्रीनशॉट"],
        explanation: "बार लंबाई से तुलना आसान बनाते हैं। पाई छोटे अंतर छिपाती है।",
      },
      es: {
        prompt: "Comparar cinco regiones en la misma métrica. ¿Visual por defecto?",
        options: ["Barras", "Tarta 3D", "Mapa con 40 información en pantalla", "Captura de Excel"],
        explanation: "Las barras comparan longitudes. Las tartas esconden diferencias pequeñas.",
      },
      fr: {
        prompt: "Comparer cinq régions sur la même métrique. Visuel par défaut ?",
        options: ["Barres", "Camembert 3D", "Carte avec 40 infobulles", "Capture Excel"],
        explanation: "Les barres comparent des longueurs. Les camemberts masquent les petits écarts.",
      },
    },
  },
  {
    id: "q4",
    topic: "dax",
    answer: 1,
    copy: {
      en: {
        prompt: "Which pattern computes sales for USA without deleting other rows from the model?",
        options: [
          "Remove USA from the Product table",
          'CALCULATE(SUM(Sales[Amount]), Sales[Region] = "USA")',
          "A calculated column that copies Amount",
          "Hide the Sales table",
        ],
        explanation: "CALCULATE shifts filter context. It does not delete data.",
      },
      hi: {
        prompt: "मॉडल से पंक्तियाँ मिटाए बिना USA सेल्स?",
        options: [
          "Product से USA हटाएँ",
          'CALCULATE(SUM(Sales[Amount]), Sales[Region] = "USA")',
          "Amount कॉपी करने वाला कॉलम",
          "Sales टेबल छिपाएँ",
        ],
        explanation: "CALCULATE कॉन्टेक्स्ट बदलता है, डेटा मिटाता नहीं।",
      },
      es: {
        prompt: "¿Qué patrón calcula ventas USA sin borrar filas del modelo?",
        options: [
          "Quitar USA de Product",
          'CALCULATE(SUM(Sales[Amount]), Sales[Region] = "USA")',
          "Columna calculada que copia Amount",
          "Ocultar Sales",
        ],
        explanation: "CALCULATE cambia el contexto; no borra datos.",
      },
      fr: {
        prompt: "Quel motif calcule les ventes USA sans supprimer des lignes ?",
        options: [
          "Retirer USA de Product",
          'CALCULATE(SUM(Sales[Amount]), Sales[Region] = "USA")',
          "Colonne calculée qui copie Amount",
          "Masquer Sales",
        ],
        explanation: "CALCULATE déplace le contexte ; il n’efface pas les données.",
      },
    },
  },
  {
    id: "q5",
    topic: "literacy",
    answer: 2,
    copy: {
      en: {
        prompt: "“Show me sales” is a weak request because it is missing…",
        options: ["A logo", "Dark mode", "Metric grain, time window, and comparison", "A Python notebook"],
        explanation: "Builders need metric, grain, time, and comparison to ship something testable.",
      },
      hi: {
        prompt: "“सेल्स दिखाओ” कमज़ोर अनुरोध है क्योंकि इसमें नहीं है…",
        options: ["लोगो", "डार्क मोड", "मेट्रिक ग्रेन, समय और तुलना", "Python नोटबुक"],
        explanation: "बनाने के लिए मेट्रिक, ग्रेन, समय और तुलना चाहिए।",
      },
      es: {
        prompt: "“Muéstrame ventas” es débil porque falta…",
        options: ["Un logo", "Modo oscuro", "Grano, ventana de tiempo y comparación", "Un notebook Python"],
        explanation: "Hace falta métrica, grano, tiempo y comparación para entregar algo comprobable.",
      },
      fr: {
        prompt: "« Montre-moi les ventes » est faible car il manque…",
        options: ["Un logo", "Le mode sombre", "Grain, période et comparaison", "Un notebook Python"],
        explanation: "Il faut métrique, grain, temps et comparaison pour livrer quelque chose de testable.",
      },
    },
  },
  {
    id: "q6",
    topic: "model",
    answer: 0,
    copy: {
      en: {
        prompt: "One product appears on many sales rows. Cardinality is typically…",
        options: ["One-to-many (Product → Sales)", "One-to-one", "Many-to-many required", "No relationship"],
        explanation: "Dimensions are on the one side, facts on the many side.",
      },
      hi: {
        prompt: "एक उत्पाद कई बिक्री पंक्तियों पर। कार्डिनैलिटी आमतौर पर…",
        options: ["One-to-many (Product → Sales)", "One-to-one", "Many-to-many ज़रूरी", "संबंध नहीं"],
        explanation: "डाइमेंशन एक तरफ़, फैक्ट कई तरफ़।",
      },
      es: {
        prompt: "Un producto aparece en muchas ventas. La cardinalidad suele ser…",
        options: ["Uno a varios (Product → Sales)", "Uno a uno", "Varios a varios obligatorio", "Sin relación"],
        explanation: "Las dimensiones están en el lado uno; los hechos en el varios.",
      },
      fr: {
        prompt: "Un produit apparaît sur beaucoup de ventes. Cardinalité typique…",
        options: ["Un-à-plusieurs (Product → Sales)", "Un-à-un", "Plusieurs-à-plusieurs obligatoire", "Pas de relation"],
        explanation: "Dimensions du côté un, faits du côté plusieurs.",
      },
    },
  },
  {
    id: "q7",
    topic: "dax",
    answer: 3,
    copy: {
      en: {
        prompt: "COUNTROWS(Sales) returns…",
        options: ["The number of columns", "Always 1", "The file size", "The number of rows in Sales in the current filter context"],
        explanation: "COUNTROWS respects filter context — slicers can reduce the row count.",
      },
      hi: {
        prompt: "COUNTROWS(Sales) देता है…",
        options: ["कॉलम गिनती", "हमेशा 1", "फ़ाइल साइज़", "मौजूदा फ़िल्टर में Sales की पंक्तियाँ"],
        explanation: "COUNTROWS फ़िल्टर कॉन्टेक्स्ट मानता है।",
      },
      es: {
        prompt: "COUNTROWS(Sales) devuelve…",
        options: ["El número de columnas", "Siempre 1", "El tamaño del archivo", "Las filas de Sales en el contexto de filtro actual"],
        explanation: "COUNTROWS respeta el contexto de filtro.",
      },
      fr: {
        prompt: "COUNTROWS(Sales) renvoie…",
        options: ["Le nombre de colonnes", "Toujours 1", "La taille du fichier", "Les lignes de Sales dans le contexte de filtre actuel"],
        explanation: "COUNTROWS respecte le contexte de filtre.",
      },
    },
  },
  {
    id: "q8",
    topic: "service",
    answer: 1,
    copy: {
      en: {
        prompt: "Power BI Desktop vs Service in one line:",
        options: [
          "They are the same installer",
          "Desktop is where you build; Service is where you share, refresh, and consume",
          "Service cannot show visuals",
          "Desktop is only for SQL Server",
        ],
        explanation: "Author in Desktop (or the web editor). Distribute and operate in the Service.",
      },
      hi: {
        prompt: "Desktop बनाम Service एक पंक्ति में:",
        options: [
          "एक ही इंस्टॉलर",
          "Desktop में बनाते हैं; Service में बाँटते, रिफ़्रेश और देखते हैं",
          "Service विज़ुअल नहीं दिखाता",
          "Desktop केवल SQL Server के लिए",
        ],
        explanation: "निर्माण Desktop में; वितरण Service में।",
      },
      es: {
        prompt: "Desktop frente a Servicio, en una línea:",
        options: [
          "El mismo instalador",
          "Desktop se usa para construir; el Servicio para compartir, actualizar y consumir",
          "El Servicio no muestra visuales",
          "Desktop solo para SQL Server",
        ],
        explanation: "Se autoría en Desktop; se opera en el Servicio.",
      },
      fr: {
        prompt: "Desktop vs Service, en une ligne :",
        options: [
          "Le même installeur",
          "Desktop sert à construire ; le Service à partager, actualiser et consommer",
          "Le Service n’affiche pas de visuels",
          "Desktop est réservé à SQL Server",
        ],
        explanation: "On conçoit dans Desktop ; on opère dans le Service.",
      },
    },
  },
  {
    id: "q9",
    topic: "pq",
    answer: 1,
    copy: {
      en: {
        prompt: "Unpivot is the usual fix when Excel has one column per month.",
        options: ["False, always pivot more", "True — months should become rows with a date and a value", "Only in DirectQuery", "Only in RLS"],
        explanation: "A fact table wants a date column, not Jan–Dec columns.",
      },
    },
  },
  {
    id: "q10",
    topic: "rls",
    answer: 1,
    copy: {
      en: {
        prompt: "Dynamic RLS usually filters with…",
        options: ["Theme JSON", "USERPRINCIPALNAME() and a user-to-dimension map", "A pie chart", "Sort by column"],
        explanation: "Map users to regions (or accounts) and filter in the role.",
      },
    },
  },
  {
    id: "q11",
    topic: "refresh",
    answer: 1,
    copy: {
      en: {
        prompt: "RangeStart and RangeEnd exist for…",
        options: ["Bookmarks", "Incremental refresh partitions", "Copilot prompts", "Paginated headers"],
        explanation: "They define the date window of each partition.",
      },
    },
  },
  {
    id: "q12",
    topic: "fabric",
    answer: 1,
    copy: {
      en: {
        prompt: "OneLake in Microsoft Fabric is…",
        options: ["A DAX iterator", "Unified lake storage for Fabric workloads", "A slicer visual", "A gateway SKU"],
        explanation: "Power BI is still the semantic/report layer on top.",
      },
    },
  },
];

export function dailyQuestions(date = new Date()): QuizQuestion[] {
  const seed = Number(date.toISOString().slice(0, 10).replaceAll("-", ""));
  const copy = [...QUIZ_BANK];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = (seed + i * 17) % (i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, 5);
}
