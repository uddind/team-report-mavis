import { supabase } from './supabaseClient';
import type { Profile } from '../types/Profile';
import { createEmptyProfile } from '../types/Profile';

export async function getProfile(): Promise<Profile> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return createEmptyProfile();

  const { data, error } = await supabase
    .from('profiles')
    .select('full_name, email, phone, area, jabatan')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('getProfile error:', error);
  }

  console.log(data);

  return {
    name: data?.full_name ?? '',
    email: data?.email ?? user.email ?? '',
    phone: data?.phone ?? '',
    area: data?.area ?? '', // kolom database tetap 'area'
    jabatan: data?.jabatan ?? '',
  };
}

export async function saveProfile(profile: Profile): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Belum login');

  const { error } = await supabase.from('profiles').upsert({
    id: user.id,
    full_name: profile.name,
    email: profile.email,
    phone: profile.phone,
    area: profile.area, // simpan nilai 'area' ke kolom 'area' yang sudah ada
    updated_at: new Date().toISOString(),
  });

  if (error) {
    console.error('saveProfile error:', error);
    throw error;
  }
}