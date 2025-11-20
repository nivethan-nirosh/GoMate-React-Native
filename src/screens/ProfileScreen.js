import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { getTheme, SHADOWS } from '../constants/theme';
import { logout, toggleTheme, updateAvatar, updateEmail, updateLocation, updateName } from '../redux/store';

export default function ProfileScreen() {
    const insets = useSafeAreaInsets();
    const dispatch = useDispatch();

    // Get user and theme from Redux
    const user = useSelector(state => state.auth.userProfile);
    const isDark = useSelector(state => state.theme.isDark);
    const COLORS = getTheme(isDark);

    const [editMode, setEditMode] = useState({ name: false, email: false, location: false, avatar: false });
    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
        location: user.location,
        avatar: user.avatar
    });

    const handleSave = (field) => {
        if (formData[field].trim() === "") {
            Alert.alert("Error", `${field.charAt(0).toUpperCase() + field.slice(1)} cannot be empty`);
            return;
        }

        // Dispatch appropriate action
        switch (field) {
            case 'name':
                dispatch(updateName(formData.name));
                break;
            case 'email':
                // Basic email validation
                if (!formData.email.includes('@')) {
                    Alert.alert("Error", "Please enter a valid email address");
                    return;
                }
                dispatch(updateEmail(formData.email));
                break;
            case 'location':
                dispatch(updateLocation(formData.location));
                break;
            case 'avatar':
                dispatch(updateAvatar(formData.avatar));
                break;
        }

        setEditMode({ ...editMode, [field]: false });
        Alert.alert("Success", "Profile updated successfully!");
    };

    const handleCancel = (field) => {
        setFormData({ ...formData, [field]: user[field] });
        setEditMode({ ...editMode, [field]: false });
    };

    const handleToggleDarkMode = () => {
        dispatch(toggleTheme());
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top, backgroundColor: COLORS.background }]}>
            <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
                <Text style={[styles.heading, { color: COLORS.text }]}>My Profile</Text>

                {/* Avatar Section */}
                <View style={styles.avatarContainer}>
                    <Image source={{ uri: user.avatar }} style={styles.avatar} />
                    <TouchableOpacity
                        style={[styles.cameraIcon, { backgroundColor: COLORS.primary, borderColor: COLORS.background }]}
                        onPress={() => setEditMode({ ...editMode, avatar: true })}
                    >
                        <Feather name="camera" size={16} color="white" />
                    </TouchableOpacity>
                </View>

                {/* Avatar URL Edit (if in edit mode) */}
                {editMode.avatar && (
                    <View style={[styles.card, { backgroundColor: COLORS.card }]}>
                        <Text style={[styles.label, { color: COLORS.subText }]}>AVATAR URL</Text>
                        <TextInput
                            style={[styles.input, { borderBottomColor: COLORS.primary, color: COLORS.text }]}
                            value={formData.avatar}
                            onChangeText={(text) => setFormData({ ...formData, avatar: text })}
                            placeholder="Enter image URL"
                            placeholderTextColor={COLORS.subText}
                            autoCapitalize="none"
                        />
                        <View style={styles.editActions}>
                            <TouchableOpacity onPress={() => handleSave('avatar')} style={styles.actionBtn}>
                                <Text style={[styles.actionText, { color: COLORS.primary }]}>Save</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleCancel('avatar')} style={styles.actionBtn}>
                                <Text style={[styles.actionText, { color: COLORS.danger }]}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {/* Info Card */}
                <View style={[styles.card, { backgroundColor: COLORS.card }]}>
                    <Text style={[styles.label, { color: COLORS.subText }]}>FULL NAME</Text>
                    {editMode.name ? (
                        <View>
                            <TextInput
                                style={[styles.input, { borderBottomColor: COLORS.primary, color: COLORS.text }]}
                                value={formData.name}
                                onChangeText={(text) => setFormData({ ...formData, name: text })}
                                autoFocus
                            />
                            <View style={styles.editActions}>
                                <TouchableOpacity onPress={() => handleSave('name')} style={styles.actionBtn}>
                                    <Text style={[styles.actionText, { color: COLORS.primary }]}>Save</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleCancel('name')} style={styles.actionBtn}>
                                    <Text style={[styles.actionText, { color: COLORS.danger }]}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : (
                        <View style={styles.editRow}>
                            <Text style={[styles.value, { color: COLORS.text }]}>{user.name}</Text>
                            <TouchableOpacity onPress={() => setEditMode({ ...editMode, name: true })}>
                                <Feather name="edit-2" size={18} color={COLORS.subText} />
                            </TouchableOpacity>
                        </View>
                    )}

                    <View style={[styles.divider, { backgroundColor: COLORS.input }]} />

                    <Text style={[styles.label, { color: COLORS.subText }]}>EMAIL ADDRESS</Text>
                    {editMode.email ? (
                        <View>
                            <TextInput
                                style={[styles.input, { borderBottomColor: COLORS.primary, color: COLORS.text }]}
                                value={formData.email}
                                onChangeText={(text) => setFormData({ ...formData, email: text })}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoFocus
                            />
                            <View style={styles.editActions}>
                                <TouchableOpacity onPress={() => handleSave('email')} style={styles.actionBtn}>
                                    <Text style={[styles.actionText, { color: COLORS.primary }]}>Save</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleCancel('email')} style={styles.actionBtn}>
                                    <Text style={[styles.actionText, { color: COLORS.danger }]}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : (
                        <View style={styles.editRow}>
                            <Text style={[styles.value, { color: COLORS.text }]}>{user.email}</Text>
                            <TouchableOpacity onPress={() => setEditMode({ ...editMode, email: true })}>
                                <Feather name="edit-2" size={18} color={COLORS.subText} />
                            </TouchableOpacity>
                        </View>
                    )}

                    <View style={[styles.divider, { backgroundColor: COLORS.input }]} />

                    <Text style={[styles.label, { color: COLORS.subText }]}>LOCATION</Text>
                    {editMode.location ? (
                        <View>
                            <TextInput
                                style={[styles.input, { borderBottomColor: COLORS.primary, color: COLORS.text }]}
                                value={formData.location}
                                onChangeText={(text) => setFormData({ ...formData, location: text })}
                                autoFocus
                            />
                            <View style={styles.editActions}>
                                <TouchableOpacity onPress={() => handleSave('location')} style={styles.actionBtn}>
                                    <Text style={[styles.actionText, { color: COLORS.primary }]}>Save</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleCancel('location')} style={styles.actionBtn}>
                                    <Text style={[styles.actionText, { color: COLORS.danger }]}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : (
                        <View style={styles.editRow}>
                            <Text style={[styles.value, { color: COLORS.text }]}>{user.location}</Text>
                            <TouchableOpacity onPress={() => setEditMode({ ...editMode, location: true })}>
                                <Feather name="edit-2" size={18} color={COLORS.subText} />
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                {/* Settings Card */}
                <View style={[styles.card, { backgroundColor: COLORS.card }]}>
                    <View style={styles.settingRow}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={[styles.iconBox, { backgroundColor: COLORS.input }]}>
                                <Feather name="moon" size={20} color={COLORS.text} />
                            </View>
                            <Text style={[styles.settingText, { color: COLORS.text }]}>Dark Mode</Text>
                        </View>
                        <Switch
                            value={isDark}
                            onValueChange={handleToggleDarkMode}
                            trackColor={{ false: '#767577', true: COLORS.primary }}
                            thumbColor={isDark ? '#f4f3f4' : '#f4f3f4'}
                        />
                    </View>
                </View>

                <TouchableOpacity style={[styles.logoutBtn, { backgroundColor: COLORS.danger }]} onPress={() => dispatch(logout())}>
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    heading: { fontSize: 28, fontWeight: '800', marginBottom: 20 },

    avatarContainer: { alignSelf: 'center', marginBottom: 30 },
    avatar: { width: 110, height: 110, borderRadius: 55, borderWidth: 4, borderColor: 'white' },
    cameraIcon: { position: 'absolute', bottom: 0, right: 0, padding: 8, borderRadius: 20, borderWidth: 3 },

    card: { borderRadius: 20, padding: 20, marginBottom: 20, ...SHADOWS.small },
    label: { fontSize: 11, marginBottom: 5, fontWeight: '700' },
    value: { fontSize: 16, fontWeight: '600' },

    editRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    input: { fontSize: 16, paddingVertical: 8, borderBottomWidth: 1 },
    editActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10, gap: 15 },
    actionBtn: { paddingVertical: 5, paddingHorizontal: 10 },
    actionText: { fontSize: 14, fontWeight: '600' },

    divider: { height: 1, marginVertical: 15 },

    settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    iconBox: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    settingText: { fontSize: 16, fontWeight: '600' },

    logoutBtn: { padding: 18, borderRadius: 16, alignItems: 'center', marginTop: 10 },
    logoutText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});