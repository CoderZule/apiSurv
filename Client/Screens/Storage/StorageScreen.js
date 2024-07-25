import React, { useState, useEffect } from 'react';
import { Text, SafeAreaView, StyleSheet, View, TouchableOpacity, Modal, TextInput, Pressable, Alert, Image} from 'react-native';
import HomeHeader from '../../Components/HomeHeader';
import { HarvestProducts, units } from '../Data';
import { Card } from 'react-native-paper';
import axios from '../../axiosConfig';
import { useIsFocused } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from "lottie-react-native";

export default function StorageScreen({ navigation }) {
  const [totals, setTotals] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [newQuantity, setNewQuantity] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('');
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    
    const fetchCurrentUser = async () => {
      try {
        const currentUserString = await AsyncStorage.getItem('currentUser');
        if (currentUserString) {
          const user = JSON.parse(currentUserString);
          setCurrentUser(user);

        }
      } catch (error) {
        console.error('Error retrieving current user:', error);
      }
    };

    fetchCurrentUser();

  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchTotals();
    }
  }, [currentUser, isFocused]);

  const fetchTotals = async () => {
    try {
      const response = await axios.get('/storage/getAllStorages',
        {
          params: {
            userId: currentUser._id
          }
        });

      const storageData = response.data.data;

      const totalsMap = {};
      storageData.forEach(entry => {
        if (!entry.Quantities) {
          console.error('Invalid entry structure:', entry);
          return;  
        }

        if (!totalsMap[entry.Product]) {
          totalsMap[entry.Product] = {};
        }

        entry.Quantities.forEach(quantityEntry => {
          if (quantityEntry.Unit && quantityEntry.Total !== undefined) {
            totalsMap[entry.Product][quantityEntry.Unit] = quantityEntry.Total;
          } else {
            console.error('Invalid quantity entry structure:', quantityEntry);
          }
        });
      });

      setTotals(totalsMap);
    } catch (error) {
      console.error('Error fetching totals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateQuantity = async () => {
    try {
      // Basic validation checks before making the request
      if (!selectedProduct || !selectedUnit || !newQuantity || isNaN(newQuantity) || newQuantity <= 0) {
        Alert.alert('Erreur', 'Veuillez remplir tous les champs et entrer une quantité valide.');
        return;
      }

      // Fetch current storage data to validate against
      const storageResponse = await axios.get('/storage/getAllStorages',
        {
          params: {
            userId: currentUser._id
          }
        });

      const storageEntries = storageResponse.data.data;

      // Find the storage entry for the selected product and unit
      const storageEntry = storageEntries.find(entry => entry.Product === selectedProduct);

      if (!storageEntry) {
        Alert.alert('Erreur', `Produit "${selectedProduct}" non trouvé dans le stock.`);
        return;
      }

      // Find the quantity entry for the selected unit
      const quantityEntry = storageEntry.Quantities.find(q => q.Unit === selectedUnit);

      if (!quantityEntry) {
        Alert.alert('Erreur', `Unité "${selectedUnit}" non trouvée pour le produit "${selectedProduct}".`);
        return;
      }

      // Ensure the newQuantity does not exceed the current quantity
      if (newQuantity > quantityEntry.Total) {
        Alert.alert('Erreur', 'La quantité réduite ne peut pas être supérieure à la quantité actuelle.');
        return;
      }

      // All validations passed, proceed with the update request
      const response = await axios.put('/storage/updateQuantity', {
        product: selectedProduct,
        unit: selectedUnit,
        newQuantity: Number(newQuantity),
      });

      if (response.status === 200 && response.data.success) {
        fetchTotals();
        setShowModal(false);
        Alert.alert('Succès', 'Quantité mise à jour avec succès');
      } else {
        Alert.alert('Erreur', response.data.message || 'Erreur lors de la mise à jour de la quantité');
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      Alert.alert('Erreur', 'Erreur lors de la mise à jour de la quantité');
    }
  };

  const openModal = (product) => {
    setSelectedProduct(product);
    setNewQuantity(''); // Reset new quantity
    setSelectedUnit(''); // Reset selected unit
    setShowModal(true);
  };

  const filterUnits = (product) => {
    switch (product) {
      case 'Miel':
      case 'Pollen':
        return units.filter(unit => unit !== 'Millilitre (ml)');
      case 'Cire d\'abeille':
      case 'Propolis':
        return units.filter(unit => unit !== 'Litre (L)' && unit !== 'Millilitre (ml)');
      case 'Gelée royale':
        return units.filter(unit => unit !== 'Kilogramme (kg)' && unit !== 'Litre (L)');
      case 'Pain d\'abeille':
        return units.filter(unit => unit !== 'Litre (L)' && unit !== 'Millilitre (ml)');
      case 'Venin d\'abeille':
        return units.filter(unit => unit !== 'Kilogramme (kg)' && unit !== 'Litre (L)');
      default:
        return units;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <HomeHeader navigation={navigation} title={'Produits en stock'} />

      <View style={[ styles.centeredView]}>
        <Image
          source={require('../../assets/storage.png')}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      
      <Card style={styles.card}>
        {isLoading ? (
          <View style={[styles.container, styles.loadingContainer]}>
            <LottieView
              source={require('../../assets/lottie/loading.json')}
              autoPlay
              loop
              style={{ width: 100, height: 100 }}
            />
          </View>
        ) : (
          <>
            {HarvestProducts.map((product, index) => (
              <View key={index}>
                <Card.Content style={styles.cardContent}>
                  <Text style={styles.productName}>{product}</Text>
                  <Text style={styles.productDetail}>
                    {totals[product] &&
                      Object.entries(totals[product]).map(([unit, quantity], idx) => (
                        <Text key={`${unit}-${idx}`}>{`${quantity} ${unit}\n`}</Text>
                      ))}
                  </Text>
                  <TouchableOpacity onPress={() => openModal(product)}>
                    <Ionicons name="remove-circle" size={24} color="#2EB922" />
                  </TouchableOpacity>
                </Card.Content>
                {index !== HarvestProducts.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </>
        )}
      </Card>


      <Modal
        transparent={true}
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
        statusBarTranslucent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Diminuer la quantité</Text>
            <Text style={styles.modalProduct}>{selectedProduct}</Text>
            <TextInput
              style={styles.input}
              placeholder="Quantité à réduire"
              keyboardType="numeric"
              value={newQuantity}
              onChangeText={setNewQuantity}
            />

            <Picker
              selectedValue={selectedUnit}
              onValueChange={(itemValue) => setSelectedUnit(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Unité..." value="" enabled={false} />
              {filterUnits(selectedProduct).map((unit) => (
                <Picker.Item label={unit} value={unit} key={unit} />
              ))}
            </Picker>
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.buttonClose]}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.textStyle}>Annuler</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.buttonSave]}
                onPress={handleUpdateQuantity}
              >
                <Text style={styles.textStyle}>Sauvegarder</Text>
              </Pressable>
            </View>

          </View>
        </View>
      </Modal>

     
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  
  safeArea: {
    flex: 1,
    backgroundColor: '#FBF5E0',
  },

  card: {
    margin: 20,
    padding: 8,
  },

  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productDetail: {
    fontSize: 16,
  },
  divider: {
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    borderBottomWidth: 1,
    marginHorizontal: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalProduct: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
  },
  picker: {
    width: '100%',
    marginBottom: 10,
    backgroundColor: '#FBF5E0',
  },

  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    margin: 4,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonClose: {
    backgroundColor: '#bbb',
  },
  buttonSave: {
    backgroundColor: '#FEE502',
  },
  textStyle: {
    fontSize: 16,
    color: '#373737',

  },
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center',
},

  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  image: {
    marginTop:15,
    width: 220,
    height: 220,
},
});
