import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
 import { useNavigation } from '@react-navigation/native';  
 
const Intro = () => {
  const navigation = useNavigation(); 
 
  
  const styles = StyleSheet.create({
    title: {
      fontSize: 25, 
      fontWeight:'bold',
       marginTop: 30,
      marginBottom: 13,
       color: '#977700',
       textAlign: 'center',
     },
    image: {
      width: 330,
      height: 340,
    },
    text: {
      textAlign:"center",
      fontSize: 17,
      fontFamily:'',
      color: '#969696',
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
      fontSize: 17,
      color: '#373737',
      fontWeight:'bold',
     }
  });

  const slides = [
    {
      key: 1,
      title: 'حقق أقصى استفادة من محصول العسل الخاص بك',
      text: 'قم بتحسين محاصيلك وتتبع إنتاجك بسهولة',
      image: require('../assets/Intro/intro1.png'),
      backgroundColor: '#59b2ab',
    },
    {
      key: 2,
      title: 'راقب صحة نحلك',
      text: 'راقب صحة نحلك لضمان مستعمرات قوية',
      image: require('../assets/Intro/intro2.png'),
      backgroundColor: '#febe29',
    },
    {
      key: 3,
      title: 'قم بإدارة مناحلك ببساطة',
      text: 'احصل على بيانات مناحلك فورًا باستخدام مسح QR',
      image: require('../assets/Intro/intro3.png'),
      backgroundColor: '#22bcb5',
    }
  ];

  const _renderItem = ({ item, index }) => {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor:'#FBF5E0' }}>
        <Image style={styles.image} source={item.image} />
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.text}>{item.text}</Text>
         {index === slides.length - 1 && (
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.buttonText}>ابدأ</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  const renderNextButton = () => null; 
  const renderDoneButton = () => null; 

  return (
    <AppIntroSlider
      activeDotStyle={{ width: 15, backgroundColor: '#977700' }}
      dotStyle={{ width: 15, backgroundColor: '#D9D9D9' }}
      renderItem={_renderItem}
      renderNextButton={renderNextButton} 
      renderDoneButton={renderDoneButton} 
      data={slides}
    />
  );
}

export default Intro;
