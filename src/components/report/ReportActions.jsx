import { useState } from 'react';

export default function ReportActions({ reportRef, report }) {
  const [exporting, setExporting] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleExportPdf = async () => {
    if (!reportRef?.current || exporting) return;
    setExporting(true);
    try {
      const { exportReportToPdf } = await import('../../services/exportPdf');
      await exportReportToPdf(reportRef.current, report);
    } catch (err) {
      console.error('Error exportando PDF:', err);
    } finally {
      setExporting(false);
    }
  };

  const handleCopyText = async () => {
    const s = report.synthesis || {};
    const text = [
      `SIGINT / POLITICAL`,
      `${report.territory} / ${report.criteria}`,
      `${new Date(report.timestamp).toLocaleString("es")}`,
      ``,
      `RESUMEN EJECUTIVO`,
      s.executive_summary || "",
      ``,
      `HALLAZGO CLAVE`,
      s.key_finding || "",
      ``,
      `ARQUETIPO: ${report.archetype?.primary_archetype || ""}`,
      report.archetype?.reasoning || "",
      ``,
      `CONFIABILIDAD: ${((s.reliability_score || 0) * 100).toFixed(0)}%`,
      ``,
      `IMPLICACIONES`,
      ...(s.strategic_implications || []).map((i, n) => `${n + 1}. ${i}`),
      ``,
      `RIESGOS`,
      ...(s.risk_factors || []).map((r, n) => `${n + 1}. ${r}`),
      ``,
      `PROXIMOS PASOS`,
      ...(s.recommended_next_steps || []).map((p, n) => `${n + 1}. ${p}`),
    ].join('\n');

    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
    <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
      <button
        onClick={handleExportPdf}
        disabled={exporting}
        style={{ ...btnBase, opacity: exporting ? 0.4 : 1 }}
        onMouseEnter={e => { e.currentTarget.style.background = "var(--surface-hover)"; e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-2)"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "var(--surface)"; e.currentTarget.style.borderColor = "var(--border-subtle)"; e.currentTarget.style.color = "var(--text-3)"; }}
      >
        {exporting ? "Exportando..." : "Exportar PDF"}
      </button>
      <button
        onClick={handleCopyText}
        style={btnBase}
        onMouseEnter={e => { e.currentTarget.style.background = "var(--surface-hover)"; e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-2)"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "var(--surface)"; e.currentTarget.style.borderColor = "var(--border-subtle)"; e.currentTarget.style.color = "var(--text-3)"; }}
      >
        {copied ? "Copiado" : "Copiar texto"}
      </button>
    </div>
  );
}
