// Unified date helpers using Moment.js when available; falls back to native Date otherwise.
// This keeps the app consistent without hard dependency issues.

let moment = null;
try {
  // eslint-disable-next-line global-require, import/no-extraneous-dependencies
  moment = require('moment');
} catch (_) {
  moment = null;
}

export function nowISO() {
  return moment ? moment().toISOString() : new Date().toISOString();
}

export function toISO(date) {
  if (moment) return moment(date).toISOString();
  const d = date instanceof Date ? date : new Date(date);
  return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

export function formatDate(date, fmt = 'YYYY-MM-DD') {
  if (moment) return moment(date).format(fmt);
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return '';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  if (fmt === 'YYYY-MM-DD') return `${y}-${m}-${day}`;
  return `${y}-${m}-${day}`; // simple fallback
}

export function formatDateTime(date, fmt = 'YYYY-MM-DD HH:mm') {
  if (moment) return moment(date).format(fmt);
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return '';
  const base = formatDate(d, 'YYYY-MM-DD');
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${base} ${hh}:${mm}`;
}

export function toMillis(date) {
  if (moment) return moment(date).valueOf();
  const d = date instanceof Date ? date : new Date(date);
  return isNaN(d.getTime()) ? 0 : d.getTime();
}

export default {
  nowISO,
  toISO,
  formatDate,
  formatDateTime,
  toMillis,
};

