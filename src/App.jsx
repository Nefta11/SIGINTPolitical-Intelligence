import { useRef } from 'react';
import { useAgenticPipeline } from './hooks/useAgenticPipeline';
import { useTheme } from './hooks/useTheme';
import Header from './components/Header';
import InputPanel from './components/InputPanel';
import AgentGrid from './components/AgentGrid';
import ErrorBanner from './components/ErrorBanner';
import ReportHistory from './components/ReportHistory';
import ReportContainer from './components/report/ReportContainer';
import RateLimitInfo from './components/RateLimitInfo';
import SuccessNotification from './components/SuccessNotification';
import PauseResumeControl from './components/PauseResumeControl';

export default function App() {
  const { dark, toggle } = useTheme();

  const {
    territory, setTerritory,
    criteria, setCriteria,
    running,
    agentStates,
    agentLogs,
    report,
    error,
    showRateLimitInfo,
    setShowRateLimitInfo,
    showSuccessNotification,
    setShowSuccessNotification,
    showPauseControl,
    handlePauseResume,
    handleCancelAnalysis,
    reportRef,
    runAgenticPipeline,
    loadReport,
    clearReport,
  } = useAgenticPipeline();

  const reportElementRef = useRef(null);

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg)",
      color: "var(--text-2)",
      fontFamily: "var(--sans)",
      fontSize: 14,
    }}>
      <Header dark={dark} onToggleTheme={toggle} />
      <main style={{ maxWidth: 960, margin: "0 auto", padding: "40px 28px 100px" }}>
        <InputPanel
          territory={territory}
          setTerritory={setTerritory}
          criteria={criteria}
          setCriteria={setCriteria}
          running={running}
          onRun={runAgenticPipeline}
          hasReport={!!report}
          onClear={clearReport}
        />
        <ReportHistory onLoadReport={loadReport} currentReport={report} />
        <AgentGrid agentStates={agentStates} agentLogs={agentLogs} running={running} />
        <ErrorBanner error={error} />
        <ReportContainer ref={reportRef} report={report} reportElementRef={reportElementRef} />
      </main>

      <RateLimitInfo
        show={showRateLimitInfo}
        onDismiss={() => setShowRateLimitInfo(false)}
      />

      <SuccessNotification
        show={showSuccessNotification}
        onDismiss={() => setShowSuccessNotification(false)}
        reportData={report}
      />

      <PauseResumeControl
        show={showPauseControl}
        onResume={handlePauseResume}
        onCancel={handleCancelAnalysis}
        lastError={error}
      />
    </div>
  );
}
