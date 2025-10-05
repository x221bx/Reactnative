import { createSlice } from "@reduxjs/toolkit";

const initial = { items: [] };

const slice = createSlice({
  name: 'wishlist',
  initialState: initial,
  reducers: {
    addToWishlist(state, action) {
      const id = String(action.payload);
      if (!state.items.includes(id)) state.items.push(id);
    },
    removeFromWishlist(state, action) {
      const id = String(action.payload);
      state.items = state.items.filter(x => x !== id);
    },
    clearWishlist(state) { state.items = []; }
  }
});

export const { addToWishlist, removeFromWishlist, clearWishlist } = slice.actions;
export const selectWishlist = (s) => s.wishlist?.items || [];
export default slice.reducer;

