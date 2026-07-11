export interface Profile {
  name: string;
  email: string;
  phone: string;
  area: string;
  jabatan: string;
}

export function createEmptyProfile(): Profile {
  return {
    name: '',
    email: '',
    phone: '',
    area: '',
    jabatan: '',
  };
}