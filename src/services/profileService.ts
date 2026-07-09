import { supabase } from './supabaseClient';
import type { Profile } from '../types/Profile';

export async function getProfile(): Promise<Profile> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { name: '', email: '', phone: '', jabatan: '' };

  const { data } = await supabase
    .from('profiles')
    .select('full_name, email, phone, jabatan')
    .eq('id', user.id)
    .single();

  return {
    name: data?.full_name ?? '',
    email: data?.email ?? user.email ?? '',
    phone: data?.phone ?? '',
    jabatan: data?.jabatan ?? '',
  };
}

export async function saveProfile(profile: Profile): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Belum login');

  await supabase.from('profiles').upsert({
    id: user.id,
    full_name: profile.name,
    email: profile.email,
    phone: profile.phone,
    jabatan: profile.jabatan,
    updated_at: new Date().toISOString(),
  });
}