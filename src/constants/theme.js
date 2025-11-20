// Light Theme
export const LIGHT_THEME = {
    primary: '#007AFF', // System Blue
    secondary: '#FF2D55', // System Pink
    background: '#F2F2F7', // iOS System Gray 6
    card: '#FFFFFF',
    text: '#000000',
    subText: '#8E8E93', // System Gray
    success: '#34C759', // System Green
    successBg: '#E4F9E8',
    warning: '#FF9500', // System Orange
    warningBg: '#FFF4E5',
    danger: '#FF3B30', // System Red
    dangerBg: '#FFE5E5',
    input: '#E5E5EA', // System Gray 5
    border: '#C7C7CC',
    tabBar: 'rgba(255, 255, 255, 0.95)',
    overlay: 'rgba(0, 0, 0, 0.2)',
};

// Dark Theme
export const DARK_THEME = {
    primary: '#0A84FF', // Brighter blue for dark mode
    secondary: '#FF375F', // Brighter pink
    background: '#000000', // True black for OLED
    card: '#1C1C1E', // Dark gray card
    text: '#FFFFFF',
    subText: '#98989D', // Lighter gray for dark mode
    success: '#32D74B', // Brighter green
    successBg: '#1C3A26',
    warning: '#FF9F0A', // Brighter orange
    warningBg: '#3A2E1C',
    danger: '#FF453A', // Brighter red
    dangerBg: '#3A1C1C',
    input: '#2C2C2E', // Dark input background
    border: '#38383A',
    tabBar: 'rgba(28, 28, 30, 0.95)',
    overlay: 'rgba(0, 0, 0, 0.5)',
};

// Legacy export for backward compatibility
export const COLORS = LIGHT_THEME;

// iOS Specific Shadow Helper
export const SHADOWS = {
    small: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    medium: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
    }
};

// Helper function to get current theme
export const getTheme = (isDark) => isDark ? DARK_THEME : LIGHT_THEME;