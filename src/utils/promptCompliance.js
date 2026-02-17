// Validaciones específicas del prompt de inteligencia política digital
export function validatePromptCompliance(report) {
  const issues = [];

  // Validar existencia de Juan Carlos Pinzón como primer candidato
  if (report?.archetype?.candidates?.length > 0) {
    const firstCandidate = report.archetype.candidates[0];
    if (!firstCandidate?.name?.toLowerCase().includes('juan carlos pinzón')) {
      issues.push({
        type: 'candidate_order',
        message: 'Juan Carlos Pinzón debe ser analizado como primer candidato según especificación del prompt',
        severity: 'high'
      });
    }
  }

  // Validar límites de caracteres en puntos positivos (máx 180 chars)
  if (report?.archetype?.positive_demands) {
    report.archetype.positive_demands.forEach((point, i) => {
      if (point.text && point.text.length > 180) {
        issues.push({
          type: 'character_limit',
          message: `Punto positivo ${i+1} excede 180 caracteres (${point.text.length})`,
          severity: 'medium'
        });
      }
    });
  }

  // Validar límites de caracteres en puntos negativos (máx 140 chars)
  if (report?.archetype?.negative_rejections) {
    report.archetype.negative_rejections.forEach((point, i) => {
      if (point.text && point.text.length > 140) {
        issues.push({
          type: 'character_limit',
          message: `Punto negativo ${i+1} excede 140 caracteres (${point.text.length})`,
          severity: 'medium'
        });
      }
    });
  }

  // Validar que hay exactamente 4 candidatos (3 orgánicos + Juan Carlos Pinzón)
  if (report?.archetype?.candidates?.length !== 4) {
    issues.push({
      type: 'candidate_count',
      message: `Debe haber exactamente 4 candidatos (encontrados: ${report?.archetype?.candidates?.length || 0})`,
      severity: 'medium'
    });
  }

  // Validar que cada candidato tiene exactamente 4 adjetivos
  if (report?.archetype?.candidates) {
    report.archetype.candidates.forEach((candidate, i) => {
      if (!candidate.adjectives || candidate.adjectives.length !== 4) {
        issues.push({
          type: 'adjective_count',
          message: `${candidate.name || `Candidato ${i+1}`} debe tener exactamente 4 adjetivos`,
          severity: 'medium'
        });
      }
    });
  }

  // Validar presencia de bloques A y B en universo digital
  if (report?.quant) {
    if (!report.quant.partisan_block || !report.quant.partisan_block.parties?.length) {
      issues.push({
        type: 'missing_block',
        message: 'Falta Bloque A (con afinidad partidista) en universo digital',
        severity: 'high'
      });
    }

    if (!report.quant.non_partisan_block || !report.quant.non_partisan_block.segments?.length) {
      issues.push({
        type: 'missing_block',
        message: 'Falta Bloque B (sin opinión política identificable) en universo digital',
        severity: 'high'
      });
    }
  }

  // Validar categorías conductuales en partidos
  if (report?.quant?.partisan_block?.parties) {
    const requiredCategories = ['duro', 'enojado', 'critico', 'oportunista'];
    report.quant.partisan_block.parties.forEach(party => {
      requiredCategories.forEach(category => {
        if (typeof party[category] !== 'number') {
          issues.push({
            type: 'missing_category',
            message: `Partido ${party.name} carece de categoría "${category}"`,
            severity: 'medium'
          });
        }
      });
    });
  }

  return {
    isCompliant: issues.length === 0,
    issues,
    complianceScore: Math.max(0, 1 - (issues.length * 0.1))
  };
}

// Función para mostrar issues de cumplimiento del prompt
export function formatComplianceIssues(validation) {
  if (validation.isCompliant) {
    return "✅ Sistema cumple 100% con especificaciones del prompt";
  }

  const highIssues = validation.issues.filter(i => i.severity === 'high');
  const mediumIssues = validation.issues.filter(i => i.severity === 'medium');

  let output = `⚠️ Cumplimiento: ${(validation.complianceScore * 100).toFixed(1)}%\n\n`;

  if (highIssues.length > 0) {
    output += "🔴 **Problemas críticos:**\n";
    highIssues.forEach(issue => output += `- ${issue.message}\n`);
    output += "\n";
  }

  if (mediumIssues.length > 0) {
    output += "🟡 **Mejoras recomendadas:**\n";
    mediumIssues.forEach(issue => output += `- ${issue.message}\n`);
  }

  return output;
}
