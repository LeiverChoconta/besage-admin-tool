import React, { useState, useRef } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { NoteIcon, BrainIcon, Flag01Icon, Settings01Icon, UserGroupIcon, BarCode01Icon } from "@hugeicons/core-free-icons";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from "recharts";

// ─── iBDS DESIGN TOKENS (from Figma [BDS] iLeader) ───────────────────────────
const BDS = {
  neutral: {
    950:"#0C0A09", 900:"#1C1917", 800:"#292524", 700:"#44403B",
    600:"#57534D", 500:"#79716B", 400:"#A6A09B", 300:"#D6D3D1",
    200:"#E7E5E4", 100:"#F5F5F4", 50:"#FAFAF9", "000":"#FFFFFF",
  },
  primary: { // warm amber/orange — brand color
    950:"#381A00", 900:"#623100", 800:"#7E3A00", 700:"#A34A00",
    600:"#C55300", 500:"#E26500", 400:"#EB7C33", 300:"#F8A372",
    200:"#FFC9A9", 100:"#FFE4D4", 50:"#FFFAEA",
  },
  secondary: { // deep navy blue
    950:"#001C35", 900:"#00355E", 800:"#00508A", 700:"#0066B3",
    600:"#007ED8", 500:"#0094F5", 400:"#37A5FB", 300:"#78C1FF",
    200:"#ADDDFF", 100:"#D7EEFF", 50:"#EBF7FF",
  },
  red:     { 600:"#CB4644", 100:"#FFE2DE", 50:"#FFF0EE" },
  emerald: { 600:"#00975C", 100:"#D4F4E4", 50:"#EAFAF1" },
  amber:   { 500:"#E26500", 400:"#EB7C33", 300:"#F8A372" },
};

// Semantic tokens
const T = {
  pageBg:      BDS.neutral[100],
  surface:     BDS.neutral["000"],
  borderBase:  "rgba(12,10,9,0.16)",
  borderSoft:  "rgba(12,10,9,0.08)",
  textPrimary: BDS.neutral[950],
  textSub:     BDS.neutral[600],
  textMuted:   BDS.neutral[500],
  accent:      BDS.primary[500],
  accentDark:  BDS.primary[600],
  accentSoft:  BDS.primary[100],
  navBg:       BDS.secondary[950],
  navText:     BDS.neutral["000"],
  success:     BDS.emerald[600],
  successBg:   BDS.emerald[100],
  danger:      BDS.red[600],
  dangerBg:    BDS.red[100],
};

// ─── TYPE COLORS & BG ────────────────────────────────────────────────────────
const TYPE_COLORS = {
  NPS:       BDS.emerald[600],
  CES:       BDS.secondary[600],
  PMF:       "#7D45A2",
  CCR:       BDS.primary[500],
  CSAT:      BDS.secondary[500],
  Open:      "#008A6E",
  Interview: BDS.primary[700],
};
const TYPE_BG = {
  NPS:       BDS.emerald[100],
  CES:       BDS.secondary[100],
  PMF:       "#F0E6FF",
  CCR:       BDS.primary[100],
  CSAT:      BDS.secondary[50],
  Open:      BDS.emerald[50],
  Interview: BDS.primary[50],
};

// ─── SURVEY TYPE CATALOG ─────────────────────────────────────────────────────
const SURVEY_TYPES = {
  CES: {
    label:"Customer Effort Score", abbr:"CES", icon:"⚡",
    color:TYPE_COLORS.CES, bg:TYPE_BG.CES,
    mechanic:"Effort rating scale",
    mechanicDesc:"Users rate the ease of their experience from 1 (very difficult) to 5 (very easy).",
    benefit:"Understand the usability of your product",
    benefitDesc:"Provides insight into how challenging your product is at a glance.",
  },
  CCR: {
    label:"Customer Churn Rate", abbr:"CCR", icon:"📉",
    color:TYPE_COLORS.CCR, bg:TYPE_BG.CCR,
    mechanic:"Unsubscribe reason selection",
    mechanicDesc:'Users select from predefined reasons for unsubscribing: "no longer needed", "found a better product", or "too difficult to use."',
    benefit:"Capture valuable customer feedback",
    benefitDesc:"Users have the option to provide more detailed comments or suggestions regarding their decision to unsubscribe.",
  },
  CSAT: {
    label:"Customer Satisfaction", abbr:"CSAT", icon:"⭐",
    color:TYPE_COLORS.CSAT, bg:TYPE_BG.CSAT,
    mechanic:"CSAT rating scale",
    mechanicDesc:"Users rate their satisfaction on a scale from 1 (very dissatisfied) to 5 (very satisfied).",
    benefit:"Monitor key flow quality",
    benefitDesc:"The customer satisfaction survey works especially well after onboarding, checkout, or customer support flows.",
  },
  Open: {
    label:"Open Feedback", abbr:"Open", icon:"💬",
    color:TYPE_COLORS.Open, bg:TYPE_BG.Open,
    mechanic:"Open text box",
    mechanicDesc:"Users can freely add their feedback, comments, or suggestions without constraints. Done easily in-app.",
    benefit:"Learn what users are thinking",
    benefitDesc:"Get qualitative user feedback easily and learn what users think about your product.",
  },
  NPS: {
    label:"Net Promoter Score", abbr:"NPS", icon:"📊",
    color:TYPE_COLORS.NPS, bg:TYPE_BG.NPS,
    mechanic:"NPS rating scale",
    mechanicDesc:"Users rate their likelihood to recommend your product on a scale from 0 (not likely at all) to 10 (extremely likely).",
    benefit:"Track your rating over time",
    benefitDesc:"Run repeated NPS surveys to learn how user perception of your product changes.",
  },
  PMF: {
    label:"Product-Market Fit", abbr:"PMF", icon:"🎯",
    color:TYPE_COLORS.PMF, bg:TYPE_BG.PMF,
    mechanic:"Multi-dimension survey",
    mechanicDesc:"Users answer a structured set of questions about how indispensable the product is, across necessity, frequency, and willingness to pay.",
    benefit:"Validate your product's market fit",
    benefitDesc:"Understand whether your product has found its market and where you stand relative to the 40% must-have benchmark.",
  },
  Interview: {
    label:"User Interview", abbr:"Interview", icon:"🎤",
    color:TYPE_COLORS.Interview, bg:TYPE_BG.Interview,
    mechanic:"Structured interview guide",
    mechanicDesc:"A guided set of open-ended questions designed to uncover deep motivations, workflows, and pain points through 1:1 conversations.",
    benefit:"Go deeper than surveys allow",
    benefitDesc:'Discover the "why" behind user behavior. Best for early discovery, persona building, and testing new concepts.',
  },
};

// ─── MOCK SURVEYS ─────────────────────────────────────────────────────────────
const SURVEYS = [
  { id:1, name:"Q1 2025 NPS Global",           type:"NPS",       status:"published",  responses:1284, published:"2025-01-10", creator:"Ana Torres",   questions:3 },
  { id:2, name:"Onboarding CES Flow",           type:"CES",       status:"published",  responses:432,  published:"2025-02-01", creator:"Carlos Mejía", questions:5 },
  { id:4, name:"Post-Churn Exit Survey",        type:"CCR",       status:"published",  responses:89,   published:"2025-01-28", creator:"Ana Torres",   questions:6 },
  { id:5, name:"Checkout CSAT",                 type:"CSAT",      status:"deprecated", responses:2103, published:"2024-10-15", creator:"Sofía Reyes",  questions:2 },
  { id:6, name:"Open Feedback — Dashboard",     type:"Open",      status:"published",  responses:317,  published:"2025-02-14", creator:"Carlos Mejía", questions:1 },
  { id:8, name:"Q4 2024 NPS",                   type:"NPS",       status:"deprecated", responses:3401, published:"2024-10-01", creator:"Sofía Reyes",  questions:3 },
  { id:9, name:"PMF — Mobile App",              type:"PMF",       status:"published",  responses:156,  published:"2025-02-20", creator:"Leiver Díaz",  questions:7 },
  { id:10,name:"User Interviews — Power Users", type:"Interview", status:"published",  responses:24,   published:"2025-02-25", creator:"Leiver Díaz",  questions:12 },
];

// ─── STATUS CONFIG ────────────────────────────────────────────────────────────
const STATUS_CFG = {
  published:  { bg:BDS.emerald[100], color:BDS.emerald[600], border:"#A7E3C9", label:"Publicada"  },
  draft:      { bg:BDS.primary[50],  color:BDS.primary[600], border:BDS.primary[200], label:"Borrador" },
  deprecated: { bg:BDS.neutral[100], color:BDS.neutral[500], border:BDS.neutral[300], label:"Cerrada"  },
};

// ─── MOCK QUESTIONS ───────────────────────────────────────────────────────────
const seededRand = (seed) => { let s=seed; return () => { s=(s*9301+49297)%233280; return s/233280; }; };

const SURVEY_QUESTIONS = {
  1:[
    { id:"q1",order:1,type:"nps",   required:true,  text:"¿Qué tan probable es que recomiendes iLeader a un colega o amigo?",options:[] },
    { id:"q2",order:2,type:"choice",required:false, text:"¿Cuál es la principal razón de tu puntuación?",options:["Funcionalidades","Facilidad de uso","Soporte","Precio","Otro"] },
    { id:"q3",order:3,type:"text",  required:false, text:"¿Qué podríamos mejorar para que tu experiencia sea perfecta?",options:[] },
  ],
  2:[
    { id:"q1",order:1,type:"scale", required:true,  text:"Completar el proceso de onboarding fue fácil para mí.",options:[] },
    { id:"q2",order:2,type:"choice",required:true,  text:"¿En qué parte del onboarding sentiste más fricción?",options:["Registro de cuenta","Configuración inicial","Importar datos","Conectar integraciones","Tour del producto"] },
    { id:"q3",order:3,type:"scale", required:true,  text:"La información que se me pidió durante el onboarding fue clara.",options:[] },
    { id:"q4",order:4,type:"text",  required:false, text:"¿Hubo algún paso que consideraste innecesario o confuso?",options:[] },
    { id:"q5",order:5,type:"scale", required:true,  text:"En general, ¿qué tan satisfecho estás con la experiencia de inicio?",options:[] },
  ],
  4:[
    { id:"q1",order:1,type:"choice",required:true,  text:"¿Cuál es la razón principal por la que decidiste cancelar?",options:["El precio es muy alto","Me faltaban funciones clave","Encontré una mejor alternativa","Ya no necesito el producto","Problemas técnicos","Otro"] },
    { id:"q2",order:2,type:"scale", required:true,  text:"¿Qué tan satisfecho estabas con el producto antes de cancelar?",options:[] },
    { id:"q3",order:3,type:"choice",required:false, text:"¿Qué herramienta usas ahora en lugar de iLeader?",options:["Lattice","15Five","Culture Amp","Leapsome","Excel / Google Sheets","Ninguna todavía","Otro"] },
    { id:"q4",order:4,type:"scale", required:false, text:"¿Qué tan probable es que vuelvas a usar iLeader en el futuro?",options:[] },
    { id:"q5",order:5,type:"text",  required:false, text:"¿Hay algo que podríamos haber hecho para evitar tu cancelación?",options:[] },
    { id:"q6",order:6,type:"choice",required:false, text:"¿Nos recomendarías a alguien a pesar de tu cancelación?",options:["Sí, definitivamente","Tal vez","No"] },
  ],
  6:[ { id:"q1",order:1,type:"text",required:true,text:"¿Qué es lo que más te gusta del nuevo dashboard y qué cambiarías?",options:[] } ],
  8:[
    { id:"q1",order:1,type:"nps",   required:true,  text:"¿Qué tan probable es que recomiendes iLeader a alguien de tu equipo?",options:[] },
    { id:"q2",order:2,type:"choice",required:false, text:"¿Cuál describe mejor tu rol en la empresa?",options:["Individual contributor","Team lead","Manager","Director","C-Level"] },
    { id:"q3",order:3,type:"text",  required:false, text:"¿Qué funcionalidad agregarías a iLeader?",options:[] },
  ],
};

const generateFallbackQuestions = (survey) => {
  const rand = seededRand(survey.id * 31);
  const types = ["scale","text","choice","nps"];
  const stubs = [
    "¿Qué tan satisfecho estás con la experiencia general?",
    "¿Cómo calificarías la facilidad de uso del producto?",
    "¿Cuál fue el aspecto más valioso de tu experiencia?",
    "¿Encontraste lo que buscabas hoy?",
    "¿Qué mejorarías de este flujo?",
    "¿Recomendarías este producto a otras personas?",
    "¿Tuviste algún problema durante el proceso?",
    "Describe con tus palabras tu experiencia de hoy.",
    "¿Qué tan claro fue el proceso para ti?",
    "¿Qué funcionalidad adicional te sería más útil?",
    "¿Con qué frecuencia usas esta función?",
    "¿Qué tan probable es que vuelvas a usar este flujo?",
  ];
  return Array.from({ length:survey.questions }, (_,i) => {
    const t = types[Math.floor(rand()*types.length)];
    return {
      id:`q${i+1}`, order:i+1, type:t, required:rand()>0.3,
      text:stubs[i%stubs.length],
      options:t==="choice" ? ["Opción A","Opción B","Opción C","Opción D"].slice(0,3+Math.floor(rand()*2)) : [],
    };
  });
};

const getSurveyQuestions = (survey) => SURVEY_QUESTIONS[survey.id] || generateFallbackQuestions(survey);

// ─── MOCK RESPONDENTS ─────────────────────────────────────────────────────────
const FIRST_NAMES = ["Carlos","Ana","Sofía","Miguel","Valentina","Diego","Camila","Andrés","Isabella","Luis","Gabriela","Ricardo","Natalia","Sebastián","Mariana"];
const LAST_NAMES  = ["García","López","Martínez","Rodríguez","Hernández","Torres","Díaz","Reyes","Morales","Jiménez","Ruiz","Vargas","Castro","Flores","Ramírez"];

const TEXT_ANSWERS = [
  "Me gustó mucho el proceso, fue claro e intuitivo.",
  "Fue rápido pero tuve que buscar algunas opciones.",
  "Necesita mejorar la parte de configuración inicial.",
  "Muy buena experiencia en general, lo recomendaría.",
  "Tuve algunos problemas pero los resolví fácilmente.",
  "El flujo es claro aunque algunos pasos son redundantes.",
];

const generateRespondents = (survey, count=30) => {
  const rand = seededRand(survey.id*137);
  const questions = getSurveyQuestions(survey);
  return Array.from({ length:count }, (_,i) => {
    const fn = FIRST_NAMES[Math.floor(rand()*FIRST_NAMES.length)];
    const ln = LAST_NAMES[Math.floor(rand()*LAST_NAMES.length)];
    const completed = rand()>0.22;
    const base = new Date("2025-01-10");
    base.setDate(base.getDate()+Math.floor(rand()*60));
    const dropOffAt = completed ? questions.length : 1 + Math.floor(rand() * (questions.length - 1));
    const answers = questions.map((q, qi) => {
      if (qi >= dropOffAt) return { qId:q.id, type:q.type, value:null };
      if (q.type==="nps")    return { qId:q.id, type:"nps",    value:Math.floor(rand()*11) };
      if (q.type==="scale")  return { qId:q.id, type:"scale",  value:1+Math.floor(rand()*5) };
      if (q.type==="choice") return { qId:q.id, type:"choice", value:q.options[Math.floor(rand()*q.options.length)] };
      return { qId:q.id, type:"text", value:TEXT_ANSWERS[Math.floor(rand()*TEXT_ANSWERS.length)] };
    });
    return {
      id:`USR-${String(survey.id*1000+i+1).padStart(5,"0")}`,
      name:`${fn} ${ln}`,
      date:base.toLocaleDateString("es-MX",{day:"numeric",month:"short",year:"numeric"}),
      completed,
      dropOffAt,
      plan:["Free","Pro","Team","Enterprise"][Math.floor(rand()*4)],
      answers,
    };
  });
};

// ─── MOCK ANALYTICS DATA ──────────────────────────────────────────────────────
const generateDetailData = (survey) => {
  const base = {
    responsesOverTime:[
      {day:"S1",responses:42},{day:"S2",responses:89},{day:"S3",responses:134},
      {day:"S4",responses:98},{day:"S5",responses:201},{day:"S6",responses:156},
      {day:"S7",responses:178},{day:"S8",responses:220},{day:"S9",responses:167},
    ],
    dropoffs:[
      {question:"P1",pct:100},{question:"P2",pct:91},
      {question:"P3",pct:83},{question:"P4",pct:78},{question:"P5",pct:72},
    ],
    completion:{ completed:78, abandoned:22 },
    reach:{ visitors:Math.round(survey.responses/0.64), respondents:survey.responses },
    countries:[
      {name:"México",value:34,color:"#E26500"},{name:"Colombia",value:22,color:"#7D45A2"},
      {name:"Argentina",value:18,color:"#db2777"},{name:"España",value:14,color:"#ea580c"},
      {name:"Otros",value:12,color:"#79716B"},
    ],
    gender:[
      {name:"Masculino",value:47,fill:"#EB7C33"},{name:"Femenino",value:38,fill:"#ec4899"},
      {name:"No binario",value:9,fill:"#8b5cf6"},{name:"Prefiero no decir",value:6,fill:"#D6D3D1"},
    ],
    devices:[
      {name:"iOS",value:55,fill:"#0C0A09"},
      {name:"Android",value:45,fill:"#00975C"},
    ],
    ageGroups:[
      {range:"Gen Z (1997–2012)",    age:"13–28 años",value:28,fill:"#8b5cf6"},
      {range:"Millennial (1981–1996)",age:"29–44 años",value:41,fill:"#E26500"},
      {range:"Gen X (1965–1980)",    age:"45–60 años",value:22,fill:"#0891b2"},
      {range:"Boomer (1946–1964)",   age:"61–79 años",value:9, fill:"#79716B"},
    ],
    jobRoles:[
      {role:"Product Manager",  value:24,fill:"#7D45A2"},
      {role:"Desarrollador",    value:19,fill:"#E26500"},
      {role:"Designer",         value:14,fill:"#db2777"},
      {role:"CEO / Founder",    value:11,fill:"#0C0A09"},
      {role:"Marketing",        value:10,fill:"#ea580c"},
      {role:"Customer Success", value:9, fill:"#0891b2"},
      {role:"Ventas",           value:7, fill:"#00975C"},
      {role:"Otros",            value:6, fill:"#A6A09B"},
    ],
    plans:[
      {name:"Free",value:31,fill:BDS.neutral[400]},{name:"Pro",value:44,fill:BDS.primary[500]},
      {name:"Team",value:18,fill:"#7D45A2"},{name:"Enterprise",value:7,fill:BDS.secondary[950]},
    ],
    planTrend:[
      {week:"S1", Free:18, Pro:22, Team:8,  Enterprise:2},
      {week:"S2", Free:24, Pro:38, Team:12, Enterprise:3},
      {week:"S3", Free:31, Pro:55, Team:15, Enterprise:4},
      {week:"S4", Free:22, Pro:48, Team:11, Enterprise:5},
      {week:"S5", Free:35, Pro:72, Team:20, Enterprise:6},
      {week:"S6", Free:28, Pro:65, Team:18, Enterprise:4},
      {week:"S7", Free:40, Pro:88, Team:24, Enterprise:7},
      {week:"S8", Free:33, Pro:95, Team:28, Enterprise:9},
      {week:"S9", Free:29, Pro:82, Team:22, Enterprise:8},
    ],
  };

  const typeData = {
    NPS:{
      score:{ value:35, label:"NPS Score", accent:"#00975C" },
      segments:[
        {name:"Promotores",value:52,fill:"#00AF6E"},
        {name:"Pasivos",   value:29,fill:"#f59e0b"},
        {name:"Detractores",value:19,fill:"#E85854"},
      ],
      distribution:[
        {score:"0",pct:3,fill:"#E85854"},{score:"1",pct:2,fill:"#E85854"},
        {score:"2",pct:3,fill:"#E85854"},{score:"3",pct:4,fill:"#E85854"},
        {score:"4",pct:4,fill:"#E85854"},{score:"5",pct:3,fill:"#E85854"},
        {score:"6",pct:4,fill:"#E85854"},{score:"7",pct:14,fill:"#f59e0b"},
        {score:"8",pct:15,fill:"#f59e0b"},{score:"9",pct:22,fill:"#00AF6E"},
        {score:"10",pct:30,fill:"#00AF6E"},
      ],
    },
    CES:{
      score:{ value:"3.8", label:"CES Score", accent:"#E26500" },
      trend:[
        {week:"S1",score:3.2},{week:"S2",score:3.5},{week:"S3",score:3.3},
        {week:"S4",score:3.7},{week:"S5",score:3.8},{week:"S6",score:4.0},
      ],
      distribution:[
        {label:"Muy difícil",value:8, fill:"#E85854"},
        {label:"Difícil",    value:12,fill:"#f97316"},
        {label:"Neutral",    value:20,fill:"#f59e0b"},
        {label:"Fácil",      value:35,fill:"#84cc16"},
        {label:"Muy fácil",  value:25,fill:"#00AF6E"},
      ],
    },
    CSAT:{
      score:{ value:"82%", label:"CSAT Score", accent:"#7D45A2" },
      satisfaction:[
        {name:"Muy satisfecho",value:42,fill:"#00AF6E"},
        {name:"Satisfecho",    value:33,fill:"#84cc16"},
        {name:"Neutral",       value:13,fill:"#f59e0b"},
        {name:"Insatisfecho",  value:8, fill:"#f97316"},
        {name:"Muy insatisfecho",value:4,fill:"#E85854"},
      ],
      trend:[
        {week:"S1",pct:74},{week:"S2",pct:78},{week:"S3",pct:75},
        {week:"S4",pct:80},{week:"S5",pct:82},{week:"S6",pct:85},
      ],
    },
    PMF:{
      score:{ value:"67%", label:"Must-have", accent:"#db2777" },
      dimensions:[
        {subject:"Necesidad",A:67},{subject:"Frecuencia",A:78},
        {subject:"Willingness to pay",A:54},{subject:"Recomendación",A:71},{subject:"Alternativa",A:45},
      ],
      mustHave:[
        {label:"Muy decepcionado",value:67,fill:"#db2777"},
        {label:"Algo decepcionado",value:22,fill:"#f9a8d4"},
        {label:"No decepcionado",  value:11,fill:"#E7E5E4"},
      ],
    },
    CCR:{
      score:{ value:"14%", label:"Churn Rate", accent:"#ea580c" },
      reasons:[
        {reason:"Precio alto",       value:31,fill:"#E85854"},
        {reason:"Faltaban funciones",value:24,fill:"#f97316"},
        {reason:"Mejor alternativa", value:19,fill:"#f59e0b"},
        {reason:"Ya no lo necesito", value:15,fill:"#94a3b8"},
        {reason:"Problemas técnicos",value:7, fill:"#64748b"},
        {reason:"Otro",              value:4, fill:"#cbd5e1"},
      ],
      churnTrend:[
        {month:"Oct",pct:18},{month:"Nov",pct:16},{month:"Dic",pct:15},
        {month:"Ene",pct:14},{month:"Feb",pct:13},{month:"Mar",pct:14},
      ],
    },
    Open:{
      score:null,
      themes:[
        {theme:"UX / Navegación",count:89,sentiment:"positive"},
        {theme:"Performance",    count:62,sentiment:"negative"},
        {theme:"Funcionalidades",count:54,sentiment:"positive"},
        {theme:"Onboarding",     count:41,sentiment:"neutral"},
        {theme:"Precio",         count:28,sentiment:"negative"},
      ],
    },
    Interview:{
      score:null,
      themes:[
        {theme:"Flujo de trabajo",count:12,sentiment:"positive"},
        {theme:"Pain points clave",count:9,sentiment:"negative"},
        {theme:"Integraciones",   count:7,sentiment:"neutral"},
        {theme:"Expectativas",    count:6,sentiment:"positive"},
      ],
    },
  };

  return { ...base, ...(typeData[survey.type] || {}) };
};

// ─── AI SURVEY GENERATOR ──────────────────────────────────────────────────────
async function generateSurveyWithAI(prompt) {
  const systemPrompt = `Eres un experto en diseño de encuestas de producto. Dado el contexto del usuario, debes identificar el tipo de encuesta más adecuado y generar las preguntas.

Tipos disponibles: NPS, CES, CSAT, PMF, CCR (Churn), Open, Interview

Responde SOLO en JSON, sin texto extra, sin backticks. Formato exacto:
{"type":"NPS","name":"Nombre sugerido","rationale":"Por qué elegiste este tipo (1-2 oraciones)","questions":[{"id":1,"text":"Texto de la pregunta","type":"scale|text|choice|nps","required":true,"options":[]}]}

Para NPS: 1-3 preguntas, siempre incluye la pregunta de recomendación 0-10.
Para CES: 2-5 preguntas de esfuerzo del cliente.
Para CSAT: 1-3 preguntas de satisfacción.
Para PMF: 4-7 preguntas profundas sobre ajuste mercado-producto.
Para CCR: 4-6 preguntas para entender la razón de abandono.
Para Open: 1-2 preguntas abiertas.
Para Interview: 8-12 preguntas profundas para entrevistas.

Si el tipo es scale o nps, NO incluyas el campo options. Si el tipo es choice, incluye el campo options con array de strings.`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({
      model:"claude-sonnet-4-20250514", max_tokens:1000,
      system:systemPrompt,
      messages:[{ role:"user", content:prompt }],
    }),
  });
  const data = await response.json();
  const text = data.content?.find(b=>b.type==="text")?.text || "{}";
  return JSON.parse(text.replace(/```json|```/g,"").trim());
}

// ─── MINI COMPONENTS ─────────────────────────────────────────────────────────
const TypeTag = ({ type }) => {
  const t = SURVEY_TYPES[type] || { abbr:type, color:"#79716B", bg:"#FAFAF9" };
  return (
    <span style={{ display:"inline-flex", alignItems:"center", fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:4, background:t.bg, color:t.color, fontFamily:"'DM Mono', monospace", letterSpacing:"0.06em" }}>
      {t.abbr}
    </span>
  );
};

const StatusBadge = ({ status }) => {
  const s = STATUS_CFG[status] || STATUS_CFG.draft;
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:4, fontSize:12, fontWeight:600, padding:"4px 10px", borderRadius:99, background:s.bg, color:s.color, border:`1px solid ${s.border}` }}>
      <span style={{ width:6, height:6, borderRadius:"50%", flexShrink:0, background:s.color }}/>
      {s.label}
    </span>
  );
};

const MetricCard = ({ label, value, sub, accent }) => (
  <div style={{
    background:BDS.neutral["000"], borderRadius:12,
    border:`1px solid ${T.borderSoft}`,
    padding:"14px 20px", flex:1, minWidth:130,
    boxShadow:"0 1px 2px rgba(12,10,9,0.04)",
  }}>
    <p style={{ fontSize:11, color:T.textMuted, textTransform:"uppercase", letterSpacing:"0.08em", fontWeight:600, marginBottom:8 }}>{label}</p>
    <p style={{ fontSize:26, fontWeight:800, color:accent||T.textPrimary, fontFamily:"'DM Mono', monospace", lineHeight:1, margin:0 }}>{value}</p>
    {sub && <p style={{ fontSize:11, color:T.textMuted, marginTop:6, margin:0 }}>{sub}</p>}
  </div>
);

const ChartCard = ({ title, children, cols=1 }) => (
  <div style={{
    background:BDS.neutral["000"], borderRadius:12,
    border:`1px solid ${T.borderSoft}`,
    padding:"18px 20px", gridColumn:`span ${cols}`,
    boxShadow:"0 1px 2px rgba(12,10,9,0.04)",
  }}>
    <p style={{ fontSize:11, color:T.textMuted, textTransform:"uppercase", letterSpacing:"0.08em", fontWeight:600, marginBottom:14, margin:"0 0 14px" }}>{title}</p>
    {children}
  </div>
);

const ChartTooltip = ({ active, payload, label, unit="" }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:"#fff", border:"1px solid rgba(12,10,9,0.10)", borderRadius:8, boxShadow:"0 4px 12px rgba(0,0,0,0.1)", padding:"8px 12px" }}>
      {label && <p style={{ fontSize:12, color:"#A6A09B", margin:"0 0 4px" }}>{label}</p>}
      {payload.map((p,i) => (
        <p key={i} style={{ fontSize:14, fontWeight:700, color:p.color||"#0C0A09", fontFamily:"'DM Mono', monospace", margin:0 }}>
          {p.name}: {p.value}{unit}
        </p>
      ))}
    </div>
  );
};

// ─── TABLE PAGINATION ─────────────────────────────────────────────────────────
const PAGE_SIZE_OPTIONS = [25, 50, 100];

const TablePagination = ({ total, page, pageSize, onPageChange, onPageSizeChange }) => {
  // Hide pagination when total records fit in a single default page
  if (total <= 25) return null;

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);
    if (start > 1) { pages.push(1); if (start > 2) pages.push("..."); }
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages) { if (end < totalPages - 1) pages.push("..."); pages.push(totalPages); }
    return pages;
  };

  const btnBase = {
    display:"inline-flex", alignItems:"center", justifyContent:"center",
    minWidth:32, height:32, borderRadius:6, border:"none", cursor:"pointer",
    fontSize:12, fontWeight:600, fontFamily:"'DM Mono', monospace",
    transition:"all 0.15s",
  };

  return (
    <div style={{
      display:"flex", alignItems:"center", justifyContent:"space-between",
      padding:"12px 16px", borderTop:`1px solid ${T.borderSoft}`,
      background:BDS.neutral[50],
      position:"sticky", bottom:0, zIndex:10,
    }}>
      {/* Left: page size selector */}
      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
        <span style={{ fontSize:12, color:T.textMuted }}>Mostrar</span>
        <div style={{ display:"flex", gap:2 }}>
          {PAGE_SIZE_OPTIONS.map(size => (
            <button key={size} onClick={() => onPageSizeChange(size)}
              style={{
                ...btnBase,
                minWidth:36,
                background: pageSize === size ? BDS.secondary[950] : BDS.neutral["000"],
                color: pageSize === size ? "#fff" : BDS.neutral[500],
                boxShadow: pageSize === size ? "none" : `0 0 0 1px ${T.borderSoft}`,
              }}>
              {size}
            </button>
          ))}
        </div>
        <span style={{ fontSize:12, color:T.textMuted }}>por página</span>
      </div>

      {/* Center: info */}
      <span style={{ fontSize:12, color:T.textMuted, fontFamily:"'DM Mono', monospace" }}>
        {total === 0 ? "Sin resultados" : `${from}–${to} de ${total}`}
      </span>

      {/* Right: page navigation */}
      <div style={{ display:"flex", alignItems:"center", gap:4 }}>
        <button onClick={() => onPageChange(page - 1)} disabled={page <= 1}
          style={{ ...btnBase, background:"transparent", color: page <= 1 ? BDS.neutral[200] : T.textMuted, cursor: page <= 1 ? "not-allowed" : "pointer" }}>
          ‹
        </button>
        {getPageNumbers().map((p, i) =>
          p === "..." ? (
            <span key={`dots-${i}`} style={{ ...btnBase, background:"transparent", color:T.textMuted, cursor:"default" }}>…</span>
          ) : (
            <button key={p} onClick={() => onPageChange(p)}
              style={{
                ...btnBase,
                background: p === page ? BDS.primary[500] : "transparent",
                color: p === page ? "#fff" : T.textMuted,
                boxShadow: p === page ? "0 1px 4px rgba(226,101,0,0.3)" : "none",
              }}>
              {p}
            </button>
          )
        )}
        <button onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}
          style={{ ...btnBase, background:"transparent", color: page >= totalPages ? BDS.neutral[200] : T.textMuted, cursor: page >= totalPages ? "not-allowed" : "pointer" }}>
          ›
        </button>
      </div>
    </div>
  );
};

// ─── REACH BAR — universal ────────────────────────────────────────────────────
const ReachBar = ({ reach }) => {
  const { visitors, respondents } = reach;
  const notResponded = visitors - respondents;
  const notPct  = Math.round((notResponded / visitors) * 100);
  const respPct = 100 - notPct;

  // Segment widths — minimum 8% so the label always fits
  const leftPct  = Math.max(notPct, 8);
  const rightPct = 100 - leftPct;

  const ORANGE  = BDS.primary[500];   // #E26500
  const EMERALD = BDS.emerald[600];   // #00975C

  return (
    <div style={{
      background: BDS.neutral["000"],
      borderRadius: 12,
      border: `1px solid ${T.borderSoft}`,
      padding: "20px 24px 18px",
      marginBottom: 16,
      boxShadow: "0 1px 2px rgba(12,10,9,0.04)",
    }}>
      <p style={{ fontSize:11, color:T.textMuted, textTransform:"uppercase", letterSpacing:"0.08em", fontWeight:600, margin:"0 0 16px" }}>
        Alcance del survey
      </p>

      {/* Stat numbers — aligned over their respective bar segments */}
      <div style={{ display:"flex", marginBottom:10 }}>
        {/* Left stat — proportional width to match bar segment */}
        <div style={{ width:`${leftPct}%`, flexShrink:0 }}>
          <p style={{ fontSize:28, fontWeight:800, color:T.textPrimary, fontFamily:"'DM Mono', monospace", lineHeight:1, margin:0 }}>
            {visitors.toLocaleString()}
          </p>
          <p style={{ fontSize:11, color:T.textMuted, margin:"3px 0 0" }}>Usuarios únicos vistos</p>
        </div>
        {/* Right stat */}
        <div style={{ flex:1 }}>
          <p style={{ fontSize:28, fontWeight:800, color:T.textPrimary, fontFamily:"'DM Mono', monospace", lineHeight:1, margin:0 }}>
            {respondents.toLocaleString()}
          </p>
          <p style={{ fontSize:11, color:T.textMuted, margin:"3px 0 0" }}>Respuestas enviadas</p>
        </div>
      </div>

      {/* Single split bar — orange left (not responded) | emerald right (responded) */}
      <div style={{ display:"flex", height:36, borderRadius:8, overflow:"hidden", gap:2 }}>
        {/* Left segment: no respondieron — orange */}
        <div style={{
          width: `${leftPct}%`,
          background: ORANGE,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}>
          <span style={{ fontSize:13, fontWeight:800, color:"#fff", fontFamily:"'DM Mono', monospace" }}>
            {notResponded.toLocaleString()}
          </span>
        </div>
        {/* Right segment: respondieron — emerald */}
        <div style={{
          flex: 1,
          background: EMERALD,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <span style={{ fontSize:13, fontWeight:800, color:"#fff", fontFamily:"'DM Mono', monospace" }}>
            {respondents.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display:"flex", justifyContent:"center", gap:20, marginTop:10 }}>
        <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:T.textMuted }}>
          <span style={{ width:10, height:10, borderRadius:"50%", background:ORANGE, flexShrink:0 }}/>
          Vistos ({notPct}%)
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:T.textMuted }}>
          <span style={{ width:10, height:10, borderRadius:"50%", background:EMERALD, flexShrink:0 }}/>
          Respondieron ({respPct}%)
        </div>
      </div>
    </div>
  );
};

// ─── NPS SCORE BAR ────────────────────────────────────────────────────────────
const NPSScoreBar = ({ segments, score }) => {
  const zones = [
    { label:"Malo",     range:"0–6",  pct:segments.find(s=>s.name==="Detractores")?.value||19, color:"#E85854", bg:"#FFF0EE", text:"#b91c1c" },
    { label:"Neutral",  range:"7–8",  pct:segments.find(s=>s.name==="Pasivos")?.value||29,     color:"#f59e0b", bg:"#fffbeb", text:"#b45309" },
    { label:"Excelente",range:"9–10", pct:segments.find(s=>s.name==="Promotores")?.value||52,  color:"#00AF6E", bg:"#EAFAF1", text:"#15803d" },
  ];
  const dominant = zones.reduce((a,b) => a.pct>b.pct ? a : b);

  return (
    <ChartCard title="NPS Score global">
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
        <div>
          <div style={{ display:"flex", alignItems:"flex-end", gap:8 }}>
            <span style={{ fontSize:48, fontWeight:900, color:"#0C0A09", fontFamily:"'DM Mono', monospace", lineHeight:1 }}>{score}</span>
            <span style={{ fontSize:14, color:"#A6A09B", marginBottom:4 }}>/ +100</span>
          </div>
          <p style={{ fontSize:12, color:"#A6A09B", marginTop:4 }}>
            La mayoría de tus customers están en{" "}
            <span style={{ fontWeight:700, color:dominant.text }}>{dominant.label}</span>
          </p>
        </div>
        <div style={{ display:"flex", gap:12 }}>
          {zones.map(z => (
            <div key={z.label} style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"10px 16px", borderRadius:12, border:`1px solid ${z.color}30`, background:z.bg }}>
              <span style={{ fontSize:20, fontWeight:900, color:z.color, fontFamily:"'DM Mono', monospace", lineHeight:1 }}>{z.pct}%</span>
              <span style={{ fontSize:12, fontWeight:600, marginTop:4, color:z.text }}>{z.label}</span>
              <span style={{ fontSize:10, color:"#A6A09B", marginTop:2 }}>({z.range})</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ position:"relative", height:32, display:"flex", borderRadius:12, overflow:"hidden", gap:2 }}>
        {zones.map((z,i) => (
          <div key={z.label} style={{
            display:"flex", alignItems:"center", justifyContent:"center", position:"relative", transition:"all 0.2s",
            width:`${z.pct}%`, background:z.color,
            opacity:z.label===dominant.label ? 1 : 0.5,
            borderRadius:i===0?"8px 0 0 8px":i===zones.length-1?"0 8px 8px 0":0,
          }}>
            {z.pct>12 && <span style={{ color:"#fff", fontSize:12, fontWeight:700, fontFamily:"'DM Mono', monospace" }}>{z.pct}%</span>}
            {z.label===dominant.label && <span style={{ position:"absolute", top:-2, left:"50%", transform:"translateX(-50%)", width:6, height:6, borderRadius:"50%", background:"#fff", boxShadow:"0 1px 2px rgba(0,0,0,0.15)" }}/>}
          </div>
        ))}
      </div>
      <div style={{ display:"flex", marginTop:8 }}>
        {zones.map(z => (
          <div key={z.label} style={{ display:"flex", flexDirection:"column", alignItems:"center", width:`${z.pct}%` }}>
            <span style={{ fontSize:10, color:"#A6A09B", fontWeight:500 }}>{z.label}</span>
          </div>
        ))}
      </div>
    </ChartCard>
  );
};

// ─── TYPE-SPECIFIC CHARTS ─────────────────────────────────────────────────────
const NPSCharts = ({ d }) => (
  <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
    {/* Row 1: NPS Score + Distribution side by side */}
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
      <NPSScoreBar segments={d.segments} score={d.score.value}/>
      <ChartCard title="Distribución de puntajes (0–10)">
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={d.distribution} margin={{ top:4,right:4,bottom:0,left:-20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false}/>
            <XAxis dataKey="score" tick={{ fill:"#94a3b8",fontSize:11 }} axisLine={false} tickLine={false}/>
            <YAxis tick={{ fill:"#94a3b8",fontSize:11 }} axisLine={false} tickLine={false} unit="%"/>
            <Tooltip content={<ChartTooltip unit="%"/>}/>
            <Bar dataKey="pct" name="Respuestas" radius={[4,4,0,0]}>
              {d.distribution.map((e,i) => <Cell key={i} fill={e.fill}/>)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  </div>
);

const CESCharts = ({ d }) => (
  <div className="grid grid-cols-2 gap-4">
    <ChartCard title="Tendencia de esfuerzo">
      <ResponsiveContainer width="100%" height={150}>
        <AreaChart data={d.trend} margin={{ top:4,right:4,bottom:0,left:-20 }}>
          <defs>
            <linearGradient id="cesGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#E26500" stopOpacity={0.15}/>
              <stop offset="95%" stopColor="#E26500" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false}/>
          <XAxis dataKey="week" tick={{ fill:"#94a3b8",fontSize:11 }} axisLine={false} tickLine={false}/>
          <YAxis domain={[1,5]} tick={{ fill:"#94a3b8",fontSize:11 }} axisLine={false} tickLine={false}/>
          <Tooltip content={<ChartTooltip/>}/>
          <Area type="monotone" dataKey="score" name="CES" stroke="#E26500" fill="url(#cesGrad)" strokeWidth={2.5} dot={{ fill:"#E26500",r:3 }}/>
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
    <ChartCard title="Distribución por nivel de esfuerzo">
      <ResponsiveContainer width="100%" height={150}>
        <BarChart data={d.distribution} margin={{ top:4,right:4,bottom:0,left:-20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false}/>
          <XAxis dataKey="label" tick={{ fill:"#94a3b8",fontSize:10 }} axisLine={false} tickLine={false}/>
          <YAxis tick={{ fill:"#94a3b8",fontSize:11 }} axisLine={false} tickLine={false} unit="%"/>
          <Tooltip content={<ChartTooltip unit="%"/>}/>
          <Bar dataKey="value" name="Usuarios" radius={[4,4,0,0]}>
            {d.distribution.map((e,i) => <Cell key={i} fill={e.fill}/>)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  </div>
);

const CSATCharts = ({ d }) => (
  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
    <ChartCard title="Nivel de satisfacción">
      <ResponsiveContainer width="100%" height={150}>
        <PieChart>
          <Pie data={d.satisfaction} cx="50%" cy="50%" innerRadius={44} outerRadius={64} dataKey="value" paddingAngle={2}>
            {d.satisfaction.map((e,i) => <Cell key={i} fill={e.fill}/>)}
          </Pie>
          <Tooltip content={<ChartTooltip unit="%"/>}/>
        </PieChart>
      </ResponsiveContainer>
      <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:12, marginTop:4 }}>
        {d.satisfaction.map(e => (
          <div key={e.name} style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:"#79716B" }}>
            <span style={{ width:8, height:8, borderRadius:2, flexShrink:0, background:e.fill }}/>
            {e.name} <span style={{ fontWeight:700, color:"#44403B" }}>{e.value}%</span>
          </div>
        ))}
      </div>
    </ChartCard>
    <ChartCard title="Tendencia CSAT">
      <ResponsiveContainer width="100%" height={150}>
        <AreaChart data={d.trend} margin={{ top:4,right:4,bottom:0,left:-20 }}>
          <defs>
            <linearGradient id="csatGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#7D45A2" stopOpacity={0.15}/>
              <stop offset="95%" stopColor="#7D45A2" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false}/>
          <XAxis dataKey="week" tick={{ fill:"#94a3b8",fontSize:11 }} axisLine={false} tickLine={false}/>
          <YAxis domain={[60,100]} tick={{ fill:"#94a3b8",fontSize:11 }} axisLine={false} tickLine={false} unit="%"/>
          <Tooltip content={<ChartTooltip unit="%"/>}/>
          <Area type="monotone" dataKey="pct" name="CSAT" stroke="#7D45A2" fill="url(#csatGrad)" strokeWidth={2.5} dot={{ fill:"#7D45A2",r:3 }}/>
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  </div>
);

const PMFCharts = ({ d }) => (
  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
    <ChartCard title="Dimensiones de PMF">
      <ResponsiveContainer width="100%" height={180}>
        <RadarChart data={d.dimensions}>
          <PolarGrid stroke="#f1f5f9"/>
          <PolarAngleAxis dataKey="subject" tick={{ fill:"#94a3b8",fontSize:11 }}/>
          <Radar name="PMF" dataKey="A" stroke="#db2777" fill="#db2777" fillOpacity={0.15} strokeWidth={2}/>
          <Tooltip content={<ChartTooltip unit="%"/>}/>
        </RadarChart>
      </ResponsiveContainer>
    </ChartCard>
    <ChartCard title='Segmento "must-have"'>
      <ResponsiveContainer width="100%" height={150}>
        <PieChart>
          <Pie data={d.mustHave} cx="50%" cy="50%" innerRadius={44} outerRadius={64} dataKey="value" paddingAngle={2}>
            {d.mustHave.map((e,i) => <Cell key={i} fill={e.fill}/>)}
          </Pie>
          <Tooltip content={<ChartTooltip unit="%"/>}/>
        </PieChart>
      </ResponsiveContainer>
      <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:12, marginTop:4 }}>
        {d.mustHave.map(e => (
          <div key={e.label} style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:"#79716B" }}>
            <span style={{ width:8, height:8, borderRadius:2, flexShrink:0, background:e.fill }}/>
            {e.label} <span style={{ fontWeight:700, color:"#44403B" }}>{e.value}%</span>
          </div>
        ))}
      </div>
    </ChartCard>
  </div>
);

const CCRCharts = ({ d }) => (
  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
    <ChartCard title="Razones de cancelación">
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={d.reasons} layout="vertical" margin={{ top:0,right:20,bottom:0,left:10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false}/>
          <XAxis type="number" tick={{ fill:"#94a3b8",fontSize:11 }} axisLine={false} tickLine={false} unit="%"/>
          <YAxis dataKey="reason" type="category" tick={{ fill:"#94a3b8",fontSize:11 }} axisLine={false} tickLine={false} width={100}/>
          <Tooltip content={<ChartTooltip unit="%"/>}/>
          <Bar dataKey="value" name="Usuarios" radius={[0,4,4,0]}>
            {d.reasons.map((e,i) => <Cell key={i} fill={e.fill}/>)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
    <ChartCard title="Tendencia de churn">
      <ResponsiveContainer width="100%" height={150}>
        <AreaChart data={d.churnTrend} margin={{ top:4,right:4,bottom:0,left:-20 }}>
          <defs>
            <linearGradient id="ccrGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#ea580c" stopOpacity={0.15}/>
              <stop offset="95%" stopColor="#ea580c" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false}/>
          <XAxis dataKey="month" tick={{ fill:"#94a3b8",fontSize:11 }} axisLine={false} tickLine={false}/>
          <YAxis tick={{ fill:"#94a3b8",fontSize:11 }} axisLine={false} tickLine={false} unit="%"/>
          <Tooltip content={<ChartTooltip unit="%"/>}/>
          <Area type="monotone" dataKey="pct" name="Churn" stroke="#ea580c" fill="url(#ccrGrad)" strokeWidth={2.5} dot={{ fill:"#ea580c",r:3 }}/>
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  </div>
);

const OpenCharts = ({ d }) => (
  <ChartCard title="Temas identificados" cols={2}>
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      {d.themes.map((t,i) => {
        const sentColor = t.sentiment==="positive"?"#00975C":t.sentiment==="negative"?"#CB4644":"#d97706";
        const max = Math.max(...d.themes.map(x=>x.count));
        return (
          <div key={i} style={{ display:"flex", alignItems:"center", gap:12 }}>
            <span style={{ fontSize:12, fontWeight:500, color:"#57534D", width:144, flexShrink:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{t.theme}</span>
            <div style={{ flex:1, height:12, background:"#F5F5F4", borderRadius:99, overflow:"hidden" }}>
              <div style={{ height:"100%", borderRadius:99, transition:"all 0.3s", width:`${(t.count/max)*100}%`, background:sentColor, opacity:0.7 }}/>
            </div>
            <span style={{ fontSize:12, fontWeight:700, width:24, textAlign:"right", color:sentColor, fontFamily:"'DM Mono', monospace" }}>{t.count}</span>
            <span style={{ fontSize:10, padding:"2px 6px", borderRadius:4, fontWeight:600, width:64, textAlign:"center", flexShrink:0, background:`${sentColor}15`, color:sentColor }}>{t.sentiment}</span>
          </div>
        );
      })}
    </div>
  </ChartCard>
);

const InterviewCharts = ({ d }) => <OpenCharts d={d}/>;

const TypeCharts = ({ survey, d }) => {
  const map = { NPS:NPSCharts, CES:CESCharts, CSAT:CSATCharts, PMF:PMFCharts, CCR:CCRCharts, Open:OpenCharts, Interview:InterviewCharts };
  const Comp = map[survey.type];
  return Comp ? <Comp d={d}/> : null;
};

// ─── I18N / MULTILANG HELPER ─────────────────────────────────────────────────
// Truncates text for chart axes, preserving full text in tooltips
const truncLabel = (str, max=14) => str && str.length > max ? str.slice(0, max-1) + '…' : (str || '');
const RTL_REGEX = new RegExp('[\u0600-\u06FF\u0750-\u077F\u0590-\u05FF\u08A0-\u08FF]');
const isRTL = (str) => RTL_REGEX.test(str);

// ─── DEMOGRAPHICS TAB ────────────────────────────────────────────────────────
const HorizBarList = ({ data, labelKey, valueKey="value", colorKey="fill" }) => (
  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
    {data.map((r,i) => (
      <div key={i} style={{ display:"flex", alignItems:"center", gap:10 }}>
        <span style={{ fontSize:11, color:BDS.neutral[500], width:112, flexShrink:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{r[labelKey]}</span>
        <div style={{ flex:1, height:6, background:BDS.neutral[100], borderRadius:4, overflow:"hidden" }}>
          <div style={{ height:"100%", borderRadius:4, width:`${r[valueKey]}%`, background:r[colorKey], transition:"width 0.4s ease" }}/>
        </div>
        <span style={{ fontSize:11, fontWeight:700, width:32, textAlign:"right", flexShrink:0, fontFamily:"'DM Mono', monospace", color:r[colorKey] }}>{r[valueKey]}%</span>
      </div>
    ))}
  </div>
);

const DonutChart = ({ data, labelKey="name" }) => (
  <>
    <ResponsiveContainer width="100%" height={130}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={36} outerRadius={54} dataKey="value" paddingAngle={3}>
          {data.map((e,i) => <Cell key={i} fill={e.fill||e.color}/>)}
        </Pie>
        <Tooltip content={<ChartTooltip unit="%"/>}/>
      </PieChart>
    </ResponsiveContainer>
    <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:"4px 12px", marginTop:6 }}>
      {data.map(e => (
        <div key={e[labelKey]} style={{ display:"flex", alignItems:"center", gap:4, fontSize:11, color:BDS.neutral[500] }}>
          <span style={{ width:6, height:6, borderRadius:2, flexShrink:0, background:e.fill||e.color }}/>
          {e[labelKey]}
        </div>
      ))}
    </div>
  </>
);

const PLAN_COLORS = {
  Free: BDS.neutral[400],
  Pro: BDS.primary[500],
  Team: "#7D45A2",
  Enterprise: BDS.secondary[950],
};

const PlanLineChart = ({ data }) => (
  <>
    <ResponsiveContainer width="100%" height={150}>
      <LineChart data={data} margin={{ top:4, right:4, bottom:0, left:-20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={BDS.neutral[100]} vertical={false}/>
        <XAxis dataKey="week" tick={{ fill:BDS.neutral[400], fontSize:11 }} axisLine={false} tickLine={false}/>
        <YAxis tick={{ fill:BDS.neutral[400], fontSize:11 }} axisLine={false} tickLine={false}/>
        <Tooltip content={<ChartTooltip unit=" resp."/>}/>
        {Object.entries(PLAN_COLORS).map(([plan, color]) => (
          <Line key={plan} type="monotone" dataKey={plan} name={plan}
            stroke={color} strokeWidth={2} dot={false} activeDot={{ r:4, fill:color }}/>
        ))}
      </LineChart>
    </ResponsiveContainer>
    <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:"4px 14px", marginTop:6 }}>
      {Object.entries(PLAN_COLORS).map(([plan, color]) => (
        <div key={plan} style={{ display:"flex", alignItems:"center", gap:4, fontSize:11, color:BDS.neutral[500] }}>
          <span style={{ width:16, height:2, borderRadius:2, flexShrink:0, background:color }}/>
          {plan}
        </div>
      ))}
    </div>
  </>
);

const DemographicsTab = ({ d }) => {
  const maxCountry = Math.max(...d.countries.map(c=>c.value));

  const cardStyle = { background:BDS.neutral["000"], borderRadius:12, border:`1px solid ${T.borderSoft}`, padding:"18px 20px", boxShadow:"0 1px 3px rgba(12,10,9,0.04)" };
  const labelStyle = { fontSize:11, fontWeight:700, color:T.textMuted, textTransform:"uppercase", letterSpacing:"0.08em", margin:"0 0 12px" };

  // Chart 1 — Género: Segmented horizontal bar
  const GenderBar = () => {
    const total = d.gender.reduce((s,g) => s + g.value, 0);
    return (
      <div>
        <div style={{ display:"flex", height:28, borderRadius:6, overflow:"hidden", marginBottom:10 }}>
          {d.gender.map((g,i) => (
            <div key={i} style={{ width:`${(g.value/total)*100}%`, background:g.fill, transition:"width 0.3s", position:"relative", display:"flex", alignItems:"center", justifyContent:"center" }}>
              {g.value >= 10 && <span style={{ fontSize:10, fontWeight:700, color:"#fff", fontFamily:"'DM Mono', monospace" }}>{g.value}%</span>}
            </div>
          ))}
        </div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:"4px 12px" }}>
          {d.gender.map(e => (
            <div key={e.name} style={{ display:"flex", alignItems:"center", gap:4, fontSize:11, color:T.textMuted }}>
              <span style={{ width:6, height:6, borderRadius:2, background:e.fill, flexShrink:0 }}/>
              {e.name}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Chart 3 — Dispositivo: Segmented horizontal bar (like gender but vertical stack)
  const DeviceBar = () => {
    const total = d.devices.reduce((s,dev) => s + dev.value, 0);
    return (
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {d.devices.map(dev => (
          <div key={dev.name}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
              <span style={{ fontSize:12, fontWeight:600, color:T.textPrimary }}>{dev.name}</span>
              <span style={{ fontSize:12, fontWeight:700, color:dev.fill, fontFamily:"'DM Mono', monospace" }}>{dev.value}%</span>
            </div>
            <div style={{ height:8, background:BDS.neutral[100], borderRadius:4, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${(dev.value/total)*100}%`, background:dev.fill, borderRadius:4, transition:"width 0.3s" }}/>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Chart 5 — Cargo/Rol: Ranked list with position numbers
  const RoleRanked = () => {
    const maxRole = Math.max(...d.jobRoles.map(j=>j.value));
    return (
      <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
        {d.jobRoles.map((j, i) => (
          <div key={j.role} style={{ display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ fontSize:10, fontWeight:700, color:BDS.neutral[300], fontFamily:"'DM Mono', monospace", width:14, textAlign:"right", flexShrink:0 }}>{i+1}</span>
            <div style={{ width:4, height:4, borderRadius:"50%", background:j.fill, flexShrink:0 }}/>
            <span style={{ fontSize:11, color:T.textPrimary, flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{j.role}</span>
            <div style={{ width:48, height:4, background:BDS.neutral[100], borderRadius:2, overflow:"hidden", flexShrink:0 }}>
              <div style={{ height:"100%", width:`${(j.value/maxRole)*100}%`, background:j.fill, borderRadius:2 }}/>
            </div>
            <span style={{ fontSize:11, fontWeight:700, color:j.fill, fontFamily:"'DM Mono', monospace", width:28, textAlign:"right", flexShrink:0 }}>{j.value}%</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

      {/* Row 1 — 3 cols: Género · Grupos de edad · Dispositivo */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>

        <div style={cardStyle}>
          <p style={labelStyle}>Género</p>
          <GenderBar/>
        </div>

        <div style={cardStyle}>
          <p style={labelStyle}>Grupos de edad</p>
          <ResponsiveContainer width="100%" height={130}>
            <PieChart>
              <Pie data={d.ageGroups} cx="50%" cy="50%" innerRadius={36} outerRadius={54} dataKey="value" paddingAngle={3} nameKey="age">
                {d.ageGroups.map((e,i) => <Cell key={i} fill={e.fill}/>)}
              </Pie>
              <Tooltip content={<ChartTooltip unit="%"/>}/>
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:"4px 10px", marginTop:6 }}>
            {d.ageGroups.map(e => (
              <div key={e.age} style={{ display:"flex", alignItems:"center", gap:4, fontSize:10, color:T.textMuted }}>
                <span style={{ width:6, height:6, borderRadius:2, background:e.fill, flexShrink:0 }}/>
                {e.age}
              </div>
            ))}
          </div>
        </div>

        <div style={cardStyle}>
          <p style={labelStyle}>Dispositivo</p>
          <DeviceBar/>
        </div>
      </div>

      {/* Row 2 — 3 cols: País · Cargo/Rol · Respuestas por plan */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>

        <div style={cardStyle}>
          <p style={labelStyle}>País</p>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {d.countries.map(c => (
              <div key={c.name} style={{ display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ fontSize:11, color:T.textMuted, width:80, flexShrink:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.name}</span>
                <div style={{ flex:1, height:6, background:BDS.neutral[100], borderRadius:4, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${(c.value/maxCountry)*100}%`, background:c.color, borderRadius:4, transition:"width 0.3s ease" }}/>
                </div>
                <span style={{ fontSize:11, fontWeight:700, color:c.color, fontFamily:"'DM Mono', monospace", width:32, textAlign:"right", flexShrink:0 }}>{c.value}%</span>
              </div>
            ))}
          </div>
        </div>

        <div style={cardStyle}>
          <p style={labelStyle}>Cargo / Rol</p>
          <RoleRanked/>
        </div>

        <div style={cardStyle}>
          <p style={labelStyle}>Respuestas por plan</p>
          <ResponsiveContainer width="100%" height={130}>
            <PieChart>
              <Pie data={d.plans} cx="50%" cy="50%" innerRadius={36} outerRadius={54} dataKey="value" paddingAngle={3}>
                {d.plans.map((e,i) => <Cell key={i} fill={e.fill}/>)}
              </Pie>
              <Tooltip content={<ChartTooltip unit="%"/>}/>
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:"4px 10px", marginTop:6 }}>
            {d.plans.map(e => (
              <div key={e.name} style={{ display:"flex", alignItems:"center", gap:4, fontSize:11, color:T.textMuted }}>
                <span style={{ width:6, height:6, borderRadius:2, background:e.fill, flexShrink:0 }}/>
                {e.name} ({e.value}%)
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── RESPONDENTS TABLE ────────────────────────────────────────────────────────
const QTYPE_CFG_INLINE = {
  nps:    { label:"NPS",         bg:"#EAFAF1", color:"#00975C" },
  scale:  { label:"Escala 1–5",  bg:"#EBF7FF", color:"#0066B3" },
  text:   { label:"Texto libre", bg:"#FFF7ED", color:"#ea580c" },
  choice: { label:"Opciones",    bg:"#FAF5FF", color:"#7D45A2" },
};

// NPS visual: colored dots 0-10, selected highlighted
const NpsAnswer = ({ value }) => (
  <div style={{ display:"flex", gap:3, flexWrap:"wrap" }}>
    {Array.from({length:11},(_,i) => {
      const active = i === value;
      const col = i<=6 ? "#CB4644" : i<=8 ? "#d97706" : "#00975C";
      return (
        <div key={i} style={{
          width:28, height:28, borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center",
          background: active ? col : BDS.neutral[100],
          border: active ? "none" : `1px solid ${T.borderSoft}`,
          fontFamily:"'DM Mono', monospace", fontSize:11, fontWeight:700,
          color: active ? "#fff" : T.textMuted,
          flexShrink:0,
        }}>{i}</div>
      );
    })}
    <p style={{ width:"100%", fontSize:10, color:T.textMuted, margin:"4px 0 0" }}>
      {value <= 6 ? "Detractor" : value <= 8 ? "Pasivo" : "Promotor"}
    </p>
  </div>
);

// Scale visual: 1-5 bar with selected segment highlighted
const ScaleAnswer = ({ value }) => (
  <div style={{ display:"flex", gap:3 }}>
    {Array.from({length:5},(_,i) => {
      const v = i+1;
      const active = v === value;
      const col = v <= 2 ? "#CB4644" : v === 3 ? "#d97706" : "#00975C";
      return (
        <div key={v} style={{
          flex:1, height:32, borderRadius:5, display:"flex", alignItems:"center", justifyContent:"center",
          background: active ? col : BDS.neutral[100],
          border: active ? "none" : `1px solid ${T.borderSoft}`,
          fontFamily:"'DM Mono', monospace", fontSize:11, fontWeight:700,
          color: active ? "#fff" : T.textMuted,
        }}>{v}</div>
      );
    })}
  </div>
);

// Choice visual: list of options, selected highlighted
const ChoiceAnswer = ({ value, options }) => (
  <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
    {options.map(opt => {
      const active = opt === value;
      return (
        <div key={opt} style={{
          display:"flex", alignItems:"center", gap:8, padding:"7px 10px", borderRadius:6,
          background: active ? BDS.primary[50] : BDS.neutral[50],
          border: active ? `1px solid ${BDS.primary[200]}` : `1px solid ${T.borderSoft}`,
        }}>
          <div style={{
            width:14, height:14, borderRadius:"50%", flexShrink:0,
            border: active ? `2px solid ${BDS.primary[500]}` : `2px solid ${BDS.neutral[300]}`,
            background: active ? BDS.primary[500] : "transparent",
            display:"flex", alignItems:"center", justifyContent:"center",
          }}>
            {active && <div style={{ width:4, height:4, borderRadius:"50%", background:"#fff" }}/>}
          </div>
          <span style={{ fontSize:12, color: active ? BDS.primary[700] : T.textPrimary, fontWeight: active ? 600 : 400 }}>{opt}</span>
        </div>
      );
    })}
  </div>
);

// Text visual: bubble quote
const TextAnswer = ({ value }) => (
  <div style={{
    background:BDS.neutral[50], borderRadius:8, padding:"10px 14px",
    border:`1px solid ${T.borderSoft}`, borderLeft:`3px solid ${BDS.primary[400]}`,
  }}>
    <p style={{ fontSize:12, color:T.textPrimary, margin:0, lineHeight:1.6, fontStyle:"italic" }} dir={isRTL(value)?"rtl":"ltr"}>"{value}"</p>
  </div>
);

const RespondentTable = ({ survey }) => {
  const [sidesheet, setSidesheet] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const questions   = getSurveyQuestions(survey);
  const respondents = generateRespondents(survey, 120);

  const paged = respondents.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div style={{ position:"relative", flex:1, minHeight:0, display:"flex", flexDirection:"column" }}>
      <div style={{ background:BDS.neutral["000"], borderRadius:12, border:`1px solid ${T.borderSoft}`, overflow:"hidden", boxShadow:"0 1px 3px rgba(12,10,9,0.04)", flex:1, minHeight:0, display:"flex", flexDirection:"column", overflowY:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
          <thead>
            <tr style={{ borderBottom:`1px solid ${T.borderSoft}`, background:BDS.neutral[50] }}>
              {["ID","Nombre","Fecha","Estado","Plan"].map(h => (
                <th key={h} style={{ padding:"10px 16px", textAlign:"left", fontSize:11, fontWeight:700, color:T.textMuted, textTransform:"uppercase", letterSpacing:"0.07em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map((r, i) => (
              <tr key={r.id}
                onClick={() => setSidesheet(r)}
                style={{ borderBottom: i < paged.length-1 ? `1px solid ${T.borderSoft}` : "none", cursor:"pointer", transition:"background 0.12s" }}
                onMouseEnter={e => { e.currentTarget.style.background = BDS.neutral[50]; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
              >
                <td style={{ padding:"11px 16px", fontSize:11, color:T.textMuted, fontFamily:"'DM Mono', monospace" }}>{r.id}</td>
                <td style={{ padding:"11px 16px", fontWeight:600, color:T.textPrimary }}>{r.name}</td>
                <td style={{ padding:"11px 16px", fontSize:12, color:T.textMuted }}>{r.date}</td>
                <td style={{ padding:"11px 16px" }}>
                  <span style={{
                    fontSize:11, fontWeight:600, padding:"3px 9px", borderRadius:20,
                    background: r.completed ? BDS.emerald[100] : BDS.red[100],
                    color:      r.completed ? BDS.emerald[600] : BDS.red[600],
                    border:`1px solid ${r.completed ? "#A7E3C9" : "#FFC5C3"}`,
                  }}>{r.completed ? "Completó" : "Abandonó"}</span>
                </td>
                <td style={{ padding:"11px 16px" }}>
                  <span style={{ fontSize:11, padding:"3px 8px", borderRadius:4, background:BDS.neutral[100], color:T.textMuted, fontWeight:500 }}>{r.plan}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <TablePagination total={respondents.length} page={page} pageSize={pageSize}
          onPageChange={p => setPage(p)} onPageSizeChange={s => { setPageSize(s); setPage(1); }}/>
      </div>

      {/* Sidesheet */}
      {sidesheet && (
        <>
          <div onClick={() => setSidesheet(null)} style={{ position:"fixed", inset:0, background:"rgba(12,10,9,0.35)", zIndex:80, backdropFilter:"blur(2px)" }}/>
          <div style={{
            position:"fixed", top:0, right:0, bottom:0, width:480,
            background:BDS.neutral["000"], zIndex:90,
            boxShadow:"-8px 0 32px rgba(12,10,9,0.12)",
            display:"flex", flexDirection:"column",
            animation:"slideIn 0.25s ease",
          }}>
            <style>{`@keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}`}</style>

            {/* Header */}
            <div style={{ padding:"20px 24px 16px", borderBottom:`1px solid ${T.borderSoft}`, flexShrink:0 }}>
              <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between" }}>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <div style={{ width:40, height:40, borderRadius:"50%", background:BDS.primary[100], display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:BDS.primary[600], flexShrink:0 }}>
                    {sidesheet.name.split(" ").map(n=>n[0]).join("").slice(0,2)}
                  </div>
                  <div>
                    <p style={{ fontSize:15, fontWeight:700, color:T.textPrimary, margin:0 }}>{sidesheet.name}</p>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:4 }}>
                      <span style={{ fontSize:11, padding:"2px 8px", borderRadius:4, background:BDS.neutral[100], color:T.textMuted, fontWeight:500 }}>{sidesheet.plan}</span>
                      <span style={{
                        fontSize:11, fontWeight:600, padding:"2px 8px", borderRadius:20,
                        background: sidesheet.completed ? BDS.emerald[100] : BDS.red[100],
                        color:      sidesheet.completed ? BDS.emerald[600] : BDS.red[600],
                      }}>{sidesheet.completed ? "Completó" : "Abandonó"}</span>
                      <span style={{ fontSize:11, color:T.textMuted }}>{sidesheet.date}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setSidesheet(null)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:20, color:T.textMuted, padding:"0 4px", lineHeight:1 }}>×</button>
              </div>
              <p style={{ fontSize:11, color:T.textMuted, margin:"12px 0 0" }}>
                {sidesheet.completed
                  ? <>{questions.length} preguntas · <span style={{color:BDS.emerald[600],fontWeight:600}}>Completó todas</span></>
                  : <>{sidesheet.dropOffAt} de {questions.length} respondidas · <span style={{color:BDS.red[600],fontWeight:600}}>Abandonó en P{sidesheet.dropOffAt+1}</span></>
                }
              </p>
            </div>

            {/* Questions scroll */}
            <div style={{ flex:1, overflowY:"auto", padding:"16px 24px" }}>
              {questions.map((q, qi) => {
                const ans = sidesheet.answers?.find(a => a.qId === q.id);
                const cfg = QTYPE_CFG_INLINE[q.type] || QTYPE_CFG_INLINE.text;
                return (
                  <div key={q.id} style={{ marginBottom:20, paddingBottom:20, borderBottom: qi < questions.length-1 ? `1px solid ${T.borderSoft}` : "none" }}>
                    {/* Question header */}
                    <div style={{ display:"flex", alignItems:"flex-start", gap:8, marginBottom:10 }}>
                      <span style={{ fontSize:10, fontWeight:700, color:T.textMuted, fontFamily:"'DM Mono', monospace", width:20, flexShrink:0, paddingTop:2 }}>{qi+1}</span>
                      <div style={{ flex:1 }}>
                        <p style={{ fontSize:13, color:T.textPrimary, margin:"0 0 6px", lineHeight:1.5, fontWeight:500 }}>{q.text}</p>
                        <span style={{ fontSize:9, fontWeight:700, padding:"2px 7px", borderRadius:4, background:cfg.bg, color:cfg.color, textTransform:"uppercase", letterSpacing:"0.06em" }}>{cfg.label}{q.required ? " · requerida" : ""}</span>
                      </div>
                    </div>
                    {/* Answer visual */}
                    <div style={{ paddingLeft:28 }}>
                      {!ans || ans.value === null ? (
                        <div style={{ display:"flex", alignItems:"center", gap:8, padding:"9px 12px", borderRadius:6, background:BDS.neutral[50], border:`1px dashed ${BDS.neutral[300]}` }}>
                          <span style={{ width:6, height:6, borderRadius:"50%", background:BDS.neutral[300], flexShrink:0 }}/>
                          <p style={{ fontSize:11, color:T.textMuted, fontStyle:"italic", margin:0 }}>No respondida — el participante no llegó a esta pregunta</p>
                        </div>
                      ) : q.type === "nps" ? (
                        <NpsAnswer value={ans.value}/>
                      ) : q.type === "scale" ? (
                        <ScaleAnswer value={ans.value}/>
                      ) : q.type === "choice" ? (
                        <ChoiceAnswer value={ans.value} options={q.options}/>
                      ) : (
                        <TextAnswer value={ans.value}/>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// ─── QUESTIONS TAB ────────────────────────────────────────────────────────────
const QTYPE_CFG = {
  nps:    { label:"NPS",        icon:"📊", bg:"#EAFAF1", color:"#00975C", desc:"Escala 0–10" },
  scale:  { label:"Escala",     icon:"⚖️", bg:"#eff6ff", color:"#E26500", desc:"Escala 1–5" },
  text:   { label:"Texto libre",icon:"✍️", bg:"#fff7ed", color:"#ea580c", desc:"Respuesta abierta" },
  choice: { label:"Opciones",   icon:"☑️", bg:"#faf5ff", color:"#7D45A2", desc:"Selección múltiple" },
};

// ─── BRANCHING LOGIC ─────────────────────────────────────────────────────────
// Branch condition thresholds:
//   scale 1-5  → "negative" = values 1-2 (≤ 2)
//   nps 0-10   → "negative" = values 0-5  (≤ 5)
//   choice     → specific option selected
const BRANCH_LABELS = {
  scale:  "Si responde 1 o 2 (negativo)",
  nps:    "Si responde 0–5 (detractor)",
  choice: "Si selecciona opción específica",
};

const BranchEditor = ({ question, questions, branches, onChange }) => {
  const [open, setOpen] = useState(false);
  const branch = branches[question.id] || null;
  const eligible = ["scale","nps","choice"].includes(question.type);
  if (!eligible) return null;

  const otherQs = questions.filter(q => q.id !== question.id);
  const label = BRANCH_LABELS[question.type] || "Si responde negativamente";

  return (
    <div style={{ marginTop:8, paddingTop:8, borderTop:`1px dashed ${BDS.neutral[200]}` }}>
      <div style={{ display:"flex", alignItems:"center", gap:6 }}>
        <button
          onClick={() => setOpen(v => !v)}
          style={{ display:"flex", alignItems:"center", gap:4, background:"none", border:"none", cursor:"pointer", padding:0, fontFamily:"inherit" }}>
          <span style={{ fontSize:10, color: branch ? BDS.primary[600] : T.textMuted, fontWeight:600 }}>
            {open ? "▾" : "▸"} {branch ? `↪ Ramifica → P${questions.findIndex(q=>q.id===branch.targetId)+1}` : "Agregar ramificación"}
          </span>
        </button>
        {branch && (
          <button onClick={() => onChange(question.id, null)}
            style={{ fontSize:10, color:BDS.red[400], background:"none", border:"none", cursor:"pointer", padding:"0 2px", fontFamily:"inherit" }}>
            × quitar
          </button>
        )}
      </div>
      {open && (
        <div style={{ marginTop:8, background:BDS.primary[50], borderRadius:8, padding:"10px 12px", border:`1px solid ${BDS.primary[100]}` }}>
          <p style={{ fontSize:11, color:BDS.primary[700], fontWeight:600, margin:"0 0 8px" }}>{label}</p>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ fontSize:11, color:T.textMuted, flexShrink:0 }}>Ir a pregunta:</span>
            <select
              value={branch?.targetId || ""}
              onChange={e => {
                const val = e.target.value;
                onChange(question.id, val ? { targetId: parseInt(val), condition: question.type } : null);
              }}
              style={{ flex:1, fontSize:12, padding:"4px 8px", borderRadius:6, border:`1px solid ${BDS.primary[200]}`, background:"#fff", color:T.textPrimary, fontFamily:"inherit", cursor:"pointer" }}>
              <option value="">— sin ramificación —</option>
              {otherQs.map((q,i) => (
                <option key={q.id} value={q.id}>
                  P{questions.indexOf(q)+1}: {q.text.slice(0,48)}{q.text.length>48?"…":""}
                </option>
              ))}
            </select>
          </div>
          {branch && (
            <p style={{ fontSize:10, color:BDS.primary[600], margin:"6px 0 0", fontStyle:"italic" }}>
              Si la respuesta es negativa, se saltará a la pregunta seleccionada.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

const QuestionsTab = ({ survey }) => {
  const canReorder = survey.status !== "published";
  const [questions, setQuestions] = useState(() => getSurveyQuestions(survey));
  const [dragging,  setDragging]  = useState(null);
  const [dragOver,  setDragOver]  = useState(null);
  const [saved,     setSaved]     = useState(false);
  const [hasChanges,setHasChanges]= useState(false);
  const [branches,  setBranches]  = useState({});
  const handleBranchChange = (qId, branch) => setBranches(prev => ({ ...prev, [qId]: branch }));

  const handleDragStart = (e,idx) => { setDragging(idx); e.dataTransfer.effectAllowed="move"; };
  const handleDragOver  = (e,idx) => { e.preventDefault(); if(idx!==dragOver) setDragOver(idx); };
  const handleDrop = (e,targetIdx) => {
    e.preventDefault();
    if(dragging===null||dragging===targetIdx) return;
    const updated = [...questions];
    const [moved] = updated.splice(dragging,1);
    updated.splice(targetIdx,0,moved);
    setQuestions(updated.map((q,i) => ({ ...q, order:i+1 })));
    setDragging(null); setDragOver(null); setHasChanges(true);
  };
  const handleDragEnd = () => { setDragging(null); setDragOver(null); };

  const moveUp   = (i) => { if(i===0) return; const a=[...questions]; [a[i-1],a[i]]=[a[i],a[i-1]]; setQuestions(a.map((q,j)=>({...q,order:j+1}))); setHasChanges(true); };
  const moveDown = (i) => { if(i===questions.length-1) return; const a=[...questions]; [a[i],a[i+1]]=[a[i+1],a[i]]; setQuestions(a.map((q,j)=>({...q,order:j+1}))); setHasChanges(true); };

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
        <p style={{ fontSize:14, fontWeight:600, color:"#44403B", margin:0 }}>
          {questions.length} preguntas
          {canReorder && <span style={{ marginLeft:8, fontSize:12, fontWeight:400, color:"#A6A09B" }}>· Arrastra para reordenar</span>}
        </p>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          {canReorder && hasChanges && (
            <button onClick={() => { setSaved(true); setHasChanges(false); setTimeout(()=>setSaved(false),3000); }}
              style={{ padding:"8px 16px", borderRadius:8, fontSize:13, fontWeight:700, color:"#fff", border:"none", cursor:"pointer", fontFamily:"inherit", transition:"all 0.15s", boxShadow:"0 1px 3px rgba(0,0,0,0.1)", background:saved?"#00975C":"#E26500" }}>
              {saved ? "✓ Guardado" : "Guardar orden"}
            </button>
          )}
          <div style={{
            display:"flex", alignItems:"center", gap:6, padding:"6px 12px", borderRadius:8, fontSize:12, fontWeight:600,
            background: canReorder ? "#f0fdf4" : "#FAFAF9",
            border: canReorder ? "1px solid #bbf7d0" : "1px solid rgba(12,10,9,0.10)",
            color: canReorder ? "#15803d" : "#A6A09B",
          }}>
            {canReorder ? <><span style={{ width:6, height:6, borderRadius:"50%", background:"#22c55e", flexShrink:0 }}/>Encuesta activa — reordenamiento habilitado</> : "🔒 Solo lectura"}
          </div>
        </div>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {questions.map((q,idx) => {
          const cfg = QTYPE_CFG[q.type] || QTYPE_CFG.text;
          const isDraggingThis = dragging===idx;
          const isDragTarget   = dragOver===idx && dragging!==idx;
          return (
            <div key={q.id}
              draggable={canReorder}
              onDragStart={canReorder?(e)=>handleDragStart(e,idx):undefined}
              onDragOver={canReorder?(e)=>handleDragOver(e,idx):undefined}
              onDrop={canReorder?(e)=>handleDrop(e,idx):undefined}
              onDragEnd={canReorder?handleDragEnd:undefined}
              style={{ opacity:isDraggingThis?0.4:1, transform:isDragTarget?"translateY(-2px)":"none", cursor:canReorder?"grab":"default", transition:"all 0.15s" }}>
              <div style={{
                background:"#fff", borderRadius:12, boxShadow: isDragTarget ? "0 4px 12px rgba(226,101,0,0.12)" : "0 1px 2px rgba(12,10,9,0.04)",
                border: isDragTarget ? "1px solid #E26500" : "1px solid rgba(12,10,9,0.10)",
                display:"flex", transition:"all 0.15s",
                ...(isDragTarget ? { outline:"2px solid #FFE4D4" } : {}),
              }}>
                {/* Order / handle */}
                <div style={{
                  display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"0 16px", gap:8,
                  borderRight: isDragTarget ? "1px solid #bfdbfe" : "1px solid rgba(12,10,9,0.06)",
                  borderRadius:"12px 0 0 12px", flexShrink:0, alignSelf:"stretch",
                  background: isDragTarget ? "rgba(255,250,234,0.5)" : "rgba(250,250,249,0.6)",
                }}>
                  {canReorder && (
                    <div style={{ display:"flex", flexDirection:"column", gap:2, opacity:0.4 }}>
                      <div style={{ width:14, height:2, background:"#9ca3af", borderRadius:1 }}/><div style={{ width:14, height:2, background:"#9ca3af", borderRadius:1 }}/><div style={{ width:14, height:2, background:"#9ca3af", borderRadius:1 }}/>
                    </div>
                  )}
                  <span style={{ fontSize:12, fontWeight:900, color:"#A6A09B", marginTop:4, fontFamily:"'DM Mono', monospace" }}>{String(q.order).padStart(2,"0")}</span>
                </div>
                {/* Content */}
                <div style={{ flex:1, padding:16, minWidth:0 }}>
                  <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12 }}>
                    <p style={{ fontSize:14, fontWeight:600, color:"#292524", lineHeight:1.4, flex:1, margin:0 }}>{q.text}</p>
                    <div style={{ display:"flex", alignItems:"center", gap:6, flexShrink:0 }}>
                      {q.required && <span style={{ fontSize:12, padding:"2px 8px", borderRadius:6, background:"#fef2f2", color:"#ef4444", fontWeight:600, border:"1px solid #fecaca" }}>requerida</span>}
                      <span style={{ display:"inline-flex", alignItems:"center", gap:4, fontSize:12, padding:"4px 8px", borderRadius:8, fontWeight:600, background:cfg.bg, color:cfg.color }}>{cfg.icon} {cfg.label}</span>
                    </div>
                  </div>
                  <p style={{ fontSize:12, color:"#A6A09B", marginTop:6 }}>{cfg.desc}</p>
                  {q.options?.length>0 && (
                    <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginTop:10 }}>
                      {q.options.map((opt,j) => (
                        <span key={j} style={{ display:"inline-flex", alignItems:"center", gap:4, fontSize:12, padding:"4px 10px", background:"#F5F5F4", color:"#57534D", borderRadius:99, border:"1px solid rgba(12,10,9,0.10)" }}>
                          <span style={{ width:4, height:4, borderRadius:"50%", background:"#9ca3af", flexShrink:0 }}/>{opt}
                        </span>
                      ))}
                    </div>
                  )}
                  <BranchEditor question={q} questions={questions} branches={branches} onChange={handleBranchChange}/>
                </div>
                {/* Arrow controls */}
                {canReorder && (
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:4, padding:"0 12px", alignSelf:"stretch", borderLeft:"1px solid rgba(12,10,9,0.06)" }}>
                    <button onClick={()=>moveUp(idx)} disabled={idx===0}
                      style={{ width:24, height:24, borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, border:"none", cursor:idx===0?"not-allowed":"pointer", background:"transparent", color:idx===0?"#e5e7eb":"#A6A09B", fontFamily:"inherit", transition:"all 0.15s" }}>↑</button>
                    <button onClick={()=>moveDown(idx)} disabled={idx===questions.length-1}
                      style={{ width:24, height:24, borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, border:"none", cursor:idx===questions.length-1?"not-allowed":"pointer", background:"transparent", color:idx===questions.length-1?"#e5e7eb":"#A6A09B", fontFamily:"inherit", transition:"all 0.15s" }}>↓</button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── BREADCRUMBS ─────────────────────────────────────────────────────────────
const Breadcrumbs = ({ crumbs }) => (
  <div style={{ display:"flex", alignItems:"center", gap:4, marginBottom:12 }}>
    {crumbs.map((crumb,i) => {
      const isLast = i===crumbs.length-1;
      return (
        <div key={i} style={{ display:"flex", alignItems:"center", gap:4 }}>
          {i>0 && (
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
              <path d="M4 2.5L7.5 6L4 9.5" stroke={BDS.neutral[400]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
          {isLast
            ? <span style={{ fontSize:11, fontWeight:600, color:T.textMuted }}>{crumb.label}</span>
            : <button onClick={crumb.onClick} style={{ fontSize:11, fontWeight:500, color:BDS.neutral[400], background:"none", border:"none", cursor:"pointer", fontFamily:"inherit", padding:0, transition:"color 0.15s" }}
                onMouseEnter={e=>{e.target.style.color=BDS.primary[500]}} onMouseLeave={e=>{e.target.style.color=BDS.neutral[400]}}>{crumb.label}</button>
          }
        </div>
      );
    })}
  </div>
);

// ─── VIEW 1: SURVEY LIST ──────────────────────────────────────────────────────
const FilterButton = ({ filters, current, onChange, columns }) => {
  const [open, setOpen] = useState(false);
  const [colFilter, setColFilter] = useState("all"); // which column to filter
  const ref = useRef(null);

  // Close on outside click
  React.useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} style={{ position:"relative" }}>
      <button onClick={() => setOpen(!open)} style={{
        display:"flex", alignItems:"center", gap:6,
        padding:"9px 14px", borderRadius:8,
        border:`1px solid ${T.borderBase}`,
        fontSize:13, fontWeight:600, color:T.textPrimary, cursor:"pointer",
        background:BDS.neutral["000"], fontFamily:"inherit", transition:"all 0.15s",
        boxShadow:"0 1px 3px rgba(12,10,9,0.06)",
      }}>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M2 4h12M4 8h8M6 12h4" stroke={T.textMuted} strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        Filtrar
        {current !== "all" && (
          <span style={{ width:6, height:6, borderRadius:"50%", background:BDS.primary[500], flexShrink:0 }}/>
        )}
      </button>
      {open && (
        <div style={{
          position:"absolute", top:"calc(100% + 6px)", left:0, zIndex:50,
          background:BDS.neutral["000"], border:`1px solid ${T.borderSoft}`,
          borderRadius:10, padding:8, boxShadow:"0 8px 24px rgba(12,10,9,0.12)",
          minWidth:180,
        }}>
          <p style={{ fontSize:10, fontWeight:700, color:T.textMuted, textTransform:"uppercase", letterSpacing:"0.08em", padding:"4px 8px", margin:0 }}>Estado</p>
          {filters.map(f => (
            <button key={f.key} onClick={() => { onChange(f.key); setOpen(false); }} style={{
              width:"100%", display:"flex", alignItems:"center", gap:8,
              padding:"7px 10px", borderRadius:6, border:"none", cursor:"pointer",
              background: current===f.key ? BDS.primary[50] : "transparent",
              color: current===f.key ? BDS.primary[700] : T.textPrimary,
              fontFamily:"inherit", fontSize:12, fontWeight: current===f.key ? 600 : 500,
              transition:"all 0.12s", textAlign:"left",
            }}
              onMouseEnter={e => { if(current!==f.key) e.currentTarget.style.background = BDS.neutral[50]; }}
              onMouseLeave={e => { if(current!==f.key) e.currentTarget.style.background = "transparent"; }}
            >
              {current===f.key && <span style={{ width:4, height:4, borderRadius:"50%", background:BDS.primary[500] }}/>}
              {f.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const SurveyList = ({ onSelect, onCreate }) => {
  const [filter,setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const filtered = filter==="all" ? SURVEYS : SURVEYS.filter(s=>s.status===filter);
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const filters = [
    {key:"all",label:"Todas"},{key:"published",label:"Publicadas"},
    {key:"deprecated",label:"Cerradas"},
  ];

  const handleFilterChange = (key) => { setFilter(key); setPage(1); };

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%" }}>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:24 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:800, color:T.textPrimary, margin:0, letterSpacing:"-0.02em" }}>
            Encuestas de feedback
          </h1>
          <p style={{ fontSize:13, color:T.textMuted, margin:"4px 0 0" }}>
            {SURVEYS.length} encuestas · {SURVEYS.filter(s=>s.status==="published").length} activas
          </p>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <FilterButton filters={filters} current={filter} onChange={handleFilterChange}/>
          <button onClick={onCreate} style={{
            display:"flex", alignItems:"center", gap:8,
            padding:"9px 18px", borderRadius:8, border:"none",
            fontSize:13, fontWeight:700, color:"#fff", cursor:"pointer",
            background:BDS.primary[500],
            boxShadow:"0 2px 8px rgba(226,101,0,0.25)",
            fontFamily:"inherit", transition:"all 0.15s",
          }}>
            + Nueva encuesta
          </button>
        </div>
      </div>

      <div style={{ background:BDS.neutral["000"], borderRadius:12, border:`1px solid ${T.borderSoft}`, overflow:"hidden", boxShadow:"0 1px 3px rgba(12,10,9,0.06)", flex:1, minHeight:0, display:"flex", flexDirection:"column", overflowY:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
          <thead>
            <tr style={{ borderBottom:`1px solid ${T.borderSoft}`, background:BDS.neutral[50] }}>
              {["Encuesta","Tipo","Estado","Respuestas","Publicada","Creador"].map(h => (
                <th key={h} style={{ padding:"10px 16px", textAlign:"left", fontSize:11, fontWeight:700, color:T.textMuted, textTransform:"uppercase", letterSpacing:"0.07em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map((s, i) => (
              <tr key={s.id}
                onClick={() => onSelect(s)}
                style={{
                  borderBottom: i < paged.length-1 ? `1px solid ${T.borderSoft}` : "none",
                  cursor:"pointer",
                  transition:"background 0.12s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = BDS.neutral[50]; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
              >
                <td style={{ padding:"13px 16px", fontWeight:600, color:T.textPrimary, maxWidth:220, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{s.name}</td>
                <td style={{ padding:"13px 16px" }}><TypeTag type={s.type}/></td>
                <td style={{ padding:"13px 16px" }}><StatusBadge status={s.status}/></td>
                <td style={{ padding:"13px 16px", fontFamily:"'DM Mono', monospace", fontWeight:700, color:T.textPrimary }}>
                  {s.responses.toLocaleString()}
                </td>
                <td style={{ padding:"13px 16px", fontSize:12, color:T.textMuted, whiteSpace:"nowrap" }}>{s.published || "—"}</td>
                <td style={{ padding:"13px 16px", fontSize:12, color:BDS.neutral[600], maxWidth:120, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{s.creator}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <TablePagination total={filtered.length} page={page} pageSize={pageSize}
          onPageChange={p => setPage(p)} onPageSizeChange={s => { setPageSize(s); setPage(1); }}/>
      </div>
    </div>
  );
};

// ─── VIEW 2: AI BUILDER ───────────────────────────────────────────────────────
const EXAMPLES = [
  "Medir qué tan fácil fue completar el onboarding para nuevos usuarios",
  "Entender por qué usuarios de plan Free no convierten a Pro",
  "Saber si mi producto encaja bien en el mercado actual",
  "Recopilar feedback abierto sobre el nuevo dashboard que lanzamos",
];
const EXAMPLE_TYPES = ["CES","CCR","PMF","Open"];

// ─── STEPPER SHARED COMPONENT ──────────────────────────────
const BuilderStepper = ({ steps, current }) => (
  <div style={{ display:"flex", alignItems:"center", gap:0, marginBottom:24 }}>
    {steps.map((s, i) => {
      const done   = i < current;
      const active = i === current;
      return (
        <div key={s} style={{ display:"flex", alignItems:"center", flex: i < steps.length-1 ? "1 1 auto" : "0 0 auto" }}>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4, flexShrink:0 }}>
            <div style={{
              width:28, height:28, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:11, fontWeight:800, fontFamily:"DM Mono, monospace",
              background: done ? BDS.emerald[500] : active ? BDS.primary[500] : BDS.neutral[100],
              color: done || active ? "#fff" : T.textMuted,
              boxShadow: active ? "0 0 0 3px " + BDS.primary[100] : "none",
              transition:"all 0.2s",
            }}>{done ? "v" : i+1}</div>
            <span style={{ fontSize:10, fontWeight:600, color:active ? BDS.primary[600] : done ? BDS.emerald[600] : T.textMuted, whiteSpace:"nowrap" }}>{s}</span>
          </div>
          {i < steps.length-1 && (
            <div style={{ flex:1, height:2, background:done ? BDS.emerald[400] : BDS.neutral[100], margin:"0 8px 18px", transition:"background 0.3s" }}/>
          )}
        </div>
      );
    })}
  </div>
);

const SurveyBuilder = ({ onBack }) => {
  const [step,     setStep]     = useState(0);
  const [prompt,   setPrompt]   = useState("");
  const [loading,  setLoading]  = useState(false);
  const [result,   setResult]   = useState(null);
  const [error,    setError]    = useState(null);
  const [saved,    setSaved]    = useState(false);
  const [hovered,  setHovered]  = useState(null);
  const taRef = useRef(null);
  const SB_STEPS = ["Configurar", "Revisar preguntas"];

  const handleGenerate = async () => {
    if (!prompt.trim()||loading) return;
    setLoading(true); setError(null); setResult(null);
    try { const r = await generateSurveyWithAI(prompt); setResult(r); setStep(1); }
    catch(e) { setError("No se pudo generar la encuesta. Revisa la conexión."); }
    setLoading(false);
  };

  const typeList = Object.values(SURVEY_TYPES);

  return (
    <div>
      <div style={{ maxWidth:768, margin:"0 auto" }}>
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:4 }}>
          <div>
            <h1 style={{ fontSize:22, fontWeight:800, color:"#0C0A09", letterSpacing:"-0.02em", margin:"0 0 4px" }}>Constructor IA</h1>
            <p style={{ fontSize:13, color:"#A6A09B", margin:"0 0 20px" }}>Describe qué quieres medir y la IA generará la encuesta ideal.</p>
          </div>
          {step===1 && (
            <button onClick={() => { setStep(0); setResult(null); }}
              style={{ fontSize:12, color:T.textMuted, background:"none", border:`1px solid ${T.borderBase}`, borderRadius:8, padding:"6px 12px", cursor:"pointer", fontFamily:"inherit", fontWeight:600 }}>
              ← Volver a configurar
            </button>
          )}
        </div>
        <BuilderStepper steps={SB_STEPS} current={step}/>

        {step === 0 && (
        <div style={{ animation:"fadeUp 0.2s ease" }}>

        {/* Prompt input */}
        <div style={{ background:"#fff", borderRadius:12, border:"1px solid rgba(12,10,9,0.10)", boxShadow:"0 1px 3px rgba(12,10,9,0.06)", padding:20, marginBottom:16 }}>
          <p style={{ fontSize:12, fontWeight:600, color:"#A6A09B", textTransform:"uppercase", letterSpacing:"0.1em", margin:"0 0 12px" }}>Describe tu necesidad</p>
          <textarea ref={taRef} value={prompt} rows={4} onChange={e=>setPrompt(e.target.value)}
            onKeyDown={e=>{ if(e.key==="Enter"&&e.metaKey) handleGenerate(); }}
            placeholder="Ej: Quiero entender por qué mis usuarios abandonan el checkout…"
            style={{
              width:"100%", background:"#FAFAF9", border:"1px solid rgba(12,10,9,0.10)", borderRadius:8,
              padding:12, fontSize:13, color:"#292524", resize:"none", fontFamily:"inherit",
              outline:"none", transition:"all 0.15s",
            }}
            onFocus={e=>{ e.target.style.borderColor="#E26500"; e.target.style.boxShadow="0 0 0 3px rgba(226,101,0,0.12)"; }}
            onBlur={e=>{ e.target.style.borderColor="rgba(12,10,9,0.10)"; e.target.style.boxShadow="none"; }}/>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:12 }}>
            <span style={{ fontSize:12, color:"#D6D3D1" }}>⌘ + Enter para generar</span>
            <button onClick={handleGenerate} disabled={!prompt.trim()||loading}
              style={{
                padding:"8px 20px", borderRadius:8, fontSize:13, fontWeight:700, border:"none", fontFamily:"inherit", transition:"all 0.15s",
                ...(!prompt.trim()||loading
                  ? { background:"#f1f5f9", color:"#cbd5e1", cursor:"not-allowed" }
                  : { background:"#E26500", color:"#fff", cursor:"pointer", boxShadow:"0 2px 8px rgba(226,101,0,0.3)" }),
              }}>
              {loading ? "Generando…" : "Generar encuesta →"}
            </button>
          </div>
        </div>

        {/* Quick examples */}
        <div style={{ marginBottom:32 }}>
          <p style={{ fontSize:12, color:"#D6D3D1", textTransform:"uppercase", letterSpacing:"0.1em", fontWeight:600, margin:"0 0 8px" }}>Ejemplos rápidos</p>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
            {EXAMPLES.map((ex,i) => (
              <button key={i} onClick={()=>{ setPrompt(ex); taRef.current?.focus(); }}
                style={{
                  display:"flex", alignItems:"center", gap:6, padding:"6px 12px",
                  background:"#fff", border:"1px solid rgba(12,10,9,0.10)", color:"#79716B",
                  fontSize:12, borderRadius:99, cursor:"pointer", fontFamily:"inherit",
                  textAlign:"left", transition:"all 0.15s",
                }}>
                <span>{SURVEY_TYPES[EXAMPLE_TYPES[i]]?.icon}</span>
                {ex}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ background:"#fff", border:"1px solid rgba(12,10,9,0.10)", borderRadius:12, padding:40, textAlign:"center", boxShadow:"0 1px 3px rgba(12,10,9,0.06)" }}>
            <div style={{ fontSize:30, marginBottom:12, animation:"spin 1.2s linear infinite", display:"inline-block" }}>⚙️</div>
            <p style={{ fontSize:13, color:"#A6A09B", margin:0 }}>Analizando contexto y generando preguntas…</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ background:"#fef2f2", border:"1px solid #fecaca", borderRadius:12, padding:16, fontSize:13, color:"#dc2626" }}>{error}</div>
        )}
        </div>
        )}

        {/* Step 1: Result */}
        {step === 1 && result && (
          <div style={{ background:"#fff", border:"1px solid rgba(12,10,9,0.10)", borderRadius:12, padding:20, boxShadow:"0 1px 3px rgba(12,10,9,0.06)", animation:"fadeUp 0.3s ease" }}>
            <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:16 }}>
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                  <TypeTag type={result.type}/>
                  <h2 style={{ fontSize:16, fontWeight:700, color:"#0C0A09", margin:0 }}>{result.name}</h2>
                </div>
                <p style={{ fontSize:12, color:"#A6A09B", margin:0 }}>{result.rationale}</p>
              </div>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:16 }}>
              {result.questions?.map((q,i) => {
                const qt = QTYPE_CFG[q.type] || QTYPE_CFG.text;
                return (
                  <div key={q.id} style={{ background:"#fff", border:"1px solid rgba(12,10,9,0.10)", borderRadius:12, padding:"14px 16px", boxShadow:"0 1px 2px rgba(12,10,9,0.04)", display:"flex", gap:12, alignItems:"flex-start" }}>
                    <div style={{ width:28, height:28, borderRadius:8, background:"#F5F5F4", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, color:"#A6A09B", flexShrink:0, marginTop:2, fontFamily:"'DM Mono', monospace" }}>{i+1}</div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <p style={{ fontSize:14, color:"#292524", fontWeight:500, margin:"0 0 8px" }} dir={isRTL(q.text)?"rtl":"ltr"}>{q.text}</p>
                      <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                        <span style={{ display:"inline-flex", alignItems:"center", gap:4, fontSize:12, padding:"2px 8px", borderRadius:6, fontWeight:500, background:qt.bg, color:qt.color }}>{qt.icon} {qt.label}</span>
                        {q.required && <span style={{ fontSize:12, padding:"2px 8px", borderRadius:6, background:"#fef2f2", color:"#ef4444", fontWeight:500 }}>requerida</span>}
                      </div>
                      {q.options?.length>0 && (
                        <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginTop:8 }}>
                          {q.options.map((opt,j) => <span key={j} style={{ fontSize:12, padding:"4px 10px", background:"#F5F5F4", color:"#57534D", borderRadius:99 }}>{opt}</span>)}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={()=>{ setSaved(true); setTimeout(()=>setSaved(false),3000); }}
                style={{ flex:1, padding:"10px", borderRadius:8, fontSize:13, fontWeight:700, color:"#fff", border:"none", cursor:"pointer", fontFamily:"inherit", transition:"all 0.15s", background:saved?"#00975C":"#E26500" }}>
                {saved ? "✓ Guardada como borrador" : "Guardar como borrador"}
              </button>
              <button onClick={()=>{ setStep(0); setResult(null); setPrompt(""); }}
                style={{ padding:"10px 16px", borderRadius:8, fontSize:13, fontWeight:600, background:"#fff", border:"1px solid rgba(12,10,9,0.10)", color:"#79716B", cursor:"pointer", fontFamily:"inherit", transition:"all 0.15s" }}>
                Reiniciar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── VIEW 3: SURVEY OVERVIEW ──────────────────────────────────────────────────
const SurveyOverview = ({ survey, onBack, tab, setTab }) => {
  const d = generateDetailData(survey);

  const TABS = [
    { key:"overview",     label:"Overview"   },
    { key:"demographics", label:"Demografía" },
    { key:"respondents",  label:"Respuestas" },
    { key:"questions",    label:"Preguntas"  },
  ];

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%" }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:24 }}>
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
            <TypeTag type={survey.type}/>
            <StatusBadge status={survey.status}/>
          </div>
          <h1 style={{ fontSize:22, fontWeight:800, color:"#0C0A09", letterSpacing:"-0.02em", margin:0 }}>{survey.name}</h1>
          <p style={{ fontSize:13, color:"#A6A09B", marginTop:4 }}>Creada por {survey.creator} · {survey.questions} preguntas</p>
        </div>
        {/* KPI pills */}
        <div style={{ display:"flex", gap:12 }}>
          {[
            { label:"Total respuestas", value:survey.responses.toLocaleString(), accent:"#0C0A09" },
            ...(d.score ? [{ label:d.score.label, value:d.score.value, accent:d.score.accent }] : []),
            { label:"Completación", value:`${d.completion.completed}%`, accent:"#00975C" },
          ].map(k => (
            <div key={k.label} style={{ background:BDS.neutral["000"], borderRadius:10, border:`1px solid ${T.borderSoft}`, padding:"10px 16px", textAlign:"center", minWidth:80 }}>
              <p style={{ fontSize:18, fontWeight:800, color:k.accent, fontFamily:"'DM Mono', monospace", margin:0, lineHeight:1 }}>{k.value}</p>
              <p style={{ fontSize:10, color:T.textMuted, margin:"4px 0 0", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.06em" }}>{k.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tab nav */}
      <div style={{ display:"flex", gap:2, borderBottom:`1px solid ${T.borderSoft}`, marginBottom:24 }}>
        {TABS.map(t => (
          <button key={t.key} onClick={()=>setTab(t.key)} style={{
            padding:"10px 16px", border:"none", background:"none", cursor:"pointer",
            fontSize:13, fontWeight:600, fontFamily:"inherit", transition:"all 0.15s",
            color:        tab===t.key ? BDS.primary[600] : T.textMuted,
            borderBottom: tab===t.key ? `2px solid ${BDS.primary[500]}` : "2px solid transparent",
            marginBottom: -1,
          }}>{t.label}</button>
        ))}
      </div>

      {/* Tab: Overview */}
      {tab==="overview" && (
        <div style={{ animation:"fadeUp 0.25s ease" }}>
          <ReachBar reach={d.reach}/>
          <TypeCharts survey={survey} d={d}/>
        </div>
      )}

      {/* Tab: Demographics */}
      {tab==="demographics" && (
        <div style={{ animation:"fadeUp 0.25s ease" }}>
          <DemographicsTab d={d}/>
        </div>
      )}

      {/* Tab: Respondents */}
      {tab==="respondents" && (
        <div style={{ animation:"fadeUp 0.25s ease", flex:1, minHeight:0, display:"flex", flexDirection:"column" }}>
          <RespondentTable survey={survey}/>
        </div>
      )}

      {/* Tab: Questions */}
      {tab==="questions" && (
        <div style={{ animation:"fadeUp 0.25s ease" }}>
          <QuestionsTab survey={survey}/>
        </div>
      )}
    </div>
  );
};

// ─── FEATURE FLAGS PAGE ───────────────────────────────────────────────────────
const MOCK_FLAGS = [
  { id:"ff-001", name:"new_dashboard_v2",        description:"Rediseño del dashboard principal con nueva estructura de widgets.", env:"production", enabled:true,  rollout:100, owner:"Leiver Díaz",   updated:"2025-02-28", tags:["ui","dashboard"] },
  { id:"ff-002", name:"ai_coach_suggestions",    description:"Sugerencias de coaching generadas por IA en el flujo de 1:1.",    env:"production", enabled:true,  rollout:45,  owner:"Ana Torres",    updated:"2025-02-20", tags:["ai","coaching"] },
  { id:"ff-003", name:"bulk_survey_export",      description:"Exportación masiva de respuestas en CSV y Excel.",                env:"staging",    enabled:false, rollout:0,   owner:"Carlos Mejía",  updated:"2025-01-15", tags:["surveys","export"] },
  { id:"ff-004", name:"goal_cascade_beta",       description:"Cascada de objetivos de empresa a equipos e individuos.",         env:"production", enabled:true,  rollout:20,  owner:"Leiver Díaz",   updated:"2025-02-10", tags:["goals","beta"] },
  { id:"ff-005", name:"slack_notifications_v3",  description:"Nueva versión del sistema de notificaciones via Slack.",          env:"staging",    enabled:true,  rollout:100, owner:"Sofía Reyes",   updated:"2025-01-30", tags:["integrations"] },
  { id:"ff-006", name:"performance_review_ai",   description:"Asistente IA para redactar evaluaciones de desempeño.",          env:"development",enabled:false, rollout:0,   owner:"Ana Torres",    updated:"2025-02-05", tags:["ai","reviews"] },
  { id:"ff-007", name:"mobile_app_v2",           description:"Nueva app móvil con rediseño completo de UX.",                   env:"development",enabled:false, rollout:0,   owner:"Carlos Mejía",  updated:"2025-01-20", tags:["mobile","ui"] },
  { id:"ff-008", name:"okr_public_visibility",   description:"Permite que OKRs sean visibles para toda la organización.",      env:"production", enabled:true,  rollout:60,  owner:"Sofía Reyes",   updated:"2025-02-18", tags:["okr","visibility"] },
];

const ENV_CFG = {
  production:  { label:"Production",  color:"#00975C", bg:"#EAFAF1", border:"#A7E3C9" },
  staging:     { label:"Staging",     color:"#d97706", bg:"#fffbeb", border:"#fde68a" },
  development: { label:"Development", color:"#79716B", bg:"#FAFAF9", border:"#E7E5E4" },
};

const FeatureFlagsPage = () => {
  const [flags, setFlags]       = useState(MOCK_FLAGS);
  const [search, setSearch]     = useState("");
  const [envFilter, setEnvFilter] = useState("all");
  const [showOnly, setShowOnly] = useState("all"); // all | enabled | disabled

  const filtered = flags.filter(f => {
    const matchSearch  = f.name.includes(search.toLowerCase()) || f.description.toLowerCase().includes(search.toLowerCase()) || f.tags.some(t=>t.includes(search.toLowerCase()));
    const matchEnv     = envFilter==="all" || f.env===envFilter;
    const matchEnabled = showOnly==="all" || (showOnly==="enabled"&&f.enabled) || (showOnly==="disabled"&&!f.enabled);
    return matchSearch && matchEnv && matchEnabled;
  });

  const toggleFlag = (id) => setFlags(prev => prev.map(f => f.id===id ? { ...f, enabled:!f.enabled, rollout:!f.enabled?100:0 } : f));

  const stats = {
    total:   flags.length,
    enabled: flags.filter(f=>f.enabled).length,
    prod:    flags.filter(f=>f.env==="production"&&f.enabled).length,
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:24 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:800, color:T.textPrimary, margin:0, letterSpacing:"-0.02em" }}>
            Feature Flags
          </h1>
          <p style={{ fontSize:13, color:T.textMuted, margin:"4px 0 0" }}>
            {stats.total} flags · {stats.enabled} activos · {stats.prod} en producción
          </p>
        </div>
        <button style={{
          display:"flex", alignItems:"center", gap:8,
          padding:"9px 18px", borderRadius:8, border:"none",
          fontSize:13, fontWeight:700, color:"#fff", cursor:"pointer",
          background:BDS.primary[500],
          boxShadow:"0 2px 8px rgba(226,101,0,0.25)",
          fontFamily:"inherit", transition:"all 0.15s",
        }}>
          + Nuevo flag
        </button>
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:12, marginBottom:20 }}>
        {[
          { label:"Total flags",      value:stats.total,   accent:T.textPrimary },
          { label:"Activos",          value:stats.enabled, accent:BDS.emerald[600] },
          { label:"En producción",    value:stats.prod,    accent:BDS.primary[500] },
        ].map(s => (
          <div key={s.label} style={{ background:BDS.neutral["000"], borderRadius:12, border:`1px solid ${T.borderSoft}`, padding:"12px 16px", boxShadow:"0 1px 3px rgba(12,10,9,0.06)" }}>
            <p style={{ fontSize:11, color:T.textMuted, margin:"0 0 4px", fontWeight:500 }}>{s.label}</p>
            <p style={{ fontSize:22, fontWeight:800, color:s.accent, fontFamily:"'DM Mono', monospace", margin:0 }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
        {/* Search */}
        <div style={{ position:"relative", flex:1, maxWidth:240 }}>
          <span style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", fontSize:11, color:BDS.neutral[300] }}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Buscar flag, tag…"
            style={{
              width:"100%", paddingLeft:30, paddingRight:12, padding:"6px 12px 6px 30px",
              fontSize:12, border:`1px solid ${T.borderSoft}`, borderRadius:8,
              background:BDS.neutral["000"], color:BDS.neutral[700],
              fontFamily:"inherit", outline:"none", transition:"border 0.15s",
            }}
            onFocus={e => { e.target.style.borderColor = BDS.primary[500]; }}
            onBlur={e  => { e.target.style.borderColor = T.borderSoft; }}
          />
        </div>
        {/* Env filter */}
        <div style={{ display:"flex", gap:4 }}>
          {["all","production","staging","development"].map(e => (
            <button key={e} onClick={()=>setEnvFilter(e)} style={{
              padding:"5px 12px", borderRadius:8, border:"none", cursor:"pointer",
              fontSize:11, fontWeight:600, fontFamily:"inherit", transition:"all 0.15s",
              background: envFilter===e ? BDS.secondary[950] : BDS.neutral["000"],
              color:       envFilter===e ? "#fff" : BDS.neutral[500],
              boxShadow:   envFilter===e ? "none" : `0 0 0 1px ${T.borderSoft}`,
            }}>
              {e==="all" ? "Todos" : ENV_CFG[e].label}
            </button>
          ))}
        </div>
        {/* Status filter */}
        <div style={{ display:"flex", gap:4, marginLeft:"auto" }}>
          {[{k:"all",l:"Todos"},{k:"enabled",l:"Activos"},{k:"disabled",l:"Inactivos"}].map(f => (
            <button key={f.k} onClick={()=>setShowOnly(f.k)} style={{
              padding:"5px 12px", borderRadius:8, border:"none", cursor:"pointer",
              fontSize:11, fontWeight:600, fontFamily:"inherit", transition:"all 0.15s",
              background: showOnly===f.k ? BDS.secondary[950] : BDS.neutral["000"],
              color:       showOnly===f.k ? "#fff" : BDS.neutral[500],
              boxShadow:   showOnly===f.k ? "none" : `0 0 0 1px ${T.borderSoft}`,
            }}>{f.l}</button>
          ))}
        </div>
      </div>

      {/* Flags list */}
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {filtered.map(flag => {
          const env = ENV_CFG[flag.env];
          return (
            <div key={flag.id} style={{
              background:BDS.neutral["000"], borderRadius:12, border:`1px solid ${T.borderSoft}`,
              boxShadow:"0 1px 3px rgba(12,10,9,0.06)", padding:"16px 20px",
              display:"flex", alignItems:"flex-start", gap:16, transition:"all 0.12s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = BDS.neutral[300]; e.currentTarget.style.boxShadow = "0 2px 8px rgba(12,10,9,0.08)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = T.borderSoft; e.currentTarget.style.boxShadow = "0 1px 3px rgba(12,10,9,0.06)"; }}
            >
              {/* Toggle */}
              <button onClick={()=>toggleFlag(flag.id)} style={{
                width:40, height:22, borderRadius:11, position:"relative", flexShrink:0,
                background: flag.enabled ? BDS.primary[500] : BDS.neutral[200],
                border:"none", cursor:"pointer", marginTop:2, transition:"background 0.2s",
              }}>
                <span style={{
                  position:"absolute", top:2, left: flag.enabled?20:2,
                  width:18, height:18, borderRadius:"50%", background:"#fff",
                  boxShadow:"0 1px 3px rgba(0,0,0,0.2)", transition:"left 0.2s ease",
                }}/>
              </button>

              {/* Content */}
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:16 }}>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", marginBottom:4 }}>
                      <span style={{ fontSize:13, fontWeight:700, color:T.textPrimary, fontFamily:"'DM Mono', monospace" }}>
                        {flag.name}
                      </span>
                      <span style={{ fontSize:10, fontWeight:600, padding:"2px 8px", borderRadius:99, border:`1px solid ${env.border}`, background:env.bg, color:env.color }}>
                        {env.label}
                      </span>
                      {flag.tags.map(tag => (
                        <span key={tag} style={{ fontSize:10, padding:"2px 6px", borderRadius:4, background:BDS.neutral[100], color:T.textMuted, fontWeight:500 }}>#{tag}</span>
                      ))}
                    </div>
                    <p style={{ fontSize:12, color:BDS.neutral[600], lineHeight:1.5, margin:0 }}>{flag.description}</p>
                  </div>

                  {/* Rollout + meta */}
                  <div style={{ flexShrink:0, display:"flex", flexDirection:"column", alignItems:"flex-end", gap:6, minWidth:140 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, width:"100%" }}>
                      <div style={{ flex:1, height:6, background:BDS.neutral[100], borderRadius:99, overflow:"hidden" }}>
                        <div style={{ height:"100%", borderRadius:99, transition:"all 0.3s", width:`${flag.rollout}%`, background:flag.enabled?"linear-gradient(90deg,#001C35,#0094F5)":BDS.neutral[200] }}/>
                      </div>
                      <span style={{ fontSize:12, fontWeight:700, width:32, textAlign:"right", flexShrink:0, fontFamily:"'DM Mono', monospace", color:flag.enabled?BDS.primary[500]:T.textMuted }}>
                        {flag.rollout}%
                      </span>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:10, color:T.textMuted }}>
                      <span>{flag.owner}</span>
                      <span>·</span>
                      <span>{flag.updated}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length===0 && (
          <div style={{ textAlign:"center", padding:"48px 0", color:T.textMuted }}>
            <div style={{ fontSize:32, marginBottom:12 }}>🚩</div>
            <p style={{ fontSize:13, fontWeight:600, margin:0 }}>No hay flags que coincidan</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
// ─── SKILLS ASSESSMENT PAGE ───────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

const SKILLS = [
  { id:"COM", label:"Comunicación",                    color:"#0094F5", bg:"#EBF7FF" },
  { id:"TW",  label:"Trabajo en equipo",               color:"#7D45A2", bg:"#F5EEFF" },
  { id:"EI",  label:"Inteligencia emocional",          color:"#E26500", bg:"#FFFAEA" },
  { id:"EM",  label:"Empatía y escucha activa",        color:"#00975C", bg:"#EAFAF1" },
  { id:"EPM", label:"Gestión efectiva del rendimiento",color:"#CB4644", bg:"#FFF0EE" },
  { id:"ACC", label:"Responsabilidad y propiedad",     color:"#0066B3", bg:"#EBF7FF" },
  { id:"INN", label:"Innovación",                      color:"#db2777", bg:"#FFF0F7" },
  { id:"DC",  label:"Conflicto y conversaciones",      color:"#d97706", bg:"#FFFBEB" },
];
const SKILL_MAP = Object.fromEntries(SKILLS.map(s => [s.id, s]));

// Mock assessment data
const MOCK_ASSESSMENTS = [
  { id:1, company:"Accenture Colombia",   skills:["COM","TW","EI","EM"],  responses:142, created:"2025-01-12", status:"published" },
  { id:2, company:"Bancolombia",          skills:["EPM","ACC","COM","TW"],responses:88,  created:"2025-01-28", status:"published" },
  { id:3, company:"Rappi",                skills:["INN","COM","DC","TW"], responses:31,  created:"2025-02-05", status:"staging"   },
  { id:4, company:"Grupo Éxito",          skills:["EM","EI","COM","ACC"], responses:0,   created:"2025-02-18", status:"staging"   },
  { id:5, company:"Avianca",              skills:["DC","EPM","ACC","TW"], responses:203, created:"2024-12-01", status:"deprecated" },
  { id:6, company:"Tecnoglass",           skills:["INN","EI","DC","EM"],  responses:57,  created:"2025-02-22", status:"published" },
];

const ASS_STATUS = {
  published:  { label:"Publicado",  bg:BDS.emerald[100], color:BDS.emerald[600], border:"#A7E3C9" },
  staging:    { label:"En pruebas", bg:BDS.primary[50],  color:BDS.primary[600], border:BDS.primary[200] },
  deprecated: { label:"Cerrado",    bg:BDS.neutral[100], color:BDS.neutral[500], border:BDS.neutral[300] },
};

// 28 assessment questions seeded — mapped to skills
const ASSESSMENT_QUESTIONS = [
  { id:1,  skill:"COM", text:"Expreso mis ideas con claridad, adaptando mi mensaje al interlocutor." },
  { id:2,  skill:"COM", text:"Escucho activamente antes de responder en una conversación." },
  { id:3,  skill:"COM", text:"Me comunico de forma asertiva cuando tengo una opinión diferente." },
  { id:4,  skill:"TW",  text:"Contribuyo de manera equitativa con los objetivos del equipo." },
  { id:5,  skill:"TW",  text:"Confío en que mis compañeros cumplirán sus responsabilidades." },
  { id:6,  skill:"TW",  text:"Ofrezco apoyo a un compañero cuando identifica dificultades." },
  { id:7,  skill:"EI",  text:"Reconozco mis emociones y las gestiono antes de reaccionar." },
  { id:8,  skill:"EI",  text:"Mantengo la calma en situaciones de alta presión o incertidumbre." },
  { id:9,  skill:"EI",  text:"Puedo identificar el estado emocional de mis colegas por su lenguaje no verbal." },
  { id:10, skill:"EM",  text:"Me pongo en el lugar del otro antes de emitir un juicio." },
  { id:11, skill:"EM",  text:"Hago preguntas para comprender la perspectiva de la otra persona." },
  { id:12, skill:"EM",  text:"Las personas con quienes trabajo sienten que las escucho genuinamente." },
  { id:13, skill:"EPM", text:"Establezco expectativas claras de desempeño con mi equipo." },
  { id:14, skill:"EPM", text:"Doy retroalimentación oportuna y constructiva a las personas que acompaño." },
  { id:15, skill:"EPM", text:"Identifico a tiempo cuando alguien del equipo necesita soporte adicional." },
  { id:16, skill:"ACC", text:"Asumo la responsabilidad de mis errores sin desviar la culpa." },
  { id:17, skill:"ACC", text:"Cumplo mis compromisos en los tiempos acordados." },
  { id:18, skill:"ACC", text:"Tomo la iniciativa sin necesidad de que me lo indiquen." },
  { id:19, skill:"INN", text:"Propongo nuevas ideas incluso cuando hay incertidumbre sobre su resultado." },
  { id:20, skill:"INN", text:"Cuestiono procesos establecidos cuando creo que pueden mejorar." },
  { id:21, skill:"INN", text:"Experimento y aprendo rápidamente de los fracasos." },
  { id:22, skill:"DC",  text:"Abordo los conflictos de forma directa y con respeto." },
  { id:23, skill:"DC",  text:"Facilito conversaciones difíciles dentro del equipo sin desviarlas." },
  { id:24, skill:"DC",  text:"Busco acuerdos que beneficien a todas las partes en un desacuerdo." },
  { id:25, skill:"COM", text:"Adapto mi estilo de comunicación según el canal (escrito, verbal, digital)." },
  { id:26, skill:"EI",  text:"Soy consciente de cómo mi estado emocional afecta mi rendimiento." },
  { id:27, skill:"ACC", text:"Hago seguimiento activo a mis metas sin esperar que alguien me lo recuerde." },
  { id:28, skill:"INN", text:"Creo un ambiente donde los demás se sienten seguros para expresar ideas." },
];

const LIKERT = [
  { value:1, label:"Muy en desacuerdo" },
  { value:2, label:"En desacuerdo"     },
  { value:3, label:"Neutral"           },
  { value:4, label:"De acuerdo"        },
  { value:5, label:"Muy de acuerdo"    },
];

// Seed respondents for assessment
const FIRST_NAMES_A = ["Valentina","Carlos","Sofía","Andrés","Isabella","Miguel","Camila","Diego","Natalia","Sebastián","María","Luis","Ana","Ricardo","Daniela"];
const LAST_NAMES_A  = ["García","López","Martínez","Rodríguez","Torres","Hernández","Reyes","Morales","Castro","Vargas","Díaz","Ramírez","Jiménez","Ruiz","Flores"];
const JOBS = ["Desarrollador de software","Product Manager","Diseñador UX","Líder de ventas","Analista de datos","Coordinador de RRHH","Gerente de proyectos","Consultor estratégico","Ingeniero de QA","Marketing Manager"];
const AGE_RANGES = ["18–25","26–35","36–45","46–55","55+"];

const generateAssessmentRespondents = (assessment, count=40) => {
  const rand = seededRand(assessment.id * 71 + 13);
  return Array.from({ length:count }, (_,i) => {
    const fn = FIRST_NAMES_A[Math.floor(rand()*FIRST_NAMES_A.length)];
    const ln = LAST_NAMES_A[Math.floor(rand()*LAST_NAMES_A.length)];
    const gender = rand() > 0.45 ? (rand() > 0.12 ? "Masculino" : "No binario") : "Femenino";
    const ageRange = AGE_RANGES[Math.floor(rand()*AGE_RANGES.length)];
    const job = JOBS[Math.floor(rand()*JOBS.length)];
    const base = new Date("2025-01-15");
    base.setDate(base.getDate() + Math.floor(rand() * 50));
    // Answers: each question gets a seeded score 1-5
    const answers = ASSESSMENT_QUESTIONS.map(q => ({
      qId: q.id,
      skill: q.skill,
      value: Math.max(1, Math.min(5, Math.round(rand() * 4 + 1))),
    }));
    // Top 2-4 selected skills
    const nSelected = 2 + Math.floor(rand() * 3);
    const shuffled = [...SKILLS].sort(() => rand() - 0.5);
    const selected = shuffled.slice(0, nSelected).map(s => s.id);
    return {
      id: `ASS-${String(assessment.id * 1000 + i + 1).padStart(5,"0")}`,
      name: `${fn} ${ln}`,
      gender,
      ageRange,
      job,
      date: base.toLocaleDateString("es-MX", { day:"numeric", month:"short", year:"numeric" }),
      answers,
      selectedSkills: selected,
    };
  });
};

// Compute average skill scores from respondents
const computeSkillScores = (respondents) => {
  const totals = {}, counts = {};
  SKILLS.forEach(s => { totals[s.id] = 0; counts[s.id] = 0; });
  respondents.forEach(r => {
    r.answers.forEach(a => { totals[a.skill] += a.value; counts[a.skill]++; });
  });
  return SKILLS.map(s => ({
    ...s,
    score: counts[s.id] ? Math.round((totals[s.id] / counts[s.id]) * 20) : 0, // scale to 100
    avg:   counts[s.id] ? (totals[s.id] / counts[s.id]).toFixed(1) : "0.0",
  }));
};

// ─── SKILL TAG ────────────────────────────────────────────────────────────────
const SkillTag = ({ skillId }) => {
  const s = SKILL_MAP[skillId];
  if (!s) return null;
  return (
    <span style={{
      fontSize:10, fontWeight:700, padding:"2px 7px", borderRadius:4,
      background:s.bg, color:s.color,
      border:`1px solid ${s.color}30`,
      fontFamily:"'DM Mono', monospace",
      letterSpacing:"0.02em",
    }}>{s.id}</span>
  );
};

// ─── ASSESSMENT STATUS BADGE ──────────────────────────────────────────────────
const AssStatusBadge = ({ status }) => {
  const cfg = ASS_STATUS[status] || ASS_STATUS.staging;
  return (
    <span style={{
      fontSize:11, fontWeight:600, padding:"3px 9px", borderRadius:20,
      background:cfg.bg, color:cfg.color,
      border:`1px solid ${cfg.border}`,
    }}>{cfg.label}</span>
  );
};

// ─── ASSESSMENT LIST ──────────────────────────────────────────────────────────
const AssessmentList = ({ onSelect, onCreate }) => {
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const filters = [
    { key:"all", label:"Todos" },
    { key:"published",  label:"Publicados" },
    { key:"staging",    label:"En pruebas" },
    { key:"deprecated", label:"Cerrados"   },
  ];
  const filtered = filter === "all" ? MOCK_ASSESSMENTS : MOCK_ASSESSMENTS.filter(a => a.status === filter);
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleFilterChange = (key) => { setFilter(key); setPage(1); };

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%" }}>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:24 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:800, color:T.textPrimary, margin:0, letterSpacing:"-0.02em" }}>
            Assessment de habilidades
          </h1>
          <p style={{ fontSize:13, color:T.textMuted, margin:"4px 0 0" }}>
            {MOCK_ASSESSMENTS.length} formularios · {MOCK_ASSESSMENTS.filter(a=>a.status==="published").length} publicados
          </p>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <FilterButton filters={filters} current={filter} onChange={handleFilterChange}/>
          <button onClick={onCreate} style={{
            display:"flex", alignItems:"center", gap:8,
            padding:"9px 18px", borderRadius:8, border:"none",
            fontSize:13, fontWeight:700, color:"#fff", cursor:"pointer",
            background:BDS.primary[500],
            boxShadow:"0 2px 8px rgba(226,101,0,0.25)",
            fontFamily:"inherit", transition:"all 0.15s",
          }}>
            + Agregar formulario
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{ background:BDS.neutral["000"], borderRadius:12, border:`1px solid ${T.borderSoft}`, overflow:"hidden", boxShadow:"0 1px 3px rgba(12,10,9,0.06)", flex:1, minHeight:0, display:"flex", flexDirection:"column", overflowY:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
          <thead>
            <tr style={{ borderBottom:`1px solid ${T.borderSoft}`, background:BDS.neutral[50] }}>
              {["Empresa","Habilidades foco","Respuestas","Creado","Estado"].map(h => (
                <th key={h} style={{ padding:"10px 16px", textAlign:"left", fontSize:11, fontWeight:700, color:T.textMuted, textTransform:"uppercase", letterSpacing:"0.07em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map((a,i) => (
              <tr key={a.id}
                onClick={() => a.status !== "deprecated" && onSelect(a)}
                style={{
                  borderBottom: i < paged.length-1 ? `1px solid ${T.borderSoft}` : "none",
                  cursor: a.status === "deprecated" ? "default" : "pointer",
                  opacity: a.status === "deprecated" ? 0.55 : 1,
                  transition:"background 0.12s",
                }}
                onMouseEnter={e => { if(a.status!=="deprecated") e.currentTarget.style.background = BDS.neutral[50]; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
              >
                <td style={{ padding:"13px 16px", fontWeight:600, color:T.textPrimary, maxWidth:180, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{a.company}</td>
                <td style={{ padding:"13px 16px" }}>
                  <div style={{ display:"flex", gap:4, flexWrap:"nowrap", alignItems:"center" }}>
                    {a.skills.slice(0, 2).map(sid => <SkillTag key={sid} skillId={sid}/>)}
                    {a.skills.length > 2 && (
                      <span style={{ fontSize:10, fontWeight:700, padding:"2px 6px", borderRadius:4, background:BDS.neutral[100], color:T.textMuted, fontFamily:"'DM Mono', monospace", flexShrink:0 }}>+{a.skills.length - 2}</span>
                    )}
                  </div>
                </td>
                <td style={{ padding:"13px 16px", fontFamily:"'DM Mono', monospace", fontWeight:700, color:T.textPrimary }}>{a.responses.toLocaleString()}</td>
                <td style={{ padding:"13px 16px", fontSize:12, color:T.textMuted, whiteSpace:"nowrap" }}>{a.created}</td>
                <td style={{ padding:"13px 16px" }}><AssStatusBadge status={a.status}/></td>
              </tr>
            ))}
          </tbody>
        </table>
        <TablePagination total={filtered.length} page={page} pageSize={pageSize}
          onPageChange={p => setPage(p)} onPageSizeChange={s => { setPageSize(s); setPage(1); }}/>
      </div>
    </div>
  );
};


const ASSESSMENT_SYSTEM_PROMPT = "Eres un experto en desarrollo de habilidades blandas para organizaciones. Genera entre 25 y 28 preguntas de assessment en español para medir las habilidades blandas, basado en el contexto del usuario. Habilidades: COM (Comunicación), TW (Trabajo en equipo), EI (Inteligencia emocional), EM (Empatía), EPM (Gestión del rendimiento), ACC (Responsabilidad), INN (Innovación), DC (Conversaciones difíciles). Cada pregunta tipo Likert 1-5. Responde SOLO JSON sin texto extra. Formato: {\"questions\":[{\"id\":1,\"skill\":\"COM\",\"text\":\"texto\"}]}";
// ─── ASSESSMENT BUILDER ───────────────────────────────────────────────────────
const AssessmentBuilder = ({ onBack }) => {
  const [step,      setStep]      = useState(0); // 0=prompt, 1=questions
  const [prompt,    setPrompt]    = useState("");
  const [loading,   setLoading]   = useState(false);
  const [questions, setQuestions] = useState(null);
  const [dragIdx,   setDragIdx]   = useState(null);
  const [dragOver,  setDragOver]  = useState(null);
  const [status,    setStatus]    = useState(null); // null | "staging" | "published"
  const [saving,    setSaving]    = useState(false);
  const [saved,     setSaved]     = useState(false);
  const textareaRef = useRef(null);
  const ASS_STEPS = ["Contexto", "Revisar preguntas"];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setQuestions(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:1000,
          system: ASSESSMENT_SYSTEM_PROMPT,
          messages:[{ role:"user", content:`Contexto de la empresa: ${prompt}` }],
        }),
      });
      const data = await res.json();
      const raw = data.content?.find(b => b.type==="text")?.text || "{}";
      const clean = raw.replace(/```json|```/g,"").trim();
      const parsed = JSON.parse(clean);
      const rawQs = parsed.questions || ASSESSMENT_QUESTIONS.slice(0,27);
      // Shuffle so no two consecutive questions share the same skill
      const shuffled = [...rawQs];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      // Resolve consecutive same-skill collisions
      for (let i = 1; i < shuffled.length; i++) {
        if (shuffled[i].skill === shuffled[i-1].skill) {
          const swapIdx = shuffled.findIndex((q, k) => k > i && q.skill !== shuffled[i-1].skill);
          if (swapIdx !== -1) [shuffled[i], shuffled[swapIdx]] = [shuffled[swapIdx], shuffled[i]];
        }
      }
      setQuestions(shuffled.map((q,i) => ({ ...q, id:i+1 })));
      setStep(1);
    } catch(e) {
      setQuestions(ASSESSMENT_QUESTIONS.slice(0,27).sort(() => Math.random()-0.5));
      setStep(1);
    }
    setLoading(false);
  };

  const handleDragStart = (e, idx) => { setDragIdx(idx); e.dataTransfer.effectAllowed="move"; };
  const handleDragOver  = (e, idx) => { e.preventDefault(); if(idx !== dragOver) setDragOver(idx); };
  const handleDrop      = (e, targetIdx) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === targetIdx) return;
    const next = [...questions];
    const [moved] = next.splice(dragIdx, 1);
    next.splice(targetIdx, 0, moved);
    setQuestions(next.map((q,i) => ({ ...q, id:i+1 })));
    setDragIdx(null); setDragOver(null);
  };

  const handlePublish = async (target) => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 900));
    setStatus(target);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{ maxWidth:760, margin:"0 auto" }}>
      {/* Back */}
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:4 }}>
        <div>
          <button onClick={onBack} style={{ display:"flex", alignItems:"center", gap:6, background:"none", border:"none", cursor:"pointer", fontSize:12, color:T.textMuted, fontFamily:"inherit", marginBottom:8, padding:0 }}>
            ← Volver
          </button>
          <h1 style={{ fontSize:22, fontWeight:800, color:T.textPrimary, margin:"0 0 4px", letterSpacing:"-0.02em" }}>
            Nuevo formulario de assessment
          </h1>
          <p style={{ fontSize:13, color:T.textMuted, margin:"0 0 20px" }}>
            Describe las necesidades de la empresa y generaremos preguntas enfocadas en las 8 habilidades.
          </p>
        </div>
        {step === 1 && (
          <button onClick={() => { setStep(0); setQuestions(null); setStatus(null); }}
            style={{ fontSize:12, color:T.textMuted, background:"none", border:`1px solid ${T.borderBase}`, borderRadius:8, padding:"6px 12px", cursor:"pointer", fontFamily:"inherit", fontWeight:600, flexShrink:0 }}>
            ← Volver a configurar
          </button>
        )}
      </div>
      <BuilderStepper steps={ASS_STEPS} current={step}/>

      {/* ── STEP 0: Prompt ── */}
      {step === 0 && (
        <div style={{ animation:"fadeUp 0.2s ease" }}>
          <div style={{ background:BDS.neutral["000"], borderRadius:12, border:`1px solid ${T.borderSoft}`, padding:20, marginBottom:20, boxShadow:"0 1px 3px rgba(12,10,9,0.06)" }}>
            <p style={{ fontSize:12, fontWeight:600, color:T.textMuted, textTransform:"uppercase", letterSpacing:"0.07em", margin:"0 0 12px" }}>
              Contexto de la empresa
            </p>
            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="Ej: Somos una empresa de tecnología de 200 personas. Necesitamos mejorar la comunicación entre equipos remotos y fortalecer el liderazgo en mandos medios. Hay tensiones en los equipos cross-funcionales y queremos detectar brechas en empatía y gestión del rendimiento..."
              style={{
                width:"100%", minHeight:140, resize:"vertical",
                fontSize:13, lineHeight:1.6, color:T.textPrimary,
                background:"transparent", border:`1px solid ${T.borderSoft}`,
                borderRadius:8, padding:"12px 14px", fontFamily:"inherit",
                outline:"none", transition:"border 0.15s",
              }}
              onFocus={e => { e.target.style.borderColor = BDS.primary[500]; e.target.style.boxShadow = `0 0 0 3px rgba(226,101,0,0.10)`; }}
              onBlur={e  => { e.target.style.borderColor = T.borderSoft;     e.target.style.boxShadow = "none"; }}
            />
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || loading}
              style={{
                width:"100%", marginTop:16, padding:"12px", borderRadius:8, border:"none",
                fontSize:14, fontWeight:700, cursor: prompt.trim() ? "pointer" : "not-allowed",
                fontFamily:"inherit", transition:"all 0.15s",
                background: prompt.trim() ? BDS.primary[500] : BDS.neutral[200],
                color: prompt.trim() ? "#fff" : T.textMuted,
                boxShadow: prompt.trim() ? "0 2px 8px rgba(226,101,0,0.25)" : "none",
              }}>
              {loading ? "Generando preguntas..." : "Generar preguntas con IA →"}
            </button>
          </div>
          {loading && (
            <div style={{ textAlign:"center", padding:"48px 0", color:T.textMuted }}>
              <div style={{ width:32, height:32, borderRadius:"50%", border:`3px solid ${BDS.neutral[200]}`, borderTopColor:BDS.primary[500], animation:"spin 0.8s linear infinite", margin:"0 auto 16px" }}/>
              <p style={{ fontSize:13, margin:0 }}>Analizando el contexto y generando preguntas...</p>
            </div>
          )}
        </div>
      )}

      {/* ── STEP 1: Questions list ── */}
      {step === 1 && questions && !loading && (
        <div>
          {/* Status bar */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <p style={{ fontSize:13, fontWeight:700, color:T.textPrimary, margin:0 }}>{questions.length} preguntas generadas</p>
              {status && <AssStatusBadge status={status}/>}
            </div>
            <button onClick={() => { setQuestions(null); setStatus(null); }} style={{ fontSize:12, color:T.textMuted, background:"none", border:"none", cursor:"pointer", fontFamily:"inherit" }}>
              Regenerar
            </button>
          </div>

          {/* Question cards (draggable) */}
          <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:20 }}>
            {questions.map((q, idx) => {
              const s = SKILL_MAP[q.skill];
              const isDraggingOver = dragOver === idx;
              return (
                <div key={q.id}
                  draggable
                  onDragStart={e => handleDragStart(e, idx)}
                  onDragOver={e  => handleDragOver(e, idx)}
                  onDrop={e     => handleDrop(e, idx)}
                  onDragEnd={() => { setDragIdx(null); setDragOver(null); }}
                  style={{
                    background: BDS.neutral["000"],
                    borderRadius: 10,
                    border: `1px solid ${isDraggingOver ? BDS.primary[400] : T.borderSoft}`,
                    padding:"14px 16px",
                    display:"flex", alignItems:"flex-start", gap:12,
                    cursor:"grab",
                    boxShadow: isDraggingOver ? `0 4px 12px rgba(226,101,0,0.12)` : "0 1px 2px rgba(12,10,9,0.04)",
                    transition:"box-shadow 0.12s, border-color 0.12s",
                    opacity: dragIdx === idx ? 0.4 : 1,
                  }}>
                  {/* Drag handle */}
                  <div style={{ color:BDS.neutral[300], fontSize:16, lineHeight:1, paddingTop:2, flexShrink:0, userSelect:"none" }}>⠿</div>
                  {/* Number */}
                  <span style={{ fontSize:11, fontWeight:700, color:T.textMuted, fontFamily:"'DM Mono', monospace", width:22, flexShrink:0, paddingTop:2 }}>{idx+1}</span>
                  {/* Text */}
                  <div style={{ flex:1 }}>
                    <p style={{ fontSize:13, color:T.textPrimary, margin:"0 0 6px", lineHeight:1.5 }} dir={isRTL(q.text)?"rtl":"ltr"}>{q.text}</p>
                    <SkillTag skillId={q.skill}/>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Likert preview */}
          <div style={{ background:BDS.neutral[50], borderRadius:10, border:`1px solid ${T.borderSoft}`, padding:"14px 16px", marginBottom:24 }}>
            <p style={{ fontSize:11, fontWeight:600, color:T.textMuted, textTransform:"uppercase", letterSpacing:"0.07em", margin:"0 0 10px" }}>Opciones de respuesta (Likert)</p>
            <div style={{ display:"flex", gap:8 }}>
              {LIKERT.map(l => (
                <div key={l.value} style={{ flex:1, textAlign:"center", background:BDS.neutral["000"], borderRadius:8, padding:"8px 4px", border:`1px solid ${T.borderSoft}` }}>
                  <p style={{ fontSize:16, fontWeight:800, color:T.textPrimary, fontFamily:"'DM Mono', monospace", margin:0, lineHeight:1 }}>{l.value}</p>
                  <p style={{ fontSize:9, color:T.textMuted, margin:"4px 0 0", lineHeight:1.3 }}>{l.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={() => handlePublish("staging")} disabled={saving || status==="published"} style={{
              flex:1, padding:"11px", borderRadius:8, border:`1px solid ${T.borderBase}`,
              fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit",
              background: status==="staging" ? BDS.primary[50] : BDS.neutral["000"],
              color: status==="staging" ? BDS.primary[600] : T.textPrimary,
              transition:"all 0.15s",
            }}>
              {saving && status!=="published" ? "Enviando..." : status==="staging" ? "En pruebas" : "Enviar a staging"}
            </button>
            <button onClick={() => handlePublish("published")} disabled={saving} style={{
              flex:2, padding:"11px", borderRadius:8, border:"none",
              fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit",
              background: saved && status==="published" ? BDS.emerald[600] : BDS.primary[500],
              color:"#fff",
              boxShadow:"0 2px 8px rgba(226,101,0,0.25)",
              transition:"all 0.15s",
            }}>
              {saving && status==="published" ? "Publicando..." : saved && status==="published" ? "Publicado" : "Publicar formulario"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── ASSESSMENT OVERVIEW ──────────────────────────────────────────────────────
const AssessmentOverview = ({ assessment, onBack }) => {
  const [tab, setTab] = useState("overview");
  const [sidesheet, setSidesheet] = useState(null);
  const [assPage, setAssPage] = useState(1);
  const [assPageSize, setAssPageSize] = useState(25);

  const respondents = generateAssessmentRespondents(assessment, assessment.responses || 40);
  const skillScores = computeSkillScores(respondents);

  // Radar data
  const radarData = skillScores.map(s => ({ skill:s.id, label:s.label, score:s.score, fullMark:100 }));

  // Top skill (highest avg)
  const topSkill = skillScores.reduce((a,b) => a.score > b.score ? a : b);
  const lowSkill = skillScores.reduce((a,b) => a.score < b.score ? a : b);

  // Gender distribution
  const genderCounts = respondents.reduce((acc,r) => { acc[r.gender] = (acc[r.gender]||0)+1; return acc; }, {});
  const genderData = Object.entries(genderCounts).map(([name,value]) => ({ name, value }));
  const genderColors = { Masculino:BDS.secondary[500], Femenino:"#ec4899", "No binario":"#8b5cf6" };

  // Age distribution
  const ageCounts = AGE_RANGES.reduce((acc, r) => { acc[r] = respondents.filter(p=>p.ageRange===r).length; return acc; }, {});
  const ageData = AGE_RANGES.map(r => ({ range:r, count:ageCounts[r]||0, fill:BDS.primary[500] }));

  // Job distribution (top 5)
  const jobCounts = respondents.reduce((acc,r) => { acc[r.job]=(acc[r.job]||0)+1; return acc; }, {});
  const jobData = Object.entries(jobCounts).sort((a,b)=>b[1]-a[1]).slice(0,6).map(([job,count]) => ({ job, count }));
  const maxJob = Math.max(...jobData.map(j=>j.count));

  const TABS = [
    { key:"overview",     label:"Overview"   },
    { key:"respondents",  label:"Respuestas" },
    ...(assessment.status === "published" ? [{ key:"questions", label:"Preguntas" }] : []),
  ];

  return (
    <div style={{ position:"relative", display:"flex", flexDirection:"column", height:"100%" }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:24 }}>
        <div>
          <button onClick={onBack} style={{ display:"flex", alignItems:"center", gap:6, background:"none", border:"none", cursor:"pointer", fontSize:12, color:T.textMuted, fontFamily:"inherit", marginBottom:8, padding:0 }}>
            ← Volver al listado
          </button>
          <h1 style={{ fontSize:22, fontWeight:800, color:T.textPrimary, margin:0, letterSpacing:"-0.02em" }}>{assessment.company}</h1>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:6 }}>
            <AssStatusBadge status={assessment.status}/>
            <span style={{ fontSize:12, color:T.textMuted }}>Creado {assessment.created}</span>
          </div>
        </div>
        {/* KPI pills */}
        <div style={{ display:"flex", gap:12 }}>
          {[
            { label:"Respuestas", value:respondents.length.toLocaleString(), accent:T.textPrimary },
            { label:"Habilidad alta",  value:topSkill.id, accent:SKILL_MAP[topSkill.id]?.color },
            { label:"Habilidad baja",  value:lowSkill.id, accent:BDS.red[600] },
          ].map(k => (
            <div key={k.label} style={{ background:BDS.neutral["000"], borderRadius:10, border:`1px solid ${T.borderSoft}`, padding:"10px 16px", textAlign:"center", minWidth:80 }}>
              <p style={{ fontSize:18, fontWeight:800, color:k.accent, fontFamily:"'DM Mono', monospace", margin:0, lineHeight:1 }}>{k.value}</p>
              <p style={{ fontSize:10, color:T.textMuted, margin:"4px 0 0", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.06em" }}>{k.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tab nav */}
      <div style={{ display:"flex", gap:2, borderBottom:`1px solid ${T.borderSoft}`, marginBottom:24 }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding:"10px 16px", border:"none", background:"none", cursor:"pointer",
            fontSize:13, fontWeight:600, fontFamily:"inherit", transition:"all 0.15s",
            color:      tab===t.key ? BDS.primary[600]  : T.textMuted,
            borderBottom: tab===t.key ? `2px solid ${BDS.primary[500]}` : "2px solid transparent",
            marginBottom: -1,
          }}>{t.label}</button>
        ))}
      </div>

      {/* ── Tab: Overview ── */}
      {tab==="overview" && (
        <div style={{ display:"flex", flexDirection:"column", gap:16, animation:"fadeUp 0.25s ease" }}>

          {/* Row 1: Spider + Skill bars */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>

            <ChartCard title="Perfil de habilidades">
              <ResponsiveContainer width="100%" height={260}>
                <RadarChart data={radarData} margin={{ top:10, right:20, bottom:10, left:20 }}>
                  <PolarGrid stroke={BDS.neutral[200]}/>
                  <PolarAngleAxis dataKey="skill" tick={{ fill:T.textMuted, fontSize:11, fontFamily:"DM Mono, monospace", fontWeight:700 }}/>
                  <PolarRadiusAxis domain={[0,100]} tick={false} axisLine={false}/>
                  <Radar name="Habilidades" dataKey="score" stroke={BDS.primary[500]} fill={BDS.primary[500]} fillOpacity={0.18} strokeWidth={2}/>
                  <Tooltip content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload;
                    return (
                      <div style={{ background:BDS.neutral[900], color:"#fff", borderRadius:8, padding:"8px 12px", fontSize:12 }}>
                        <p style={{ margin:0, fontWeight:700 }}>{d.label}</p>
                        <p style={{ margin:"2px 0 0", fontFamily:"'DM Mono', monospace" }}>{d.score}/100</p>
                      </div>
                    );
                  }}/>
                </RadarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Puntaje por habilidad">
              <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
                {skillScores.sort((a,b)=>b.score-a.score).map(s => (
                  <div key={s.id} style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <span style={{ width:32, fontSize:10, fontWeight:700, color:s.color, fontFamily:"'DM Mono', monospace", flexShrink:0 }}>{s.id}</span>
                    <div style={{ flex:1, height:8, background:BDS.neutral[100], borderRadius:4, overflow:"hidden" }}>
                      <div style={{ height:"100%", width:`${s.score}%`, background:s.color, borderRadius:4, transition:"width 0.5s ease" }}/>
                    </div>
                    <span style={{ fontSize:11, fontWeight:700, color:s.color, fontFamily:"'DM Mono', monospace", width:36, textAlign:"right", flexShrink:0 }}>{s.avg}/5</span>
                  </div>
                ))}
              </div>
            </ChartCard>
          </div>

          {/* Row 2: Demographics */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>

            <ChartCard title="Género">
              <ResponsiveContainer width="100%" height={120}>
                <PieChart>
                  <Pie data={genderData} cx="50%" cy="50%" innerRadius={30} outerRadius={46} dataKey="value" paddingAngle={3}>
                    {genderData.map((e,i) => <Cell key={i} fill={genderColors[e.name]||BDS.neutral[300]}/>)}
                  </Pie>
                  <Tooltip content={<ChartTooltip unit=" personas"/>}/>
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:"4px 8px", marginTop:4 }}>
                {genderData.map(e => (
                  <div key={e.name} style={{ display:"flex", alignItems:"center", gap:3, fontSize:10, color:T.textMuted }}>
                    <span style={{ width:5, height:5, borderRadius:2, background:genderColors[e.name]||BDS.neutral[300], flexShrink:0 }}/>
                    {e.name}
                  </div>
                ))}
              </div>
            </ChartCard>

            <ChartCard title="Rango de edad">
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={ageData} margin={{ top:4, right:4, bottom:0, left:-24 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={BDS.neutral[100]} vertical={false}/>
                  <XAxis dataKey="range" tick={{ fill:T.textMuted, fontSize:9 }} axisLine={false} tickLine={false}/>
                  <YAxis tick={{ fill:T.textMuted, fontSize:9 }} axisLine={false} tickLine={false}/>
                  <Tooltip content={<ChartTooltip unit=" personas"/>}/>
                  <Bar dataKey="count" name="Personas" radius={[3,3,0,0]} fill={BDS.secondary[500]}/>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Profesión">
              <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
                {jobData.map(j => (
                  <div key={j.job} style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ fontSize:10, color:T.textMuted, flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{j.job}</span>
                    <div style={{ width:52, height:5, background:BDS.neutral[100], borderRadius:3, overflow:"hidden", flexShrink:0 }}>
                      <div style={{ height:"100%", width:`${(j.count/maxJob)*100}%`, background:BDS.primary[500], borderRadius:3 }}/>
                    </div>
                    <span style={{ fontSize:10, fontWeight:700, color:T.textPrimary, fontFamily:"'DM Mono', monospace", width:20, textAlign:"right", flexShrink:0 }}>{j.count}</span>
                  </div>
                ))}
              </div>
            </ChartCard>
          </div>
        </div>
      )}

      {/* ── Tab: Respondents ── */}
      {tab==="respondents" && (() => {
        const pagedResp = respondents.slice((assPage - 1) * assPageSize, assPage * assPageSize);
        return (
        <div style={{ animation:"fadeUp 0.25s ease", flex:1, minHeight:0, display:"flex", flexDirection:"column" }}>
          <div style={{ background:BDS.neutral["000"], borderRadius:12, border:`1px solid ${T.borderSoft}`, overflow:"hidden", boxShadow:"0 1px 3px rgba(12,10,9,0.04)", flex:1, minHeight:0, display:"flex", flexDirection:"column", overflowY:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
              <thead>
                <tr style={{ borderBottom:`1px solid ${T.borderSoft}`, background:BDS.neutral[50] }}>
                  {["ID","Nombre","Género","Edad","Profesión","Habilidades elegidas","Fecha"].map(h => (
                    <th key={h} style={{ padding:"10px 14px", textAlign:"left", fontSize:11, fontWeight:700, color:T.textMuted, textTransform:"uppercase", letterSpacing:"0.07em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pagedResp.map((r, i) => (
                  <tr key={r.id}
                    onClick={() => setSidesheet(r)}
                    style={{
                      borderBottom: i < pagedResp.length-1 ? `1px solid ${T.borderSoft}` : "none",
                      cursor:"pointer", transition:"background 0.12s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = BDS.neutral[50]; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                  >
                    <td style={{ padding:"11px 14px", fontSize:11, color:T.textMuted, fontFamily:"'DM Mono', monospace", whiteSpace:"nowrap" }}>{r.id}</td>
                    <td style={{ padding:"11px 14px", fontWeight:600, color:T.textPrimary, maxWidth:140, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{r.name}</td>
                    <td style={{ padding:"11px 14px", fontSize:12, color:T.textMuted, whiteSpace:"nowrap" }}>{r.gender}</td>
                    <td style={{ padding:"11px 14px", fontSize:12, color:T.textMuted, whiteSpace:"nowrap" }}>{r.ageRange}</td>
                    <td style={{ padding:"11px 14px", fontSize:12, color:T.textMuted, maxWidth:160, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{r.job}</td>
                    <td style={{ padding:"11px 14px" }}>
                      <div style={{ display:"flex", gap:4, flexWrap:"nowrap", alignItems:"center" }}>
                        {r.selectedSkills.slice(0, 2).map(sid => <SkillTag key={sid} skillId={sid}/>)}
                        {r.selectedSkills.length > 2 && (
                          <span style={{ fontSize:10, fontWeight:700, padding:"2px 6px", borderRadius:4, background:BDS.neutral[100], color:T.textMuted, fontFamily:"'DM Mono', monospace", flexShrink:0 }}>+{r.selectedSkills.length - 2}</span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding:"11px 14px", fontSize:12, color:T.textMuted }}>{r.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <TablePagination total={respondents.length} page={assPage} pageSize={assPageSize}
              onPageChange={p => setAssPage(p)} onPageSizeChange={s => { setAssPageSize(s); setAssPage(1); }}/>
          </div>
        </div>
        );
      })()}

      {/* ── Tab: Questions (published only) ── */}
      {tab==="questions" && assessment.status === "published" && (() => {
        // Get questions relevant to this assessment's skills
        const assQuestions = ASSESSMENT_QUESTIONS.filter(q => assessment.skills.includes(q.skill));

        // Generate mock branching data based on question skill type
        const branchData = {};
        assQuestions.forEach((q, idx) => {
          // Some questions (scale-like) have branching: if score ≤ 2, go to a follow-up path
          if (idx % 3 === 0 && idx + 2 < assQuestions.length) {
            branchData[q.id] = {
              condition: "Si responde 1 o 2 (negativo)",
              pathA: { label:"Ruta A — Respuesta positiva (3–5)", targetIdx: idx + 1, color: BDS.emerald[600], bg: BDS.emerald[100] },
              pathB: { label:"Ruta B — Respuesta negativa (1–2)", targetIdx: idx + 2, color: BDS.red[600], bg: BDS.red[100] },
            };
          }
        });

        return (
          <div style={{ animation:"fadeUp 0.25s ease" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
              <p style={{ fontSize:14, fontWeight:600, color:T.textPrimary, margin:0 }}>
                {assQuestions.length} preguntas
                <span style={{ marginLeft:8, fontSize:12, fontWeight:400, color:T.textMuted }}>· {Object.keys(branchData).length} con ramificación</span>
              </p>
              <div style={{
                display:"flex", alignItems:"center", gap:6, padding:"6px 12px", borderRadius:8, fontSize:12, fontWeight:600,
                background:BDS.neutral[50], border:`1px solid ${T.borderSoft}`, color:T.textMuted,
              }}>
                🔒 Solo lectura
              </div>
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {assQuestions.map((q, idx) => {
                const s = SKILL_MAP[q.skill];
                const branch = branchData[q.id];
                return (
                  <div key={q.id}>
                    <div style={{
                      background:BDS.neutral["000"], borderRadius:12,
                      border:`1px solid ${T.borderSoft}`,
                      boxShadow:"0 1px 2px rgba(12,10,9,0.04)",
                      display:"flex", transition:"all 0.15s",
                    }}>
                      {/* Order */}
                      <div style={{
                        display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"0 16px",
                        borderRight:`1px solid ${T.borderSoft}`, borderRadius:"12px 0 0 12px", flexShrink:0,
                        background:"rgba(250,250,249,0.6)",
                      }}>
                        <span style={{ fontSize:12, fontWeight:900, color:T.textMuted, fontFamily:"'DM Mono', monospace" }}>{String(idx + 1).padStart(2,"0")}</span>
                      </div>
                      {/* Content */}
                      <div style={{ flex:1, padding:16, minWidth:0 }}>
                        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12 }}>
                          <p style={{ fontSize:14, fontWeight:600, color:T.textPrimary, lineHeight:1.4, flex:1, margin:0 }}>{q.text}</p>
                          <div style={{ display:"flex", alignItems:"center", gap:6, flexShrink:0 }}>
                            {s && <span style={{ fontSize:10, fontWeight:700, padding:"2px 7px", borderRadius:4, background:s.bg, color:s.color, border:`1px solid ${s.color}30`, fontFamily:"'DM Mono', monospace" }}>{s.id} — {s.label}</span>}
                            <span style={{ display:"inline-flex", alignItems:"center", gap:4, fontSize:12, padding:"4px 8px", borderRadius:8, fontWeight:600, background:"#eff6ff", color:"#E26500" }}>⚖️ Likert 1–5</span>
                          </div>
                        </div>

                        {/* Branching visualization */}
                        {branch && (
                          <div style={{ marginTop:12, paddingTop:12, borderTop:`1px dashed ${BDS.neutral[200]}` }}>
                            <p style={{ fontSize:11, fontWeight:700, color:BDS.primary[600], margin:"0 0 8px" }}>
                              ↪ Ramificación: {branch.condition}
                            </p>
                            <div style={{ display:"flex", gap:10 }}>
                              {/* Path A */}
                              <div style={{
                                flex:1, borderRadius:8, padding:"10px 12px",
                                background:branch.pathA.bg, border:`1px solid ${branch.pathA.color}30`,
                                position:"relative",
                              }}>
                                <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:6 }}>
                                  <span style={{ width:8, height:8, borderRadius:"50%", background:branch.pathA.color, flexShrink:0 }}/>
                                  <span style={{ fontSize:11, fontWeight:700, color:branch.pathA.color }}>{branch.pathA.label}</span>
                                </div>
                                <p style={{ fontSize:11, color:T.textMuted, margin:0 }}>
                                  → Continúa a P{branch.pathA.targetIdx + 1}: <span style={{ fontStyle:"italic" }}>{assQuestions[branch.pathA.targetIdx]?.text.slice(0,50)}…</span>
                                </p>
                              </div>
                              {/* Path B */}
                              <div style={{
                                flex:1, borderRadius:8, padding:"10px 12px",
                                background:branch.pathB.bg, border:`1px solid ${branch.pathB.color}30`,
                                position:"relative",
                              }}>
                                <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:6 }}>
                                  <span style={{ width:8, height:8, borderRadius:"50%", background:branch.pathB.color, flexShrink:0 }}/>
                                  <span style={{ fontSize:11, fontWeight:700, color:branch.pathB.color }}>{branch.pathB.label}</span>
                                </div>
                                <p style={{ fontSize:11, color:T.textMuted, margin:0 }}>
                                  → Salta a P{branch.pathB.targetIdx + 1}: <span style={{ fontStyle:"italic" }}>{assQuestions[branch.pathB.targetIdx]?.text.slice(0,50)}…</span>
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {sidesheet && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setSidesheet(null)}
            style={{ position:"fixed", inset:0, background:"rgba(12,10,9,0.35)", zIndex:80, backdropFilter:"blur(2px)" }}
          />
          {/* Sheet */}
          <div style={{
            position:"fixed", top:0, right:0, bottom:0, width:440,
            background:BDS.neutral["000"], zIndex:90,
            boxShadow:"-8px 0 32px rgba(12,10,9,0.12)",
            display:"flex", flexDirection:"column",
            animation:"slideIn 0.25s ease",
          }}>
            <style>{`.ass-sheet-style { animation:slideIn 0.25s ease; } @keyframes slideIn { from{transform:translateX(100%);opacity:0} to{transform:translateX(0);opacity:1} }`}</style>

            {/* Sheet header */}
            <div style={{ padding:"20px 24px 16px", borderBottom:`1px solid ${T.borderSoft}`, flexShrink:0 }}>
              <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between" }}>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <div style={{ width:40, height:40, borderRadius:"50%", background:BDS.primary[100], display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:700, color:BDS.primary[600], flexShrink:0 }}>
                    {sidesheet.name.split(" ").map(n=>n[0]).join("").slice(0,2)}
                  </div>
                  <div>
                    <p style={{ fontSize:15, fontWeight:700, color:T.textPrimary, margin:0 }}>{sidesheet.name}</p>
                    <p style={{ fontSize:12, color:T.textMuted, margin:"2px 0 0" }}>{sidesheet.job} · {sidesheet.ageRange} · {sidesheet.gender}</p>
                  </div>
                </div>
                <button onClick={() => setSidesheet(null)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:18, color:T.textMuted, padding:4 }}>×</button>
              </div>
              {/* Selected skills */}
              <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginTop:12 }}>
                <span style={{ fontSize:11, color:T.textMuted, marginRight:4 }}>Eligió:</span>
                {sidesheet.selectedSkills.map(sid => <SkillTag key={sid} skillId={sid}/>)}
              </div>
              <p style={{ fontSize:11, color:T.textMuted, margin:"8px 0 0" }}>Respondido el {sidesheet.date} · {ASSESSMENT_QUESTIONS.length} preguntas</p>
            </div>

            {/* Answers list */}
            <div style={{ flex:1, overflowY:"auto", padding:"16px 24px" }}>
              {ASSESSMENT_QUESTIONS.map((q, i) => {
                const ans = sidesheet.answers.find(a => a.qId === q.id);
                const s = SKILL_MAP[q.skill];
                const v = ans?.value || 3;
                return (
                  <div key={q.id} style={{ marginBottom:16, paddingBottom:16, borderBottom: i < ASSESSMENT_QUESTIONS.length-1 ? `1px solid ${T.borderSoft}` : "none" }}>
                    <div style={{ display:"flex", alignItems:"flex-start", gap:8, marginBottom:8 }}>
                      <span style={{ fontSize:10, fontWeight:700, color:T.textMuted, fontFamily:"'DM Mono', monospace", width:18, flexShrink:0, paddingTop:1 }}>{i+1}</span>
                      <p style={{ fontSize:12, color:T.textPrimary, margin:0, lineHeight:1.5, flex:1 }}>{q.text}</p>
                      {s && <span style={{ fontSize:9, fontWeight:700, padding:"2px 6px", borderRadius:3, background:s.bg, color:s.color, border:`1px solid ${s.color}30`, fontFamily:"'DM Mono', monospace", flexShrink:0 }}>{s.id}</span>}
                    </div>
                    {/* Likert scale visual */}
                    <div style={{ display:"flex", gap:4, paddingLeft:26 }}>
                      {LIKERT.map(l => (
                        <div key={l.value} style={{
                          flex:1, height:28, borderRadius:5, display:"flex", alignItems:"center", justifyContent:"center",
                          background: v === l.value ? (s?.color || BDS.primary[500]) : BDS.neutral[100],
                          border: v === l.value ? "none" : `1px solid ${T.borderSoft}`,
                          transition:"all 0.15s",
                        }}>
                          <span style={{ fontSize:11, fontWeight:700, color: v === l.value ? "#fff" : T.textMuted, fontFamily:"'DM Mono', monospace" }}>{l.value}</span>
                        </div>
                      ))}
                    </div>
                    <p style={{ fontSize:10, color:T.textMuted, margin:"5px 0 0", paddingLeft:26 }}>{LIKERT.find(l=>l.value===v)?.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// ─── ASSESSMENT ROOT ──────────────────────────────────────────────────────────
const AssessmentPage = () => {
  const [view,       setView]       = useState("list");       // list | builder | overview
  const [selected,   setSelected]   = useState(null);

  const handleSelect = (assessment) => { setSelected(assessment); setView("overview"); };

  return (
    <>
      {view==="list"     && <AssessmentList onSelect={handleSelect} onCreate={() => setView("builder")}/>}
      {view==="builder"  && <AssessmentBuilder onBack={() => setView("list")}/>}
      {view==="overview" && selected && <AssessmentOverview assessment={selected} onBack={() => { setView("list"); setSelected(null); }}/>}
    </>
  );
};

// ════════════════════════════════════════════════════════════════════════════════
const PRODUCTS = [
  { id:"ileader", label:"iLeader" },
  { id:"allsenses", label:"All Your Senses" },
];

const getNavSections = (product) => [
  {
    label: "Product",
    items: [
      { id:"surveys",     label:"Surveys",        icon:NoteIcon,     page:"surveys"     },
      ...(product==="ileader" ? [{ id:"assessments", label:"Skill Forms", icon:BrainIcon, page:"assessments" }] : []),
      { id:"flags",       label:"Feature Flags",   icon:Flag01Icon,   page:"flags"       },
    ],
  },
  {
    label: "Settings",
    items: [
      { id:"settings", label:"Configuración",  icon:Settings01Icon, page:"settings" },
      { id:"team",     label:"Equipo",          icon:UserGroupIcon,  page:"team"     },
    ],
  },
];

const Sidebar = ({ page, setPage, view, goToSurveys, goToBuilder, product, setProduct }) => {
  const [productOpen, setProductOpen] = React.useState(false);
  const NAV_SECTIONS = getNavSections(product);
  return (
    <aside style={{
      width:224, flexShrink:0, background:BDS.secondary[950],
      minHeight:"100vh", position:"sticky", top:0, height:"100vh",
      overflow:"hidden", display:"flex", flexDirection:"column",
      borderRight:`1px solid rgba(255,255,255,0.06)`,
    }}>
      {/* Brand */}
      <div style={{
        padding:"0 16px", height:56, display:"flex", alignItems:"center",
        gap:10, borderBottom:"1px solid rgba(255,255,255,0.08)",
      }}>
        <div style={{
          width:28, height:28, borderRadius:8, background:BDS.primary[500],
          display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
        }}><HugeiconsIcon icon={BarCode01Icon} size={16} color="#fff" strokeWidth={2}/></div>
        <div style={{ minWidth:0 }}>
          <p style={{ fontWeight:700, color:BDS.neutral["000"], fontSize:13, margin:0, lineHeight:1.3, letterSpacing:"-0.01em" }}>Feedback Admin</p>
          <p style={{ fontSize:10, color:"rgba(255,255,255,0.4)", margin:0, lineHeight:1.3 }}>{PRODUCTS.find(p=>p.id===product)?.label} · Internal</p>
        </div>
      </div>

      {/* Product Selector */}
      <div style={{ padding:"12px 10px 0" }}>
        <div style={{ position:"relative" }}>
          <button
            onClick={() => setProductOpen(!productOpen)}
            style={{
              width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between",
              padding:"7px 10px", borderRadius:8,
              background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.08)",
              cursor:"pointer", fontFamily:"inherit", transition:"all 0.15s",
              color:BDS.neutral["000"],
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
          >
            <span style={{ fontSize:12, fontWeight:600 }}>{PRODUCTS.find(p=>p.id===product)?.label}</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: productOpen ? "rotate(180deg)" : "rotate(0deg)", transition:"transform 0.15s" }}>
              <path d="M3 4.5L6 7.5L9 4.5" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          {productOpen && (
            <div style={{
              position:"absolute", top:"calc(100% + 4px)", left:0, right:0, zIndex:50,
              background:BDS.secondary[900], border:"1px solid rgba(255,255,255,0.1)",
              borderRadius:8, padding:4, boxShadow:"0 8px 24px rgba(0,0,0,0.4)",
            }}>
              {PRODUCTS.map(p => (
                <button key={p.id}
                  onClick={() => { setProduct(p.id); setProductOpen(false); if(p.id!=="ileader" && page==="assessments") setPage("surveys"); }}
                  style={{
                    width:"100%", display:"flex", alignItems:"center", gap:8,
                    padding:"6px 10px", borderRadius:6, border:"none", cursor:"pointer",
                    background: product===p.id ? `rgba(${parseInt(BDS.primary[500].slice(1,3),16)},${parseInt(BDS.primary[500].slice(3,5),16)},${parseInt(BDS.primary[500].slice(5,7),16)},0.15)` : "transparent",
                    color: product===p.id ? BDS.primary[300] : "rgba(255,255,255,0.7)",
                    fontFamily:"inherit", fontSize:12, fontWeight: product===p.id ? 600 : 500,
                    transition:"all 0.12s",
                  }}
                  onMouseEnter={e => { if(product!==p.id) e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
                  onMouseLeave={e => { if(product!==p.id) e.currentTarget.style.background = "transparent"; }}
                >
                  {product===p.id && <span style={{ width:4, height:4, borderRadius:"50%", background:BDS.primary[400] }}/>}
                  {p.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex:1, padding:"12px 10px", overflowY:"auto" }}>
        {NAV_SECTIONS.map(section => (
          <div key={section.label} style={{ marginBottom:20 }}>
            <p style={{
              fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.3)",
              textTransform:"uppercase", letterSpacing:"0.1em",
              padding:"0 8px", margin:"0 0 6px",
            }}>{section.label}</p>
            {section.items.map(item => {
              const isActive = page===item.page;
              const isDisabled = item.page==="settings"||item.page==="team";
              return (
                <button key={item.id}
                  onClick={()=>{ if(!isDisabled) { setPage(item.page); if(item.page==="surveys") goToSurveys(); } }}
                  disabled={isDisabled}
                  style={{
                    width:"100%", display:"flex", alignItems:"center", gap:8,
                    padding:"8px 10px", borderRadius:8, border:"none", cursor: isDisabled?"not-allowed":"pointer",
                    marginBottom:2, transition:"all 0.15s",
                    background: isActive ? `rgba(${parseInt(BDS.primary[500].slice(1,3),16)},${parseInt(BDS.primary[500].slice(3,5),16)},${parseInt(BDS.primary[500].slice(5,7),16)},0.15)` : "transparent",
                    opacity: isDisabled ? 0.3 : 1,
                    color: isActive ? BDS.primary[300] : "rgba(255,255,255,0.6)",
                    fontFamily:"inherit",
                  }}
                  onMouseEnter={e => { if(!isActive && !isDisabled) e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
                  onMouseLeave={e => { if(!isActive) e.currentTarget.style.background = "transparent"; }}
                >
                  <span style={{ lineHeight:1, width:18, textAlign:"center", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <HugeiconsIcon icon={item.icon} size={16} color="currentColor" strokeWidth={1.8}/>
                  </span>
                  <span style={{ fontSize:13, fontWeight: isActive ? 600 : 500, flex:1, textAlign:"left" }}>{item.label}</span>
                  {isActive && <span style={{ width:5, height:5, borderRadius:"50%", background:BDS.primary[400], flexShrink:0 }}/>}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User */}
      <div style={{ padding:"10px", borderTop:"1px solid rgba(255,255,255,0.08)" }}>
        <div style={{
          display:"flex", alignItems:"center", gap:10, padding:"8px 10px",
          borderRadius:8, cursor:"pointer",
        }}>
          <div style={{
            width:28, height:28, borderRadius:"50%", background:BDS.primary[500],
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:11, fontWeight:700, color:"#fff", flexShrink:0,
          }}>LD</div>
          <div style={{ minWidth:0 }}>
            <p style={{ fontSize:12, fontWeight:600, color:BDS.neutral["000"], margin:0, lineHeight:1.3 }}>Leiver Díaz</p>
            <p style={{ fontSize:10, color:"rgba(255,255,255,0.4)", margin:0, lineHeight:1.3 }}>Admin</p>
          </div>
          <span style={{ marginLeft:"auto", color:"rgba(255,255,255,0.3)", fontSize:12, flexShrink:0 }}>⋯</span>
        </div>
      </div>
    </aside>
  );
};

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function FeedbackAdmin() {
  const [page,     setPage]     = useState("surveys"); // surveys | assessments | flags
  const [product,  setProduct]  = useState("ileader"); // ileader | allsenses
  const [view,     setView]     = useState("list");    // list | builder | overview
  const [selected, setSelected] = useState(null);
  const [tab,      setTab]      = useState("overview");

  const TAB_LABELS = { overview:"Overview", demographics:"Demografía", respondents:"Respuestas", questions:"Preguntas" };

  const handleSelect = (survey) => {
    setSelected(survey); setTab("overview"); setView("overview");
  };

  const goToSurveys = () => { setPage("surveys"); setView("list"); setSelected(null); };
  const goToBuilder = () => { setPage("surveys"); setView("builder"); };
  const goToList    = () => { setView("list"); setSelected(null); };

  const buildCrumbs = () => {
    const surveys = { label:"Surveys", onClick:goToSurveys };
    if (page==="flags") return [{ label:"Feature Flags", onClick:null }];
    if (view==="list")    return [surveys, { label:"Lista", onClick:null }];
    if (view==="builder") return [surveys, { label:"Constructor IA", onClick:null }];
    if (view==="overview"&&selected) return [
      surveys,
      { label:"Lista", onClick:goToSurveys },
      { label:selected.name, onClick:()=>setTab("overview") },
      { label:TAB_LABELS[tab], onClick:null },
    ];
    return [surveys];
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Inter:wght@400;500;600;700;800&display=swap');
        *,*::before,*::after { box-sizing:border-box; }
        body { margin:0; background:${BDS.neutral[100]}; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin   { to{transform:rotate(360deg)} }
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:${BDS.neutral[300]};border-radius:4px}
        .line-clamp-3{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
      `}</style>

      <div style={{ fontFamily:"'Inter', sans-serif", background:BDS.neutral[100], display:"flex", height:"100vh", overflow:"hidden" }}>

        {/* Sidebar */}
        <Sidebar
          page={page} setPage={setPage}
          view={view}
          goToSurveys={goToSurveys}
          goToBuilder={goToBuilder}
          product={product} setProduct={setProduct}
        />

        {/* Right panel */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0, height:"100vh", overflow:"hidden" }}>

          {/* Page content */}
          <main style={{ flex:1, padding:"32px", overflowY:"auto", overflowX:"hidden", display:"flex", flexDirection:"column" }}>
            <Breadcrumbs crumbs={buildCrumbs()}/>
            {page==="surveys" && (
              <>
                {view==="list"    && <SurveyList onSelect={handleSelect} onCreate={goToBuilder}/>}
                {view==="builder" && <SurveyBuilder onBack={goToList}/>}
                {view==="overview"&& selected && (
                  <SurveyOverview survey={selected} onBack={goToList} tab={tab} setTab={setTab}/>
                )}
              </>
            )}
            {page==="flags"       && <FeatureFlagsPage/>}
            {page==="assessments" && <AssessmentPage/>}
          </main>
        </div>
      </div>
    </>
  );
}
