import React, { useState } from 'react';
import { View, Text } from 'react-native';
import AppHeader from '../../components/ui/AppHeader';
import { useTheme } from '../../hooks/useTheme';
import Input from '../../components/form/Input';
import Button from '../../components/form/Button';
import useAuth from '../../hooks/useAuth';

export default function RegisterScreen({ onSuccess, onSwitch, onHome }) {
  const { colors } = useTheme();
  const { register, error, clearError } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [errs, setErrs] = useState({});

  const submit = async () => {
    const e = {};
    if (!form.name || form.name.length < 2) e.name = 'Name is required';
    if (!form.email) e.email = 'Email is required';
    if (!form.password || form.password.length < 6) e.password = 'Password must be at least 6 chars';
    setErrs(e);
    if (Object.keys(e).length) return;
    clearError();
    try {
      await register(form.email, form.password, form.role);
      onSuccess?.();
    } catch (err) {
      // error state is set in context; UI below will show it
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AppHeader title="Register" onHome={onHome} />
      <View style={{ padding: 16 }}>
        <Input label="Name" value={form.name} onChangeText={(v) => setForm((s) => ({ ...s, name: v }))} error={errs.name} />
        <View style={{ height: 8 }} />
        <Input label="Email" value={form.email} onChangeText={(v) => setForm((s) => ({ ...s, email: v }))} error={errs.email} />
        <View style={{ height: 8 }} />
        <Input label="Password" secureTextEntry value={form.password} onChangeText={(v) => setForm((s) => ({ ...s, password: v }))} error={errs.password} />
        <View style={{ height: 12 }} />
        <Text style={{ color: colors.text, marginBottom: 6, fontWeight: '700' }}>Choose Role</Text>
        <View style={{ flexDirection: 'row' }}>
          {['student','teacher','admin'].map((r) => (
            <View key={r} style={{ marginRight: 8 }}>
              <Button
                variant={form.role === r ? 'solid' : 'outline'}
                title={r.charAt(0).toUpperCase() + r.slice(1)}
                onPress={() => setForm((s) => ({ ...s, role: r }))}
              />
            </View>
          ))}
        </View>
        {!!error && <Text style={{ color: '#e74c3c', marginTop: 8 }}>{error}</Text>}
        <View style={{ height: 12 }} />
        <Button title="Create" onPress={submit} />
        <View style={{ height: 8 }} />
        <Button variant="outline" title="Back to login" onPress={onSwitch} />
      </View>
    </View>
  );
}

