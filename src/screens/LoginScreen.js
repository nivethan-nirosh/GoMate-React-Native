import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { login } from '../redux/store';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginSchema = Yup.object().shape({
  username: Yup.string().min(2, 'Too Short!').required('Required'),
  password: Yup.string().min(4, 'Too Short!').required('Required'),
});

export default function LoginScreen({ navigation }) {
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: { username: '', password: '' },
    validationSchema: LoginSchema,
    onSubmit: async (values) => {
      // Simulate API Login
      await AsyncStorage.setItem('userToken', 'dummy-token');
      dispatch(login(values.username));
      // Navigation is handled by the Main Navigator based on state
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>GoMate Login</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Username"
        onChangeText={formik.handleChange('username')}
        value={formik.values.username}
      />
      {formik.errors.username && <Text style={styles.error}>{formik.errors.username}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={formik.handleChange('password')}
        value={formik.values.password}
      />
      {formik.errors.password && <Text style={styles.error}>{formik.errors.password}</Text>}

      <Button title="Login" onPress={formik.handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 },
  error: { color: 'red', marginBottom: 10 },
});