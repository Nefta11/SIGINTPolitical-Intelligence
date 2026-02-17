export default function Header() {
  return (
    <header style={{
      borderBottom: "1px solid var(--border-subtle)",
      padding: "0 28px",
      background: "var(--bg-elevated)",
      position: "sticky", top: 0, zIndex: 50,
      backdropFilter: "blur(12px)",
      boxShadow: "var(--shadow-sm)",
    }}>
      <div style={{
        maxWidth: 960, margin: "0 auto",
        height: 58,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9,
            background: "linear-gradient(135deg, var(--accent) 0%, #7c3aed 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
            boxShadow: "0 2px 8px rgba(79,70,229,0.35)",
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="2.5" fill="white" />
              <circle cx="7" cy="7" r="5.5" stroke="white" strokeWidth="1.5" strokeDasharray="2 2" />
            </svg>
          </div>
          <div>
            <span style={{
              fontSize: 15, fontWeight: 700, color: "var(--text)",
              letterSpacing: -0.4,
            }}>
              SIGINT
            </span>
            <span style={{
              fontSize: 13, fontWeight: 400, color: "var(--text-3)",
              marginLeft: 8,
            }}>
              Political Intelligence
            </span>
          </div>
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <div style={{
            fontFamily: "var(--mono)", fontSize: 11,
            color: "var(--text-4)",
            background: "var(--surface-active)",
            border: "1px solid var(--border)",
            borderRadius: 5,
            padding: "3px 8px",
          }}>
            v2.0
          </div>
        </div>
      </div>
    </header>
  );
}
