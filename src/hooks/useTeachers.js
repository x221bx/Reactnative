import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchTeachers,
  fetchTeacherById,
  selectAllTeachers,
  selectTeacherById,
  selectTeachersStatus,
  selectTeachersError,
  selectTeachersFilters,
  setFilters,
  clearFilters
} from '../redux/slices/teachersSlice';
import { teachersApi } from '../api/services/teachers-api';

export default function useTeachers(filters = {}) {
  const dispatch = useDispatch();
  const teachers = useSelector(selectAllTeachers);
  const status = useSelector(selectTeachersStatus);
  const error = useSelector(selectTeachersError);
  const currentFilters = useSelector(selectTeachersFilters);

  useEffect(() => {
    if (Object.keys(filters).length > 0) {
      dispatch(setFilters(filters));
    }
    dispatch(fetchTeachers(filters));
  }, [dispatch, JSON.stringify(filters)]);

  const getTeacherById = (id) => {
    return dispatch(fetchTeacherById(id));
  };

  const updateFilters = (newFilters) => {
    dispatch(setFilters(newFilters));
  };

  const resetFilters = () => {
    dispatch(clearFilters());
  };

  return {
    teachers,
    status,
    error,
    filters: currentFilters,
    getTeacherById,
    updateFilters,
    resetFilters,
    // Admin helpers
    addTeacher: async (teacherData) => {
      const created = await teachersApi.create(teacherData);
      dispatch(fetchTeachers(currentFilters));
      return created;
    },
    updateTeacher: async (teacherData) => {
      if (!teacherData?.id) throw new Error('updateTeacher requires id');
      const updated = await teachersApi.update(teacherData.id, teacherData);
      dispatch(fetchTeachers(currentFilters));
      return updated;
    },
    removeTeacher: async (id) => {
      await teachersApi.delete(id);
      dispatch(fetchTeachers(currentFilters));
      return true;
    }
  };
}
