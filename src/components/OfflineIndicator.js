import { Feather } from '@expo/vector-icons';
import NetInfo from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { useDispatch } from 'react-redux';
import { setOfflineMode } from '../redux/store';

export default function OfflineIndicator() {
    const [isOffline, setIsOffline] = useState(false);
    const [slideAnim] = useState(new Animated.Value(-60));
    const dispatch = useDispatch();

    useEffect(() => {
        // Subscribe to network state updates
        const unsubscribe = NetInfo.addEventListener(state => {
            const offline = !state.isConnected;
            setIsOffline(offline);
            dispatch(setOfflineMode(offline));

            // Animate banner in/out
            Animated.timing(slideAnim, {
                toValue: offline ? 0 : -60,
                duration: 300,
                useNativeDriver: true,
            }).start();
        });

        return () => unsubscribe();
    }, []);

    if (!isOffline) return null;

    return (
        <Animated.View
            style={[
                styles.container,
                { transform: [{ translateY: slideAnim }] }
            ]}
        >
            <Feather name="wifi-off" size={16} color="white" />
            <Text style={styles.text}>No internet connection</Text>
            <Text style={styles.subtext}>Viewing cached data</Text>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FF3B30',
        paddingVertical: 12,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    text: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 8,
    },
    subtext: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 11,
        marginLeft: 8,
    }
});
