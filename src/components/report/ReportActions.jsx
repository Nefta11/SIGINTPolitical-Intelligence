import { useState } from 'react';

export default function ReportActions({ reportRef, report }) {
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  const handleExportPdf = async () => {
    if (!reportRef?.current || exporting) return;
    setExporting(true);
    setExportError(null);
    try {
      const { exportReportToPdf } = await import('../../services/exportPdf');
      await exportReportToPdf(reportRef.current, report);
    } catch (err) {
      console.error('Error exportando PDF:', err);
      setExportError('Error al generar PDF. Intenta con Ctrl+P para imprimir.');
      setTimeout(() => setExportError(null), 5000);
    } finally {
      setExporting(false);
    }
  };

  const buildCopyText = () => {
    const s = report.synthesis || {};
    const arch = report.archetype || {};
    return [
      `SIGINT / POLITICAL INTELLIGENCE`,
      `Territorio: ${report.territory}  |  Criterio: ${report.criteria}`,
      `Fecha: ${new Date(report.timestamp).toLocaleString("es")}`,
      ``,
      `━━━ RESUMEN EJECUTIVO ━━━`,
      s.executive_summary || "",
      ``,
      `━━━ HALLAZGO CLAVE ━━━`,
      s.key_finding || "",
      ``,
      `━━━ ARQUETIPO DEMANDADO: ${arch.primary_archetype || ""} ━━━`,
      arch.reasoning || "",
      ``,
      `Arquetipo secundario: ${arch.secondary_archetype || ""}`,
      `Confianza: ${((arch.confidence || 0) * 100).toFixed(0)}%`,
      ``,
      `━━━ PUNTOS POSITIVOS ━━━`,
      ...(arch.positive_demands || []).map((p, i) => `${i + 1}. ${p.text}`),
      ``,
      `━━━ PUNTOS NEGATIVOS ━━━`,
      ...(arch.negative_rejections || []).map((p, i) => `${i + 1}. ${p.text}`),
      ``,
      `━━━ CANDIDATOS ━━━`,
      ...(arch.candidates || []).map(c =>
        `${c.name} (${c.party})\n   ${(c.adjectives || []).map(a => a.word).join(' / ')}\n   Score: ${((c.archetype_match_score || 0) * 100).toFixed(0)}%`
      ),
      ``,
      `━━━ UNIVERSO DIGITAL ━━━`,
      `Total usuarios digitales: ${(report.quant?.universe?.total_digital_users || 0).toLocaleString()}`,
      `Políticamente activos: ${(report.quant?.universe?.politically_active || 0).toLocaleString()}`,
      `Masa "${report.criteria}": ${(report.quant?.criteria_mass?.estimated_size || 0).toLocaleString()} (${report.quant?.criteria_mass?.confidence_interval || "N/A"})`,
      ``,
      `━━━ CONFIABILIDAD: ${((s.reliability_score || 0) * 100).toFixed(0)}% ━━━`,
      ...(s.reliability_factors || []).map(f => `• ${f}`),
      ``,
      `━━━ IMPLICACIONES ESTRATÉGICAS ━━━`,
      ...(s.strategic_implications || []).map((i, n) => `${n + 1}. ${i}`),
      ``,
      `━━━ RIESGOS ━━━`,
      ...(s.risk_factors || []).map((r, n) => `${n + 1}. ${r}`),
      ``,
      `━━━ PRÓXIMOS PASOS ━━━`,
      ...(s.recommended_next_steps || []).map((p, n) => `${n + 1}. ${p}`),
      ``,
      `━━━ NOTA METODOLÓGICA ━━━`,
      s.methodology_note || "",
    ].join('\n');
  };

  const handleCopyText = async () => {
    const text = buildCopyText();
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback para contextos sin Clipboard API
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        const ok = document.execCommand('copy');
        document.body.removeChild(ta);
        if (!ok) throw new Error('execCommand falló');
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error copiando:', err);
      setCopyError(true);
      setTimeout(() => setCopyError(false), 3000);
    }
  };

  const btnBase = {
    background: "var(--surface)",
    border: "1px solid var(--border-subtle)",
    color: "var(--text-3)",
    borderRadius: "var(--radius-sm)",
    padding: "8px 16px",
    fontSize: 12,
    fontFamily: "var(--sans)",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s",
    letterSpacing: 0.2,
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={handleExportPdf}
          disabled={exporting}
          style={{ ...btnBase, opacity: exporting ? 0.5 : 1 }}
          onMouseEnter={e => { e.currentTarget.style.background = "var(--surface-hover)"; e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-2)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "var(--surface)"; e.currentTarget.style.borderColor = "var(--border-subtle)"; e.currentTarget.style.color = "var(--text-3)"; }}
        >
          {exporting ? "Generando PDF..." : "Exportar PDF"}
        </button>
        <button
          onClick={handleCopyText}
          style={{ ...btnBase, ...(copyError ? { borderColor: "var(--red, #e53e3e)", color: "var(--red, #e53e3e)" } : {}) }}
          onMouseEnter={e => { if (!copyError) { e.currentTarget.style.background = "var(--surface-hover)"; e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-2)"; }}}
          onMouseLeave={e => { if (!copyError) { e.currentTarget.style.background = "var(--surface)"; e.currentTarget.style.borderColor = "var(--border-subtle)"; e.currentTarget.style.color = "var(--text-3)"; }}}
        >
          {copied ? "✓ Copiado" : copyError ? "Error al copiar" : "Copiar texto"}
        </button>
      </div>
      {exportError && (
        <div style={{
          marginTop: 8,
          fontSize: 12,
          color: "var(--red, #e53e3e)",
          fontFamily: "var(--mono)",
        }}>
          {exportError}
        </div>
      )}
    </div>
  );
}
