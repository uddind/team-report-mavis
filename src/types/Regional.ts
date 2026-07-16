// ===========================================
// Tipe data untuk API Wilayah Indonesia
// (Provinsi → Kabupaten/Kota → Kecamatan → Kelurahan/Desa)
// ===========================================

export interface Province {
  code: string;
  name: string;
}

export interface Regency {
  code: string;
  name: string;
}

export interface District {
  code: string;
  name: string;
}

export interface Village {
  code: string;
  name: string;
}