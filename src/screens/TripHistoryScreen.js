import { Feather } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Alert, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { getTheme, SHADOWS } from '../constants/theme';
import { deleteTripFromHistory as deleteFromRedux, setTripHistory } from '../redux/store';
import { deleteTripFromHistory, getTripHistory, getTripStatistics } from '../services/storage';

export default function TripHistoryScreen() {
    const insets = useSafeAreaInsets();
    const dispatch = useDispatch();
    const isDark = useSelector(state => state.theme.isDark);
    const COLORS = getTheme(isDark);
    const styles = createStyles(COLORS);

    const tripHistory = useSelector(state => state.tripHistory.trips);
    const statistics = useSelector(state => state.tripHistory.statistics);

    const [filter, setFilter] = useState('All'); // All, Train, Bus
    const [stats, setStats] = useState(null);

    useEffect(() => {
        loadHistory();
        loadStatistics();
    }, []);

    const loadHistory = async () => {
        const history = await getTripHistory();
        dispatch(setTripHistory(history));
    };

    const loadStatistics = async () => {
        const tripStats = await getTripStatistics();
        setStats(tripStats);
    };

    const handleDelete = (tripId) => {
        Alert.alert(
            'Delete Trip',
            'Are you sure you want to remove this trip from history?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        await deleteTripFromHistory(tripId);
                        dispatch(deleteFromRedux(tripId));
                        loadStatistics(); // Refresh stats
                    }
                }
            ]
        );
    };

    const filteredTrips = tripHistory.filter(trip => {
        if (filter === 'All') return true;
        return trip.type === filter;
    });

    const renderStatCard = (icon, label, value, color) => (
        <View style={[styles.statCard, { backgroundColor: COLORS.card }]}>
            <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
                <Feather name={icon} size={24} color={color} />
            </View>
            <Text style={[styles.statValue, { color: COLORS.text }]}>{value}</Text>
            <Text style={[styles.statLabel, { color: COLORS.subText }]}>{label}</Text>
        </View>
    );

    const renderTrip = ({ item, index }) => (
        <View style={styles.tripContainer}>
            {/* Timeline connector */}
            {index !== filteredTrips.length - 1 && <View style={[styles.timelineConnector, { backgroundColor: COLORS.input }]} />}

            <View style={styles.tripCard}>
                {/* Timeline dot */}
                <View style={[styles.timelineDot, { backgroundColor: COLORS.primary }]}>
                    <Feather
                        name={item.type === 'Train' ? 'anchor' : 'truck'}
                        size={14}
                        color="white"
                    />
                </View>

                {/* Trip content */}
                <View style={[styles.tripContent, { backgroundColor: COLORS.card }]}>
                    <View style={styles.tripHeader}>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.tripTitle, { color: COLORS.text }]} numberOfLines={1}>
                                {item.name || item.title}
                            </Text>
                            <Text style={[styles.tripDate, { color: COLORS.subText }]}>
                                {item.date} • {item.time || item.departure || 'Anytime'}
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={styles.deleteBtn}
                            onPress={() => handleDelete(item.id)}
                        >
                            <Feather name="trash-2" size={18} color={COLORS.danger} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.tripDetails}>
                        <View style={styles.tripDetailRow}>
                            <Feather name="users" size={14} color={COLORS.subText} />
                            <Text style={[styles.tripDetailText, { color: COLORS.subText }]}>
                                {item.passengers || 1} passenger{(item.passengers || 1) > 1 ? 's' : ''}
                            </Text>
                        </View>
                        <View style={styles.tripDetailRow}>
                            <Feather name="credit-card" size={14} color={COLORS.subText} />
                            <Text style={[styles.tripDetailText, { color: COLORS.primary }]}>
                                Rs. {(item.totalPrice || item.price || 0).toLocaleString()}
                            </Text>
                        </View>
                    </View>

                    {item.ticketId && (
                        <Text style={[styles.ticketId, { color: COLORS.subText }]}>
                            Ticket #{item.ticketId}
                        </Text>
                    )}
                </View>
            </View>
        </View>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top, backgroundColor: COLORS.background }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={[styles.heading, { color: COLORS.text }]}>Trip History</Text>
                    <Text style={[styles.subheading, { color: COLORS.subText }]}>
                        Your travel journey
                    </Text>
                </View>

                {/* Statistics */}
                {stats && (
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.statsContainer}
                    >
                        {renderStatCard('map-pin', 'Total Trips', statistics.totalTrips, COLORS.primary)}
                        {renderStatCard('dollar-sign', 'Total Spent', `Rs. ${statistics.totalSpent.toLocaleString()}`, COLORS.success)}
                        {renderStatCard('anchor', 'Train Trips', statistics.trainTrips, '#FF9500')}
                        {renderStatCard('truck', 'Bus Trips', statistics.busTrips, '#FF2D55')}
                    </ScrollView>
                )}

                {/* Filters */}
                <View style={styles.filtersContainer}>
                    {['All', 'Train', 'Bus'].map(type => (
                        <TouchableOpacity
                            key={type}
                            style={[
                                styles.filterChip,
                                { backgroundColor: COLORS.card, borderColor: COLORS.input },
                                filter === type && { backgroundColor: COLORS.primary, borderColor: COLORS.primary }
                            ]}
                            onPress={() => setFilter(type)}
                        >
                            <Text style={[
                                styles.filterText,
                                { color: COLORS.subText },
                                filter === type && { color: 'white' }
                            ]}>
                                {type}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Trip List */}
                {filteredTrips.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Feather name="clock" size={60} color={COLORS.input} />
                        <Text style={[styles.emptyText, { color: COLORS.text }]}>No trips yet</Text>
                        <Text style={[styles.emptySubtext, { color: COLORS.subText }]}>
                            Your booked trips will appear here
                        </Text>
                    </View>
                ) : (
                    <View style={styles.timelineContainer}>
                        <FlatList
                            data={filteredTrips}
                            renderItem={renderTrip}
                            keyExtractor={item => item.id.toString()}
                            scrollEnabled={false}
                            contentContainerStyle={{ paddingBottom: 20 }}
                        />
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const createStyles = (COLORS) => StyleSheet.create({
    container: { flex: 1 },
    header: { padding: 20, paddingBottom: 10 },
    heading: { fontSize: 28, fontWeight: '800' },
    subheading: { fontSize: 14, marginTop: 4 },

    // Statistics
    statsContainer: { paddingHorizontal: 20, paddingVertical: 10 },
    statCard: {
        width: 140,
        padding: 16,
        borderRadius: 16,
        marginRight: 12,
        alignItems: 'center',
        ...SHADOWS.small
    },
    statIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10
    },
    statValue: { fontSize: 20, fontWeight: '800', marginBottom: 4 },
    statLabel: { fontSize: 11, fontWeight: '600', textAlign: 'center' },

    // Filters
    filtersContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 15
    },
    filterChip: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 10,
        borderWidth: 1
    },
    filterText: { fontSize: 14, fontWeight: '600' },

    // Timeline
    timelineContainer: { paddingHorizontal: 20 },
    tripContainer: { position: 'relative', marginBottom: 20 },
    timelineConnector: {
        position: 'absolute',
        left: 16,
        top: 40,
        bottom: -20,
        width: 2
    },
    timelineDot: {
        position: 'absolute',
        left: 0,
        top: 20,
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1
    },

    // Trip Card
    tripCard: { marginLeft: 45 },
    tripContent: {
        padding: 16,
        borderRadius: 16,
        ...SHADOWS.small
    },
    tripHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12
    },
    tripTitle: { fontSize: 16, fontWeight: 'bold' },
    tripDate: { fontSize: 12, marginTop: 4 },
    deleteBtn: { padding: 4 },

    tripDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8
    },
    tripDetailRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    tripDetailText: {
        fontSize: 13,
        marginLeft: 6,
        fontWeight: '600'
    },
    ticketId: {
        fontSize: 10,
        marginTop: 8,
        fontWeight: '600'
    },

    // Empty State
    emptyContainer: {
        alignItems: 'center',
        paddingTop: 60,
        paddingHorizontal: 40
    },
    emptyText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20
    },
    emptySubtext: {
        fontSize: 14,
        marginTop: 8,
        textAlign: 'center'
    }
});
