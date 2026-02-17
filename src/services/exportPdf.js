export async function exportReportToPdf(reportElement, report) {
  // Construye una ventana de impresión limpia — no usa html2canvas
  // así no congela el browser con reportes grandes
  const filename = `SIGINT_${report.territory}_${report.criteria}_${new Date().toISOString().slice(0, 10)}`;

  const printWin = window.open('', '_blank', 'width=900,height=700');
  if (!printWin) {
    throw new Error('El navegador bloqueó la ventana emergente. Permite pop-ups para este sitio y vuelve a intentarlo.');
  }

  // Clona el HTML del reporte
  const clone = reportElement.cloneNode(true);

  // Resuelve colores computados en el clon para que se vean bien en papel
  const allNodes = clone.querySelectorAll('*');
  allNodes.forEach(node => {
    const computed = window.getComputedStyle(
      reportElement.querySelector(`[data-pdf-node]`) || reportElement
    );
    node.style.fontFamily = 'Inter, Arial, sans-serif';
  });

  printWin.document.write(`<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>${filename}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Inter', Arial, sans-serif;
      font-size: 13px;
      line-height: 1.65;
      color: #111827;
      background: #fff;
      padding: 32px 40px;
      max-width: 820px;
      margin: 0 auto;
    }

    h1, h2, h3, h4 { color: #111827; font-weight: 700; margin-bottom: 8px; }
    h2 { font-size: 20px; letter-spacing: -0.3px; }
    h3 { font-size: 14px; text-transform: uppercase; letter-spacing: 1.2px; color: #6b7280; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; margin: 28px 0 14px; }
    p  { margin-bottom: 10px; color: #374151; }

    .cover {
      border-bottom: 2px solid #4f46e5;
      padding-bottom: 24px;
      margin-bottom: 32px;
    }
    .cover .label {
      font-size: 10px; font-weight: 700; letter-spacing: 2px;
      color: #4f46e5; text-transform: uppercase; margin-bottom: 8px;
    }
    .cover h1 { font-size: 26px; letter-spacing: -0.5px; }
    .cover .sub { font-size: 14px; color: #6b7280; margin-top: 4px; }
    .cover .meta { font-size: 11px; color: #9ca3af; margin-top: 12px; font-family: monospace; }

    .key-finding {
      background: #eff6ff;
      border-left: 3px solid #4f46e5;
      border-radius: 0 6px 6px 0;
      padding: 12px 16px;
      margin: 16px 0;
    }
    .key-finding .kf-label { font-size: 10px; font-weight: 700; letter-spacing: 1.5px; color: #4f46e5; margin-bottom: 4px; }
    .key-finding p { margin: 0; color: #1e3a8a; }

    .archetype-name { font-size: 28px; font-weight: 800; color: #111827; letter-spacing: -0.5px; }
    .archetype-meta { font-size: 12px; color: #6b7280; margin-top: 4px; }

    .tag {
      display: inline-block; font-size: 10px; font-weight: 600;
      padding: 2px 8px; border-radius: 4px; margin: 2px;
    }
    .tag-green  { background: #d1fae5; color: #065f46; }
    .tag-red    { background: #fee2e2; color: #991b1b; }
    .tag-blue   { background: #dbeafe; color: #1e40af; }
    .tag-amber  { background: #fef3c7; color: #92400e; }
    .tag-gray   { background: #f3f4f6; color: #374151; }

    .point {
      padding: 10px 14px;
      border-radius: 0 6px 6px 0;
      margin-bottom: 8px;
      font-size: 13px;
    }
    .point-pos { background: #ecfdf5; border-left: 3px solid #10b981; }
    .point-neg { background: #fef2f2; border-left: 3px solid #ef4444; }
    .point-signal { font-size: 11px; color: #9ca3af; margin-top: 4px; }

    .candidate {
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 14px 18px;
      margin-bottom: 12px;
      break-inside: avoid;
    }
    .candidate-name  { font-weight: 700; font-size: 14px; color: #111827; }
    .candidate-party { font-size: 12px; color: #6b7280; margin-bottom: 8px; }
    .candidate-signal { font-size: 11px; color: #9ca3af; margin-top: 8px; font-style: italic; }
    .adj-bold   { font-weight: 700; color: #065f46; }
    .adj-strike { text-decoration: line-through; color: #991b1b; }

    .stats-grid {
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 16px 0;
    }
    .stat-box {
      border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px;
    }
    .stat-label { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #9ca3af; font-weight: 600; }
    .stat-value { font-size: 20px; font-weight: 800; color: #111827; margin-top: 2px; }

    .impl-list, .risk-list, .step-list { padding-left: 0; list-style: none; }
    .impl-list li, .risk-list li, .step-list li {
      padding: 8px 12px; border-bottom: 1px solid #f3f4f6;
      font-size: 13px; color: #374151;
    }
    .impl-list li::before { content: "→ "; color: #4f46e5; font-weight: 700; }
    .risk-list li::before { content: "⚠ "; color: #d97706; }
    .step-list li::before { content: "✓ "; color: #059669; }

    .reliability {
      display: flex; align-items: center; gap: 16px;
      padding: 16px; background: #f9fafb; border-radius: 8px; margin: 16px 0;
    }
    .rel-score { font-size: 40px; font-weight: 800; color: #4f46e5; }
    .rel-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #9ca3af; }

    .methodology {
      background: #f9fafb; border-radius: 8px; padding: 16px;
      font-size: 12px; color: #6b7280; line-height: 1.7;
    }

    .footer {
      margin-top: 40px; padding-top: 16px;
      border-top: 1px solid #e5e7eb;
      font-size: 11px; color: #9ca3af;
      display: flex; justify-content: space-between;
    }

    @media print {
      body { padding: 20px 28px; }
      .candidate, .stat-box { break-inside: avoid; }
    }
  </style>
</head>
<body>
`);

  const r = report;
  const a = r.archetype || {};
  const q = r.quant || {};
  const s = r.synthesis || {};
  const relScore = s.reliability_score || 0;
  const relColor = relScore > 0.7 ? '#059669' : relScore > 0.4 ? '#d97706' : '#dc2626';

  printWin.document.write(`
  <div class="cover">
    <div class="label">Reporte de Inteligencia Política Digital</div>
    <h1>${r.territory}</h1>
    <div class="sub">Criterio de masa: <strong>${r.criteria}</strong></div>
    <div class="meta">${new Date(r.timestamp).toLocaleString('es')} &nbsp;·&nbsp; SIGINT Political Intelligence v2.0</div>
  </div>

  <h3>Resumen Ejecutivo</h3>
  <p>${s.executive_summary || 'N/D'}</p>

  ${s.key_finding ? `
  <div class="key-finding">
    <div class="kf-label">Hallazgo Clave</div>
    <p>${s.key_finding}</p>
  </div>` : ''}

  <div class="reliability">
    <div style="color:${relColor}" class="rel-score">${(relScore * 100).toFixed(0)}%</div>
    <div>
      <div class="rel-label">Confiabilidad del análisis</div>
      <div style="font-size:13px;color:#374151;margin-top:4px;">
        ${(s.reliability_factors || []).map(f => `<span class="tag tag-gray">${f}</span>`).join(' ')}
      </div>
    </div>
  </div>

  <h3>1. Arquetipo de Liderazgo Demandado</h3>
  <div class="archetype-name">${a.primary_archetype || 'N/D'}</div>
  <div class="archetype-meta">
    Confianza: <strong>${((a.confidence || 0) * 100).toFixed(0)}%</strong>
    ${a.secondary_archetype ? ` &nbsp;·&nbsp; Secundario: ${a.secondary_archetype}` : ''}
  </div>
  <p style="margin-top:12px;font-size:13px;color:#4b5563;">${a.reasoning || ''}</p>

  <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:16px;">
    <div>
      <div style="font-size:10px;font-weight:700;letter-spacing:1.2px;color:#059669;text-transform:uppercase;margin-bottom:8px;">1.1 Puntos Positivos</div>
      ${(a.positive_demands || []).map(d => `
        <div class="point point-pos">
          ${d.text}
          ${d.signal ? `<div class="point-signal">Señal: ${d.signal}</div>` : ''}
        </div>`).join('')}
    </div>
    <div>
      <div style="font-size:10px;font-weight:700;letter-spacing:1.2px;color:#dc2626;text-transform:uppercase;margin-bottom:8px;">1.2 Puntos Negativos</div>
      ${(a.negative_rejections || []).map(d => `
        <div class="point point-neg">
          ${d.text}
          ${d.signal ? `<div class="point-signal">Señal: ${d.signal}</div>` : ''}
        </div>`).join('')}
    </div>
  </div>

  <h3>2. Candidatos — Concordancia Arquetípica</h3>
  ${(a.candidates || []).map((c, i) => `
    <div class="candidate">
      <div class="candidate-name">${i + 1}. ${c.name}</div>
      <div class="candidate-party">${c.party || ''}</div>
      <div>
        ${(c.adjectives || []).map(adj =>
          adj.match
            ? `<span class="tag tag-green adj-bold">${adj.word}</span>`
            : adj.contra
            ? `<span class="tag tag-red adj-strike">${adj.word}</span>`
            : `<span class="tag tag-gray">${adj.word}</span>`
        ).join(' ')}
        <span style="font-size:11px;color:#9ca3af;margin-left:8px;">Score: ${((c.archetype_match_score || 0) * 100).toFixed(0)}%</span>
      </div>
      ${c.digital_signal ? `<div class="candidate-signal">Señal: ${c.digital_signal}</div>` : ''}
    </div>`).join('')}

  <h3>3. Universo Digital Electoral</h3>
  <div class="stats-grid">
    <div class="stat-box">
      <div class="stat-label">Usuarios digitales</div>
      <div class="stat-value">${((q.universe?.total_digital_users || 0) / 1e6).toFixed(1)}M</div>
    </div>
    <div class="stat-box">
      <div class="stat-label">Políticamente activos</div>
      <div class="stat-value">${((q.universe?.politically_active || 0) / 1e6).toFixed(1)}M</div>
    </div>
    <div class="stat-box">
      <div class="stat-label">Masa "${r.criteria}"</div>
      <div class="stat-value">${((q.criteria_mass?.estimated_size || 0) / 1e6).toFixed(1)}M</div>
      <div style="font-size:11px;color:#9ca3af;">${q.criteria_mass?.confidence_interval || ''}</div>
    </div>
  </div>

  <div style="margin-top:16px;">
    <strong style="font-size:12px;color:#374151;">Bloque A — Con afinidad partidista</strong>
    <table style="width:100%;border-collapse:collapse;margin-top:8px;font-size:12px;">
      <thead>
        <tr style="background:#f3f4f6;">
          <th style="text-align:left;padding:6px 10px;color:#6b7280;">Partido</th>
          <th style="text-align:right;padding:6px 8px;color:#6b7280;">Total</th>
          <th style="text-align:right;padding:6px 8px;color:#6b7280;">Duro</th>
          <th style="text-align:right;padding:6px 8px;color:#6b7280;">Enojado</th>
          <th style="text-align:right;padding:6px 8px;color:#6b7280;">Crítico</th>
          <th style="text-align:right;padding:6px 8px;color:#6b7280;">Oportunista</th>
        </tr>
      </thead>
      <tbody>
        ${(q.partisan_block?.parties || []).map((p, i) => `
          <tr style="background:${i % 2 === 0 ? '#fff' : '#f9fafb'};">
            <td style="padding:6px 10px;">${p.name}</td>
            <td style="text-align:right;padding:6px 8px;font-weight:600;">${(p.total || 0).toLocaleString()}</td>
            <td style="text-align:right;padding:6px 8px;">${(p.duro || 0).toLocaleString()}</td>
            <td style="text-align:right;padding:6px 8px;">${(p.enojado || 0).toLocaleString()}</td>
            <td style="text-align:right;padding:6px 8px;">${(p.critico || 0).toLocaleString()}</td>
            <td style="text-align:right;padding:6px 8px;">${(p.oportunista || 0).toLocaleString()}</td>
          </tr>`).join('')}
      </tbody>
    </table>
  </div>

  <h3>Implicaciones Estratégicas</h3>
  <ul class="impl-list">
    ${(s.strategic_implications || []).map(i => `<li>${i}</li>`).join('')}
  </ul>

  <h3>Riesgos</h3>
  <ul class="risk-list">
    ${(s.risk_factors || []).map(r => `<li>${r}</li>`).join('')}
  </ul>

  <h3>Próximos Pasos</h3>
  <ul class="step-list">
    ${(s.recommended_next_steps || []).map(p => `<li>${p}</li>`).join('')}
  </ul>

  <h3>Nota Metodológica</h3>
  <div class="methodology">${s.methodology_note || ''}</div>

  <div class="footer">
    <span>SIGINT Political Intelligence · ${r.territory} · ${r.criteria}</span>
    <span>${new Date(r.timestamp).toLocaleDateString('es')}</span>
  </div>
</body>
</html>`);

  printWin.document.close();

  // Espera a que cargue la fuente y lanza impresión
  printWin.onload = () => {
    setTimeout(() => {
      printWin.print();
      setTimeout(() => printWin.close(), 1000);
    }, 600);
  };

  // Fallback si onload ya disparó
  setTimeout(() => {
    if (!printWin.closed) {
      printWin.print();
      setTimeout(() => printWin.close(), 1000);
    }
  }, 1500);
}
