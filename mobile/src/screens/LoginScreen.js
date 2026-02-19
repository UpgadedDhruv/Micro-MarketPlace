import React, { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAuth } from '../AuthContext.js';
import apiClient from '../apiClient.js';

const LoginScreen = ({ onLoggedIn }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!email.trim() || !password) {
      setError('Email and password are required');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await apiClient.post('/auth/login', { email, password });
      login(response.data.user, response.data.token);
      onLoggedIn();
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Micro Marketplace</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Login</Text>
        {error && <Text style={styles.error}>{error}</Text>}
        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            placeholder="you@example.com"
            placeholderTextColor="#6b7280"
          />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#6b7280"
          />
        </View>
        <Pressable style={styles.button} onPress={handleSubmit} disabled={submitting}>
          {submitting ? (
            <ActivityIndicator color="#f9fafb" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </Pressable>
        <Text style={styles.hint}>Seed users: alice@example.com / password123</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#020617',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#e5e7eb',
    marginBottom: 16,
  },
  card: {
    width: '100%',
    borderRadius: 20,
    padding: 20,
    backgroundColor: '#0f172a',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#e5e7eb',
    marginBottom: 12,
  },
  field: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    color: '#9ca3af',
    marginBottom: 4,
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4b5563',
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: '#e5e7eb',
    backgroundColor: '#020617',
  },
  button: {
    marginTop: 8,
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#4f46e5',
  },
  buttonText: {
    color: '#f9fafb',
    fontWeight: '600',
  },
  error: {
    color: '#fecaca',
    marginBottom: 8,
    fontSize: 13,
  },
  hint: {
    marginTop: 10,
    fontSize: 11,
    color: '#6b7280',
  },
});

export default LoginScreen;

