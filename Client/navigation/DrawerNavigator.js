import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import HomeScreen from '../Screens/HomeScreen';
import ProfilScreen from '../Screens/UserAccountManagement/ProfilScreen';
import TasksScreen from '../Screens/Tasks/TasksScreen';
import FinancesScreen from '../Screens/FinancialTracking/FinancesScreen';
import HarvestHistoryScreen from '../Screens/HarvestTracking/HarvestHistoryScreen';
import StatsScreen from '../Screens/Stats/StatsScreen';
import DrawerContent from '../Components/DrawerContent';
import AboutAppScreen from '../Screens/AboutAppScreen';




const Drawer = createDrawerNavigator()


export default function DrawerNavigator() {

    return (
        <Drawer.Navigator
            screenOptions={{
                activeTintColor: 'white',
                headerShown: false,
                drawerStyle: {
                    backgroundColor: "#fff",
                   
                }
            }}
            drawerContent={props => <DrawerContent {...props} />}
        >

            <Drawer.Screen name="Home" component={HomeScreen} />
            <Drawer.Screen name="Profil" component={ProfilScreen} />
            <Drawer.Screen name="Tasks" component={TasksScreen} />
            <Drawer.Screen name="Finances" component={FinancesScreen} />
            <Drawer.Screen name="Harvest" component={HarvestHistoryScreen} />
            <Drawer.Screen name="Stats" component={StatsScreen} />
            <Drawer.Screen name="AboutApp" component={AboutAppScreen}/>




        </Drawer.Navigator>
    )

}