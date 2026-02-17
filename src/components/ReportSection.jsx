export default function ReportSection({ title, children }) {
  return (
    <section style={{ marginBottom: 40 }}>
      <h3 style={{
        fontFamily: "var(--mono)", fontSize: 11, fontWeight: 500,
        color: "var(--text-3)", letterSpacing: 1.5, marginBottom: 16,
        paddingBottom: 10, borderBottom: "1px solid var(--border-subtle)",
        textTransform: "uppercase",
      }}>
        {title}
      </h3>
      <div style={{ color: "var(--text-2)", fontSize: 14, lineHeight: 1.7 }}>
        {children}
      </div>
    </section>
  );
}
