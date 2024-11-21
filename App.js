import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import RegisterScreen from './screens/RegisterScreen';
import LoginScreen from './screens/LoginScreen';
import WelcomeScreen from './screens/WelcomeScreen'
import MenuScreen from './screens/MenuScreen';
import MovementsScreen from './screens/MovementsScreen';
import GenerateQRScreen from './screens/GenerateQRScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Menu" component={MenuScreen} />
        <Stack.Screen name="Movements" component={MovementsScreen} />
        <Stack.Screen name= "GenerateQR" component={GenerateQRScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}