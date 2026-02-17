export default function AgentCard({ agent, status, logs }) {
  const isActive = status === "running";
  const isDone   = status === "done";
  const isError  = status === "error";

  const stateColor = isDone
    ? "var(--green)"
    : isError  ? "var(--red)"
    : isActive ? "var(--accent)"
    : "var(--text-4)";

  const stateLabel = isDone
    ? "Completado"
    : isError  ? "Error"
    : isActive ? "En proceso"
    : "Pendiente";

  return (
    <div style={{
      background: isActive ? "var(--accent-glow)" : "var(--surface)",
      border: `1px solid ${isActive ? "var(--accent-border)" : isDone ? "var(--green-border)" : "var(--border)"}`,
      borderRadius: "var(--radius)",
      padding: "16px 18px",
      transition: "all 0.3s ease",
      position: "relative",
      overflow: "hidden",
      boxShadow: isActive ? "0 0 0 3px var(--accent-soft)" : "var(--shadow-sm)",
    }}>
      {/* Progress bar */}
      {isActive && (
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 2,
          background: "linear-gradient(90deg, var(--accent), #7c3aed)",
          animation: "progress 2.5s ease-in-out infinite",
        }} />
      )}

      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: logs?.length ? 12 : 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Badge numérico */}
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: isDone ? "var(--green-soft)" : isActive ? "var(--accent-soft)" : "var(--surface-active)",
            border: `1px solid ${isDone ? "var(--green-border)" : isActive ? "var(--accent-border)" : "var(--border)"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--mono)", fontSize: 12, fontWeight: 600,
            color: isDone ? "var(--green)" : isActive ? "var(--accent)" : "var(--text-3)",
            flexShrink: 0,
            transition: "all 0.3s",
          }}>
            {isDone ? "✓" : agent.label}
          </div>
          <div>
            <div style={{
              fontSize: 13, fontWeight: 600,
              color: "var(--text)",
              letterSpacing: -0.2,
            }}>
              {agent.name}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 2 }}>
              {agent.desc}
            </div>
          </div>
        </div>

        {/* Estado */}
        <div style={{
          fontSize: 11, fontFamily: "var(--mono)", fontWeight: 600,
          color: stateColor,
          background: isDone ? "var(--green-soft)"
            : isError  ? "var(--red-soft)"
            : isActive ? "var(--accent-soft)"
            : "var(--surface-active)",
          border: `1px solid ${isDone ? "var(--green-border)"
            : isError  ? "var(--red-border)"
            : isActive ? "var(--accent-border)"
            : "var(--border)"}`,
          borderRadius: 5,
          padding: "3px 8px",
          letterSpacing: 0.3,
          animation: isActive ? "pulse 2s ease infinite" : "none",
        }}>
          {stateLabel}
        </div>
      </div>

      {/* Logs */}
      {logs && logs.length > 0 && (
        <div style={{
          background: "var(--bg)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-sm)",
          padding: "10px 12px",
          maxHeight: 100, overflowY: "auto",
          fontFamily: "var(--mono)", fontSize: 11, lineHeight: 1.9,
        }}>
          {logs.map((l, i) => (
            <div key={i} style={{
              color: l.type === "result"  ? "var(--green)"
                   : l.type === "error"   ? "var(--red)"
                   : l.type === "warning" ? "var(--amber)"
                   : l.type === "search"  ? "var(--accent)"
                   : "var(--text-3)",
              animation: "fadeInFast 0.2s ease",
            }}>
              <span style={{ color: "var(--text-4)", marginRight: 8 }}>{l.time}</span>
              {l.msg}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
