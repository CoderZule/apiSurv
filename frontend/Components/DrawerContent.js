import React, { useState, useContext, useEffect } from 'react';
 import { View, Text, Switch, StyleSheet, TouchableOpacity } from 'react-native'
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

 
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
        <View style={styles.container}>
     

            <DrawerItem
                label="Se déconnecter"
               
               onPress={handleLogout}
               labelStyle={styles.drawerItemLabel}


            />

        </View>
    )
}






const styles = StyleSheet.create({
    container: {
        flex: 1
    },
  

    switchText: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingLeft: 20,
        paddingVertical: 5,
        paddingRight: 10
    }
    ,
    drawerItemLabel: {
        fontSize: 20,
        color: '#ffffff' 
    },

})