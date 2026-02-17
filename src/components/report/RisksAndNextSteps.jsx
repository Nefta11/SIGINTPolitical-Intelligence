import ReportSection from '../ReportSection';

export default function RisksAndNextSteps({ synthesis }) {
  const hasRisks = synthesis?.risk_factors?.length > 0;
  const hasSteps = synthesis?.recommended_next_steps?.length > 0;
  if (!hasRisks && !hasSteps) return null;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
      {hasRisks && (
        <ReportSection title="Factores de Riesgo">
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {synthesis.risk_factors.map((r, i) => (
              <div key={i} style={{
                fontSize: 13, color: "var(--text-2)", lineHeight: 1.6,
                padding: "10px 14px", background: "var(--red-soft)",
                borderRadius: "var(--radius-sm)",
              }}>
                {r}
              </div>
            ))}
          </div>
        </ReportSection>
      )}
      {hasSteps && (
        <ReportSection title="Siguientes Pasos">
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {synthesis.recommended_next_steps.map((s, i) => (
              <div key={i} style={{
                fontSize: 13, color: "var(--text-2)", lineHeight: 1.6,
                padding: "10px 14px", background: "var(--green-soft)",
                borderRadius: "var(--radius-sm)",
              }}>
                {s}
              </div>
            ))}
          </div>
        </ReportSection>
      )}
    </div>
  );
}
