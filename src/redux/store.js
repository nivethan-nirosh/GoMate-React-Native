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
        return state.filter((i) => i.id !== item.id);
      } else {
        state.push(item);
      }
    },
  },
});

// 2. Auth Slice (Handles User Profile)
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: true, // Auto-login for demo
    userProfile: {
      name: 'Traveler',
      email: 'user@gomate.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
      location: 'Colombo, Sri Lanka'
    }
  },
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.userProfile.name = action.payload;
    },
    logout: (state) => {
      state.isLoggedIn = false;
    },
    // Action to set initial user from API
    setUser: (state, action) => {
      state.userProfile = { ...state.userProfile, ...action.payload };
    },
    // Action to update name from Profile Screen
    updateName: (state, action) => {
      state.userProfile.name = action.payload;
    },
    // Action to update email
    updateEmail: (state, action) => {
      state.userProfile.email = action.payload;
    },
    // Action to update location
    updateLocation: (state, action) => {
      state.userProfile.location = action.payload;
    },
    // Action to update avatar
    updateAvatar: (state, action) => {
      state.userProfile.avatar = action.payload;
    },
  },
});

// 3. Tickets Slice (Digital Wallet)
const ticketsSlice = createSlice({
  name: 'tickets',
  initialState: [],
  reducers: {
    bookTicket: (state, action) => {
      // Add new ticket to the beginning of the list
      state.unshift(action.payload);
    },
  },
});

// 4. Theme Slice (Dark Mode)
const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    isDark: false,
  },
  reducers: {
    toggleTheme: (state) => {
      state.isDark = !state.isDark;
    },
    setTheme: (state, action) => {
      state.isDark = action.payload;
    },
  },
});

export const { toggleFavorite } = favoritesSlice.actions;
export const { login, logout, setUser, updateName, updateEmail, updateLocation, updateAvatar } = authSlice.actions;
export const { bookTicket } = ticketsSlice.actions;
export const { toggleTheme, setTheme } = themeSlice.actions;

export const store = configureStore({
  reducer: {
    favorites: favoritesSlice.reducer,
    auth: authSlice.reducer,
    tickets: ticketsSlice.reducer,
    theme: themeSlice.reducer,
  },
});