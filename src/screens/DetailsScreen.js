import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { getTheme, SHADOWS } from '../constants/theme';
import { addTripToHistory, bookTicket, toggleFavorite } from '../redux/store';
import { scheduleBookingReminder, sendBookingConfirmation } from '../services/notifications';
import { saveTripHistory } from '../services/storage';

const { height } = Dimensions.get('window');

export default function DetailsScreen({ route, navigation }) {
  const { item } = route.params;
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const favorites = useSelector(state => state.favorites);
  const isDark = useSelector(state => state.theme.isDark);
  const COLORS = getTheme(isDark);
  const isFav = favorites.some(fav => fav.id === item.id);

  const [passengers, setPassengers] = useState(1);
  const totalPrice = item.price * passengers;

  const handleBook = async () => {
    const ticketData = {
      ...item,
      ticketId: Math.floor(Math.random() * 10000) + 1000,
      passengers,
      totalPrice,
      date: new Date().toLocaleDateString(),
      id: Date.now() // Unique ID for history
    };

    // 1. Dispatch to Redux Store (Wallet)
    dispatch(bookTicket(ticketData));

    // 2. Save to Trip History
    dispatch(addTripToHistory(ticketData));
    await saveTripHistory(ticketData);

    // 3. Send booking confirmation notification
    await sendBookingConfirmation(ticketData);

    // 4. Schedule trip reminder (2 hours before - for demo, this is 2 hours from now)
    await scheduleBookingReminder(ticketData, 2);

    // 5. Success Alert with Navigation
    Alert.alert(
      "Booking Successful! 🎟️",
      `Your trip to ${item.name || item.title} has been booked!\n\n✅ Added to Wallet\n✅ Saved to History\n✅ Reminder scheduled`,
      [
        {
          text: "View Wallet",
          onPress: () => navigation.navigate('Wallet')
        },
        {
          text: "View History",
          onPress: () => navigation.navigate('History')
        },
        { text: "OK", style: 'cancel' }
      ]
    );
  };

  const styles = createStyles(COLORS);

  return (
    <View style={styles.container}>
      {/* Added extra paddingBottom to ScrollView to ensure content isn't hidden */}
      <ScrollView contentContainerStyle={{ paddingBottom: 200 }} showsVerticalScrollIndicator={false}>
        <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />

        <View style={styles.content}>
          <View style={styles.indicator} />

          <View style={styles.headerRow}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={styles.title}>{item.title || item.name}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                <Feather name="map-pin" size={14} color={COLORS.primary} />
                <Text style={styles.location}> {item.location ? item.location : 'Sri Lanka'}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.favBtn, isFav && { backgroundColor: COLORS.secondary, borderColor: COLORS.secondary }]}
              onPress={() => dispatch(toggleFavorite(item))}
            >
              <Feather name="heart" size={22} color={isFav ? 'white' : COLORS.subText} />
            </TouchableOpacity>
          </View>

          <View style={styles.ratingRow}>
            <Feather name="star" size={16} color="#FFD700" />
            <Text style={styles.ratingText}> {item.rating ? item.rating : '4.5'} (250+ Reviews)</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionHeader}>About</Text>
          <Text style={styles.desc}>{item.description}</Text>

          {/* Counter */}
          <View style={styles.calcContainer}>
            <View>
              <Text style={styles.calcTitle}>Passengers</Text>
              <Text style={{ fontSize: 12, color: COLORS.subText }}>Adults (12+ yrs)</Text>
            </View>
            <View style={styles.counter}>
              <TouchableOpacity onPress={() => passengers > 1 && setPassengers(p => p - 1)}>
                <View style={styles.countBtn}><Feather name="minus" size={20} color={COLORS.text} /></View>
              </TouchableOpacity>
              <Text style={styles.countText}>{passengers}</Text>
              <TouchableOpacity onPress={() => setPassengers(p => p + 1)}>
                <View style={styles.countBtn}><Feather name="plus" size={20} color={COLORS.text} /></View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* FIX: Footer Position 
         bottom: 110 -> Lifts it ABOVE the floating tab bar (which is usually height 70 + bottom 25)
      */}
      <View style={[styles.footer, { bottom: 110 }]}>
        <View>
          <Text style={styles.totalLabel}>Total Price</Text>
          <Text style={styles.totalPrice}>Rs. {totalPrice.toLocaleString()}</Text>
        </View>
        <TouchableOpacity style={styles.bookBtn} onPress={handleBook}>
          <Text style={styles.bookText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createStyles = (COLORS) => StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  image: { width: '100%', height: height * 0.5 },
  content: { flex: 1, backgroundColor: COLORS.background, marginTop: -60, borderTopLeftRadius: 40, borderTopRightRadius: 40, padding: 25, paddingTop: 15 },
  indicator: { width: 50, height: 5, backgroundColor: COLORS.input, borderRadius: 5, alignSelf: 'center', marginBottom: 20 },

  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  title: { fontSize: 24, fontWeight: '800', color: COLORS.text, lineHeight: 30 },
  location: { color: COLORS.text, fontSize: 14, fontWeight: '600' },
  favBtn: { width: 50, height: 50, borderRadius: 25, backgroundColor: COLORS.card, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.input },

  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  ratingText: { fontWeight: '700', color: COLORS.text, marginLeft: 5 },

  divider: { height: 1, backgroundColor: COLORS.input, marginBottom: 20 },

  sectionHeader: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginBottom: 10 },
  desc: { color: COLORS.subText, lineHeight: 24, fontSize: 15 },

  calcContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 30, backgroundColor: COLORS.card, padding: 20, borderRadius: 20, ...SHADOWS.small },
  calcTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.text },
  counter: { flexDirection: 'row', alignItems: 'center' },
  countBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' },
  countText: { marginHorizontal: 15, fontSize: 18, fontWeight: 'bold', color: COLORS.text },

  // Footer Styles Updated for Visibility
  footer: {
    position: 'absolute',
    left: 20,
    right: 20,
    backgroundColor: COLORS.card,
    padding: 20,
    borderRadius: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...SHADOWS.medium, // Adds shadow to make it pop
    elevation: 10
  },
  totalLabel: { color: COLORS.subText, fontSize: 12, fontWeight: '600', textTransform: 'uppercase' },
  totalPrice: { fontSize: 24, fontWeight: '800', color: COLORS.primary },
  bookBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 35, paddingVertical: 18, borderRadius: 16, ...SHADOWS.medium },
  bookText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});