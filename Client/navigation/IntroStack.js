import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';


import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Splash from '../Screens/WelcomingScreens/Splash';
import Index from '../Screens/WelcomingScreens/Index';
import LoginScreen from '../Screens/LoginScreen'
import HomeScreen from '../Screens/HomeScreen';
import DrawerNavigator from './DrawerNavigator';
import ScannerScreen from '../Screens/ScannerScreen';
import HiveDetailsScreen from '../Screens/HiveDetailsScreen';


const Stack = createNativeStackNavigator();

export function IntroStack() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {showSplash ? (
        <Stack.Screen name="Splash">
          {props => <Splash {...props} onFinish={handleSplashFinish} />}
        </Stack.Screen>
      ) : (
        <>
          <Stack.Screen name="Index" component={Index} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="DrawerNavigator" component={DrawerNavigator} />
          <Stack.Screen name="ScannerScreen" component={ScannerScreen} />
          <Stack.Screen name="HiveDetailsScreen" component={HiveDetailsScreen} options={{ title: 'Hive Details' }} />

        </>
      )}
    </Stack.Navigator>
  );
}