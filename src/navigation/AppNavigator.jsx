import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// Removed tabs to unify navigation via Drawer only
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../theme/ThemeContext';
import { useTranslation } from '../i18n/i18n';
import { MaterialIcons } from '@expo/vector-icons';

// Screens
import HomeScreen from '../screens/HomeScreen.jsx';
import TeachersScreen from '../screens/TeachersScreen';
import TeacherDetailScreen from '../screens/TeacherDetailScreen';
import CoursesScreen from '../screens/CoursesScreen';
import CourseDetailScreen from '../screens/CourseDetailScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import WishlistScreen from '../screens/WishlistScreen.jsx';
import FavoritesScreen from '../screens/FavoritesScreen.jsx';
import CartScreen from '../screens/CartScreen.jsx';
// import AdminNavigator from './AdminNavigator';
import AboutScreen from '../screens/AboutScreen.jsx';
import UserDashboardScreen from '../screens/UserDashboardScreen.jsx';
import CustomDrawerContent from '../components/navigation/CustomDrawerContent.jsx';
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen.jsx';
import AdminCoursesScreen from '../screens/admin/AdminCoursesScreen.jsx';
import AdminTeachersScreen from '../screens/admin/AdminTeachersScreen.jsx';
import AdminDataScreen from '../screens/admin/AdminDataScreen.jsx';
import AdminTeacherAccountsScreen from '../screens/admin/AdminTeacherAccountsScreen.jsx';
import TeacherChatScreen from '../screens/TeacherChatScreen.jsx';
import TeacherInboxScreen from '../screens/TeacherInboxScreen.jsx';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}


// Simple auth guard wrapper to protect specific screens
function withAuthGuard(Component) {
  return function Guarded(props) {
    const { user } = useAuth();
    React.useEffect(() => {
      if (!user) props.navigation.navigate('Auth');
    }, [user, props.navigation]);
    if (!user) return null;
    return <Component {...props} />;
  };
}

function RootDrawer() {
  const { theme } = useTheme();
  const { lang } = useTranslation();
  const { isAdmin } = useAuth();
  const { user } = useAuth();
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: { backgroundColor: theme.colors.surface },
        drawerActiveTintColor: theme.colors.primary,
        drawerInactiveTintColor: theme.colors.onSurfaceVariant,
        drawerActiveBackgroundColor: theme.colors.primaryContainer,
      }}
      drawerPosition={lang === 'ar' ? 'right' : 'left'}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Courses" component={CoursesScreen} />
      <Drawer.Screen name="Teachers" component={TeachersScreen} />
      <Drawer.Screen name="Wishlist" component={WishlistScreen} />
      <Drawer.Screen name="Cart" component={CartScreen} />
      <Drawer.Screen name="CourseDetail" component={CourseDetailScreen} options={{ drawerItemStyle: { display: 'none' } }} />
      <Drawer.Screen name="TeacherDetail" component={TeacherDetailScreen} options={{ drawerItemStyle: { display: 'none' } }} />
      <Drawer.Screen name="TeacherChat" component={withAuthGuard(TeacherChatScreen)} options={{ drawerItemStyle: { display: 'none' } }} />
      {user?.role === 'teacher' && (
        <Drawer.Screen name="Inbox" component={withAuthGuard(TeacherInboxScreen)} />
      )}
      <Drawer.Screen name="Login" options={{ title: "Login" }}>
        {(props) => (
          <LoginScreen {...props} onHome={() => props.navigation.navigate("Home")} onSuccess={() => props.navigation.navigate("Home")} onSwitch={() => props.navigation.navigate("Register")} />
        )}
      </Drawer.Screen>
      <Drawer.Screen name="Register" options={{ title: "Register" }}>
        {(props) => (
          <RegisterScreen {...props} onHome={() => props.navigation.navigate("Home")} onSuccess={() => props.navigation.navigate("Home")} onSwitch={() => props.navigation.navigate("Login")} />
        )}
      </Drawer.Screen>
      <Drawer.Screen name="Favorites" component={FavoritesScreen} />
      <Drawer.Screen name="UserDashboard" component={UserDashboardScreen} />
      <Drawer.Screen name="About" component={AboutScreen} />
      {isAdmin && (
        <>
          <Drawer.Screen name="AdminDashboard" component={AdminDashboardScreen} options={{ title: 'Admin • Dashboard' }} />
          <Drawer.Screen name="AdminCourses" component={AdminCoursesScreen} options={{ title: 'Admin • Courses' }} />
          <Drawer.Screen name="AdminTeachers" component={AdminTeachersScreen} options={{ title: 'Admin • Teachers' }} />
          <Drawer.Screen name="AdminEnrollment" component={require('../screens/admin/AdminEnrollmentScreen.jsx').default} options={{ title: 'Admin • Enrollments' }} />
          <Drawer.Screen name="AddCourse" component={require('../screens/admin/AddCourseScreen.jsx').default} options={{ title: 'Admin • Add Course' }} />
          <Drawer.Screen name="AdminData" component={AdminDataScreen} options={{ title: 'Admin • Data' }} />
          <Drawer.Screen name="AdminTeacherAccounts" component={AdminTeacherAccountsScreen} options={{ title: 'Admin • Teacher Accounts' }} />
        </>
      )}
    </Drawer.Navigator>
  );
}

export default function AppNavigator() {
  const { theme } = useTheme();

  // Preserve React Navigation's base theme (fonts, animation, etc.) and only override colors
  const navTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.surface,
      text: theme.colors.onSurface,
      border: theme.colors.outline,
      notification: theme.colors.error,
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.surface,
          },
          headerTintColor: theme.colors.onSurface,
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="Root" component={RootDrawer} options={{ headerShown: false }} />
        {/* Auth flow is always available as modal */}
        <Stack.Screen name="Auth" component={AuthStack} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}



