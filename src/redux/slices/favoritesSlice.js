import { createSlice } from "@reduxjs/toolkit";

const initial = { items: [] };

const slice = createSlice({
  name: 'favorites',
  initialState: initial,
  reducers: {
    addFavorite(state, action) {
      const id = String(action.payload);
      if (!state.items.includes(id)) state.items.push(id);
    },
    removeFavorite(state, action) {
      const id = String(action.payload);
      state.items = state.items.filter(x => x !== id);
    },
    clearFavorites(state) { state.items = []; }
  }
});

export const { addFavorite, removeFavorite, clearFavorites } = slice.actions;
export const selectFavorites = (s) => s.favorites?.items || [];
export default slice.reducer;

