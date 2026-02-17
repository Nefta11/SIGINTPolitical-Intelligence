import { ARCHETYPE_TAXONOMY } from '../constants/archetypes';

// Configuración de APIs
const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const AI_PROVIDER = import.meta.env.VITE_AI_PROVIDER || 'claude';
const API_MODE = import.meta.env.VITE_API_MODE || 'direct';
const PROXY_PORT = import.meta.env.VITE_PROXY_PORT || '3001';

// URLs y configuración por proveedor
const PROVIDERS = {
  claude: {
    url: 'https://api.anthropic.com/v1/messages',
    models: {
      large: 'claude-3-5-sonnet-20241022',
      small: 'claude-3-haiku-20240307'
    }
  },
  gemini: {
    url: 'https://generativelanguage.googleapis.com/v1beta/models',
    models: {
      large: 'gemini-1.5-pro',
      small: 'gemini-1.5-flash'
    }
  }
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function calculateBackoffDelay(attempt, baseDelay = 5000) {
  const delays = [5000, 15000, 45000, 90000, 180000];
  return delays[Math.min(attempt - 1, delays.length - 1)];
}

// Función principal que llama a Claude o Gemini según la configuración
export async function callAI(systemPrompt, userPrompt, useSearch = false, retryCount = 0, useSmallModel = false) {
  if (AI_PROVIDER === 'gemini') {
    return callGemini(systemPrompt, userPrompt, retryCount, useSmallModel);
  } else {
    return callClaude(systemPrompt, userPrompt, useSearch, retryCount, useSmallModel);
  }
}

// Mantener compatibilidad con el nombre anterior
export async function callClaude(systemPrompt, userPrompt, useSearch = false, retryCount = 0, useSmallModel = false) {
  if (!ANTHROPIC_API_KEY && API_MODE === 'direct') {
    throw new Error('API key de Claude no configurada. Agrega VITE_ANTHROPIC_API_KEY en el archivo .env');
  }

  const tools = useSearch ? [{ type: "web_search_20250305", name: "web_search", max_uses: 2 }] : [];
  const body = {
    model: useSmallModel ? PROVIDERS.claude.models.small : PROVIDERS.claude.models.large,
    max_tokens: useSmallModel ? 8000 : 10000,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
    ...(useSearch ? { tools } : {}),
  };

  try {
    const headers = API_MODE === 'proxy' 
      ? { 'Content-Type': 'application/json' }
      : {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        };

    const url = API_MODE === 'proxy' 
      ? `http://localhost:${PROXY_PORT}/api/claude`
      : PROVIDERS.claude.url;

    const resp = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      
      if (resp.status === 429 && retryCount < 5) {
        const delay = calculateBackoffDelay(retryCount + 1);
        console.log(`⏳ Claude Rate limit - Reintento ${retryCount + 1}/5 en ${delay/1000}s...`);
        await sleep(delay);
        
        const shouldUseSmallModel = retryCount >= 1 || useSmallModel;
        return callClaude(systemPrompt, userPrompt, false, retryCount + 1, shouldUseSmallModel);
      }
      
      throw new Error(`Claude API ${resp.status}: ${errText.slice(0, 200)}`);
    }

    const data = await resp.json();
    return data.content.map(b => b.text || "").filter(Boolean).join("\n");
    
  } catch (error) {
    if (error.message.includes('429') && retryCount >= 5) {
      throw new Error(`Claude rate limit persistente después de ${retryCount} reintentos. Prueba con Gemini o espera 10-15 minutos.`);
    }
    throw error;
  }
}

// Nueva función para Gemini
export async function callGemini(systemPrompt, userPrompt, retryCount = 0, useSmallModel = false) {
  if (!GEMINI_API_KEY) {
    throw new Error('API key de Gemini no configurada. Agrega VITE_GEMINI_API_KEY en el archivo .env');
  }

  const model = useSmallModel ? PROVIDERS.gemini.models.small : PROVIDERS.gemini.models.large;
  const url = `${PROVIDERS.gemini.url}/${model}:generateContent?key=${GEMINI_API_KEY}`;

  // Gemini requiere formato diferente
  const body = {
    contents: [{
      parts: [{
        text: `${systemPrompt}\n\n${userPrompt}`
      }]
    }],
    generationConfig: {
      temperature: 0.7,
      topK: 1,
      topP: 1,
      maxOutputTokens: useSmallModel ? 4000 : 8000,
    },
    safetySettings: [
      {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_HATE_SPEECH", 
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      }
    ]
  };

  try {
    const resp = await fetch(url, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      
      if ((resp.status === 429 || resp.status === 503) && retryCount < 5) {
        const delay = calculateBackoffDelay(retryCount + 1);
        console.log(`⏳ Gemini Rate limit - Reintento ${retryCount + 1}/5 en ${delay/1000}s...`);
        await sleep(delay);
        
        return callGemini(systemPrompt, userPrompt, retryCount + 1, useSmallModel || retryCount >= 1);
      }
      
      throw new Error(`Gemini API ${resp.status}: ${errText.slice(0, 200)}`);
    }

    const data = await resp.json();
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return data.candidates[0].content.parts.map(part => part.text).join("\n");
    }
    
    throw new Error('Respuesta inesperada de Gemini API');
    
  } catch (error) {
    if ((error.message.includes('429') || error.message.includes('503')) && retryCount >= 5) {
      throw new Error(`Gemini rate limit persistente después de ${retryCount} reintentos. Prueba con Claude o espera 10-15 minutos.`);
    }
    throw error;
  }
}

// Función para obtener información del proveedor actual
export function getCurrentProvider() {
  return {
    name: AI_PROVIDER,
    displayName: AI_PROVIDER === 'claude' ? 'Claude Sonnet-4' : 'Google Gemini Pro',
    hasApiKey: AI_PROVIDER === 'claude' ? !!ANTHROPIC_API_KEY : !!GEMINI_API_KEY
  };
}

// Resto del código existente (parseJSON, prompts, etc.)
function parseJSON(raw) {
  const cleaned = raw.replace(/```json|```/g, "").trim();
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
}

// ═══════════════════════════════════════════════════════
// AGENTE 1: RECON — Reconocimiento de señales digitales
// ═══════════════════════════════════════════════════════

export function buildReconPrompts(territory, criteria) {
  const system = `Eres un analista de inteligencia política digital especializado en comportamiento de audiencias en redes sociales. Tu análisis debe basarse EXCLUSIVAMENTE en señales digitales públicas observables:

- Conversaciones en Facebook, X (Twitter), TikTok y YouTube
- Interacciones con páginas de partidos y candidatos
- Frecuencia y tono de menciones
- Patrones de consumo de contenido político
- Comportamiento de follows y shares

Para cada hallazgo, indica la SEÑAL DIGITAL específica que lo sostiene. Distingue siempre entre:
- OBSERVADO: dato directamente encontrado en señal digital
- INFERIDO: conclusión derivada de patrones observados

Responde SOLO en JSON válido, sin markdown, sin backticks. El tono debe ser el de un informe de consultoría política de alto nivel.`;

  const user = `Busca información REAL y ACTUAL sobre el sentimiento político digital en ${territory} relacionado con "${criteria}".

INSTRUCCIONES DE BÚSQUEDA:
1. Busca conversaciones reales en X/Twitter sobre "${criteria}" en ${territory}
2. Busca páginas y grupos de Facebook relacionados con el contexto político de ${territory}
3. Busca contenido político viral en TikTok sobre ${territory}
4. Busca análisis y opiniones en YouTube sobre la política de ${territory}
5. Busca hashtags trending relacionados con "${criteria}" y ${territory}

Para cada plataforma reporta:
- Qué conversaciones predominan (tipo, tema, tono)
- Nivel de actividad y volumen
- Si el dato es OBSERVADO directamente o INFERIDO de patrones

Responde con esta estructura JSON exacta:
{
  "territory": "${territory}",
  "criteria": "${criteria}",
  "signals": [
    {
      "platform": "X/Twitter",
      "description": "descripción detallada de lo encontrado",
      "sentiment": "positivo/negativo/mixto",
      "volume_indicator": "alto/medio/bajo",
      "observation_type": "observado/inferido"
    },
    {
      "platform": "Facebook",
      "description": "...",
      "sentiment": "...",
      "volume_indicator": "...",
      "observation_type": "..."
    },
    {
      "platform": "TikTok",
      "description": "...",
      "sentiment": "...",
      "volume_indicator": "...",
      "observation_type": "..."
    },
    {
      "platform": "YouTube",
      "description": "...",
      "sentiment": "...",
      "volume_indicator": "...",
      "observation_type": "..."
    },
    {
      "platform": "Instagram",
      "description": "...",
      "sentiment": "...",
      "volume_indicator": "...",
      "observation_type": "..."
    }
  ],
  "key_hashtags": ["#hashtag1", "#hashtag2", "#hashtag3", "#hashtag4", "#hashtag5"],
  "dominant_narrative": "narrativa dominante encontrada, con detalle sobre qué plataforma la origina y cómo se propaga",
  "key_figures_mentioned": ["persona1", "persona2", "persona3", "persona4", "persona5"],
  "interaction_patterns": {
    "most_active_platform": "plataforma con mayor volumen de conversación",
    "peak_topics": ["tema1", "tema2", "tema3"],
    "tone_distribution": {
      "critico": 0,
      "favorable": 0,
      "neutro": 0
    }
  },
  "data_freshness": "fecha más reciente de datos encontrados",
  "sources_consulted": ["fuente1 con URL", "fuente2 con URL", "fuente3 con URL"]
}`;
  return { system, user };
}

// ═══════════════════════════════════════════════════════
// AGENTE 2: QUANT — Análisis cuantitativo
// ═══════════════════════════════════════════════════════

export function buildQuantPrompts(territory, criteria, reconData) {
  const system = `Eres un analista cuantitativo de audiencias digitales políticas. Tu trabajo es estimar el tamaño del universo digital electoral de un territorio usando como referencia:
- Meta Audience Insights
- Datos de alcance de X y TikTok
- Reportes de DataReportal, We Are Social, Statista
- Datos demográficos oficiales (DANE para Colombia, INEGI para México, etc.)

El universo total debe reflejar usuarios con actividad digital regular, no solo votantes registrados en padrón.

Si algún dato tiene alta incertidumbre, indícalo EXPLÍCITAMENTE con un intervalo de confianza en lugar de presentarlo con falsa precisión.

Responde SOLO en JSON válido sin markdown. Tono analítico de consultoría de alto nivel.`;

  const user = `Con base en datos REALES de ${territory}, calcula el universo digital electoral.

Datos de reconocimiento previo: ${JSON.stringify(reconData).slice(0, 3000)}

Criterio de masa analizado: "${criteria}"

INSTRUCCIONES CRÍTICAS:
1. Usa datos demográficos REALES del territorio (busca la población actual)
2. Basa las estimaciones de usuarios digitales en reportes de DataReportal o We Are Social
3. El universo debe dividirse en DOS BLOQUES:

BLOQUE A — CON AFINIDAD PARTIDISTA IDENTIFICABLE:
Para cada partido con presencia digital significativa en ${territory}, clasifica su universo en:
- Duro: alta frecuencia de interacción, tono afirmativo y consistente, sin cuestionamiento interno
- Enojado: activo digitalmente, tono negativo hacia OTROS partidos (no el propio), movilizable pero volátil
- Crítico: interactúa con su partido pero con cuestionamiento interno, lenguaje ambivalente, posible deserción
- Oportunista: baja consistencia histórica, migra entre partidos según contexto electoral, sin lealtad estructural

BLOQUE B — SIN OPINIÓN POLÍTICA IDENTIFICABLE:
Segmenta por el criterio que mejor lo represente digitalmente:
- Identidad de comunidad
- Profesión o sector productivo
- Sector demográfico (edad, ubicación)
- Tribu de consumo de contenido (gamers, influencer followers, etc.)
Usa los patrones de consumo digital como base de segmentación.

Presenta volúmenes en miles (K).

JSON exacto:
{
  "universe": {
    "total_digital_users": 0,
    "politically_active": 0,
    "methodology": "explicación detallada con fuentes específicas de cada estimación"
  },
  "criteria_mass": {
    "label": "${criteria}",
    "estimated_size": 0,
    "percentage_of_active": 0,
    "confidence_interval": "±X%",
    "sentiment_distribution": {
      "intenso": 0,
      "moderado": 0,
      "leve": 0
    }
  },
  "platform_distribution": {
    "x_twitter": { "users": 0, "engagement_rate": 0 },
    "facebook": { "users": 0, "engagement_rate": 0 },
    "tiktok": { "users": 0, "engagement_rate": 0 },
    "youtube": { "users": 0, "engagement_rate": 0 },
    "instagram": { "users": 0, "engagement_rate": 0 }
  },
  "partisan_block": {
    "total": 0,
    "parties": [
      { "name": "nombre del partido", "total": 0, "duro": 0, "enojado": 0, "critico": 0, "oportunista": 0 }
    ]
  },
  "non_partisan_block": {
    "total": 0,
    "segments": [
      { "name": "nombre del segmento", "size": 0, "description": "criterio de segmentación: comunidad/profesión/demografía/tribu digital", "segment_type": "comunidad/profesion/demografico/tribu_digital" }
    ]
  },
  "data_sources": ["fuente1 con URL si posible", "fuente2"]
}

TODOS los números deben ser enteros y coherentes con la población real de ${territory}.`;
  return { system, user };
}

// ═══════════════════════════════════════════════════════
// AGENTE 3: ARCHETYPE — Mapeo de arquetipo de liderazgo
// ═══════════════════════════════════════════════════════

export function buildArchetypePrompts(territory, criteria, reconData) {
  const system = `Eres un experto en psicología política y arquetipos de liderazgo. Actúa como analista de inteligencia política digital.

Tu método:
1. Analiza INDUCTIVAMENTE los deseos, quejas, expectativas y rechazos que la población digital expresa sobre el gobierno del territorio
2. El arquetipo debe representar la FUNCIÓN DE LIDERAZGO que la ciudadanía demanda — no el partido ni la ideología
3. Para cada conclusión, indica la SEÑAL DIGITAL que la sostiene
4. Distingue entre lo OBSERVADO en señal digital y lo INFERIDO de patrones

Responde SOLO en JSON válido sin markdown. Tono de consultoría política de alto nivel.`;

  const user = `Analiza las señales digitales de ${territory} y determina el arquetipo de liderazgo demandado.

Señales de RECON: ${JSON.stringify(reconData).slice(0, 2500)}
Criterio de masa: "${criteria}"
Narrativa dominante: ${reconData.dominant_narrative || "N/A"}

TAXONOMÍA DE ARQUETIPOS (usa EXACTAMENTE estos nombres):
${ARCHETYPE_TAXONOMY.map(a => `- ${a.name}: Adjetivos[${a.adj.join(", ")}] | Contra-adjetivos[${a.contra.join(", ")}]`).join("\n")}

═══ SECCIÓN 1: ARQUETIPO ═══
Determina inductivamente qué arquetipo emerge de las quejas, deseos y expectativas digitales.

═══ SECCIÓN 1.1: TRES PUNTOS POSITIVOS ═══
Cada punto debe:
- Empezar con verbo en presente ("Esperan...", "Valoran...", "Demandan...")
- MÁXIMO 180 CARACTERES (validar longitud estrictamente)
- Reflejar expectativas CONCRETAS expresadas digitalmente, no generalidades
- Basado en el contexto electoral presidencial de Colombia

═══ SECCIÓN 1.2: TRES PUNTOS NEGATIVOS ═══
Cada punto debe:
- Empezar con verbo en presente ("Rechazan...", "Critican...", "Repudian...")
- MÁXIMO 140 CARACTERES (validar longitud estrictamente)
- Reflejar rechazos o frustraciones CONCRETAS expresadas digitalmente
- Basado en el contexto electoral presidencial de Colombia

═══ SECCIÓN 2: CANDIDATOS ═══
Identifica los 3 candidatos con mayores posibilidades de contender a la presidencia de Colombia en el próximo período + Juan Carlos Pinzón (analízalo PRIMERO).
Basándote en presencia digital activa, menciones, y relevancia en la conversación política de Colombia.

Para cada candidato: 4 adjetivos que el universo digital le atribuye (no tu opinión).
REGLA DE RESALTE:
- Si un adjetivo coincide con los adjetivos POSITIVOS del arquetipo → márcalo con "match": true
- Si coincide con los CONTRA-adjetivos del arquetipo → márcalo con "contra": true

**IMPORTANTE**: Los puntos positivos deben tener máximo 180 caracteres. Los puntos negativos máximo 140 caracteres.

JSON:
{
  "primary_archetype": "nombre EXACTO de la taxonomía",
  "confidence": 0.0,
  "reasoning": "explicación detallada basada en señales digitales reales, mínimo 200 palabras, indicando qué señales son OBSERVADAS y cuáles INFERIDAS",
  "positive_demands": [
    { "text": "Verbo en presente + expectativa concreta (máx 180 chars)", "signal": "señal digital específica", "observation_type": "observado/inferido" },
    { "text": "...", "signal": "...", "observation_type": "..." },
    { "text": "...", "signal": "...", "observation_type": "..." }
  ],
  "negative_rejections": [
    { "text": "Verbo en presente + rechazo concreto (máx 140 chars)", "signal": "señal digital específica", "observation_type": "observado/inferido" },
    { "text": "...", "signal": "...", "observation_type": "..." },
    { "text": "...", "signal": "...", "observation_type": "..." }
  ],
  "secondary_archetype": "segundo arquetipo más relevante",
  "candidates": [
    {
      "name": "Juan Carlos Pinzón",
      "party": "partido o plataforma (buscar información real)",
      "adjectives": [
        { "word": "adjetivo1", "match": false, "contra": false },
        { "word": "adjetivo2", "match": false, "contra": false },
        { "word": "adjetivo3", "match": false, "contra": false },
        { "word": "adjetivo4", "match": false, "contra": false }
      ],
      "digital_signal": "señal digital predominante que sustenta esta adjetivación",
      "archetype_match_score": 0.0,
      "analysis_priority": 1,
      "analysis_note": "Analizado primero por instrucción específica del prompt"
    },
    {
      "name": "candidato 2 (nombre completo real)",
      "party": "partido",
      "adjectives": [
        { "word": "adj1", "match": false, "contra": false },
        { "word": "adj2", "match": false, "contra": false },
        { "word": "adj3", "match": false, "contra": false },
        { "word": "adj4", "match": false, "contra": false }
      ],
      "digital_signal": "señal predominante",
      "archetype_match_score": 0.0
    },
    {
      "name": "candidato 3",
      "party": "partido",
      "adjectives": [
        { "word": "adj1", "match": false, "contra": false },
        { "word": "adj2", "match": false, "contra": false },
        { "word": "adj3", "match": false, "contra": false },
        { "word": "adj4", "match": false, "contra": false }
      ],
      "digital_signal": "señal predominante",
      "archetype_match_score": 0.0
    },
    {
      "name": "candidato 4",
      "party": "partido",
      "adjectives": [
        { "word": "adj1", "match": false, "contra": false },
        { "word": "adj2", "match": false, "contra": false },
        { "word": "adj3", "match": false, "contra": false },
        { "word": "adj4", "match": false, "contra": false }
      ],
      "digital_signal": "señal predominante",
      "archetype_match_score": 0.0
    }
  ]
}`;
  return { system, user };
}

// ═══════════════════════════════════════════════════════
// AGENTE 4: SYNTHESIS — Síntesis ejecutiva
// ═══════════════════════════════════════════════════════

export function buildSynthesisPrompts(territory, criteria, reconData, quantData, archData) {
  const system = `Eres el director de un equipo de consultoría política de alto nivel. Sintetiza datos de múltiples agentes de inteligencia en un informe ejecutivo.

INSTRUCCIONES DE FORMATO:
- Usa lenguaje analítico, NO periodístico
- No especules sobre intenciones privadas de los candidatos: solo describe la percepción digital observable
- Si algún dato tiene alta incertidumbre, indícalo EXPLÍCITAMENTE
- El tono general debe ser el de un informe de consultoría política de alto nivel

Responde SOLO en JSON válido sin markdown.`;

  const user = `Sintetiza los siguientes datos en un informe ejecutivo de inteligencia política digital para ${territory}.

DATOS DE RECONOCIMIENTO (Agente RECON): ${JSON.stringify(reconData).slice(0, 2500)}
DATOS CUANTITATIVOS (Agente QUANT): ${JSON.stringify(quantData).slice(0, 2500)}
DATOS DE ARQUETIPO (Agente ARCHETYPE): ${JSON.stringify(archData).slice(0, 2500)}

Territorio: ${territory}
Criterio de masa: ${criteria}

GENERA:
- Resumen ejecutivo sustancial (mínimo 5 oraciones, máximo 7)
- Hallazgo clave en 1-2 oraciones contundentes
- Puntuación de confiabilidad HONESTA (0.0 a 1.0) basada en la calidad de las señales encontradas
- Factores que fortalecen o debilitan la confiabilidad
- 5 implicaciones estratégicas ACCIONABLES
- 3 riesgos CONCRETOS (no genéricos)
- 4 próximos pasos ESPECÍFICOS y realizables
- Nota metodológica con limitaciones explícitas

JSON:
{
  "executive_summary": "Resumen ejecutivo de 5-7 oraciones. Tono analítico de consultoría.",
  "key_finding": "Hallazgo más importante en 1-2 oraciones.",
  "reliability_score": 0.0,
  "reliability_factors": ["factor1 que fortalece o debilita", "factor2", "factor3"],
  "strategic_implications": [
    "implicación estratégica 1 accionable",
    "implicación 2",
    "implicación 3",
    "implicación 4",
    "implicación 5"
  ],
  "risk_factors": ["riesgo1 concreto", "riesgo2 concreto", "riesgo3 concreto"],
  "recommended_next_steps": ["paso1 específico", "paso2", "paso3", "paso4"],
  "methodology_note": "Nota sobre metodología, fuentes utilizadas, y limitaciones EXPLÍCITAS del análisis. Incluir qué datos son observados vs inferidos.",
  "timestamp": "${new Date().toISOString()}"
}`;
  return { system, user };
}

export function parseAgentResponse(raw, fallbackSlice = 500) {
  try {
    const parsed = parseJSON(raw);
    if (parsed) return parsed;
    return { raw: raw.slice(0, fallbackSlice) };
  } catch {
    return { raw: raw.slice(0, fallbackSlice) };
  }
}
