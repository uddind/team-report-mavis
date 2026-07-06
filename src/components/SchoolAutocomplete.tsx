import { useState } from 'react';
import { IonInput } from '@ionic/react';
import { blitarSchools } from '../utils/blitarSchools';
import './SchoolAutocomplete.css';

interface SchoolAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
}

const SchoolAutocomplete: React.FC<SchoolAutocompleteProps> = ({ value, onChange }) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleInput = (val: string) => {
    onChange(val);
    if (val.trim().length > 0) {
      const filtered = blitarSchools.filter((s) =>
        s.toLowerCase().includes(val.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 6));
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSelect = (school: string) => {
    onChange(school);
    setShowSuggestions(false);
  };

  return (
    <div className="school-autocomplete-wrapper">
      <IonInput
        value={value}
        onIonInput={(e) => handleInput(e.detail.value ?? '')}
        onIonBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
        placeholder="Masukkan nama sekolah"
      />
      {showSuggestions && (
        <div className="school-suggestions-list">
          {suggestions.map((s) => (
            <div key={s} className="school-suggestion-item" onMouseDown={() => handleSelect(s)}>
              {s}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SchoolAutocomplete;