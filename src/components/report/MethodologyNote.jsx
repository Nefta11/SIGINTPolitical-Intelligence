export default function MethodologyNote({ synthesis }) {
  if (!synthesis?.methodology_note) return null;
  return (
    <div style={{
      marginTop: 28, marginBottom: 28, padding: "18px 20px",
      background: "var(--surface)",
      border: "1px solid var(--border-subtle)", borderRadius: "var(--radius)",
    }}>
      <div style={{
        fontFamily: "var(--mono)", fontSize: 10, color: "var(--text-4)",
        letterSpacing: 1.5, marginBottom: 10, fontWeight: 500,
      }}>
        METODOLOGIA
      </div>
      <div style={{ fontSize: 13, color: "var(--text-3)", lineHeight: 1.7 }}>
        {synthesis.methodology_note}
      </div>
    </div>
  );
}
