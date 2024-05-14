import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function DrawerContent(props) {
    const navigation = useNavigation();

    const handleLogout = async () => {
        try {
            // Clear the stored token from AsyncStorage
            await AsyncStorage.removeItem('token');
            navigation.navigate('Login');
        } catch (error) {
            console.log('Error logging out:', error);
        }
    };

    return (
        <DrawerContentScrollView {...props} contentContainerStyle={styles.container}>
            <DrawerItem
                label="Accueil"
                icon={() => <Ionicons name='home-outline' size={24} color="white" />}
                onPress={() => props.navigation.navigate('Accueil')}
                labelStyle={styles.drawerItemLabel}
            />
            <DrawerItem
                label="Profil"
                icon={() => <Ionicons name='person-outline' size={24} color="white" />}
                onPress={() => props.navigation.navigate('Profil')}
                labelStyle={styles.drawerItemLabel}
            />
            <DrawerItem
                label="Tâches"
                icon={() => <Ionicons name='checkbox-outline' size={24} color="white" />}
                onPress={() => props.navigation.navigate('Tasks')}
                labelStyle={styles.drawerItemLabel}
            />

            <DrawerItem
                label="Finances"
                icon={() => <Ionicons name='cash-outline' size={24} color="white" />}
                onPress={() => props.navigation.navigate('Finances')}
                labelStyle={styles.drawerItemLabel}
            />
            <DrawerItem
                label="Stockage"
                icon={() => <Ionicons name='flask-outline' size={24} color="white" />}
                onPress={() => props.navigation.navigate('Storage')}
                labelStyle={styles.drawerItemLabel}
            />

            <DrawerItem
                label="Stats"
                icon={() => <Ionicons name='bar-chart-outline' size={24} color="white" />}
                onPress={() => props.navigation.navigate('Stats')}
                labelStyle={styles.drawerItemLabel}
            />

            <TouchableOpacity onPress={handleLogout} style={styles.logoutContainer}>
                <Ionicons name="exit-outline" size={24} color="white" style={styles.iconStyle} />
                <Text style={styles.drawerItemLabel}>Se déconnecter</Text>
            </TouchableOpacity>
        </DrawerContentScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop:20
    },
    drawerItemLabel: {
        fontSize: 15,
        color: '#ffffff',
        paddingVertical: 15,
    },
    iconStyle: {
        marginRight: 10,  
    },
    logoutContainer: {
        flexDirection: 'row',  
        alignItems: 'center',  
        borderTopWidth: 1,
        borderTopColor: '#ffffff',
        paddingVertical: 15,
        marginLeft: 15, 
    },
});
