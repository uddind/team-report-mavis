import React, { useState, useCallback } from 'react';
import {
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
  IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonItem, IonLabel, IonInput, IonTextarea, IonSelect, IonSelectOption,
  IonButton, IonGrid, IonText, IonRow, IonCol, useIonToast,
  useIonViewWillEnter, IonIcon, IonPopover
} from '@ionic/react';
import { addOutline } from 'ionicons/icons';
import { useHistory, useLocation } from 'react-router-dom';
import SchoolAutocomplete from '../components/SchoolAutocomplete';
import { geocodeAddress } from '../utils/geocode';


const ROUTE_TAMBAH_REPORT = '/tambah-report';
const ROUTE_TAMBAH_SEKOLAH = '/tambah-sekolah';

interface NavigationState {
  newSchoolName?: string;
  returnTo?: string;
}

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
  prevSpec: string; // Ditambahkan untuk Previous Project Spesifikasi
  prevHarga: string;
  prevJumlah: string;
  prevProblem: string;
  nextSpec: string;
  nextHarga: string;
  nextJumlah: string;
  nextSpecDetail: string; // Ditambahkan untuk double spesifikasi di Next Project
  harapan: string;
  appointment: string;
  infoLain: string;
}

type FieldChangeHandler = (key: keyof FormData, value: any) => void;

interface FieldLabelWithInfoProps {
  label: string;
  description: string;
  required?: boolean;
}

const FieldLabelWithInfo: React.FC<FieldLabelWithInfoProps> = ({ label, description, required = false }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <IonLabel position="stacked" style={{ fontWeight: '600', marginBottom: '4px', color: '#333' }}>
          {label}
          {required ? <IonText color="danger"> *</IonText> : null}
        </IonLabel>
        <IonButton
          fill="clear"
          size="small"
          onClick={() => setIsOpen(true)}
          title="Deskripsi"
          style={{ margin: 0, minWidth: '28px', height: '28px', color: '#f59e0b', fontWeight: 'bold', padding: 0 }}
        >
        </IonButton>
      </div>
      <IonPopover isOpen={isOpen} onDidDismiss={() => setIsOpen(false)}>
        <div style={{ padding: '12px 14px', maxWidth: '280px' }}>
          <div style={{ fontWeight: '700', marginBottom: '6px' }}>Deskripsi</div>
          <div style={{ fontSize: '13px', color: '#444', lineHeight: '1.6', whiteSpace: 'pre-line' }}>{description}</div>
        </div>
      </IonPopover>
    </>
  );
};

/* =====================================================================
   CARD 1: INFORMASI KUNJUNGAN UTAMA
===================================================================== */
interface MainVisitCardProps {
  schoolName: string;
  interactionType: string;
  productOffer: string;
  responSekolah: string;
  statusProspek: string;
  onChange: FieldChangeHandler;
  onAddNewSchool: () => void;
}

const MainVisitCard = React.memo<MainVisitCardProps>(({
  schoolName, interactionType, productOffer, responSekolah, statusProspek, onChange, onAddNewSchool
}) => {
  return (
    <IonCard style={{ margin: '0 0 16px 0', borderRadius: '12px' }}>
      <IonCardHeader color="light">
        <IonCardTitle style={{ fontSize: '15px', fontWeight: 'bold' }}>🏫 FORM KUNJUNGAN UTAMA</IonCardTitle>
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
            fill="outline"
            color="primary"
            size="small"
            onClick={onAddNewSchool}
            title="Tambah sekolah baru"
            style={{ margin: '4px 0 0 8px', whiteSpace: 'nowrap' }}
          >
            <IonIcon icon={addOutline} slot="start" />
            Tambah Sekolah
          </IonButton>
        </IonItem>

        <IonItem lines="full">
          <FieldLabelWithInfo label="by Chat/Visit" description="Contoh: Nama Orang, Jabatan" />
          <IonTextarea placeholder="Masukkan detail interaksi..." value={interactionType} onIonChange={e => onChange('interactionType', e.detail.value ?? '' )} rows={2} />
        </IonItem>

        <IonItem lines="full">
          <FieldLabelWithInfo label="Offering" description="Contoh: Kalender, Yearbook, Majalah" />
          <IonTextarea placeholder="Masukkan penawaran produk..." value={productOffer} onIonChange={e => onChange('productOffer', e.detail.value ?? '')} rows={2} />
        </IonItem>

        <IonItem lines="full">
          <FieldLabelWithInfo label="Respon" description="Contoh: Respon dari orangnya yang berada di By Chat" />
          <IonTextarea placeholder="Masukkan respon pihak sekolah..." value={responSekolah} onIonChange={e => onChange('responSekolah', e.detail.value ?? '')} rows={2} />
        </IonItem>

        <IonItem lines="none" style={{ '--padding-bottom': '8px' }}>
          <FieldLabelWithInfo
            label="Status"
            description={"Arti Status:\n• OF = Offering (Sedang penawaran)\n• FU 1 / FU 2 = Follow Up tahap 1 & 2\n• C = Closing (Deal)\n• ND = No Deal (Batal/Tolak)\n• Cold / Warm / Hot = Tingkat ketertarikan (Rendah / Sedang / Sangat Tertarik)"}
          />
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
        <IonCardTitle style={{ fontSize: '15px', fontWeight: 'bold' }}>⏰ PREVIOUS PROJECT</IonCardTitle>
      </IonCardHeader>
      <IonCardContent className="ion-no-padding">
        <IonItem lines="full">
          <IonLabel position="stacked" style={{ fontWeight: '600', marginBottom: '4px' }}>Vendor</IonLabel>
          <IonInput placeholder="Contoh: Mavis" value={prevVendor} onIonChange={e => onChange('prevVendor', e.detail.value ?? '')} />
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
          <FieldLabelWithInfo label="Problem" description="Contoh: Ada nama guru yang kurang lengkap dibagian prestasi" />
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
  nextSpecDetail: string;
  harapan: string;
  onChange: FieldChangeHandler;
}

const NextProjectCard = React.memo<NextProjectCardProps>(({
  nextSpec, nextHarga, nextJumlah, nextSpecDetail, harapan, onChange
}) => {
  return (
    <IonCard style={{ margin: '0 0 16px 0', borderRadius: '12px' }}>
      <IonCardHeader style={{ background: '#e6f7ff', color: '#0050b3' }}>
        <IonCardTitle style={{ fontSize: '15px', fontWeight: 'bold' }}>💡 NEXT PROJECT</IonCardTitle>
      </IonCardHeader>
      <IonCardContent className="ion-no-padding">
        <IonItem lines="full">
          <FieldLabelWithInfo label="Spesifikasi" description="Contoh: Masih sama seperti tahun lalu" />
          <IonTextarea placeholder="Rencana spesifikasi proyek ke depan..." value={nextSpec} onIonChange={e => onChange('nextSpec', e.detail.value ?? '')} rows={2} />
       
        </IonItem>

        <IonGrid className="ion-no-padding">
          <IonRow>
            <IonCol size="6">
              <IonItem lines="full">
                <IonLabel position="stacked" style={{ fontWeight: '600', marginBottom: '4px' }}>Harga</IonLabel>
                <IonInput type="number" placeholder="Estimasi Rp" value={nextHarga} onIonChange={e => onChange('nextHarga', e.detail.value ?? '')} />
              </IonItem>
            </IonCol>
            <IonCol size="6">
              <IonItem lines="full">
                <IonLabel position="stacked" style={{ fontWeight: '600', marginBottom: '4px' }}>Jumlah</IonLabel>
                <IonInput type="number" placeholder="Estimasi Qty" value={nextJumlah} onIonChange={e => onChange('nextJumlah', e.detail.value ?? '')} />
              </IonItem>
            </IonCol>
          </IonRow>
        </IonGrid>

        <IonItem lines="full">
          <FieldLabelWithInfo label="Spesifikasi Detail" description="Contoh: 1.650 eks, uk 44 x 64 cm, 1 bulanan, 6 lembar, Spiral hunger, Include session foto" />
          <IonTextarea placeholder="Detail spesifikasi..." value={nextSpecDetail} onIonChange={e => onChange('nextSpecDetail', e.detail.value ?? '')} rows={4} />
         
        </IonItem>

        <IonItem lines="none" style={{ '--padding-bottom': '8px' }}>
          <FieldLabelWithInfo label="Harapan" description="Contoh: Bisa bekerja sama lagi, bertemu untuk membahas project kalender" />
          <IonTextarea placeholder="Harapan proyek selanjutnya..." value={harapan} onIonChange={e => onChange('harapan', e.detail.value ?? '')} rows={2}/>
          
        </IonItem>
      </IonCardContent>
    </IonCard>
  );
});
NextProjectCard.displayName = 'NextProjectCard';

/* =====================================================================
   CARD 4: JANJI TEMU & LAIN-LAIN
===================================================================== */
interface OtherInfoCardProps {
  appointment: string;
  infoLain: string;
  onChange: FieldChangeHandler;
}
const formatAppointmentValue = (value: string): string => {
  const trimmed = value.trim();
  const match = trimmed.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/);

  if (!match) {
    return trimmed;
  }

  const [, day, month, year] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  return `${dayNames[date.getDay()]}, ${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${year}`;
};
const OtherInfoCard = React.memo<OtherInfoCardProps>(({
  appointment, infoLain, onChange
}) => {
  return (
    <IonCard style={{ margin: '0 0 24px 0', borderRadius: '12px' }}>
      <IonCardHeader color="light">
        <IonCardTitle style={{ fontSize: '15px', fontWeight: 'bold' }}>🗓 INFORMASI LAIN</IonCardTitle>
      </IonCardHeader>
      <IonCardContent className="ion-no-padding">
        <IonItem lines="full">
          <FieldLabelWithInfo label="APPOINTMENT (Hari, Tanggal)" description="Contoh: Senin, 21/07/2026" />
          <IonInput
            value={appointment}
            placeholder="Contoh: Senin, 21/07/2026"
            onIonChange={e => {
              const formatted = formatAppointmentValue(e.detail.value ?? '');
              onChange('appointment', formatted);
            }}
          />
        </IonItem>

        <IonItem lines="none" style={{ '--padding-bottom': '8px' }}>
          <FieldLabelWithInfo label="🔑 INFORMASI LAIN" description="Contoh: karena Kepala sekolah sudah ganti bukan pak yanto, perlu untuk datang dan silaturahmi" />
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
    nextSpecDetail: '',
    harapan: '',
    appointment: '',
    infoLain: '',
  });

  const handleInputChange = useCallback<FieldChangeHandler>((key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const handleAddNewSchool = useCallback((): void => {
    history.push(ROUTE_TAMBAH_SEKOLAH, { returnTo: ROUTE_TAMBAH_REPORT });
  }, [history]);

  useIonViewWillEnter(() => {
    if (location.state?.newSchoolName) {
      handleInputChange('schoolName', location.state.newSchoolName);
      history.replace(ROUTE_TAMBAH_REPORT);
    }
  });

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
      next_spesifikasi_detail: formData.nextSpecDetail,
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
            interactionType={formData.interactionType}
            productOffer={formData.productOffer}
            responSekolah={formData.responSekolah}
            statusProspek={formData.statusProspek}
            onChange={handleInputChange}
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
            nextSpecDetail={formData.nextSpecDetail}
            harapan={formData.harapan}
            onChange={handleInputChange}
          />

          <OtherInfoCard
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