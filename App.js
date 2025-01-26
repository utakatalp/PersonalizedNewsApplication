import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import CategorySelectionScreen from './src/screens/CategorySelectionScreen';
import HomeScreen from './src/screens/HomeScreen';
import NewsListScreen from './src/screens/NewsListScreen';
import NewsDetailScreen from './src/screens/NewsDetailScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#007AFF',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="CategorySelection" 
          component={CategorySelectionScreen}
          options={{ 
            headerShown: false,
            gestureEnabled: false 
          }}
        />
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ title: 'News' }}
        />
        <Stack.Screen 
          name="NewsList" 
          component={NewsListScreen}
          options={{ title: 'News' }}
        />
        <Stack.Screen 
          name="NewsDetail" 
          component={NewsDetailScreen}
          options={{ title: 'News Detail' }}
        />
        <Stack.Screen 
          name="Settings" 
          component={SettingsScreen}
          options={{ title: 'Settings' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
} 