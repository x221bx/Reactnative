import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useTheme } from '../hooks/useTheme';

// Admin Screens
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import AdminCoursesScreen from '../screens/admin/AdminCoursesScreen';
import AddCourseScreen from '../screens/admin/AddCourseScreen';
import AdminTeachersScreen from '../screens/admin/AdminTeachersScreen';
import AdminEnrollmentScreen from '../screens/admin/AdminEnrollmentScreen';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const CoursesStack = () => (
    <Stack.Navigator>
        <Stack.Screen
            name="CoursesList"
            component={AdminCoursesScreen}
            options={{ title: 'Courses Management' }}
        />
        <Stack.Screen
            name="AddCourse"
            component={AddCourseScreen}
            options={{ title: 'Add New Course' }}
        />
    </Stack.Navigator>
);

const TeachersStack = () => (
    <Stack.Navigator>
        <Stack.Screen
            name="TeachersList"
            component={AdminTeachersScreen}
            options={{ title: 'Teachers Management' }}
        />
    </Stack.Navigator>
);

const AdminNavigator = () => {
    const { theme } = useTheme();

    return (
        <Drawer.Navigator
            screenOptions={({ route }) => ({
                drawerIcon: ({ color, size }) => {
                    let iconName;
                    switch (route.name) {
                        case 'Dashboard':
                            iconName = 'dashboard';
                            break;
                        case 'Courses':
                            iconName = 'school';
                            break;
                        case 'Teachers':
                            iconName = 'people';
                            break;
                        case 'Enrollments':
                            iconName = 'person-add';
                            break;
                        default:
                            iconName = 'circle';
                    }
                    return <MaterialIcons name={iconName} size={size} color={color} />;
                },
                drawerActiveTintColor: theme.colors.primary,
                drawerInactiveTintColor: 'gray',
            })}
        >
            <Drawer.Screen
                name="Dashboard"
                component={AdminDashboardScreen}
                options={{ title: 'Dashboard' }}
            />
            <Drawer.Screen
                name="Courses"
                component={CoursesStack}
                options={{ title: 'Courses' }}
            />
            <Drawer.Screen
                name="Teachers"
                component={TeachersStack}
                options={{ title: 'Teachers' }}
            />
            <Drawer.Screen
                name="Enrollments"
                component={AdminEnrollmentScreen}
                options={{ title: 'Enrollments' }}
            />
        </Drawer.Navigator>
    );
};

export default AdminNavigator;