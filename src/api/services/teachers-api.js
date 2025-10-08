import { db } from '../config/firebase';
import { collection, query, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { teachers as mockTeachers } from '../mock/teachers-data';

// Use this flag to switch between Firebase and mock data
// Default to true for local development unless explicitly set to 'false'
const USE_MOCK_DATA = (process.env.EXPO_PUBLIC_USE_MOCK_DATA ?? 'true') === 'true';

const COLLECTION_NAME = 'teachers';

export const teachersApi = {
    async getAll(filters = {}) {
        if (USE_MOCK_DATA) {
            let filteredTeachers = [...mockTeachers];

            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                filteredTeachers = filteredTeachers.filter(teacher =>
                    teacher.name.toLowerCase().includes(searchLower) ||
                    teacher.specialization.toLowerCase().includes(searchLower)
                );
            }

            return filteredTeachers;
        }

        try {
            const teachersQuery = collection(db, COLLECTION_NAME);
            const querySnapshot = await getDocs(teachersQuery);
            const teachers = [];

            querySnapshot.forEach((doc) => {
                teachers.push({ id: doc.id, ...doc.data() });
            });

            // Handle search filter client-side for Firestore
            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                return teachers.filter(teacher =>
                    teacher.name.toLowerCase().includes(searchLower) ||
                    teacher.specialization.toLowerCase().includes(searchLower)
                );
            }

            return teachers;
        } catch (error) {
            console.error('Error fetching teachers:', error);
            // No mock fallback – return empty list gracefully
            return [];
        }
    },

    async getById(id) {
        if (USE_MOCK_DATA) {
            const teacher = mockTeachers.find(t => t.id === id);
            if (!teacher) throw new Error('Teacher not found');
            return teacher;
        }

        try {
            const docRef = doc(db, COLLECTION_NAME, id);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                throw new Error('Teacher not found');
            }

            return { id: docSnap.id, ...docSnap.data() };
        } catch (error) {
            console.error('Error fetching teacher:', error);
            throw error;
        }
    },

    async create(teacherData) {
        if (USE_MOCK_DATA) {
            const newTeacher = {
                id: Date.now().toString(),
                ...teacherData,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            mockTeachers.push(newTeacher);
            return newTeacher;
        }

        try {
            const docRef = await addDoc(collection(db, COLLECTION_NAME), {
                ...teacherData,
                createdAt: new Date(),
                updatedAt: new Date()
            });

            return {
                id: docRef.id,
                ...teacherData
            };
        } catch (error) {
            console.error('Error creating teacher:', error);
            throw error;
        }
    },

    async update(id, teacherData) {
        if (USE_MOCK_DATA) {
            const index = mockTeachers.findIndex(t => t.id === id);
            if (index === -1) throw new Error('Teacher not found');

            mockTeachers[index] = {
                ...mockTeachers[index],
                ...teacherData,
                updatedAt: new Date().toISOString()
            };

            return mockTeachers[index];
        }

        try {
            const docRef = doc(db, COLLECTION_NAME, id);
            await updateDoc(docRef, {
                ...teacherData,
                updatedAt: new Date()
            });

            return {
                id,
                ...teacherData
            };
        } catch (error) {
            console.error('Error updating teacher:', error);
            throw error;
        }
    },

    async delete(id) {
        if (USE_MOCK_DATA) {
            const index = mockTeachers.findIndex(t => t.id === id);
            if (index === -1) throw new Error('Teacher not found');
            mockTeachers.splice(index, 1);
            return true;
        }

        try {
            const docRef = doc(db, COLLECTION_NAME, id);
            await deleteDoc(docRef);
            return true;
        } catch (error) {
            console.error('Error deleting teacher:', error);
            throw error;
        }
    }
};

export default teachersApi;
