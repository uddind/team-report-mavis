import React, { useState, useCallback } from 'react';
import {
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
  IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonItem, IonLabel, IonInput, IonTextarea, IonSelect, IonSelectOption,
  IonButton, IonGrid, IonText, IonRow, IonCol, useIonToast, IonSpinner,
  useIonViewWillEnter, IonIcon
} from '@ionic/react';
import { addOutline } from 'ionicons/icons';
import { useHistory, useLocation } from 'react-router-dom';
import SchoolAutocomplete from '../components/SchoolAutocomplete';
import { geocodeAddress } from '../utils/geocode';

// Route path halaman ini sendiri & halaman Tambah Sekolah.
// SESUAIKAN string ini kalau path routing di App.tsx kamu berbeda.
const ROUTE_TAMBAH_REPORT = '/tambah-report';
const ROUTE_TAMBAH_SEKOLAH = '/tambah-sekolah';

interface NavigationState {
  newSchoolName?: string;
  returnTo?: string;
}

// Struktur Data Form Terpadu
interface FormData {
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
  harapan: string;
  appointment: string;
  infoLain: string;
}

type FieldChangeHandler = (key: keyof FormData, value: any) => void;

/* =====================================================================
   CARD 1: INFORMASI KUNJUNGAN UTAMA
   Dipisah + di-memo supaya ketikan di card lain tidak memicu re-render
   di sini (khususnya penting karena ada SchoolAutocomplete + geocoding).
===================================================================== */
interface MainVisitCardProps {
  schoolName: string;
  newSchoolLat: number | null;
  newSchoolLng: number | null;
  interactionType: string;
  productOffer: string;
  responSekolah: string;
  statusProspek: string;
  isGeocoding: boolean;
  onChange: FieldChangeHandler;
  onAutoLocate: () => void;
  onAddNewSchool: () => void;
}

const MainVisitCard = React.memo<MainVisitCardProps>(({
  schoolName, newSchoolLat, newSchoolLng, interactionType, productOffer,
  responSekolah, statusProspek, isGeocoding, onChange, onAutoLocate, onAddNewSchool
}) => {
  return (
    <IonCard style={{ margin: '0 0 16px 0', borderRadius: '12px' }}>
      <IonCardHeader color="light">
        <IonCardTitle style={{ fontSize: '15px', fontWeight: 'bold' }}>Form Kunjungan Utama</IonCardTitle>
      </IonCardHeader>
      <IonCardContent className="ion-no-padding">

        <IonItem lines="full" style={{ '--padding-top': '8px', '--padding-bottom': '8px' }}>
          <IonLabel position="stacked" style={{ fontWeight: '600', marginBottom: '8px', color: '#333' }}>
            NAMA SEKOLAH <IonText color="danger">*</IonText>
          </IonLabel>
          <SchoolAutocomplete
            value={schoolName}
            onChange={(val: string) => onChange('schoolName', val)}
          />
          <IonButton
            slot="end"
            fill="clear"
            onClick={onAddNewSchool}
            title="Tambah sekolah baru"
            style={{ margin: 0 }}
          >
            <IonIcon icon={addOutline} slot="icon-only" />
          </IonButton>
        </IonItem>

        <div className="modal-map-label-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px 0 16px' }}>
          <span className="modal-map-label" style={{ fontWeight: '600', fontSize: '14px', color: '#333' }}>📍 Lokasi Peta</span>
          <IonButton
            fill="clear"
            size="small"
            onClick={onAutoLocate}
            disabled={isGeocoding}
            style={{ margin: 0, height: '24px', fontSize: '13px' }}
          >
            {isGeocoding ? 'Mencari...' : 'Cari Otomatis'}
          </IonButton>
        </div>

        <div style={{ padding: '4px 16px 8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isGeocoding && <IonSpinner name="crescent" style={{ transform: 'scale(0.7)', width: '20px', height: '20px' }} />}
          {newSchoolLat && newSchoolLng ? (
            <span style={{ fontSize: '12px', color: '#2dd36f' }}>
              Koordinat Terkunci: {newSchoolLat.toFixed(5)}, {newSchoolLng.toFixed(5)}
            </span>
          ) : (
            !isGeocoding && <span style={{ fontSize: '12px', color: '#888' }}>Lokasi koordinat belum diset.</span>
          )}
        </div>

        <IonItem lines="full">
          <IonLabel position="stacked" style={{ fontWeight: '600', marginBottom: '4px' }}>Metode Interaksi (Chat / Visit)</IonLabel>
          <IonSelect placeholder="Pilih Chat / Visit" value={interactionType} onIonChange={e => onChange('interactionType', e.detail.value)}>
            <IonSelectOption value="Chat">Chat</IonSelectOption>
            <IonSelectOption value="Visit">Visit</IonSelectOption>
          </IonSelect>
        </IonItem>

        <IonItem lines="full">
          <IonLabel position="stacked" style={{ fontWeight: '600', marginBottom: '4px' }}>Product Offer</IonLabel>
          <IonInput placeholder="Masukkan penawaran produk..." value={productOffer} onIonChange={e => onChange('productOffer', e.detail.value ?? '')} />
        </IonItem>

        <IonItem lines="full">
          <IonLabel position="stacked" style={{ fontWeight: '600', marginBottom: '4px' }}>Respon</IonLabel>
          <IonTextarea placeholder="Masukkan respon pihak sekolah..." value={responSekolah} onIonChange={e => onChange('responSekolah', e.detail.value ?? '')} rows={2} />
        </IonItem>

        <IonItem lines="none" style={{ '--padding-bottom': '8px' }}>
          <IonLabel position="stacked" style={{ fontWeight: '600', marginBottom: '4px' }}>Status</IonLabel>
          <IonSelect placeholder="Pilih Status Prospek" value={statusProspek} onIonChange={e => onChange('statusProspek', e.detail.value)}>
            <IonSelectOption value="OF">OF</IonSelectOption>
            <IonSelectOption value="FU 1">FU 1</IonSelectOption>
            <IonSelectOption value="FU 2">FU 2</IonSelectOption>
            <IonSelectOption value="C">C</IonSelectOption>
            <IonSelectOption value="ND">ND</IonSelectOption>
            <IonSelectOption value="Cold">Cold</IonSelectOption>
            <IonSelectOption value="Warm">Warm</IonSelectOption>
            <IonSelectOption value="Hot">Hot</IonSelectOption>
          </IonSelect>
        </IonItem>
      </IonCardContent>
    </IonCard>
  );
});
MainVisitCard.displayName = 'MainVisitCard';

/* =====================================================================
   CARD 2: PREVIOUS PROJECT
===================================================================== */
interface PreviousProjectCardProps {
  prevVendor: string;
  prevSpec: string;
  prevHarga: string;
  prevJumlah: string;
  prevProblem: string;
  onChange: FieldChangeHandler;
}

const PreviousProjectCard = React.memo<PreviousProjectCardProps>(({
  prevVendor, prevSpec, prevHarga, prevJumlah, prevProblem, onChange
}) => {
  return (
    <IonCard style={{ margin: '0 0 16px 0', borderRadius: '12px' }}>
      <IonCardHeader style={{ background: '#fff7e6', color: '#d46b08' }}>
        <IonCardTitle style={{ fontSize: '15px', fontWeight: 'bold' }}>Previous Project</IonCardTitle>
      </IonCardHeader>
      <IonCardContent className="ion-no-padding">
        <IonItem lines="full">
          <IonLabel position="stacked" style={{ fontWeight: '600', marginBottom: '4px' }}>Vendor</IonLabel>
          <IonInput placeholder="Nama vendor sebelumnya..." value={prevVendor} onIonChange={e => onChange('prevVendor', e.detail.value ?? '')} />
        </IonItem>

        <IonItem lines="full">
          <IonLabel position="stacked" style={{ fontWeight: '600', marginBottom: '4px' }}>Spesifikasi</IonLabel>
          <IonTextarea placeholder="Detail spesifikasi sebelumnya..." value={prevSpec} onIonChange={e => onChange('prevSpec', e.detail.value ?? '')} rows={2} />
        </IonItem>

        <IonGrid className="ion-no-padding">
          <IonRow>
            <IonCol size="6">
              <IonItem lines="full">
                <IonLabel position="stacked" style={{ fontWeight: '600', marginBottom: '4px' }}>Harga</IonLabel>
                <IonInput type="number" placeholder="Rp" value={prevHarga} onIonChange={e => onChange('prevHarga', e.detail.value ?? '')} />
              </IonItem>
            </IonCol>
            <IonCol size="6">
              <IonItem lines="full">
                <IonLabel position="stacked" style={{ fontWeight: '600', marginBottom: '4px' }}>Jumlah</IonLabel>
                <IonInput type="number" placeholder="Qty" value={prevJumlah} onIonChange={e => onChange('prevJumlah', e.detail.value ?? '')} />
              </IonItem>
            </IonCol>
          </IonRow>
        </IonGrid>

        <IonItem lines="none" style={{ '--padding-bottom': '8px' }}>
          <IonLabel position="stacked" style={{ fontWeight: '600', marginBottom: '4px', color: '#e63946' }}>Problem</IonLabel>
          <IonTextarea placeholder="Kendala atau masalah proyek lalu..." value={prevProblem} onIonChange={e => onChange('prevProblem', e.detail.value ?? '')} rows={2} />
        </IonItem>
      </IonCardContent>
    </IonCard>
  );
});
PreviousProjectCard.displayName = 'PreviousProjectCard';

/* =====================================================================
   CARD 3: NEXT PROJECT
===================================================================== */
interface NextProjectCardProps {
  nextSpec: string;
  nextHarga: string;
  nextJumlah: string;
  onChange: FieldChangeHandler;
}

const NextProjectCard = React.memo<NextProjectCardProps>(({
  nextSpec, nextHarga, nextJumlah, onChange
}) => {
  return (
    <IonCard style={{ margin: '0 0 16px 0', borderRadius: '12px' }}>
      <IonCardHeader style={{ background: '#e6f7ff', color: '#0050b3' }}>
        <IonCardTitle style={{ fontSize: '15px', fontWeight: 'bold' }}>Next Project</IonCardTitle>
      </IonCardHeader>
      <IonCardContent className="ion-no-padding">
        <IonItem lines="full">
          <IonLabel position="stacked" style={{ fontWeight: '600', marginBottom: '4px' }}>Spesifikasi</IonLabel>
          <IonTextarea placeholder="Rencana spesifikasi proyek ke depan..." value={nextSpec} onIonChange={e => onChange('nextSpec', e.detail.value ?? '')} rows={2} />
        </IonItem>

        <IonGrid className="ion-no-padding">
          <IonRow>
            <IonCol size="6">
              <IonItem lines="none">
                <IonLabel position="stacked" style={{ fontWeight: '600', marginBottom: '4px' }}>Harga</IonLabel>
                <IonInput type="number" placeholder="Estimasi Rp" value={nextHarga} onIonChange={e => onChange('nextHarga', e.detail.value ?? '')} />
              </IonItem>
            </IonCol>
            <IonCol size="6">
              <IonItem lines="none">
                <IonLabel position="stacked" style={{ fontWeight: '600', marginBottom: '4px' }}>Jumlah</IonLabel>
                <IonInput type="number" placeholder="Estimasi Qty" value={nextJumlah} onIonChange={e => onChange('nextJumlah', e.detail.value ?? '')} />
              </IonItem>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonCardContent>
    </IonCard>
  );
});
NextProjectCard.displayName = 'NextProjectCard';

/* =====================================================================
   CARD 4: LAIN-LAIN & JANJI TEMU
===================================================================== */
interface OtherInfoCardProps {
  harapan: string;
  appointment: string;
  infoLain: string;
  onChange: FieldChangeHandler;
}

const OtherInfoCard = React.memo<OtherInfoCardProps>(({
  harapan, appointment, infoLain, onChange
}) => {
  return (
    <IonCard style={{ margin: '0 0 24px 0', borderRadius: '12px' }}>
      <IonCardHeader color="light">
        <IonCardTitle style={{ fontSize: '15px', fontWeight: 'bold' }}>Lain-Lain & Janji Temu</IonCardTitle>
      </IonCardHeader>
      <IonCardContent className="ion-no-padding">
        <IonItem lines="full">
          <IonLabel position="stacked" style={{ fontWeight: '600', marginBottom: '4px' }}>Harapan</IonLabel>
          <IonInput placeholder="Harapan atau ekspektasi sekolah..." value={harapan} onIonChange={e => onChange('harapan', e.detail.value ?? '')} />
        </IonItem>

        <IonItem lines="full">
          <IonLabel position="stacked" style={{ fontWeight: '600', marginBottom: '4px' }}>APPOINTMENT</IonLabel>
          <IonInput type="date" value={appointment} onIonChange={e => onChange('appointment', e.detail.value ?? '')} />
        </IonItem>

        <IonItem lines="none" style={{ '--padding-bottom': '8px' }}>
          <IonLabel position="stacked" style={{ fontWeight: '600', marginBottom: '4px' }}>INFORMASI LAIN</IonLabel>
          <IonTextarea placeholder="Catatan tambahan lainnya..." value={infoLain} onIonChange={e => onChange('infoLain', e.detail.value ?? '')} rows={2} />
        </IonItem>
      </IonCardContent>
    </IonCard>
  );
});
OtherInfoCard.displayName = 'OtherInfoCard';

/* =====================================================================
   KOMPONEN UTAMA
===================================================================== */
const TambahReport: React.FC = () => {
  const [presentToast] = useIonToast();
  const [isGeocoding, setIsGeocoding] = useState<boolean>(false);
  const history = useHistory<NavigationState>();
  const location = useLocation<NavigationState>();

  const [formData, setFormData] = useState<FormData>({
    schoolName: '',
    newSchoolCity: '',
    newSchoolLat: null,
    newSchoolLng: null,
    interactionType: '',
    productOffer: '',
    responSekolah: '',
    statusProspek: '',
    prevVendor: '',
    prevSpec: '',
    prevHarga: '',
    prevJumlah: '',
    prevProblem: '',
    nextSpec: '',
    nextHarga: '',
    nextJumlah: '',
    harapan: '',
    appointment: '',
    infoLain: '',
  });

  // useCallback -> identitas fungsi ini stabil antar-render,
  // syarat wajib supaya React.memo di komponen Card benar-benar berguna.
  const handleInputChange = useCallback<FieldChangeHandler>((key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  // Navigasi ke halaman Tambah Sekolah, bawa info supaya halaman itu tahu
  // harus balik ke sini (bukan reset form) setelah sekolah baru tersimpan.
  const handleAddNewSchool = useCallback((): void => {
    history.push(ROUTE_TAMBAH_SEKOLAH, { returnTo: ROUTE_TAMBAH_REPORT });
  }, [history]);

  // Dipanggil setiap kali halaman ini AKTIF kembali (termasuk saat kembali
  // dari halaman Tambah Sekolah). Kalau ada nama sekolah baru yang dibawa,
  // isi otomatis ke field Nama Sekolah, lalu bersihkan state supaya tidak
  // terisi ulang kalau user masuk-keluar halaman ini lagi tanpa alasan.
  useIonViewWillEnter(() => {
    if (location.state?.newSchoolName) {
      handleInputChange('schoolName', location.state.newSchoolName);
      history.replace(ROUTE_TAMBAH_REPORT);
    }
  });

  // === FUNGSI GEOCODING OTOMATIS ===
  // Catatan: fungsi ini bergantung pada schoolName & newSchoolCity terbaru,
  // jadi identitasnya wajar berubah saat field itu diketik. Ini tidak masalah
  // karena MainVisitCard toh re-render setiap schoolName berubah (memang sedang diketik).
  // Card lain (Previous/Next/OtherInfo) tidak menerima fungsi ini sama sekali.
  const handleAutoLocateSchool = useCallback(async () => {
    if (!formData.schoolName.trim()) {
      presentToast({
        message: 'Isi Nama Sekolah dulu sebelum mencari lokasi',
        duration: 2000,
        color: 'warning',
        position: 'top',
      });
      return;
    }

    setIsGeocoding(true);

    const query = formData.newSchoolCity
      ? `${formData.schoolName.trim()}, ${formData.newSchoolCity}`
      : formData.schoolName.trim();

    const result = await geocodeAddress(query);
    setIsGeocoding(false);

    if (result) {
      setFormData((prev) => ({
        ...prev,
        newSchoolLat: result.lat,
        newSchoolLng: result.lng,
      }));
      presentToast({
        message: 'Lokasi ditemukan di peta!',
        duration: 2000,
        color: 'success',
        position: 'top',
      });
    } else {
      presentToast({
        message: 'Lokasi tidak ditemukan, silakan pilih manual di peta',
        duration: 2500,
        color: 'warning',
        position: 'top',
      });
    }
  }, [formData.schoolName, formData.newSchoolCity, presentToast]);

  // === FUNGSI SIMPAN REPORT ===
  // Sengaja bergantung pada formData (tidak pakai functional-update trick)
  // karena fungsi ini hanya dipicu oleh klik tombol, bukan tiap keystroke,
  // jadi tidak berdampak ke performa re-render.
  const handleSimpan = useCallback(() => {
    if (!formData.schoolName || !formData.schoolName.trim()) {
      alert('Nama Sekolah wajib diisi!');
      return;
    }

    const payload = {
      nama_sekolah: formData.schoolName,
      latitude: formData.newSchoolLat,
      longitude: formData.newSchoolLng,
      metode_interaksi: formData.interactionType,
      product_offer: formData.productOffer,
      respon: formData.responSekolah,
      status: formData.statusProspek,
      prev_vendor: formData.prevVendor,
      prev_spesifikasi: formData.prevSpec,
      prev_harga: formData.prevHarga,
      prev_jumlah: formData.prevJumlah,
      prev_problem: formData.prevProblem,
      next_spesifikasi: formData.nextSpec,
      next_harga: formData.nextHarga,
      next_jumlah: formData.nextJumlah,
      harapan_sekolah: formData.harapan,
      appointment_date: formData.appointment,
      informasi_lain: formData.infoLain
    };

    console.log("Data siap disimpan:", payload);
  }, [formData]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Tambah Report</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding" style={{ '--background': '#f4f5f8' }}>
        <IonGrid fixed>

          <MainVisitCard
            schoolName={formData.schoolName}
            newSchoolLat={formData.newSchoolLat}
            newSchoolLng={formData.newSchoolLng}
            interactionType={formData.interactionType}
            productOffer={formData.productOffer}
            responSekolah={formData.responSekolah}
            statusProspek={formData.statusProspek}
            isGeocoding={isGeocoding}
            onChange={handleInputChange}
            onAutoLocate={handleAutoLocateSchool}
            onAddNewSchool={handleAddNewSchool}
          />

          <PreviousProjectCard
            prevVendor={formData.prevVendor}
            prevSpec={formData.prevSpec}
            prevHarga={formData.prevHarga}
            prevJumlah={formData.prevJumlah}
            prevProblem={formData.prevProblem}
            onChange={handleInputChange}
          />

          <NextProjectCard
            nextSpec={formData.nextSpec}
            nextHarga={formData.nextHarga}
            nextJumlah={formData.nextJumlah}
            onChange={handleInputChange}
          />

          <OtherInfoCard
            harapan={formData.harapan}
            appointment={formData.appointment}
            infoLain={formData.infoLain}
            onChange={handleInputChange}
          />

          <IonButton
            expand="block"
            shape="round"
            color="primary"
            onClick={handleSimpan}
            style={{ height: '48px', fontWeight: 'bold' }}
          >
            Simpan Report Kunjungan
          </IonButton>

        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default TambahReport;