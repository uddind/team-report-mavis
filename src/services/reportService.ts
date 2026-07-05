import { Preferences } from '@capacitor/preferences';
import type { Report } from '../types/Report';

/**
 * Storage key under which the full reports array is stored.
 * Kept as a single JSON array (not one key per report) since
 * report counts are expected to stay small/medium — simpler
 * reads/writes, no need for per-item key management.
 */
const REPORTS_STORAGE_KEY = 'teamreport_mavis_reports';

/**
 * Reads and parses the full reports array from storage.
 * Returns an empty array if nothing has been saved yet,
 * or if stored data is corrupted/unreadable.
 */
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

/**
 * Writes the full reports array back to storage as JSON.
 */
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

/**
 * Returns all reports currently stored.
 * Used by: Beranda, Laporan.
 */
export async function getAllReports(): Promise<Report[]> {
  return readAllReports();
}

/**
 * Returns a single report by id, or undefined if not found.
 * Used by: DetailReport, EditReport.
 */
export async function getReportById(id: string): Promise<Report | undefined> {
  const reports = await readAllReports();
  return reports.find((r) => r.id === id);
}

/**
 * Adds a new report to storage.
 * Used by: TambahReport.
 */
export async function addReport(report: Report): Promise<void> {
  const reports = await readAllReports();
  reports.push(report);
  await writeAllReports(reports);
}

/**
 * Updates an existing report (matched by id) in storage.
 * If no report with that id exists, it is added instead,
 * so this function is safe to call even if the id is new.
 * Used by: EditReport.
 */
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

/**
 * Deletes a report by id from storage.
 * Used by: Laporan (delete button).
 */
export async function deleteReport(id: string): Promise<void> {
  const reports = await readAllReports();
  const filtered = reports.filter((r) => r.id !== id);
  await writeAllReports(filtered);
}

/**
 * Clears ALL reports from storage.
 * Not currently wired to any UI button — available for
 * future use (e.g. a "Reset Data" option in a settings page).
 */
export async function clearAllReports(): Promise<void> {
  await Preferences.remove({ key: REPORTS_STORAGE_KEY });
}