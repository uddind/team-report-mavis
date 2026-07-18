import type { StatusCode, StatusTemperature } from '../types/Report';

export interface TambahReportFormData {
  schoolName: string;
  newSchoolCity: string;
  newSchoolLat: number | null;
  newSchoolLng: number | null;
  interactionType: string;
  productOffer: string;
  responSekolah: string;
  statusProspek: string;
  prevVendor: string;
  prevSpec: string;
  prevHarga: string;
  prevJumlah: string;
  prevProblem: string;
  nextSpec: string;
  nextHarga: string;
  nextJumlah: string;
  nextSpecDetail: string;
  harapan: string;
  appointment: string;
  infoLain: string;
}

function normalizeStatus(statusProspek: string): {
  statusCode: StatusCode;
  statusTemperature: StatusTemperature;
} {
  const normalized = statusProspek?.trim() || '';

  if (normalized === 'FU 1') return { statusCode: 'FU1', statusTemperature: 'Cold' };
  if (normalized === 'FU 2') return { statusCode: 'FU2', statusTemperature: 'Cold' };
  if (normalized === 'C') return { statusCode: 'C', statusTemperature: 'Cold' };
  if (normalized === 'ND') return { statusCode: 'ND', statusTemperature: 'Cold' };
  if (normalized === 'Warm') return { statusCode: 'OF', statusTemperature: 'Warm' };
  if (normalized === 'Hot') return { statusCode: 'OF', statusTemperature: 'Hot' };
  if (normalized === 'Cold') return { statusCode: 'OF', statusTemperature: 'Cold' };

  return {
    statusCode: normalized === 'OF' ? 'OF' : 'OF',
    statusTemperature: 'Cold',
  };
}

export function parseToDatabaseDate(dateStr: string | null | undefined): string | null {
  if (!dateStr || typeof dateStr !== 'string') return null;

  const trimmed = dateStr.trim();
  if (!trimmed || trimmed === '') return null;

  // Regex untuk mendeteksi format DD/MM/YYYY atau DD-MM-YYYY
  const match = trimmed.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/);
  
  // Jika yang diketik bukan format tanggal (misal: "acsdsc"), langsung kembalikan null agar aman di database
  if (!match) return null;

  const [, day, month, year] = match;
  const formattedDay = day.padStart(2, '0');
  const formattedMonth = month.padStart(2, '0');

  // Mengembalikan format YYYY-MM-DD yang diterima PostgreSQL
  return `${year}-${formattedMonth}-${formattedDay}`;
}

export function buildReportFromForm(formData: TambahReportFormData, id = crypto.randomUUID()): any {
  const status = normalizeStatus(formData.statusProspek);
  const now = new Date().toISOString();
  const validDbDate = parseToDatabaseDate(formData.appointment);

  return {
    id,
    
    // 1. DATA STRUKTUR UTK DB SUPABASE (Sesuai Gambar Skema Baru Kamu)
    school_name: formData.schoolName.trim(),
    contact_person: '', // Menampung kolom contact_person di DB
    contact_type: formData.interactionType,
    product_offer: formData.productOffer,
    response: formData.responSekolah,
    status: status.statusCode,
    category: '', // Menampung kolom category di DB
    previous_vendor: formData.prevVendor,
    previous_specification: formData.prevSpec,
    previous_price: formData.prevHarga ? parseFloat(formData.prevHarga) : null,
    previous_quantity: formData.prevJumlah,
    previous_problem: formData.prevProblem,
    next_specification: formData.nextSpecDetail ? `${formData.nextSpec}\nDetail: ${formData.nextSpecDetail}` : formData.nextSpec,
    next_price: formData.nextHarga ? parseFloat(formData.nextHarga) : null,
    next_quantity: formData.nextJumlah,
    next_expectation: formData.harapan,
    appointment_date: validDbDate, // Nilai murni YYYY-MM-DD atau null jika teks "acsdsc"
    appointment_time: null,
    appointment_note: '',
    other_information: formData.infoLain,

    // 2. STRUKTUR DATA LAMA (Dipertahankan Penuh Tanpa Hapus)
    schoolName: formData.schoolName.trim(),
    byChatVisit: formData.interactionType,
    productOffer: formData.productOffer,
    respon: formData.responSekolah,
    statusCode: status.statusCode,
    statusTemperature: status.statusTemperature,
    previousProject: {
      vendor: formData.prevVendor,
      harga: formData.prevHarga,
      jumlah: formData.prevJumlah,
      spesifikasi: formData.prevSpec,
      problem: formData.prevProblem,
    },
    nextProject: {
      vendor: '',
      harga: formData.nextHarga,
      jumlah: formData.nextJumlah,
      spesifikasi: formData.nextSpec,
      harapan: formData.harapan,
    },
    appointment: {
      tanggal: formData.appointment,
      jam: '',
      catatan: '',
    },
    informasiLain: formData.infoLain,
    createdAt: now,
    updatedAt: now,
  };
}