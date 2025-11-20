import { configureStore, createSlice } from '@reduxjs/toolkit';

// 1. Favorites Slice
const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: [],
  reducers: {
    toggleFavorite: (state, action) => {
      const item = action.payload;
      const exists = state.find((i) => i.id === item.id);
      if (exists) {
        return state.filter((i) => i.id !== item.id); // Remove
      } else {
        state.push(item); // Add
      }
    },
  },
});

// 2. Auth Slice (Simple login state)
const authSlice = createSlice({
  name: 'auth',
  initialState: { isLoggedIn: false, user: null },
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
    },
  },
});

export const { toggleFavorite } = favoritesSlice.actions;
export const { login, logout } = authSlice.actions;

export const store = configureStore({
  reducer: {
    favorites: favoritesSlice.reducer,
    auth: authSlice.reducer,
  },
});