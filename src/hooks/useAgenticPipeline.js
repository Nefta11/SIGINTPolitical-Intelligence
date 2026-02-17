import { useState, useRef, useCallback } from 'react';
import {
  callAI,
  buildReconPrompts,
  buildQuantPrompts,
  buildArchetypePrompts,
  buildSynthesisPrompts,
  parseAgentResponse,
} from '../services/aiService';
import { saveReport } from '../services/storage';
import { validatePromptCompliance } from '../utils/promptCompliance';

export function useAgenticPipeline() {
  const [territory, setTerritory] = useState("Colombia");
  const [criteria, setCriteria] = useState("Anti-petrismo");
  const [running, setRunning] = useState(false);
  const [agentStates, setAgentStates] = useState({});
  const [agentLogs, setAgentLogs] = useState({});
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const [showRateLimitInfo, setShowRateLimitInfo] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [showPauseControl, setShowPauseControl] = useState(false);
  const [pausedState, setPausedState] = useState(null); // Guardará el estado para continuar
  const reportRef = useRef(null);

  const timestamp = () => new Date().toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  const addLog = useCallback((agentId, msg, type = "info") => {
    setAgentLogs(prev => ({
      ...prev,
      [agentId]: [...(prev[agentId] || []), { time: timestamp(), msg, type }]
    }));
  }, []);

  const setAgentStatus = useCallback((agentId, status) => {
    setAgentStates(prev => ({ ...prev, [agentId]: status }));
  }, []);

  const loadReport = useCallback((savedReport) => {
    setReport(savedReport);
    setAgentStates({
      recon: "done",
      quant: "done",
      archetype: "done",
      synthesis: "done",
    });
    setTimeout(() => reportRef.current?.scrollIntoView({ behavior: "smooth" }), 300);
  }, []);

  const handlePauseResume = useCallback(() => {
    if (pausedState) {
      // Continuar desde donde se quedó
      setShowPauseControl(false);
      setError(null);
      continueFromPausedState();
    }
  }, [pausedState]);

  const handleCancelAnalysis = useCallback(() => {
    setShowPauseControl(false);
    setPausedState(null);
    setRunning(false);
    setError("Análisis cancelado por el usuario");
    setAgentStates(prev => {
      const next = { ...prev };
      for (const id in next) {
        if (next[id] === "running") next[id] = "error";
      }
      return next;
    });
  }, []);

  async function continueFromPausedState() {
    if (!pausedState) return;
    
    setRunning(true);
    const { stage, data } = pausedState;
    
    try {
      // Aquí iría la lógica para continuar desde el stage específico
      // Por ahora, reiniciamos el proceso completo
      await runAgenticPipeline();
    } catch (e) {
      setError(e.message);
    } finally {
      setRunning(false);
      setPausedState(null);
      setShowPauseControl(false);
    }
  }

  const runAgenticPipeline = useCallback(async () => {
    setRunning(true);
    setReport(null);
    setError(null);
    setShowRateLimitInfo(false);
    setShowSuccessNotification(false);
    setAgentStates({});
    setAgentLogs({});

    const T = territory.trim();
    const C = criteria.trim();

    if (!T || !C) {
      setError("Debes ingresar un territorio y un criterio de masa.");
      setRunning(false);
      return;
    }

    try {
      // AGENT 1: RECON
      setAgentStatus("recon", "running");
      addLog("recon", `Iniciando reconocimiento digital: ${T} / "${C}"`, "search");
      addLog("recon", "Ejecutando web_search para señales digitales reales...", "search");

      const reconPrompts = buildReconPrompts(T, C);
      let reconRaw;
      try {
        reconRaw = await callAI(reconPrompts.system, reconPrompts.user, true);
      } catch (e) {
        addLog("recon", `Error en búsqueda: ${e.message}. Reintentando sin search...`, "error");
        reconRaw = await callAI(reconPrompts.system, reconPrompts.user, false);
      }

      addLog("recon", "Datos de reconocimiento recibidos", "result");
      const reconData = parseAgentResponse(reconRaw);
      if (!reconData.signals) {
        reconData.signals = [];
        reconData.dominant_narrative = reconData.dominant_narrative || (reconData.raw || "").slice(0, 300);
        reconData.key_figures_mentioned = reconData.key_figures_mentioned || [];
        reconData.key_hashtags = reconData.key_hashtags || [];
      }

      addLog("recon", `${reconData.signals?.length || 0} señales capturadas | ${reconData.key_figures_mentioned?.length || 0} figuras identificadas`, "result");
      setAgentStatus("recon", "done");

      // Delay entre agentes para evitar rate limits
      addLog("recon", "⏳ Esperando 2s antes del siguiente agente...", "info");
      await new Promise(resolve => setTimeout(resolve, 2000));

      // AGENT 2: QUANT
      setAgentStatus("quant", "running");
      addLog("quant", "Iniciando análisis cuantitativo con datos de RECON...", "search");
      addLog("quant", "Buscando datos demográficos y de audiencia digital...", "search");

      const quantPrompts = buildQuantPrompts(T, C, reconData);
      let quantRaw;
      try {
        quantRaw = await callAI(quantPrompts.system, quantPrompts.user, true);
      } catch {
        quantRaw = await callAI(quantPrompts.system, quantPrompts.user, false);
      }

      const quantData = parseAgentResponse(quantRaw);
      addLog("quant", `Universo digital: ${(quantData.universe?.total_digital_users || 0).toLocaleString()} usuarios`, "result");
      addLog("quant", `Masa "${C}": ${(quantData.criteria_mass?.estimated_size || 0).toLocaleString()} (${quantData.criteria_mass?.confidence_interval || "N/A"})`, "result");
      setAgentStatus("quant", "done");

      // Delay entre agentes para evitar rate limits  
      addLog("quant", "⏳ Esperando 2s antes del siguiente agente...", "info");
      await new Promise(resolve => setTimeout(resolve, 2000));

      // AGENT 3: ARCHETYPE
      setAgentStatus("archetype", "running");
      addLog("archetype", "Mapeando arquetipo de liderazgo demandado...", "search");

      const archPrompts = buildArchetypePrompts(T, C, reconData);
      let archRaw;
      try {
        archRaw = await callAI(archPrompts.system, archPrompts.user, true);
      } catch {
        archRaw = await callAI(archPrompts.system, archPrompts.user, false);
      }

      const archData = parseAgentResponse(archRaw);
      addLog("archetype", `Arquetipo primario: ${archData.primary_archetype || "N/D"} (confianza: ${((archData.confidence || 0) * 100).toFixed(0)}%)`, "result");
      addLog("archetype", `Arquetipo secundario: ${archData.secondary_archetype || "N/D"}`, "result");
      addLog("archetype", `${archData.candidates?.length || 0} candidatos perfilados`, "result");
      setAgentStatus("archetype", "done");

      // Delay entre agentes para evitar rate limits
      addLog("archetype", "⏳ Esperando 2s antes del siguiente agente...", "info");
      await new Promise(resolve => setTimeout(resolve, 2000));

      // AGENT 4: SYNTHESIS
      setAgentStatus("synthesis", "running");
      addLog("synthesis", "Sintetizando datos de todos los agentes...", "search");

      const synthPrompts = buildSynthesisPrompts(T, C, reconData, quantData, archData);
      let synthRaw;
      try {
        synthRaw = await callAI(synthPrompts.system, synthPrompts.user, false);
      } catch (e) {
        synthRaw = `{"executive_summary": "Error en síntesis: ${e.message}", "reliability_score": 0}`;
      }

      const synthData = parseAgentResponse(synthRaw);
      addLog("synthesis", "Informe final compilado", "result");
      setAgentStatus("synthesis", "done");

      const finalReport = {
        recon: reconData,
        quant: quantData,
        archetype: archData,
        synthesis: synthData,
        territory: T,
        criteria: C,
        timestamp: new Date().toISOString(),
      };

      // Validación de cumplimiento del prompt antes de finalizar
      const validation = validatePromptCompliance(finalReport);
      addLog("synthesis", `Validación del prompt: ${validation.isCompliant ? '✅ COMPLETO' : `⚠️ ${(validation.complianceScore * 100).toFixed(1)}% cumplimiento`}`, 
        validation.isCompliant ? "result" : "warning");
      
      if (!validation.isCompliant && validation.issues.length > 0) {
        const criticalIssues = validation.issues.filter(i => i.severity === 'high');
        if (criticalIssues.length > 0) {
          addLog("synthesis", `⚠️ ${criticalIssues.length} problema(s) crítico(s) detectado(s)`, "warning");
        }
      }

      setReport(finalReport);
      saveReport(finalReport);
      addLog("synthesis", "Reporte guardado en historial", "result");
      addLog("synthesis", "🎉 ¡Análisis completado exitosamente!", "result");

      // Mostrar notificación de éxito
      setShowSuccessNotification(true);

      // Scroll más agresivo al reporte
      setTimeout(() => {
        reportRef.current?.scrollIntoView({ 
          behavior: "smooth", 
          block: "start"
        });
      }, 500);

    } catch (e) {
      // Detectar rate limit persistente para mostrar control de pausa
      if (e.message.includes('Rate limit persistente') || (e.message.includes('429') && e.message.includes('reintentos'))) {
        // Guardar estado actual para poder continuar
        const currentAgent = Object.keys(agentStates).find(key => agentStates[key] === "running");
        if (currentAgent) {
          setPausedState({
            stage: currentAgent,
            data: { territory: territory.trim(), criteria: criteria.trim() } // Se agregarán más datos según el agente
          });
          setShowPauseControl(true);
        }
      } else if (e.message.includes('429') || e.message.toLowerCase().includes('rate limit')) {
        setShowRateLimitInfo(true);
      }
      
      setError(e.message);
      setAgentStates(prev => {
        const next = { ...prev };
        for (const id in next) {
          if (next[id] === "running") next[id] = "error";
        }
        return next;
      });
    } finally {
      setRunning(false);
    }
  }, []); // Cerrar runAgenticPipeline

  return {
    territory, setTerritory,
    criteria, setCriteria,
    running,
    agentStates,
    agentLogs,
    report,
    setReport,
    error,
    showRateLimitInfo,
    setShowRateLimitInfo,
    showSuccessNotification,
    setShowSuccessNotification,
    showPauseControl,
    pausedState,
    handlePauseResume,
    handleCancelAnalysis,
    reportRef,
    runAgenticPipeline,
    loadReport,
  };
}
