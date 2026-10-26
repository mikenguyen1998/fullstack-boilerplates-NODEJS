export function formatDate(value: string | number | Date, locale = 'en') {
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(new Date(value));
}

export function formatNumber(value: number, locale = 'en') {
  return new Intl.NumberFormat(locale).format(value);
}
