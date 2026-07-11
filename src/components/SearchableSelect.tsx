import React, { useEffect, useRef, useState } from 'react';
import { IonIcon } from '@ionic/react';
import {
  chevronDownOutline,
  searchOutline,
  closeCircle,
} from 'ionicons/icons';

interface SearchableSelectProps {
  options: string[];
  value: string;
  placeholder: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  placeholder,
  disabled = false,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const selectOption = (option: string) => {
    onChange(option);
    setSearch('');
    setIsOpen(false);
  };

  const clearValue = (event: React.MouseEvent) => {
    event.stopPropagation();
    onChange('');
    setSearch('');
  };

  return (
    <div
      className={`searchable-select ${disabled ? 'disabled' : ''}`}
      ref={wrapperRef}
    >
      <div
        className="searchable-select-control"
        onClick={() => {
          if (!disabled) {
            setIsOpen(!isOpen);
          }
        }}
      >
        <IonIcon icon={searchOutline} />

        <span className={value ? 'selected-value' : 'placeholder'}>
          {value || placeholder}
        </span>

        {value ? (
          <IonIcon
            icon={closeCircle}
            className="clear-icon"
            onClick={clearValue}
          />
        ) : (
          <IonIcon icon={chevronDownOutline} />
        )}
      </div>

      {isOpen && !disabled && (
        <div className="searchable-select-dropdown">
          <div className="search-box">
            <IonIcon icon={searchOutline} />

            <input
              type="text"
              autoFocus
              value={search}
              placeholder="Cari..."
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="options-list">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  type="button"
                  key={option}
                  className={`option-item ${
                    value === option ? 'active' : ''
                  }`}
                  onClick={() => selectOption(option)}
                >
                  {option}
                </button>
              ))
            ) : (
              <div className="no-result">
                Data tidak ditemukan
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;