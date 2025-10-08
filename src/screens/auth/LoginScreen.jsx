import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Modal, Text, Button } from 'react-native-paper';
import AppHeader from '../../components/ui/AppHeader';
import { useNavigation } from '@react-navigation/native';
import useAuth from '../../hooks/useAuth';

export default function LoginScreen({ onSuccess, onSwitch, onHome }) {
  const { login, error, clearError } = useAuth();
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [errs, setErrs] = useState({ email: '', password: '' });

  const validate = () => {
    const e = { email: '', password: '' };
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) e.email = 'email is required';
    else if (!emailPattern.test(email)) e.email = 'email is not valid';
    if (!password) e.password = 'password is required';
    else if (password.length < 8) e.password = 'password must be at least 8 characters';
    setErrs(e);
    return !e.email && !e.password;
  };

  const submit = async () => {
    if (!validate()) return;
    clearError();
    try {
      await login(email, password);
      setModalVisible(true);
    } catch (_) {
      // error handled by context
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Login" onHome={onHome || (() => navigation.navigate('Home'))} showMenu />

      <View style={styles.box}>
        <Text style={styles.title}>Login</Text>

        <TextInput
          placeholder="Enter your email"
          keyboardType="email-address"
          style={styles.input}
          value={email}
          onChangeText={(t) => { setEmail(t); setErrs((p) => ({ ...p, email: '' })); }}
        />
        {!!errs.email && <Text style={styles.errorText}>{errs.email}</Text>}

        <TextInput
          placeholder="Enter your password"
          secureTextEntry={!showPass}
          style={styles.input}
          value={password}
          onChangeText={(t) => { setPassword(t);
              setErrs((p) => ({ ...p, password: '' })); }}
        />
        {!!errs.password && <Text style={styles.errorText}>{errs.password}</Text>}

        <TouchableOpacity onPress={() => setShowPass(!showPass)}>
          <Text style={styles.toggleText}>{showPass ? 'Hide Password' : 'Show Password'}</Text>
        </TouchableOpacity>

        {!!error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity style={styles.button} onPress={submit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>

        <Button
          style={{ marginTop: 12 }}
          mode="outlined"
          onPress={onSwitch || (() => navigation.navigate('Register'))}
        >
          Create account
        </Button>

        <Modal visible={modalVisible} transparent={true} onDismiss={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>Logged in as: {email}</Text>
            <Button
              mode="contained"
              onPress={() => { setModalVisible(false); onSuccess?.(); }}
            >
              Close
            </Button>
          </View>
        </Modal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  box: {
    backgroundColor: '#FFF8E1',
    padding: 20,
    borderRadius: 10,
    margin: 16,
  },
  title: {
    textAlign: 'center',
    fontSize: 28,
    color: '#700854ff',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#FFE082',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  toggleText: {
    color: '#F9A825',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#FBC02D',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: '50%',
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 12,
  },
});
