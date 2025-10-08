import { db } from '../config/firebase';
import { collection, query, where, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { mockCourses, mockTeachers } from '../../mock/data';

// Use this flag to switch between Firebase and mock data
// Default to true for local development unless explicitly set to 'false'
const USE_MOCK_DATA = (process.env.EXPO_PUBLIC_USE_MOCK_DATA ?? 'true') === 'true';

const COLLECTION_NAME = 'courses';

// Normalize mock course shape to match UI expectations
function normalizeCourse(course) {
    const teacher = mockTeachers.find((t) => t.id === course.teacherId);
    return {
        ...course,
        thumbnail: course.thumbnail || course.image,
        instructor: teacher
            ? { name: teacher.name, avatar: teacher.image }
            : { name: 'Unknown', avatar: 'https://picsum.photos/seed/placeholder/40/40' },
    };
}

export const coursesApi = {
    async getAll(filters = {}) {
        if (USE_MOCK_DATA) {
            let filteredCourses = [...mockCourses];

            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                filteredCourses = filteredCourses.filter(course =>
                    course.title.toLowerCase().includes(searchLower) ||
                    course.description.toLowerCase().includes(searchLower)
                );
            }

            if (filters.teacherId) {
                filteredCourses = filteredCourses.filter(course =>
                    course.teacherId === filters.teacherId
                );
            }

            if (filters.level) {
                filteredCourses = filteredCourses.filter(course =>
                    course.level === filters.level
                );
            }

            return filteredCourses.map(normalizeCourse);
        }

        try {
            let coursesQuery = collection(db, COLLECTION_NAME);

            // Apply filters
            if (filters.teacherId) {
                coursesQuery = query(coursesQuery, where('teacherId', '==', filters.teacherId));
            }
            if (filters.level) {
                coursesQuery = query(coursesQuery, where('level', '==', filters.level));
            }

            const querySnapshot = await getDocs(coursesQuery);
            const courses = [];

            querySnapshot.forEach((doc) => {
                courses.push({ id: doc.id, ...doc.data() });
            });

            // Handle search filter client-side for Firestore
            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                return courses.filter(course =>
                    course.title.toLowerCase().includes(searchLower) ||
                    course.description.toLowerCase().includes(searchLower)
                );
            }

            return courses;
        } catch (error) {
            console.error('Error fetching courses, falling back to mock data:', error);
            // Fallback to mock data gracefully
            let filteredCourses = [...mockCourses];
            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                filteredCourses = filteredCourses.filter(course =>
                    course.title.toLowerCase().includes(searchLower) ||
                    course.description.toLowerCase().includes(searchLower)
                );
            }
            if (filters.teacherId) {
                filteredCourses = filteredCourses.filter(course => course.teacherId === filters.teacherId);
            }
            if (filters.level) {
                filteredCourses = filteredCourses.filter(course => course.level === filters.level);
            }
            return filteredCourses.map(normalizeCourse);
        }
    },

    async getById(id) {
        if (USE_MOCK_DATA) {
            const course = mockCourses.find(c => c.id === id);
            if (!course) throw new Error('Course not found');
            return normalizeCourse(course);
        }

        try {
            const docRef = doc(db, COLLECTION_NAME, id);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                throw new Error('Course not found');
            }

            return { id: docSnap.id, ...docSnap.data() };
        } catch (error) {
            console.error('Error fetching course:', error);
            throw error;
        }
    },

    async create(courseData) {
        if (USE_MOCK_DATA) {
            const newCourse = {
                id: Date.now().toString(),
                ...courseData,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            mockCourses.push(newCourse);
            return normalizeCourse(newCourse);
        }

        try {
            const docRef = await addDoc(collection(db, COLLECTION_NAME), {
                ...courseData,
                createdAt: new Date(),
                updatedAt: new Date()
            });

            return {
                id: docRef.id,
                ...courseData
            };
        } catch (error) {
            console.error('Error creating course:', error);
            throw error;
        }
    },

    async update(id, courseData) {
        if (USE_MOCK_DATA) {
            const index = mockCourses.findIndex(c => c.id === id);
            if (index === -1) throw new Error('Course not found');

            mockCourses[index] = {
                ...mockCourses[index],
                ...courseData,
                updatedAt: new Date().toISOString()
            };

            return normalizeCourse(mockCourses[index]);
        }

        try {
            const docRef = doc(db, COLLECTION_NAME, id);
            await updateDoc(docRef, {
                ...courseData,
                updatedAt: new Date()
            });

            return {
                id,
                ...courseData
            };
        } catch (error) {
            console.error('Error updating course:', error);
            throw error;
        }
    },

    async delete(id) {
        if (USE_MOCK_DATA) {
            const index = mockCourses.findIndex(c => c.id === id);
            if (index === -1) throw new Error('Course not found');
            mockCourses.splice(index, 1);
            return true;
        }

        try {
            const docRef = doc(db, COLLECTION_NAME, id);
            await deleteDoc(docRef);
            return true;
        } catch (error) {
            console.error('Error deleting course:', error);
            throw error;
        }
    }
};

export default coursesApi;
