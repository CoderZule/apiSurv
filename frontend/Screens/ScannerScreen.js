// ScannerScreen.js

import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';

export default function ScannerScreen({ navigation }) {

    const handleBarCodeScanned = ({ type, data }) => {
        alert(`Barcode scanned! Type: ${type}, Data: ${data}`);
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <Camera
                style={styles.camera}
                type={Camera.Constants.Type.back}
                onBarCodeScanned={handleBarCodeScanned}
            />

            <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
 
                <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>

             <View style={styles.imageContainer}>
                <Image source={require('../assets/scanner.png')} style={styles.customIcon} />
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
      cancelButtonText: {
        fontSize: 18,
        color: 'white',
      },
    imageContainer: {
        position: 'absolute',
        top: '40%', // Adjust positioning as desired
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    customIcon: {
        width: 200,  // Set width and height according to your icon dimensions
        height: 200,
    },
});
