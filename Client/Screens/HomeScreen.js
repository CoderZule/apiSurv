import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, Platform } from 'react-native';
import HomeHeader from '../Components/HomeHeader';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { Camera } from 'expo-camera';

export default function HomeScreen({ user, navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);

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

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await Camera.requestPermissionsAsync();  
        setHasPermission(status === 'granted');
      }
    })();
  }, []);

  const openScanner = () => {
    setModalVisible(false);  
    navigation.navigate('ScannerScreen');  
  };

  if (hasPermission === null) {
    return <View style={styles.container}><Text>Requesting camera permission...</Text></View>;
  }
  if (hasPermission === false) {
    return <View style={styles.container}><Text>No access to camera.</Text></View>;
  }

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
        <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
          <Text style={styles.buttonText}>Scanner</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        statusBarTranslucent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Scanner le code QR</Text>
            <TouchableOpacity style={styles.modalButton} onPress={openScanner}>
              <Ionicons name="archive-outline" size={20} color="#373737" />
              <Text style={styles.modalButtonText}>Détails de la ruche</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={openScanner}>
              <Ionicons name="create-outline" size={20} color="#373737" />
              <Text style={styles.modalButtonText}>Ajouter une inspection</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    fontFamily: 'Chilanka-Regular'

  },
  valueText: {
    color: '#5e6977',
    textAlign: 'center',
    fontFamily: 'Chilanka-Regular'

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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    fontFamily: 'Poppins-SemiBold',
    color: '#977700',
  },
  modalButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FEE502',
    width: '100%',
    paddingVertical: 10,
    marginVertical: 10,
    borderRadius: 8,
  },
  modalButtonText: {
    textAlign: 'center',
    color: '#373737',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    marginLeft: 10,
  },
  closeButton: {
    backgroundColor: '#E0E0E0',
    width: '100%',
    paddingVertical: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    textAlign: 'center',
    color: '#373737',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
  },
});

