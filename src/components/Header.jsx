export default function Header({ dark, onToggleTheme }) {
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
        {/* Logo */}
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
            <span style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", letterSpacing: -0.4 }}>
              SIGINT
            </span>
            <span style={{ fontSize: 13, fontWeight: 400, color: "var(--text-3)", marginLeft: 8 }}>
              Political Intelligence
            </span>
          </div>
        </div>

        {/* Controles derecha */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Toggle light/dark */}
          <button
            onClick={onToggleTheme}
            title={dark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            style={{
              width: 36, height: 36,
              borderRadius: 9,
              background: "var(--surface)",
              border: "1px solid var(--border)",
              cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 0.2s, border-color 0.2s",
              flexShrink: 0,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "var(--surface-hover)";
              e.currentTarget.style.borderColor = "var(--accent-border)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "var(--surface)";
              e.currentTarget.style.borderColor = "var(--border)";
            }}
          >
            {dark ? (
              /* Sol — cambiar a claro */
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4"/>
                <line x1="12" y1="2"  x2="12" y2="5"/>
                <line x1="12" y1="19" x2="12" y2="22"/>
                <line x1="4.22" y1="4.22"  x2="6.34" y2="6.34"/>
                <line x1="17.66" y1="17.66" x2="19.78" y2="19.78"/>
                <line x1="2"  y1="12" x2="5"  y2="12"/>
                <line x1="19" y1="12" x2="22" y2="12"/>
                <line x1="4.22" y1="19.78" x2="6.34" y2="17.66"/>
                <line x1="17.66" y1="6.34"  x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              /* Luna — cambiar a oscuro */
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>

          {/* Versión */}
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
