import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function DrawerContent(props) {
    const navigation = useNavigation();

    const handleLogout = async () => {
        Alert.alert(
            'Confirmation',
            'Êtes-vous sûr de vouloir vous déconnecter?',
            [
                {
                    text: 'Annuler',
                    style: 'cancel'
                },
                {
                    text: 'Se déconnecter',
                    onPress: async () => {
                        try {
                            // Clear the stored token from AsyncStorage
                            await AsyncStorage.removeItem('token');
                            navigation.navigate('Login');
                        } catch (error) {
                            console.log('Error logging out:', error);
                        }
                    }
                }
            ],
            { cancelable: false }
        );
    };


    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                {/* Your logo image with an orange background */}
                <Image source={require('../assets/logo.png')} style={styles.logoImage} />
            </View>

            <DrawerContentScrollView {...props} contentContainerStyle={styles.contentContainer}>
                <DrawerItem
                    label="Accueil"
                    icon={() => <Ionicons name='home-outline' size={24} color="#977700" />}
                    onPress={() => props.navigation.navigate('Home')}
                    labelStyle={styles.drawerItemLabel}
                />
                <DrawerItem
                    label="Profil"
                    icon={() => <Ionicons name='person-outline' size={24} color="#977700" />}
                    onPress={() => props.navigation.navigate('Profil')}
                    labelStyle={styles.drawerItemLabel}
                />
               
                <DrawerItem
                    label="Tâches"
                    icon={() => <Ionicons name='checkbox-outline' size={24} color="#977700" />}
                    onPress={() => props.navigation.navigate('Tasks')}
                    labelStyle={styles.drawerItemLabel}
                />

                <DrawerItem
                    label="Finances"
                    icon={() => <Ionicons name='cash-outline' size={24} color="#977700" />}
                    onPress={() => props.navigation.navigate('Finances')}
                    labelStyle={styles.drawerItemLabel}
                />
                <DrawerItem
                    label="Récolte"
                    icon={() => <Ionicons name='flask-outline' size={24} color="#977700" />}
                    onPress={() => props.navigation.navigate('Harvest')}
                    labelStyle={styles.drawerItemLabel}
                />

                <DrawerItem
                    label="Statistiques"
                    icon={() => <Ionicons name='bar-chart-outline' size={24} color="#977700" />}
                    onPress={() => props.navigation.navigate('Stats')}
                    labelStyle={styles.drawerItemLabel}
                />

                <DrawerItem
                    label="À propos"
                    icon={() => <Ionicons name='information-circle-outline' size={24} color="#977700" />}
                    onPress={() => props.navigation.navigate('AboutApp')}
                    labelStyle={styles.drawerItemLabel}
                />

                <TouchableOpacity onPress={handleLogout} style={styles.logoutContainer}>
                    <Ionicons name="exit-outline" size={24} color="#977700" style={styles.iconStyle} />
                    <Text style={styles.drawerItemLogout}>Se déconnecter</Text>
                </TouchableOpacity>
            </DrawerContentScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        paddingTop: 20,
    },

    logoContainer: {
        backgroundColor: '#977700',
        alignItems: 'center',
        justifyContent: 'center',
        height: 150,
    },
    logoImage: {
        width: 120,
        height: 120,
    },
    drawerItemLabel: {
        fontSize: 15,
        color: '#000000',
    },
    drawerItemLogout: {
        fontSize: 15,
        color: '#977700',
    },
    iconStyle: {
        marginRight: 10,
    },
    logoutContainer: {
        flexDirection: 'row', // Arrange items horizontally
        alignItems: 'center', // Centers the content vertically
        justifyContent: 'center', // Centers the content horizontally
        paddingTop: 80, // Adjust the top padding as needed
    },
});
