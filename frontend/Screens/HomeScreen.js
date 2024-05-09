import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import HomeHeader from '../Components/HomeHeader';

export default function HomeScreen({ user, navigation}) {


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

 


  return (
    <View>
          <HomeHeader navigation={navigation} />

 

 
    </View>
  )


}