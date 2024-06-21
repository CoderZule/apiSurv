import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Switch, TextInput, TouchableOpacity, Picker, Pressable } from 'react-native';

const EditInspectionScreen = ({ route, navigation }) => {
  const { inspectionData } = route.params;
  const [formData, setFormData] = useState(inspectionData);
 
  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSeenToggle = (value) => {
    // Logic for handling queen seen toggle
  };

  const renderOption = (option, selectedOptions, handleOptionChange) => {
    // Logic for rendering options
  };

  const togglePickerFrom = () => {
    // Logic for showing/hiding date picker for "from" date
  };

  const togglePickerTo = () => {
    // Logic for showing/hiding date picker for "to" date
  };

  const handleDateChangeFrom = (event, selectedDate) => {
    // Handle change for "from" date
  };

  const handleDateChangeTo = (event, selectedDate) => {
    // Handle change for "to" date
  };

  const handleEditInspection = () => {
   
    console.log('Editing inspection with data:', formData);
  
     
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modifier inspection</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.detailsContainer}>

          {/* Queen Details*/}
          {formData.Queen && (
            <View style={styles.fieldset}>
              <Text style={styles.fieldsetTitle}>Reine</Text>

              <View>
                <View style={styles.inline}>
                  <Text style={styles.label}>Observée</Text>
                  <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={showQueenDetails ? "#f4f3f4" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={(value) => {
                      handleInputChange('seen', value);
                      handleSeenToggle(value);
                    }}
                    value={true}
                  />
                </View>
 
              </View>
            </View>
          )}
          {/* End of Queen Details*/}

          {/* Equipments Details */}
          <View style={styles.fieldset}>
            <Text style={styles.fieldsetTitle}>Équipements</Text>

            {/* Add Equipments details here */}

          </View>
          {/* End of Equipments Details */}

          {/* Supplies Details */}
          <View style={styles.fieldset}>
            <Text style={styles.fieldsetTitle}>Nourritures</Text>

            {/* Add Supplies details here */}

          </View>
          {/* End of Supplies Details */}

          {/* Brood Details */}
          <View style={styles.fieldset}>
            <Text style={styles.fieldsetTitle}>Couvain & Mâles</Text>

            {/* Add Brood details here */}

          </View>
          {/* End of Brood Details */}

          {/* Colony Details */}
          <View style={styles.fieldset}>
            <Text style={styles.fieldsetTitle}>Colonie</Text>

            {/* Add Colony details here */}

          </View>
          {/* End of Colony Details */}

          {/* Treatment Details */}
          <View style={styles.fieldset}>
            <Text style={styles.fieldsetTitle}>Maladie et traitement</Text>

            {/* Add Treatment details here */}

          </View>
          {/* End of Treatment Details */}

          {/* Honey and Pollen stores Details */}
          <View style={styles.fieldset}>
            <Text style={styles.fieldsetTitle}>Récoltes</Text>

            {/* Add Honey and Pollen stores details here */}

          </View>
          {/* End of Honey and Pollen stores Details */}

          {/* Actions Taken */}
          <View style={styles.fieldset}>
            <Text style={styles.fieldsetTitle}>Actions entreprises</Text>

            {/* Add Actions Taken details here */}

          </View>
          {/* End of Actions Taken */}

          {/* Note Details */}
          <View style={styles.fieldset}>
            <Text style={styles.fieldsetTitle}>Note</Text>

            <View style={styles.detailItem}>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                multiline={true}
                numberOfLines={5}
                onChangeText={(value) => handleInputChange('InspectionNote', value)}
                value={formData.InspectionNote}
              />
            </View>
          </View>
          {/* End of Note */}

          <TouchableOpacity style={styles.addButton} onPress={handleEditInspection}>
            <Text style={styles.addButtonText}>Modifier</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FBF5E0',
    paddingHorizontal: 24,
    paddingVertical: 45,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: '#977700',
    textAlign: 'center',
    marginBottom: 20,
  },
  detailsContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
  },
  fieldset: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
  },
  fieldsetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'center',
    color: '#342D21',
  },
  inline: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#342D21',
    marginBottom: 8,
  },
  textInput: {
    fontSize: 16,
    fontWeight: '400',
    width: 150,
    color: '#797979',
    marginLeft: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  addButton: {
    backgroundColor: '#FEE502',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  addButtonText: {
    color: '#373737',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default EditInspectionScreen;
