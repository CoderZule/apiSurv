import React, { useState, useEffect } from 'react';
import { Text, SafeAreaView, StyleSheet, View, TouchableOpacity, Modal, TextInput, Button, Alert } from 'react-native';
import HomeHeader from '../../Components/HomeHeader';
import { HarvestProducts, units } from '../Data';
import { Card } from 'react-native-paper';
import axios from 'axios';
import { useIsFocused } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

export default function StorageScreen({ navigation }) {
  const [totals, setTotals] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [newQuantity, setNewQuantity] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('');
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      fetchTotals();
    }
  }, [isFocused]);

  const fetchTotals = async () => {
    try {
      const response = await axios.get('http://192.168.1.17:3000/api/harvest/getTotals');
      setTotals(response.data.data);
    } catch (error) {
      console.error('Error fetching totals:', error);
    }
  };

  const handleUpdateQuantity = async () => {
    const currentQuantity = totals[selectedProduct]?.[selectedUnit] || 0;

    if (parseFloat(newQuantity) > currentQuantity) {
      Alert.alert('Erreur', 'La nouvelle quantité doit être inférieure ou égale à la quantité actuelle.');
      return;
    }

    try {
      const response = await axios.post('http://192.168.1.17:3000/api/harvest/updateQuantity', {
        product: selectedProduct,
        unit: selectedUnit,
        quantity: newQuantity,
      });
      setShowModal(false);
      fetchTotals();
    } catch (error) {
      console.error('Error updating quantity:', error);
      Alert.alert('Erreur', 'Une erreur s\'est produite lors de la mise à jour de la quantité.');
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
      <HomeHeader navigation={navigation} title={'Stockage'} />
      <Card style={styles.card}>
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
                <Ionicons name="remove-circle" size={24} color="red" />
              </TouchableOpacity>
            </Card.Content>
            {index !== HarvestProducts.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
      </Card>

      <Modal
        transparent={true}
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Diminuer la quantité</Text>
            <Text style={styles.modalProduct}>{selectedProduct}</Text>
            <TextInput
              style={styles.input}
              placeholder="Nouvelle quantité"
              keyboardType="numeric"
              value={newQuantity}
              onChangeText={setNewQuantity}
            />
            <Picker
              selectedValue={selectedUnit}
              onValueChange={(itemValue) => setSelectedUnit(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Sélectionner..." value="" enabled={false} />
              {filterUnits(selectedProduct).map((unit) => (
                <Picker.Item label={unit} value={unit} key={unit} />
              ))}
            </Picker>
            <Button title="Enregistrer" onPress={handleUpdateQuantity} />
            <Button title="Annuler" onPress={() => setShowModal(false)} />
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
    padding: 10,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
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
    borderRadius: 5,
    marginBottom: 10,
  },
  picker: {
    width: '100%',
    marginBottom: 10,
  },
});
