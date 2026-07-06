import { Preferences } from '@capacitor/preferences';
import type { Report } from '../types/Report';

const REPORTS_STORAGE_KEY = 'teamreport_mavis_reports';

async function readAllReports(): Promise<Report[]> {
  try {
    const result = await Preferences.get({ key: REPORTS_STORAGE_KEY });
    if (!result.value) return [];
    const parsed = JSON.parse(result.value);
    return Array.isArray(parsed) ? (parsed as Report[]) : [];
  } catch (error) {
    console.error('reportService: failed to read reports from storage', error);
    return [];
  }
}

async function writeAllReports(reports: Report[]): Promise<void> {
  try {
    await Preferences.set({
      key: REPORTS_STORAGE_KEY,
      value: JSON.stringify(reports),
    });
  } catch (error) {
    console.error('reportService: failed to write reports to storage', error);
    throw error;
  }
}

export async function getAllReports(): Promise<Report[]> {
  return readAllReports();
}

export async function getReportById(id: string): Promise<Report | undefined> {
  const reports = await readAllReports();
  return reports.find((r) => r.id === id);
}

export async function addReport(report: Report): Promise<void> {
  const reports = await readAllReports();
  reports.push(report);
  await writeAllReports(reports);
}

export async function updateReport(updated: Report): Promise<void> {
  const reports = await readAllReports();
  const index = reports.findIndex((r) => r.id === updated.id);

  if (index === -1) {
    reports.push(updated);
  } else {
    reports[index] = updated;
  }

  await writeAllReports(reports);
}

export async function deleteReport(id: string): Promise<void> {
  const reports = await readAllReports();
  const filtered = reports.filter((r) => r.id !== id);
  await writeAllReports(filtered);
}

export async function clearAllReports(): Promise<void> {
  await Preferences.remove({ key: REPORTS_STORAGE_KEY });
}