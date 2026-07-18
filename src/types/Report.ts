// ===========================================
// TeamReport Mavis — Data Model
// ===========================================

/** Status pipeline code shown in filters and badges */
export type StatusCode = 'OF' | 'FU1' | 'FU2' | 'C' | 'ND';

/** Temperature/qualification level of the lead */
export type StatusTemperature = 'Cold' | 'Warm' | 'Hot';

/** How the interaction with the school happened */
export type ContactMethod = 'Chat' | 'Visit' | string;

/**
 * 🏫 School / Informasi Sekolah section.
 * Core identity + response info for a report entry.
 */
export interface School {
  schoolName: string;
  byChatVisit: ContactMethod;
  productOffer: string;
  respon: string;
  statusCode: StatusCode;
  statusTemperature: StatusTemperature;
}

/**
 * ⏰ Previous Project section.
 * Details of a prior vendor engagement, including the problem faced.
 */
export interface PreviousProject {
  vendor: string;
  harga: string;
  jumlah: string;
  spesifikasi: string;
  problem: string;
}

/**
 * 💡 Next Project section.
 * Proposed new vendor engagement, including the client's expectation (harapan).
 */
export interface NextProject {
  vendor: string;
  harga: string;
  jumlah: string;
  spesifikasi: string;
  harapan: string;
}

/**
 * 🗓 Appointment section.
 * Scheduled follow-up date, time, and notes.
 */
export interface Appointment {
  tanggal: string;
  jam: string;
  catatan: string;
}

/**
 * Full Report record — combines School, Previous Project, Next Project,
 * Appointment, and free-form "Informasi Lain" notes.
 */
export interface Report extends School {
  id: string;
  
  // 🔥 TAMBAHAN BARU: Koordinat GPS Peta
  latitude: number | null;
  longitude: number | null;

  previousProject: PreviousProject;
  nextProject: NextProject;
  appointment: Appointment;
  informasiLain: string;

  createdAt: string;
  updatedAt: string;
}

/**
 * Helper: extracts the School-shaped object from a full Report.
 */
export function getSchoolFromReport(report: Report): School {
  return {
    schoolName: report.schoolName,
    byChatVisit: report.byChatVisit,
    productOffer: report.productOffer,
    respon: report.respon,
    statusCode: report.statusCode,
    statusTemperature: report.statusTemperature,
  };
}

/**
 * Factory: creates a brand-new empty Report with sensible defaults.
 */
export function createEmptyReport(): Report {
  const now = new Date().toISOString();
  return {
    id: '',
    schoolName: '',
    byChatVisit: '',
    productOffer: '',
    respon: '',
    statusCode: 'OF',
    statusTemperature: 'Cold',
    
    // 🔥 Default koordinat awal kosong saat buat form baru
    latitude: null,
    longitude: null,

    previousProject: {
      vendor: '',
      harga: '',
      jumlah: '',
      spesifikasi: '',
      problem: '',
    },
    nextProject: {
      vendor: '',
      harga: '',
      jumlah: '',
      spesifikasi: '',
      harapan: '',
    },
    appointment: {
      tanggal: '',
      jam: '',
      catatan: '',
    },
    informasiLain: '',
    createdAt: now,
    updatedAt: now,
  };
}