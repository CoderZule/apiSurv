import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native';
import { CameraView } from 'expo-camera';
import axios from '../../axiosConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

export default function ScannerScreenHiveDetails({ navigation }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [scanning, setScanning] = useState(true);
    const isFocused = useIsFocused();

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const currentUserString = await AsyncStorage.getItem('currentUser');
                if (currentUserString) {
                    const user = JSON.parse(currentUserString);
                    setCurrentUser(user);  
                }
            } catch (error) {
                console.error('Error retrieving current user:', error);
            }
        };

        if (isFocused) {
            fetchCurrentUser();  
            setScanning(true);   
        }
    }, [isFocused]);


    const handleBarCodeScanned = async ({ type, data }) => {
        if (!scanning) return;  
        setScanning(false);  
    
        if (!currentUser) {
            Alert.alert('Error', 'User not logged in', [{ text: 'OK', onPress: () => setScanning(true) }]);
            return;
        }
    
        try {
            const hivesResponse = await axios.get('/hive/getAllHives');
            const hives = hivesResponse.data.data;
    
            const userApiariesResponse = await axios.get('/apiary/getAllApiaries');
            const userApiaries = userApiariesResponse.data.data.filter(apiary => apiary.Owner?._id === currentUser._id);
            const userHives = hives.filter(hive => userApiaries.some(apiary => apiary._id === hive.Apiary._id));
    
            const hive = userHives.find(hive => hive._id === data);
    
            if (!hive) {
                 Alert.alert('رفض الوصول', 'أنت لا تملك هذه الخلية', [{ text: 'حسناً', onPress: () => setScanning(true) }]);
                return;
            }
    
            const response = await axios.get(`/hive/getHiveById/${hive._id}`);
            const hiveData = response.data;
    
            try {
                const inspectionsResponse = await axios.get(`/inspection/getInspectionByHiveId/${data}`);
                const InspectionsHistoryData = inspectionsResponse.data;
    
                if (Array.isArray(InspectionsHistoryData) && InspectionsHistoryData.length > 0) {
                    navigation.navigate('HiveQRDetailsScreen', { hiveData, InspectionsHistoryData });
                } else {
                    navigation.navigate('HiveQRDetailsScreen', { hiveData, InspectionsHistoryData: [] });
                }
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    navigation.navigate('HiveQRDetailsScreen', { hiveData, InspectionsHistoryData: [] });
                } else {
                    console.error('Error fetching inspections:', error);
                }
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.log('Hive not found');
            } else {
                console.error('Error fetching hive data:', error);
            }
        }  
    };
    



    return (
        <View style={styles.container}>
            <CameraView
                style={styles.camera}
                onBarcodeScanned={handleBarCodeScanned}
            />

            <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
                <Image source={require('../../assets/back.png')} style={styles.customIcon2} /><Text style={{ color: 'white' }}>الرجوع</Text>


            </TouchableOpacity>

            <View style={styles.imageContainer}>
                <Image source={require('../../assets/scanme.gif')} style={styles.customIcon1} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    camera: {
        flex: 1,
    },
    cancelButton: {
        position: 'absolute',
        bottom: 32,
        alignSelf: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 16,
        borderRadius: 10,
    },
    imageContainer: {
        position: 'absolute',
        top: '40%',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    customIcon1: {
        width: 200,
        height: 200,
    },
    customIcon2: {
        width: 40,
        height: 30,
    },
});
