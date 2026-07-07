import type { StatusCode, StatusTemperature } from '../types/Report';
import { statusMetaMap } from './statusMeta';

export const statusCodes: StatusCode[] = ['OF', 'FU1', 'FU2', 'C', 'ND'];
export const statusTemperatures: StatusTemperature[] = ['Cold', 'Warm', 'Hot'];

export interface CombinedStatusOption {
  value: string;
  label: string;
  statusCode: StatusCode;
  statusTemperature: StatusTemperature;
}

export const combinedStatusOptions: CombinedStatusOption[] = statusCodes.flatMap((code) =>
  statusTemperatures.map((temp) => ({
    value: `${code}|${temp}`,
    label: `${statusMetaMap[code].emoji} ${code} - ${temp}`,
    statusCode: code,
    statusTemperature: temp,
  }))
);

export function combineStatus(code: StatusCode, temp: StatusTemperature): string {
  return `${code}|${temp}`;
}

export function splitStatus(value: string): {
  statusCode: StatusCode;
  statusTemperature: StatusTemperature;
} {
  const [code, temp] = value.split('|');
  return {
    statusCode: code as StatusCode,
    statusTemperature: temp as StatusTemperature,
  };
}