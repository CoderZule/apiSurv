import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function DrawerContent(props) {
    const navigation = useNavigation();
    const [role, setRole] = useState('');

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const user = await AsyncStorage.getItem('currentUser');
                if (user) {
                    const parsedUser = JSON.parse(user);
                    setRole(parsedUser.Role);
                }
            } catch (error) {
                console.log('Error fetching user role:', error);
            }
        };

        fetchUserRole();
    }, []);

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
                            await AsyncStorage.removeItem('token');
                            await AsyncStorage.removeItem('currentUser');
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'Login' }],
                            });
                        } catch (error) {
                            console.log('Error logging out:', error);
                        }
                    }
                }
            ],
            { cancelable: false }
        );
    };

    const renderDrawerItems = () => {
        if (role === 'Apiculteur' || role === 'Assistance intermédiaire') {
            return (
                <>
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

                    {role === 'Assistance intermédiaire' &&
                        <DrawerItem
                            label="Présence de maladies"
                            icon={() => <Ionicons name='pulse-outline' size={24} color="#977700" />}
                            onPress={() => props.navigation.navigate('AlertBeekeepers')}
                            labelStyle={styles.drawerItemLabel}
                        />
                    }
                    <DrawerItem
                        label="Tâches"
                        icon={() => <Ionicons name='calendar-outline' size={24} color="#977700" />}
                        onPress={() => props.navigation.navigate('Tasks')}
                        labelStyle={styles.drawerItemLabel}
                    />
                    <DrawerItem
                        label="Récoltes"
                        icon={() => <Ionicons name='flask-outline' size={24} color="#977700" />}
                        onPress={() => props.navigation.navigate('Harvest')}
                        labelStyle={styles.drawerItemLabel}
                    />
                    <DrawerItem
                        label="Produits en stock"
                        icon={() => <Ionicons name='storefront-outline' size={24} color="#977700" />}
                        onPress={() => props.navigation.navigate('Storage')}
                        labelStyle={styles.drawerItemLabel}
                    />
                    <DrawerItem
                        label="Finances"
                        icon={() => <Ionicons name='cash-outline' size={24} color="#977700" />}
                        onPress={() => props.navigation.navigate('Finances')}
                        labelStyle={styles.drawerItemLabel}
                    />
                    <DrawerItem
                        label="Stats et Graphs"
                        icon={() => <Ionicons name='bar-chart-outline' size={24} color="#977700" />}
                        onPress={() => props.navigation.navigate('Stats')}
                        labelStyle={styles.drawerItemLabel}
                    />
                    <DrawerItem
                        label="Galerie"
                        icon={() => <Ionicons name='images-outline' size={24} color="#977700" />}
                        onPress={() => props.navigation.navigate('Gallery')}
                        labelStyle={styles.drawerItemLabel}
                    />

                    <DrawerItem
                        label="À propos"
                        icon={() => <Ionicons name='information-circle-outline' size={24} color="#977700" />}
                        onPress={() => props.navigation.navigate('AboutApp')}
                        labelStyle={styles.drawerItemLabel}
                    />
                </>
            );
        } else if (role === 'Niveau Stratégique') {
            return (
                <>
                    <DrawerItem
                        label="Accueil"
                        icon={() => <Ionicons name='home-outline' size={24} color="#977700" />}
                        onPress={() => props.navigation.navigate('HomeNiveauStrat')}
                        labelStyle={styles.drawerItemLabel}
                    />
                    <DrawerItem
                        label="Profil"
                        icon={() => <Ionicons name='person-outline' size={24} color="#977700" />}
                        onPress={() => props.navigation.navigate('Profil')}
                        labelStyle={styles.drawerItemLabel}
                    />
                    <DrawerItem
                        label="À propos"
                        icon={() => <Ionicons name='information-circle-outline' size={24} color="#977700" />}
                        onPress={() => props.navigation.navigate('AboutApp')}
                        labelStyle={styles.drawerItemLabel}
                    />
                </>
            );
        }

        return null;
    };

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image source={require('../assets/logo.png')} style={styles.logoImage} />
            </View>
            <DrawerContentScrollView {...props} contentContainerStyle={styles.contentContainer}>
                {renderDrawerItems()}
                <View style={styles.divider} />
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
        backgroundColor: '#FBF5E0',
    },
    contentContainer: {
        paddingTop: 20,
    },
    divider: {
        borderBottomColor: '#977700',
        borderBottomWidth: 0.2,
        marginVertical: 10,
    },
    logoContainer: {
        backgroundColor: '#977700',
        alignItems: 'center',
        justifyContent: 'center',
        height: 150,
    },
    logoImage: {
        width: 140,
        height: 140,
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        marginVertical: 10,
    },
});
