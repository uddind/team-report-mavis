import type { Province, Regency, District, Village } from '../types/Regional';

const BASE_URL = '/api/regional/indonesia';
const API_CO_ID_KEY = 'RvgiLtJi94Lda9b3sPuKP7Vg3HBSB1U9OuXUyKn8OxHPqrDwvo';

interface ApiCoIdResponse<T> {
  is_success: boolean;
  message: string;
  data: T[];
}

async function fetchRegional<T>(url: string): Promise<T[]> {
  const headers = new Headers();
  headers.append('x-api-co-id', API_CO_ID_KEY);

  try {
    const response = await fetch(url, { method: 'GET', headers });

    if (!response.ok) {
      throw new Error(`Gagal mengambil data wilayah (status ${response.status})`);
    }

    const json: ApiCoIdResponse<T> = await response.json();

    if (!json.is_success) {
      throw new Error(json.message || 'Gagal mengambil data wilayah');
    }

    return json.data ?? [];
  } catch (error) {
    console.error('regionalApi error:', error);
    throw error;
  }
}

export async function getProvinces(): Promise<Province[]> {
  return fetchRegional<Province>(`${BASE_URL}/provinces`);
}

export async function getRegencies(provinceCode: string): Promise<Regency[]> {
  if (!provinceCode) return [];
  return fetchRegional<Regency>(`${BASE_URL}/regencies?province_code=${encodeURIComponent(provinceCode)}`);
}

export async function getDistricts(regencyCode: string): Promise<District[]> {
  if (!regencyCode) return [];
  return fetchRegional<District>(`${BASE_URL}/districts?regency_code=${encodeURIComponent(regencyCode)}`);
}

export async function getVillages(districtCode: string): Promise<Village[]> {
  if (!districtCode) return [];
  return fetchRegional<Village>(`${BASE_URL}/villages?district_code=${encodeURIComponent(districtCode)}`);
}