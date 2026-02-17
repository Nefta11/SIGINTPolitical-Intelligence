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
      animation: "fadeIn 0.7s ease, slideUp 0.5s ease",
      marginTop: 40
    }}>

      {/* Banner cabecera */}
      <div style={{
        background: "linear-gradient(135deg, var(--accent-soft) 0%, rgba(124,58,237,0.06) 100%)",
        border: "1px solid var(--accent-border)",
        borderRadius: "var(--radius-lg)",
        padding: "18px 24px",
        marginBottom: 16,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 10,
      }}>
        <div style={{
          fontSize: 12, fontFamily: "var(--mono)", fontWeight: 700,
          color: "var(--accent)", letterSpacing: 1.5,
        }}>
          REPORTE DE INTELIGENCIA POLÍTICA DIGITAL
        </div>
        <div style={{ fontSize: 13, color: "var(--text-3)" }}>
          <strong style={{ color: "var(--text)" }}>{report.territory}</strong>
          <span style={{ margin: "0 8px", color: "var(--border)" }}>·</span>
          {report.criteria}
          <span style={{ margin: "0 8px", color: "var(--border)" }}>·</span>
          <span style={{ fontFamily: "var(--mono)", fontSize: 11 }}>
            {report.timestamp && new Date(report.timestamp).toLocaleDateString("es")}
          </span>
        </div>
      </div>

      <ReportActions reportRef={reportElementRef} report={report} />
      <div ref={reportElementRef} data-pdf-root style={{
        background: "var(--glass)",
        border: "1px solid var(--glass-border)",
        borderRadius: "var(--radius-lg)",
        padding: "40px 36px",
        boxShadow: "var(--shadow)",
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
