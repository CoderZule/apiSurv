import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, Alert, FlatList, ScrollView, ActivityIndicator } from 'react-native';
import { Card } from 'react-native-paper';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import HomeHeader from '../../Components/HomeHeader';
import AddHarvestModal from './AddHarvestModal';
import { useIsFocused } from '@react-navigation/native';

export default function HarvestHistoryScreen({ navigation }) {
  const [harvests, setHarvests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('');
  const [selectedHarvestMethod, setSelectedHarvestMethod] = useState('');
  const [qualityTestResults, setQualityTestResults] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(true);

  const lastItemIndex = harvests.length - 1;



  const fetchHarvestData = async () => {
    try {
      const response = await axios.get('http://192.168.1.17:3000/api/harvest/getAllHarvests');
      setHarvests(response.data.data);
    } catch (error) {
      console.error('Error fetching harvest data:', error);
      Alert.alert('Error', 'Erreur lors du chargement des récoltes');
    }
    finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHarvestData();
  }, [isFocused]);
  
  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const handleFormSubmit = async () => {
    if (!selectedProduct || !quantity || !selectedUnit || !selectedSeason || !selectedHarvestMethod) {
      return Alert.alert('Erreur', 'Veuillez remplir tous les champs');
    } else {
      try {
        const formData = {
          Product: selectedProduct,
          Quantity: quantity,
          Unit: selectedUnit,
          Season: selectedSeason,
          HarvestMethods: selectedHarvestMethod,
          QualityTestResults: qualityTestResults,
          Date: date.toISOString(),
        };

        const response = await axios.post('http://192.168.1.17:3000/api/harvest/create', formData);
        Alert.alert('Success', 'Récolte ajoutée avec succès');

        // Reset input states and close modal
        setSelectedProduct('');
        setQuantity('');
        setSelectedUnit('');
        setSelectedSeason('');
        setSelectedHarvestMethod('');
        setQualityTestResults('');
        setDate(new Date());
        setShowModal(false);

        fetchHarvestData();
      } catch (error) {
        console.error('Error creating harvest entry:', error);
        Alert.alert('Error', 'Erreur lors de l\'ajout de la récolte');
      }
    }
  };



  const renderHarvestItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.tableRow}
      onPress={() => navigation.navigate('HarvestDetailsScreen', { harvestData: item, badge: index === lastItemIndex ? true : false, })}
    >
      <Text style={styles.tableCell}>{item.Product}</Text>
      <Text style={styles.tableCell}>{new Date(item.Date).toLocaleDateString()}</Text>
      <Text style={styles.tableCell}>{item.Season}</Text>

      {index === lastItemIndex && (
        <View style={styles.badge}>
          <Text style={{ color: 'white', fontSize: 9, fontWeight: 'bold' }}>Dernière récolte</Text>
        </View>
      )}
    </TouchableOpacity>
  );



  return (
    <SafeAreaView style={styles.safeArea}>
      <HomeHeader navigation={navigation} title={'Récolte'} />

      <Card style={styles.card}>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowModal(true)}
        >
          <FontAwesome5Icon name="plus-circle" size={30} color="#FEE502" />
        </TouchableOpacity>

        {isLoading ? (
          <View style={[styles.container, styles.loadingContainer]}>
            <ActivityIndicator size="large" color="#977700" />
          </View>
        ) : (
          <ScrollView horizontal={true}>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderText}>Produit</Text>
                <Text style={styles.tableHeaderText}>Date</Text>
                <Text style={styles.tableHeaderText}>Saison</Text>
              </View>

              <FlatList
                data={harvests}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderHarvestItem}
                ListEmptyComponent={
                  <View style={styles.tableRow}>
                    <Text style={styles.noDataCell}>
                      Aucune récolte trouvée.
                    </Text>
                  </View>
                }
              />
            </View>
          </ScrollView>)}
      </Card>

      {showModal && (
        <AddHarvestModal
          selectedProduct={selectedProduct}
          setSelectedProduct={setSelectedProduct}
          quantity={quantity}
          setQuantity={setQuantity}
          selectedUnit={selectedUnit}
          setSelectedUnit={setSelectedUnit}
          selectedSeason={selectedSeason}
          setSelectedSeason={setSelectedSeason}
          selectedHarvestMethod={selectedHarvestMethod}
          setSelectedHarvestMethod={setSelectedHarvestMethod}
          qualityTestResults={qualityTestResults}
          setQualityTestResults={setQualityTestResults}
          date={date}
          showDatePicker={showDatePicker}
          setShowDatePicker={setShowDatePicker}
          handleDateChange={handleDateChange}
          handleFormSubmit={handleFormSubmit}
          closeModal={() => setShowModal(false)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FBF5E0',
  },
  card: {
    padding: 13,
    borderRadius: 10,
    elevation: 3,
    backgroundColor: '#FFFFFF',
    marginVertical: 16,
    marginHorizontal: 15,
  },
  addButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  table: {
    flex: 1,
    minWidth: '80%',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  tableHeader: {
    flexDirection: 'row',
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  tableHeaderText: {
    padding: 8,
    fontSize: 16,
    fontWeight: 'bold',
    width: 100,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    backgroundColor: '#fff',
    borderBottomColor: '#ccc',
    minHeight: 60,
  },
  tableCell: {
    padding: 10,
    width: 100,
    flex: 1,
    textAlign: 'center',

    fontSize: 15,
  },
  noDataCell: {
    flex: 1,
    padding: 10,
    textAlign: 'center',
  },
  badge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: "#2EB922",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    zIndex: 1,
  },
});
