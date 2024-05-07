import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Splash from './Screens/Home/Splash';
import Index from './Screens/Home/Index';
import LoginScreen from './Screens/LoginScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  return (
    <NavigationContainer>
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
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
