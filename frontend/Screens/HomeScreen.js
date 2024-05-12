import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import HomeHeader from '../Components/HomeHeader';
import { useFonts } from 'expo-font';

export default function HomeScreen({ user, navigation }) {
  const [loaded] = useFonts({
    'Chilanka-Regular': require('../assets/fonts/Chilanka-Regular.ttf'),
    'Poppins-Semibold': require('../assets/fonts/Poppins-SemiBold.ttf'),
  });


  const propertiesData = [
    { id: 1, name: 'Ruchers', value: '2', img: require('../assets/rucher.png') },
    { id: 2, name: 'Ruches', value: '16', img: require('../assets/ruche.png') },
    { id: 3, name: 'Solde', value: '0.00 د.ت', img: require('../assets/solde.png') },
    { id: 4, name: 'Force', value: '70%', img: require('../assets/force.png') },
  ];

  return (
    <View style={styles.container}>
      <HomeHeader navigation={navigation} />

      <View style={styles.headerTextView}>
        <Text style={styles.headerText1}>Bonjour</Text>
        <Text style={styles.headerText1}></Text>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerText2}>Mariem</Text>
        </View>
      </View>

      <View style={styles.propertiesContainer}>
        {propertiesData.map((item) => (
          <View key={item.id} style={[styles.smallCard, { backgroundColor: '#F5F5F5' }]}>
            <Image style={styles.image} source={item.img} />
            <View style={styles.propertyInfo}>
              <Text style={styles.nameText}>{item.name}</Text>
              <Text style={styles.valueText}>{item.value}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.centeredContainer}>
        <Image source={require('../assets/qr-scan.png')} style={styles.qrScan} />
        <TouchableOpacity style={styles.button}  >
          <Text style={styles.buttonText}>Scanner</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  headerTextView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
  },
  headerText1: {
    color: '#977700',
    fontSize: 24,
    fontWeight: 'bold',
    paddingLeft: 10,
    fontFamily: 'Poppins-Semibold'

  },
  headerTextContainer: {
    borderColor: '#342D21',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
  },
  headerText2: {
    color: '#977700',
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Semibold'

  },
  propertiesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  smallCard: {
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginHorizontal: 8,
    height: 80,
    width: 75,
  },
  image: {
    width: 30,
    height: 30,
    marginBottom: 5,
  },
  propertyInfo: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameText: {
    fontWeight: 'bold',
    color: '#5e6977',
    textAlign: 'center',
    fontFamily:  'Chilanka-Regular'

  },
  valueText: {
    color: '#5e6977',
    textAlign: 'center',
    fontFamily:  'Chilanka-Regular'

  },
  centeredContainer: {
    alignItems: 'center',
    marginTop: 20,  
  },
  qrScan: {
    width: 212,
    height: 185,
    marginVertical: 50,  
  },
  button: {
    width: 276,
    height: 50,
    paddingHorizontal: 20,
    backgroundColor: '#FEE502',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,  
  },
  buttonText: {
    fontSize: 18,
    color: '#373737',
    fontFamily: 'Poppins-SemiBold',
  },
});
