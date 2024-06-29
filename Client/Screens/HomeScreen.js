import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import HomeHeader from '../Components/HomeHeader';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useCameraPermissions } from 'expo-camera';
import { useIsFocused } from '@react-navigation/native';

import ChangePasswordOnFirstLogin from './UserAccountManagement/ChangePasswordOnFirstLogin';

export default function HomeScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [currentUser, setCurrentUser] = useState(null);
  const [apiariesCount, setApiariesCount] = useState(0);
  const [hivesCount, setHivesCount] = useState(0);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(true); // State for loading indicator

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const currentUserString = await AsyncStorage.getItem('currentUser');
        if (currentUserString) {
          const user = JSON.parse(currentUserString);
          setCurrentUser(user);

          if (user && user.FirstTimeLogin) {
            setPasswordModalVisible(true);
          }
        }
      } catch (error) {
        console.error('Error retrieving current user:', error);
      }
    };

    if (isFocused) {
      fetchCurrentUser();
    }
  }, [isFocused]);

  useEffect(() => {
    const fetchApiariesCount = async () => {
      try {
        if (currentUser) {
          const response = await axios.get('http://192.168.1.17:3000/api/apiary/getAllApiaries');
          const apiaries = response.data.data;

          const userApiaries = apiaries.filter(apiary => apiary.Owner._id === currentUser._id);
          setApiariesCount(userApiaries.length);
        }
      } catch (error) {
        console.error('Error fetching apiaries count:', error);
      }
    };

    fetchApiariesCount();
  }, [currentUser]);

  useEffect(() => {
    const fetchHivesCount = async () => {
      try {
        if (currentUser) {
          const response = await axios.get('http://192.168.1.17:3000/api/hive/getAllHives');
          const hives = response.data.data;

          // Fetch all apiaries owned by the current user
          const apiariesResponse = await axios.get('http://192.168.1.17:3000/api/apiary/getAllApiaries');
          const userApiaries = apiariesResponse.data.data.filter(apiary => apiary.Owner._id === currentUser._id);

          // Filter hives based on the apiaries owned by the current user
          const userHives = hives.filter(hive => userApiaries.some(apiary => apiary._id === hive.Apiary._id));

          setHivesCount(userHives.length);
        }
      } catch (error) {
        console.error('Error fetching hives count:', error);
      } finally {
        setIsLoading(false); // After fetching data, set isLoading to false
      }
    };

    if (currentUser) {
      fetchHivesCount();
    }
  }, [currentUser]);

  const propertiesData = [
    { id: 1, name: 'Ruchers', value: apiariesCount.toString(), img: require('../assets/rucher.png') },
    { id: 2, name: 'Ruches', value: hivesCount.toString(), img: require('../assets/ruche.png') },
    { id: 3, name: 'Solde', value: '0.00 د.ت', img: require('../assets/solde.png') },
    { id: 4, name: 'Force', value: '70%', img: require('../assets/force.png') },
  ];



  const openScannerInspDetails = () => {
    setModalVisible(false);
    navigation.navigate('ScannerScreenInspectionsDetails');
  };
  const openScannerAddInspec = () => {
    setModalVisible(false);
    navigation.navigate('ScannerScreenAddInspections');
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>Nous avons besoin de votre autorisation pour afficher la caméra</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }


  return (
    <View style={styles.container}>
      <HomeHeader navigation={navigation} title={'Accueil'} />

      {isLoading ? (
        <View style={[styles.container, styles.loadingContainer]}>
          <ActivityIndicator size="large" color="#977700" />
        </View>
      ) : (
        <>
          <View style={styles.headerTextView}>
            <Text style={styles.headerText1}>Bonjour</Text>
            <Text style={styles.headerText1}></Text>
            <View style={styles.headerTextContainer}>
              {currentUser ? (
                <Text style={styles.headerText2}>{currentUser.Firstname}</Text>
              ) : null}
            </View>
          </View>


          <View style={styles.propertiesContainer}>
            {propertiesData.map((item) => (
              <View key={item.id}  >
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
        </>
      )}

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
            <TouchableOpacity style={styles.modalButton} onPress={openScannerInspDetails}>
              <Ionicons name="archive-outline" size={20} color="#977700" />
              <Text style={styles.modalButtonText}>Détails Ruche/Inspections</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={openScannerAddInspec}>
              <Ionicons name="create-outline" size={20} color="#977700" />
              <Text style={styles.modalButtonText}>Ajouter une inspection</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ChangePasswordOnFirstLogin
        visible={passwordModalVisible}
        onClose={() => setPasswordModalVisible(false)}
        userId={currentUser ? currentUser._id : null}
      />



    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBF5E0'
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

  },
  headerTextContainer: {
    borderColor: '#342D21',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
  },
  headerText2: {
    color: '#977700',
    fontSize: 20,
    fontWeight: 'bold',

  },
  image: {
    width: 70, // Adjust this based on your design needs
    height: 70, // Maintain aspect ratio or adjust as necessary
  },
  propertiesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Or 'space-between', adjust as needed
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

  propertyInfo: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameText: {
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',

  },
  valueText: {
    color: '#000000',
    textAlign: 'center',

  },
  centeredContainer: {
    alignItems: 'center',
    //marginTop: 20,
  },
  qrScan: {
    width: 260,
    height: 260,
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
  },
  buttonText: {
    fontSize: 17,
    color: '#373737',
    fontWeight: 'bold',
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
    color: '#977700',
  },
  modalButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FEE502',
    width: '100%',
    paddingVertical: 10,
    marginVertical: 4,
    borderRadius: 8,
  },
  modalButtonText: {
    textAlign: 'center',
    color: '#373737',
    fontSize: 16,
    marginLeft: 10,
  },
  closeButton: {
    backgroundColor: '#E0E0E0',
    width: '100%',
    paddingVertical: 10,
    marginVertical: 4,
    borderRadius: 8,
  },
  closeButtonText: {
    textAlign: 'center',
    color: '#373737',
    fontSize: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

