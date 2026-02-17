export default function ReportFooter({ report }) {
  const sources = [
    ...(report.recon?.sources_consulted || []),
    ...(report.quant?.data_sources || []),
  ].filter((v, i, a) => a.indexOf(v) === i);

  const factors = report.synthesis?.reliability_factors;

  if (!sources.length && !factors?.length) return null;

  return (
    <div style={{
      paddingTop: 24, borderTop: "1px solid var(--border-subtle)",
      display: "flex", flexDirection: "column", gap: 12,
    }}>
      {sources.length > 0 && (
        <div style={{ fontSize: 11, color: "var(--text-4)", lineHeight: 1.7 }}>
          <span style={{ fontWeight: 500, color: "var(--text-3)", fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 0.5 }}>
            FUENTES
          </span>{" "}
          {sources.join(" / ")}
        </div>
      )}
      {factors?.length > 0 && (
        <div style={{ fontSize: 11, color: "var(--text-4)", lineHeight: 1.7 }}>
          <span style={{ fontWeight: 500, color: "var(--text-3)", fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 0.5 }}>
            CONFIABILIDAD
          </span>{" "}
          {factors.join(" / ")}
        </div>
      )}
    </div>
  );
}
