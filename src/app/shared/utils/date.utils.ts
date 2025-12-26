/**
 * Utility functions for date handling including Solar Hijri calendar support
 * Note: This is a stub implementation. For production, use a proper library like moment-jalaali
 */

export interface DualDate {
  gregorian: string;
  solar: string;
}

export function formatDate(date: string | Date, locale: string = 'en'): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  if (locale === 'en') {
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  // For Pashto/Dari, use Persian locale
  return d.toLocaleDateString('fa-AF', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function toSolarHijri(gregorianDate: string): string {
  // Stub implementation - in production, use moment-jalaali or similar
  const date = new Date(gregorianDate);
  const year = date.getFullYear() - 621; // Approximate conversion
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}/${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}`;
}

export function fromSolarHijri(solarDate: string): string {
  // Stub implementation - in production, use moment-jalaali or similar
  const [year, month, day] = solarDate.split('/').map(Number);
  const gregorianYear = year + 621; // Approximate conversion

  return `${gregorianYear}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
}

export function getDualDate(gregorianDate: string): DualDate {
  return {
    gregorian: gregorianDate,
    solar: toSolarHijri(gregorianDate),
  };
}

export function formatDualDate(date: string, locale: string = 'en'): string {
  const dual = getDualDate(date);

  if (locale === 'en') {
    return `${formatDate(dual.gregorian, 'en')} (${dual.solar} SH)`;
  }

  return `${dual.solar} (${formatDate(dual.gregorian, locale)})`;
}
