import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useFormik } from 'formik';
import { useEffect, useRef } from 'react';
import { Animated, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { getTheme } from '../constants/theme';
import { login } from '../redux/store';

const LoginSchema = Yup.object().shape({
  username: Yup.string().min(2, 'Too Short!').required('Username is required'),
  password: Yup.string().min(4, 'Too Short!').required('Password is required'),
});

export default function LoginScreen() {
  const dispatch = useDispatch();
  const isDark = useSelector(state => state.theme.isDark);
  const COLORS = getTheme(isDark);
  const styles = createStyles(COLORS, isDark);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const formik = useFormik({
    initialValues: { username: '', password: '' },
    validationSchema: LoginSchema,
    onSubmit: (values) => {
      dispatch(login(values.username));
    },
  });

  return (
    <View style={{ flex: 1 }}>
      {/* Gradient Background */}
      <LinearGradient
        colors={isDark
          ? ['#1a1a2e', '#16213e', '#0f3460']
          : ['#667eea', '#764ba2', '#f093fb']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView style={styles.container}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
          >
            <Animated.View
              style={[
                styles.innerContent,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }]
                }
              ]}
            >
              {/* Logo Section */}
              <View style={styles.logoContainer}>
                <View style={styles.logoCircle}>
                  <LinearGradient
                    colors={['#667eea', '#764ba2']}
                    style={styles.logoGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Feather name="map-pin" size={50} color="white" />
                  </LinearGradient>
                </View>
                <Text style={styles.title}>GoMate</Text>
                <Text style={styles.subtitle}>Your Travel Companion</Text>
              </View>

              {/* Login Form Card */}
              <View style={styles.formCard}>
                <BlurView intensity={isDark ? 20 : 80} tint={isDark ? 'dark' : 'light'} style={styles.blurContainer}>
                  <View style={styles.formContent}>
                    <Text style={styles.welcomeText}>Welcome Back!</Text>
                    <Text style={styles.signInText}>Sign in to continue</Text>

                    {/* Username Input */}
                    <View style={styles.inputWrapper}>
                      <View style={[styles.inputContainer, formik.errors.username && styles.inputError]}>
                        <Feather name="user" size={20} color={isDark ? '#a0a0a0' : '#666'} style={styles.inputIcon} />
                        <TextInput
                          style={styles.input}
                          placeholder="Username"
                          placeholderTextColor={isDark ? '#888' : '#999'}
                          onChangeText={formik.handleChange('username')}
                          value={formik.values.username}
                          autoCapitalize="none"
                        />
                      </View>
                      {formik.errors.username && <Text style={styles.error}>{formik.errors.username}</Text>}
                    </View>

                    {/* Password Input */}
                    <View style={styles.inputWrapper}>
                      <View style={[styles.inputContainer, formik.errors.password && styles.inputError]}>
                        <Feather name="lock" size={20} color={isDark ? '#a0a0a0' : '#666'} style={styles.inputIcon} />
                        <TextInput
                          style={styles.input}
                          placeholder="Password"
                          secureTextEntry
                          placeholderTextColor={isDark ? '#888' : '#999'}
                          onChangeText={formik.handleChange('password')}
                          value={formik.values.password}
                        />
                      </View>
                      {formik.errors.password && <Text style={styles.error}>{formik.errors.password}</Text>}
                    </View>

                    {/* Forgot Password */}
                    <TouchableOpacity style={styles.forgotPassword}>
                      <Text style={styles.forgotText}>Forgot Password?</Text>
                    </TouchableOpacity>

                    {/* Sign In Button */}
                    <TouchableOpacity onPress={formik.handleSubmit}>
                      <LinearGradient
                        colors={['#667eea', '#764ba2']}
                        style={styles.button}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                      >
                        <Text style={styles.buttonText}>Sign In</Text>
                        <Feather name="arrow-right" size={20} color="white" style={{ marginLeft: 10 }} />
                      </LinearGradient>
                    </TouchableOpacity>

                    {/* Sign Up Link */}
                    <View style={styles.signUpContainer}>
                      <Text style={styles.signUpText}>Don't have an account? </Text>
                      <TouchableOpacity>
                        <Text style={styles.signUpLink}>Sign Up</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </BlurView>
              </View>

              {/* Decorative Elements */}
              <View style={styles.decorativeCircle1} />
              <View style={styles.decorativeCircle2} />
            </Animated.View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const createStyles = (COLORS, isDark) => StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1 },
  keyboardView: { flex: 1 },
  innerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    position: 'relative'
  },

  // Logo Section
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10
  },
  logoGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 42,
    fontWeight: '900',
    color: 'white',
    marginBottom: 8,
    letterSpacing: 1
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500'
  },

  // Form Card
  formCard: {
    width: '100%',
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 15
  },
  blurContainer: {
    borderRadius: 30,
    overflow: 'hidden'
  },
  formContent: {
    padding: 30,
    backgroundColor: isDark ? 'rgba(30, 30, 30, 0.7)' : 'rgba(255, 255, 255, 0.25)',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.3)'
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '800',
    color: isDark ? 'white' : 'white',
    marginBottom: 5
  },
  signInText: {
    fontSize: 15,
    color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.9)',
    marginBottom: 30,
    fontWeight: '500'
  },

  // Inputs
  inputWrapper: { marginBottom: 20 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.4)',
    borderRadius: 15,
    paddingHorizontal: 20,
    height: 56,
    borderWidth: 2,
    borderColor: 'transparent'
  },
  inputError: {
    borderColor: '#ff6b6b'
  },
  inputIcon: { marginRight: 12 },
  input: {
    flex: 1,
    color: isDark ? 'white' : '#333',
    fontSize: 16,
    fontWeight: '500'
  },
  error: {
    color: '#ff6b6b',
    fontSize: 12,
    marginLeft: 20,
    marginTop: 5,
    fontWeight: '600'
  },

  // Forgot Password
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 25
  },
  forgotText: {
    color: isDark ? 'rgba(255, 255, 255, 0.8)' : 'white',
    fontSize: 14,
    fontWeight: '600'
  },

  // Button
  button: {
    height: 56,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 8
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5
  },

  // Sign Up
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25
  },
  signUpText: {
    color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.9)',
    fontSize: 14
  },
  signUpLink: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700'
  },

  // Decorative Elements
  decorativeCircle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    top: -50,
    left: -50
  },
  decorativeCircle2: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    bottom: -30,
    right: -30
  }
});