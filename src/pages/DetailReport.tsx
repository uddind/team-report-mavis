import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { IonContent, IonPage, IonButton, IonIcon, IonSpinner, useIonRouter, useIonViewWillEnter } from '@ionic/react';
import { createOutline, arrowBackOutline } from 'ionicons/icons';
import Header from '../components/Header';
import type { Report } from '../types/Report';
import { getReportById } from '../services/reportService';
import './DetailReport.css';

const DetailReport: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const router = useIonRouter();

  const [report, setReport] = useState<Report | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useIonViewWillEnter(() => {
    setLoading(true);
    getReportById(id).then((data) => {
      setReport(data);
      setLoading(false);
    });
  });

  const handleEdit = () => {
    router.push(`/edit-report/${id}`);
  };

  const handleBack = () => {
    router.goBack();
  };

  if (loading) {
    return (
      <IonPage>
        <Header />
        <IonContent fullscreen className="detail-report-content">
          <div className="loading-state">
            <IonSpinner name="crescent" />
          </div>
        </IonContent>
      </IonPage>
    );
  }

  if (!report) {
    return (
      <IonPage>
        <Header />
        <IonContent fullscreen className="detail-report-content">
          <p className="empty-state">Report tidak ditemukan.</p>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <Header />
      <IonContent fullscreen className="detail-report-content">
        <div className="detail-back-row">
          <IonButton fill="clear" size="small" onClick={handleBack}>
            <IonIcon icon={arrowBackOutline} slot="start" />
            Kembali
          </IonButton>
        </div>

        <div className="detail-report-box">
          <h2 className="detail-section-title">🏫 {report.schoolName.toUpperCase()}</h2>
          <p>- by Chat / Visit : {report.byChatVisit}</p>
          <p>- Product Offer : {report.productOffer}</p>
          <p>- Respon : {report.respon}</p>
          <p>
            - Status : {report.statusCode} - {report.statusTemperature}
          </p>

          <h2 className="detail-section-title">⏰ PREVIOUS PROJECT</h2>
          <p>- Vendor : {report.previousProject.vendor}</p>
          <p>- Harga : {report.previousProject.harga}</p>
          <p>- Jumlah : {report.previousProject.jumlah}</p>
          <p>- Spesifikasi : {report.previousProject.spesifikasi}</p>
          <p>&nbsp;</p>
          <p>- Problem : {report.previousProject.problem}</p>

          <h2 className="detail-section-title">💡 NEXT PROJECT</h2>
          <p>- Spesifikasi : {report.nextProject.spesifikasi}</p>
          <p>- Harga : {report.nextProject.harga}</p>
          <p>- Jumlah : {report.nextProject.jumlah}</p>
          <p>&nbsp;</p>
          <p>- Harapan : {report.nextProject.harapan}</p>

          <h2 className="detail-section-title">🗓 APPOINTMENT</h2>
          <p>- Tanggal : {report.appointment.tanggal}</p>
          <p>- Jam : {report.appointment.jam}</p>
          <p>- Catatan : {report.appointment.catatan}</p>

          <h2 className="detail-section-title">🔑 INFORMASI LAIN :</h2>
          <p>- {report.informasiLain}</p>
        </div>

        <div className="detail-report-actions">
          <IonButton expand="block" fill="solid" onClick={handleEdit}>
            <IonIcon icon={createOutline} slot="start" />
            Edit Report
          </IonButton>
        </div>

      <div className="detail-back-row">
          <button className="modern-back-btn" onClick={handleBack}>
            <IonIcon icon={arrowBackOutline} />
            Kembali
          </button>
        </div>

      </IonContent>
    </IonPage>
  );
};

export default DetailReport;