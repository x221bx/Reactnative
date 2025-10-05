import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { coursesApi } from '../../api/services/courses-api';

// Async Thunks
export const fetchCourses = createAsyncThunk(
  'courses/fetchAll',
  async (filters, { rejectWithValue }) => {
    try {
      return await coursesApi.getAll(filters);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCourseById = createAsyncThunk(
  'courses/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      return await coursesApi.getById(id);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initial = {
  items: [],
  selectedCourse: null,
  status: 'idle',
  error: null,
  filters: {
    search: '',
    teacherId: null,
    level: null
  }
};

const coursesSlice = createSlice({
  name: 'courses',
  initialState: initial,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        search: '',
        teacherId: null,
        level: null
      };
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all courses
      .addCase(fetchCourses.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Fetch course by ID
      .addCase(fetchCourseById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCourseById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedCourse = action.payload;
        state.error = null;
      })
      .addCase(fetchCourseById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

// Actions
export const { setFilters, clearFilters } = coursesSlice.actions;

// Selectors
export const selectAllCourses = (state) => state.courses.items;
export const selectCourseById = (state, courseId) =>
  state.courses.items.find(course => course.id === courseId);
export const selectSelectedCourse = (state) => state.courses.selectedCourse;
export const selectCoursesStatus = (state) => state.courses.status;
export const selectCoursesError = (state) => state.courses.error;
export const selectCoursesFilters = (state) => state.courses.filters;

export default coursesSlice.reducer;
