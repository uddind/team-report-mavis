import React, { useEffect, useState, useCallback } from 'react';
import {
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
  IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonItem, IonLabel, IonInput, IonButton, IonGrid, IonText,
  IonButtons, IonBackButton,
  useIonToast,
} from '@ionic/react';
import { useHistory, useLocation } from 'react-router-dom';
import { useRegional } from '../hooks/useRegional';
import ProvinceSelect from '../components/regional/ProvinceSelect';
import RegencySelect from '../components/regional/RegencySelect';
import DistrictSelect from '../components/regional/DistrictSelect';
import VillageSelect from '../components/regional/Villageselect';
import { supabase } from '../services/supabaseClient';

interface NavigationState {
  returnTo?: string;
}

const TambahSekolah: React.FC = () => {
  const [presentToast] = useIonToast();
  const [schoolName, setSchoolName] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const history = useHistory();
  const location = useLocation<NavigationState>();
  const returnTo = location.state?.returnTo;

  const regional = useRegional();

  // Muat daftar provinsi sekali saat halaman pertama kali dibuka
  useEffect(() => {
    void regional.loadProvinces();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Tampilkan error dari hook (kalau ada) lewat toast, tanpa bikin app crash
  useEffect(() => {
    if (regional.error) {
      presentToast({
        message: regional.error,
        duration: 2500,
        color: 'danger',
        position: 'top',
      });
    }
  }, [regional.error, presentToast]);

  const handleSimpan = useCallback(async (): Promise<void> => {
    if (!schoolName.trim()) {
      presentToast({
        message: 'Nama Sekolah wajib diisi',
        duration: 2000,
        color: 'warning',
        position: 'top',
      });
      return;
    }

    if (!regional.selectedProvince) {
      presentToast({
        message: 'Provinsi wajib dipilih',
        duration: 2000,
        color: 'warning',
        position: 'top',
      });
      return;
    }

    if (!regional.selectedRegency) {
      presentToast({
        message: 'Kota/Kabupaten wajib dipilih',
        duration: 2000,
        color: 'warning',
        position: 'top',
      });
      return;
    }

    // Kecamatan & Kelurahan opsional -> boleh null
    const payload = {
      nama_sekolah: schoolName.trim(),
      province_code: regional.selectedProvince.code,
      province_name: regional.selectedProvince.name,
      city_code: regional.selectedRegency.code,
      city_name: regional.selectedRegency.name,
      district_code: regional.selectedDistrict?.code ?? null,
      district_name: regional.selectedDistrict?.name ?? null,
      village_code: regional.selectedVillage?.code ?? null,
      village_name: regional.selectedVillage?.name ?? null,
    };

    // Simpan dulu sebelum di-reset, karena reset akan mengosongkan schoolName
    const savedSchoolName = schoolName.trim();

    setIsSaving(true);
    try {
      const { error } = await supabase.from('sekolah').insert(payload);

      if (error) {
        throw error;
      }

      presentToast({
        message: 'Sekolah berhasil disimpan!',
        duration: 2500,
        color: 'success',
        position: 'top',
      });

      if (returnTo) {
        // Datang dari halaman lain (misal Tambah Report) -> kembali ke sana
        // sambil bawa nama sekolah yang baru dibuat.
        history.push(returnTo, { newSchoolName: savedSchoolName });
      } else {
        // Entry point normal (menu Tambah Sekolah sendiri) -> reset form
        setSchoolName('');
        regional.clearAll();
        void regional.loadProvinces();
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Gagal menyimpan data sekolah';
      presentToast({
        message,
        duration: 3000,
        color: 'danger',
        position: 'top',
      });
    } finally {
      setIsSaving(false);
    }
  }, [
    schoolName,
    regional.selectedProvince,
    regional.selectedRegency,
    regional.selectedDistrict,
    regional.selectedVillage,
    regional.clearAll,
    regional.loadProvinces,
    presentToast,
    returnTo,
    history,
  ]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          {returnTo && (
            <IonButtons slot="start">
              <IonBackButton defaultHref={returnTo} text="" />
            </IonButtons>
          )}
          <IonTitle>Tambah Sekolah</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent style={{ '--background': '#f4f5f8' }}>
        <IonGrid fixed style={{ padding: '16px' }}>

          <IonCard style={{ margin: '0 0 16px 0', borderRadius: '12px', boxShadow: 'none', border: '0.5px solid var(--ion-color-light-shade)' }}>

            {/* Header card */}
            <IonCardHeader style={{ background: 'var(--ion-color-light)', padding: '10px 16px', borderBottom: '0.5px solid var(--ion-color-light-shade)' }}>
              <IonCardTitle style={{ fontSize: '14px', fontWeight: '500', color: 'var(--ion-color-dark)' }}>
                Data sekolah
              </IonCardTitle>
            </IonCardHeader>

            <IonCardContent className="ion-no-padding">

              {/* Nama Sekolah */}
              <IonItem lines="full" style={{ '--padding-top': '10px', '--padding-bottom': '10px' }}>
                <IonLabel position="stacked" style={{ fontSize: '12px', fontWeight: '500', color: 'var(--ion-color-medium)', marginBottom: '6px' }}>
                  Nama sekolah <IonText color="danger" style={{ fontSize: '11px' }}>*</IonText>
                </IonLabel>
                <IonInput
                  placeholder="Masukkan nama sekolah..."
                  value={schoolName}
                  onIonInput={(e) => setSchoolName(e.detail.value ?? '')}
                  style={{ fontSize: '14px' }}
                />
              </IonItem>

              {/* Provinsi */}
              <div>
                <ProvinceSelect
                  data={regional.provinces}
                  value={regional.selectedProvince?.code ?? ''}
                  onChange={regional.selectProvince}
                  loading={regional.loadingProvinces}
                />
                {regional.selectedProvince && regional.regencies.length > 0 && (
                  <div style={{ padding: '4px 16px 6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#63991a', flexShrink: 0 }} />
                    <span style={{ fontSize: '11px', color: '#3b6d11' }}>
                      {regional.regencies.length} kota/kabupaten tersedia
                    </span>
                  </div>
                )}
              </div>

              {/* Kota/Kabupaten */}
              <div style={{ opacity: !regional.selectedProvince ? 0.45 : 1, transition: 'opacity 0.2s' }}>
                <RegencySelect
                  data={regional.regencies}
                  value={regional.selectedRegency?.code ?? ''}
                  onChange={regional.selectRegency}
                  loading={regional.loadingRegencies}
                  disabled={!regional.selectedProvince}
                />
              </div>

              {/* Kecamatan */}
              <div style={{ opacity: !regional.selectedRegency ? 0.45 : 1, transition: 'opacity 0.2s' }}>
                <DistrictSelect
                  data={regional.districts}
                  value={regional.selectedDistrict?.code ?? ''}
                  onChange={regional.selectDistrict}
                  loading={regional.loadingDistricts}
                  disabled={!regional.selectedRegency}
                />
              </div>

              {/* Kelurahan */}
              <div style={{ opacity: !regional.selectedDistrict ? 0.45 : 1, transition: 'opacity 0.2s' }}>
                <VillageSelect
                  data={regional.villages}
                  value={regional.selectedVillage?.code ?? ''}
                  onChange={regional.selectVillage}
                  loading={regional.loadingVillages}
                  disabled={!regional.selectedDistrict}
                />
              </div>

            </IonCardContent>
          </IonCard>

          <IonButton
            expand="block"
            shape="round"
            color="primary"
            onClick={handleSimpan}
            disabled={isSaving}
            style={{ height: '48px', fontWeight: '500', fontSize: '15px', marginTop: '8px' }}
          >
            {isSaving ? 'Menyimpan...' : 'Simpan sekolah'}
          </IonButton>

        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default TambahSekolah;