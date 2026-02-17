import { useState } from 'react';

export default function InputPanel({ territory, setTerritory, criteria, setCriteria, running, onRun }) {
  const [showApiHelp, setShowApiHelp] = useState(false);
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  const hasValidKey = apiKey && apiKey !== 'sk-ant-TU-API-KEY-AQUI';
  const canRun = !running && territory.trim() && criteria.trim() && hasValidKey;

  return (
    <div style={{ marginBottom: 36 }}>
      {/* Título */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{
          fontSize: 26, fontWeight: 700, color: "var(--text)",
          letterSpacing: -0.7, lineHeight: 1.2, marginBottom: 6,
        }}>
          Análisis de inteligencia digital
        </h2>
        <p style={{ fontSize: 14, color: "var(--text-3)", lineHeight: 1.6 }}>
          Pipeline de 4 agentes con búsqueda web en tiempo real para análisis político.
        </p>
      </div>

      {/* API Key Warning */}
      {!hasValidKey && (
        <div style={{
          background: "var(--red-soft)",
          border: "1px solid var(--red-border)",
          borderRadius: "var(--radius)",
          padding: "16px 20px",
          marginBottom: 20,
        }}>
          <div style={{ fontSize: 14, color: "var(--red)", fontWeight: 600, marginBottom: 6 }}>
            API key requerida
          </div>
          <p style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.6 }}>
            Agrega tu key de Anthropic en el archivo{' '}
            <code style={{
              fontFamily: "var(--mono)", fontSize: 12,
              background: "var(--surface-active)", padding: "2px 6px", borderRadius: 4,
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
            {showApiHelp ? "Ocultar instrucciones" : "Ver instrucciones"}
          </button>
          {showApiHelp && (
            <ol style={{
              marginTop: 12, fontSize: 13, color: "var(--text-3)",
              lineHeight: 2, paddingLeft: 20,
            }}>
              <li>Visita <strong>console.anthropic.com</strong></li>
              <li>Crea una cuenta y ve a API Keys</li>
              <li>Genera una key y agrega créditos ($5 min)</li>
              <li>Pégala en <code style={{ fontFamily: "var(--mono)", fontSize: 11 }}>.env</code> como:{' '}
                <code style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--green)" }}>
                  VITE_ANTHROPIC_API_KEY=sk-ant-...
                </code>
              </li>
              <li>Reinicia con <code style={{ fontFamily: "var(--mono)", fontSize: 11 }}>npm run dev</code></li>
            </ol>
          )}
        </div>
      )}

      {/* Inputs */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
        {[
          { label: "Territorio", value: territory, setter: setTerritory, placeholder: "Colombia, Bogotá, México..." },
          { label: "Criterio de masa", value: criteria, setter: setCriteria, placeholder: "Anti-petrismo, Pro-Uribe..." },
        ].map(({ label, value, setter, placeholder }) => (
          <div key={label}>
            <label style={{
              fontSize: 12, color: "var(--text-3)", marginBottom: 7,
              display: "block", fontWeight: 600, letterSpacing: 0.2,
              textTransform: "uppercase",
            }}>
              {label}
            </label>
            <input
              value={value}
              onChange={e => setter(e.target.value)}
              placeholder={placeholder}
              disabled={running}
              style={{
                width: "100%",
                padding: "11px 14px",
                background: running ? "var(--surface-active)" : "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm)",
                color: "var(--text)",
                fontSize: 14,
                fontFamily: "var(--sans)",
                transition: "border-color 0.2s, box-shadow 0.2s",
                boxShadow: "var(--shadow-sm)",
              }}
            />
          </div>
        ))}
      </div>

      {/* Botón ejecutar */}
      <button
        onClick={onRun}
        disabled={!canRun}
        style={{
          width: "100%",
          height: 46,
          background: canRun
            ? "linear-gradient(135deg, var(--accent) 0%, #7c3aed 100%)"
            : "var(--surface-active)",
          color: canRun ? "#ffffff" : "var(--text-4)",
          border: canRun ? "none" : "1px solid var(--border)",
          borderRadius: "var(--radius-sm)",
          fontSize: 14, fontWeight: 600,
          fontFamily: "var(--sans)",
          letterSpacing: -0.2,
          cursor: canRun ? "pointer" : "not-allowed",
          transition: "all 0.2s ease",
          position: "relative",
          overflow: "hidden",
          boxShadow: canRun ? "0 4px 14px rgba(79,70,229,0.35)" : "none",
        }}
      >
        {running && (
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: 2,
            background: "rgba(255,255,255,0.4)",
            animation: "progress 2s ease-in-out infinite",
          }} />
        )}
        {running
          ? "Ejecutando análisis..."
          : !hasValidKey
          ? "Configura tu API key"
          : "Ejecutar análisis"}
      </button>

      {hasValidKey && !running && (
        <div style={{
          marginTop: 10, fontSize: 12, color: "var(--text-4)",
          textAlign: "center",
        }}>
          Costo estimado ~$0.15–0.30 USD por ejecución
        </div>
      )}
    </div>
  );
}
