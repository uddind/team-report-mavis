import { useState } from 'react';
import {
  IonContent,
  IonPage,
  IonItem,
  IonLabel,
  IonIcon,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonDatetime,
  IonDatetimeButton,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonInput,
  useIonRouter,
  useIonToast,
} from '@ionic/react';
import {
  chatbubbleOutline,
  pricetagOutline,
  chatboxEllipsesOutline,
  cubeOutline,
  documentTextOutline,
  alertCircleOutline,
  bulbOutline,
  addOutline,
  closeOutline,
} from 'ionicons/icons';
import Header from '../components/Header';
import FormSectionCard from '../components/FormSectionCard';
import CollapsibleSectionCard from '../components/CollapsibleSectionCard';
import StatusInfoModal from '../components/StatusInfoModal';
import StatusPreviewCard from '../components/StatusPreviewCard';
import SchoolAutocomplete from '../components/SchoolAutocomplete';
import ComboPriceInput from '../components/ComboPriceInput';
import type { Report } from '../types/Report';
import { addReport } from '../services/reportService';
import { combinedStatusOptions, splitStatus } from '../utils/statusOptions';
import './TambahReport.css';

// Integrasi Client Supabase
import { supabase } from '../services/supabaseClient';

const areaOptions = ['Kota Blitar', 'Kab.Blitar', 'Kota Kediri', 'Kab.Kediri', 'Malang']; 

const TambahReport: React.FC = () => {
  const router = useIonRouter();
  const [presentToast] = useIonToast();

  const [schoolName, setSchoolName] = useState('');
  const [byChatVisit, setByChatVisit] = useState('');
  const [productOffer, setProductOffer] = useState('');
  const [respon, setRespon] = useState('');
  const [combinedStatus, setCombinedStatus] = useState('OF|Cold');

  const [prevVendor, setPrevVendor] = useState('');
  const [prevHarga, setPrevHarga] = useState('');
  const [prevJumlah, setPrevJumlah] = useState('');
  const [prevSpesifikasi, setPrevSpesifikasi] = useState('');
  const [prevProblem, setPrevProblem] = useState('');

  const [nextHarga, setNextHarga] = useState('');
  const [nextJumlah, setNextJumlah] = useState('');
  const [nextSpesifikasi, setNextSpesifikasi] = useState('');
  const [nextHarapan, setNextHarapan] = useState('');

  const [tanggal, setTanggal] = useState('');
  const [jam, setJam] = useState('');
  const [catatan, setCatatan] = useState('');

  const [informasiLain, setInformasiLain] = useState('');

  // State Modal Tambah Sekolah
  const [showAddSchoolModal, setShowAddSchoolModal] = useState(false);
  const [newSchoolName, setNewSchoolName] = useState('');
  const [newSchoolCity, setNewSchoolCity] = useState('');
  const [newSchoolDistrict, setNewSchoolDistrict] = useState('');
  const [isSubmittingSchool, setIsSubmittingSchool] = useState(false);

  const handleBatal = () => {
    router.push('/beranda');
  };

  // Fungsi Tambah Sekolah Baru ke Supabase (Sudah Diperbaiki)
  const handleTambahSekolahBaru = async () => {
    if (!newSchoolName.trim()) {
      presentToast({
        message: 'Nama Sekolah wajib diisi',
        duration: 2000,
        color: 'danger',
        position: 'top',
      });
      return;
    }
    if (!newSchoolCity) {
      presentToast({
        message: 'Kota / Kabupaten wajib dipilih',
        duration: 2000,
        color: 'danger',
        position: 'top',
      });
      return;
    }

    try {
      setIsSubmittingSchool(true);

      // Mengirimkan string kosong '' jika kecamatan tidak diisi agar lolos not-null constraint
      const { error } = await supabase
        .from('sekolah')
        .insert([
          {
            nama_sekolah: newSchoolName.trim(),
            kab_kota: newSchoolCity,
            kecamatan: newSchoolDistrict.trim() || '', 
            created_at: new Date().toISOString(),
          },
        ]);

      if (error) throw error;

      // Mengisi form input utama secara otomatis dengan nama sekolah baru
      setSchoolName(newSchoolName.trim());
      
      presentToast({
        message: 'Sekolah berhasil disimpan ke Supabase!',
        duration: 2000,
        color: 'success',
        position: 'top',
      });

      // Reset form modal dan tutup jendela modal
      setNewSchoolName('');
      setNewSchoolCity('');
      setNewSchoolDistrict('');
      setShowAddSchoolModal(false);

    } catch (error: any) {
      console.error('Error saving school to Supabase:', error);
      presentToast({
        message: `Gagal menyimpan: ${error.message || 'Terjadi kesalahan'}`,
        duration: 3000,
        color: 'danger',
        position: 'top',
      });
    } finally {
      setIsSubmittingSchool(false);
    }
  }; // SINTAKS FIX: Memastikan penutupan fungsi ini tidak merusak fungsi di bawahnya

  const handleSimpan = async () => {
    if (!schoolName.trim()) {
      presentToast({
        message: 'Nama Sekolah wajib diisi',
        duration: 2000,
        color: 'danger',
        position: 'top',
      });
      return;
    }

    const { statusCode, statusTemperature } = splitStatus(combinedStatus);

    const newReport: Report = {
      id: Date.now().toString(),
      schoolName,
      byChatVisit,
      productOffer,
      respon,
      statusCode,
      statusTemperature,
      previousProject: {
        vendor: prevVendor,
        harga: prevHarga,
        jumlah: prevJumlah,
        spesifikasi: prevSpesifikasi,
        problem: prevProblem,
      },
      nextProject: {
        vendor: '',
        harga: nextHarga,
        jumlah: nextJumlah,
        spesifikasi: nextSpesifikasi,
        harapan: nextHarapan,
      },
      appointment: {
        tanggal,
        jam,
        catatan,
      },
      informasiLain,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await addReport(newReport);

    presentToast({
      message: 'Report berhasil disimpan',
      duration: 2000,
      color: 'success',
      position: 'top',
    });

    router.push('/beranda');
  };

  return (
    <IonPage>
      <Header />
      <IonContent fullscreen className="tambah-report-content">
        <FormSectionCard title="🏫 INFORMASI SEKOLAH">
          <IonItem lines="none" className="school-name-item">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <IonLabel position="stacked">Nama Sekolah</IonLabel>
              <IonButton 
                fill="clear" 
                size="small" 
                onClick={() => setShowAddSchoolModal(true)}
                style={{ marginBottom: '-10px', '--padding-end': '0px' }}
              >
                <IonIcon slot="icon-only" icon={addOutline} />
              </IonButton>
            </div>
            <SchoolAutocomplete value={schoolName} onChange={setSchoolName} />
          </IonItem>

          <IonItem lines="none">
            <IonLabel position="stacked">by Chat / Visit</IonLabel>
            <div className="input-with-icon">
              <IonIcon icon={chatbubbleOutline} className="input-icon-top" />
              <IonTextarea
                className="wrap-textarea has-icon"
                rows={1}
                autoGrow
                value={byChatVisit}
                onIonInput={(e: CustomEvent) => setByChatVisit(e.detail.value ?? '')}
                placeholder="Chat atau Visit"
              />
            </div>
          </IonItem>

          <IonItem lines="none">
            <IonLabel position="stacked">Product Offer</IonLabel>
            <div className="input-with-icon">
              <IonIcon icon={pricetagOutline} className="input-icon-top" />
              <IonTextarea
                className="wrap-textarea has-icon"
                rows={1}
                autoGrow
                value={productOffer}
                onIonInput={(e: CustomEvent) => setProductOffer(e.detail.value ?? '')}
                placeholder="Produk yang ditawarkan"
              />
            </div>
          </IonItem>

          <IonItem lines="none">
            <IonLabel position="stacked">Respon</IonLabel>
            <div className="input-with-icon">
              <IonIcon icon={chatboxEllipsesOutline} className="input-icon-top" />
              <IonTextarea
                className="wrap-textarea has-icon"
                rows={1}
                autoGrow
                value={respon}
                onIonInput={(e: CustomEvent) => setRespon(e.detail.value ?? '')}
                placeholder="Respon dari sekolah"
              />
            </div>
          </IonItem>

          <div className="status-label-row">
            <span className="status-label-text">Status</span>
          </div>
          <IonItem lines="none">
            <IonSelect
              value={combinedStatus}
              onIonChange={(e: CustomEvent) => setCombinedStatus(e.detail.value)}
              interface="popover"
              fill="outline"
              className="boxed-select"
            >
              {combinedStatusOptions.map((opt) => (
                <IonSelectOption key={opt.value} value={opt.value}>
                  {opt.label}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>

          <StatusPreviewCard statusCode={splitStatus(combinedStatus).statusCode} />

          <div className="status-info-trigger-row">
            <StatusInfoModal />
          </div>
        </FormSectionCard>

        <CollapsibleSectionCard title="⏰ PREVIOUS PROJECT">
          <IonItem lines="none">
            <IonLabel position="stacked">Vendor</IonLabel>
            <div className="input-with-icon">
              <IonIcon icon={cubeOutline} className="input-icon" />
              <input
                className="plain-text-input has-icon"
                value={prevVendor}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPrevVendor(e.target.value)}
                placeholder="Contoh: MAVIS"
              />
            </div>
          </IonItem>
          <IonItem lines="none">
            <IonLabel position="stacked">Harga</IonLabel>
            <ComboPriceInput value={prevHarga} onChange={setPrevHarga} />
          </IonItem>
          <IonItem lines="none">
            <IonLabel position="stacked">Jumlah</IonLabel>
            <div className="input-with-icon">
              <IonIcon icon={cubeOutline} className="input-icon-top" />
              <IonTextarea
                className="wrap-textarea has-icon"
                rows={1}
                autoGrow
                value={prevJumlah}
                onIonInput={(e: CustomEvent) => setPrevJumlah(e.detail.value ?? '')}
                placeholder="Contoh: 1.650 eks"
              />
            </div>
          </IonItem>
          <IonItem lines="none">
            <IonLabel position="stacked">Spesifikasi</IonLabel>
            <div className="input-with-icon">
              <IonIcon icon={documentTextOutline} className="input-icon-top" />
              <IonTextarea
                className="wrap-textarea has-icon"
                rows={1}
                autoGrow
                value={prevSpesifikasi}
                onIonInput={(e: CustomEvent) => setPrevSpesifikasi(e.detail.value ?? '')}
                placeholder="Contoh: uk 44 x 64 cm, 1 bulanan, 6 lembar, spiral hanger, include sesi foto"
              />
            </div>
          </IonItem>
          <IonItem lines="none">
            <IonLabel position="stacked">
              <IonIcon icon={alertCircleOutline} className="label-icon" /> Problem
            </IonLabel>
            <IonTextarea
              value={prevProblem}
              onIonInput={(e: CustomEvent) => setPrevProblem(e.detail.value ?? '')}
              autoGrow
              placeholder="Contoh: Kualitas cetak kurang tajam"
            />
          </IonItem>
        </CollapsibleSectionCard>

        <CollapsibleSectionCard title="💡 NEXT PROJECT">
          <IonItem lines="none">
            <IonLabel position="stacked">Spesifikasi</IonLabel>
            <div className="input-with-icon">
              <IonIcon icon={documentTextOutline} className="input-icon-top" />
              <IonTextarea
                className="wrap-textarea has-icon"
                rows={1}
                autoGrow
                value={nextSpesifikasi}
                onIonInput={(e: CustomEvent) => setNextSpesifikasi(e.detail.value ?? '')}
                placeholder="Contoh: uk 44 x 64 cm..."
              />
            </div>
          </IonItem>
          <IonItem lines="none">
            <IonLabel position="stacked">Harga</IonLabel>
            <ComboPriceInput value={nextHarga} onChange={setNextHarga} />
          </IonItem>
          <IonItem lines="none">
            <IonLabel position="stacked">Jumlah</IonLabel>
            <div className="input-with-icon">
              <IonIcon icon={cubeOutline} className="input-icon-top" />
              <IonTextarea
                className="wrap-textarea has-icon"
                rows={1}
                autoGrow
                value={nextJumlah}
                onIonInput={(e: CustomEvent) => setNextJumlah(e.detail.value ?? '')}
                placeholder="Contoh: 1.650 eks"
              />
            </div>
          </IonItem>
          <IonItem lines="none">
            <IonLabel position="stacked">
              <IonIcon icon={bulbOutline} className="label-icon" /> Harapan
            </IonLabel>
            <IonTextarea
              value={nextHarapan}
              onIonInput={(e: CustomEvent) => setNextHarapan(e.detail.value ?? '')}
              autoGrow
              placeholder="Contoh: Kualitas cetak lebih baik"
            />
          </IonItem>
        </CollapsibleSectionCard>

        <CollapsibleSectionCard title="🗓 APPOINTMENT">
          <IonItem lines="none">
            <IonLabel position="stacked">Tanggal</IonLabel>
            <div className="datetime-box">
              <IonDatetimeButton datetime="tanggal-picker" />
              <IonModal keepContentsMounted>
                <IonDatetime
                  id="tanggal-picker"
                  presentation="date"
                  onIonChange={(e: CustomEvent) => {
                    const val = e.detail.value;
                    setTanggal(typeof val === 'string' ? val.split('T')[0] : '');
                  }}
                />
              </IonModal>
            </div>
          </IonItem>

          <IonItem lines="none">
            <IonLabel position="stacked">Jam</IonLabel>
            <div className="datetime-box">
              <IonDatetimeButton datetime="jam-picker" />
              <IonModal keepContentsMounted>
                <IonDatetime
                  id="jam-picker"
                  presentation="time"
                  onIonChange={(e: CustomEvent) => {
                    const val = e.detail.value;
                    setJam(typeof val === 'string' ? val : '');
                  }}
                />
              </IonModal>
            </div>
          </IonItem>

          <IonItem lines="none">
            <IonLabel position="stacked">Catatan</IonLabel>
            <IonTextarea value={catatan} onIonInput={(e: CustomEvent) => setCatatan(e.detail.value ?? '')} autoGrow /> 
          </IonItem>
        </CollapsibleSectionCard>

        <CollapsibleSectionCard title="🔑 INFORMASI LAIN">
          <IonItem lines="none">
            <IonTextarea
              value={informasiLain}
              onIonInput={(e: CustomEvent) => setInformasiLain(e.detail.value ?? '')}
              autoGrow
              rows={6}
              placeholder="Tulis informasi tambahan di sini..."
            />
          </IonItem>
        </CollapsibleSectionCard>

        <div className="tambah-report-actions">
          <IonButton expand="block" fill="outline" onClick={handleBatal}>
            Batal
          </IonButton>
          <IonButton expand="block" fill="solid" onClick={handleSimpan}>
            Simpan
          </IonButton>
        </div>

        {/* MODAL TAMBAH SEKOLAH */}
        <IonModal isOpen={showAddSchoolModal} onDidDismiss={() => setShowAddSchoolModal(false)} className="profile-modal">
          <IonHeader className="ion-no-border">
            <IonToolbar>
              <IonTitle>🏫 TAMBAH SEKOLAH</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowAddSchoolModal(false)}>
                  <IonIcon icon={closeOutline} slot="icon-only" />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="profile-modal-content ion-padding">
            <IonItem lines="none" className="login-field">
              <IonInput
                label="Nama Sekolah"
                labelPlacement="stacked"
                value={newSchoolName}
                onIonInput={(e: CustomEvent) => setNewSchoolName(e.detail.value ?? '')}
                placeholder="Masukkan nama sekolah"
              />
            </IonItem>

            <IonItem lines="none" className="login-field">
              <IonSelect
                label="Kota / Kabupaten"
                labelPlacement="stacked"
                value={newSchoolCity}
                onIonChange={(e: CustomEvent) => setNewSchoolCity(e.detail.value)}
                interface="popover"
                placeholder="Cari kota/kabupaten..."
              >
                {areaOptions.map((a) => (
                  <IonSelectOption key={a} value={a}>{a}</IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>

            <IonItem lines="none" className="login-field">
              <IonInput
                label="Kecamatan (Opsional)"
                labelPlacement="stacked"
                value={newSchoolDistrict}
                onIonInput={(e: CustomEvent) => setNewSchoolDistrict(e.detail.value ?? '')}
                placeholder="Cari kecamatan..."
              />
            </IonItem>

            <IonButton 
              expand="block" 
              className="primary-btn" 
              onClick={handleTambahSekolahBaru} 
              style={{ marginTop: '30px' }}
              disabled={isSubmittingSchool}
            >
              <IonIcon icon={addOutline} slot="start" />
              {isSubmittingSchool ? 'Menyimpan...' : 'Tambah Sekolah'}
            </IonButton>
          </IonContent>
        </IonModal>

      </IonContent>
    </IonPage>
  );
};

export default TambahReport;