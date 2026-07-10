export interface Profile {
  name: string;
  email: string;
  phone: string;
  area: string;
  jabatan?: string; // optional property for backward compatibility
}

export function createEmptyProfile(): Profile {
  return {
    name: '',
    email: '',
    phone: '',
    area: '',
    jabatan: '', // initialize as empty string for backward compatibility
  };
}