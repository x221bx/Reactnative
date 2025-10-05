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

  return {
    courses,
    status,
    error,
    filters: currentFilters,
    getCourseById,
    updateFilters,
    resetFilters
  };
}

