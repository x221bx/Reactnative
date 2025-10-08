import { configureStore, combineReducers } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistStore, persistReducer } from "redux-persist";

import teachers from "./slices/teachersSlice";
import courses from "./slices/coursesSlice";
import auth from "./slices/authSlice";
import wishlist from "./slices/wishlistSlice";
import favorites from "./slices/favoritesSlice";
import enrollment from "./slices/enrollmentSlice";
import ratings from "./slices/ratingsSlice";
import cart from "./slices/cartSlice";

const rootReducer = combineReducers({
  teachers,
  courses,
  auth,
  wishlist,
  favorites,
  enrollment,
  ratings,
  cart,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['teachers', 'courses', 'auth', 'wishlist', 'favorites', 'enrollment', 'cart']
};

const persisted = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persisted,
  middleware: (getDefault) => getDefault({ serializableCheck: false }),
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);

export default store;
