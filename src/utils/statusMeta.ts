import type { StatusCode } from '../types/Report';

export interface StatusMeta {
  code: StatusCode;
  emoji: string;
  color: string;
  bgColor: string;
  title: string;
  description: string;
}

export const statusMetaMap: Record<StatusCode, StatusMeta> = {
  OF: {
    code: 'OF',
    emoji: '🟢',
    color: '#22C55E',
    bgColor: '#DCFCE7',
    title: 'Offer',
    description: 'Penawaran awal kepada sekolah. Prospek masih dalam tahap awal.',
  },
  FU1: {
    code: 'FU1',
    emoji: '🟡',
    color: '#F59E0B',
    bgColor: '#FEF3C7',
    title: 'Follow Up Pertama',
    description: 'Sekolah masih mempertimbangkan.',
  },
  FU2: {
    code: 'FU2',
    emoji: '🟠',
    color: '#FB923C',
    bgColor: '#FFEDD5',
    title: 'Follow Up Kedua',
    description: 'Follow up lanjutan sebelum closing.',
  },
  C: {
    code: 'C',
    emoji: '🔵',
    color: '#2563EB',
    bgColor: '#DBEAFE',
    title: 'Closing',
    description: 'Kerja sama berhasil.',
  },
  ND: {
    code: 'ND',
    emoji: '🔴',
    color: '#EF4444',
    bgColor: '#FEE2E2',
    title: 'No Deal',
    description: 'Tidak lanjut.',
  },
};

export function getStatusMeta(code: StatusCode): StatusMeta {
  return statusMetaMap[code];
}