import { useState, useEffect } from 'react';
import {
  IonContent,
  IonPage,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  IonSpinner,
  useIonRouter,
  useIonToast,
} from '@ionic/react';
import { arrowBackOutline, personCircleOutline } from 'ionicons/icons';
import FormSectionCard from '../components/FormSectionCard';
import type { Profile } from '../types/Profile';
import { getProfile, saveProfile } from '../services/profileService';
import './Profile.css';

const ProfilePage: React.FC = () => {
  const router = useIonRouter();
  const [presentToast] = useIonToast();

  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [jabatan, setJabatan] = useState('');

  useEffect(() => {
    const load = async () => {
      const data = await getProfile();
      setName(data.name);
      setEmail(data.email);
      setPhone(data.phone);
      setJabatan(data.jabatan);
      setLoading(false);
    };
    load();
  }, []);

  const handleBack = () => {
    router.goBack();
  };

  const handleSave = async () => {
    const profile: Profile = { name, email, phone, jabatan };
    await saveProfile(profile);

    presentToast({
      message: 'Profil berhasil disimpan',
      duration: 2000,
      color: 'success',
      position: 'top',
    });
  };

  const initial = name.trim() ? name.trim()[0].toUpperCase() : '';

  return (
    <IonPage>
      <IonContent fullscreen className="profile-content">
        <div className="profile-back-row">
          <IonButton fill="clear" size="small" onClick={handleBack}>
            <IonIcon icon={arrowBackOutline} slot="start" />
            Kembali
          </IonButton>
        </div>

        <div className="profile-avatar-section">
          {initial ? (
            <div className="profile-avatar-circle">{initial}</div>
          ) : (
            <IonIcon icon={personCircleOutline} className="profile-avatar-placeholder" />
          )}
          <p className="profile-avatar-name">{name || 'Nama Belum Diisi'}</p>
          <p className="profile-avatar-role">{jabatan || 'Jabatan belum diisi'}</p>
        </div>

        {loading ? (
          <div className="loading-state">
            <IonSpinner name="crescent" />
          </div>
        ) : (
          <>
            <FormSectionCard title="👤 INFORMASI PROFIL">
              <IonItem lines="none">
                <IonLabel position="stacked">Nama Lengkap</IonLabel>
                <IonInput
                  value={name}
                  onIonInput={(e) => setName(e.detail.value ?? '')}
                  placeholder="Masukkan nama lengkap"
                />
              </IonItem>

              <IonItem lines="none">
                <IonLabel position="stacked">Email</IonLabel>
                <IonInput
                  type="email"
                  value={email}
                  onIonInput={(e) => setEmail(e.detail.value ?? '')}
                  placeholder="nama@email.com"
                />
              </IonItem>

              <IonItem lines="none">
                <IonLabel position="stacked">No. Telepon</IonLabel>
                <IonInput
                  type="tel"
                  value={phone}
                  onIonInput={(e) => setPhone(e.detail.value ?? '')}
                  placeholder="08xxxxxxxxxx"
                />
              </IonItem>

              <IonItem lines="none">
                <IonLabel position="stacked">Jabatan</IonLabel>
                <IonInput
                  value={jabatan}
                  onIonInput={(e) => setJabatan(e.detail.value ?? '')}
                  placeholder="Contoh: Sales Executive"
                />
              </IonItem>
            </FormSectionCard>

            <div className="profile-actions">
              <IonButton expand="block" fill="solid" onClick={handleSave}>
                Simpan Profil
              </IonButton>
            </div>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default ProfilePage;