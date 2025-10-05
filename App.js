import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider as PaperProvider, MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

// Store
import store, { persistor } from './src/redux/store';

// Providers
import { ThemeProvider } from './src/theme/ThemeContext';
import { I18nProvider } from './src/i18n/i18n';
import { AuthProvider } from './src/context/AuthContext';
import { useTheme } from './src/theme/ThemeContext';

// Navigation
import AppNavigator from './src/navigation/AppNavigator.jsx';

// Error Boundary
import ErrorBoundary from './src/components/common/ErrorBoundary';

function ThemedPaperProvider({ children }) {
  const { theme } = useTheme();
  const base = theme.dark ? MD3DarkTheme : MD3LightTheme;
  const paperTheme = {
    ...base,
    colors: {
      ...base.colors,
      ...theme.colors,
      elevation: {
        ...base.colors.elevation,
        ...(theme.colors?.elevation || {}),
      },
    },
  };
  return <PaperProvider theme={paperTheme}>{children}</PaperProvider>;
}

export default function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
              <ThemeProvider>
                <ThemedPaperProvider>
                  <I18nProvider>
                    <AuthProvider>
                      <AppNavigator />
                      <StatusBar style="auto" />
                    </AuthProvider>
                  </I18nProvider>
                </ThemedPaperProvider>
              </ThemeProvider>
            </SafeAreaProvider>
          </GestureHandlerRootView>
        </PersistGate>
      </Provider>
    </ErrorBoundary>
  );
}
