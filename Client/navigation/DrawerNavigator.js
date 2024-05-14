import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from '../Screens/HomeScreen';
import ProfilScreen from '../Screens/ProfilScreen';
import TasksScreen from '../Screens/TasksScreen';
import FinancesScreen from '../Screens/FinancesScreen';
import StorageScreen from '../Screens/StorageScreen';
import StatsScreen from '../Screens/StatsScreen';

import DrawerContent from '../Components/DrawerContent';




const Drawer = createDrawerNavigator()


export default function DrawerNavigator() {

    return (
        <Drawer.Navigator
            screenOptions={{
                activeTintColor: 'white',
                headerShown: false,
                drawerStyle: {
                    backgroundColor: "#000000",
                   
                }
            }}
            drawerContent={props => <DrawerContent {...props} />}
        >

            <Drawer.Screen name="Accueil" component={HomeScreen} />
            <Drawer.Screen name="Profil" component={ProfilScreen} />
            <Drawer.Screen name="Tasks" component={TasksScreen} />
            <Drawer.Screen name="Finances" component={FinancesScreen} />
            <Drawer.Screen name="Storage" component={StorageScreen} />
            <Drawer.Screen name="Stats" component={StatsScreen} />




        </Drawer.Navigator>
    )

}