import { useState } from 'react';
import {
  IonModal,
  IonContent,
  IonButton,
  IonIcon,
  IonInput,
  IonItem,
  IonSelect,
  IonSelectOption,
  useIonToast,
} from '@ionic/react';
import { logoGoogle, mailOutline, lockClosedOutline, briefcaseOutline } from 'ionicons/icons';
import { supabase } from '../services/supabaseClient';
import './LoginModal.css';

const jabatanOptions = ['Marketing', 'Sales Executive', 'Supervisor', 'Manager', 'Lainnya'];

interface LoginModalProps {
  isOpen: boolean;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen }) => {
  const [presentToast] = useIonToast();
  const [loading, setLoading] = useState(false);

  const [jabatan, setJabatan] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' });
  };

  const handleEmailLogin = async () => {
    if (!email.trim() || !password.trim()) {
      presentToast({ message: 'Email dan Password wajib diisi', duration: 2000, color: 'danger', position: 'top' });
      return;
    }
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setLoading(false);
      presentToast({ message: error.message, duration: 2500, color: 'danger', position: 'top' });
      return;
    }

    // Kalau user pilih Jabatan di layar login, simpan ke profil (berguna terutama
    // untuk akun yang dibuat manual oleh admin di Supabase, yang belum punya jabatan).
    if (jabatan && data.user) {
      await supabase
        .from('profiles')
        .update({ jabatan, updated_at: new Date().toISOString() })
        .eq('id', data.user.id);
    }

    setLoading(false);
  };

  return (
    <IonModal isOpen={isOpen} backdropDismiss={false} className="login-modal">
      <IonContent className="login-modal-content">
        <div className="login-modal-inner fade-in">
          <div className="login-logo">📋</div>
          <h1 className="login-title">Mavis Report System</h1>
          <p className="login-desc">Silakan masuk untuk menggunakan aplikasi.</p>

          <IonItem lines="none" className="login-field">
            <IonIcon icon={mailOutline} slot="start" className="login-field-icon" />
            <IonInput
              type="email"
              value={email}
              onIonInput={(e) => setEmail(e.detail.value ?? '')}
              placeholder="Email"
            />
          </IonItem>

          <IonItem lines="none" className="login-field">
            <IonIcon icon={lockClosedOutline} slot="start" className="login-field-icon" />
            <IonInput
              type="password"
              value={password}
              onIonInput={(e) => setPassword(e.detail.value ?? '')}
              placeholder="Password"
            />
          </IonItem>

          <IonItem lines="none" className="login-field">
            <IonIcon icon={briefcaseOutline} slot="start" className="login-field-icon" />
            <IonSelect
              value={jabatan}
              onIonChange={(e) => setJabatan(e.detail.value)}
              interface="popover"
              placeholder="Pilih Jabatan"
            >
              {jabatanOptions.map((j) => (
                <IonSelectOption key={j} value={j}>
                  {j}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>

          <IonButton expand="block" className="primary-btn" onClick={handleEmailLogin} disabled={loading}>
            MASUK
          </IonButton>

          <div className="login-divider">
            <span>atau</span>
          </div>

          <IonButton expand="block" className="google-btn" onClick={handleGoogleLogin}>
            <IonIcon icon={logoGoogle} slot="start" />
            MASUK DENGAN GOOGLE
          </IonButton>
        </div>
      </IonContent>
    </IonModal>
  );
};

export default LoginModal;