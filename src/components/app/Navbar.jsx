import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useTranslation } from '../../i18n/i18n';
import FavoriteIcon from '../../../assets/imported/icons/favorite.svg';
import CartIcon from '../../../assets/imported/icons/cart.svg';
import SearchIcon from '../../../assets/imported/icons/search.svg';

export default function Navbar({ active, onNavigate }) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const isActive = (k) => active === k;
  return (
    <View style={[styles.bar, { borderColor: colors.border, backgroundColor: colors.card }]}>
      <TouchableOpacity onPress={() => onNavigate?.('home')} style={styles.left}>
        <Image source={require('../../../assets/imported/images/logo.jpg')} style={styles.logo} />
        <Text style={[styles.brand, { color: colors.text }]}>Edudu</Text>
      </TouchableOpacity>
      <View style={styles.center}>
        <NavLink label={t('nav.home')} active={isActive('home')} onPress={() => onNavigate?.('home')} />
        <NavLink label={t('nav.courses')} active={isActive('courses')} onPress={() => onNavigate?.('courses')} />
        <NavLink label={t('nav.teachers')} active={isActive('teachers')} onPress={() => onNavigate?.('teachers')} />
        <NavLink label={t('about.title') || 'About'} active={isActive('about')} onPress={() => onNavigate?.('about')} />
      </View>
      <View style={styles.right}>
        <TouchableOpacity onPress={() => onNavigate?.('courses')} style={styles.iconBtn}>
          <SearchIcon width={20} height={20} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onNavigate?.('favorites')} style={styles.iconBtn}>
          <FavoriteIcon width={20} height={20} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onNavigate?.('wishlist')} style={styles.iconBtn}>
          <CartIcon width={20} height={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function NavLink({ label, active, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.link, active && styles.linkActive]}>
      <Text style={[styles.linkText, active && styles.linkTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  bar: { height: 56, borderBottomWidth: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12 },
  left: { flexDirection: 'row', alignItems: 'center', marginRight: 8 },
  center: { flex: 1, flexDirection: 'row', justifyContent: 'center' },
  right: { flexDirection: 'row', alignItems: 'center' },
  logo: { width: 28, height: 28, borderRadius: 6, marginRight: 8 },
  brand: { fontWeight: '800', fontSize: 16 },
  link: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, marginHorizontal: 2 },
  linkActive: { backgroundColor: '#00000012' },
  linkText: { fontWeight: '700' },
  linkTextActive: { },
  iconBtn: { padding: 6, marginLeft: 4, borderRadius: 8 },
});
