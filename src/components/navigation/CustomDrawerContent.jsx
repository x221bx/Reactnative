import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import { useTranslation } from '../../i18n/i18n';
import { MaterialIcons } from '@expo/vector-icons';
import useAuth from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { ThemeToggle } from '../../theme/ThemeContext';
import { DrawerItem, DrawerContentScrollView } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ConfirmModal from '../ui/ConfirmModal';
import { useSelector } from 'react-redux';
import { selectWishlist } from '../../redux/slices/wishlistSlice';
import { selectFavorites } from '../../redux/slices/favoritesSlice';
import { selectCart } from '../../redux/slices/cartSlice';

export default function CustomDrawerContent({ navigation }) {
  const { colors } = useTheme();
  const { user, logout, isAdmin } = useAuth();
  const { t } = useTranslation();
  const [confirmReset, setConfirmReset] = React.useState(false);

  const resetData = React.useCallback(async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const targets = keys.filter((k) =>
        k === 'auth_user' ||
        k === '@users_db' ||
        k === '@courses_db' ||
        k === '@teachers_db' ||
        k.startsWith('@profile_')
      );
      if (targets.length) await AsyncStorage.multiRemove(targets);
      setConfirmReset(false);
      navigation.navigate('Home');
    } catch (_) {
      setConfirmReset(false);
    }
  }, [navigation]);

  const wishlistCount = useSelector(selectWishlist).length;
  const favoritesCount = useSelector(selectFavorites).length;
  const cartCount = useSelector(selectCart).length;

  const withCount = (label, count) => (count > 0 ? `${label} (${count})` : label);

  const menuItems = React.useMemo(() => {
    const base = [
      { key: 'Home', label: t('nav.home'), icon: 'home', to: 'Home' },
      { key: 'Courses', label: t('nav.courses'), icon: 'menu-book', to: 'Courses' },
      { key: 'Teachers', label: t('nav.teachers'), icon: 'people', to: 'Teachers' },
      ...(user ? [{ key: 'Profile', label: 'Profile', icon: 'person', to: 'UserDashboard' }] : []),
      { key: 'Wishlist', label: withCount(t('nav.wishlist'), wishlistCount), icon: 'favorite', to: 'Wishlist' },
      { key: 'Cart', label: withCount('Cart', cartCount), icon: 'shopping-cart', to: 'Cart' },
      { key: 'Favorites', label: withCount(t('nav.favorites'), favoritesCount), icon: 'star', to: 'Favorites' },
      { key: 'About', label: t('nav.about'), icon: 'info', to: 'About' },
    ];
    if (user?.role === 'teacher') {
      base.splice(3, 0, { key: 'Inbox', label: 'Inbox', icon: 'chat', to: 'Inbox' });
    }
    if (isAdmin) {
      base.splice(
        1,
        0,
        { key: 'AdminDashboard', label: t('nav.admin', 'Admin'), icon: 'dashboard', to: 'AdminDashboard' },
        { key: 'AdminCourses', label: t('nav.adminCourses', 'Admin Courses'), icon: 'library-books', to: 'AdminCourses' },
        { key: 'AdminTeachers', label: t('nav.adminTeachers', 'Admin Teachers'), icon: 'supervisor-account', to: 'AdminTeachers' },
        { key: 'AdminTeacherAccounts', label: 'Teacher Accounts', icon: 'verified-user', to: 'AdminTeacherAccounts' },
        { key: 'AdminEnrollment', label: 'Enrollments', icon: 'person-add', to: 'AdminEnrollment' },
        { key: 'AddCourse', label: 'Add Course', icon: 'playlist-add', to: 'AddCourse' },
        { key: 'AdminData', label: 'Admin Data', icon: 'storage', to: 'AdminData' },
      );
    }
    return base;
  }, [isAdmin, t, user?.role, wishlistCount, favoritesCount, cartCount]);

  return (
    <DrawerContentScrollView contentContainerStyle={styles.container} style={{ backgroundColor: colors.background }} showsVerticalScrollIndicator={false}>
      <View style={[styles.header, { borderBottomColor: colors.border, backgroundColor: colors.primary }]}>
        <View style={styles.profileContainer}>
          <View style={[styles.avatar, { backgroundColor: colors.background + '22' }]}>
            {user?.photoURL ? (
              <Image source={{ uri: user.photoURL }} style={{ width: 84, height: 84, borderRadius: 42 }} />
            ) : (
              <MaterialIcons name="person" size={48} color={colors.background} />
            )}
          </View>
          {user ? (
            <>
              <Text style={[styles.name, { color: colors.background }]}>{user.displayName || 'User'}</Text>
              <Text style={[styles.email, { color: colors.background }]}>{user.email}</Text>
            </>
          ) : (
            <>
              <Text style={[styles.name, { color: colors.background }]}>{t('guest.welcome', 'Welcome!')}</Text>
              <Text style={[styles.email, { color: colors.background }]}>{t('guest.prompt', 'Sign in to continue')}</Text>
              <View style={styles.ctaRow}>
                <TouchableOpacity onPress={() => navigation.navigate('Login')} style={[styles.btn, { backgroundColor: colors.background, borderColor: colors.border, borderWidth: 1, marginRight: 8 }]}>
                  <Text style={[styles.btnText, { color: colors.text }]}>{t('auth.login')}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Register')} style={[styles.btn, { backgroundColor: 'transparent', borderColor: colors.background, borderWidth: 1 }]}>
                  <Text style={[styles.btnText, { color: colors.background }]}>{t('auth.register')}</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>

      <View style={styles.drawerSection}>
        {menuItems.map((item) => (
          <DrawerItem
            key={item.key}
            label={item.label}
            icon={({ color, size }) => <MaterialIcons name={item.icon} size={size} color={color} />}
            onPress={() => navigation.navigate(item.to)}
            style={[styles.drawerItem, { activeBackgroundColor: colors.primary + '20' }]}
            labelStyle={[styles.drawerLabel, { color: colors.text }]}
            activeTintColor={colors.primary}
            inactiveTintColor={colors.text}
          />
        ))}
      </View>

      <View style={[styles.bottomSection, { borderTopColor: colors.border }]}>
        <View style={styles.settingsRow}>
          <ThemeToggle style={styles.themeToggle} />
          <Text style={[styles.settingsLabel, { color: colors.text }]}>{t('settings.theme', 'الوضع الليلي')}</Text>
        </View>

        {user ? (
          <TouchableOpacity style={[styles.drawerItem, { backgroundColor: colors.error + '20' }]} onPress={logout}>
            <Text style={[styles.drawerLabel, { color: colors.error }]}>{t('auth.logout', 'تسجيل الخروج')}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.drawerItem, { backgroundColor: colors.primary + '20' }]} onPress={() => navigation.navigate('Login')}>
            <Text style={[styles.drawerLabel, { color: colors.primary }]}>{t('auth.login', 'تسجيل الدخول')}</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.drawerItem, { backgroundColor: colors.warning + '33' }]}
          onPress={() => setConfirmReset(true)}
        >
          <Text style={[styles.drawerLabel, { color: colors.onSurface }]}>Reset Local Data</Text>
        </TouchableOpacity>
        <Text style={[styles.version, { color: colors.onSurfaceVariant }]}>Version 1.0.0</Text>
      </View>

      <ConfirmModal
        visible={confirmReset}
        title="Confirm Reset"
        message="This will clear local users, courses, teachers and profile data. Continue?"
        onCancel={() => setConfirmReset(false)}
        onConfirm={resetData}
      />
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    padding: 20,
    borderBottomWidth: 1
  },
  profileContainer: {
    alignItems: 'center'
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10
  },
  name: {
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center'
  },
  email: {
    fontSize: 14,
    opacity: 0.85,
    textAlign: 'center'
  },
  ctaRow: {
    flexDirection: 'row',
    marginTop: 12
  },
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10
  },
  btnText: {
    fontWeight: '700'
  },
  drawerSection: {
    marginTop: 15
  },
  drawerItem: {
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 10,
    marginVertical: 5
  },
  drawerLabel: {
    fontSize: 16,
    marginLeft: 15
  },
  bottomSection: {
    padding: 20,
    borderTopWidth: 1
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 10
  },
  settingsLabel: {
    fontSize: 16,
    marginLeft: 10
  },
  themeToggle: {
    margin: 0,
    padding: 0
  },
  version: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
    opacity: 0.7
  },
});
