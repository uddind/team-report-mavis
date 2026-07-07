import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
  IonSpinner,
  useIonRouter,
  useIonToast,
} from '@ionic/react';
import Header from '../components/Header';
import FormSectionCard from '../components/FormSectionCard';
import StatusInfoPopover from '../components/StatusInfoPopover';
import SchoolAutocomplete from '../components/SchoolAutocomplete';
import ComboPriceInput from '../components/ComboPriceInput';
import type { Report } from '../types/Report';
import { getReportById, updateReport } from '../services/reportService';
import { combinedStatusOptions, combineStatus, splitStatus } from '../utils/statusOptions';
import './EditReport.css';

const EditReport: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const router = useIonRouter();
  const [presentToast] = useIonToast();

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [originalCreatedAt, setOriginalCreatedAt] = useState('');
  const [originalNextVendor, setOriginalNextVendor] = useState('');

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

  // Next Project (tanpa Vendor di form, tapi tetap disimpan dari data lama)
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

  useEffect(() => {
    const loadReport = async () => {
      setLoading(true);
      const existing = await getReportById(id);

      if (!existing) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setSchoolName(existing.schoolName);
      setByChatVisit(existing.byChatVisit);
      setProductOffer(existing.productOffer);
      setRespon(existing.respon);
      setCombinedStatus(combineStatus(existing.statusCode, existing.statusTemperature));

      setPrevVendor(existing.previousProject.vendor);
      setPrevHarga(existing.previousProject.harga);
      setPrevJumlah(existing.previousProject.jumlah);
      setPrevSpesifikasi(existing.previousProject.spesifikasi);
      setPrevProblem(existing.previousProject.problem);

      setOriginalNextVendor(existing.nextProject.vendor);
      setNextHarga(existing.nextProject.harga);
      setNextJumlah(existing.nextProject.jumlah);
      setNextSpesifikasi(existing.nextProject.spesifikasi);
      setNextHarapan(existing.nextProject.harapan);

      setTanggal(existing.appointment.tanggal);
      setJam(existing.appointment.jam);
      setCatatan(existing.appointment.catatan);

      setInformasiLain(existing.informasiLain);
      setOriginalCreatedAt(existing.createdAt);

      setLoading(false);
    };

    loadReport();
  }, [id]);

  const handleBatal = () => {
    router.push(`/detail-report/${id}`);
  };

  const handleSimpanPerubahan = async () => {
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

    const updatedReport: Report = {
      id: id ?? Date.now().toString(),
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
        vendor: originalNextVendor,
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
      createdAt: originalCreatedAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await updateReport(updatedReport);

    presentToast({
      message: 'Perubahan berhasil disimpan',
      duration: 2000,
      color: 'success',
      position: 'top',
    });

    router.push(`/detail-report/${id}`);
  };

  if (loading) {
    return (
      <IonPage>
        <Header />
        <IonContent fullscreen className="edit-report-content">
          <div className="loading-state">
            <IonSpinner name="crescent" />
          </div>
        </IonContent>
      </IonPage>
    );
  }

  if (notFound) {
    return (
      <IonPage>
        <Header />
        <IonContent fullscreen className="edit-report-content">
          <p className="empty-state">Report tidak ditemukan.</p>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <Header />
      <IonContent fullscreen className="edit-report-content">
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
            />
          </IonItem>
          <IonItem lines="none">
            <IonLabel position="stacked">Spesifikasi</IonLabel>
            <input
              className="plain-text-input"
              value={prevSpesifikasi}
              onChange={(e) => setPrevSpesifikasi(e.target.value)}
            />
          </IonItem>
          <IonItem lines="none">
            <IonLabel position="stacked">Problem</IonLabel>
            <IonTextarea value={prevProblem} onIonInput={(e) => setPrevProblem(e.detail.value ?? '')} autoGrow />
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
            />
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
            <IonDatetimeButton datetime="edit-tanggal-picker" />
            <IonModal keepContentsMounted>
              <IonDatetime
                id="edit-tanggal-picker"
                presentation="date"
                value={tanggal || undefined}
                onIonChange={(e) => {
                  const val = e.detail.value;
                  setTanggal(typeof val === 'string' ? val.split('T')[0] : '');
                }}
              />
            </IonModal>
          </IonItem>

          <IonItem lines="none">
            <IonLabel position="stacked">Jam</IonLabel>
            <IonDatetimeButton datetime="edit-jam-picker" />
            <IonModal keepContentsMounted>
              <IonDatetime
                id="edit-jam-picker"
                presentation="time"
                value={jam || undefined}
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
        <div className="edit-report-actions">
          <IonButton expand="block" fill="outline" onClick={handleBatal}>
            Batal
          </IonButton>
          <IonButton expand="block" fill="solid" onClick={handleSimpanPerubahan}>
            Simpan Perubahan
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default EditReport;