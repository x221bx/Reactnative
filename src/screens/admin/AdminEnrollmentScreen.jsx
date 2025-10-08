import React, { useState, useEffect } from 'react';
import {
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import { Surface, Text, DataTable, Searchbar, SegmentedButtons } from 'react-native-paper';
import AppHeader from '../../components/ui/AppHeader';
import { useTheme } from '../../hooks/useTheme';

const AdminEnrollmentScreen = () => {
    const [courses, setCourses] = useState([]); // This would be populated from your backend
    const [searchQuery, setSearchQuery] = useState('');
    const [courseType, setCourseType] = useState('all'); // 'all', 'recorded', 'live'
    const { theme } = useTheme();

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = courseType === 'all' || course.type === courseType;
        return matchesSearch && matchesType;
    });

    const calculateEnrollmentStats = (course) => {
        return {
            totalStudents: course.enrollments?.length || 0,
            activeStudents: course.enrollments?.filter(e => e.status === 'active').length || 0,
            completionRate: calculateCompletionRate(course.enrollments),
        };
    };

    const calculateCompletionRate = (enrollments = []) => {
        if (!enrollments.length) return 0;
        const completed = enrollments.filter(e => e.status === 'completed').length;
        return ((completed / enrollments.length) * 100).toFixed(1);
    };

    return (
        <ScrollView style={styles.container}>
            <AppHeader title="Admin • Enrollments" showMenu />
            <Surface style={styles.surface}>
                <Text style={styles.title}>Course Enrollments</Text>

                <Searchbar
                    placeholder="Search courses..."
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={styles.searchBar}
                />

                <SegmentedButtons
                    value={courseType}
                    onValueChange={setCourseType}
                    buttons={[
                        { value: 'all', label: 'All Courses' },
                        { value: 'recorded', label: 'Recorded' },
                        { value: 'live', label: 'Live' },
                    ]}
                    style={styles.courseTypeSelector}
                />

                {/* Summary Cards */}
                <View style={styles.summaryContainer}>
                    <Surface style={[styles.summaryCard, { backgroundColor: theme.colors.primary }]}>
                        <Text style={styles.summaryTitle}>Total Courses</Text>
                        <Text style={styles.summaryValue}>{courses.length}</Text>
                    </Surface>

                    <Surface style={[styles.summaryCard, { backgroundColor: theme.colors.secondary }]}>
                        <Text style={styles.summaryTitle}>Total Students</Text>
                        <Text style={styles.summaryValue}>
                            {courses.reduce((total, course) => total + (course.enrollments?.length || 0), 0)}
                        </Text>
                    </Surface>

                    <Surface style={[styles.summaryCard, { backgroundColor: theme.colors.tertiary }]}>
                        <Text style={styles.summaryTitle}>Active Students</Text>
                        <Text style={styles.summaryValue}>
                            {courses.reduce((total, course) =>
                                total + (course.enrollments?.filter(e => e.status === 'active').length || 0), 0
                            )}
                        </Text>
                    </Surface>
                </View>

                {/* Courses Table */}
                <DataTable>
                    <DataTable.Header>
                        <DataTable.Title>Course</DataTable.Title>
                        <DataTable.Title numeric>Total Students</DataTable.Title>
                        <DataTable.Title numeric>Active</DataTable.Title>
                        <DataTable.Title numeric>Completion Rate</DataTable.Title>
                    </DataTable.Header>

                    {filteredCourses.map((course) => {
                        const stats = calculateEnrollmentStats(course);
                        return (
                            <DataTable.Row key={course.id}>
                                <DataTable.Cell>{course.title}</DataTable.Cell>
                                <DataTable.Cell numeric>{stats.totalStudents}</DataTable.Cell>
                                <DataTable.Cell numeric>{stats.activeStudents}</DataTable.Cell>
                                <DataTable.Cell numeric>{stats.completionRate}%</DataTable.Cell>
                            </DataTable.Row>
                        );
                    })}
                </DataTable>
            </Surface>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    surface: {
        margin: 16,
        padding: 16,
        borderRadius: 8,
        elevation: 4,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    searchBar: {
        marginBottom: 16,
    },
    courseTypeSelector: {
        marginBottom: 16,
    },
    summaryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    summaryCard: {
        flex: 1,
        margin: 4,
        padding: 16,
        borderRadius: 8,
        elevation: 2,
    },
    summaryTitle: {
        color: 'white',
        fontSize: 14,
        marginBottom: 8,
    },
    summaryValue: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
});

export default AdminEnrollmentScreen;
