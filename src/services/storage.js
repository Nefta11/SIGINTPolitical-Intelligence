const STORAGE_KEY = 'sigint_reports';
const MAX_REPORTS = 50;

export function saveReport(report) {
  const reports = getReports();
  const entry = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    ...report,
    savedAt: new Date().toISOString(),
  };
  reports.unshift(entry);
  if (reports.length > MAX_REPORTS) reports.length = MAX_REPORTS;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  return entry;
}

export function getReports() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function getReportById(id) {
  return getReports().find(r => r.id === id) || null;
}

export function deleteReport(id) {
  const reports = getReports().filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
}

export function clearAllReports() {
  localStorage.removeItem(STORAGE_KEY);
}
