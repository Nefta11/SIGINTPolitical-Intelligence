import { useState } from 'react';

export default function InputPanel({ territory, setTerritory, criteria, setCriteria, running, onRun }) {
  const [showApiHelp, setShowApiHelp] = useState(false);
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  const hasValidKey = apiKey && apiKey !== 'sk-ant-TU-API-KEY-AQUI';
  const canRun = !running && territory.trim() && criteria.trim() && hasValidKey;

  return (
    <div style={{ marginBottom: 32 }}>
      {/* Title */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{
          fontSize: 28, fontWeight: 700, color: "var(--text)",
          letterSpacing: -0.8, lineHeight: 1.2, marginBottom: 8,
        }}>
          Analisis de inteligencia digital
        </h2>
        <p style={{ fontSize: 15, color: "var(--text-3)", lineHeight: 1.5 }}>
          Pipeline de 4 agentes con busqueda web en tiempo real para analisis politico.
        </p>
      </div>

      {/* API Key Warning */}
      {!hasValidKey && (
        <div style={{
          background: "var(--red-soft)", border: "1px solid var(--red-border)",
          borderRadius: "var(--radius)", padding: "16px 20px", marginBottom: 20,
        }}>
          <div style={{ fontSize: 14, color: "var(--red)", fontWeight: 600, marginBottom: 6 }}>
            API key requerida
          </div>
          <p style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.6 }}>
            Agrega tu key de Anthropic en el archivo <code style={{
              fontFamily: "var(--mono)", fontSize: 12, color: "var(--text)",
              background: "var(--surface)", padding: "2px 6px", borderRadius: 4,
            }}>.env</code>
          </p>
          <button
            onClick={() => setShowApiHelp(!showApiHelp)}
            style={{
              background: "none", border: "none", color: "var(--accent)",
              fontSize: 13, cursor: "pointer", padding: 0, marginTop: 8,
              fontFamily: "var(--sans)", fontWeight: 500,
            }}
          >
            {showApiHelp ? "Ocultar" : "Ver instrucciones"}
          </button>
          {showApiHelp && (
            <ol style={{
              marginTop: 12, fontSize: 13, color: "var(--text-3)",
              lineHeight: 1.8, paddingLeft: 20,
            }}>
              <li>Visita console.anthropic.com</li>
              <li>Crea una cuenta y ve a API Keys</li>
              <li>Genera una key y agrega creditos ($5 min)</li>
              <li>Pegala en <code style={{ fontFamily: "var(--mono)", fontSize: 11 }}>.env</code> como:
                <code style={{
                  display: "block", fontFamily: "var(--mono)", fontSize: 11,
                  color: "var(--green)", marginTop: 4,
                }}>VITE_ANTHROPIC_API_KEY=sk-ant-...</code>
              </li>
              <li>Reinicia con <code style={{ fontFamily: "var(--mono)", fontSize: 11 }}>npm run dev</code></li>
            </ol>
          )}
        </div>
      )}

      {/* Input fields */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        <div>
          <label style={{
            fontSize: 13, color: "var(--text-2)", marginBottom: 8,
            display: "block", fontWeight: 500,
          }}>
            Territorio
          </label>
          <input
            value={territory}
            onChange={e => setTerritory(e.target.value)}
            placeholder="Colombia, Bogota..."
            disabled={running}
            style={{
              width: "100%", padding: "11px 14px",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-sm)", color: "var(--text)",
              fontSize: 14, fontFamily: "var(--sans)",
              transition: "border-color 0.2s, background 0.2s",
            }}
          />
        </div>
        <div>
          <label style={{
            fontSize: 13, color: "var(--text-2)", marginBottom: 8,
            display: "block", fontWeight: 500,
          }}>
            Criterio de masa
          </label>
          <input
            value={criteria}
            onChange={e => setCriteria(e.target.value)}
            placeholder="Anti-petrismo, Pro-Uribe..."
            disabled={running}
            style={{
              width: "100%", padding: "11px 14px",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-sm)", color: "var(--text)",
              fontSize: 14, fontFamily: "var(--sans)",
              transition: "border-color 0.2s, background 0.2s",
            }}
          />
        </div>
      </div>

      {/* Run button */}
      <button
        onClick={onRun}
        disabled={!canRun}
        style={{
          width: "100%",
          height: 44,
          background: canRun
            ? "linear-gradient(135deg, var(--accent) 0%, #6366f1 100%)"
            : "var(--surface)",
          color: canRun ? "#fff" : "var(--text-4)",
          border: canRun ? "none" : "1px solid var(--border)",
          borderRadius: "var(--radius-sm)",
          fontSize: 14, fontWeight: 600,
          fontFamily: "var(--sans)",
          letterSpacing: -0.2,
          cursor: canRun ? "pointer" : "not-allowed",
          transition: "all 0.2s ease",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {running && (
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: 2,
            background: "rgba(255,255,255,0.3)",
            animation: "progress 2s ease-in-out infinite",
          }} />
        )}
        {running ? "Ejecutando analisis..." : !hasValidKey ? "Configura tu API key" : "Ejecutar analisis"}
      </button>

      {hasValidKey && !running && (
        <div style={{
          marginTop: 10, fontSize: 12, color: "var(--text-4)",
          textAlign: "center",
        }}>
          Costo estimado ~$0.15–0.30 USD por ejecucion
        </div>
      )}
    </div>
  );
}
