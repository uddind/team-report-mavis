import { useState } from 'react';
import {
  IonModal,
  IonContent,
  IonButton,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  useIonToast,
} from '@ionic/react';
import { logoGoogle, mailOutline, lockClosedOutline, personOutline } from 'ionicons/icons';
import { supabase } from '../services/supabaseClient';
import './LoginModal.css';

type Mode = 'login' | 'register';

interface LoginModalProps {
  isOpen: boolean;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen }) => {
  const [presentToast] = useIonToast();
  const [mode, setMode] = useState<Mode>('login');
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');
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
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      presentToast({ message: error.message, duration: 2500, color: 'danger', position: 'top' });
    }
  };

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      presentToast({ message: 'Semua field wajib diisi', duration: 2000, color: 'danger', position: 'top' });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    setLoading(false);
    if (error) {
      presentToast({ message: error.message, duration: 2500, color: 'danger', position: 'top' });
      return;
    }
    presentToast({ message: 'Akun berhasil dibuat! Silakan masuk.', duration: 2500, color: 'success', position: 'top' });
    setMode('login');
  };

  return (
    <IonModal isOpen={isOpen} backdropDismiss={false} className="login-modal">
      <IonContent className="login-modal-content">
        <div className="login-modal-inner fade-in">
          <div className="login-logo">📋</div>
          <h1 className="login-title">Mavis Report System</h1>
          <p className="login-desc">
            {mode === 'login'
              ? 'Silakan masuk untuk menggunakan aplikasi.'
              : 'Buat akun baru untuk mulai menggunakan aplikasi.'}
          </p>

          <IonButton expand="block" className="google-btn" onClick={handleGoogleLogin}>
            <IonIcon icon={logoGoogle} slot="start" />
            Masuk dengan Google
          </IonButton>

          <div className="login-divider">
            <span>atau</span>
          </div>

          {mode === 'register' && (
            <IonItem lines="none" className="login-field">
              <IonIcon icon={personOutline} slot="start" className="login-field-icon" />
              <IonInput
                value={name}
                onIonInput={(e) => setName(e.detail.value ?? '')}
                placeholder="Nama Lengkap"
              />
            </IonItem>
          )}

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

          {mode === 'login' ? (
            <IonButton expand="block" className="primary-btn" onClick={handleEmailLogin} disabled={loading}>
              Masuk
            </IonButton>
          ) : (
            <IonButton expand="block" className="primary-btn" onClick={handleRegister} disabled={loading}>
              Daftar
            </IonButton>
          )}

          <p className="login-switch">
            {mode === 'login' ? (
              <>
                Belum punya akun?{' '}
                <span onClick={() => setMode('register')}>Daftar di sini</span>
              </>
            ) : (
              <>
                Sudah punya akun?{' '}
                <span onClick={() => setMode('login')}>Masuk di sini</span>
              </>
            )}
          </p>
        </div>
      </IonContent>
    </IonModal>
  );
};

export default LoginModal;