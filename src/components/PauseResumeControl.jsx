import { useState, useEffect } from 'react';

export default function PauseResumeControl({ show, onResume, onCancel, lastError }) {
  const [countdown, setCountdown] = useState(600); // 10 minutos en segundos
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    if (!show || !isRunning) return;

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [show, isRunning]);

  if (!show) return null;

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;
  const isReady = countdown === 0;

  return (
    <>
      {/* Overlay de fondo */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(15,17,23,0.45)",
        backdropFilter: "blur(4px)",
        zIndex: 1999,
        animation: "fadeIn 0.3s ease"
      }} />
      
      {/* Modal principal */}
      <div style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        background: "var(--bg-elevated)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        padding: "32px 40px",
        maxWidth: 520,
        boxShadow: "var(--shadow-lg)",
        zIndex: 2000,
        animation: "fadeIn 0.3s ease, slideUp 0.3s ease"
      }}>
      <div style={{
        fontSize: 16,
        fontWeight: 600,
        color: "var(--text)",
        marginBottom: 16,
        textAlign: "center"
      }}>
        ⏸️ Sistema en Pausa por Rate Limit
      </div>

      <div style={{
        fontSize: 14,
        color: "var(--text-2)",
        lineHeight: 1.6,
        marginBottom: 24
      }}>
        Claude ha alcanzado sus límites de uso temporales. El sistema puede:
        <br /><br />
        <strong>1. Esperar automáticamente</strong> y continuar donde se quedó
        <br />
        <strong>2. Reiniciar el análisis</strong> completo más tarde
      </div>

      {lastError && (
        <div style={{
          background: "var(--red-soft)",
          border: "1px solid var(--red-border)",
          borderRadius: "var(--radius)",
          padding: "12px 16px",
          fontSize: 12,
          color: "var(--text-3)",
          marginBottom: 24,
          fontFamily: "var(--mono)"
        }}>
          {lastError}
        </div>
      )}

      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 32
      }}>
        <div style={{
          fontSize: 32,
          fontFamily: "var(--mono)",
          fontWeight: 700,
          color: isReady ? "var(--green)" : "var(--accent)",
          textAlign: "center"
        }}>
          {isReady ? "✅ LISTO" : `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}
        </div>
      </div>

      <div style={{
        display: "flex",
        gap: 16,
        justifyContent: "center"
      }}>
        <button
          onClick={onCancel}
          style={{
            padding: "12px 24px",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            color: "var(--text-3)",
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 500
          }}
        >
          Cancelar Análisis
        </button>

        <button
          onClick={() => {
            if (isReady) {
              onResume();
            } else {
              setIsRunning(false);
              setCountdown(0);
            }
          }}
          style={{
            padding: "12px 24px",
            background: isReady 
              ? "linear-gradient(135deg, var(--green), var(--accent))"
              : "var(--amber-soft)",
            border: isReady 
              ? "1px solid var(--green-border)"
              : "1px solid var(--amber-border)",
            borderRadius: "var(--radius)",
            color: isReady ? "white" : "var(--amber)",
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 600
          }}
        >
          {isReady ? "🚀 Continuar Análisis" : "⏭️ Saltar Espera"}
        </button>
      </div>

      <div style={{
        marginTop: 20,
        fontSize: 11,
        color: "var(--text-4)",
        textAlign: "center",
        fontStyle: "italic"
      }}>
        Los límites se restablecen automáticamente con el tiempo
      </div>
      </div>
    </>
  );
}
