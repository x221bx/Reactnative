import React, { useState, useEffect } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    Image,
    Platform,
} from 'react-native';
import { TextInput, Button, Text, Surface, Menu } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import useTeachers from '../../hooks/useTeachers';
import CalendarPicker from '../../components/ui/CalendarPicker';
import useCourses from '../../hooks/useCourses';
import ConfirmModal from '../../components/ui/ConfirmModal';
import AppHeader from '../../components/ui/AppHeader';
// DateTimePicker will be lazy-loaded on native to avoid web bundling issues
import { Picker } from '@react-native-picker/picker';

const AddCourseScreen = () => {
    const [courseData, setCourseData] = useState({
        title: '',
        description: '',
        price: '',
        duration: '',
        schedule: '',
        teacherId: '',
        image: null,
        video: null,
        sessions: [],
    });
    const [newSession, setNewSession] = useState('');

    const { teachers, loading } = useTeachers();
    const { addCourse } = useCourses();
    const [pickerVisible, setPickerVisible] = useState(false);
    const [DateTimePickerModalComp, setDateTimePickerModalComp] = useState(null);
    const [DatePickerModalComp, setDatePickerModalComp] = useState(null);
    const [TimePickerModalComp, setTimePickerModalComp] = useState(null);
    const [calendarVisible, setCalendarVisible] = useState(false);
  const [timeVisible, setTimeVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [confirmSes, setConfirmSes] = useState({ show: false, idx: null });
  const [selHour, setSelHour] = useState(12);
  const [selMinute, setSelMinute] = useState(0);
    const [teacherMenuVisible, setTeacherMenuVisible] = useState(false);

    useEffect(() => {
        if (Platform.OS !== 'web') {
            import('react-native-modal-datetime-picker')
                .then((mod) => setDateTimePickerModalComp(() => mod.default))
                .catch(() => {});
        }
        import('react-native-paper-dates')
            .then((mod) => {
                setDatePickerModalComp(() => mod.DatePickerModal);
                setTimePickerModalComp(() => mod.TimePickerModal);
            })
            .catch(() => {});
    }, []);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [16, 9],
            quality: 1,
        });

        if (!result.canceled) {
            setCourseData(prev => ({ ...prev, image: result.assets[0].uri }));
        }
    };

    const pickVideo = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({ type: 'video/*' });
            // Support both legacy and new return shapes
            if (result?.type === 'success' && result?.uri) {
                setCourseData(prev => ({ ...prev, video: result.uri }));
                return;
            }
            if (result?.assets?.length) {
                setCourseData(prev => ({ ...prev, video: result.assets[0].uri }));
                return;
            }
            if (result?.canceled) return;
        } catch (err) {
            console.log('Error picking video:', err);
        }
    };

    const [submitting, setSubmitting] = useState(false);
    const [snack, setSnack] = useState({ show: false, msg: '' });

    const handleSubmit = async () => {
        try {
            setSubmitting(true);
            const payload = { ...courseData, price: Number(courseData.price) || 0 };
            await addCourse(payload);
            setSnack({ show: true, msg: 'Course created successfully' });
            setCourseData({ title: '', description: '', price: '', duration: '', schedule: '', teacherId: '', image: null, video: null, sessions: [] });
        } catch (error) {
            setSnack({ show: true, msg: 'Failed to create course' });
            console.error('Error creating course:', error);
        } finally {
            setSubmitting(false);
            setTimeout(() => setSnack({ show: false, msg: '' }), 2000);
        }
    };

    const onConfirmCalendar = ({ date }) => {
        setSelectedDate(date);
        setCalendarVisible(false);
        setTimeVisible(true);
    };

  const onConfirmTime = ({ hours, minutes }) => {
    try {
      const base = selectedDate ? new Date(selectedDate) : new Date();
      base.setHours(hours);
      base.setMinutes(minutes);
      setCourseData(prev => ({ ...prev, sessions: [...prev.sessions, base.toISOString()] }));
    } finally {
      setTimeVisible(false);
    }
  };

  const FallbackTimePicker = () => (
    <View style={styles.overlay}> 
      <View style={[styles.timeCard, { backgroundColor: '#fff', borderColor: '#ddd' }]}> 
        <Text style={{ marginBottom: 8 }}>Select Time</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {Array.from({ length: 24 }).map((_, h) => (
            <Button key={h} mode={selHour === h ? 'contained' : 'outlined'} onPress={() => setSelHour(h)} style={{ margin: 4 }}>{String(h).padStart(2,'0')}</Button>
          ))}
        </View>
        <View style={{ height: 8 }} />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {[0, 15, 30, 45].map((m) => (
            <Button key={m} mode={selMinute === m ? 'contained' : 'outlined'} onPress={() => setSelMinute(m)} style={{ margin: 4 }}>{String(m).padStart(2,'0')}</Button>
          ))}
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 }}>
          <Button mode="outlined" onPress={() => setTimeVisible(false)} style={{ marginRight: 8 }}>Cancel</Button>
          <Button mode="contained" onPress={() => onConfirmTime({ hours: selHour, minutes: selMinute })}>OK</Button>
        </View>
      </View>
    </View>
  );

    return (
        <ScrollView style={styles.container}>
            <AppHeader title="Admin • Add Course" showMenu />
            <Surface style={styles.surface}>
                <Text style={styles.title}>Add New Course</Text>

                <TextInput
                    label="Course Title"
                    value={courseData.title}
                    onChangeText={(text) => setCourseData(prev => ({ ...prev, title: text }))}
                    style={styles.input}
                />

                <TextInput
                    label="Description"
                    value={courseData.description}
                    onChangeText={(text) => setCourseData(prev => ({ ...prev, description: text }))}
                    multiline
                    numberOfLines={4}
                    style={styles.input}
                />

                <TextInput
                    label="Price"
                    value={courseData.price}
                    onChangeText={(text) => setCourseData(prev => ({ ...prev, price: text }))}
                    keyboardType="numeric"
                    style={styles.input}
                />

                <TextInput
                    label="Duration (hours)"
                    value={courseData.duration}
                    onChangeText={(text) => setCourseData(prev => ({ ...prev, duration: text }))}
                    keyboardType="numeric"
                    style={styles.input}
                />

                <TextInput
                    label="Schedule"
                    value={courseData.schedule}
                    onChangeText={(text) => setCourseData(prev => ({ ...prev, schedule: text }))}
                    placeholder="e.g., Mon/Wed 2PM-4PM"
                    style={styles.input}
                />

                {/* Simple sessions list (can be enhanced with DateTimePicker) */}
                <View style={{ marginBottom: 16 }}>
                    <Text>Sessions</Text>
                      {courseData.sessions.map((s, idx) => (
                          <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
                              <Text>{new Date(s).toLocaleString()}</Text>
                              <Button mode="outlined" onPress={() => setConfirmSes({ show: true, idx })}>Remove</Button>
                          </View>
                      ))}
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                        <TextInput
                            label="YYYY-MM-DD HH:mm"
                            value={newSession}
                            onChangeText={setNewSession}
                            style={[styles.input, { flex: 1, marginBottom: 0 }]}
                        />
                        <Button mode="contained" onPress={() => {
                            const parsed = Date.parse(newSession.replace(' ', 'T'));
                            if (!isNaN(parsed)) {
                                setCourseData(prev => ({ ...prev, sessions: [...prev.sessions, new Date(parsed).toISOString()] }));
                                setNewSession('');
                            }
                        }} style={{ marginLeft: 8 }}>Add</Button>
                    </View>
                    <Button mode="outlined" onPress={() => setCourseData(prev => ({ ...prev, sessions: [...prev.sessions, new Date().toISOString()] }))} style={{ marginTop: 8 }}>Add Session (now)</Button>
                      {Platform.OS !== 'web' && (
                        <Button mode="contained" onPress={() => setPickerVisible(true)} style={{ marginTop: 8 }}>Pick Date/Time</Button>
                      )}
                      {DatePickerModalComp && (
                        <Button mode="contained" onPress={() => setCalendarVisible(true)} style={{ marginTop: 8 }}>Add From Calendar</Button>
                      )}
                      {!DatePickerModalComp && (
                        <Button mode="contained" onPress={() => setCalendarVisible(true)} style={{ marginTop: 8 }}>Add From Calendar</Button>
                      )}
                  </View>

                {DateTimePickerModalComp && (
                  <DateTimePickerModalComp
                    isVisible={pickerVisible}
                    mode="datetime"
                    onConfirm={(date) => { setCourseData(prev => ({ ...prev, sessions: [...prev.sessions, date.toISOString()] })); setPickerVisible(false); }}
                    onCancel={() => setPickerVisible(false)}
                  />
                  )}

                  {DatePickerModalComp && (
                    <DatePickerModalComp
                      locale="en"
                      mode="single"
                      visible={calendarVisible}
                      onDismiss={() => setCalendarVisible(false)}
                      date={selectedDate || new Date()}
                      onConfirm={onConfirmCalendar}
                    />
                  )}
                  {!DatePickerModalComp && (
                    <CalendarPicker
                      visible={calendarVisible}
                      value={selectedDate ? selectedDate.toISOString() : ''}
                      onClose={() => setCalendarVisible(false)}
                      onSelect={(iso) => { setSelectedDate(new Date(iso)); setCalendarVisible(false); setTimeVisible(true); }}
                    />
                  )}
                  {TimePickerModalComp && (
                    <TimePickerModalComp
                      visible={timeVisible}
                      onDismiss={() => setTimeVisible(false)}
                      onConfirm={onConfirmTime}
                    />
                  )}
                  {!TimePickerModalComp && timeVisible && (
                    <FallbackTimePicker />
                  )}

                <View style={styles.pickerContainer}>
                    <Text style={{ marginBottom: 6 }}>Select Teacher</Text>
                    {Platform.OS === 'web' ? (
                      <View style={{ alignSelf: 'flex-start' }}>
                        <Menu
                          visible={teacherMenuVisible}
                          onDismiss={() => setTeacherMenuVisible(false)}
                          anchor={<Button mode="outlined" onPress={() => setTeacherMenuVisible(true)}>{courseData.teacherId ? (teachers.find(t => String(t.id) === String(courseData.teacherId))?.name || 'Select a teacher') : 'Select a teacher'}</Button>}
                        >
                          <Menu.Item onPress={() => { setCourseData(prev => ({ ...prev, teacherId: '' })); setTeacherMenuVisible(false); }} title="None" />
                          {(teachers || []).map((t) => (
                            <Menu.Item key={t.id} onPress={() => { setCourseData(prev => ({ ...prev, teacherId: t.id })); setTeacherMenuVisible(false); }} title={t.name} />
                          ))}
                        </Menu>
                      </View>
                    ) : (
                      <Picker
                        selectedValue={courseData.teacherId}
                        onValueChange={(itemValue) => setCourseData(prev => ({ ...prev, teacherId: itemValue }))}
                        style={styles.picker}
                      >
                        <Picker.Item label="Select a teacher" value="" />
                        {teachers?.map((teacher) => (
                          <Picker.Item key={teacher.id} label={teacher.name} value={teacher.id} />
                        ))}
                      </Picker>
                    )}
                </View>

                <Button
                    mode="contained"
                    onPress={pickImage}
                    style={styles.button}
                >
                    Upload Course Image
                </Button>
                {courseData.image && (
                    <Image source={{ uri: courseData.image }} style={styles.preview} />
                )}

                <Button
                    mode="contained"
                    onPress={pickVideo}
                    style={styles.button}
                >
                    Upload Course Video
                </Button>
                {courseData.video && (
                    <Text style={styles.fileSelected}>Video selected: {courseData.video}</Text>
                )}

                <Button
                    mode="contained"
                    onPress={handleSubmit}
                    style={[styles.button, styles.submitButton]}
                    loading={submitting}
                    disabled={submitting}
                >
                    Create Course
                </Button>
            </Surface>
            {snack.show && (
                <View style={{ position: 'absolute', bottom: 16, left: 0, right: 0, alignItems: 'center' }}>
                    <View style={{ backgroundColor: '#333', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 }}>
                        <Text style={{ color: '#fff' }}>{snack.msg}</Text>
                    </View>
                </View>
            )}
            <ConfirmModal
              visible={confirmSes.show}
              title="Confirm"
              message="Remove this session?"
              onCancel={() => setConfirmSes({ show: false, idx: null })}
              onConfirm={() => { if (confirmSes.idx != null) setCourseData(prev => ({ ...prev, sessions: prev.sessions.filter((_, i) => i !== confirmSes.idx) })); setConfirmSes({ show: false, idx: null }); }}
            />
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
    input: {
        marginBottom: 16,
    },
    overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center', zIndex: 10 },
    timeCard: { width: '90%', maxWidth: 480, borderRadius: 12, borderWidth: 1, padding: 12 },
    pickerContainer: {
        marginBottom: 16,
    },
    picker: {
        marginTop: 8,
        backgroundColor: '#f0f0f0',
        borderRadius: 4,
    },
    button: {
        marginVertical: 8,
    },
    submitButton: {
        marginTop: 24,
        backgroundColor: '#4CAF50',
    },
    preview: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
        borderRadius: 8,
        marginVertical: 8,
    },
    fileSelected: {
        marginVertical: 8,
        color: '#666',
    },
});

export default AddCourseScreen;

