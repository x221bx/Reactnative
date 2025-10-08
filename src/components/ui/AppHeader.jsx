import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from '../../i18n/i18n';

export default function AppHeader({ title, onBack, onHome, showMenu }) {
  const { colors, isDark, toggleTheme } = useTheme();
  const { t, lang, setLang } = useTranslation();
  const navigation = (() => { try { return useNavigation(); } catch { return null; } })();
  return (
    <View style={[styles.header, { borderColor: colors.border, backgroundColor: colors.card }]}> 
      <View style={styles.left}>
        {showMenu && (
          <TouchableOpacity
            onPress={() => navigation?.dispatch?.(DrawerActions.toggleDrawer())}
            style={[styles.btn, { borderColor: colors.border, marginRight: 8 }]}
            accessibilityRole="button"
            accessibilityLabel="Open menu"
          >
            <MaterialIcons name="menu" size={20} color={colors.text} />
          </TouchableOpacity>
        )}
        {onBack && (
          <TouchableOpacity onPress={onBack} style={[styles.btn, { borderColor: colors.border, marginRight: 8 }]}> 
            <Text style={[styles.btnText, { color: colors.text }]}>{t('action.back')}</Text>
          </TouchableOpacity>
        )}
        {onHome && (
          <TouchableOpacity onPress={onHome} style={[styles.btn, { borderColor: colors.border, marginRight: 8 }]}> 
            <Text style={[styles.btnText, { color: colors.text }]}>{t('action.home')}</Text>
          </TouchableOpacity>
        )}
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={() => setLang(lang === 'ar' ? 'en' : 'ar')} style={[styles.btn, { borderColor: colors.border, marginRight: 8 }]}> 
          <Text style={[styles.btnText, { color: colors.text }]}>{lang === 'ar' ? 'EN' : 'AR'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleTheme} style={[styles.btn, { borderColor: colors.border }]}> 
          <Text style={[styles.btnText, { color: colors.text }]}>{isDark ? t('action.light') : t('action.dark')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  left: { flexDirection: 'row', alignItems: 'center' },
  title: { fontSize: 18, fontWeight: '800' },
  btn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1 },
  btnText: { fontWeight: '700' },
});
