import axios from 'axios';

// 1. REAL USER DATA (Keep this, it works well)
export const fetchUserProfile = async () => {
  try {
    const response = await axios.get('https://randomuser.me/api/?gender=male');
    const result = response.data.results[0];
    return {
      name: `${result.name.first} ${result.name.last}`,
      email: result.email,
      avatar: result.picture.large,
      location: `Colombo, Sri Lanka`
    };
  } catch (error) {
    console.error("Error fetching user", error);
    return { name: 'Traveler', avatar: 'https://via.placeholder.com/150' };
  }
};

// 2. SIMULATED API: DESTINATIONS (Real Sri Lankan Images)
export const fetchDestinations = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 101,
          name: 'Ella',
          title: 'Nine Arch Bridge, Ella',
          location: 'Badulla District',
          image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
          rating: 4.9,
          price: 4500,
          description: 'Experience the breathtaking views of the Nine Arch Bridge and the lush green tea plantations. A hiker\'s paradise.',
          type: 'Destination'
        },
        {
          id: 103,
          name: 'Mirissa',
          title: 'Mirissa Beach',
          location: 'Southern Province',
          image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
          rating: 4.7,
          price: 3500,
          description: 'Famous for whale watching and surfing. Relax on the coconut-lined beaches and enjoy the sunset.',
          type: 'Destination'
        },
        {
          id: 104,
          name: 'Galle',
          title: 'Galle Dutch Fort',
          location: 'Southern Province',
          image: 'https://images.unsplash.com/photo-1598977123118-4e30ba3c4f5b?w=800&q=80',
          rating: 4.6,
          price: 2000,
          description: 'Walk through the historic streets of the Galle Fort, filled with colonial architecture, cafes, and boutiques.',
          type: 'Destination'
        },
        {
          id: 105,
          name: 'Kandy',
          title: 'Temple of the Tooth',
          location: 'Central Province',
          image: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=800&q=80',
          rating: 4.8,
          price: 3000,
          description: 'Visit the sacred Temple of the Tooth Relic and explore the beautiful Kandy Lake. Cultural capital of Sri Lanka.',
          type: 'Destination'
        },
        {
          id: 106,
          name: 'Nuwara Eliya',
          title: 'Little England',
          location: 'Central Province',
          image: 'https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=800&q=80',
          rating: 4.7,
          price: 5000,
          description: 'Experience the cool climate, tea estates, and colonial architecture. Perfect for a relaxing hill country getaway.',
          type: 'Destination'
        }
      ]);
    }, 1000); // Simulate network delay
  });
};

// 3. SIMULATED API: TRANSPORT (Real Sri Lankan Context)
export const fetchTransportSchedule = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          title: 'Colombo to Badulla',
          type: 'Train',
          status: 'On Time',
          time: '05:55 AM',
          price: 1200,
          image: 'https://images.unsplash.com/photo-1532105956626-9569c03602f6?w=800&q=80',
          description: 'The famous "Udarata Menike" scenic train ride through tea plantations and mountains.'
        },
        {
          id: 2,
          title: 'Southern Expressway',
          type: 'Bus',
          status: 'Departing Soon',
          time: '08:30 AM',
          price: 950,
          image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80', // Luxury Bus
          description: 'Luxury air-conditioned highway bus. Fastest way to Galle and Matara.'
        },
        {
          id: 3,
          title: 'Yal Devi (Jaffna)',
          type: 'Train',
          status: 'Delayed',
          time: '06:45 AM',
          price: 1500,
          image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800&q=80',
          description: 'Long-distance express train connecting the capital to the Northern peninsula.'
        },
        {
          id: 4,
          title: 'Kandy Intercity',
          type: 'Bus',
          status: 'On Time',
          time: '10:00 AM',
          price: 600,
          image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&q=80',
          description: 'AC Intercity bus. Quick and comfortable ride to the hill capital.'
        },
      ]);
    }, 1500);
  });
};