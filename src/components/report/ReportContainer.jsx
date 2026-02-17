import { forwardRef } from 'react';
import ReportHeader from './ReportHeader';
import ExecutiveSummary from './ExecutiveSummary';
import ArchetypeSection from './ArchetypeSection';
import CandidatesSection from './CandidatesSection';
import DigitalUniverseSection from './DigitalUniverseSection';
import StrategicImplications from './StrategicImplications';
import RisksAndNextSteps from './RisksAndNextSteps';
import MethodologyNote from './MethodologyNote';
import ReportFooter from './ReportFooter';
import ReportActions from './ReportActions';
import { validatePromptCompliance, formatComplianceIssues } from '../../utils/promptCompliance';

const ReportContainer = forwardRef(function ReportContainer({ report, reportElementRef }, ref) {
  if (!report) return null;

  const validation = validatePromptCompliance(report);

  return (
    <div ref={ref} style={{ 
      animation: "fadeIn 0.8s ease, slideUp 0.6s ease",
      marginTop: 40
    }}>
      
      {/* Banner de éxito */}
      <div style={{
        background: "linear-gradient(135deg, var(--green-soft), var(--accent-soft))",
        border: "1px solid var(--green-border)",
        borderRadius: "var(--radius-lg)",
        padding: "20px 24px",
        marginBottom: 20,
        textAlign: "center"
      }}>
        <div style={{
          fontSize: 14,
          fontFamily: "var(--mono)",
          fontWeight: 600,
          color: "var(--green)",
          letterSpacing: 1,
          marginBottom: 8
        }}>
          🎯 REPORTE DE INTELIGENCIA POLÍTICA DIGITAL
        </div>
        <div style={{
          fontSize: 13,
          color: "var(--text-2)",
          lineHeight: 1.6
        }}>
          Análisis completo para <strong>{report.territory}</strong> • 
          Criterio: <strong>{report.criteria}</strong> • 
          {report.timestamp && new Date(report.timestamp).toLocaleDateString("es")}
        </div>
      </div>

      <ReportActions reportRef={reportElementRef} report={report} />
      <div ref={reportElementRef} data-pdf-root style={{
        background: "var(--glass)",
        border: "1px solid var(--glass-border)",
        borderRadius: "var(--radius-lg)",
        padding: "40px 36px",
      }}>
        <ReportHeader report={report} />
        
        {/* Validación de cumplimiento del prompt */}
        <div style={{
          margin: "24px 0",
          padding: "16px 20px",
          background: validation.isCompliant ? "var(--green-soft)" : "var(--amber-soft)",
          border: `1px solid ${validation.isCompliant ? 'var(--green-border)' : 'var(--amber-border)'}`,
          borderRadius: "var(--radius)",
        }}>
          <div style={{
            fontSize: 12,
            fontFamily: "var(--mono)",
            color: validation.isCompliant ? "var(--green)" : "var(--amber)",
            fontWeight: 600,
            letterSpacing: 1,
            marginBottom: validation.isCompliant ? 0 : 8
          }}>
            VALIDACIÓN DEL PROMPT
          </div>
          <div style={{
            fontSize: 13,
            color: "var(--text-2)",
            lineHeight: 1.6,
            whiteSpace: "pre-line"
          }}>
            {formatComplianceIssues(validation)}
          </div>
        </div>

        <ExecutiveSummary synthesis={report.synthesis} />
        <ArchetypeSection archetype={report.archetype} />
        <CandidatesSection archetype={report.archetype} />
        <DigitalUniverseSection quant={report.quant} criteria={report.criteria} />
        <StrategicImplications synthesis={report.synthesis} />
        <RisksAndNextSteps synthesis={report.synthesis} />
        <MethodologyNote synthesis={report.synthesis} />
        <ReportFooter report={report} />
      </div>
    </div>
  );
});

export default ReportContainer;
