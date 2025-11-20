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

// 5. Trip History Slice (Bonus Feature)
const tripHistorySlice = createSlice({
  name: 'tripHistory',
  initialState: {
    trips: [],
    statistics: {
      totalTrips: 0,
      totalSpent: 0,
      trainTrips: 0,
      busTrips: 0
    }
  },
  reducers: {
    addTripToHistory: (state, action) => {
      state.trips.unshift(action.payload);
      // Update statistics
      state.statistics.totalTrips = state.trips.length;
      state.statistics.totalSpent += action.payload.totalPrice || action.payload.price || 0;
      if (action.payload.type === 'Train') {
        state.statistics.trainTrips += 1;
      } else if (action.payload.type === 'Bus') {
        state.statistics.busTrips += 1;
      }
    },
    setTripHistory: (state, action) => {
      state.trips = action.payload;
      // Recalculate statistics
      state.statistics = {
        totalTrips: action.payload.length,
        totalSpent: action.payload.reduce((sum, trip) => sum + (trip.totalPrice || trip.price || 0), 0),
        trainTrips: action.payload.filter(t => t.type === 'Train').length,
        busTrips: action.payload.filter(t => t.type === 'Bus').length
      };
    },
    deleteTripFromHistory: (state, action) => {
      const tripToDelete = state.trips.find(t => t.id === action.payload);
      state.trips = state.trips.filter(t => t.id !== action.payload);
      // Update statistics
      if (tripToDelete) {
        state.statistics.totalTrips -= 1;
        state.statistics.totalSpent -= tripToDelete.totalPrice || tripToDelete.price || 0;
        if (tripToDelete.type === 'Train') {
          state.statistics.trainTrips -= 1;
        } else if (tripToDelete.type === 'Bus') {
          state.statistics.busTrips -= 1;
        }
      }
    },
    clearTripHistory: (state) => {
      state.trips = [];
      state.statistics = {
        totalTrips: 0,
        totalSpent: 0,
        trainTrips: 0,
        busTrips: 0
      };
    }
  },
});

// 6. Offline Mode Slice (Bonus Feature)
const offlineModeSlice = createSlice({
  name: 'offlineMode',
  initialState: {
    isOffline: false,
    lastSync: null,
    pendingActions: []
  },
  reducers: {
    setOfflineMode: (state, action) => {
      state.isOffline = action.payload;
    },
    setLastSync: (state, action) => {
      state.lastSync = action.payload;
    },
    addPendingAction: (state, action) => {
      state.pendingActions.push(action.payload);
    },
    clearPendingActions: (state) => {
      state.pendingActions = [];
    },
    syncCompleted: (state) => {
      state.lastSync = new Date().toISOString();
      state.pendingActions = [];
    }
  },
});

export const { toggleFavorite } = favoritesSlice.actions;
export const { login, logout, setUser, updateName, updateEmail, updateLocation, updateAvatar } = authSlice.actions;
export const { bookTicket } = ticketsSlice.actions;
export const { toggleTheme, setTheme } = themeSlice.actions;
export const { addTripToHistory, setTripHistory, deleteTripFromHistory, clearTripHistory } = tripHistorySlice.actions;
export const { setOfflineMode, setLastSync, addPendingAction, clearPendingActions, syncCompleted } = offlineModeSlice.actions;

export const store = configureStore({
  reducer: {
    favorites: favoritesSlice.reducer,
    auth: authSlice.reducer,
    tickets: ticketsSlice.reducer,
    theme: themeSlice.reducer,
    tripHistory: tripHistorySlice.reducer,
    offlineMode: offlineModeSlice.reducer,
  },
});