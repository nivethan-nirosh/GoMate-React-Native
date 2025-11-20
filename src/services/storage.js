// AsyncStorage wrapper for offline data persistence
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const KEYS = {
    TRIP_HISTORY: '@gomate_trip_history',
    OFFLINE_CACHE: '@gomate_offline_cache',
    USER_PREFERENCES: '@gomate_user_preferences',
    LAST_SYNC: '@gomate_last_sync'
};

// Cache expiration time (24 hours)
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000;

/**
 * Save trip to history
 * @param {Object} trip - Trip data to save
 */
export const saveTripHistory = async (trip) => {
    try {
        const history = await getTripHistory();
        const newTrip = {
            ...trip,
            savedAt: new Date().toISOString(),
            id: trip.ticketId || Date.now()
        };

        const updatedHistory = [newTrip, ...history];
        await AsyncStorage.setItem(KEYS.TRIP_HISTORY, JSON.stringify(updatedHistory));
        console.log('✅ Trip saved to history:', newTrip.name || newTrip.title);
        return updatedHistory;
    } catch (error) {
        console.error('❌ Error saving trip history:', error);
        throw error;
    }
};

/**
 * Get trip history
 * @returns {Array} Array of trip objects
 */
export const getTripHistory = async () => {
    try {
        const history = await AsyncStorage.getItem(KEYS.TRIP_HISTORY);
        return history ? JSON.parse(history) : [];
    } catch (error) {
        console.error('❌ Error getting trip history:', error);
        return [];
    }
};

/**
 * Delete trip from history
 * @param {string|number} tripId - Trip ID to delete
 */
export const deleteTripFromHistory = async (tripId) => {
    try {
        const history = await getTripHistory();
        const updatedHistory = history.filter(trip => trip.id !== tripId);
        await AsyncStorage.setItem(KEYS.TRIP_HISTORY, JSON.stringify(updatedHistory));
        console.log('🗑️ Trip deleted from history:', tripId);
        return updatedHistory;
    } catch (error) {
        console.error('❌ Error deleting trip:', error);
        throw error;
    }
};

/**
 * Clear all trip history
 */
export const clearTripHistory = async () => {
    try {
        await AsyncStorage.removeItem(KEYS.TRIP_HISTORY);
        console.log('🗑️ Trip history cleared');
    } catch (error) {
        console.error('❌ Error clearing trip history:', error);
        throw error;
    }
};

/**
 * Get trip statistics
 * @returns {Object} Statistics object
 */
export const getTripStatistics = async () => {
    try {
        const history = await getTripHistory();

        const stats = {
            totalTrips: history.length,
            totalSpent: history.reduce((sum, trip) => sum + (trip.totalPrice || trip.price || 0), 0),
            trainTrips: history.filter(t => t.type === 'Train').length,
            busTrips: history.filter(t => t.type === 'Bus').length,
            favoriteDestinations: {},
            recentTrips: history.slice(0, 5)
        };

        // Calculate favorite destinations
        history.forEach(trip => {
            const destination = trip.name || trip.title;
            stats.favoriteDestinations[destination] = (stats.favoriteDestinations[destination] || 0) + 1;
        });

        return stats;
    } catch (error) {
        console.error('❌ Error calculating statistics:', error);
        return {
            totalTrips: 0,
            totalSpent: 0,
            trainTrips: 0,
            busTrips: 0,
            favoriteDestinations: {},
            recentTrips: []
        };
    }
};

/**
 * Save data to offline cache
 * @param {string} key - Cache key
 * @param {any} data - Data to cache
 */
export const saveOfflineData = async (key, data) => {
    try {
        const cacheEntry = {
            data,
            timestamp: Date.now()
        };

        const cache = await getOfflineCache();
        cache[key] = cacheEntry;

        await AsyncStorage.setItem(KEYS.OFFLINE_CACHE, JSON.stringify(cache));
        console.log(`📦 Data cached for key: ${key}`);
    } catch (error) {
        console.error('❌ Error saving offline data:', error);
        throw error;
    }
};

/**
 * Get data from offline cache
 * @param {string} key - Cache key
 * @returns {any} Cached data or null
 */
export const getOfflineData = async (key) => {
    try {
        const cache = await getOfflineCache();
        const entry = cache[key];

        if (!entry) return null;

        // Check if cache is expired
        const isExpired = Date.now() - entry.timestamp > CACHE_EXPIRATION;
        if (isExpired) {
            console.log(`⏰ Cache expired for key: ${key}`);
            return null;
        }

        console.log(`📦 Retrieved cached data for key: ${key}`);
        return entry.data;
    } catch (error) {
        console.error('❌ Error getting offline data:', error);
        return null;
    }
};

/**
 * Get entire offline cache
 * @returns {Object} Cache object
 */
const getOfflineCache = async () => {
    try {
        const cache = await AsyncStorage.getItem(KEYS.OFFLINE_CACHE);
        return cache ? JSON.parse(cache) : {};
    } catch (error) {
        console.error('❌ Error getting offline cache:', error);
        return {};
    }
};

/**
 * Clear old cached data
 */
export const clearOldCache = async () => {
    try {
        const cache = await getOfflineCache();
        const now = Date.now();

        const cleanedCache = Object.keys(cache).reduce((acc, key) => {
            const entry = cache[key];
            const isExpired = now - entry.timestamp > CACHE_EXPIRATION;

            if (!isExpired) {
                acc[key] = entry;
            }

            return acc;
        }, {});

        await AsyncStorage.setItem(KEYS.OFFLINE_CACHE, JSON.stringify(cleanedCache));
        console.log('🧹 Old cache cleared');
    } catch (error) {
        console.error('❌ Error clearing old cache:', error);
    }
};

/**
 * Clear all offline cache
 */
export const clearAllCache = async () => {
    try {
        await AsyncStorage.removeItem(KEYS.OFFLINE_CACHE);
        console.log('🗑️ All cache cleared');
    } catch (error) {
        console.error('❌ Error clearing all cache:', error);
        throw error;
    }
};

/**
 * Save user preferences
 * @param {Object} preferences - User preferences object
 */
export const saveUserPreferences = async (preferences) => {
    try {
        await AsyncStorage.setItem(KEYS.USER_PREFERENCES, JSON.stringify(preferences));
        console.log('✅ User preferences saved');
    } catch (error) {
        console.error('❌ Error saving user preferences:', error);
        throw error;
    }
};

/**
 * Get user preferences
 * @returns {Object} User preferences
 */
export const getUserPreferences = async () => {
    try {
        const preferences = await AsyncStorage.getItem(KEYS.USER_PREFERENCES);
        return preferences ? JSON.parse(preferences) : {
            notifications: true,
            darkMode: false,
            language: 'en'
        };
    } catch (error) {
        console.error('❌ Error getting user preferences:', error);
        return {
            notifications: true,
            darkMode: false,
            language: 'en'
        };
    }
};

/**
 * Update last sync timestamp
 */
export const updateLastSync = async () => {
    try {
        await AsyncStorage.setItem(KEYS.LAST_SYNC, new Date().toISOString());
        console.log('🔄 Last sync updated');
    } catch (error) {
        console.error('❌ Error updating last sync:', error);
    }
};

/**
 * Get last sync timestamp
 * @returns {string|null} ISO timestamp or null
 */
export const getLastSync = async () => {
    try {
        return await AsyncStorage.getItem(KEYS.LAST_SYNC);
    } catch (error) {
        console.error('❌ Error getting last sync:', error);
        return null;
    }
};

/**
 * Clear all storage (use with caution!)
 */
export const clearAllStorage = async () => {
    try {
        await AsyncStorage.clear();
        console.log('🗑️ All storage cleared');
    } catch (error) {
        console.error('❌ Error clearing all storage:', error);
        throw error;
    }
};

/**
 * Get storage info (for debugging)
 */
export const getStorageInfo = async () => {
    try {
        const keys = await AsyncStorage.getAllKeys();
        const values = await AsyncStorage.multiGet(keys);

        const info = values.map(([key, value]) => ({
            key,
            size: new Blob([value]).size,
            preview: value ? value.substring(0, 100) + '...' : 'empty'
        }));

        return info;
    } catch (error) {
        console.error('❌ Error getting storage info:', error);
        return [];
    }
};
