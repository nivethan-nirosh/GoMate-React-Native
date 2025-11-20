import { Feather } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { getTheme, SHADOWS } from '../constants/theme';
import { getOfflineData, saveOfflineData } from '../services/storage';
import { clearTransportCache, fetchLiveTransportSchedule } from '../services/transportApi';

export default function ScheduleScreen({ navigation }) {
    const insets = useSafeAreaInsets();
    const [transportData, setTransportData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [filter, setFilter] = useState('All'); // All, Train, Bus
    const [search, setSearch] = useState('');
    const [lastUpdated, setLastUpdated] = useState(null);
    const isDark = useSelector(state => state.theme.isDark);
    const isOffline = useSelector(state => state.offlineMode.isOffline);
    const COLORS = getTheme(isDark);
    const styles = createStyles(COLORS);

    // Fetch data when screen loads
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async (isRefresh = false) => {
        try {
            if (!isRefresh) setLoading(true);

            // Try to fetch live data
            const data = await fetchLiveTransportSchedule();
            setTransportData(data);
            setLastUpdated(new Date());

            // Cache data for offline use
            await saveOfflineData('transportSchedule', data);
        } catch (error) {
            console.error('Error loading transport data:', error);

            // Try to load from cache if online fetch fails
            const cachedData = await getOfflineData('transportSchedule');
            if (cachedData) {
                setTransportData(cachedData);
                console.log('📦 Loaded cached transport data');
            }
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        clearTransportCache(); // Clear API cache to force fresh data
        await loadData(true);
    };

    // Filter Logic
    const filteredData = transportData.filter(item => {
        const matchesType = filter === 'All' || item.type === filter;
        const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
        return matchesType && matchesSearch;
    });

    const getStatusColor = (status) => {
        if (status === 'On Time') return COLORS.success;
        if (status === 'Delayed') return COLORS.danger;
        return COLORS.warning;
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Explore', { screen: 'Details', params: { item } })}
        >
            <View style={styles.cardLeft}>
                <Text style={styles.time}>{item.departure}</Text>
                <View style={styles.line} />
            </View>
            <View style={styles.cardRight}>
                <View style={styles.row}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.title} numberOfLines={1}>{item.name}</Text>
                        {item.realTimeDelay > 0 && (
                            <Text style={[styles.delayText, { color: COLORS.danger }]}>
                                +{item.realTimeDelay} min delay
                            </Text>
                        )}
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
                        <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                            {item.status}
                        </Text>
                    </View>
                </View>
                <View style={styles.tags}>
                    <View style={styles.tag}>
                        <Feather name={item.type === 'Train' ? 'anchor' : 'truck'} size={12} color={COLORS.subText} />
                        <Text style={styles.tagText}>{item.type} • {item.operator}</Text>
                    </View>
                    <Text style={styles.price}>Rs. {item.price}</Text>
                </View>
                {item.platform && (
                    <Text style={styles.platformText}>Platform: {item.platform}</Text>
                )}
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Search Header */}
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <Text style={styles.heading}>Live Schedules</Text>
                    {lastUpdated && (
                        <Text style={styles.lastUpdated}>
                            Updated: {lastUpdated.toLocaleTimeString()}
                        </Text>
                    )}
                </View>
                <View style={styles.searchBox}>
                    <Feather name="search" size={20} color={COLORS.subText} />
                    <TextInput
                        style={styles.input}
                        placeholder="Search routes..."
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
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={[styles.loadingText, { color: COLORS.subText }]}>Loading live schedules...</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredData}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                            tintColor={COLORS.primary}
                            colors={[COLORS.primary]}
                        />
                    }
                    ListEmptyComponent={() => (
                        <View style={styles.emptyContainer}>
                            <Feather name="inbox" size={60} color={COLORS.input} />
                            <Text style={[styles.emptyText, { color: COLORS.subText }]}>No routes found</Text>
                        </View>
                    )}
                />
            )}
        </View>
    );
}

const createStyles = (COLORS) => StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    header: { backgroundColor: COLORS.background, padding: 20, paddingBottom: 10 },
    headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    heading: { fontSize: 28, fontWeight: '800', color: COLORS.text },
    lastUpdated: { fontSize: 11, color: COLORS.subText, fontWeight: '600' },
    searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, borderRadius: 12, paddingHorizontal: 15, height: 50, marginBottom: 15, ...SHADOWS.small },
    input: { flex: 1, marginLeft: 10, height: '100%', fontSize: 16, color: COLORS.text },
    filters: { flexDirection: 'row' },
    filterChip: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, backgroundColor: COLORS.card, marginRight: 10, borderWidth: 1, borderColor: COLORS.input },
    activeChip: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
    filterText: { color: COLORS.subText, fontWeight: '600' },
    activeFilterText: { color: 'white' },
    list: { padding: 20, paddingBottom: 100 },

    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 10, fontSize: 14 },

    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 60 },
    emptyText: { marginTop: 15, fontSize: 16 },

    // List Item
    card: { flexDirection: 'row', marginBottom: 20 },
    cardLeft: { alignItems: 'center', marginRight: 15, width: 60 },
    time: { fontWeight: 'bold', color: COLORS.text, fontSize: 12 },
    line: { width: 2, flex: 1, backgroundColor: COLORS.input, marginTop: 5, borderRadius: 1 },
    cardRight: { flex: 1, backgroundColor: COLORS.card, padding: 15, borderRadius: 16, ...SHADOWS.small },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
    title: { fontSize: 16, fontWeight: 'bold', color: COLORS.text },
    delayText: { fontSize: 11, fontWeight: '600', marginTop: 2 },
    statusBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
    statusText: { fontSize: 10, fontWeight: '800' },
    tags: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
    tag: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.input, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    tagText: { fontSize: 11, color: COLORS.subText, marginLeft: 5 },
    price: { fontWeight: 'bold', color: COLORS.primary, fontSize: 15 },
    platformText: { fontSize: 11, color: COLORS.subText, marginTop: 6, fontWeight: '600' }
});