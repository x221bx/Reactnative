import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import AppHeader from '../components/ui/AppHeader';
import { useTheme } from '../hooks/useTheme';

export default function AboutScreen({ onHome }) {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AppHeader title="About Us" onHome={onHome} showMenu />
      <View style={{ padding: 16 }}>
        <Image source={require('../../assets/imported/images/hero.jpg')} style={styles.hero} />
        <View style={{ height: 12 }} />
        <Image source={require('../../assets/imported/images/logo.jpg')} style={styles.logo} />
        <Text style={{ color: colors.text, marginTop: 12, textAlign: 'center' }}>
          We create engaging courses and connect learners with passionate teachers.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { width: '100%', height: 160, borderRadius: 12, resizeMode: 'cover' },
  logo: { width: 120, height: 120, alignSelf: 'center', resizeMode: 'contain' },
});
