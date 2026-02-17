export default function ErrorBanner({ error }) {
  if (!error) return null;
  return (
    <div style={{
      background: "var(--red-soft)",
      border: "1px solid var(--red-border)",
      borderRadius: "var(--radius)", padding: "16px 20px", marginBottom: 28,
      fontSize: 14, color: "var(--text)", lineHeight: 1.6,
    }}>
      <span style={{ color: "var(--red)", fontWeight: 600, marginRight: 8 }}>Error</span>
      {error}
    </div>
  );
}
