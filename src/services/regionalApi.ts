import type { Province, Regency, District, Village } from '../types/Regional';

const BASE_URL = '/api/regional/indonesia';
const API_CO_ID_KEY = 'RvgiLtJi94Lda9b3sPuKP7Vg3HBSB1U9OuXUyKn8OxHPqrDwvo';
// ===========================================
// Helper: fetch generik dengan error handling terpusat
// ===========================================
async function fetchRegional<T>(url: string): Promise<T[]> {
  var myHeaders = new Headers();
  myHeaders.append("x-api-co-id", API_CO_ID_KEY);

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
  };

  // fetch("url", requestOptions)
  // .then(response => response.text())
  // .then(result => console.log(result))
  // .catch(error => console.log('error', error));
  
  try {
    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      throw new Error(`Gagal mengambil data wilayah (status ${response.status})`);
    }

    const json = await response.json();
    return json.data ?? [];
  } catch (error) {
    console.error('regionalApi error:', error);
    throw error;
  }
}

// ===========================================
// 1. Ambil semua Provinsi
// ===========================================
export async function getProvinces(): Promise<Province[]> {
  return fetchRegional<Province>(`${BASE_URL}/provinces`);
}

// ===========================================
// 2. Ambil Kabupaten/Kota berdasarkan kode Provinsi
// ===========================================
export async function getRegencies(provinceCode: string): Promise<Regency[]> {
  if (!provinceCode) return [];
  return fetchRegional<Regency>(`${BASE_URL}/${provinceCode}/regencies`);
}

// ===========================================
// 3. Ambil Kecamatan berdasarkan kode Kabupaten/Kota
// ===========================================
export async function getDistricts(regencyCode: string): Promise<District[]> {
  if (!regencyCode) return [];
  return fetchRegional<District>(`${BASE_URL}/districts/${regencyCode}.json`);
}

// ===========================================
// 4. Ambil Kelurahan/Desa berdasarkan kode Kecamatan
// ===========================================
export async function getVillages(districtCode: string): Promise<Village[]> {
  if (!districtCode) return [];
  return fetchRegional<Village>(`${BASE_URL}/villages/${districtCode}.json`);
}