import { Feather } from '@expo/vector-icons';
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
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
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
              <Feather name="map-pin" size={50} color="#667eea" />
            </View>
            <Text style={styles.title}>GoMate</Text>
            <Text style={styles.subtitle}>Your Travel Companion</Text>
          </View>

          {/* Login Form */}
          <View style={styles.formCard}>
            <Text style={styles.welcomeText}>Welcome Back!</Text>
            <Text style={styles.signInText}>Sign in to continue your journey</Text>

            {/* Username Input */}
            <View style={styles.inputWrapper}>
              <View style={[styles.inputContainer, formik.errors.username && styles.inputError]}>
                <Feather name="user" size={20} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Username"
                  placeholderTextColor="#999"
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
                <Feather name="lock" size={20} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  secureTextEntry
                  placeholderTextColor="#999"
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
            <TouchableOpacity onPress={formik.handleSubmit} style={styles.button}>
              <Text style={styles.buttonText}>Sign In</Text>
              <Feather name="arrow-right" size={20} color="white" style={{ marginLeft: 10 }} />
            </TouchableOpacity>

            {/* Sign Up Link */}
            <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>Don't have an account? </Text>
              <TouchableOpacity>
                <Text style={styles.signUpLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (COLORS, isDark) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? COLORS.background : '#f8f9fa'
  },
  keyboardView: { flex: 1 },
  innerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },

  // Logo Section
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10
  },
  title: {
    fontSize: 42,
    fontWeight: '900',
    color: isDark ? COLORS.text : '#1a1a1a',
    marginBottom: 8,
    letterSpacing: 1
  },
  subtitle: {
    fontSize: 16,
    color: isDark ? COLORS.subText : '#666',
    fontWeight: '500'
  },

  // Form Card
  formCard: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 30,
    elevation: 10
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 5
  },
  signInText: {
    fontSize: 15,
    color: '#666',
    marginBottom: 30,
    fontWeight: '500'
  },

  // Inputs
  inputWrapper: { marginBottom: 20 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    paddingHorizontal: 20,
    height: 56,
    borderWidth: 2,
    borderColor: '#e9ecef'
  },
  inputError: {
    borderColor: '#ff6b6b'
  },
  inputIcon: { marginRight: 12 },
  input: {
    flex: 1,
    color: '#1a1a1a',
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
    color: '#667eea',
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
    backgroundColor: '#667eea',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
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
    color: '#666',
    fontSize: 14
  },
  signUpLink: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: '700'
  }
});