import React, { useMemo, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity } from 'react-native';
import AppHeader from '../components/ui/AppHeader';
import { useTheme } from '../hooks/useTheme';
import List from '../components/ui/List';
import CardRow from '../components/ui/CardRow';
import ConfirmModal from '../components/ui/ConfirmModal';
import Pagination from '../components/ui/Pagination';
import { paginate } from '../utils/paginate';
import useCourses from '../hooks/useCourses';
import useAuth from '../hooks/useAuth';
import { useDispatch, useSelector } from 'react-redux';
import { selectEnrollmentsByUser, unjoinCourse } from '../redux/slices/enrollmentSlice';

export default function UserDashboardScreen({ onHome }) {
  const { colors } = useTheme();
  const { courses } = useCourses();
  const { user } = useAuth();
  const dispatch = useDispatch();
  const enrolledIds = useSelector((s) => selectEnrollmentsByUser(s, user?.uid));
  const enrolledCourses = useMemo(() => courses.filter(c => enrolledIds.includes(String(c.id))), [courses, enrolledIds]);
  const [page, setPage] = useState(1);
  const { pageCount, paginated } = paginate(enrolledCourses, page, 8);
  const [confirm, setConfirm] = useState({ show: false, id: null });

  const doUnjoin = () => {
    if (confirm.id && user?.uid) dispatch(unjoinCourse({ userId: user.uid, courseId: confirm.id }));
    setConfirm({ show: false, id: null });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AppHeader title="My Courses" onHome={onHome} showMenu />
      <View style={{ padding: 16 }}>
        <FlatList
          data={paginated}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <List>
              <List.Item right={<View style={{ flexDirection: 'row' }}><Text></Text></View>}>
                <CardRow image={item.image} title={item.title} subtitle={item.category} metaRight={typeof item.price === 'number' ? `$${Number(item.price).toFixed(2)}` : ''} />
              </List.Item>
              <View style={{ height: 8 }} />
              <List.Item right={<View style={{ flexDirection: 'row' }}><Text></Text></View>}>
                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity onPress={() => setConfirm({ show: true, id: item.id })} style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: colors.border }}>
                    <Text style={{ color: colors.text }}>Unjoin</Text>
                  </TouchableOpacity>
                </View>
              </List.Item>
            </List>
          )}
          ListEmptyComponent={<List.Empty>No joined courses</List.Empty>}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
        <Pagination page={page} count={pageCount} onChange={(p) => setPage(p)} />
      </View>

      <ConfirmModal
        visible={confirm.show}
        title="Confirm"
        message="Unjoin this course?"
        onCancel={() => setConfirm({ show: false, id: null })}
        onConfirm={doUnjoin}
      />
    </View>
  );
}
