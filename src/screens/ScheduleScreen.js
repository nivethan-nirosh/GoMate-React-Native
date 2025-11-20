import { Feather } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { getTheme, SHADOWS } from '../constants/theme';
import { fetchTransportSchedule } from '../services/api'; // Import API

export default function ScheduleScreen({ navigation }) {
    const insets = useSafeAreaInsets();
    const [transportData, setTransportData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All'); // All, Train, Bus
    const [search, setSearch] = useState('');
    const isDark = useSelector(state => state.theme.isDark);
    const COLORS = getTheme(isDark);
    const styles = createStyles(COLORS);

    // Fetch data when screen loads
    useEffect(() => {
        const loadData = async () => {
            const data = await fetchTransportSchedule();
            setTransportData(data);
            setLoading(false);
        };
        loadData();
    }, []);

    // Filter Logic
    const filteredData = transportData.filter(item => {
        const matchesType = filter === 'All' || item.type === filter;
        const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
        return matchesType && matchesSearch;
    });

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Explore', { screen: 'Details', params: { item } })}
        >
            <View style={styles.cardLeft}>
                <Text style={styles.time}>{item.time}</Text>
                <View style={styles.line} />
            </View>
            <View style={styles.cardRight}>
                <View style={styles.row}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Feather name="chevron-right" size={20} color={COLORS.subText} />
                </View>
                <View style={styles.tags}>
                    <View style={styles.tag}>
                        <Feather name={item.type === 'Train' ? 'anchor' : 'truck'} size={12} color={COLORS.subText} />
                        <Text style={styles.tagText}>{item.type}</Text>
                    </View>
                    <Text style={styles.price}>Rs. {item.price}</Text>
                </View>
                <Text style={[styles.status, { color: item.status === 'On Time' ? COLORS.success : COLORS.warning }]}>
                    {item.status}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Search Header */}
            <View style={styles.header}>
                <Text style={styles.heading}>Schedules</Text>
                <View style={styles.searchBox}>
                    <Feather name="search" size={20} color={COLORS.subText} />
                    <TextInput
                        style={styles.input}
                        placeholder="Search (e.g. Kandy)"
                        placeholderTextColor={COLORS.subText}
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>
                {/* Filter Tabs */}
                <View style={styles.filters}>
                    {['All', 'Train', 'Bus'].map(type => (
                        <TouchableOpacity
                            key={type}
                            style={[styles.filterChip, filter === type && styles.activeChip]}
                            onPress={() => setFilter(type)}
                        >
                            <Text style={[styles.filterText, filter === type && styles.activeFilterText]}>{type}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 20 }} />
            ) : (
                <FlatList
                    data={filteredData}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
}

const createStyles = (COLORS) => StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    header: { backgroundColor: COLORS.background, padding: 20, paddingBottom: 10 },
    heading: { fontSize: 28, fontWeight: '800', color: COLORS.text, marginBottom: 15 },
    searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, borderRadius: 12, paddingHorizontal: 15, height: 50, marginBottom: 15, ...SHADOWS.small },
    input: { flex: 1, marginLeft: 10, height: '100%', fontSize: 16, color: COLORS.text },
    filters: { flexDirection: 'row' },
    filterChip: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, backgroundColor: COLORS.card, marginRight: 10, borderWidth: 1, borderColor: COLORS.input },
    activeChip: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
    filterText: { color: COLORS.subText, fontWeight: '600' },
    activeFilterText: { color: 'white' },
    list: { padding: 20, paddingBottom: 100 },

    // List Item
    card: { flexDirection: 'row', marginBottom: 20 },
    cardLeft: { alignItems: 'center', marginRight: 15, width: 60 },
    time: { fontWeight: 'bold', color: COLORS.text, fontSize: 12 },
    line: { width: 2, flex: 1, backgroundColor: COLORS.input, marginTop: 5, borderRadius: 1 },
    cardRight: { flex: 1, backgroundColor: COLORS.card, padding: 15, borderRadius: 16, ...SHADOWS.small },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
    title: { fontSize: 16, fontWeight: 'bold', color: COLORS.text },
    tags: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
    tag: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.input, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    tagText: { fontSize: 12, color: COLORS.subText, marginLeft: 5 },
    price: { fontWeight: 'bold', color: COLORS.primary },
    status: { fontSize: 10, fontWeight: 'bold', marginTop: 8, alignSelf: 'flex-start' }
});