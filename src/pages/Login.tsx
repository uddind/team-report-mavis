import {
  IonPage,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonText
} from "@ionic/react";

import { useState } from "react";
import { useHistory } from "react-router-dom";
import { supabase } from "../services/supabase";

const Login: React.FC = () => {

  const history = useHistory();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const handleLogin = async () => {

    const { error } = await supabase.auth.signInWithPassword({

      email,

      password,

    });

    if (error) {

      alert(error.message);

      return;

    }

    history.replace("/beranda");

  };

  return (

    <IonPage>

      <IonContent className="ion-padding">

        <h1>MRS Login</h1>

        <IonItem>

          <IonLabel position="stacked">

            Email

          </IonLabel>

          <IonInput

            type="email"

            value={email}

            onIonChange={(e)=>setEmail(e.detail.value!)}

          />

        </IonItem>

        <IonItem>

          <IonLabel position="stacked">

            Password

          </IonLabel>

          <IonInput

            type="password"

            value={password}

            onIonChange={(e)=>setPassword(e.detail.value!)}

          />

        </IonItem>

        <IonButton

          expand="block"

          onClick={handleLogin}

          className="ion-margin-top"

        >

          LOGIN

        </IonButton>

        <IonText>

          <p>

            Belum punya akun?

            <span

              style={{

                color:"#6C63FF",

                cursor:"pointer",

                marginLeft:5

              }}

              onClick={()=>history.push("/register")}

            >

              Daftar

            </span>

          </p>

        </IonText>

      </IonContent>

    </IonPage>

  );

};

export default Login;