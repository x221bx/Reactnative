import { createSlice } from "@reduxjs/toolkit";

const initial = { items: [] };

const slice = createSlice({
  name: 'cart',
  initialState: initial,
  reducers: {
    addToCart(state, action) {
      const id = String(action.payload);
      if (!state.items.includes(id)) state.items.push(id);
    },
    removeFromCart(state, action) {
      const id = String(action.payload);
      state.items = state.items.filter(x => x !== id);
    },
    clearCart(state) { state.items = []; },
    setCart(state, action) { state.items = (action.payload || []).map(String); }
  }
});

export const { addToCart, removeFromCart, clearCart, setCart } = slice.actions;
export const selectCart = (s) => s.cart?.items || [];
export default slice.reducer;

