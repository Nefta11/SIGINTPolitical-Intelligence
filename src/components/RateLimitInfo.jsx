import { useState, useEffect } from 'react';

export default function RateLimitInfo({ show, onDismiss }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
    }
  }, [show]);

  if (!visible || !show) return null;

  return (
    <div style={{
      position: "fixed",
      top: 20,
      right: 20,
      maxWidth: 400,
      background: "var(--amber-soft)",
      border: "1px solid var(--amber-border)",
      borderRadius: "var(--radius)",
      padding: "16px 20px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
      zIndex: 1000,
      animation: "slideInRight 0.3s ease"
    }}>
      <div style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        marginBottom: 8
      }}>
        <div style={{
          fontSize: 12,
          fontFamily: "var(--mono)",
          fontWeight: 600,
          color: "var(--amber)",
          letterSpacing: 1
        }}>
          ⚡ RATE LIMIT DETECTADO
        </div>
        <button
          onClick={() => {
            setVisible(false);
            onDismiss?.();
          }}
          style={{
            background: "none",
            border: "none",
            color: "var(--text-4)",
            cursor: "pointer",
            fontSize: 16,
            lineHeight: 1,
            padding: 0
          }}
        >
          ×
        </button>
      </div>
      
      <div style={{
        fontSize: 13,
        color: "var(--text-2)",
        lineHeight: 1.6
      }}>
        El sistema está manejando automáticamente los límites de la API de Claude.
        <br />
        <strong>Los agentes continuarán procesando</strong> con estrategias inteligentes:
        <br />• Delays de 8s entre agentes  
        <br />• Hasta 5 reintentos con backoff exponencial
        <br />• Modelo fallback más económico si es necesario
      </div>
      
      <div style={{
        marginTop: 12,
        fontSize: 12,
        color: "var(--text-3)",
        fontStyle: "italic"
      }}>
        Si persiste, el sistema ofrecerá una pausa automática
      </div>
    </div>
  );
}
