import React from 'react';

import HomeScreen from '../Screens/HomeScreen';
import ProfilScreen from '../Screens/UserAccountManagement/ProfilScreen';
import TasksScreen from '../Screens/Tasks/TasksScreen';
import TransactionsHistoryScreen from '../Screens/Finances/TrasnactionsHistoryScreen';
import HarvestHistoryScreen from '../Screens/Harvest/HarvestHistoryScreen';
import StatsScreen from '../Screens/Stats/StatsScreen';
import DrawerContent from '../Components/DrawerContent';
import AboutAppScreen from '../Screens/AboutAppScreen';
import StorageScreen from '../Screens/Storage/StorageScreen';
import GalleryScreen from '../Screens/GalleryScreen';
 

import { createDrawerNavigator } from '@react-navigation/drawer';



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
            <Drawer.Screen name="Harvest" component={HarvestHistoryScreen} />
            <Drawer.Screen name="Storage" component={StorageScreen}/>
            <Drawer.Screen name="Finances" component={TransactionsHistoryScreen} />
            <Drawer.Screen name="Gallery" component={GalleryScreen} />
            <Drawer.Screen name="Stats" component={StatsScreen} />
            <Drawer.Screen name="AboutApp" component={AboutAppScreen}/>

           




        </Drawer.Navigator>
    )

}