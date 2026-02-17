import { useState, useEffect } from 'react';
import { getReports, deleteReport, clearAllReports } from '../services/storage';

export default function ReportHistory({ onLoadReport, currentReport }) {
  const [reports, setReports] = useState([]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setReports(getReports());
  }, [currentReport]);

  if (reports.length === 0) return null;

  const handleDelete = (id, e) => {
    e.stopPropagation();
    deleteReport(id);
    setReports(getReports());
  };

  return (
    <div style={{
      border: "1px solid var(--border-subtle)",
      borderRadius: "var(--radius)",
      marginBottom: 32,
      overflow: "hidden",
      background: "var(--surface)",
    }}>
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
          cursor: "pointer", padding: "14px 18px",
          background: "none", border: "none", color: "var(--text-2)",
          fontFamily: "var(--sans)", fontSize: 13, fontWeight: 500,
          textAlign: "left",
        }}
      >
        <span>Reportes guardados ({reports.length})</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
          style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
          <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {expanded && (
        <div style={{ padding: "0 8px 8px" }}>
          <div style={{ maxHeight: 280, overflowY: "auto", display: "flex", flexDirection: "column", gap: 2 }}>
            {reports.map(r => (
              <div
                key={r.id}
                onClick={() => onLoadReport(r)}
                style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "12px 14px", borderRadius: "var(--radius-sm)",
                  cursor: "pointer", transition: "background 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "var(--surface-hover)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <div style={{ minWidth: 0 }}>
                  <div style={{
                    fontSize: 14, color: "var(--text)", fontWeight: 500,
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  }}>
                    {r.territory} — {r.criteria}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-4)", marginTop: 3, fontFamily: "var(--mono)" }}>
                    {new Date(r.savedAt || r.timestamp).toLocaleDateString("es", { day: "numeric", month: "short", year: "numeric" })}
                    {r.synthesis?.reliability_score != null && (
                      <span style={{
                        marginLeft: 10,
                        color: r.synthesis.reliability_score > 0.6 ? "var(--green)" : "var(--text-3)",
                      }}>
                        {(r.synthesis.reliability_score * 100).toFixed(0)}%
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={(e) => handleDelete(r.id, e)}
                  style={{
                    background: "none", border: "none", color: "var(--text-4)",
                    padding: "6px", cursor: "pointer", borderRadius: 4,
                    lineHeight: 1, fontSize: 16, flexShrink: 0,
                    transition: "color 0.15s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = "var(--red)"}
                  onMouseLeave={e => e.currentTarget.style.color = "var(--text-4)"}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <div style={{ padding: "10px 6px 2px", borderTop: "1px solid var(--border-subtle)", marginTop: 4 }}>
            <button
              onClick={() => { if (confirm('Eliminar todo?')) { clearAllReports(); setReports([]); } }}
              style={{
                background: "none", border: "none", color: "var(--text-4)",
                cursor: "pointer", fontSize: 12, fontFamily: "var(--sans)",
                padding: 0, transition: "color 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.color = "var(--red)"}
              onMouseLeave={e => e.currentTarget.style.color = "var(--text-4)"}
            >
              Eliminar todo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
