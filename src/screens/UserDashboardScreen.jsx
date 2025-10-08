import React, { useMemo, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, Image, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({ name: user?.displayName || '', dob: user?.dob || '', photoURL: user?.photoURL || '' });

  const doUnjoin = () => {
    if (confirm.id && user?.uid) dispatch(unjoinCourse({ userId: user.uid, courseId: confirm.id }));
    setConfirm({ show: false, id: null });
  };

  const saveProfile = async () => {
    try {
      if (!user?.email) return;
      if (profile.name) await AsyncStorage.setItem(`@profile_name_${user.email}`, String(profile.name));
      if (profile.dob != null) await AsyncStorage.setItem(`@profile_dob_${user.email}`, String(profile.dob));
      if (profile.photoURL) await AsyncStorage.setItem(`@profile_image_${user.email}`, String(profile.photoURL));
      const stored = await AsyncStorage.getItem('auth_user');
      const u = stored ? JSON.parse(stored) : {};
      const next = { ...u, displayName: profile.name || u.displayName, dob: profile.dob || u.dob, photoURL: profile.photoURL || u.photoURL };
      await AsyncStorage.setItem('auth_user', JSON.stringify(next));
      setEditing(false);
    } catch (e) {}
  };

  const pickAvatar = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1, 1], quality: 0.8 });
      if (!result.canceled) {
        const uri = result.assets[0].uri;
        setProfile((p) => ({ ...p, photoURL: uri }));
        if (user?.email) await AsyncStorage.setItem(`@profile_image_${user.email}`, String(uri));
        const stored = await AsyncStorage.getItem('auth_user');
        const u = stored ? JSON.parse(stored) : {};
        const next = { ...u, photoURL: uri };
        await AsyncStorage.setItem('auth_user', JSON.stringify(next));
      }
    } catch {}
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AppHeader title="My Courses" onHome={onHome} showMenu />
      <View style={{ padding: 16 }}>
        <View style={{ alignItems: 'center', marginBottom: 16 }}>
          <View style={{ width: 84, height: 84, borderRadius: 42, backgroundColor: colors.border, overflow: 'hidden', marginBottom: 8, alignItems: 'center', justifyContent: 'center' }}>
            {profile.photoURL ? (
              <Image source={{ uri: profile.photoURL }} style={{ width: 84, height: 84, borderRadius: 42 }} />
            ) : (
              <Text style={{ color: colors.muted }}>No Avatar</Text>
            )}
          </View>
          <TouchableOpacity onPress={pickAvatar} style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: colors.border, marginBottom: 8 }}>
            <Text style={{ color: colors.text }}>Change Avatar</Text>
          </TouchableOpacity>
          {!editing ? (
            <>
              <Text style={{ color: colors.text, fontWeight: '800' }}>{profile.name || user?.email}</Text>
              {!!profile.dob && <Text style={{ color: colors.muted, marginTop: 4 }}>{profile.dob}</Text>}
              <View style={{ height: 8 }} />
              <TouchableOpacity onPress={() => setEditing(true)} style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: colors.border }}>
                <Text style={{ color: colors.text }}>Edit Profile</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={{ width: '100%', maxWidth: 480 }}>
              <TextInput placeholder="Display name" value={profile.name} onChangeText={(v) => setProfile((p) => ({ ...p, name: v }))} style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 10, color: colors.text }} />
              <View style={{ height: 8 }} />
              <TextInput placeholder="Date of birth (YYYY-MM-DD)" value={profile.dob} onChangeText={(v) => setProfile((p) => ({ ...p, dob: v }))} style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 10, color: colors.text }} />
              <View style={{ height: 8 }} />
              <TextInput placeholder="Avatar URL" value={profile.photoURL} onChangeText={(v) => setProfile((p) => ({ ...p, photoURL: v }))} style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 10, color: colors.text }} />
              <View style={{ height: 8 }} />
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={saveProfile} style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: colors.border, marginRight: 8, backgroundColor: colors.text }}>
                  <Text style={{ color: colors.bg }}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setEditing(false)} style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: colors.border }}>
                  <Text style={{ color: colors.text }}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

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
