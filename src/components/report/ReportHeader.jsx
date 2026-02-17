import { pct } from '../../utils/formatters';

export default function ReportHeader({ report }) {
  const score = report.synthesis?.reliability_score;
  const scoreColor = score > 0.7 ? "var(--green)" : score > 0.4 ? "var(--amber)" : "var(--red)";

  return (
    <div style={{
      marginBottom: 36, paddingBottom: 28, borderBottom: "1px solid var(--border-subtle)",
    }}>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "flex-start",
      }}>
        <div>
          <div style={{
            fontFamily: "var(--mono)", fontSize: 10, fontWeight: 500,
            color: "var(--text-4)", letterSpacing: 2.5, marginBottom: 10,
          }}>
            INFORME DE INTELIGENCIA
          </div>
          <h2 style={{
            fontSize: 24, fontWeight: 600, color: "var(--text)",
            margin: 0, letterSpacing: -0.5,
          }}>
            {report.territory}
          </h2>
          <div style={{
            fontSize: 14, color: "var(--text-3)", marginTop: 6,
          }}>
            {report.criteria}
          </div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{
            fontFamily: "var(--mono)", fontSize: 11, color: "var(--text-4)",
          }}>
            {new Date(report.timestamp).toLocaleString("es")}
          </div>
          {score != null && (
            <div style={{
              marginTop: 10,
              fontFamily: "var(--mono)", fontSize: 22, fontWeight: 600,
              color: scoreColor, letterSpacing: -0.5,
            }}>
              {pct(score)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
