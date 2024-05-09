import React from 'react';
import { View, Text,TouchableOpacity, StyleSheet} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {


  const styles = StyleSheet.create({
    
    button: {
      marginTop: 20,
      width: 276,
      height: 50,
      paddingHorizontal: 20,
      backgroundColor: '#FEE502',
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonText: {
      fontSize: 18,
      color: '#373737',
      fontFamily: 'Poppins-SemiBold'
    }
  });

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
    <View>
      <TouchableOpacity onPress={handleLogout}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>Logout</Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}