// Professional Mock Transport API Service
// Simulates Transport API structure with Sri Lankan transport data
// Can be easily replaced with real API calls

const MOCK_API_DELAY = 800; // Simulate network delay
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

// Simulated API responses
const TRANSPORT_DATA = {
    routes: [
        // COLOMBO TO KANDY ROUTES
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
            realTimeDelay: 0,
            platform: '3',
            trainNumber: 'EXP-1005',
            vehicleDetails: {
                model: 'S12 Diesel Multiple Unit',
                capacity: 450,
                features: ['AC Coaches', 'Observation Deck', 'Dining Car', 'WiFi', 'Power Outlets'],
                accessibility: 'Wheelchair accessible'
            }
        },
        {
            id: 'route_002',
            name: 'Colombo to Kandy Intercity',
            type: 'Train',
            operator: 'Sri Lanka Railways',
            status: 'On Time',
            departure: '07:30 AM',
            arrival: '10:45 AM',
            duration: '3h 15m',
            price: 1500,
            stops: ['Colombo Fort', 'Maradana', 'Ragama', 'Veyangoda', 'Polgahawela', 'Kandy'],
            frequency: 'Daily',
            image: 'https://images.unsplash.com/photo-1532105956626-9569c03602f6?w=800&q=80',
            description: 'Faster intercity service with fewer stops.',
            realTimeDelay: 0,
            platform: '4',
            trainNumber: 'IC-1012',
            vehicleDetails: {
                model: 'S13 Intercity Express',
                capacity: 380,
                features: ['Full AC', '1st Class Compartments', 'Food Service', 'WiFi'],
                accessibility: 'Wheelchair accessible'
            }
        },

        // COLOMBO TO GALLE/MATARA ROUTES
        {
            id: 'route_003',
            name: 'Colombo to Galle Highway Express',
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
            busNumber: 'HWY-245',
            vehicleDetails: {
                model: 'Ashok Leyland Viking',
                capacity: 52,
                features: ['Full AC', 'Reclining Seats', 'USB Charging', 'WiFi', 'Entertainment System'],
                accessibility: 'Standard access'
            }
        },
        {
            id: 'route_004',
            name: 'Colombo to Matara Coastal Train',
            type: 'Train',
            operator: 'Sri Lanka Railways',
            status: 'On Time',
            departure: '06:30 AM',
            arrival: '10:15 AM',
            duration: '3h 45m',
            price: 950,
            stops: ['Colombo Fort', 'Mount Lavinia', 'Kalutara', 'Bentota', 'Hikkaduwa', 'Galle', 'Matara'],
            frequency: 'Every 2 hours',
            image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&q=80',
            description: 'Beautiful coastal route with ocean views.',
            realTimeDelay: 0,
            platform: '2',
            trainNumber: 'CST-8045',
            vehicleDetails: {
                model: 'M9 Coastal Express',
                capacity: 520,
                features: ['Open Windows', 'Observation Areas', '2nd & 3rd Class', 'Food Vendors'],
                accessibility: 'Limited accessibility'
            }
        },

        // COLOMBO TO JAFFNA ROUTES
        {
            id: 'route_005',
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
            trainNumber: 'YAL-4076',
            vehicleDetails: {
                model: 'S14 Long Distance',
                capacity: 600,
                features: ['AC & Non-AC Options', 'Sleeper Berths', 'Dining Car', 'Power Outlets'],
                accessibility: 'Wheelchair accessible'
            }
        },
        {
            id: 'route_006',
            name: 'Colombo to Jaffna Luxury Bus',
            type: 'Bus',
            operator: 'Northern Express',
            status: 'On Time',
            departure: '09:00 PM',
            arrival: '05:30 AM',
            duration: '8h 30m',
            price: 2200,
            stops: ['Colombo', 'Kurunegala', 'Anuradhapura', 'Vavuniya', 'Jaffna'],
            frequency: 'Daily (Night Service)',
            image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
            description: 'Overnight luxury bus with sleeper seats.',
            realTimeDelay: 0,
            platform: 'D15',
            busNumber: 'NTH-890',
            vehicleDetails: {
                model: 'Volvo B9R Multi-Axle',
                capacity: 40,
                features: ['Full AC', 'Sleeper Seats', 'WiFi', 'Entertainment', 'Washroom', 'Snack Service'],
                accessibility: 'Standard access'
            }
        },

        // COLOMBO TO ELLA/BADULLA ROUTES
        {
            id: 'route_007',
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
            trainNumber: 'SCN-1015',
            vehicleDetails: {
                model: 'M10 Hill Country Special',
                capacity: 480,
                features: ['Observation Cars', 'Open Doors', '1st/2nd/3rd Class', 'Food Service'],
                accessibility: 'Limited accessibility'
            }
        },
        {
            id: 'route_008',
            name: 'Colombo to Badulla Express',
            type: 'Train',
            operator: 'Sri Lanka Railways',
            status: 'On Time',
            departure: '08:30 AM',
            arrival: '06:00 PM',
            duration: '9h 30m',
            price: 1650,
            stops: ['Colombo', 'Kandy', 'Nanu Oya', 'Haputale', 'Ella', 'Bandarawela', 'Badulla'],
            frequency: 'Daily',
            image: 'https://images.unsplash.com/photo-1532105956626-9569c03602f6?w=800&q=80',
            description: 'Extended scenic route to Badulla with more hill country views.',
            realTimeDelay: 0,
            platform: '6',
            trainNumber: 'BDL-1020',
            vehicleDetails: {
                model: 'M10 Hill Country Special',
                capacity: 480,
                features: ['Observation Cars', 'Open Doors', 'Multiple Classes', 'Refreshments'],
                accessibility: 'Limited accessibility'
            }
        },

        // COLOMBO TO NEGOMBO/CHILAW ROUTES
        {
            id: 'route_009',
            name: 'Colombo to Negombo Beach Express',
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
            busNumber: 'BCH-187',
            vehicleDetails: {
                model: 'TATA Marcopolo',
                capacity: 45,
                features: ['AC', 'Comfortable Seats', 'USB Charging', 'Music System'],
                accessibility: 'Standard access'
            }
        },
        {
            id: 'route_010',
            name: 'Colombo to Chilaw Coastal',
            type: 'Bus',
            operator: 'Coastal Express',
            status: 'On Time',
            departure: '07:00 AM',
            arrival: '09:30 AM',
            duration: '2h 30m',
            price: 650,
            stops: ['Colombo', 'Negombo', 'Marawila', 'Chilaw'],
            frequency: 'Every hour',
            image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
            description: 'Coastal route to Chilaw fishing town.',
            realTimeDelay: 0,
            platform: 'B8',
            busNumber: 'CST-445',
            vehicleDetails: {
                model: 'Ashok Leyland Lynx',
                capacity: 50,
                features: ['Semi-AC', 'Reclining Seats', 'Luggage Space'],
                accessibility: 'Standard access'
            }
        },

        // COLOMBO TO NUWARA ELIYA ROUTES
        {
            id: 'route_011',
            name: 'Colombo to Nuwara Eliya Hill Express',
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
            busNumber: 'HILL-321',
            vehicleDetails: {
                model: 'Volvo B7R',
                capacity: 48,
                features: ['Full AC', 'Reclining Seats', 'Entertainment', 'Snack Service'],
                accessibility: 'Standard access'
            }
        },

        // COLOMBO TO TRINCOMALEE ROUTES
        {
            id: 'route_012',
            name: 'Colombo to Trincomalee Express',
            type: 'Bus',
            operator: 'East Coast Express',
            status: 'On Time',
            departure: '08:30 PM',
            arrival: '05:00 AM',
            duration: '8h 30m',
            price: 1900,
            stops: ['Colombo', 'Kurunegala', 'Dambulla', 'Habarana', 'Trincomalee'],
            frequency: 'Daily (Night Service)',
            image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
            description: 'Overnight service to the Eastern beaches.',
            realTimeDelay: 0,
            platform: 'D12',
            busNumber: 'ECE-567',
            vehicleDetails: {
                model: 'Scania K410',
                capacity: 42,
                features: ['Full AC', 'Sleeper Seats', 'WiFi', 'Washroom', 'Entertainment'],
                accessibility: 'Standard access'
            }
        },

        // COLOMBO TO ANURADHAPURA ROUTES
        {
            id: 'route_013',
            name: 'Colombo to Anuradhapura Intercity',
            type: 'Train',
            operator: 'Sri Lanka Railways',
            status: 'On Time',
            departure: '06:15 AM',
            arrival: '10:30 AM',
            duration: '4h 15m',
            price: 1350,
            stops: ['Colombo Fort', 'Polgahawela', 'Kurunegala', 'Maho', 'Anuradhapura'],
            frequency: 'Daily',
            image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800&q=80',
            description: 'Direct service to the ancient city.',
            realTimeDelay: 0,
            platform: '8',
            trainNumber: 'ANU-2034',
            vehicleDetails: {
                model: 'S12 Intercity',
                capacity: 420,
                features: ['AC & Non-AC', 'Food Service', 'Power Outlets', 'WiFi'],
                accessibility: 'Wheelchair accessible'
            }
        },

        // KANDY TO OTHER CITIES
        {
            id: 'route_014',
            name: 'Kandy to Nuwara Eliya Hill Climb',
            type: 'Bus',
            operator: 'Hill Country Transport',
            status: 'On Time',
            departure: '09:00 AM',
            arrival: '12:30 PM',
            duration: '3h 30m',
            price: 750,
            stops: ['Kandy', 'Peradeniya', 'Gampola', 'Ramboda', 'Nuwara Eliya'],
            frequency: 'Every 2 hours',
            image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
            description: 'Scenic mountain route through tea estates.',
            realTimeDelay: 0,
            platform: 'K5',
            busNumber: 'HCT-234',
            vehicleDetails: {
                model: 'TATA LP 1512',
                capacity: 55,
                features: ['Semi-AC', 'Mountain Brakes', 'Luggage Racks'],
                accessibility: 'Standard access'
            }
        },
        {
            id: 'route_015',
            name: 'Kandy to Jaffna Direct',
            type: 'Train',
            operator: 'Sri Lanka Railways',
            status: 'On Time',
            departure: '07:00 AM',
            arrival: '02:45 PM',
            duration: '7h 45m',
            price: 1650,
            stops: ['Kandy', 'Kurunegala', 'Anuradhapura', 'Vavuniya', 'Jaffna'],
            frequency: 'Daily',
            image: 'https://images.unsplash.com/photo-1532105956626-9569c03602f6?w=800&q=80',
            description: 'Direct northern connection from the hill capital.',
            realTimeDelay: 0,
            platform: 'K2',
            trainNumber: 'KDY-JAF-505',
            vehicleDetails: {
                model: 'S13 Long Distance',
                capacity: 550,
                features: ['AC Coaches', 'Dining Car', 'Sleeper Options', 'WiFi'],
                accessibility: 'Wheelchair accessible'
            }
        },

        // GALLE TO OTHER CITIES
        {
            id: 'route_016',
            name: 'Galle to Matara Coastal',
            type: 'Bus',
            operator: 'Southern Transport',
            status: 'On Time',
            departure: '08:00 AM',
            arrival: '09:15 AM',
            duration: '1h 15m',
            price: 350,
            stops: ['Galle', 'Unawatuna', 'Weligama', 'Mirissa', 'Matara'],
            frequency: 'Every 30 minutes',
            image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&q=80',
            description: 'Quick coastal hop between southern cities.',
            realTimeDelay: 0,
            platform: 'G3',
            busNumber: 'STH-156',
            vehicleDetails: {
                model: 'TATA Starbus',
                capacity: 48,
                features: ['AC', 'Comfortable Seats', 'Beach-friendly Storage'],
                accessibility: 'Standard access'
            }
        },

        // ADDITIONAL INTERCITY ROUTES
        {
            id: 'route_017',
            name: 'Colombo to Batticaloa East Coast',
            type: 'Bus',
            operator: 'East Express',
            status: 'On Time',
            departure: '09:00 PM',
            arrival: '06:00 AM',
            duration: '9h',
            price: 2100,
            stops: ['Colombo', 'Kegalle', 'Mahiyanganaya', 'Batticaloa'],
            frequency: 'Daily (Night)',
            image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
            description: 'Overnight journey to the Eastern province.',
            realTimeDelay: 0,
            platform: 'D18',
            busNumber: 'EEX-789',
            vehicleDetails: {
                model: 'Mercedes-Benz OH1626',
                capacity: 44,
                features: ['Full AC', 'Sleeper Seats', 'WiFi', 'Entertainment', 'Washroom'],
                accessibility: 'Standard access'
            }
        },
        {
            id: 'route_018',
            name: 'Colombo to Ratnapura Gem City',
            type: 'Bus',
            operator: 'Sabaragamuwa Transport',
            status: 'On Time',
            departure: '06:30 AM',
            arrival: '10:00 AM',
            duration: '3h 30m',
            price: 800,
            stops: ['Colombo', 'Horana', 'Kalawana', 'Ratnapura'],
            frequency: 'Every hour',
            image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
            description: 'Route to the gem capital of Sri Lanka.',
            realTimeDelay: 0,
            platform: 'C12',
            busNumber: 'SAB-445',
            vehicleDetails: {
                model: 'Ashok Leyland Viking',
                capacity: 50,
                features: ['Semi-AC', 'Reclining Seats', 'Luggage Space'],
                accessibility: 'Standard access'
            }
        },
        {
            id: 'route_019',
            name: 'Colombo to Polonnaruwa Ancient City',
            type: 'Bus',
            operator: 'Heritage Express',
            status: 'On Time',
            departure: '07:00 AM',
            arrival: '01:00 PM',
            duration: '6h',
            price: 1400,
            stops: ['Colombo', 'Kurunegala', 'Dambulla', 'Habarana', 'Polonnaruwa'],
            frequency: 'Daily',
            image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
            description: 'Journey to the ancient kingdom ruins.',
            realTimeDelay: 0,
            platform: 'C15',
            busNumber: 'HER-678',
            vehicleDetails: {
                model: 'Volvo B9R',
                capacity: 45,
                features: ['Full AC', 'Reclining Seats', 'WiFi', 'Entertainment', 'Snacks'],
                accessibility: 'Standard access'
            }
        },
        {
            id: 'route_020',
            name: 'Colombo to Hambantota Southern Port',
            type: 'Bus',
            operator: 'Southern Highway Express',
            status: 'On Time',
            departure: '08:30 AM',
            arrival: '12:30 PM',
            duration: '4h',
            price: 1250,
            stops: ['Colombo', 'Matara', 'Tangalle', 'Hambantota'],
            frequency: 'Every 2 hours',
            image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
            description: 'Highway express to the southern port city.',
            realTimeDelay: 0,
            platform: 'A18',
            busNumber: 'SHE-890',
            vehicleDetails: {
                model: 'Scania K360',
                capacity: 48,
                features: ['Full AC', 'Reclining Seats', 'WiFi', 'USB Charging', 'Entertainment'],
                accessibility: 'Wheelchair accessible'
            }
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
            routes: ['route_001', 'route_002', 'route_004', 'route_005', 'route_007', 'route_008', 'route_013']
        },
        {
            id: 'stop_002',
            name: 'Central Bus Stand Colombo',
            type: 'Bus',
            distance: '0.8 km',
            lat: 6.9271,
            lon: 79.8612,
            routes: ['route_003', 'route_006', 'route_009', 'route_010', 'route_011', 'route_012', 'route_017', 'route_018', 'route_019', 'route_020']
        },
        {
            id: 'stop_003',
            name: 'Kandy Railway Station',
            type: 'Train',
            distance: '2.1 km',
            lat: 7.2906,
            lon: 80.6337,
            routes: ['route_001', 'route_002', 'route_007', 'route_008', 'route_015']
        },
        {
            id: 'stop_004',
            name: 'Galle Bus Terminal',
            type: 'Bus',
            distance: '1.5 km',
            lat: 6.0535,
            lon: 80.2210,
            routes: ['route_003', 'route_016']
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
