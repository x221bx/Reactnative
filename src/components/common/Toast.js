import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

let lastShow = null;
export function showToast(message, duration = 2000) {
  lastShow?.(message, duration);
}

export default function ToastHost() {
  const { colors } = useTheme();
  const [msg, setMsg] = React.useState('');
  const [visible, setVisible] = React.useState(false);
  const opacity = React.useRef(new Animated.Value(0)).current;

  const apiShow = (m, d) => {
    setMsg(String(m || ''));
    setVisible(true);
    Animated.timing(opacity, { toValue: 1, duration: 150, useNativeDriver: false }).start(() => {
      setTimeout(() => {
        Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: false }).start(() => {
          setVisible(false);
          setMsg('');
        });
      }, d);
    });
  };

  React.useEffect(() => { lastShow = apiShow; return () => { if (lastShow === apiShow) lastShow = null; }; }, []);

  if (!visible) return null;
  return (
    <Animated.View style={[styles.wrap, { opacity }]} pointerEvents="none">
      <View style={[styles.toast, { backgroundColor: colors.text }]}> 
        <Text style={{ color: colors.bg, fontWeight: '700' }}>{msg}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', bottom: 24, left: 0, right: 0, alignItems: 'center', zIndex: 1000 },
  toast: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 },
});

