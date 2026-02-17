import { ARCHETYPE_TAXONOMY } from '../../constants/archetypes';
import { pct } from '../../utils/formatters';
import ReportSection from '../ReportSection';

export default function CandidatesSection({ archetype }) {
  if (!archetype?.candidates?.length) return null;

  const taxonomyMatch = ARCHETYPE_TAXONOMY.find(a => a.name === archetype?.primary_archetype);

  function resolveAdjective(adj) {
    if (typeof adj === "string") {
      const isMatch = taxonomyMatch?.adj.some(a => a.toLowerCase() === adj.toLowerCase());
      const isContra = taxonomyMatch?.contra.some(a => a.toLowerCase() === adj.toLowerCase());
      return { word: adj, match: isMatch, contra: isContra };
    }
    const word = adj.word || adj;
    let isMatch = adj.match === true;
    let isContra = adj.contra === true;
    if (!isMatch && taxonomyMatch) {
      isMatch = taxonomyMatch.adj.some(a => a.toLowerCase() === word.toLowerCase());
    }
    if (!isContra && taxonomyMatch) {
      isContra = taxonomyMatch.contra.some(a => a.toLowerCase() === word.toLowerCase());
    }
    return { word, match: isMatch, contra: isContra };
  }

  return (
    <ReportSection title="2. Candidatos y Concordancia Arquetipica">
      <div style={{
        fontSize: 12, color: "var(--text-4)", marginBottom: 18, lineHeight: 1.5,
      }}>
        Adjetivacion digital por candidato.{" "}
        <span style={{ color: "var(--green)" }}>Verde</span> = coincide con arquetipo demandado.{" "}
        <span style={{ color: "var(--red)", textDecoration: "line-through" }}>Tachado</span> = contra-adjetivo.
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {archetype.candidates.map((c, i) => {
          const adjectives = (c.adjectives || []).map(resolveAdjective);

          return (
            <div key={i} style={{
              padding: "18px 20px",
              background: "var(--surface)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius)",
            }}>
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                marginBottom: 12,
              }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", letterSpacing: -0.2 }}>
                    {c.name}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-4)", marginTop: 3 }}>{c.party}</div>
                </div>
                {c.archetype_match_score != null && (
                  <div style={{
                    fontFamily: "var(--mono)", fontSize: 14, fontWeight: 600,
                    color: c.archetype_match_score > 0.6 ? "var(--green)" : "var(--text-3)",
                  }}>
                    {pct(c.archetype_match_score)}
                  </div>
                )}
              </div>

              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: c.digital_signal ? 12 : 0 }}>
                {adjectives.map((adj, j) => (
                  <span key={j} style={{
                    padding: "3px 10px", borderRadius: 4, fontSize: 12,
                    background: adj.match ? "var(--green-soft)"
                      : adj.contra ? "var(--red-soft)"
                      : "var(--surface-hover)",
                    color: adj.match ? "var(--green)"
                      : adj.contra ? "var(--red)"
                      : "var(--text-3)",
                    fontWeight: adj.match || adj.contra ? 600 : 400,
                    textDecoration: adj.contra ? "line-through" : "none",
                  }}>
                    {adj.word}
                  </span>
                ))}
              </div>

              {c.digital_signal && (
                <div style={{ fontSize: 12, color: "var(--text-4)", lineHeight: 1.5, fontStyle: "italic" }}>
                  {c.digital_signal}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </ReportSection>
  );
}
