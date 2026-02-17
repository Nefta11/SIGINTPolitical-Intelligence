import ReportSection from '../ReportSection';

export default function ExecutiveSummary({ synthesis }) {
  if (!synthesis?.executive_summary) return null;
  return (
    <ReportSection title="Resumen Ejecutivo">
      <p style={{ fontSize: 14, lineHeight: 1.8, color: "var(--text-2)" }}>
        {synthesis.executive_summary}
      </p>
      {synthesis.key_finding && (
        <div style={{
          marginTop: 18, padding: "14px 18px",
          background: "var(--accent-soft)",
          borderLeft: "2px solid var(--accent)",
          borderRadius: "0 var(--radius-sm) var(--radius-sm) 0",
          fontSize: 13, color: "var(--text)", lineHeight: 1.7,
        }}>
          <span style={{
            fontWeight: 600, color: "var(--accent)", fontSize: 10,
            letterSpacing: 1.5, display: "block", marginBottom: 6,
            fontFamily: "var(--mono)",
          }}>
            HALLAZGO CLAVE
          </span>
          {synthesis.key_finding}
        </div>
      )}
    </ReportSection>
  );
}
