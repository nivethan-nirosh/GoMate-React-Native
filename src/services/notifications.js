// Push Notifications Service using Expo Notifications
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification behavior
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

/**
 * Request notification permissions
 * @returns {boolean} Permission granted status
 */
export const requestNotificationPermissions = async () => {
    try {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            console.log('❌ Notification permission not granted');
            return false;
        }

        console.log('✅ Notification permission granted');

        // Configure notification channel for Android
        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#007AFF',
            });
        }

        return true;
    } catch (error) {
        console.error('❌ Error requesting notification permissions:', error);
        return false;
    }
};

/**
 * Send booking confirmation notification
 * @param {Object} trip - Trip details
 */
export const sendBookingConfirmation = async (trip) => {
    try {
        const hasPermission = await requestNotificationPermissions();
        if (!hasPermission) return;

        await Notifications.scheduleNotificationAsync({
            content: {
                title: '🎫 Booking Confirmed!',
                body: `Your trip to ${trip.name || trip.title} has been booked successfully. Ticket ID: #${trip.ticketId}`,
                data: { trip, type: 'booking_confirmation' },
                sound: true,
            },
            trigger: null, // Send immediately
        });

        console.log('✅ Booking confirmation sent');
    } catch (error) {
        console.error('❌ Error sending booking confirmation:', error);
    }
};

/**
 * Schedule trip reminder notification
 * @param {Object} trip - Trip details
 * @param {number} hoursBefore - Hours before trip to send reminder (default: 2)
 */
export const scheduleBookingReminder = async (trip, hoursBefore = 2) => {
    try {
        const hasPermission = await requestNotificationPermissions();
        if (!hasPermission) return;

        // Calculate trigger time (hoursBefore hours from now for demo purposes)
        // In production, you'd parse trip.time and calculate actual time
        const triggerSeconds = hoursBefore * 60 * 60;

        const notificationId = await Notifications.scheduleNotificationAsync({
            content: {
                title: '⏰ Trip Reminder',
                body: `Your ${trip.type || 'trip'} to ${trip.name || trip.title} is departing in ${hoursBefore} hours. Don't forget your ticket!`,
                data: { trip, type: 'trip_reminder' },
                sound: true,
            },
            trigger: {
                seconds: triggerSeconds,
            },
        });

        console.log(`✅ Trip reminder scheduled (ID: ${notificationId})`);
        return notificationId;
    } catch (error) {
        console.error('❌ Error scheduling trip reminder:', error);
        return null;
    }
};

/**
 * Schedule departure alert
 * @param {Object} trip - Trip details
 * @param {number} minutesBefore - Minutes before departure (default: 30)
 */
export const scheduleDepartureAlert = async (trip, minutesBefore = 30) => {
    try {
        const hasPermission = await requestNotificationPermissions();
        if (!hasPermission) return;

        const triggerSeconds = minutesBefore * 60;

        const notificationId = await Notifications.scheduleNotificationAsync({
            content: {
                title: '🚂 Departure Alert!',
                body: `Your ${trip.type || 'transport'} is departing in ${minutesBefore} minutes from ${trip.platform || 'the station'}. Please proceed to boarding.`,
                data: { trip, type: 'departure_alert' },
                sound: true,
                priority: Notifications.AndroidNotificationPriority.HIGH,
            },
            trigger: {
                seconds: triggerSeconds,
            },
        });

        console.log(`✅ Departure alert scheduled (ID: ${notificationId})`);
        return notificationId;
    } catch (error) {
        console.error('❌ Error scheduling departure alert:', error);
        return null;
    }
};

/**
 * Cancel a scheduled notification
 * @param {string} notificationId - Notification ID to cancel
 */
export const cancelNotification = async (notificationId) => {
    try {
        await Notifications.cancelScheduledNotificationAsync(notificationId);
        console.log(`🗑️ Notification cancelled (ID: ${notificationId})`);
    } catch (error) {
        console.error('❌ Error cancelling notification:', error);
    }
};

/**
 * Cancel all scheduled notifications
 */
export const cancelAllNotifications = async () => {
    try {
        await Notifications.cancelAllScheduledNotificationsAsync();
        console.log('🗑️ All notifications cancelled');
    } catch (error) {
        console.error('❌ Error cancelling all notifications:', error);
    }
};

/**
 * Get all scheduled notifications
 * @returns {Array} Array of scheduled notifications
 */
export const getScheduledNotifications = async () => {
    try {
        const notifications = await Notifications.getAllScheduledNotificationsAsync();
        console.log(`📋 ${notifications.length} scheduled notifications`);
        return notifications;
    } catch (error) {
        console.error('❌ Error getting scheduled notifications:', error);
        return [];
    }
};

/**
 * Send delay notification
 * @param {Object} trip - Trip details
 * @param {number} delayMinutes - Delay in minutes
 */
export const sendDelayNotification = async (trip, delayMinutes) => {
    try {
        const hasPermission = await requestNotificationPermissions();
        if (!hasPermission) return;

        await Notifications.scheduleNotificationAsync({
            content: {
                title: '⚠️ Service Delay',
                body: `Your ${trip.type || 'transport'} to ${trip.name || trip.title} is delayed by ${delayMinutes} minutes.`,
                data: { trip, type: 'delay_notification', delayMinutes },
                sound: true,
            },
            trigger: null,
        });

        console.log('✅ Delay notification sent');
    } catch (error) {
        console.error('❌ Error sending delay notification:', error);
    }
};

/**
 * Add notification listener
 * @param {Function} callback - Callback function to handle notifications
 * @returns {Object} Subscription object
 */
export const addNotificationListener = (callback) => {
    return Notifications.addNotificationReceivedListener(callback);
};

/**
 * Add notification response listener (when user taps notification)
 * @param {Function} callback - Callback function to handle notification response
 * @returns {Object} Subscription object
 */
export const addNotificationResponseListener = (callback) => {
    return Notifications.addNotificationResponseReceivedListener(callback);
};

/**
 * Remove notification listener
 * @param {Object} subscription - Subscription object to remove
 */
export const removeNotificationListener = (subscription) => {
    if (subscription) {
        subscription.remove();
    }
};
