import { useState, useCallback, useRef } from 'react';
import type { Province, Regency, District, Village } from '../types/Regional';
import {
  getProvinces,
  getRegencies,
  getDistricts,
  getVillages,
} from '../services/regionalApi';

interface UseRegionalReturn {
  // Data
  provinces: Province[];
  regencies: Regency[];
  districts: District[];
  villages: Village[];

  // Loading per level (tidak digabung jadi satu loading global)
  loadingProvinces: boolean;
  loadingRegencies: boolean;
  loadingDistricts: boolean;
  loadingVillages: boolean;

  // Error
  error: string | null;

  // Selected value per level
  selectedProvince: Province | null;
  selectedRegency: Regency | null;
  selectedDistrict: District | null;
  selectedVillage: Village | null;

  // Loaders (murni fetch + simpan ke state, tidak melakukan reset/cascade)
  loadProvinces: () => Promise<void>;
  loadRegencies: (provinceCode: string) => Promise<void>;
  loadDistricts: (regencyCode: string) => Promise<void>;
  loadVillages: (districtCode: string) => Promise<void>;

  // Selectors (menyimpan pilihan + cascade reset + trigger load level berikutnya)
  selectProvince: (province: Province) => void;
  selectRegency: (regency: Regency) => void;
  selectDistrict: (district: District) => void;
  selectVillage: (village: Village) => void;

  // Reset per level
  resetRegencies: () => void;
  resetDistricts: () => void;
  resetVillages: () => void;

  // Reset semua
  clearAll: () => void;
}

/**
 * Custom hook untuk mengelola seluruh state data wilayah Indonesia
 * (Provinsi -> Kabupaten/Kota -> Kecamatan -> Kelurahan/Desa) yang
 * bersumber dari service `regionalApi`.
 *
 * Hook ini TIDAK melakukan request API secara langsung. Semua fetch
 * didelegasikan ke fungsi yang sudah ada di `src/services/regionalApi.ts`.
 */
export function useRegional(): UseRegionalReturn {
  // ===== Data state =====
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [regencies, setRegencies] = useState<Regency[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [villages, setVillages] = useState<Village[]>([]);

  // ===== Loading state (terpisah per dropdown) =====
  const [loadingProvinces, setLoadingProvinces] = useState<boolean>(false);
  const [loadingRegencies, setLoadingRegencies] = useState<boolean>(false);
  const [loadingDistricts, setLoadingDistricts] = useState<boolean>(false);
  const [loadingVillages, setLoadingVillages] = useState<boolean>(false);

  // ===== Error state =====
  const [error, setError] = useState<string | null>(null);

  // Menandai request ke-berapa yang sedang berjalan PER LEVEL, supaya
  // respons yang telat datang dari pilihan lama (misal user klik Provinsi A
  // lalu buru-buru klik Provinsi B) tidak menimpa data yang sudah lebih baru.
  const regencyRequestIdRef = useRef(0);
  const districtRequestIdRef = useRef(0);
  const villageRequestIdRef = useRef(0);

  // ===== Selected value state =====
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null);
  const [selectedRegency, setSelectedRegency] = useState<Regency | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
  const [selectedVillage, setSelectedVillage] = useState<Village | null>(null);

  // Helper kecil supaya pesan error konsisten & tidak mengulang boilerplate
  const resolveErrorMessage = (err: unknown, fallback: string): string => {
    if (err instanceof Error) return err.message;
    return fallback;
  };

  // ===========================================
  // Loaders — hanya fetch + simpan ke state
  // ===========================================
  const loadProvinces = useCallback(async (): Promise<void> => {
    setLoadingProvinces(true);
    setError(null);
    try {
      const data = await getProvinces();
      setProvinces(data);
    } catch (err) {
      setError(resolveErrorMessage(err, 'Gagal memuat data provinsi'));
    } finally {
      setLoadingProvinces(false);
    }
  }, []);

  const loadRegencies = useCallback(async (provinceCode: string): Promise<void> => {
    const currentRequestId = ++regencyRequestIdRef.current;
    setLoadingRegencies(true);
    setError(null);
    try {
      const data = await getRegencies(provinceCode);
      if (currentRequestId !== regencyRequestIdRef.current) return; // respons basi, abaikan
      setRegencies(data);
    } catch (err) {
      if (currentRequestId !== regencyRequestIdRef.current) return;
      setError(resolveErrorMessage(err, 'Gagal memuat data kabupaten/kota'));
    } finally {
      if (currentRequestId === regencyRequestIdRef.current) {
        setLoadingRegencies(false);
      }
    }
  }, []);

  const loadDistricts = useCallback(async (regencyCode: string): Promise<void> => {
    const currentRequestId = ++districtRequestIdRef.current;
    setLoadingDistricts(true);
    setError(null);
    try {
      const data = await getDistricts(regencyCode);
      if (currentRequestId !== districtRequestIdRef.current) return;
      setDistricts(data);
    } catch (err) {
      if (currentRequestId !== districtRequestIdRef.current) return;
      setError(resolveErrorMessage(err, 'Gagal memuat data kecamatan'));
    } finally {
      if (currentRequestId === districtRequestIdRef.current) {
        setLoadingDistricts(false);
      }
    }
  }, []);

  const loadVillages = useCallback(async (districtCode: string): Promise<void> => {
    const currentRequestId = ++villageRequestIdRef.current;
    setLoadingVillages(true);
    setError(null);
    try {
      const data = await getVillages(districtCode);
      if (currentRequestId !== villageRequestIdRef.current) return;
      setVillages(data);
    } catch (err) {
      if (currentRequestId !== villageRequestIdRef.current) return;
      setError(resolveErrorMessage(err, 'Gagal memuat data kelurahan/desa'));
    } finally {
      if (currentRequestId === villageRequestIdRef.current) {
        setLoadingVillages(false);
      }
    }
  }, []);

  // ===========================================
  // Reset per level
  // ===========================================
  const resetRegencies = useCallback((): void => {
    setRegencies([]);
    setSelectedRegency(null);
  }, []);

  const resetDistricts = useCallback((): void => {
    setDistricts([]);
    setSelectedDistrict(null);
  }, []);

  const resetVillages = useCallback((): void => {
    setVillages([]);
    setSelectedVillage(null);
  }, []);

  const clearAll = useCallback((): void => {
    setProvinces([]);
    setRegencies([]);
    setDistricts([]);
    setVillages([]);
    setSelectedProvince(null);
    setSelectedRegency(null);
    setSelectedDistrict(null);
    setSelectedVillage(null);
    setError(null);
  }, []);

  // ===========================================
  // Selectors — simpan pilihan + cascade reset + load level berikutnya
  // ===========================================
  const selectProvince = useCallback((province: Province): void => {
    setSelectedProvince(province);

    // Reset seluruh level di bawahnya (Kota, Kecamatan, Kelurahan)
    resetRegencies();
    resetDistricts();
    resetVillages();

    // Muat ulang Kota untuk provinsi yang baru dipilih
    void loadRegencies(province.code);
  }, [resetRegencies, resetDistricts, resetVillages, loadRegencies]);

  const selectRegency = useCallback((regency: Regency): void => {
    setSelectedRegency(regency);

    // Reset Kecamatan & Kelurahan
    resetDistricts();
    resetVillages();

    // Muat ulang Kecamatan untuk kabupaten/kota yang baru dipilih
    void loadDistricts(regency.code);
  }, [resetDistricts, resetVillages, loadDistricts]);

  const selectDistrict = useCallback((district: District): void => {
    setSelectedDistrict(district);

    // Reset Kelurahan
    resetVillages();

    // Muat ulang Kelurahan untuk kecamatan yang baru dipilih
    void loadVillages(district.code);
  }, [resetVillages, loadVillages]);

  const selectVillage = useCallback((village: Village): void => {
    setSelectedVillage(village);
  }, []);

  return {
    // Data
    provinces,
    regencies,
    districts,
    villages,

    // Loading
    loadingProvinces,
    loadingRegencies,
    loadingDistricts,
    loadingVillages,

    // Error
    error,

    // Selected
    selectedProvince,
    selectedRegency,
    selectedDistrict,
    selectedVillage,

    // Loaders
    loadProvinces,
    loadRegencies,
    loadDistricts,
    loadVillages,

    // Selectors
    selectProvince,
    selectRegency,
    selectDistrict,
    selectVillage,

    // Reset
    resetRegencies,
    resetDistricts,
    resetVillages,
    clearAll,
  };
}