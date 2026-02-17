export default function AgentCard({ agent, status, logs }) {
  const isActive = status === "running";
  const isDone = status === "done";
  const isError = status === "error";

  const stateColor = isDone ? "var(--green)" : isError ? "var(--red)" : isActive ? "var(--accent)" : "var(--text-4)";
  const stateLabel = isDone ? "Completado" : isError ? "Error" : isActive ? "En proceso" : "Pendiente";

  return (
    <div style={{
      background: isActive ? "var(--accent-glow)" : "var(--surface)",
      border: `1px solid ${isActive ? "var(--accent-border)" : "var(--border-subtle)"}`,
      borderRadius: "var(--radius)",
      padding: "16px 18px",
      transition: "all 0.3s ease",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Progress bar */}
      {isActive && (
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 2,
          background: "var(--accent)",
          animation: "progress 2.5s ease-in-out infinite",
        }} />
      )}

      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: logs?.length ? 12 : 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Number badge */}
          <div style={{
            width: 28, height: 28, borderRadius: 6,
            background: isDone ? "var(--green-soft)" : isActive ? "var(--accent-soft)" : "var(--surface)",
            border: `1px solid ${isDone ? "var(--green-border)" : isActive ? "var(--accent-border)" : "var(--border)"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--mono)", fontSize: 11, fontWeight: 500,
            color: isDone ? "var(--green)" : isActive ? "var(--accent)" : "var(--text-4)",
            flexShrink: 0,
            transition: "all 0.3s",
          }}>
            {isDone ? "\u2713" : agent.label}
          </div>
          <div>
            <div style={{
              fontSize: 13, fontWeight: 600,
              color: isDone ? "var(--text)" : isActive ? "var(--text)" : "var(--text-3)",
              letterSpacing: -0.2,
              transition: "color 0.3s",
            }}>
              {agent.name}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-4)", marginTop: 1 }}>{agent.desc}</div>
          </div>
        </div>

        {/* Status label */}
        <div style={{
          fontSize: 11, fontFamily: "var(--mono)", fontWeight: 500,
          color: stateColor,
          animation: isActive ? "pulse 2s ease infinite" : "none",
        }}>
          {stateLabel}
        </div>
      </div>

      {/* Logs */}
      {logs && logs.length > 0 && (
        <div style={{
          background: "rgba(0,0,0,0.25)", borderRadius: "var(--radius-sm)",
          padding: "10px 12px",
          maxHeight: 96, overflowY: "auto",
          fontFamily: "var(--mono)", fontSize: 11, lineHeight: 1.8,
        }}>
          {logs.map((l, i) => (
            <div key={i} style={{
              color: l.type === "result" ? "var(--green)"
                : l.type === "error" ? "var(--red)"
                : l.type === "warning" ? "var(--amber)"
                : l.type === "search" ? "var(--text-3)"
                : "var(--text-4)",
              animation: "fadeInFast 0.2s ease",
              fontWeight: l.msg.includes('⏳') ? 600 : 400,
            }}>
              <span style={{ color: "var(--text-4)", marginRight: 6 }}>{l.time}</span>
              {l.msg}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
