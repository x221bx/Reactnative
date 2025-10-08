import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Modal, Text, Button } from 'react-native-paper';
import AppHeader from '../../components/ui/AppHeader';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useAuth from '../../hooks/useAuth';
import CalendarPicker from '../../components/ui/CalendarPicker';
import { formatDate } from '../../utils/date';

export default function RegisterScreen({ onSuccess, onSwitch, onHome }) {
  const { register, error, clearError } = useAuth();
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [dob, setDob] = useState(''); // YYYY-MM-DD
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [dobPickerVisible, setDobPickerVisible] = useState(false);

  const [errors, setErrors] = useState({
    namerr: '',
    emailerr: '',
    passerr: '',
    phone_err: '',
    addr_err: '',
    dob_err: '',
  });

  const validate = () => {
    let valid = true;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^\d+$/;
    const dobPattern = /^\d{4}-\d{2}-\d{2}$/; // simple YYYY-MM-DD

    const newErrors = { namerr: '', emailerr: '', passerr: '', phone_err: '', addr_err: '', dob_err: '' };

    if (name.length === 0) { newErrors.namerr = 'name is required'; valid = false; }
    else if (name.length <= 2) { newErrors.namerr = 'name must be more than two characters'; valid = false; }

    if (email.length === 0) { newErrors.emailerr = 'email is required'; valid = false; }
    else if (!emailPattern.test(email)) { newErrors.emailerr = 'email is not valid'; valid = false; }

    if (password.length === 0) { newErrors.passerr = 'password is required'; valid = false; }
    else if (password.length < 8) { newErrors.passerr = 'password must be at least 8 characters'; valid = false; }

    if (phone.length === 0) { newErrors.phone_err = 'phone number is required'; valid = false; }
    else if (phone.length !== 11) { newErrors.phone_err = 'phone number must be 11 digits'; valid = false; }
    else if (!phonePattern.test(phone)) { newErrors.phone_err = 'phone number must be numeric only'; valid = false; }

    if (address.length === 0) { newErrors.addr_err = 'address is required'; valid = false; }

    if (dob.length === 0) { newErrors.dob_err = 'date of birth is required'; valid = false; }
    else if (!dobPattern.test(dob)) { newErrors.dob_err = 'date of birth must be YYYY-MM-DD'; valid = false; }

    setErrors(newErrors);
    return valid;
  };

  const submit = async () => {
    if (!validate()) return;
    clearError();
    try {
      // Persist name/phone for later use by AuthContext/profile
      await AsyncStorage.setItem(`@profile_name_${email}`, name);
      await AsyncStorage.setItem(`@profile_phone_${email}`, phone);
      await AsyncStorage.setItem(`@profile_address_${email}`, address);
      await AsyncStorage.setItem(`@profile_dob_${email}`, dob);
      await register(email, password, 'student', { name, phone, address, dob });
      setModalVisible(true);
    } catch (_) {
      // error handled by context
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Register" onHome={onHome || (() => navigation.navigate('Home'))} showMenu />

      <View style={styles.box}>
        <Text style={styles.title}>Registration Form</Text>

        <TextInput
          placeholder="Enter your name"
          style={styles.input}
          value={name}
          onChangeText={(t) => { setName(t); setErrors((p) => ({ ...p, namerr: '' })); }}
        />
        {!!errors.namerr && <Text style={styles.errorText}>{errors.namerr}</Text>}

        <TextInput
          placeholder="Enter your password"
          secureTextEntry={!showPass}
          style={styles.input}
          value={password}
          onChangeText={(t) => { setPassword(t); setErrors((p) => ({ ...p, passerr: '' })); }}
        />
        {!!errors.passerr && <Text style={styles.errorText}>{errors.passerr}</Text>}

        <TouchableOpacity onPress={() => setShowPass(!showPass)}>
          <Text style={styles.toggleText}>{showPass ? 'Hide Password' : 'Show Password'}</Text>
        </TouchableOpacity>

        <TextInput
          placeholder="Enter your email"
          keyboardType="email-address"
          style={styles.input}
          value={email}
          onChangeText={(t) => { setEmail(t); setErrors((p) => ({ ...p, emailerr: '' })); }}
        />
        {!!errors.emailerr && <Text style={styles.errorText}>{errors.emailerr}</Text>}

        <TextInput
          placeholder="Enter your address"
          style={styles.input}
          value={address}
          onChangeText={(t) => { setAddress(t); setErrors((p) => ({ ...p, addr_err: '' })); }}
        />
        {!!errors.addr_err && <Text style={styles.errorText}>{errors.addr_err}</Text>}

        <TouchableOpacity onPress={() => setDobPickerVisible(true)}>
          <View pointerEvents="none">
            <TextInput
              placeholder="Date of birth (YYYY-MM-DD)"
              style={styles.input}
              value={dob}
              editable={false}
            />
          </View>
        </TouchableOpacity>
        {!!errors.dob_err && <Text style={styles.errorText}>{errors.dob_err}</Text>}

        <CalendarPicker
          visible={dobPickerVisible}
          value={dob}
          onClose={() => setDobPickerVisible(false)}
          onSelect={(iso) => { const d = formatDate(iso, 'YYYY-MM-DD'); setDob(d); setErrors((p) => ({ ...p, dob_err: '' })); }}
        />

        <TextInput
          placeholder="Enter your phone number"
          keyboardType="numeric"
          style={styles.input}
          value={phone}
          onChangeText={(t) => { setPhone(t); setErrors((p) => ({ ...p, phone_err: '' })); }}
        />
        {!!errors.phone_err && <Text style={styles.errorText}>{errors.phone_err}</Text>}

        {!!error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity style={styles.button} onPress={submit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>

        <Button
          style={{ marginTop: 12 }}
          mode="outlined"
          onPress={onSwitch || (() => navigation.navigate('Login'))}
        >
          Back to login
        </Button>

        <Modal visible={modalVisible} transparent={true} onDismiss={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>Name is: {name}</Text>
            <Text style={styles.modalText}>Email is: {email}</Text>
            {/* avoid showing password in modal for safety */}
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
