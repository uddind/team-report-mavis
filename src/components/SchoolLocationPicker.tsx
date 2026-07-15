import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { IonButton, IonIcon, useIonToast } from '@ionic/react';
import { locateOutline } from 'ionicons/icons';
import './SchoolLocationPicker.css';

// TODO: Pastikan API Key ini sudah diisi dengan benar
const GOOGLE_MAPS_API_KEY = 'PASTE_API_KEY_DISINI';

const containerStyle = {
  width: '100%',
  height: '220px',
  borderRadius: '10px',
};

const defaultCenter = {
  lat: -8.0983, // Blitar, sebagai titik tengah default
  lng: 112.1616,
};

interface SchoolLocationPickerProps {
  latitude: number | null;
  longitude: number | null;
  onChange: (lat: number, lng: number) => void;
}

const SchoolLocationPicker: React.FC<SchoolLocationPickerProps> = ({
  latitude,
  longitude,
  onChange,
}) => {
  const [presentToast] = useIonToast();
  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  const position =
    latitude !== null && longitude !== null
      ? { lat: latitude, lng: longitude }
      : defaultCenter;

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  // 🔥 EFFECT BARU: Memantau perubahan koordinat dari luar (misal saat sekolah dipilih di Autocomplete)
  useEffect(() => {
    if (mapRef.current && latitude !== null && longitude !== null) {
      const newCoords = { lat: latitude, lng: longitude };
      mapRef.current.panTo(newCoords); // Meluncur mulus ke koordinat sekolah baru
      mapRef.current.setZoom(16);     // Dekatkan fokus peta ke area sekolah
    }
  }, [latitude, longitude]);

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      onChange(e.latLng.lat(), e.latLng.lng());
    }
  };

  const handleMarkerDragEnd = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      onChange(e.latLng.lat(), e.latLng.lng());
    }
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      presentToast({
        message: 'Perangkat tidak mendukung GPS',
        duration: 2000,
        color: 'danger',
        position: 'top',
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        onChange(lat, lng);
        mapRef.current?.panTo({ lat, lng });
        mapRef.current?.setZoom(16);
      },
      () => {
        presentToast({
          message: 'Gagal mengambil lokasi. Pastikan izin GPS diaktifkan.',
          duration: 2500,
          color: 'danger',
          position: 'top',
        });
      }
    );
  };

  if (!isLoaded) {
    return <div className="location-picker-loading">Memuat peta...</div>;
  }

  return (
    <div className="school-location-picker">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={position}
        zoom={latitude !== null ? 16 : 12}
        onLoad={onMapLoad}
        onClick={handleMapClick}
      >
        <Marker
          position={position}
          draggable
          onDragEnd={handleMarkerDragEnd}
        />
      </GoogleMap>

      <IonButton
        expand="block"
        fill="outline"
        size="small"
        className="use-location-btn"
        onClick={handleUseMyLocation}
      >
        <IonIcon icon={locateOutline} slot="start" />
        Gunakan Lokasi Saya
      </IonButton>

      {latitude !== null && longitude !== null && (
        <p className="location-coords-text">
          📍 {latitude.toFixed(6)}, {longitude.toFixed(6)}
        </p>
      )}
    </div>
  );
};

export default SchoolLocationPicker;