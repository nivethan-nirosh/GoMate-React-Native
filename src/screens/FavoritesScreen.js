import { Feather } from '@expo/vector-icons';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { getTheme, SHADOWS } from '../constants/theme';
import { toggleFavorite } from '../redux/store';

export default function FavoritesScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const favorites = useSelector(state => state.favorites);
  const isDark = useSelector(state => state.theme.isDark);
  const COLORS = getTheme(isDark);
  const dispatch = useDispatch();
  const styles = createStyles(COLORS);

  if (favorites.length === 0) {
    return (
      <View style={styles.center}>
        <Feather name="heart" size={60} color={COLORS.input} />
        <Text style={styles.emptyText}>No Favorites Yet</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={() => navigation.navigate('Explore', { screen: 'Details', params: { item } })}
    >
      <Image source={{ uri: item.image }} style={styles.thumb} />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{item.title || item.name}</Text>
        <Text style={styles.subtitle}>{item.location || item.time || 'Sri Lanka'}</Text>
        <Text style={styles.price}>Rs. {item.price}</Text>
      </View>
      <TouchableOpacity
        style={styles.removeBtn}
        onPress={() => dispatch(toggleFavorite(item))}
      >
        <Feather name="trash-2" size={18} color={COLORS.danger} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.heading}>Favorites</Text>
      </View>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 20 }}
      />
    </View>
  );
}

const createStyles = (COLORS) => StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingHorizontal: 20, paddingBottom: 10 },
  heading: { fontSize: 28, fontWeight: '800', color: COLORS.text },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  emptyText: { marginTop: 20, color: COLORS.subText, fontSize: 16 },

  card: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, backgroundColor: COLORS.card, padding: 12, borderRadius: 16, ...SHADOWS.small },
  thumb: { width: 70, height: 70, borderRadius: 12, backgroundColor: COLORS.input },
  content: { flex: 1, marginLeft: 15 },
  title: { fontSize: 16, fontWeight: 'bold', color: COLORS.text },
  subtitle: { color: COLORS.subText, fontSize: 12, marginTop: 2 },
  price: { color: COLORS.primary, fontWeight: '700', marginTop: 4 },

  removeBtn: { padding: 10 }
});