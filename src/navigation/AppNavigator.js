import { Feather } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { getTheme, SHADOWS } from '../constants/theme';

// Import Screens (Keep your existing imports)
import DetailsScreen from '../screens/DetailsScreen';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ScheduleScreen from '../screens/ScheduleScreen';
import TicketsScreen from '../screens/TicketsScreen';
import TripHistoryScreen from '../screens/TripHistoryScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={HomeScreen} />
      <Stack.Screen
        name="Details"
        component={DetailsScreen}
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTitle: '',
          headerTintColor: 'white',
          headerBackTitleVisible: false // iOS style: hide back text
        }}
      />
    </Stack.Navigator>
  );
}

function AppTabs() {
  const isDark = useSelector(state => state.theme.isDark);
  const COLORS = getTheme(isDark);

  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size, focused }) => {
        let iconName;
        if (route.name === 'Explore') iconName = 'compass';
        else if (route.name === 'Schedule') iconName = 'calendar';
        else if (route.name === 'Wallet') iconName = 'credit-card';
        else if (route.name === 'History') iconName = 'clock';
        else if (route.name === 'Profile') iconName = 'user';

        // iOS Touch: Fill icon when active
        return <Feather name={iconName} size={size} color={color} style={focused ? { opacity: 1 } : { opacity: 0.7 }} />;
      },
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.subText,
      headerShown: false,
      tabBarStyle: {
        position: 'absolute',
        bottom: 25, // Lifted up slightly
        left: 20,
        right: 20,
        borderRadius: 30,
        height: 70,
        paddingBottom: 10, // Push icons up from bottom edge
        paddingTop: 10,
        backgroundColor: COLORS.tabBar,
        borderTopWidth: 0,
        ...SHADOWS.medium
      },
      tabBarLabelStyle: { fontSize: 10, fontWeight: '600', marginBottom: 0 },
      tabBarItemStyle: { height: 50 }
    })}>
      <Tab.Screen name="Explore" component={HomeStack} />
      <Tab.Screen name="Schedule" component={ScheduleScreen} />
      <Tab.Screen name="Wallet" component={TicketsScreen} />
      <Tab.Screen name="History" component={TripHistoryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          <Stack.Screen name="Main" component={AppTabs} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}