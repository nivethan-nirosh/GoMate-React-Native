import { Feather } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { getTheme, SHADOWS } from '../constants/theme';
import { setUser } from '../redux/store'; // Import action
import { fetchDestinations, fetchTransportSchedule, fetchUserProfile } from '../services/api';

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();

  // READ FROM REDUX (Single Source of Truth)
  const userProfile = useSelector(state => state.auth.userProfile);
  const isDark = useSelector(state => state.theme.isDark);
  const COLORS = getTheme(isDark);

  const [destinations, setDestinations] = useState([]);
  const [transport, setTransport] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch Data
        const [destData, transData, userData] = await Promise.all([
          fetchDestinations(),
          fetchTransportSchedule(),
          fetchUserProfile()
        ]);

        setDestinations(destData);
        setTransport(transData);

        // Update Redux with API user data (only if name is generic 'Traveler')
        if (userData && userProfile.name === 'Traveler') {
          dispatch(setUser(userData));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const styles = createStyles(COLORS);

  const renderDestination = ({ item }) => (
    <TouchableOpacity
      style={styles.destCard}
      activeOpacity={0.9}
      onPress={() => navigation.navigate('Details', { item })}
    >
      <Image source={{ uri: item.image }} style={styles.destImage} />
      <View style={styles.destOverlay}>
        <Text style={styles.destName}>{item.name}</Text>
        <View style={styles.locationRow}>
          <Feather name="map-pin" size={10} color="white" />
          <Text style={styles.locationText}> {item.location}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderTransport = ({ item }) => (
    <TouchableOpacity
      style={styles.transCard}
      activeOpacity={0.9}
      onPress={() => navigation.navigate('Details', { item })}
    >
      <Image source={{ uri: item.image }} style={styles.transImage} />
      <View style={styles.transContent}>
        <View style={styles.rowBetween}>
          <Text style={styles.transTitle} numberOfLines={1}>{item.title}</Text>
          <View style={[
            styles.statusBadge,
            { backgroundColor: item.status === 'On Time' ? COLORS.successBg : item.status === 'Delayed' ? COLORS.dangerBg : COLORS.warningBg }
          ]}>
            <Text style={[
              styles.statusText,
              { color: item.status === 'On Time' ? COLORS.success : item.status === 'Delayed' ? COLORS.danger : COLORS.warning }
            ]}>{item.status}</Text>
          </View>
        </View>

        <View style={styles.rowBetween}>
          <View style={styles.iconRow}>
            <Feather name={item.type === 'Train' ? 'anchor' : 'truck'} size={14} color={COLORS.subText} />
            <Text style={styles.subText}> {item.type} • {item.time}</Text>
          </View>
          <Text style={styles.price}>Rs. {item.price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <FlatList
        data={transport}
        keyExtractor={item => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        ListHeaderComponent={() => (
          <>
            {/* Header */}
            <View style={styles.header}>
              <View>
                {/* DYNAMIC NAME FROM REDUX */}
                <Text style={styles.greeting}>Ayubowan, {userProfile.name.split(' ')[0]}! 🇱🇰</Text>
                <Text style={styles.subHeader}>Where would you like to go?</Text>
              </View>
              <TouchableOpacity style={styles.profileBtn} onPress={() => navigation.navigate('Profile')}>
                <Image source={{ uri: userProfile.avatar }} style={{ width: '100%', height: '100%', borderRadius: 25 }} />
              </TouchableOpacity>
            </View>

            {/* Destinations */}
            <Text style={styles.sectionTitle}>Popular Destinations</Text>
            <FlatList
              data={destinations}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={renderDestination}
              keyExtractor={item => item.id.toString()}
              contentContainerStyle={styles.horizontalList}
              style={{ marginBottom: 25 }}
            />

            {/* Transport Header */}
            <View style={styles.rowBetweenHeader}>
              <Text style={styles.sectionTitle}>Available Transport</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Schedule')}>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
        renderItem={renderTransport}
      />
    </View>
  );
}

// Create dynamic styles function
const createStyles = (COLORS) => StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingHorizontal: 20, paddingVertical: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greeting: { fontSize: 24, fontWeight: '800', color: COLORS.text },
  subHeader: { fontSize: 15, color: COLORS.subText, marginTop: 4 },
  profileBtn: { width: 50, height: 50, borderRadius: 25, borderWidth: 2, borderColor: COLORS.card, ...SHADOWS.small },

  sectionTitle: { fontSize: 20, fontWeight: '700', color: COLORS.text, marginLeft: 20, marginBottom: 15 },
  horizontalList: { paddingLeft: 20, paddingRight: 10 },
  rowBetweenHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginRight: 20, marginBottom: 10 },
  seeAll: { color: COLORS.primary, fontWeight: '600' },

  destCard: { width: 200, height: 260, marginRight: 15, borderRadius: 24, backgroundColor: COLORS.card, overflow: 'hidden', ...SHADOWS.medium },
  destImage: { width: '100%', height: '100%' },
  destOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 15, paddingTop: 50, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.2)' },
  destName: { color: 'white', fontWeight: '800', fontSize: 20, textShadowColor: 'rgba(0,0,0,0.5)', textShadowRadius: 10 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  locationText: { color: '#f0f0f0', fontSize: 12, fontWeight: '600' },

  transCard: { backgroundColor: COLORS.card, marginHorizontal: 20, marginBottom: 15, borderRadius: 20, padding: 12, flexDirection: 'row', ...SHADOWS.small },
  transImage: { width: 90, height: 90, borderRadius: 16, backgroundColor: COLORS.input },
  transContent: { flex: 1, paddingLeft: 15, justifyContent: 'center' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  transTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.text, maxWidth: '75%' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusText: { fontSize: 10, fontWeight: '800' },
  iconRow: { flexDirection: 'row', alignItems: 'center' },
  subText: { color: COLORS.subText, fontSize: 12 },
  price: { color: COLORS.primary, fontWeight: 'bold', fontSize: 16 },
});