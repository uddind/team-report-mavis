export interface Profile {
  name: string;
  email: string;
  phone: string;
  jabatan: string;
}

export function createEmptyProfile(): Profile {
  return {
    name: '',
    email: '',
    phone: '',
    jabatan: '',
  };
}