import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AppHeader from '../../components/ui/AppHeader';
import { useTheme } from '../../hooks/useTheme';
import Input from '../../components/form/Input';
import Button from '../../components/form/Button';
import useAuth from '../../hooks/useAuth';

export default function LoginScreen({ onSuccess, onSwitch, onHome }) {
  const { colors } = useTheme();
  const { login, error, clearError } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errs, setErrs] = useState({});

  const submit = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    if (!form.password || form.password.length < 6) e.password = 'Password must be at least 6 chars';
    setErrs(e);
    if (Object.keys(e).length) return;
    clearError();
    login(form.email, form.password);
    if (!error) onSuccess?.();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AppHeader title="Login" onHome={onHome} />
      <View style={{ padding: 16 }}>
        <Input label="Email" value={form.email} onChangeText={(v) => setForm((s) => ({ ...s, email: v }))} error={errs.email} />
        <View style={{ height: 8 }} />
        <Input label="Password" secureTextEntry value={form.password} onChangeText={(v) => setForm((s) => ({ ...s, password: v }))} error={errs.password} />
        {!!error && <Text style={{ color: '#e74c3c', marginTop: 8 }}>{error}</Text>}
        <View style={{ height: 12 }} />
        <Button title="Login" onPress={submit} />
        <View style={{ height: 8 }} />
        <Button variant="outline" title="Create account" onPress={onSwitch} />
      </View>
    </View>
  );
}

