import React from 'react';
import { View, Text,TouchableOpacity, StyleSheet} from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
 import HomeScreen from '../Screens/HomeScreen';
import DrawerContent from '../Components/DrawerContent';




const Drawer = createDrawerNavigator()


export default function DrawerNavigator() {

    return (
        <Drawer.Navigator
            screenOptions={{
                activeTintColor: 'orange',
                headerShown: false,
                drawerStyle: {
                    backgroundColor: '#977700' // Set the background color here
                }
            }}
            drawerContent={props => <DrawerContent {...props} />}
        >

            <Drawer.Screen
                name="HomeScreen"
                component={HomeScreen}

                options={{
                    title: 'Client'
                 
                }}
            />


          

        </Drawer.Navigator>
    )

}