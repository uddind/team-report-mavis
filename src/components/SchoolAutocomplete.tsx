// src/components/SchoolAutocomplete.tsx
import { useState, useEffect, useImperativeHandle, forwardRef, useCallback } from 'react';
import { IonInput, IonList, IonItem, IonLabel } from "@ionic/react";
import { supabase } from '../services/supabaseClient';

interface SchoolAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
}

export interface SchoolAutocompleteRef {
  refetch: (forcedQuery?: string) => void;
}

const SchoolAutocomplete = forwardRef<SchoolAutocompleteRef, SchoolAutocompleteProps>(
  ({ value, onChange }, ref) => {
    const [query, setQuery] = useState(value);
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const fetchSchools = useCallback(async (searchQuery: string) => {
      const normalized = searchQuery?.trim();
      if (!normalized) {
        setSuggestions([]);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('sekolah')
          .select('nama_sekolah, city_name, district_name')
          .ilike('nama_sekolah', `%${normalized}%`)
          .order('nama_sekolah', { ascending: true })
          .limit(8);

        if (error) throw error;

        if (data) {
          const normalizedInput = normalized.toLowerCase();
          const exactMatch = data.find((item: any) => item.nama_sekolah?.toLowerCase() === normalizedInput);
          const ranked = exactMatch
            ? [exactMatch, ...data.filter((item: any) => item.nama_sekolah?.toLowerCase() !== normalizedInput)]
            : data;

          setSuggestions(ranked);
          setShowSuggestions(true);
        }
      } catch (err) {
        console.error('Gagal memuat sekolah:', err);
      }
    }, []);

    // Sinkronkan input dari parent, lalu cari sekolah yang sesuai
    useEffect(() => {
      if (value !== query) {
        setQuery(value);
      }

      if (value?.trim()) {
        setShowSuggestions(true);
        void fetchSchools(value);
      }
    }, [value, query, fetchSchools]);

    useEffect(() => {
      if (!value?.trim()) {
        setSuggestions([]);
        return;
      }

      if (query !== value) {
        return;
      }

      const delayDebounceFn = setTimeout(() => {
        void fetchSchools(value);
      }, 300);

      return () => clearTimeout(delayDebounceFn);
    }, [value, query, fetchSchools]);

    useImperativeHandle(ref, () => ({
      refetch: (forcedQuery?: string) => {
        const targetSearch = forcedQuery || query;
        void fetchSchools(targetSearch);
      }
    }));

    // Debounce listener yang aman dari loop re-render
    useEffect(() => {
      if (!query || query === value) {
        if (!query) setSuggestions([]);
        return;
      }

      const delayDebounceFn = setTimeout(() => {
        void fetchSchools(query);
      }, 400);

      return () => clearTimeout(delayDebounceFn);
    }, [query, value]);

    const handleSelectSchool = (schoolName: string) => {
      setQuery(schoolName);
      onChange(schoolName);
      setShowSuggestions(false);
      void fetchSchools(schoolName);
    };

    return (
      <div style={{ position: 'relative', width: '100%' }}>
        <IonInput
          value={query}
          placeholder="Cari atau ketik nama sekolah..."
          onIonInput={(e: CustomEvent) => {
            const val = e.detail.value ?? '';
            setQuery(val);
            onChange(val);
            setShowSuggestions(true);
            void fetchSchools(val);
          }}
          onIonFocus={() => {
            setShowSuggestions(true);
            if (query) {
              void fetchSchools(query);
            }
          }}
          onIonBlur={() => setTimeout(() => setShowSuggestions(false), 250)}
        />

        {showSuggestions && suggestions.length > 0 && (
          <IonList style={{
            position: 'absolute',
            top: '100%', left: 0, right: 0,
            maxHeight: '200px', overflowY: 'auto',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            background: 'var(--ion-background-color, #fff)',
            zIndex: 9999
          }}>
            {suggestions.map((school, index) => (
              <IonItem 
                button 
                key={index} 
                lines="full"
                onMouseDown={() => handleSelectSchool(school.nama_sekolah)}
              >
                <IonLabel>
                  <h2 style={{ fontSize: '15px', fontWeight: '500' }}>{school.nama_sekolah}</h2>
                  <p style={{ fontSize: '13px', color: '#666' }}>
                    {school.district_name ? `${school.district_name}, ` : ''}{school.city_name}
                  </p>
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