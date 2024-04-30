import React, { Component } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { useFonts } from 'expo-font';

const Intro = () => {
  const [loaded] = useFonts({
    'Chilanka-Regular': require('../assets/fonts/Chilanka-Regular.ttf'),
    'Poppins-Semibold': require('../assets/fonts/Poppins-SemiBold.ttf'),
  });

  const styles = StyleSheet.create({
    title: {
      fontSize: 20,
      marginBottom: 5,
      color: '#342D21',
     fontFamily: 'Chilanka-Regular',
    },
    image: {
      width: 330,
      height: 340,
    },
    text: {
      fontSize: 16,
      color: '#342D21',
    fontFamily: 'Chilanka-Regular'
    },
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
      fontSize: 20,
      color: '#373737',
      fontFamily: 'Poppins-SemiBold'
    }
  });

  const slides = [
    {
      key: 1,
      title: 'Maximisez Votre Récolte de Miel',
      text: 'Optimisez vos récoltes et suivez\nvotre production avec facilité',
      image: require('../assets/Intro/1.png'),
      backgroundColor: '#59b2ab',
    },
    {
      key: 2,
      title: 'Surveillez la Santé de Vos Abeilles',
      text: 'Gardez un œil sur la santé de vos\nabeilles pour des colonies\nvigoureuses',
      image: require('../assets/Intro/2.png'),
      backgroundColor: '#febe29',
    },
    {
      key: 3,
      title: 'Gérez Vos Ruchers avec Simplicité',
      text: 'Accédez aux données de vos\nruchers instantanément avec le scan\nQR',
      image: require('../assets/Intro/3.png'),
      backgroundColor: '#22bcb5',
    }
  ];

  const _renderItem = ({ item, index }) => {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Image style={styles.image} source={item.image} />
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.text}>{item.text}</Text>
        {/* Render the button only on the last slide */}
        {index === slides.length - 1 && (
          <TouchableOpacity style={styles.button} onPress={_onDone}>
            <Text style={styles.buttonText}>Commencer</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  const _onDone = () => {
    // User finished the introduction. Show real app through
    // navigation or simply by controlling state
    // You can implement this functionality as per your requirement
    console.log('Introduction completed');
  }

  return (
    <AppIntroSlider
      activeDotStyle={{ width: 15, backgroundColor: '#977700' }}
      dotStyle={{ width: 15, backgroundColor: '#D9D9D9' }}
      renderItem={_renderItem}
      data={slides}
    />
  );
}

export default Intro;
