import { useState, useEffect } from 'react';

export default function SuccessNotification({ show, onDismiss, reportData }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      // Auto dismiss después de 8 segundos
      const timer = setTimeout(() => {
        setVisible(false);
        onDismiss?.();
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [show, onDismiss]);

  if (!visible || !show) return null;

  return (
    <div style={{
      position: "fixed",
      top: 20,
      right: 20,
      maxWidth: 420,
      background: "var(--green-soft)",
      border: "1px solid var(--green-border)",
      borderRadius: "var(--radius)",
      padding: "20px 24px",
      boxShadow: "0 12px 40px rgba(52,211,153,0.15)",
      zIndex: 1000,
      animation: "slideInRight 0.4s ease"
    }}>
      <div style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        marginBottom: 12
      }}>
        <div style={{
          fontSize: 14,
          fontFamily: "var(--mono)",
          fontWeight: 600,
          color: "var(--green)",
          letterSpacing: 0.5,
          display: "flex",
          alignItems: "center",
          gap: 8
        }}>
          ✅ ANÁLISIS COMPLETADO
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
        fontSize: 14,
        color: "var(--text)",
        lineHeight: 1.6,
        marginBottom: 16
      }}>
        <strong>Reporte de inteligencia política digital generado exitosamente</strong>
        <br />
        Territorio: <strong>{reportData?.territory}</strong>
        <br />
        Criterio: <strong>{reportData?.criteria}</strong>
      </div>

      {reportData && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 12,
          fontSize: 12,
          color: "var(--text-3)"
        }}>
          <div>
            <span style={{ color: "var(--green)", fontWeight: 600 }}>Arquetipo:</span>{" "}
            {reportData.archetype?.primary_archetype || 'N/A'}
          </div>
          <div>
            <span style={{ color: "var(--green)", fontWeight: 600 }}>Candidatos:</span>{" "}
            {reportData.archetype?.candidates?.length || 0}
          </div>
          <div>
            <span style={{ color: "var(--green)", fontWeight: 600 }}>Universo Digital:</span>{" "}
            {reportData.quant?.universe?.total_digital_users?.toLocaleString() || 'N/A'}
          </div>
          <div>
            <span style={{ color: "var(--green)", fontWeight: 600 }}>Confiabilidad:</span>{" "}
            {reportData.synthesis?.reliability_score 
              ? `${(reportData.synthesis.reliability_score * 100).toFixed(1)}%`
              : 'N/A'
            }
          </div>
        </div>
      )}

      <div style={{
        marginTop: 16,
        padding: "8px 0",
        borderTop: "1px solid var(--green-border)",
        fontSize: 12,
        color: "var(--text-4)",
        fontStyle: "italic",
        textAlign: "center"
      }}>
        📊 Desplázate hacia abajo para ver el reporte completo
      </div>
    </div>
  );
}
