import AsyncStorage from '@react-native-async-storage/async-storage';
import { nowISO } from '../../utils/date';
import { teachers as mockTeachers } from '../mock/teachers-data';
const STORAGE_KEY = '@teachers_db';

// --- helpers ---------------------------------------------------------------

function filterTeachers(list, filters = {}) {
  const { search } = filters;
  if (!search) return [...list];
  const q = String(search).toLowerCase();
  return list.filter((t) => {
    const spec = String(t.specialization || t.subject || '').toLowerCase();
    return String(t.name || '').toLowerCase().includes(q) || spec.includes(q);
  });
}

async function readAll() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(mockTeachers));
      return [...mockTeachers];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_) {
    return [...mockTeachers];
  }
}

async function writeAll(list) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

// --- api ------------------------------------------------------------------

export const teachersApi = {
  /** Get all teachers with optional search filter. */
  async getAll(filters = {}) {
    const list = await readAll();
    return filterTeachers(list, filters);
  },

  /** Get a teacher by id. */
  async getById(id) {
    const list = await readAll();
    const t = list.find((x) => x.id === id);
    if (!t) throw new Error('Teacher not found');
    return t;
  },

  /** Create a new teacher. */
  async create(teacherData) {
    const now = nowISO();
    const list = await readAll();
    const t = { id: Date.now().toString(), ...teacherData, createdAt: now, updatedAt: now };
    list.push(t);
    await writeAll(list);
    return t;
  },

  /** Update an existing teacher. */
  async update(id, teacherData) {
    const list = await readAll();
    const idx = list.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error('Teacher not found');
    list[idx] = { ...list[idx], ...teacherData, updatedAt: nowISO() };
    await writeAll(list);
    return list[idx];
  },

  /** Delete a teacher by id. */
  async delete(id) {
    const list = await readAll();
    const idx = list.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error('Teacher not found');
    list.splice(idx, 1);
    await writeAll(list);
    return true;
  },
};

export default teachersApi;
