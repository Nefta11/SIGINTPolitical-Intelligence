import { ARCHETYPE_TAXONOMY } from '../../constants/archetypes';
import { pct } from '../../utils/formatters';
import ReportSection from '../ReportSection';

export default function ArchetypeSection({ archetype }) {
  const match = ARCHETYPE_TAXONOMY.find(a => a.name === archetype?.primary_archetype);

  return (
    <ReportSection title="1. Arquetipo de Liderazgo Demandado">
      {archetype?.primary_archetype && (
        <>
          <div style={{
            display: "flex", alignItems: "baseline", gap: 14,
            marginBottom: 16,
          }}>
            <span style={{
              fontSize: 26, fontWeight: 700, color: "var(--text)",
              letterSpacing: -0.5,
            }}>
              {archetype.primary_archetype}
            </span>
            {archetype.confidence != null && (
              <span style={{
                fontFamily: "var(--mono)", fontSize: 12, color: "var(--text-3)",
              }}>
                {pct(archetype.confidence)} confianza
              </span>
            )}
          </div>

          {archetype.secondary_archetype && (
            <div style={{ fontSize: 12, color: "var(--text-4)", marginBottom: 16 }}>
              Arquetipo secundario: {archetype.secondary_archetype}
            </div>
          )}

          {archetype.reasoning && (
            <p style={{ fontSize: 13, color: "var(--text-3)", marginBottom: 24, lineHeight: 1.7 }}>
              {archetype.reasoning}
            </p>
          )}

          {match && (
            <div style={{
              display: "flex", gap: 28, fontSize: 12, color: "var(--text-4)",
              marginBottom: 28, flexWrap: "wrap",
            }}>
              <div>
                <span style={{ color: "var(--green)", fontWeight: 500 }}>Adjetivos +</span>{" "}
                {match.adj.join(", ")}
              </div>
              <div>
                <span style={{ color: "var(--red)", fontWeight: 500 }}>Contra-adjetivos</span>{" "}
                {match.contra.join(", ")}
              </div>
            </div>
          )}

          {/* 1.1 DEMANDAS POSITIVAS */}
          {archetype.positive_demands?.length > 0 && (
            <div style={{ marginBottom: 28 }}>
              <div style={{
                fontFamily: "var(--mono)", fontSize: 10, color: "var(--text-3)", fontWeight: 500,
                marginBottom: 12, letterSpacing: 1.5,
              }}>
                1.1 PUNTOS POSITIVOS
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {archetype.positive_demands.map((d, i) => (
                  <div key={i} style={{
                    padding: "12px 16px",
                    background: "var(--green-soft)",
                    borderLeft: "2px solid var(--green-border)",
                    borderRadius: "0 var(--radius-sm) var(--radius-sm) 0",
                  }}>
                    <div style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.6 }}>{d.text}</div>
                    {d.signal && (
                      <div style={{ fontSize: 11, color: "var(--text-4)", marginTop: 6 }}>
                        Senal: {d.signal}
                        {d.observation_type && (
                          <span style={{
                            marginLeft: 8,
                            padding: "2px 8px", borderRadius: 3, fontSize: 10,
                            background: d.observation_type === "observado" ? "var(--blue-soft)" : "var(--amber-soft)",
                            color: d.observation_type === "observado" ? "var(--blue)" : "var(--amber)",
                            fontFamily: "var(--mono)", fontWeight: 500,
                          }}>
                            {d.observation_type}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 1.2 RECHAZOS */}
          {archetype.negative_rejections?.length > 0 && (
            <div>
              <div style={{
                fontFamily: "var(--mono)", fontSize: 10, color: "var(--text-3)", fontWeight: 500,
                marginBottom: 12, letterSpacing: 1.5,
              }}>
                1.2 PUNTOS NEGATIVOS
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {archetype.negative_rejections.map((d, i) => (
                  <div key={i} style={{
                    padding: "12px 16px",
                    background: "var(--red-soft)",
                    borderLeft: "2px solid var(--red-border)",
                    borderRadius: "0 var(--radius-sm) var(--radius-sm) 0",
                  }}>
                    <div style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.6 }}>{d.text}</div>
                    {d.signal && (
                      <div style={{ fontSize: 11, color: "var(--text-4)", marginTop: 6 }}>
                        Senal: {d.signal}
                        {d.observation_type && (
                          <span style={{
                            marginLeft: 8,
                            padding: "2px 8px", borderRadius: 3, fontSize: 10,
                            background: d.observation_type === "observado" ? "var(--blue-soft)" : "var(--amber-soft)",
                            color: d.observation_type === "observado" ? "var(--blue)" : "var(--amber)",
                            fontFamily: "var(--mono)", fontWeight: 500,
                          }}>
                            {d.observation_type}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </ReportSection>
  );
}
