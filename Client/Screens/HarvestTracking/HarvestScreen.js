import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import { Card, TextInput, Button, HelperText, Dropdown } from 'react-native-paper'; // Assuming you'll use these components for the form

import HomeHeader from '../../Components/HomeHeader';
import {
  HarvestMethods,
  HarvestSeasons,
  HarvestProducts,
  units

} from '../Data';
 
export default function HarvestScreen({ navigation }) {

  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('');
  const [SelectedSeason, setSelectedSeason] = useState('');
  const [SelectedHarvestMethod, setSelectedHarvestMethod] = useState('');
  const [qualityTestResults, setQualityTestResults] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

 

  return (
    <SafeAreaView style={styles.safeArea}>
      <HomeHeader navigation={navigation} title={'Récolte'} />
      <ScrollView contentContainerStyle={styles.container}>
        <Card style={styles.card}>
 
           {/* <Dropdown
            label="Produit"
            value={selectedProduct}
            onChangeText={text => setSelectedProduct(text)}
            data={HarvestProducts.map(product => ({ label: product, value: product }))}
          />

          <TextInput
            label="Quantité"
            value={quantity}
            onChangeText={text => setQuantity(text)}
            keyboardType="numeric"
          />
          <Dropdown
            label="Unité"
            value={selectedUnit}
            onChangeText={text => setSelectedUnit(text)}
            data={units.map(unit => ({ label: unit, value: unit }))}
          />
          <Dropdown
            label="Saison"
            value={SelectedSeason}
            onChangeText={text => setSelectedSeason(text)}
            data={HarvestSeasons.map(season => ({ label: season, value: season }))}
          />
          <Dropdown
            label="Méthode de récolte"
            value={SelectedHarvestMethod}
            onChangeText={text => setSelectedHarvestMethod(text)}
            data={HarvestMethods.map(method => ({ label: method, value: method }))}
          /> */}
          <TextInput
            label="Résultats des tests de qualité"
            value={qualityTestResults}
            onChangeText={text => setQualityTestResults(text)}
          />

           <HelperText type="error" visible={errorMessage !== ''}>
            {errorMessage}
          </HelperText>

          <Button mode="contained"  >
            Ajouter la récolte
          </Button>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FBF5E0',
  },
  container: {
    flex: 1,
    margin: 20,
    justifyContent: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  }
})
