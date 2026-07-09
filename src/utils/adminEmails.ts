// Daftar email yang dianggap Admin.
// Tambahkan/kurangi email di sini sesuai kebutuhan.
export const ADMIN_EMAILS: string[] = [
  'admin@gmail.com',
];

export function isAdminEmail(email: string | undefined | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}