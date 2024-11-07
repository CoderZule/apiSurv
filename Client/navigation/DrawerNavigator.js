import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import LottieView from "lottie-react-native";

import HomeScreen from '../Screens/HomeScreen';
import HomeNiveauStratScreen from '../Screens/HomeNiveauStratScreen';
import ProfilScreen from '../Screens/UserAccountManagement/ProfilScreen';
import ApiaryHistoryScreen from '../Screens/Apiaries/ApiaryHistoryScreen';
import HiveHistoryScreen from '../Screens/Hives/HiveHistoryScreen';
import TasksScreen from '../Screens/Tasks/TasksScreen';
import TransactionsHistoryScreen from '../Screens/Finances/TrasnactionsHistoryScreen';
import HarvestHistoryScreen from '../Screens/Harvest/HarvestHistoryScreen';
import StatsScreen from '../Screens/Stats/StatsScreen';
import DrawerContent from '../Components/DrawerContent';
import AboutAppScreen from '../Screens/AboutAppScreen';
import StorageScreen from '../Screens/Storage/StorageScreen';
import GalleryScreen from '../Screens/Gallery/GalleryScreen';
import AlertBeekeepersScreen from '../Screens/AlertBeekeepersScreen';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createDrawerNavigator } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator()

export default function DrawerNavigator() {
    const [initialRoute, setInitialRoute] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getUserRole = async () => {
            const currentUser = await AsyncStorage.getItem('currentUser');
            if (currentUser) {
                const user = JSON.parse(currentUser);
                setInitialRoute(
                    user.Role === 'Niveau Stratégique'
                        ? 'HomeNiveauStrat'
                        : user.Role === 'Assistance intermédiaire'
                        ? 'AlertBeekeepers'
                        : 'Home'
                );                
            }
            setLoading(false);
        };

        getUserRole();
    }, []);


    if (loading) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <LottieView
                    source={require('../assets/lottie/loading.json')}
                    loop
                    style={{ width: 100, height: 100 }}
                />
            </View>
        );
    }

    return (
        <Drawer.Navigator
            initialRouteName={initialRoute}
            screenOptions={{
                activeTintColor: 'white',
                headerShown: false,
                drawerStyle: {
                    backgroundColor: "#fff",
                },
            }}
            drawerContent={props => <DrawerContent {...props} />}
        >
            <Drawer.Screen name="Home" component={HomeScreen} />
            <Drawer.Screen name="HomeNiveauStrat" component={HomeNiveauStratScreen} />
            <Drawer.Screen name="Profil" component={ProfilScreen} />
            <Drawer.Screen name="Apiary" component={ApiaryHistoryScreen} />
            <Drawer.Screen name="Hive" component={HiveHistoryScreen} />
            <Drawer.Screen name="Tasks" component={TasksScreen} />
            <Drawer.Screen name="Harvest" component={HarvestHistoryScreen} />
            <Drawer.Screen name="Storage" component={StorageScreen} />
            <Drawer.Screen name="Finances" component={TransactionsHistoryScreen} />
            <Drawer.Screen name="Stats" component={StatsScreen} />
            <Drawer.Screen name="Gallery" component={GalleryScreen} />
            <Drawer.Screen name="AlertBeekeepers" component={AlertBeekeepersScreen} />
            <Drawer.Screen name="AboutApp" component={AboutAppScreen} />

        </Drawer.Navigator>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});