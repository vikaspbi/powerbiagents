import type { Locale } from "@/lib/i18n";

export interface LessonCopy {
  title: string;
  minutes: number;
  body: string[];
  takeaway: string;
  check: { question: string; options: string[]; answer: number };
}

export interface Lesson {
  id: string;
  pathId: string;
  order: number;
  free: boolean;
  copy: Record<Locale, LessonCopy>;
}

export interface LearningPath {
  id: string;
  order: number;
  free: boolean;
  icon: string;
  copy: Record<Locale, { title: string; subtitle: string }>;
  lessons: Lesson[];
}

const essentials: Lesson[] = [
  {
    id: "what-is-power-bi",
    pathId: "essentials",
    order: 1,
    free: true,
    copy: {
      en: {
        title: "What Power BI actually is",
        minutes: 5,
        body: [
          "Power BI is Microsoft’s tool for turning tables into interactive reports. You load data, model it, then build pages that managers can filter.",
          "Think of three layers: data (tables), model (relationships and measures), and visuals (the story). Most confusion happens when people jump to visuals first.",
          "This app is not affiliated with Microsoft. We teach the ideas so you can use Power BI Desktop and the Service with less fear.",
        ],
        takeaway: "Reports are stories on top of a model — not a pile of charts.",
        check: {
          question: "What should you design before picking charts?",
          options: ["Color themes", "The data model and grain of each number", "A 20-page report", "Python scripts"],
          answer: 1,
        },
      },
      hi: {
        title: "Power BI वास्तव में क्या है",
        minutes: 5,
        body: [
          "Power BI Microsoft का टूल है जो तालिकाओं को इंटरैक्टिव रिपोर्ट में बदलता है। आप डेटा लाते हैं, मॉडल बनाते हैं, फिर पेज बनाते हैं जिन्हें फ़िल्टर किया जा सकता है।",
          "तीन परतें याद रखें: डेटा (टेबल), मॉडल (संबंध और मेज़र), और विज़ुअल (कहानी)। ज़्यादातर उलझन तब होती है जब लोग पहले चार्ट चुन लेते हैं।",
          "यह ऐप Microsoft से जुड़ा नहीं है। हम अवधारणाएँ सिखाते हैं ताकि Desktop और Service आसान लगे।",
        ],
        takeaway: "रिपोर्ट चार्टों का ढेर नहीं, मॉडल पर आधारित कहानी है।",
        check: {
          question: "चार्ट चुनने से पहले क्या तय करना चाहिए?",
          options: ["रंग थीम", "डेटा मॉडल और हर संख्या का ग्रेन", "20 पेज की रिपोर्ट", "Python स्क्रिप्ट"],
          answer: 1,
        },
      },
      es: {
        title: "Qué es Power BI de verdad",
        minutes: 5,
        body: [
          "Power BI es la herramienta de Microsoft para convertir tablas en informes interactivos. Cargas datos, modelas y construyes páginas que se pueden filtrar.",
          "Piensa en tres capas: datos (tablas), modelo (relaciones y medidas) y visuales (la historia). La confusión nace al saltar primero a los gráficos.",
          "Esta app no está afiliada a Microsoft. Enseñamos las ideas para que Desktop y el Servicio den menos miedo.",
        ],
        takeaway: "Un informe es una historia sobre un modelo, no un montón de gráficos.",
        check: {
          question: "¿Qué debes diseñar antes de elegir gráficos?",
          options: ["Temas de color", "El modelo y el grano de cada número", "Un informe de 20 páginas", "Scripts de Python"],
          answer: 1,
        },
      },
      fr: {
        title: "Ce qu’est vraiment Power BI",
        minutes: 5,
        body: [
          "Power BI est l’outil Microsoft pour transformer des tables en rapports interactifs. Vous chargez des données, vous les modélisez, puis vous construisez des pages filtrables.",
          "Trois couches : données (tables), modèle (relations et mesures), visuels (l’histoire). La confusion vient souvent du saut direct vers les graphiques.",
          "Cette appli n’est pas affiliée à Microsoft. Nous enseignons les idées pour que Desktop et le Service soient moins intimidants.",
        ],
        takeaway: "Un rapport est une histoire posée sur un modèle, pas un tas de graphiques.",
        check: {
          question: "Que faut-il concevoir avant de choisir des graphiques ?",
          options: ["Les thèmes de couleur", "Le modèle et le grain de chaque chiffre", "Un rapport de 20 pages", "Des scripts Python"],
          answer: 1,
        },
      },
    },
  },
  {
    id: "tables-vs-measures",
    pathId: "essentials",
    order: 2,
    free: true,
    copy: {
      en: {
        title: "Columns vs measures",
        minutes: 6,
        body: [
          "A column lives on a row: Product, Amount, Date. A measure is a formula that aggregates in the current filter context — the slicers and the cell of a matrix.",
          "If you put a raw Amount column in a card, Power BI still has to aggregate it (usually SUM). Writing an explicit measure makes the intent obvious.",
          "Rule of thumb: hide technical columns, expose measures for the numbers people discuss in meetings.",
        ],
        takeaway: "Measures answer questions; columns store facts.",
        check: {
          question: "A measure’s result can change when you click a slicer because of…",
          options: ["Refresh failure", "Filter context", "DirectQuery only", "Bookmarks"],
          answer: 1,
        },
      },
      hi: {
        title: "कॉलम बनाम मेज़र",
        minutes: 6,
        body: [
          "कॉलम पंक्ति पर रहता है: Product, Amount, Date। मेज़र एक फ़ॉर्मूला है जो मौजूदा फ़िल्टर कॉन्टेक्स्ट में जोड़ता है — स्लाइसर और मैट्रिक्स की सेल।",
          "कार्ड में Amount डालने पर भी Power BI उसे जोड़ता है (अक्सर SUM)। स्पष्ट मेज़र इरादा साफ़ करता है।",
          "नियम: तकनीकी कॉलम छिपाएँ, मीटिंग वाली संख्याओं के लिए मेज़र दें।",
        ],
        takeaway: "मेज़र सवालों के जवाब देते हैं; कॉलम तथ्य रखते हैं।",
        check: {
          question: "स्लाइसर दबाने पर मेज़र बदलता है क्योंकि…",
          options: ["Refresh फेल", "फ़िल्टर कॉन्टेक्स्ट", "केवल DirectQuery", "Bookmarks"],
          answer: 1,
        },
      },
      es: {
        title: "Columnas frente a medidas",
        minutes: 6,
        body: [
          "Una columna vive en la fila: Producto, Importe, Fecha. Una medida es una fórmula que agrega en el contexto de filtro actual — segmentadores y celdas de matriz.",
          "Si pones Importe en una tarjeta, Power BI igual agrega (normalmente SUM). Una medida explícita deja clara la intención.",
          "Regla: oculta columnas técnicas y publica medidas para los números de la reunión.",
        ],
        takeaway: "Las medidas responden preguntas; las columnas guardan hechos.",
        check: {
          question: "El resultado de una medida cambia al pulsar un segmentador por…",
          options: ["Fallo de actualización", "Contexto de filtro", "Solo DirectQuery", "Marcadores"],
          answer: 1,
        },
      },
      fr: {
        title: "Colonnes vs mesures",
        minutes: 6,
        body: [
          "Une colonne vit sur la ligne : Produit, Montant, Date. Une mesure est une formule qui agrège dans le contexte de filtre — segments et cellule de matrice.",
          "Même sur une carte, Power BI agrège Montant (souvent SUM). Une mesure explicite clarifie l’intention.",
          "Règle : masquez les colonnes techniques, exposez des mesures pour les chiffres de réunion.",
        ],
        takeaway: "Les mesures répondent aux questions ; les colonnes stockent les faits.",
        check: {
          question: "Une mesure change quand on clique un segment à cause…",
          options: ["D’un échec de refresh", "Du contexte de filtre", "De DirectQuery seulement", "Des signets"],
          answer: 1,
        },
      },
    },
  },
  {
    id: "relationships",
    pathId: "essentials",
    order: 3,
    free: true,
    copy: {
      en: {
        title: "Relationships and grain",
        minutes: 7,
        body: [
          "A relationship tells Power BI how a filter on Products can reach Sales. Typical pattern: one Product row to many Sales rows (one-to-many).",
          "Grain is the question “what does one row mean?” If Sales is one row per order line, you must not treat it like one row per customer.",
          "Star schema: facts in the middle (Sales), dimensions around (Date, Product, Region). It keeps DAX simpler.",
        ],
        takeaway: "Wrong relationships create duplicate numbers, not just ugly diagrams.",
        check: {
          question: "Sales has many rows per product. The Product table should connect as…",
          options: ["Many-to-many by default", "One product to many sales", "One-to-one always", "No relationship"],
          answer: 1,
        },
      },
      hi: {
        title: "संबंध और ग्रेन",
        minutes: 7,
        body: [
          "संबंध बताता है कि Products पर फ़िल्टर Sales तक कैसे पहुँचे। आम पैटर्न: एक Product, कई Sales (one-to-many)।",
          "ग्रेन पूछता है: एक पंक्ति का मतलब क्या है? अगर Sales ऑर्डर लाइन है, उसे ग्राहक पंक्ति मत समझो।",
          "स्टार स्कीमा: बीच में फैक्ट (Sales), चारों ओर डाइमेंशन (Date, Product, Region)। DAX सरल रहता है।",
        ],
        takeaway: "गलत संबंध संख्याएँ दोहराते हैं, सिर्फ़ डायग्राम खराब नहीं करते।",
        check: {
          question: "हर उत्पाद की कई Sales पंक्तियाँ हैं। Product टेबल जुड़े…",
          options: ["डिफ़ॉल्ट many-to-many", "एक उत्पाद से कई बिक्री", "हमेशा one-to-one", "कोई संबंध नहीं"],
          answer: 1,
        },
      },
      es: {
        title: "Relaciones y grano",
        minutes: 7,
        body: [
          "Una relación dice cómo un filtro en Products llega a Sales. Patrón típico: un producto a muchas ventas (uno a varios).",
          "El grano pregunta: ¿qué significa una fila? Si Sales es una línea de pedido, no es una fila por cliente.",
          "Esquema en estrella: hechos en el centro (Sales), dimensiones alrededor. El DAX se simplifica.",
        ],
        takeaway: "Las relaciones malas duplican números, no solo ensucian el diagrama.",
        check: {
          question: "Hay muchas filas de Sales por producto. Products debe conectar como…",
          options: ["Varios a varios por defecto", "Un producto a muchas ventas", "Siempre uno a uno", "Sin relación"],
          answer: 1,
        },
      },
      fr: {
        title: "Relations et grain",
        minutes: 7,
        body: [
          "Une relation dit comment un filtre sur Products atteint Sales. Schéma typique : un produit vers beaucoup de ventes (un-à-plusieurs).",
          "Le grain demande : que signifie une ligne ? Si Sales est une ligne de commande, ce n’est pas une ligne client.",
          "Schéma en étoile : faits au centre, dimensions autour. Le DAX reste plus simple.",
        ],
        takeaway: "De mauvaises relations dupliquent les chiffres, pas seulement le schéma.",
        check: {
          question: "Plusieurs lignes Sales par produit. Products se relie comme…",
          options: ["Plusieurs-à-plusieurs par défaut", "Un produit vers beaucoup de ventes", "Toujours un-à-un", "Sans relation"],
          answer: 1,
        },
      },
    },
  },
  {
    id: "filter-context",
    pathId: "essentials",
    order: 4,
    free: false,
    copy: {
      en: {
        title: "Filter context without fear",
        minutes: 8,
        body: [
          "Filter context is the set of filters that apply when a measure is evaluated: slicers, rows/columns of a visual, report filters, and CALCULATE.",
          "A card often has fewer filters than a matrix cell. That is why the same measure can show 100 on a card and 80 in a row.",
          "CALCULATE changes filter context. That is the heart of DAX — we practice it in the lab.",
        ],
        takeaway: "When a number looks “wrong”, ask which filters are on.",
        check: {
          question: "CALCULATE is mainly used to…",
          options: ["Import CSV files", "Change filter context for an expression", "Create bookmarks", "Set row-level security"],
          answer: 1,
        },
      },
      hi: {
        title: "फ़िल्टर कॉन्टेक्स्ट बिना डर",
        minutes: 8,
        body: [
          "फ़िल्टर कॉन्टेक्स्ट वे फ़िल्टर हैं जो मेज़र चलते समय लागू होते हैं: स्लाइसर, विज़ुअल की पंक्ति/कॉलम, रिपोर्ट फ़िल्टर, और CALCULATE।",
          "कार्ड पर अक्सर मैट्रिक्स सेल से कम फ़िल्टर होते हैं। इसलिए वही मेज़र कार्ड पर 100 और पंक्ति में 80 हो सकता है।",
          "CALCULATE कॉन्टेक्स्ट बदलता है — DAX का हृदय। लैब में अभ्यास होगा।",
        ],
        takeaway: "संख्या गलत लगे तो पूछें: कौन से फ़िल्टर लगे हैं?",
        check: {
          question: "CALCULATE मुख्यतः…",
          options: ["CSV इंपोर्ट", "एक्सप्रेशन का फ़िल्टर कॉन्टेक्स्ट बदलने", "Bookmarks", "RLS सेट करने"],
          answer: 1,
        },
      },
      es: {
        title: "Contexto de filtro sin miedo",
        minutes: 8,
        body: [
          "El contexto de filtro es el conjunto de filtros al evaluar una medida: segmentadores, filas/columnas, filtros del informe y CALCULATE.",
          "Una tarjeta suele tener menos filtros que una celda de matriz. Por eso 100 en la tarjeta y 80 en la fila.",
          "CALCULATE cambia el contexto. Es el corazón de DAX; lo practicas en el laboratorio.",
        ],
        takeaway: "Si un número “está mal”, pregunta qué filtros están activos.",
        check: {
          question: "CALCULATE sirve sobre todo para…",
          options: ["Importar CSV", "Cambiar el contexto de filtro de una expresión", "Crear marcadores", "Definir RLS"],
          answer: 1,
        },
      },
      fr: {
        title: "Le contexte de filtre sans peur",
        minutes: 8,
        body: [
          "Le contexte de filtre est l’ensemble des filtres à l’évaluation : segments, lignes/colonnes, filtres du rapport et CALCULATE.",
          "Une carte a souvent moins de filtres qu’une cellule de matrice. D’où 100 sur la carte et 80 sur la ligne.",
          "CALCULATE modifie le contexte. C’est le cœur du DAX — à pratiquer dans le labo.",
        ],
        takeaway: "Si un chiffre semble faux, demandez quels filtres s’appliquent.",
        check: {
          question: "CALCULATE sert surtout à…",
          options: ["Importer des CSV", "Modifier le contexte de filtre d’une expression", "Créer des signets", "Poser la RLS"],
          answer: 1,
        },
      },
    },
  },
];

const literacy: Lesson[] = [
  {
    id: "ask-better-questions",
    pathId: "literacy",
    order: 1,
    free: true,
    copy: {
      en: {
        title: "Ask a question the data can answer",
        minutes: 5,
        body: [
          "“Show me sales” is not a question. “How did USA laptop sales move month over month last quarter?” is.",
          "Good analytics questions name the metric, the grain, the time window, and the comparison.",
          "If stakeholders cannot name those four, the report will keep changing forever.",
        ],
        takeaway: "Metric + grain + time + comparison = a buildable request.",
        check: {
          question: "Which request is ready for a model?",
          options: [
            "Make it look modern",
            "YTD revenue vs last year by region",
            "Add more colors",
            "Export to Excel please",
          ],
          answer: 1,
        },
      },
      hi: {
        title: "ऐसा सवाल पूछें जिसका डेटा जवाब दे सके",
        minutes: 5,
        body: [
          "“सेल्स दिखाओ” सवाल नहीं है। “पिछली तिमाही में USA लैपटॉप सेल्स महीने-दर-महीने कैसे बदली?” है।",
          "अच्छे सवाल में मेट्रिक, ग्रेन, समय और तुलना होती है।",
          "अगर ये चार नाम न हों, रिपोर्ट हमेशा बदलती रहेगी।",
        ],
        takeaway: "मेट्रिक + ग्रेन + समय + तुलना = बनने लायक अनुरोध।",
        check: {
          question: "कौन सा अनुरोध मॉडल के लिए तैयार है?",
          options: ["आधुनिक दिखावट", "क्षेत्र अनुसार YTD राजस्व बनाम पिछले वर्ष", "और रंग", "Excel में निर्यात"],
          answer: 1,
        },
      },
      es: {
        title: "Preguntas que los datos pueden responder",
        minutes: 5,
        body: [
          "“Muéstrame ventas” no es una pregunta. “¿Cómo se movieron las ventas de laptops en USA mes a mes el trimestre pasado?” sí.",
          "Una buena pregunta nombra métrica, grano, ventana de tiempo y comparación.",
          "Si no hay esos cuatro, el informe no termina nunca.",
        ],
        takeaway: "Métrica + grano + tiempo + comparación = un pedido construible.",
        check: {
          question: "¿Qué pedido está listo para un modelo?",
          options: ["Que se vea moderno", "Ingresos YTD vs año anterior por región", "Más colores", "Exportar a Excel"],
          answer: 1,
        },
      },
      fr: {
        title: "Poser une question que les données peuvent trancher",
        minutes: 5,
        body: [
          "« Montre-moi les ventes » n’est pas une question. « Comment ont bougé les ventes de laptops USA mois par mois au dernier trimestre ? » l’est.",
          "Une bonne question nomme la métrique, le grain, la période et la comparaison.",
          "Sans ces quatre, le rapport change sans fin.",
        ],
        takeaway: "Métrique + grain + temps + comparaison = une demande constructible.",
        check: {
          question: "Quelle demande est prête pour un modèle ?",
          options: ["Un look moderne", "CA YTD vs N-1 par région", "Plus de couleurs", "Export Excel"],
          answer: 1,
        },
      },
    },
  },
  {
    id: "pick-a-visual",
    pathId: "literacy",
    order: 2,
    free: false,
    copy: {
      en: {
        title: "Pick the visual for the question",
        minutes: 6,
        body: [
          "Trend over time → line. Part of a total → bar (not pie, if you have more than a few slices). Rank → bar. Relationship → scatter. Single KPI → card + target.",
          "A matrix is a table with superpowers: it is for looking up numbers, not for a six-second executive glance.",
          "If two visuals say the same thing, delete one. Attention is the scarce resource.",
        ],
        takeaway: "The question picks the visual. Fashion does not.",
        check: {
          question: "Best visual for month-over-month revenue?",
          options: ["Pie chart", "Line chart", "Filled map", "Card only"],
          answer: 1,
        },
      },
      hi: {
        title: "सवाल के हिसाब से विज़ुअल चुनें",
        minutes: 6,
        body: [
          "समय के साथ रुझान → लाइन। कुल का हिस्सा → बार (कई स्लाइस पर पाई नहीं)। रैंक → बार। संबंध → स्कैटर। एक KPI → कार्ड।",
          "मैट्रिक्स संख्या देखने के लिए है, छह सेकंड की नज़र के लिए नहीं।",
          "दो विज़ुअल एक ही बात कहें तो एक हटाएँ। ध्यान सीमित है।",
        ],
        takeaway: "सवाल विज़ुअल चुनता है, फ़ैशन नहीं।",
        check: {
          question: "महीने-दर-महीने राजस्व के लिए सबसे अच्छा विज़ुअल?",
          options: ["पाई", "लाइन चार्ट", "मैप", "केवल कार्ड"],
          answer: 1,
        },
      },
      es: {
        title: "El visual que responde la pregunta",
        minutes: 6,
        body: [
          "Tendencia → línea. Parte de un total → barras (no tarta si hay muchas porciones). Ranking → barras. Relación → dispersión. Un KPI → tarjeta.",
          "La matriz sirve para consultar números, no para una mirada de seis segundos.",
          "Si dos visuales dicen lo mismo, borra uno. La atención escasea.",
        ],
        takeaway: "La pregunta elige el visual, no la moda.",
        check: {
          question: "¿Mejor visual para ingresos mes a mes?",
          options: ["Tarta", "Gráfico de líneas", "Mapa", "Solo tarjeta"],
          answer: 1,
        },
      },
      fr: {
        title: "Choisir le visuel selon la question",
        minutes: 6,
        body: [
          "Tendance → ligne. Part d’un total → barres (pas un camembert trop découpé). Rang → barres. Relation → nuage. Un KPI → carte.",
          "La matrice sert à lire des nombres, pas à un coup d’œil de six secondes.",
          "Deux visuels pour la même idée : enlevez-en un. L’attention est rare.",
        ],
        takeaway: "La question choisit le visuel, pas la mode.",
        check: {
          question: "Meilleur visuel pour un CA mois par mois ?",
          options: ["Camembert", "Courbe", "Carte", "Carte KPI seule"],
          answer: 1,
        },
      },
    },
  },
];

const daxPath: Lesson[] = [
  {
    id: "sum-first",
    pathId: "dax",
    order: 1,
    free: true,
    copy: {
      en: {
        title: "Start with SUM",
        minutes: 5,
        body: [
          "Most business questions begin with an additive fact: Amount, Quantity, Hours. SUM(Sales[Amount]) is the honest starting measure.",
          "Name measures as the business speaks: Total Sales, not Sum of Amount.",
          "Then open the DAX lab and run it on the Sales sample. You should get 2295.",
        ],
        takeaway: "Name the measure after the question, not after the function.",
        check: {
          question: "Which is the better measure name for a meeting?",
          options: ["Sum of Amount", "Total Sales", "Column1", "Measure 12"],
          answer: 1,
        },
      },
      hi: {
        title: "SUM से शुरू करें",
        minutes: 5,
        body: [
          "अधिकांश व्यापारिक सवाल जोड़ने योग्य तथ्य से शुरू होते हैं: Amount, Quantity। SUM(Sales[Amount]) ईमानदार शुरुआत है।",
          "मेज़र का नाम व्यवसाय जैसी भाषा में: Total Sales, न कि Sum of Amount।",
          "DAX लैब में Sales सैंपल पर चलाएँ — 2295 मिलना चाहिए।",
        ],
        takeaway: "मेज़र का नाम सवाल के अनुसार रखें, फ़ंक्शन के अनुसार नहीं।",
        check: {
          question: "मीटिंग के लिए बेहतर नाम?",
          options: ["Sum of Amount", "Total Sales", "Column1", "Measure 12"],
          answer: 1,
        },
      },
      es: {
        title: "Empieza con SUM",
        minutes: 5,
        body: [
          "Casi toda pregunta de negocio empieza por un hecho aditivo: Importe, Cantidad. SUM(Sales[Amount]) es el primer paso honesto.",
          "Nombra medidas como habla el negocio: Total Sales, no Sum of Amount.",
          "Ábrelo en el laboratorio DAX sobre Sales. Debes obtener 2295.",
        ],
        takeaway: "El nombre sigue a la pregunta, no a la función.",
        check: {
          question: "¿Mejor nombre para una reunión?",
          options: ["Sum of Amount", "Total Sales", "Column1", "Measure 12"],
          answer: 1,
        },
      },
      fr: {
        title: "Commencer par SUM",
        minutes: 5,
        body: [
          "La plupart des questions métier partent d’un fait additif : Montant, Quantité. SUM(Sales[Amount]) est le premier pas honnête.",
          "Nommez comme le métier parle : Total Sales, pas Sum of Amount.",
          "Lancez-le dans le labo DAX sur Sales : vous devez obtenir 2295.",
        ],
        takeaway: "Le nom suit la question, pas la fonction.",
        check: {
          question: "Meilleur nom en réunion ?",
          options: ["Sum of Amount", "Total Sales", "Column1", "Measure 12"],
          answer: 1,
        },
      },
    },
  },
  {
    id: "calculate-region",
    pathId: "dax",
    order: 2,
    free: false,
    copy: {
      en: {
        title: "CALCULATE is a context shift",
        minutes: 7,
        body: [
          "CALCULATE(expression, filters) evaluates the expression after applying extra filters (and sometimes removing others).",
          "CALCULATE(SUM(Sales[Amount]), Sales[Region] = \"USA\") is “total sales as if only USA were selected”.",
          "In the lab this returns 1225. If you forget quotes or the table name, the teaching engine will tell you.",
        ],
        takeaway: "CALCULATE does not “run SQL”. It changes how DAX sees the model.",
        check: {
          question: "CALCULATE(SUM(Sales[Amount]), Sales[Region] = \"USA\") means…",
          options: [
            "Delete other regions from the database",
            "Evaluate total sales in a USA filter context",
            "Always ignore slicers forever",
            "Create a calculated column",
          ],
          answer: 1,
        },
      },
      hi: {
        title: "CALCULATE कॉन्टेक्स्ट बदलता है",
        minutes: 7,
        body: [
          "CALCULATE(expression, filters) अतिरिक्त फ़िल्टर लगाकर एक्सप्रेशन चलाता है।",
          "CALCULATE(SUM(Sales[Amount]), Sales[Region] = \"USA\") मतलब “मानो केवल USA चुना हो।”",
          "लैब में उत्तर 1225 है।",
        ],
        takeaway: "CALCULATE SQL नहीं चलाता — मॉडल को देखने का तरीका बदलता है।",
        check: {
          question: "USA वाला CALCULATE मतलब…",
          options: ["डेटाबेस से क्षेत्र मिटाना", "USA फ़िल्टर में कुल बिक्री", "स्लाइसर हमेशा नज़रअंदाज़", "कैलकुलेटेड कॉलम"],
          answer: 1,
        },
      },
      es: {
        title: "CALCULATE cambia el contexto",
        minutes: 7,
        body: [
          "CALCULATE(expresión, filtros) evalúa después de aplicar filtros extra.",
          "CALCULATE(SUM(Sales[Amount]), Sales[Region] = \"USA\") es “ventas como si solo USA estuviera seleccionado”.",
          "En el laboratorio da 1225.",
        ],
        takeaway: "CALCULATE no ejecuta SQL; cambia cómo DAX ve el modelo.",
        check: {
          question: "Ese CALCULATE de USA significa…",
          options: ["Borrar regiones", "Evaluar ventas en contexto USA", "Ignorar segmentadores para siempre", "Crear columna calculada"],
          answer: 1,
        },
      },
      fr: {
        title: "CALCULATE déplace le contexte",
        minutes: 7,
        body: [
          "CALCULATE(expression, filtres) évalue après avoir appliqué des filtres extra.",
          "CALCULATE(SUM(Sales[Amount]), Sales[Region] = \"USA\") = « ventes comme si seul USA était sélectionné ».",
          "Dans le labo : 1225.",
        ],
        takeaway: "CALCULATE n’exécute pas du SQL ; il change le regard de DAX sur le modèle.",
        check: {
          question: "Ce CALCULATE USA signifie…",
          options: ["Effacer des régions", "Évaluer les ventes dans un contexte USA", "Ignorer les segments à jamais", "Créer une colonne calculée"],
          answer: 1,
        },
      },
    },
  },
];

export const LEARNING_PATHS: LearningPath[] = [
  {
    id: "essentials",
    order: 1,
    free: true,
    icon: "1",
    copy: {
      en: { title: "Power BI essentials", subtitle: "Model, visuals, and how reports really work" },
      hi: { title: "Power BI मूल बातें", subtitle: "मॉडल, विज़ुअल और रिपोर्ट कैसे चलती है" },
      es: { title: "Lo esencial de Power BI", subtitle: "Modelo, visuales y cómo funcionan los informes" },
      fr: { title: "Les bases de Power BI", subtitle: "Modèle, visuels et fonctionnement réel des rapports" },
    },
    lessons: essentials,
  },
  {
    id: "literacy",
    order: 2,
    free: false,
    icon: "2",
    copy: {
      en: { title: "Data literacy", subtitle: "Ask better questions and choose visuals" },
      hi: { title: "डेटा साक्षरता", subtitle: "बेहतर सवाल और सही विज़ुअल" },
      es: { title: "Alfabetización de datos", subtitle: "Mejores preguntas y mejores visuales" },
      fr: { title: "Culture data", subtitle: "Mieux questionner, mieux visualiser" },
    },
    lessons: literacy,
  },
  {
    id: "dax",
    order: 3,
    free: false,
    icon: "3",
    copy: {
      en: { title: "DAX fundamentals", subtitle: "SUM, context, and CALCULATE" },
      hi: { title: "DAX मूल", subtitle: "SUM, कॉन्टेक्स्ट और CALCULATE" },
      es: { title: "Fundamentos de DAX", subtitle: "SUM, contexto y CALCULATE" },
      fr: { title: "Fondamentaux DAX", subtitle: "SUM, contexte et CALCULATE" },
    },
    lessons: daxPath,
  },
];

export function allLessons(): Lesson[] {
  return LEARNING_PATHS.flatMap((p) => p.lessons);
}

export function getLesson(id: string): Lesson | undefined {
  return allLessons().find((l) => l.id === id);
}

export function getPath(id: string): LearningPath | undefined {
  return LEARNING_PATHS.find((p) => p.id === id);
}
