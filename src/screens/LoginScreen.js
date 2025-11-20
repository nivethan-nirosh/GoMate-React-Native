import { Feather } from '@expo/vector-icons';
import { useFormik } from 'formik';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { getTheme } from '../constants/theme';
import { login } from '../redux/store';
// 1. IMPORT ADDED HERE
import { SafeAreaView } from 'react-native-safe-area-context';

const LoginSchema = Yup.object().shape({
  username: Yup.string().min(2, 'Too Short!').required('Username is required'),
  password: Yup.string().min(4, 'Too Short!').required('Password is required'),
});

export default function LoginScreen() {
  const dispatch = useDispatch();
  const isDark = useSelector(state => state.theme.isDark);
  const COLORS = getTheme(isDark);
  const styles = createStyles(COLORS);

  const formik = useFormik({
    initialValues: { username: '', password: '' },
    validationSchema: LoginSchema,
    onSubmit: (values) => {
      dispatch(login(values.username));
    },
  });

  return (
    // 2. FIXED STRUCTURE: SafeAreaView handles the Notch
    <SafeAreaView style={styles.container}>

      {/* 3. FIXED STRUCTURE: KeyboardAvoidingView handles the Keyboard */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.innerContent}>
          <View style={styles.iconCircle}>
            <Feather name="map-pin" size={40} color={COLORS.primary} />
          </View>
          <Text style={styles.title}>GoMate</Text>
          <Text style={styles.subtitle}>Explore. Book. Travel.</Text>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Feather name="user" size={20} color={COLORS.subText} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor={COLORS.subText}
                onChangeText={formik.handleChange('username')}
                value={formik.values.username}
                autoCapitalize="none"
              />
            </View>
            {formik.errors.username && <Text style={styles.error}>{formik.errors.username}</Text>}

            <View style={styles.inputContainer}>
              <Feather name="lock" size={20} color={COLORS.subText} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                placeholderTextColor={COLORS.subText}
                onChangeText={formik.handleChange('password')}
                value={formik.values.password}
              />
            </View>
            {formik.errors.password && <Text style={styles.error}>{formik.errors.password}</Text>}

            <TouchableOpacity style={styles.button} onPress={formik.handleSubmit}>
              <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (COLORS) => StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  keyboardView: { flex: 1 },
  innerContent: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },

  iconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.card, justifyContent: 'center', alignItems: 'center', marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  title: { fontSize: 32, fontWeight: '800', color: COLORS.text, marginBottom: 5 },
  subtitle: { fontSize: 16, color: COLORS.subText, marginBottom: 40 },
  form: { width: '100%' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, borderRadius: 12, paddingHorizontal: 15, marginBottom: 10, height: 50, borderWidth: 1, borderColor: COLORS.input },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, color: COLORS.text, height: '100%' },
  error: { color: COLORS.danger, fontSize: 12, marginLeft: 5, marginBottom: 10 },
  button: { backgroundColor: COLORS.primary, height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 10, shadowColor: COLORS.primary, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});