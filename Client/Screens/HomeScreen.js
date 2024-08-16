import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, Alert, Button } from 'react-native';
import HomeHeader from '../Components/HomeHeader';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../axiosConfig';
import { useCameraPermissions } from 'expo-camera';
import { useIsFocused } from '@react-navigation/native';
import LottieView from "lottie-react-native";

import ChangePasswordOnFirstLogin from './UserAccountManagement/ChangePasswordOnFirstLogin';

export default function HomeScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [currentUser, setCurrentUser] = useState(null);
  const [apiariesCount, setApiariesCount] = useState(0);
  const [hivesCount, setHivesCount] = useState(0);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(true);  

  const [incompleteTasksCount, setIncompleteTasksCount] = useState(0);

  const [financialData, setFinancialData] = useState({
    currentYearTotal: 0,
    currentYearRevenues: 0,
    currentYearExpenses: 0,
    previousYearTotal: 0,
    previousYearRevenues: 0,
    previousYearExpenses: 0
  });

  const [strengthPercentage, setStrengthPercentage] = useState(0);

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
    const fetchTransactions = async () => {
      try {
        const response = await axios.get('/transaction/getAllTransactions', {
          params: { userId: currentUser?._id },
        });
        const transactions = response.data.data;

       
        const currentYearTotals = {
          revenues: 0,
          expenses: 0,
        };

        const previousYearTotals = {
          revenues: 0,
          expenses: 0,
        };

        const currentYear = new Date().getFullYear();
        const previousYear = currentYear - 1;

        transactions.forEach(transaction => {
          const transactionYear = new Date(transaction.TransactionDate).getFullYear();
          if (transactionYear === currentYear) {
            if (transaction.OperationType === 'Revenus') {
              currentYearTotals.revenues += transaction.Amount;
            } else if (transaction.OperationType === 'Dépenses') {
              currentYearTotals.expenses += transaction.Amount;
            }
          } else if (transactionYear === previousYear) {
            if (transaction.OperationType === 'Revenus') {
              previousYearTotals.revenues += transaction.Amount;
            } else if (transaction.OperationType === 'Dépenses') {
              previousYearTotals.expenses += transaction.Amount;
            }
          }
        });

         
        const currentYearTotal = currentYearTotals.revenues - currentYearTotals.expenses;
        const previousYearTotal = previousYearTotals.revenues - previousYearTotals.expenses;



        setFinancialData({
          currentYearTotal,
          currentYearRevenues: currentYearTotals.revenues,
          currentYearExpenses: currentYearTotals.expenses,
          previousYearTotal,
          previousYearRevenues: previousYearTotals.revenues,
          previousYearExpenses: previousYearTotals.expenses
        });
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
      finally {
        setIsLoading(false);
      }
    };

    if (currentUser) {
      fetchTransactions();
    }
  }, [currentUser, isFocused]);


  useEffect(() => {
    const fetchApiariesCount = async () => {
      try {
        if (currentUser) {
          const response = await axios.get('/apiary/getAllApiaries');
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
          const response = await axios.get('/hive/getAllHives');
          const hives = response.data.data;

          // Fetch all apiaries owned by the current user
          const apiariesResponse = await axios.get('/apiary/getAllApiaries');
          const userApiaries = apiariesResponse.data.data.filter(apiary => apiary.Owner._id === currentUser._id);

          // Filter hives based on the apiaries owned by the current user
          const userHives = hives.filter(hive => userApiaries.some(apiary => apiary._id === hive.Apiary._id));

          setHivesCount(userHives.length);
        }
      } catch (error) {
        console.error('Error fetching hives count:', error);
      } finally {
        setIsLoading(false);  
      }
    };

    if (currentUser) {
      fetchHivesCount();
    }
  }, [currentUser]);




  const fetchTasks = async () => {

    if (!currentUser) {
    
      console.error('Current user is null');
      return;
    }

    try {
      const response = await axios.get(`/task/getAllTasks`, {
        params: {
          userId: currentUser._id
        }
      });

     
      const incompleteCount = response.data.data.filter(event => !event.completed).length;
      setIncompleteTasksCount(incompleteCount);

    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };


  useEffect(() => {
    if (currentUser) {
      fetchTasks();
    }
  }, [currentUser]);


  const strengthMapping = {
    "Très Faible": 0,
    "Faible": 25,
    "Modérée": 50,
    "Forte": 75,
    "Très Forte": 100,
  };


  useEffect(() => {
    const fetchHivesStrength = async () => {
      try {
        if (currentUser) {
          const response = await axios.get('/hive/getAllHives');
          const hives = response.data.data;

          // Fetch all apiaries owned by the current user
          const apiariesResponse = await axios.get('/apiary/getAllApiaries');
          const userApiaries = apiariesResponse.data.data.filter(apiary => apiary.Owner._id === currentUser._id);

          const userHives = hives.filter(hive => userApiaries.some(apiary => apiary._id === hive.Apiary._id));

 
          const totalStrength = userHives.reduce((total, hive) => {
            const strengthValue = strengthMapping[hive.Colony.strength] || 0;
             return total + strengthValue;
          }, 0);

          const averageStrength = userHives.length ? totalStrength / userHives.length : 0;
        

         
          setStrengthPercentage(averageStrength);
        }
      } catch (error) {
        console.error('Error fetching hives strength:', error);
      }
    };

    if (currentUser) {
      fetchHivesStrength();
    }
  }, [currentUser]);


  const propertiesData = [
    { id: 1, name: 'Ruchers', value: apiariesCount.toString(), img: require('../assets/rucher.png') },
    { id: 2, name: 'Ruches', value: hivesCount.toString(), img: require('../assets/ruche.png') },
    {
      id: 3,
      name: 'Solde',
      value: `${Math.abs(financialData.currentYearTotal).toLocaleString()} ${financialData.currentYearTotal < 0 ? '-' : ''} د.ت `,
      img: require('../assets/solde.png')
    },   
    { id: 4, name: 'Force', value: `${strengthPercentage.toFixed(0)}%`, img: require('../assets/force.png') }, // Update here
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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
        <Text style={{ textAlign: 'center', marginBottom: 10 }}>Nous avons besoin de votre autorisation pour afficher la caméra 📷</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Donner la permission</Text>
        </TouchableOpacity>
      </View>

    );
  }


  const handleNotificationPress = () => {
    Alert.alert(
      'Tâches inachevées',
      `Vous avez ${incompleteTasksCount} tâche${incompleteTasksCount > 1 ? 's' : ''} inachevée${incompleteTasksCount > 1 ? 's' : ''}`,
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Afficher vos tâches',
          onPress: () => navigation.navigate('Tasks'),
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <HomeHeader
        navigation={navigation}
        title={'Accueil'}
        incompleteTasksCount={incompleteTasksCount}
        onNotificationPress={handleNotificationPress}
      />

      {isLoading ? (
        <View style={[styles.container, styles.loadingContainer]}>
          <LottieView
            source={require('../assets/lottie/loading.json')}  
            autoPlay
            loop
            style={{ width: 150, height: 150 }}
          />
          <Text>Connexion en cours..</Text>
        </View>

      ) : (
        <>



          <View style={styles.headerTextView}>
            <Text style={styles.headerText}>Bonjour </Text>
            <Text style={styles.headerText}></Text>
            <View style={styles.headerTextContainer}>
              {currentUser ? (<Text style={styles.headerText}>{currentUser.Firstname}</Text>
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

  taskInfoContainer: {

    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginRight: 10,
    alignSelf: 'flex-end',
  },
  taskInfoText: {
    color: 'red',
    fontSize: 12,
    fontWeight: 'bold'
  },

  headerTextView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,

  },


  headerText: {
    color: '#977700',
    fontSize: 30,
    fontWeight: 'bold',

  },
  headerTextContainer: {
    borderColor: '#342D21',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
  },

  image: {
    width: 70,
    height: 70,
  },
  propertiesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
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
  },
  qrScan: {
    width: 240,
    height: 240,
    marginVertical: 47,
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

