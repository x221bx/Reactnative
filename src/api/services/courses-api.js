import AsyncStorage from '@react-native-async-storage/async-storage';
import { nowISO } from '../../utils/date';
import { courses as mockCourses } from '../mock/courses-data';
import { teachers as mockTeachers } from '../mock/teachers-data';

// Local storage key
const STORAGE_KEY = '@courses_db';

// --- helpers ---------------------------------------------------------------

function pickLevel(course) {
  if (course.level) return course.level;
  if (typeof course.price !== 'number') return 'Beginner';
  if (course.price < 50) return 'Beginner';
  if (course.price < 100) return 'Intermediate';
  return 'Advanced';
}

function normalizeCourse(course) {
  const teacher = mockTeachers.find((t) => t.id === course.teacherId);
  return {
    ...course,
    thumbnail: course.thumbnail || course.image,
    level: pickLevel(course),
    instructor: teacher
      ? { name: teacher.name, avatar: teacher.image }
      : { name: 'Unknown', avatar: 'https://picsum.photos/seed/placeholder/40/40' },
  };
}

function filterCourses(list, filters = {}) {
  const { search, teacherId, level } = filters;
  let out = [...list];

  if (search) {
    const q = String(search).toLowerCase();
    out = out.filter((c) =>
      String(c.title || '').toLowerCase().includes(q) ||
      String(c.description || '').toLowerCase().includes(q)
    );
  }

  if (teacherId) {
    out = out.filter((c) => c.teacherId === teacherId);
  }

  if (level) {
    out = out.filter((c) => String(c.level || pickLevel(c)) === String(level));
  }

  return out;
}

async function readAll() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // seed from mock on first run
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(mockCourses));
      return [...mockCourses];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_) {
    return [...mockCourses];
  }
}

async function writeAll(list) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

// --- api ------------------------------------------------------------------

export const coursesApi = {
  /** Get all courses with optional filters (mock or Firestore). */
  async getAll(filters = {}) {
    const list = await readAll();
    return filterCourses(list, filters).map(normalizeCourse);
  },

  /** Get a single course by id. */
  async getById(id) {
    const list = await readAll();
    const c = list.find((x) => x.id === id);
    if (!c) throw new Error('Course not found');
    return normalizeCourse(c);
  },

  /** Create a new course. */
  async create(courseData) {
    const now = nowISO();
    const list = await readAll();
    const newCourse = { id: Date.now().toString(), ...courseData, createdAt: now, updatedAt: now };
    list.push(newCourse);
    await writeAll(list);
    return normalizeCourse(newCourse);
  },

  /** Update an existing course. */
  async update(id, courseData) {
    const list = await readAll();
    const idx = list.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error('Course not found');
    list[idx] = { ...list[idx], ...courseData, updatedAt: nowISO() };
    await writeAll(list);
    return normalizeCourse(list[idx]);
  },

  /** Delete a course by id. */
  async delete(id) {
    const list = await readAll();
    const idx = list.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error('Course not found');
    list.splice(idx, 1);
    await writeAll(list);
    return true;
  },
};

export default coursesApi;
