import { createSlice } from "@reduxjs/toolkit";

const initial = {
  byUser: {},
};

const slice = createSlice({
  name: 'enrollment',
  initialState: initial,
  reducers: {
    joinCourse(state, action) {
      const { userId, courseId } = action.payload;
      const uid = String(userId);
      const cid = String(courseId);
      const list = state.byUser[uid] || [];
      if (!list.includes(cid)) state.byUser[uid] = [...list, cid];
    },
    unjoinCourse(state, action) {
      const { userId, courseId } = action.payload;
      const uid = String(userId);
      const cid = String(courseId);
      const list = state.byUser[uid] || [];
      state.byUser[uid] = list.filter((x) => x !== cid);
    },
    clearUserEnrollments(state, action) {
      const uid = String(action.payload);
      state.byUser[uid] = [];
    }
  }
});

export const { joinCourse, unjoinCourse, clearUserEnrollments } = slice.actions;
export const selectEnrollmentsByUser = (s, userId) => s.enrollment?.byUser?.[String(userId)] || [];
export const selectEnrolledCountForCourse = (s, courseId) => {
  const map = s.enrollment?.byUser || {};
  let count = 0;
  for (const uid of Object.keys(map)) {
    const list = map[uid] || [];
    if (list.includes(String(courseId))) count++;
  }
  return count;
};

export default slice.reducer;
