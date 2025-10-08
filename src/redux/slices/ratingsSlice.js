import { createSlice, createSelector } from "@reduxjs/toolkit";

// ratingsByCourse: { [courseId]: [{ userId, rating:number 1..5, comment, createdAt }] }
const initial = { ratingsByCourse: {} };

const slice = createSlice({
  name: 'ratings',
  initialState: initial,
  reducers: {
    addOrUpdateRating(state, action) {
      const { courseId, userId, rating, comment } = action.payload;
      const cid = String(courseId);
      const uid = String(userId);
      const list = state.ratingsByCourse[cid] || [];
      const idx = list.findIndex(r => String(r.userId) === uid);
      const entry = { userId: uid, rating: Math.max(1, Math.min(5, Number(rating) || 0)), comment: comment || '', createdAt: (new Date()).toISOString() };
      if (idx >= 0) list[idx] = { ...list[idx], ...entry };
      else list.push(entry);
      state.ratingsByCourse[cid] = list;
    },
    removeRating(state, action) {
      const { courseId, userId } = action.payload;
      const cid = String(courseId);
      const uid = String(userId);
      const list = state.ratingsByCourse[cid] || [];
      state.ratingsByCourse[cid] = list.filter(r => String(r.userId) !== uid);
    }
  }
});

export const { addOrUpdateRating, removeRating } = slice.actions;
export const selectRatingsState = (s) => s.ratings || initial;
export const selectCourseRatings = (s, courseId) => selectRatingsState(s).ratingsByCourse[String(courseId)] || [];
export const selectCourseRatingAvg = createSelector([
  (s, id) => selectCourseRatings(s, id)
], (list) => {
  if (!list.length) return 0;
  const sum = list.reduce((a, b) => a + (Number(b.rating) || 0), 0);
  return Math.round((sum / list.length) * 10) / 10;
});
export const selectCourseRatingCount = (s, id) => selectCourseRatings(s, id).length;

export default slice.reducer;
