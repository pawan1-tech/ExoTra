import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  const scheme = useColorScheme();

  return (
    <>
      <AppNavigator />
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
    </>
  );
}
