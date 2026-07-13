import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { IonInput, IonList, IonItem, IonLabel } from "@ionic/react";
import { supabase } from '../services/supabaseClient';

interface SchoolAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
}

const SchoolAutocomplete = forwardRef<{ refetch: (forcedQuery?: string) => void }, SchoolAutocompleteProps>(
  ({ value, onChange }, ref) => {
    const [query, setQuery] = useState(value);
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
      setQuery(value);
    }, [value]);

    // Fungsi utama untuk mengambil data dari Supabase berdasarkan apa yang diketik
    const fetchSchools = async (searchQuery: string) => {
      if (!searchQuery || searchQuery.trim().length < 1) {
        setSuggestions([]);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('sekolah')
          .select('nama_sekolah, kab_kota, kecamatan')
          .ilike('nama_sekolah', `%${searchQuery.trim()}%`)
          .limit(5);

        if (error) throw error;
        if (data) setSuggestions(data);
      } catch (err) {
        console.error('Gagal memuat sekolah:', err);
      }
    };

    // Menerima parameter string paksaan (forcedQuery) dari TambahReport
    useImperativeHandle(ref, () => ({
      refetch: (forcedQuery?: string) => {
        const targetSearch = forcedQuery || query;
        fetchSchools(targetSearch);
      }
    }));

    useEffect(() => {
      const delayDebounceFn = setTimeout(() => {
        fetchSchools(query);
      }, 300);

      return () => clearTimeout(delayDebounceFn);
    }, [query]);

    const handleSelectSchool = (schoolName: string) => {
      setQuery(schoolName);
      onChange(schoolName);
      setShowSuggestions(false);
    };

    return (
      <div style={{ position: 'relative', width: '100%', zIndex: 100 }}>
        <IonInput
          value={query}
          placeholder="Cari atau ketik nama sekolah..."
          onIonInput={(e: any) => { // 🔥 PERBAIKAN: Menggunakan tipe data 'any' untuk menghindari eror linting TypeScript
            const val = e.detail.value ?? '';
            setQuery(val);
            onChange(val);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        />

        {showSuggestions && suggestions.length > 0 && (
          <IonList style={{
            position: 'absolute',
            top: '100%', left: 0, right: 0,
            maxHeight: '200px', overflowY: 'auto',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            background: 'var(--ion-background-color, #fff)',
            zIndex: 999
          }}>
            {suggestions.map((school, index) => (
              <IonItem button key={index} onMouseDown={() => handleSelectSchool(school.nama_sekolah)}>
                <IonLabel>
                  <h2>{school.nama_sekolah}</h2>
                  <p>{school.kecamatan ? `${school.kecamatan}, ` : ''}{school.kab_kota}</p>
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
        )}
      </div>
    );
  }
);

SchoolAutocomplete.displayName = 'SchoolAutocomplete';
export default SchoolAutocomplete;