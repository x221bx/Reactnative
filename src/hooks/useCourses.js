import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCourses,
  fetchCourseById,
  selectAllCourses,
  selectCourseById,
  selectCoursesStatus,
  selectCoursesError,
  selectCoursesFilters,
  setFilters,
  clearFilters
} from '../redux/slices/coursesSlice';
import { coursesApi } from '../api/services/courses-api';

export default function useCourses(filters = {}) {
  const dispatch = useDispatch();
  const courses = useSelector(selectAllCourses);
  const status = useSelector(selectCoursesStatus);
  const error = useSelector(selectCoursesError);
  const currentFilters = useSelector(selectCoursesFilters);

  useEffect(() => {
    if (Object.keys(filters).length > 0) {
      dispatch(setFilters(filters));
    }
    dispatch(fetchCourses(filters));
  }, [dispatch, JSON.stringify(filters)]);

  const getCourseById = (id) => {
    return dispatch(fetchCourseById(id));
  };

  const updateFilters = (newFilters) => {
    dispatch(setFilters(newFilters));
  };

  const resetFilters = () => {
    dispatch(clearFilters());
  };

  // Admin helpers (create/update/delete)
  const addCourse = async (courseData) => {
    const created = await coursesApi.create(courseData);
    // refresh list to reflect change
    dispatch(fetchCourses(currentFilters));
    return created;
  };

  const updateCourse = async (courseData) => {
    if (!courseData?.id) throw new Error('updateCourse requires id');
    const updated = await coursesApi.update(courseData.id, courseData);
    dispatch(fetchCourses(currentFilters));
    return updated;
  };

  const reload = () => {
    dispatch(fetchCourses(currentFilters));
  };

  const removeCourse = async (id) => {
    await coursesApi.delete(id);
    dispatch(fetchCourses(currentFilters));
    return true;
  };

  return {
    courses,
    status,
    error,
    filters: currentFilters,
    getCourseById,
    updateFilters,
    resetFilters,
    reload,
    addCourse,
    updateCourse,
    removeCourse
  };
}
