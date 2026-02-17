export default function Header() {
  return (
    <header style={{
      borderBottom: "1px solid var(--border-subtle)",
      padding: "0 28px",
      background: "var(--bg)",
      position: "sticky", top: 0, zIndex: 50,
      backdropFilter: "blur(12px)",
    }}>
      <div style={{
        maxWidth: 920, margin: "0 auto",
        height: 56,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {/* Logo mark */}
          <div style={{
            width: 28, height: 28, borderRadius: 7,
            background: "linear-gradient(135deg, var(--accent) 0%, #6366f1 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <div style={{
              width: 10, height: 10, borderRadius: 2,
              border: "2px solid rgba(255,255,255,0.9)",
            }} />
          </div>
          <div>
            <span style={{
              fontSize: 14, fontWeight: 600, color: "var(--text)",
              letterSpacing: -0.3,
            }}>
              SIGINT
            </span>
            <span style={{
              fontSize: 14, fontWeight: 400, color: "var(--text-3)",
              marginLeft: 6,
            }}>
              Political Intelligence
            </span>
          </div>
        </div>
        <div style={{
          fontFamily: "var(--mono)", fontSize: 11, color: "var(--text-4)",
        }}>
          v2.0
        </div>
      </div>
    </header>
  );
}
