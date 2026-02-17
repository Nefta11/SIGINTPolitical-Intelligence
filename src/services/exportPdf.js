export async function exportReportToPdf(reportElement, report) {
  const html2pdf = (await import('html2pdf.js')).default;

  const filename = `SIGINT_${report.territory}_${report.criteria}_${new Date().toISOString().slice(0, 10)}.pdf`;

  const opt = {
    margin: [12, 12, 12, 12],
    filename,
    image: { type: 'jpeg', quality: 0.92 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
      onclone: (clonedDoc) => {
        const el = clonedDoc.querySelector('[data-pdf-root]');
        if (!el) return;

        // Fuerza tema claro en el clon para que html2canvas resuelva los colores
        el.style.background = '#ffffff';
        el.style.color = '#111111';

        // Reemplaza todas las variables CSS por valores concretos
        const allEls = clonedDoc.querySelectorAll('*');
        allEls.forEach(node => {
          if (node.style) {
            const cs = window.getComputedStyle(node);
            node.style.color = cs.color || '#111111';
            node.style.background = cs.backgroundColor === 'rgba(0, 0, 0, 0)'
              ? 'transparent'
              : (cs.backgroundColor || 'transparent');
            node.style.borderColor = cs.borderColor || 'transparent';
            node.style.fontFamily = cs.fontFamily || 'sans-serif';
          }
        });
      },
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait',
    },
    pagebreak: { mode: ['css', 'legacy'] },
  };

  await html2pdf().set(opt).from(reportElement).save();
}
