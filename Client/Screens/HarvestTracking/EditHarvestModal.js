import React, { useState, useEffect } from 'react';
import { Modal, StyleSheet, View, Text, TouchableOpacity, TextInput, ScrollView, Alert, KeyboardAvoidingView, Platform, } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { HarvestMethods, HarvestSeasons, HarvestProducts, units } from '../Data';
import axios from 'axios';

const EditHarvestModal = ({ visible, onSave, onCancel, formData, onInputChange }) => {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios'); // On iOS, showDatePicker remains true
    setDate(currentDate);
    onInputChange('Date', currentDate); // Update form data
  };

  useEffect(() => {
    // Update date when formData changes (in case of external changes)
    setDate(new Date(formData.Date));
  }, [formData.Date]);



  const handleSave = async () => {
    try {
      const response = await axios.post('http://192.168.1.17:3000/api/harvest/editHarvest', formData);

      if (response.status === 200) {
        showAlert('Modification de la récolte réussie', 'La récolte a été mise à jour avec succès');
        onSave(); // Close the modal 
      } else {
        console.error('Failed to update harvest data. Unexpected response:', response);
      }
    } catch (error) {
      console.error('Failed to update harvest data. Error:', error.message);
      // Handle network error or request failure
    }
  };

  const showAlert = (title, message) => {
    Alert.alert(
      'Succès',
      message,
      [{ text: 'OK' }],
      { cancelable: false }
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      statusBarTranslucent={true}
      onRequestClose={onCancel}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingContainer}
      >

        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <ScrollView>

              <Text style={styles.modalTitle}>Modifier la récolte</Text>

              {/* Product */}
              <Text style={styles.label}>Produit</Text>
              <View style={styles.inputContainer}>
                <Picker
                  selectedValue={formData.Product}
                  onValueChange={(itemValue) => onInputChange('Product', itemValue)}
                  style={styles.picker}
                >
                  {HarvestProducts.map((product, index) => (
                    <Picker.Item key={index} label={product} value={product} />
                  ))}
                </Picker>
              </View>

              {/* Date */}
              <Text style={styles.label}>Date</Text>
              <View style={styles.datePickerContainer}>
                <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                  <Text style={styles.datePickerText}>{date.toLocaleDateString()}</Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                    maximumDate={new Date()}
                  />
                )}
              </View>

              {/* Quantity */}
              <Text style={styles.label}>Quantité</Text>
              <TextInput
                style={styles.input}
                value={formData.Quantity.toString()}
                onChangeText={(text) => onInputChange('Quantity', text)}
                keyboardType="numeric"
              />

              {/* Unit */}
              <Text style={styles.label}>Unité</Text>
              <View style={styles.inputContainer}>

                <Picker
                  selectedValue={formData.Unit}
                  onValueChange={(itemValue) => onInputChange('Unit', itemValue)}
                  style={styles.picker}
                >
                  {units.map((unit, index) => (
                    <Picker.Item key={index} label={unit} value={unit} />
                  ))}
                </Picker>
              </View>

              {/* Season */}
              <Text style={styles.label}>Saison</Text>
              <View style={styles.inputContainer}>

                <Picker
                  selectedValue={formData.Season}
                  onValueChange={(itemValue) => onInputChange('Season', itemValue)}
                  style={styles.picker}
                >
                  {HarvestSeasons.map((season, index) => (
                    <Picker.Item key={index} label={season} value={season} />
                  ))}
                </Picker>
              </View>

              {/* Harvest Methods */}
              <Text style={styles.label}>Méthode de récolte</Text>
              <View style={styles.inputContainer}>
                <Picker
                  selectedValue={formData.HarvestMethods}
                  onValueChange={(itemValue) => onInputChange('HarvestMethods', itemValue)}
                  style={styles.picker}
                >
                  {HarvestMethods.map((method, index) => (
                    <Picker.Item key={index} label={method} value={method} />
                  ))}
                </Picker>
              </View>

              {/* Quality Test Results */}
              <Text style={styles.label}>Résultats des tests de qualité</Text>
              <TextInput
                style={styles.input}
                value={formData.QualityTestResults}
                onChangeText={(text) => onInputChange('QualityTestResults', text)}
              />


              {/* Save and Cancel buttons */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onCancel}>
                  <Text style={styles.buttonText}>Annuler</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
                  <Text style={styles.buttonText}>Modifier</Text>
                </TouchableOpacity>

              </View>

            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent dark background
    justifyContent: 'center',
    alignItems: 'center',

  },
  modalContainer: {
    width: '90%',
    maxHeight: '80%', // Adjusted to fit within modal
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,

  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: '#977700',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 5,
    fontWeight: 'bold',
    color: '#342D21',
    textAlign: 'center', // Add textAlign center
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',

    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    width: '40%',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#FEE502',
  },
  cancelButton: {
    backgroundColor: '#E0E0E0',
  },
  buttonText: {
    fontWeight: 'bold',
    color: '#373737',
  },
  inputContainer: {
    marginBottom: 15,
    borderBottomWidth: 1,
    backgroundColor: '#FBF5E0',
    borderBottomColor: '#CCCCCC',
    width: '100%', // Ensure full width
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#333333',
  },
  datePickerContainer: {
    marginTop: 2,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%', // Ensure full width
  },
  datePickerText: {
    color: '#333333',
  },

  keyboardAvoidingContainer: {
    flex: 1,
  },
});

export default EditHarvestModal;
