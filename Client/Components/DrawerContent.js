import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import CustomDrawerItem from './CustomDrawerItem'; 
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';

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
            'تأكيد',
            'هل أنت متأكد أنك تريد تسجيل الخروج؟',
            [
                {
                    text: 'إلغاء',
                    style: 'cancel'
                },
                {
                    text: 'تسجيل الخروج',
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
        if (role === 'Apiculteur') {
            return (
                <>
                    <CustomDrawerItem
                        label="الصفحة الرئيسية"
                        icon={() => <Ionicons name='home-outline' size={24} color="#977700" />}
                        onPress={() => props.navigation.navigate('Home')}
                    />
                    <CustomDrawerItem
                        label="الملف الشخصي"
                        icon={() => <Ionicons name='person-outline' size={24} color="#977700" />}
                        onPress={() => props.navigation.navigate('Profil')}
                    />

                    <CustomDrawerItem
                        label="المناحل"
                        icon={() => <Ionicons name='trail-sign-outline' size={24} color="#977700" />}
                        onPress={() => props.navigation.navigate('Apiary')}
                    />
                    <CustomDrawerItem
                        label="الخلايا"
                        icon={() => <FontAwesome5 name="forumbee" size={22} color="#977700" />}
                        onPress={() => props.navigation.navigate('Hive')}
                    />
                    <CustomDrawerItem
                        label="المهام"
                        icon={() => <Ionicons name='calendar-outline' size={24} color="#977700" />}
                        onPress={() => props.navigation.navigate('Tasks')}
                    />
                    <CustomDrawerItem
                        label="الحصاد"
                        icon={() => <Ionicons name='flask-outline' size={24} color="#977700" />}
                        onPress={() => props.navigation.navigate('Harvest')}
                    />
                    <CustomDrawerItem
                        label="المنتجات المخزنة"
                        icon={() => <Ionicons name='storefront-outline' size={24} color="#977700" />}
                        onPress={() => props.navigation.navigate('Storage')}
                    />
                    <CustomDrawerItem
                        label="المعاملات المالية"
                        icon={() => <Ionicons name='cash-outline' size={24} color="#977700" />}
                        onPress={() => props.navigation.navigate('Finances')}
                    />
                    <CustomDrawerItem
                        label="الإحصائيات والرسوم البيانية"
                        icon={() => <Ionicons name='bar-chart-outline' size={24} color="#977700" />}
                        onPress={() => props.navigation.navigate('Stats')}
                    />
                    <CustomDrawerItem
                        label="معرض الصور"
                        icon={() => <Ionicons name='images-outline' size={24} color="#977700" />}
                        onPress={() => props.navigation.navigate('Gallery')}
                    />
           
                    <CustomDrawerItem
                        label="حول التطبيق"
                        icon={() => <Ionicons name='information-circle-outline' size={24} color="#977700" />}
                        onPress={() => props.navigation.navigate('AboutApp')}
                    />
                </>
            );
        }

        else if (role == 'Assistance intermédiaire') {
            return (
                <>
                    <CustomDrawerItem
                        label="وجود الأمراض"
                        icon={() => <Ionicons name='pulse-outline' size={24} color="#977700" />}
                        onPress={() => props.navigation.navigate('AlertBeekeepers')}
                    />
                    <CustomDrawerItem
                        label="الملف الشخصي"
                        icon={() => <Ionicons name='person-outline' size={24} color="#977700" />}
                        onPress={() => props.navigation.navigate('Profil')}
                    />
                    <CustomDrawerItem
                        label="حول التطبيق"
                        icon={() => <Ionicons name='information-circle-outline' size={24} color="#977700" />}
                        onPress={() => props.navigation.navigate('AboutApp')}
                    />
                </>
            );
        }
        else if (role === 'Niveau Stratégique') {
            return (
                <>
                    <CustomDrawerItem
                        label="الصفحة الرئيسية"
                        icon={() => <Ionicons name='home-outline' size={24} color="#977700" />}
                        onPress={() => props.navigation.navigate('HomeNiveauStrat')}
                    />
                    <CustomDrawerItem
                        label="الملف الشخصي"
                        icon={() => <Ionicons name='person-outline' size={24} color="#977700" />}
                        onPress={() => props.navigation.navigate('Profil')}
                    />
                    <CustomDrawerItem
                        label="حول التطبيق"
                        icon={() => <Ionicons name='information-circle-outline' size={24} color="#977700" />}
                        onPress={() => props.navigation.navigate('AboutApp')}
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
                    <Text style={styles.drawerItemLogout}>تسجيل الخروج</Text>
                    <Ionicons name="exit-outline" size={24} color="#977700" style={styles.iconStyle} />

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
        height: 140,
    },
    logoImage: {
        width: 130,
        height: 130,
    },
    drawerItemLabel: {
        fontSize: 15,
        color: '#000000',
    },
    drawerItemLogout: {
        fontSize: 17,
        color: '#977700',
    },
    iconStyle: {
        marginLeft: 10,
    },
    logoutContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        marginVertical: 10,
    },
});
