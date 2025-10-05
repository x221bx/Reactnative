import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { teachersApi } from '../../api/services/teachers-api';

// Async Thunks
export const fetchTeachers = createAsyncThunk(
  'teachers/fetchAll',
  async (filters, { rejectWithValue }) => {
    try {
      return await teachersApi.getAll(filters);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchTeacherById = createAsyncThunk(
  'teachers/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      return await teachersApi.getById(id);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initial = {
  items: [],
  selectedTeacher: null,
  status: 'idle',
  error: null,
  filters: {
    search: '',
    specialization: null
  }
};

const teachersSlice = createSlice({
  name: 'teachers',
  initialState: initial,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        search: '',
        specialization: null
      };
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all teachers
      .addCase(fetchTeachers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTeachers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchTeachers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Fetch teacher by ID
      .addCase(fetchTeacherById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTeacherById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedTeacher = action.payload;
        state.error = null;
      })
      .addCase(fetchTeacherById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

// Actions
export const { setFilters, clearFilters } = teachersSlice.actions;

// Selectors
export const selectAllTeachers = (state) => state.teachers.items;
export const selectTeacherById = (state, teacherId) =>
  state.teachers.items.find(teacher => teacher.id === teacherId);
export const selectSelectedTeacher = (state) => state.teachers.selectedTeacher;
export const selectTeachersStatus = (state) => state.teachers.status;
export const selectTeachersError = (state) => state.teachers.error;
export const selectTeachersFilters = (state) => state.teachers.filters;

export default teachersSlice.reducer;
