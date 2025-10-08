import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from '../../i18n/i18n';
import { useSelector } from 'react-redux';
import { selectCart } from '../../redux/slices/cartSlice';
import { selectWishlist } from '../../redux/slices/wishlistSlice';
import { selectFavorites } from '../../redux/slices/favoritesSlice';

export default function AppHeader({ title, onBack, onHome, showMenu }) {
  const { colors, isDark, toggleTheme } = useTheme();
  const { t, lang, setLang } = useTranslation();
  const navigation = (() => { try { return useNavigation(); } catch { return null; } })();
  const cartCount = useSelector(selectCart).length;
  const wishCount = useSelector(selectWishlist).length;
  const favCount = useSelector(selectFavorites).length;
  const prevFavRef = React.useRef(favCount);
  const [favPulse, setFavPulse] = React.useState(false);
  React.useEffect(() => {
    if (favCount > prevFavRef.current) {
      setFavPulse(true);
      const t = setTimeout(() => setFavPulse(false), 1500);
      return () => clearTimeout(t);
    }
    prevFavRef.current = favCount;
  }, [favCount]);

  const IconBadge = ({ name, count, onPress, pulse }) => (
    <TouchableOpacity onPress={onPress} style={[styles.iconWrap, { borderColor: colors.outline }]} accessibilityRole="button">
      <MaterialIcons name={name} size={20} color={colors.onSurface} />
      {count > 0 && (
        <View style={[styles.badge, { backgroundColor: colors.primary }]}>
          <Text style={{ color: colors.onPrimary, fontSize: 10 }}>{count}</Text>
        </View>
      )}
      {pulse && (
        <View style={[styles.dot, { backgroundColor: '#43A047' }]} />
      )}
    </TouchableOpacity>
  );
  return (
    <View style={[styles.header, { borderColor: colors.outline, backgroundColor: colors.primaryContainer }]}> 
      <View style={styles.left}>
        {showMenu && (
          <TouchableOpacity
            onPress={() => navigation?.dispatch?.(DrawerActions.toggleDrawer())}
            style={[styles.btn, { borderColor: colors.outline, marginRight: 8, backgroundColor: 'transparent' }]}
            accessibilityRole="button"
            accessibilityLabel="Open menu"
          >
            <MaterialIcons name="menu" size={20} color={colors.onSurface} />
          </TouchableOpacity>
        )}
        {onBack && (
          <TouchableOpacity onPress={onBack} style={[styles.btn, { borderColor: colors.outline, marginRight: 8 }]}> 
            <Text style={[styles.btnText, { color: colors.onSurface }]}>{t('action.back')}</Text>
          </TouchableOpacity>
        )}
        {onHome && (
          <TouchableOpacity onPress={onHome} style={[styles.btn, { borderColor: colors.outline, marginRight: 8 }]}> 
            <Text style={[styles.btnText, { color: colors.onSurface }]}>{t('action.home')}</Text>
          </TouchableOpacity>
        )}
        <Text style={[styles.title, { color: colors.onSurface }]}>{title}</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <IconBadge name="favorite" count={wishCount} onPress={() => navigation?.navigate?.('Wishlist')} />
        <IconBadge name="star" count={favCount} onPress={() => navigation?.navigate?.('Favorites')} pulse={favPulse} />
        <IconBadge name="shopping-cart" count={cartCount} onPress={() => navigation?.navigate?.('Cart')} />
        <TouchableOpacity onPress={() => setLang(lang === 'ar' ? 'en' : 'ar')} style={[styles.btn, { borderColor: colors.outline, marginRight: 8 }]}> 
          <Text style={[styles.btnText, { color: colors.onSurface }]}>{lang === 'ar' ? 'EN' : 'AR'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleTheme} style={[styles.btn, { borderColor: colors.outline }]}> 
          <Text style={[styles.btnText, { color: colors.onSurface }]}>{isDark ? t('action.light') : t('action.dark')}</Text>
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
  iconWrap: { marginRight: 8, paddingHorizontal: 8, paddingVertical: 6, borderRadius: 8, borderWidth: 1, position: 'relative' },
  badge: { position: 'absolute', top: -4, right: -4, borderRadius: 8, minWidth: 16, height: 16, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 },
  dot: { position: 'absolute', width: 8, height: 8, borderRadius: 4, top: 0, left: 0 },
});
