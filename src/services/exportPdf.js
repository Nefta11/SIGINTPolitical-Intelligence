export async function exportReportToPdf(reportElement, report) {
  // Carga dinámica de html2pdf para no bloquearlo si no se usa
  const html2pdf = (await import('html2pdf.js')).default;

  const filename = `SIGINT_${report.territory}_${report.criteria}_${new Date().toISOString().slice(0, 10)}.pdf`;

  const opt = {
    margin: [10, 10, 10, 10],
    filename,
    image: { type: 'jpeg', quality: 0.95 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      backgroundColor: '#0a0a0f',
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait',
    },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
  };

  await html2pdf().set(opt).from(reportElement).save();
}
