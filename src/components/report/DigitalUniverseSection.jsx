import { fmt } from '../../utils/formatters';
import ReportSection from '../ReportSection';

function compact(n) {
  if (typeof n !== "number") return n;
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return String(n);
}

export default function DigitalUniverseSection({ quant, criteria }) {
  return (
    <ReportSection title="3. Universo Digital Electoral">
      {quant?.universe && (
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
          gap: 10, marginBottom: 28,
        }}>
          {[
            { label: "Usuarios digitales", value: fmt(quant.universe.total_digital_users) },
            { label: "Politicamente activos", value: fmt(quant.universe.politically_active) },
            { label: criteria, value: fmt(quant.criteria_mass?.estimated_size) },
          ].map((m, i) => (
            <div key={i} style={{
              padding: "18px", background: "var(--surface)",
              border: "1px solid var(--border-subtle)", borderRadius: "var(--radius)",
            }}>
              <div style={{
                fontSize: 11, color: "var(--text-4)", marginBottom: 8,
                fontWeight: 500, letterSpacing: 0.3,
              }}>
                {m.label}
              </div>
              <div style={{
                fontSize: 24, fontWeight: 600, color: "var(--text)",
                fontFamily: "var(--mono)", letterSpacing: -0.5,
              }}>
                {m.value}
              </div>
            </div>
          ))}
        </div>
      )}

      {quant?.criteria_mass?.sentiment_distribution && (() => {
        const dist = quant.criteria_mass.sentiment_distribution;
        const total = Object.values(dist).reduce((a, b) => a + b, 0);
        if (total === 0) return null;
        const colors = ["var(--red)", "var(--amber)", "var(--green)"];
        return (
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 12, color: "var(--text-4)", marginBottom: 10, fontWeight: 500 }}>
              Distribucion de intensidad
              {quant.criteria_mass.confidence_interval && (
                <span style={{ marginLeft: 8, fontFamily: "var(--mono)", fontSize: 11 }}>
                  {quant.criteria_mass.confidence_interval}
                </span>
              )}
            </div>
            <div style={{
              display: "flex", gap: 2, height: 32, borderRadius: "var(--radius-sm)", overflow: "hidden",
            }}>
              {Object.entries(dist).map(([key, val], i) => {
                const p = (val / total * 100);
                return (
                  <div key={i} style={{
                    flex: p, background: `color-mix(in srgb, ${colors[i]} 12%, transparent)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 10, color: colors[i], fontFamily: "var(--mono)",
                    fontWeight: 500, minWidth: p > 8 ? 50 : 0,
                  }}>
                    {p > 10 && `${key} ${p.toFixed(0)}%`}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {quant?.platform_distribution && (
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 12, color: "var(--text-4)", marginBottom: 10, fontWeight: 500 }}>
            Por plataforma
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6 }}>
            {Object.entries(quant.platform_distribution).map(([plat, data], i) => (
              <div key={i} style={{
                padding: "14px 8px", background: "var(--surface)",
                border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)", textAlign: "center",
              }}>
                <div style={{
                  fontSize: 10, color: "var(--text-4)", marginBottom: 6,
                  fontFamily: "var(--mono)", letterSpacing: 0.5,
                }}>
                  {plat.replace("_", "/").toUpperCase()}
                </div>
                <div style={{
                  fontSize: 16, fontWeight: 600, color: "var(--text-2)",
                  fontFamily: "var(--mono)",
                }}>
                  {typeof data?.users === "number" ? compact(data.users) : "--"}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {quant?.partisan_block?.parties?.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 12, color: "var(--text-3)", marginBottom: 14, fontWeight: 500 }}>
            Bloque A — Con afinidad partidista
            <span style={{ color: "var(--text-4)", fontFamily: "var(--mono)", marginLeft: 8 }}>
              {fmt(quant.partisan_block.total)}
            </span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Partido", "Total", "Duro", "Enojado", "Critico", "Oportunista"].map(h => (
                    <th key={h} style={{
                      padding: "10px 12px", textAlign: "left", color: "var(--text-4)",
                      fontFamily: "var(--mono)", fontSize: 10, fontWeight: 500,
                      borderBottom: "1px solid var(--border-subtle)",
                      letterSpacing: 1,
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {quant.partisan_block.parties.map((p, i) => (
                  <tr key={i}>
                    <td style={{ padding: "10px 12px", color: "var(--text-2)", fontSize: 13, fontWeight: 500 }}>{p.name}</td>
                    {[p.total, p.duro, p.enojado, p.critico, p.oportunista].map((v, j) => (
                      <td key={j} style={{
                        padding: "10px 12px", color: "var(--text-3)",
                        fontFamily: "var(--mono)", fontSize: 12,
                      }}>{fmt(v)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {quant?.non_partisan_block?.segments?.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 12, color: "var(--text-3)", marginBottom: 14, fontWeight: 500 }}>
            Bloque B — Sin afinidad partidista
            <span style={{ color: "var(--text-4)", fontFamily: "var(--mono)", marginLeft: 8 }}>
              {fmt(quant.non_partisan_block.total)}
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {quant.non_partisan_block.segments.map((s, i) => (
              <div key={i} style={{
                padding: "14px 16px", background: "var(--surface)",
                border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, color: "var(--text-2)", fontWeight: 500 }}>{s.name}</span>
                  <span style={{ fontSize: 12, color: "var(--text-3)", fontFamily: "var(--mono)", fontWeight: 500 }}>
                    {typeof s.size === "number" ? compact(s.size) : s.size}
                  </span>
                </div>
                {s.description && (
                  <div style={{ fontSize: 11, color: "var(--text-4)", marginTop: 5, lineHeight: 1.5 }}>
                    {s.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {quant?.universe?.methodology && (
        <div style={{
          marginTop: 16, padding: "14px 16px", background: "var(--surface)",
          borderRadius: "var(--radius-sm)", fontSize: 12, color: "var(--text-4)", lineHeight: 1.7,
          border: "1px solid var(--border-subtle)",
        }}>
          <span style={{ fontWeight: 500, color: "var(--text-3)" }}>Metodologia:</span>{" "}
          {quant.universe.methodology}
        </div>
      )}
    </ReportSection>
  );
}
