// Simulating an API call
export const fetchTransportData = async () => {
  // In a real scenario, you would use axios.get('url')
  // Here we return a promise with mock data to satisfy "Travel/Transport" theme
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, title: 'Colombo to Kandy', type: 'Train', status: 'On Time', image: 'https://images.unsplash.com/photo-1532105956626-9569c03602f6?w=500', price: 'Rs. 500', description: 'Scenic train ride through the mountains.' },
        { id: 2, title: 'Galle Express', type: 'Bus', status: 'Departing Soon', image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=500', price: 'Rs. 800', description: 'Luxury highway bus to the south coast.' },
        { id: 3, title: 'Ella Odyssey', type: 'Train', status: 'Sold Out', image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=500', price: 'Rs. 1200', description: 'Premium tourist train with observation deck.' },
        { id: 4, title: 'Jaffna Night Mail', type: 'Train', status: 'Daily', image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=500', price: 'Rs. 900', description: 'Overnight sleeper transport.' },
      ]);
    }, 1000);
  });
};