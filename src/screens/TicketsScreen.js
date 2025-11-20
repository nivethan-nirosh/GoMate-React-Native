import { Feather } from '@expo/vector-icons';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { getTheme, SHADOWS } from '../constants/theme';

export default function TicketsScreen() {
    const insets = useSafeAreaInsets();
    const tickets = useSelector(state => state.tickets);
    const isDark = useSelector(state => state.theme.isDark);
    const COLORS = getTheme(isDark);
    const styles = createStyles(COLORS);

    if (tickets.length === 0) {
        return (
            <View style={styles.center}>
                <Feather name="credit-card" size={60} color={COLORS.input} />
                <Text style={styles.emptyText}>No Upcoming Trips</Text>
                <Text style={styles.subEmpty}>Book a trip to see it here</Text>
            </View>
        );
    }

    const renderTicket = ({ item }) => (
        <View style={styles.ticketContainer}>
            <View style={styles.ticket}>
                {/* Top: Header with Image */}
                <View style={styles.top}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.route}>{item.title || item.name}</Text>
                        <Text style={styles.date}>{item.date} • {item.time || 'Anytime'}</Text>
                    </View>
                    <View style={styles.iconCircle}>
                        <Feather name={item.type === 'Bus' ? 'truck' : 'anchor'} size={20} color={COLORS.primary} />
                    </View>
                </View>

                {/* Middle: Dashed Line */}
                <View style={styles.divider}>
                    <View style={styles.circleLeft} />
                    <View style={styles.dashedLine} />
                    <View style={styles.circleRight} />
                </View>

                {/* Bottom: Details */}
                <View style={styles.bottom}>
                    <View style={styles.row}>
                        <View style={styles.detailCol}>
                            <Text style={styles.label}>PASSENGERS</Text>
                            <Text style={styles.value}>0{item.passengers}</Text>
                        </View>
                        <View style={styles.detailCol}>
                            <Text style={styles.label}>SEAT</Text>
                            <Text style={styles.value}>--</Text>
                        </View>
                        <View style={styles.detailCol}>
                            <Text style={styles.label}>CLASS</Text>
                            <Text style={styles.value}>STD</Text>
                        </View>
                    </View>

                    <View style={styles.totalRow}>
                        <View>
                            <Text style={styles.label}>TOTAL PRICE</Text>
                            <Text style={styles.totalPrice}>Rs. {item.totalPrice.toLocaleString()}</Text>
                        </View>
                        <View style={styles.qrCode}>
                            <Feather name="grid" size={24} color="black" />
                        </View>
                    </View>

                    <Text style={styles.ticketId}>TICKET ID: #{item.ticketId}</Text>
                </View>
            </View>
        </View>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <Text style={styles.heading}>My Wallet</Text>
            </View>
            <FlatList
                data={tickets}
                renderItem={renderTicket}
                keyExtractor={item => item.ticketId.toString()}
                contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
            />
        </View>
    );
}

const createStyles = (COLORS) => StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    header: { paddingHorizontal: 20, paddingBottom: 10 },
    heading: { fontSize: 28, fontWeight: '800', color: COLORS.text },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
    emptyText: { marginTop: 20, color: COLORS.text, fontSize: 18, fontWeight: 'bold' },
    subEmpty: { marginTop: 5, color: COLORS.subText, fontSize: 14 },

    ticketContainer: { marginBottom: 20, ...SHADOWS.medium },
    ticket: { backgroundColor: COLORS.card, borderRadius: 16, overflow: 'hidden' },

    top: { padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.card },
    route: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: 5 },
    date: { color: COLORS.subText, fontSize: 14 },
    iconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.input, justifyContent: 'center', alignItems: 'center' },

    divider: { height: 20, flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card },
    circleLeft: { width: 20, height: 20, borderRadius: 10, backgroundColor: COLORS.background, marginLeft: -10 },
    circleRight: { width: 20, height: 20, borderRadius: 10, backgroundColor: COLORS.background, marginRight: -10 },
    dashedLine: { flex: 1, height: 1, borderWidth: 1, borderColor: COLORS.input, borderStyle: 'dashed', borderRadius: 1 },

    bottom: { padding: 20, paddingTop: 10 },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    detailCol: { alignItems: 'flex-start' },
    label: { fontSize: 10, color: COLORS.subText, marginBottom: 4, fontWeight: '600' },
    value: { fontSize: 16, fontWeight: 'bold', color: COLORS.text },

    totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: COLORS.input, paddingTop: 15 },
    totalPrice: { fontSize: 20, fontWeight: '800', color: COLORS.primary },
    qrCode: { width: 50, height: 50, backgroundColor: COLORS.warning, justifyContent: 'center', alignItems: 'center', borderRadius: 8 },

    ticketId: { marginTop: 15, textAlign: 'center', color: COLORS.subText, fontSize: 10 }
});