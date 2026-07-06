import { useState } from 'react';
import {
  IonContent,
  IonPage,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonDatetime,
  IonDatetimeButton,
  IonModal,
  useIonRouter,
  useIonToast,
} from '@ionic/react';
import Header from '../components/Header';
import FormSectionCard from '../components/FormSectionCard';
import StatusInfoPopover from '../components/StatusInfoPopover';
import type { Report } from '../types/Report';
import { addReport } from '../services/reportService';
import { combinedStatusOptions, splitStatus } from '../utils/statusOptions';
import './TambahReport.css';

const TambahReport: React.FC = () => {
  const router = useIonRouter();
  const [presentToast] = useIonToast();

  // Informasi Sekolah
  const [schoolName, setSchoolName] = useState('');
  const [byChatVisit, setByChatVisit] = useState('');
  const [productOffer, setProductOffer] = useState('');
  const [respon, setRespon] = useState('');
  const [combinedStatus, setCombinedStatus] = useState('OF|Cold');

  // Previous Project
  const [prevVendor, setPrevVendor] = useState('');
  const [prevHarga, setPrevHarga] = useState('');
  const [prevJumlah, setPrevJumlah] = useState('');
  const [prevSpesifikasi, setPrevSpesifikasi] = useState('');
  const [prevProblem, setPrevProblem] = useState('');

  // Next Project
  const [nextVendor, setNextVendor] = useState('');
  const [nextHarga, setNextHarga] = useState('');
  const [nextJumlah, setNextJumlah] = useState('');
  const [nextSpesifikasi, setNextSpesifikasi] = useState('');
  const [nextHarapan, setNextHarapan] = useState('');

  // Appointment
  const [tanggal, setTanggal] = useState('');
  const [jam, setJam] = useState('');
  const [catatan, setCatatan] = useState('');

  // Informasi Lain
  const [informasiLain, setInformasiLain] = useState('');

  const handleBatal = () => {
    router.push('/beranda');
  };

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
        vendor: nextVendor,
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
        {/* 🏫 INFORMASI SEKOLAH */}
        <FormSectionCard title="🏫 INFORMASI SEKOLAH">
          <IonItem lines="none">
            <IonLabel position="stacked">Nama Sekolah</IonLabel>
            <IonInput
              value={schoolName}
              onIonInput={(e) => setSchoolName(e.detail.value ?? '')}
              placeholder="Masukkan nama sekolah"
            />
          </IonItem>

          <IonItem lines="none">
            <IonLabel position="stacked">by Chat / Visit</IonLabel>
            <IonInput
              value={byChatVisit}
              onIonInput={(e) => setByChatVisit(e.detail.value ?? '')}
              placeholder="Chat atau Visit"
            />
          </IonItem>

          <IonItem lines="none">
            <IonLabel position="stacked">Product Offer</IonLabel>
            <IonInput
              value={productOffer}
              onIonInput={(e) => setProductOffer(e.detail.value ?? '')}
              placeholder="Produk yang ditawarkan"
            />
          </IonItem>

          <IonItem lines="none">
            <IonLabel position="stacked">Respon</IonLabel>
            <IonInput
              value={respon}
              onIonInput={(e) => setRespon(e.detail.value ?? '')}
              placeholder="Respon dari sekolah"
            />
          </IonItem>

          <IonItem lines="none">
            <IonLabel position="stacked">Status</IonLabel>
            <IonSelect
              value={combinedStatus}
              onIonChange={(e) => setCombinedStatus(e.detail.value)}
              interface="popover"
            >
              {combinedStatusOptions.map((opt) => (
                <IonSelectOption key={opt.value} value={opt.value}>
                  {opt.label}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>

          <div className="status-result-badge-row">
            <div className="status-result-badge">
              Status : {combinedStatus.replace('|', ' - ')}
            </div>
            <StatusInfoPopover />
          </div>
        </FormSectionCard>

        {/* ⏰ PREVIOUS PROJECT */}
        <FormSectionCard title="⏰ PREVIOUS PROJECT">
          <IonItem lines="none">
            <IonLabel position="stacked">Vendor</IonLabel>
            <IonInput value={prevVendor} onIonInput={(e) => setPrevVendor(e.detail.value ?? '')} />
          </IonItem>
          <IonItem lines="none">
            <IonLabel position="stacked">Harga</IonLabel>
            <IonInput value={prevHarga} onIonInput={(e) => setPrevHarga(e.detail.value ?? '')} />
          </IonItem>
          <IonItem lines="none">
            <IonLabel position="stacked">Jumlah</IonLabel>
            <IonInput value={prevJumlah} onIonInput={(e) => setPrevJumlah(e.detail.value ?? '')} />
          </IonItem>
          <IonItem lines="none">
            <IonLabel position="stacked">Spesifikasi</IonLabel>
            <IonInput value={prevSpesifikasi} onIonInput={(e) => setPrevSpesifikasi(e.detail.value ?? '')} />
          </IonItem>
          <IonItem lines="none">
            <IonLabel position="stacked">Problem</IonLabel>
            <IonTextarea value={prevProblem} onIonInput={(e) => setPrevProblem(e.detail.value ?? '')} autoGrow />
          </IonItem>
        </FormSectionCard>

        {/* 💡 NEXT PROJECT */}
        <FormSectionCard title="💡 NEXT PROJECT">
          <IonItem lines="none">
            <IonLabel position="stacked">Vendor</IonLabel>
            <IonInput value={nextVendor} onIonInput={(e) => setNextVendor(e.detail.value ?? '')} />
          </IonItem>
          <IonItem lines="none">
            <IonLabel position="stacked">Harga</IonLabel>
            <IonInput value={nextHarga} onIonInput={(e) => setNextHarga(e.detail.value ?? '')} />
          </IonItem>
          <IonItem lines="none">
            <IonLabel position="stacked">Jumlah</IonLabel>
            <IonInput value={nextJumlah} onIonInput={(e) => setNextJumlah(e.detail.value ?? '')} />
          </IonItem>
          <IonItem lines="none">
            <IonLabel position="stacked">Spesifikasi</IonLabel>
            <IonInput value={nextSpesifikasi} onIonInput={(e) => setNextSpesifikasi(e.detail.value ?? '')} />
          </IonItem>
          <IonItem lines="none">
            <IonLabel position="stacked">Harapan</IonLabel>
            <IonTextarea value={nextHarapan} onIonInput={(e) => setNextHarapan(e.detail.value ?? '')} autoGrow />
          </IonItem>
        </FormSectionCard>

        {/* 🗓 APPOINTMENT */}
        <FormSectionCard title="🗓 APPOINTMENT">
          <IonItem lines="none">
            <IonLabel position="stacked">Tanggal</IonLabel>
            <IonDatetimeButton datetime="tanggal-picker" />
            <IonModal keepContentsMounted>
              <IonDatetime
                id="tanggal-picker"
                presentation="date"
                onIonChange={(e) => {
                  const val = e.detail.value;
                  setTanggal(typeof val === 'string' ? val.split('T')[0] : '');
                }}
              />
            </IonModal>
          </IonItem>

          <IonItem lines="none">
            <IonLabel position="stacked">Jam</IonLabel>
            <IonDatetimeButton datetime="jam-picker" />
            <IonModal keepContentsMounted>
              <IonDatetime
                id="jam-picker"
                presentation="time"
                onIonChange={(e) => {
                  const val = e.detail.value;
                  setJam(typeof val === 'string' ? val : '');
                }}
              />
            </IonModal>
          </IonItem>

          <IonItem lines="none">
            <IonLabel position="stacked">Catatan</IonLabel>
            <IonTextarea value={catatan} onIonInput={(e) => setCatatan(e.detail.value ?? '')} autoGrow />
          </IonItem>
        </FormSectionCard>

        {/* 🔑 INFORMASI LAIN */}
        <FormSectionCard title="🔑 INFORMASI LAIN">
          <IonItem lines="none">
            <IonTextarea
              value={informasiLain}
              onIonInput={(e) => setInformasiLain(e.detail.value ?? '')}
              autoGrow
              rows={6}
              placeholder="Tulis informasi tambahan di sini..."
            />
          </IonItem>
        </FormSectionCard>

        {/* Bottom Buttons */}
        <div className="tambah-report-actions">
          <IonButton expand="block" fill="outline" onClick={handleBatal}>
            Batal
          </IonButton>
          <IonButton expand="block" fill="solid" onClick={handleSimpan}>
            Simpan
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default TambahReport;