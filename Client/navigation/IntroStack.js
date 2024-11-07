import React, { useState } from 'react';
 

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Splash from '../Screens/OnboardingScreens/Splash';
import Index from '../Screens/OnboardingScreens/Index';
import LoginScreen from '../Screens/UserAccountManagement/LoginScreen';
import RegisterScreen from '../Screens/UserAccountManagement/RegisterScreen';
import HomeScreen from '../Screens/HomeScreen';
import DrawerNavigator from './DrawerNavigator';
import ScannerScreenHiveDetails from '../Screens/Scan/ScannerScreenHiveDetails';
import HiveQRDetailsScreen from '../Screens/HiveQRDetails/HiveQRDetailsScreen';
import AddInspectionScreen from '../Screens/Inspections/AddInspectionScreen';
import ScannerScreenAddInspections from '../Screens/Scan/ScannerScreenAddInspections';
import InspectionsHistoryScreen from '../Screens/Inspections/InspectionsHistoryScreen';
import InspectionDetailsScreen from '../Screens/Inspections/InspectionDetailsScreen';
import HarvestDetailsScreen from '../Screens/Harvest/HarvestDetailsScreen';
import TransactionDetailsScreen from '../Screens/Finances/TransactionDetailsScreen';
import HomeNiveauStratScreen from '../Screens/HomeNiveauStratScreen';
import ApiaryDetailsScreen from '../Screens/Apiaries/ApiaryDetailsScreen';
import HiveDetailsScreen from '../Screens/Hives/HiveDetailsScreen';
import AlertBeekeepersScreen from '../Screens/AlertBeekeepersScreen';

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
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="HomeNiveauStrat" component={HomeNiveauStratScreen} />
          <Stack.Screen name="AlertBeekeepers" component={AlertBeekeepersScreen} />

          <Stack.Screen name="DrawerNavigator" component={DrawerNavigator} />
          <Stack.Screen name="ScannerScreenHiveDetails" component={ScannerScreenHiveDetails} />
          <Stack.Screen name="ScannerScreenAddInspections" component={ScannerScreenAddInspections} />


          <Stack.Screen name="HiveQRDetailsScreen" component={HiveQRDetailsScreen} options={{ title: 'Hive QR Details' }} />
          
          <Stack.Screen name="InspectionsHistoryScreen" component={InspectionsHistoryScreen} />
          <Stack.Screen name="InspectionDetailsScreen" component={InspectionDetailsScreen} options={{ title: 'Inspection Details Screen' }} />
          <Stack.Screen name="AddInspectionScreen" component={AddInspectionScreen} options={{ title: 'Add Hive Inspection' }} />

          <Stack.Screen name="ApiaryDetailsScreen" component={ApiaryDetailsScreen} options={{ title: 'Apiary Details Screen' }} />
          <Stack.Screen name="HiveDetailsScreen" component={HiveDetailsScreen} options={{ title: 'Hive Details Screen' }} />

          <Stack.Screen name="HarvestDetailsScreen" component={HarvestDetailsScreen} options={{ title: 'Harvest Details Screen' }} />
          <Stack.Screen name="TransactionDetailsScreen" component={TransactionDetailsScreen} options={{ title: 'Transaction Details Screen' }} />


    
        </>
      )}
    </Stack.Navigator>
  );
}