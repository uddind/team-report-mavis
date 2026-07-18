import { supabase } from './supabaseClient';
import type { Report } from '../types/Report';

// ===========================================
// Helper: konversi harga teks ("Rp 20.000") <-> angka (numeric di Supabase)
// ===========================================
function parsePriceToNumber(text: string): number | null {
  if (!text) return null;

  const normalized = String(text).trim();
  if (!normalized) return null;

  const sanitized = normalized
    .replace(/[^0-9,.-]/g, '')
    .replace(/,/g, '');

  if (!sanitized || sanitized === '.' || sanitized === '-') return null;

  const parsed = Number(sanitized);
  if (!Number.isFinite(parsed)) return null;

  return Math.round(parsed);
}

function formatNumberToPrice(value: number | null): string {
  if (value === null || value === undefined) return '';
  return 'Rp ' + value.toLocaleString('id-ID');
}

export function normalizeAppointmentDate(value: string | null | undefined): string | null {
  if (!value) return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  const match = trimmed.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/);
  if (!match) return null;

  const [, day, month, year] = match;
  const parsedDay = Number(day);
  const parsedMonth = Number(month);
  const parsedYear = Number(year);

  const date = new Date(parsedYear, parsedMonth - 1, parsedDay);
  if (
    date.getFullYear() !== parsedYear ||
    date.getMonth() !== parsedMonth - 1 ||
    date.getDate() !== parsedDay
  ) {
    return null;
  }

  return `${String(parsedYear).padStart(4, '0')}-${String(parsedMonth).padStart(2, '0')}-${String(parsedDay).padStart(2, '0')}`;
}

// ===========================================
// Helper: konversi Report (bentuk app) <-> baris tabel `reports` (bentuk Supabase)
// ===========================================
interface ReportRow {
  id: string;
  user_id: string;
  school_name: string;
  contact_type: string;
  product_offer: string;
  response: string;
  status: string; // format "OF|Cold"
  previous_vendor: string;
  previous_price: number | null;
  previous_quantity: string;
  previous_specification: string;
  previous_problem: string;
  next_price: number | null;
  next_quantity: string;
  next_specification: string;
  next_expectation: string;
  appointment_date: string | null;
  appointment_time: string | null;
  appointment_note: string;
  other_information: string;
  created_at: string;
  updated_at: string;
  latitude: number | null;
  longitude: number | null;
}

function toRow(report: Report, userId: string): Omit<ReportRow, 'created_at'> & { created_at?: string } {
  return {
    id: report.id,
    user_id: userId,
    school_name: report.schoolName,
    contact_type: report.byChatVisit,
    product_offer: report.productOffer,
    response: report.respon,
    status: `${report.statusCode}|${report.statusTemperature}`,
    previous_vendor: report.previousProject.vendor,
    previous_price: parsePriceToNumber(report.previousProject.harga),
    previous_quantity: report.previousProject.jumlah,
    previous_specification: report.previousProject.spesifikasi,
    previous_problem: report.previousProject.problem,
    next_price: parsePriceToNumber(report.nextProject.harga),
    next_quantity: report.nextProject.jumlah,
    next_specification: report.nextProject.spesifikasi,
    next_expectation: report.nextProject.harapan,
    appointment_date: normalizeAppointmentDate(report.appointment.tanggal),
    appointment_time: report.appointment.jam || null,
    appointment_note: report.appointment.catatan,
    other_information: report.informasiLain,
    // 🔥 MEMASUKKAN LATITUDE & LONGITUDE KE SUPABASE
    latitude: report.latitude,
    longitude: report.longitude,
    updated_at: new Date().toISOString(),
  };
}

function fromRow(row: ReportRow): Report {
  const [statusCode, statusTemperature] = (row.status || 'OF|Cold').split('|');

  return {
    id: row.id,
    schoolName: row.school_name ?? '',
    byChatVisit: row.contact_type ?? '',
    productOffer: row.product_offer ?? '',
    respon: row.response ?? '',
    statusCode: (statusCode as Report['statusCode']) ?? 'OF',
    statusTemperature: (statusTemperature as Report['statusTemperature']) ?? 'Cold',
    // 🔥 MEMASUKKAN LATITUDE & LONGITUDE DARI SUPABASE KE APP
    latitude: row.latitude ?? null,
    longitude: row.longitude ?? null,
    previousProject: {
      vendor: row.previous_vendor ?? '',
      harga: formatNumberToPrice(row.previous_price),
      jumlah: row.previous_quantity ?? '',
      spesifikasi: row.previous_specification ?? '',
      problem: row.previous_problem ?? '',
    },
    nextProject: {
      vendor: '',
      harga: formatNumberToPrice(row.next_price),
      jumlah: row.next_quantity ?? '',
      spesifikasi: row.next_specification ?? '',
      harapan: row.next_expectation ?? '',
    },
    appointment: {
      tanggal: row.appointment_date ?? '',
      jam: row.appointment_time ?? '',
      catatan: row.appointment_note ?? '',
    },
    informasiLain: row.other_information ?? '',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ===========================================
// CRUD Functions
// ===========================================

export async function getAllReports(): Promise<Report[]> {
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('getAllReports error:', error);
    return [];
  }
  return (data as ReportRow[]).map(fromRow);
}

export async function getReportById(id: string): Promise<Report | undefined> {
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    console.error('getReportById error:', error);
    return undefined;
  }
  return fromRow(data as ReportRow);
}

export async function addReport(report: Report): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Belum login');

  const row = toRow(report, user.id);

  const { error } = await supabase.from('reports').insert(row);
  if (error) {
    console.error('addReport error:', error);
    throw error;
  }
}

export async function updateReport(updated: Report): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Belum login');

  const row = toRow(updated, user.id);

  const { error } = await supabase
    .from('reports')
    .update(row)
    .eq('id', updated.id);

  if (error) {
    console.error('updateReport error:', error);
    throw error;
  }
}

export async function deleteReport(id: string): Promise<void> {
  const { error } = await supabase.from('reports').delete().eq('id', id);
  if (error) {
    console.error('deleteReport error:', error);
    throw error;
  }
}