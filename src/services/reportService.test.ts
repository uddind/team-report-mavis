import { describe, expect, it } from 'vitest';
import { normalizeAppointmentDate } from './reportService';

describe('normalizeAppointmentDate', () => {
  it('returns null for invalid date text', () => {
    expect(normalizeAppointmentDate('f')).toBeNull();
  });

  it('converts dd/mm/yyyy into yyyy-mm-dd', () => {
    expect(normalizeAppointmentDate('21/07/2026')).toBe('2026-07-21');
  });
});
