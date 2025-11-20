// Professional Mock Transport API Service
// Simulates Transport API structure with Sri Lankan transport data
// Can be easily replaced with real API calls

const MOCK_API_DELAY = 800; // Simulate network delay
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

// Simulated API responses
const TRANSPORT_DATA = {
    routes: [
        {
            id: 'route_001',
            name: 'Colombo to Kandy Express',
            type: 'Train',
            operator: 'Sri Lanka Railways',
            status: 'On Time',
            departure: '06:00 AM',
            arrival: '09:30 AM',
            duration: '3h 30m',
            price: 1200,
            stops: ['Colombo Fort', 'Ragama', 'Gampaha', 'Polgahawela', 'Rambukkana', 'Peradeniya', 'Kandy'],
            frequency: 'Daily',
            image: 'https://images.unsplash.com/photo-1532105956626-9569c03602f6?w=800&q=80',
            description: 'Scenic train journey through the hill country with stunning views.',
            realTimeDelay: 0, // minutes
            platform: '3',
            trainNumber: 'EXP-1005'
        },
        {
            id: 'route_002',
            name: 'Colombo to Galle Highway',
            type: 'Bus',
            operator: 'SLTB Express',
            status: 'Departing Soon',
            departure: '08:00 AM',
            arrival: '10:30 AM',
            duration: '2h 30m',
            price: 850,
            stops: ['Colombo', 'Panadura', 'Kalutara', 'Aluthgama', 'Hikkaduwa', 'Galle'],
            frequency: 'Every 30 minutes',
            image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
            description: 'Fast highway bus service along the Southern Expressway.',
            realTimeDelay: 5,
            platform: 'A12',
            busNumber: 'HWY-245'
        },
        {
            id: 'route_003',
            name: 'Colombo to Jaffna Intercity',
            type: 'Train',
            operator: 'Sri Lanka Railways',
            status: 'Delayed',
            departure: '05:45 AM',
            arrival: '02:15 PM',
            duration: '8h 30m',
            price: 1800,
            stops: ['Colombo Fort', 'Anuradhapura', 'Vavuniya', 'Kilinochchi', 'Jaffna'],
            frequency: 'Daily',
            image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800&q=80',
            description: 'Long-distance express connecting the capital to the Northern peninsula.',
            realTimeDelay: 15,
            platform: '7',
            trainNumber: 'YAL-4076'
        },
        {
            id: 'route_004',
            name: 'Colombo to Ella Scenic Route',
            type: 'Train',
            operator: 'Sri Lanka Railways',
            status: 'On Time',
            departure: '09:45 AM',
            arrival: '05:30 PM',
            duration: '7h 45m',
            price: 1500,
            stops: ['Colombo', 'Kandy', 'Nanu Oya', 'Haputale', 'Ella'],
            frequency: 'Daily',
            image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&q=80',
            description: 'One of the most scenic train rides in the world through tea plantations.',
            realTimeDelay: 0,
            platform: '5',
            trainNumber: 'SCN-1015'
        },
        {
            id: 'route_005',
            name: 'Colombo to Negombo Beach',
            type: 'Bus',
            operator: 'Private Express',
            status: 'On Time',
            departure: '10:00 AM',
            arrival: '11:15 AM',
            duration: '1h 15m',
            price: 450,
            stops: ['Colombo', 'Ja-Ela', 'Katunayake', 'Negombo'],
            frequency: 'Every 20 minutes',
            image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&q=80',
            description: 'Quick route to the beach town with AC comfort.',
            realTimeDelay: 0,
            platform: 'B5',
            busNumber: 'BCH-187'
        },
        {
            id: 'route_006',
            name: 'Colombo to Nuwara Eliya',
            type: 'Bus',
            operator: 'Hill Country Express',
            status: 'On Time',
            departure: '07:30 AM',
            arrival: '01:00 PM',
            duration: '5h 30m',
            price: 1100,
            stops: ['Colombo', 'Kegalle', 'Mawanella', 'Ramboda', 'Nuwara Eliya'],
            frequency: 'Daily',
            image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
            description: 'Journey to the hill capital with breathtaking mountain views.',
            realTimeDelay: 0,
            platform: 'C8',
            busNumber: 'HILL-321'
        }
    ],

    nearbyStops: [
        {
            id: 'stop_001',
            name: 'Colombo Fort Railway Station',
            type: 'Train',
            distance: '0.5 km',
            lat: 6.9344,
            lon: 79.8428,
            routes: ['route_001', 'route_003', 'route_004']
        },
        {
            id: 'stop_002',
            name: 'Central Bus Stand',
            type: 'Bus',
            distance: '0.8 km',
            lat: 6.9271,
            lon: 79.8612,
            routes: ['route_002', 'route_005', 'route_006']
        }
    ]
};

// Cache management
let cache = {};

const setCache = (key, data) => {
    cache[key] = {
        data,
        timestamp: Date.now()
    };
};

const getCache = (key) => {
    const cached = cache[key];
    if (!cached) return null;

    const isExpired = Date.now() - cached.timestamp > CACHE_DURATION;
    if (isExpired) {
        delete cache[key];
        return null;
    }

    return cached.data;
};

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// API Functions

/**
 * Fetch live transport schedule with real-time updates
 * Simulates Transport API's live departure board
 */
export const fetchLiveTransportSchedule = async () => {
    try {
        // Check cache first
        const cached = getCache('liveSchedule');
        if (cached) {
            console.log('📦 Returning cached transport schedule');
            return cached;
        }

        console.log('🌐 Fetching live transport schedule...');
        await delay(MOCK_API_DELAY);

        // Simulate random delays for realism
        const routes = TRANSPORT_DATA.routes.map(route => ({
            ...route,
            realTimeDelay: Math.random() > 0.7 ? Math.floor(Math.random() * 20) : 0,
            status: Math.random() > 0.8 ? 'Delayed' : (Math.random() > 0.5 ? 'On Time' : 'Departing Soon'),
            lastUpdated: new Date().toISOString()
        }));

        setCache('liveSchedule', routes);
        return routes;
    } catch (error) {
        console.error('❌ Error fetching transport schedule:', error);
        throw new Error('Failed to fetch transport schedule. Please try again.');
    }
};

/**
 * Fetch detailed route information
 * @param {string} routeId - Route identifier
 */
export const fetchRouteDetails = async (routeId) => {
    try {
        console.log(`🌐 Fetching route details for ${routeId}...`);
        await delay(MOCK_API_DELAY / 2);

        const route = TRANSPORT_DATA.routes.find(r => r.id === routeId);
        if (!route) {
            throw new Error('Route not found');
        }

        return {
            ...route,
            detailedStops: route.stops.map((stop, index) => ({
                name: stop,
                arrivalTime: index === 0 ? route.departure : `${6 + index}:${30 + index * 15} AM`,
                platform: route.platform,
                facilities: ['Waiting Area', 'Restrooms', 'Food Court']
            })),
            amenities: route.type === 'Train'
                ? ['AC Coaches', 'Observation Deck', 'Dining Car', 'WiFi']
                : ['AC', 'Reclining Seats', 'USB Charging', 'Entertainment'],
            ticketClasses: route.type === 'Train'
                ? [
                    { name: '1st Class', price: route.price * 2, available: true },
                    { name: '2nd Class', price: route.price * 1.5, available: true },
                    { name: '3rd Class', price: route.price, available: true }
                ]
                : [
                    { name: 'Luxury', price: route.price * 1.5, available: true },
                    { name: 'Standard', price: route.price, available: true }
                ]
        };
    } catch (error) {
        console.error('❌ Error fetching route details:', error);
        throw error;
    }
};

/**
 * Search routes between two locations
 * @param {string} from - Origin location
 * @param {string} to - Destination location
 */
export const searchRoutes = async (from, to) => {
    try {
        console.log(`🔍 Searching routes from ${from} to ${to}...`);
        await delay(MOCK_API_DELAY);

        // Simple search simulation
        const results = TRANSPORT_DATA.routes.filter(route =>
            route.name.toLowerCase().includes(from.toLowerCase()) ||
            route.name.toLowerCase().includes(to.toLowerCase()) ||
            route.stops.some(stop =>
                stop.toLowerCase().includes(from.toLowerCase()) ||
                stop.toLowerCase().includes(to.toLowerCase())
            )
        );

        return results.length > 0 ? results : TRANSPORT_DATA.routes;
    } catch (error) {
        console.error('❌ Error searching routes:', error);
        throw new Error('Failed to search routes. Please try again.');
    }
};

/**
 * Fetch nearby transport stops
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 */
export const fetchNearbyStops = async (lat, lon) => {
    try {
        console.log(`📍 Fetching nearby stops for coordinates: ${lat}, ${lon}...`);
        await delay(MOCK_API_DELAY / 2);

        return TRANSPORT_DATA.nearbyStops;
    } catch (error) {
        console.error('❌ Error fetching nearby stops:', error);
        throw new Error('Failed to fetch nearby stops. Please try again.');
    }
};

/**
 * Clear API cache (useful for manual refresh)
 */
export const clearTransportCache = () => {
    cache = {};
    console.log('🗑️ Transport API cache cleared');
};

/**
 * Get cache status (for debugging)
 */
export const getCacheStatus = () => {
    return Object.keys(cache).map(key => ({
        key,
        age: Date.now() - cache[key].timestamp,
        expiresIn: CACHE_DURATION - (Date.now() - cache[key].timestamp)
    }));
};
