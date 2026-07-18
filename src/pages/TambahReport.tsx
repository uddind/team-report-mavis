import React, { useState, useCallback } from 'react';
import {
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
  IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonItem, IonLabel, IonInput, IonTextarea,
  IonButton, IonGrid, IonText, IonRow, IonCol, useIonToast,
  IonIcon, IonPopover
} from '@ionic/react';
import { addOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import SchoolAutocomplete from '../components/SchoolAutocomplete';
import { addReport } from '../services/reportService';
import { buildReportFromForm, type TambahReportFormData } from '../utils/reportForm';
import { supabase } from '../services/supabaseClient';

const ROUTE_TAMBAH_REPORT = '/tambah-report';
const ROUTE_TAMBAH_SEKOLAH = '/tambah-sekolah';

interface NavigationState {
  newSchoolName?: string;
  returnTo?: string;
}

type FieldChangeHandler = (key: keyof TambahReportFormData, value: any) => void;

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
        <IonLabel position="stacked" style={{ fontWeight: '700', marginBottom: '4px', color: '#0f172a' }}>
          {label}
          {required ? <IonText color="danger"> *</IonText> : null}
        </IonLabel>
        <IonButton
          fill="clear"
          size="small"
          onClick={() => setIsOpen(true)}
          title="Deskripsi"
            style={{
            margin: 0,
            minWidth: '18px',
            height: '18px',
            width: '18px',
            color: '#f59e0b',
            padding: 0,
            fontSize: '10px',
            fontWeight: '100',
            border: '1px solid #f59e0b',
            borderRadius: '20%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ?
        </IonButton>
      </div>
      <IonPopover isOpen={isOpen} onDidDismiss={() => setIsOpen(false)}>
        <div style={{ padding: '12px 14px', maxWidth: '280px' }}>
          <div style={{ fontWeight: '700', marginBottom: '6px', color: '#0f172a' }}>Deskripsi</div>
          <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6', whiteSpace: 'pre-line' }}>{description}</div>
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

const statusOptions = [
  { value: 'OF', label: 'OF', description: 'Offering — sedang dalam penawaran' },
  { value: 'FU 1', label: 'FU 1', description: 'Follow up tahap 1' },
  { value: 'FU 2', label: 'FU 2', description: 'Follow up tahap 2' },
  { value: 'C', label: 'C', description: 'Closing — deal' },
  { value: 'ND', label: 'ND', description: 'No deal — batal atau ditolak' },
  { value: 'Cold', label: 'Cold', description: 'Minat rendah' },
  { value: 'Warm', label: 'Warm', description: 'Minat sedang' },
  { value: 'Hot', label: 'Hot', description: 'Minat sangat tinggi' },
];

const MainVisitCard = React.memo<MainVisitCardProps>(({ 
  schoolName, interactionType, productOffer, responSekolah, statusProspek, onChange, onAddNewSchool
}) => {
  const selectedStatus = statusOptions.find(option => option.value === statusProspek);

  return (
    <IonCard style={{ margin: '0 0 16px 0', borderRadius: '16px', boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)', overflow: 'hidden', background: '#ffffff' }}>
      <IonCardHeader style={{ background: 'linear-gradient(90deg, #f8fbff 0%, #d6c354 100%)', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
        <IonCardTitle style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>🏫 Form Kunjungan Utama</IonCardTitle>
      </IonCardHeader>
      <IonCardContent className="ion-no-padding">

        <IonItem lines="full" style={{ '--padding-top': '10px', '--padding-bottom': '10px', '--background': '#fff' }}>
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
            style={{ margin: '4px 0 0 8px', whiteSpace: 'nowrap', borderRadius: '999px' }}
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
            description={"Pilih status prospek lalu lihat arti singkatnya di bawah."}
          />
          <div style={{ width: '100%' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
              {statusOptions.map(option => {
                const isActive = statusProspek === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => onChange('statusProspek', option.value)}
                    style={{
                      border: isActive ? '1px solid #2563eb' : '1px solid #dbeafe',
                      background: isActive ? 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)' : '#f8fbff',
                      color: isActive ? '#fff' : '#475569',
                      borderRadius: '999px',
                      padding: '7px 12px',
                      fontSize: '13px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      boxShadow: isActive ? '0 4px 12px rgba(37, 99, 235, 0.22)' : 'none',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>

            {selectedStatus ? (
              <div style={{
                marginTop: '10px',
                padding: '12px 14px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #f8fbff 0%, #eef6ff 100%)',
                border: '1px solid #bfdbfe',
                color: '#334155',
                fontSize: '13px',
                boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.8)'
              }}>
                <strong>{selectedStatus.label}</strong> — {selectedStatus.description}
              </div>
            ) : null}
          </div>
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
    <IonCard style={{ margin: '0 0 16px 0', borderRadius: '16px', boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)', overflow: 'hidden', background: '#ffffff' }}>
      <IonCardHeader style={{ background: 'linear-gradient(90deg, #fff7ed 0%, #ff0202 100%)', color: '#9a2c00', borderBottom: '1px solid #fed7aa' }}>
        <IonCardTitle style={{ fontSize: '15px', fontWeight: '800' }}>⏰ Previous Project</IonCardTitle>
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
          <FieldLabelWithInfo label="Spesifikasi" description="Contoh: Ada nama guru yang kurang lengkap dibagian prestasi" />
          <IonTextarea
            placeholder={prevProblem || 'Kendala atau masalah proyek lalu...'}
            value={prevSpec}
            onIonChange={e => onChange('prevSpec', e.detail.value ?? '')}
            rows={2}
          />
        </IonItem>
        <IonItem lines="full">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <IonLabel position="stacked" style={{ fontWeight: '600', marginBottom: '4px' }}>Problem</IonLabel>
            <IonButton
              fill="clear"
              size="small"
              onClick={() => {}} 
              title="Deskripsi Problem"
              style={{
            margin: 0,
            minWidth: '18px',
            height: '18px',
            width: '18px',
            color: '#f59e0b',
            padding: 0,
            fontSize: '10px',
            fontWeight: '100',
            border: '1px solid #f59e0b',
            borderRadius: '20%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
            >
              ?
            </IonButton>
          </div>
          <IonInput placeholder="Contoh: Mavis" value={prevProblem} onIonChange={e => onChange('prevProblem', e.detail.value ?? '')} />
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
    <IonCard style={{ margin: '0 0 16px 0', borderRadius: '16px', boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)', overflow: 'hidden', background: '#ffffff' }}>
      <IonCardHeader style={{ background: 'linear-gradient(90deg, #ececed 0%, #f0e628 100%)', color: '#1d4ed8', borderBottom: '1px solid #bfdbfe' }}>
        <IonCardTitle style={{ fontSize: '15px', fontWeight: '800' }}>💡 Next Project</IonCardTitle>
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
    <IonCard style={{ margin: '0 0 24px 0', borderRadius: '16px', boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)', overflow: 'hidden', background: '#ffffff' }}>
      <IonCardHeader style={{ background: 'linear-gradient(90deg, #f8fafc 0%, #2a2d30 100%)', borderBottom: '1px solid #e2e8f0' }}>
        <IonCardTitle style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>🗓 Informasi Lain</IonCardTitle>
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
  const history = useHistory<NavigationState>();

  const [formData, setFormData] = useState<TambahReportFormData>({
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

  const handleAddNewSchool = useCallback(() => {
    history.push({
      pathname: ROUTE_TAMBAH_SEKOLAH,
      state: { returnTo: ROUTE_TAMBAH_REPORT }
    });
  }, [history]);

  const handleSimpan = useCallback(async () => {
    if (!formData.schoolName || !formData.schoolName.trim()) {
      alert('Nama Sekolah wajib diisi!');
      return;
    }

    try {
      // 1. Bentuk data flat dan objek lama menggunakan helper utility
      const reportPayload = buildReportFromForm(formData);

      // 2. Ambil user session aktif dari Supabase Auth agar kolom user_id (not null) terisi
      // Catatan: Sesuaikan pemanggilan supabase client sesuai struktur projek Anda jika service terpisah
      const { data: authData } = await supabase.auth.getUser(); 
      if (authData?.user) {
        reportPayload.user_id = authData.user.id;
      }

      // 3. Kirim data yang telah dikonversi sempurna ke database
      await addReport(reportPayload);

      presentToast({
        message: 'Laporan kunjungan berhasil disimpan!',
        duration: 2000,
        color: 'success'
      });
      history.push('/laporan');
    } catch (error: any) {
      console.error('Error saat simpan report:', error);
      const message = error?.message || 'Terjadi kesalahan saat menyimpan laporan.';
      alert(message);
    }
  }, [formData, history, presentToast]);
  

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar style={{ '--background': '#2563eb', '--color': '#fff' }}>
          <IonTitle style={{ fontWeight: '800' }}>Tambah Report</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding" style={{ '--background': '#f8fafc' }}>
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
            style={{ height: '48px', fontWeight: '800', borderRadius: '14px', boxShadow: '0 8px 16px rgba(37, 99, 235, 0.22)' }}
          >
            Simpan Report Kunjungan
          </IonButton>

        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default TambahReport;