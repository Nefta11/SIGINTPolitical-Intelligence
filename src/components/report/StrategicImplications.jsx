import ReportSection from '../ReportSection';

export default function StrategicImplications({ synthesis }) {
  if (!synthesis?.strategic_implications?.length) return null;
  return (
    <ReportSection title="4. Implicaciones Estrategicas">
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {synthesis.strategic_implications.map((imp, i) => (
          <div key={i} style={{
            padding: "12px 16px",
            background: "var(--accent-soft)",
            borderRadius: "var(--radius-sm)",
            fontSize: 13, color: "var(--text-2)", lineHeight: 1.7,
          }}>
            {imp}
          </div>
        ))}
      </div>
    </ReportSection>
  );
}
