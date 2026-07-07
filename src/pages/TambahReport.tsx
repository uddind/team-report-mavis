import { useState } from 'react';
import {
  IonContent,
  IonPage,
  IonItem,
  IonLabel,
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
import SchoolAutocomplete from '../components/SchoolAutocomplete';
import ComboPriceInput from '../components/ComboPriceInput';
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

  // Next Project (tanpa Vendor)
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
        {/* 🏫 INFORMASI SEKOLAH */}
        <FormSectionCard title="🏫 INFORMASI SEKOLAH">
          <IonItem lines="none" className="school-name-item">
            <IonLabel position="stacked">Nama Sekolah</IonLabel>
            <SchoolAutocomplete value={schoolName} onChange={setSchoolName} />
          </IonItem>

          <IonItem lines="none">
            <IonLabel position="stacked">by Chat / Visit</IonLabel>
            <input
              className="plain-text-input"
              value={byChatVisit}
              onChange={(e) => setByChatVisit(e.target.value)}
              placeholder="Chat atau Visit"
            />
          </IonItem>

          <IonItem lines="none">
            <IonLabel position="stacked">Product Offer</IonLabel>
            <input
              className="plain-text-input"
              value={productOffer}
              onChange={(e) => setProductOffer(e.target.value)}
              placeholder="Produk yang ditawarkan"
            />
          </IonItem>

          <IonItem lines="none">
            <IonLabel position="stacked">Respon</IonLabel>
            <input
              className="plain-text-input"
              value={respon}
              onChange={(e) => setRespon(e.target.value)}
              placeholder="Respon dari sekolah"
            />
          </IonItem>

          <div className="status-label-row">
            <span className="status-label-text">Status</span>
            <StatusInfoPopover />
          </div>
          <IonItem lines="none">
            <IonSelect
              value={combinedStatus}
              onIonChange={(e) => setCombinedStatus(e.detail.value)}
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
        </FormSectionCard>

        {/* ⏰ PREVIOUS PROJECT */}
        <FormSectionCard title="⏰ PREVIOUS PROJECT">
          <IonItem lines="none">
            <IonLabel position="stacked">Vendor</IonLabel>
            <input
              className="plain-text-input"
              value={prevVendor}
              onChange={(e) => setPrevVendor(e.target.value)}
              placeholder="Contoh: MAVIS"
            />
          </IonItem>
          <IonItem lines="none">
            <IonLabel position="stacked">Harga</IonLabel>
            <ComboPriceInput value={prevHarga} onChange={setPrevHarga} />
          </IonItem>
          <IonItem lines="none">
            <IonLabel position="stacked">Jumlah</IonLabel>
            <input
              className="plain-text-input"
              value={prevJumlah}
              onChange={(e) => setPrevJumlah(e.target.value)}
              placeholder="Contoh: 1.650 eks"
            />
          </IonItem>
          <IonItem lines="none">
            <IonLabel position="stacked">Spesifikasi</IonLabel>
            <input
              className="plain-text-input"
              value={prevSpesifikasi}
              onChange={(e) => setPrevSpesifikasi(e.target.value)}
              placeholder="Contoh: uk 44 x 64 cm, 1 bulanan, 6 lembar, spiral hanger, include sesi foto"
            />
          </IonItem>
          <IonItem lines="none">
            <IonLabel position="stacked">Problem</IonLabel>
            <IonTextarea
              value={prevProblem}
              onIonInput={(e) => setPrevProblem(e.detail.value ?? '')}
              autoGrow
              placeholder="Contoh: Kualitas cetak kurang tajam"
            />
          </IonItem>
        </FormSectionCard>

        {/* 💡 NEXT PROJECT (tanpa Vendor) */}
        <FormSectionCard title="💡 NEXT PROJECT">
          <IonItem lines="none">
            <IonLabel position="stacked">Spesifikasi</IonLabel>
            <input
              className="plain-text-input"
              value={nextSpesifikasi}
              onChange={(e) => setNextSpesifikasi(e.target.value)}
              placeholder="Contoh: uk 44 x 64 cm, 1 bulanan, 6 lembar, spiral hanger, include sesi foto (masih sama seperti tahun lalu)"
            />
          </IonItem>
          <IonItem lines="none">
            <IonLabel position="stacked">Harga</IonLabel>
            <ComboPriceInput value={nextHarga} onChange={setNextHarga} />
          </IonItem>
          <IonItem lines="none">
            <IonLabel position="stacked">Jumlah</IonLabel>
            <input
              className="plain-text-input"
              value={nextJumlah}
              onChange={(e) => setNextJumlah(e.target.value)}
              placeholder="Contoh: 1.650 eks"
            />
          </IonItem>
          <IonItem lines="none">
            <IonLabel position="stacked">Harapan</IonLabel>
            <IonTextarea
              value={nextHarapan}
              onIonInput={(e) => setNextHarapan(e.detail.value ?? '')}
              autoGrow
              placeholder="Contoh: Kualitas cetak lebih baik dari sebelumnya"
            />
          </IonItem>
        </FormSectionCard>

        {/* 🗓 APPOINTMENT */}
        <FormSectionCard title="🗓 APPOINTMENT">
          <IonItem lines="none">
            <IonLabel position="stacked">Tanggal</IonLabel>
            <div className="datetime-box">
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
                  onIonChange={(e) => {
                    const val = e.detail.value;
                    setJam(typeof val === 'string' ? val : '');
                  }}
                />
              </IonModal>
            </div>
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