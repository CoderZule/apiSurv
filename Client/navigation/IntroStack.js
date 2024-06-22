import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';


import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Splash from '../Screens/OnboardingScreens/Splash';
import Index from '../Screens/OnboardingScreens/Index';
import LoginScreen from '../Screens/UserAccountManagement/LoginScreen';
import HomeScreen from '../Screens/HomeScreen';
import DrawerNavigator from './DrawerNavigator';
import ScannerScreenInspectionsDetails from '../Screens/Scan/ScannerScreenInspectionsDetails';
import HiveDetailsScreen from '../Screens/HiveDetails/HiveDetailsScreen';
import AddInspectionScreen from '../Screens/Inspections/AddInspectionScreen';
import ScannerScreenAddInspections from '../Screens/Scan/ScannerScreenAddInspections';
import InspectionsHistoryScreen from '../Screens/Inspections/InspectionsHistoryScreen';
import InspectionDetailsScreen from '../Screens/Inspections/InspectionDetailsScreen';
 
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
          <Stack.Screen name="ScannerScreenInspectionsDetails" component={ScannerScreenInspectionsDetails} />
          <Stack.Screen name="ScannerScreenAddInspections" component={ScannerScreenAddInspections} />


          <Stack.Screen name="HiveDetailsScreen" component={HiveDetailsScreen} options={{ title: 'Hive Details' }} />
          <Stack.Screen name="InspectionsHistoryScreen" component={InspectionsHistoryScreen} options={{ title: 'Inspections History Screen' }} />
          <Stack.Screen name="InspectionDetailsScreen" component={InspectionDetailsScreen} options={{ title: 'Inspection Details Screen' }} />

          <Stack.Screen name="AddInspectionScreen" component={AddInspectionScreen} options={{ title: 'Add Hive Inspection' }} />
 
        </>
      )}
    </Stack.Navigator>
  );
}