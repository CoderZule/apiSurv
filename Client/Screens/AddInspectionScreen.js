import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Text, TextInput, TouchableOpacity, Switch, Button, Pressable } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddInspectionScreen = ({ route }) => {

  const { hiveData } = route.params;
  const [inspector, setInspector] = useState('');
  const [isQueenMarked, setIsQueenMarked] = useState(hiveData.Queen.isMarked);
  const [Queen, setQueen] = useState({
    seen: false,
    isMarked: hiveData.Queen.isMarked,
    color: '',
    clipped: false,
    temperament: '',
    note: '',
    queencells: '',
    isSwarmed: false
  });
  const [Colony, setColony] = useState({
    strength: '',
    temperament: '',
    note: '',


  });

  const [Supplies, setSupplies] = useState({
    product: '',
    ingredients: {
      name: '',
      quantity: 0,
      unit: ''
    },
    note: ''
  });
  
  const [ActivityAdd, setActivityAdd] = useState('');
  const [ActivityRemove, setActivityRemove] = useState('');
  const [HoneyStores, setHoneyStores] = useState('');
  const [PollenStores, setPollenStores] = useState('');
  
  const [BeeHealth, setBeeHealth] = useState({
    disease: '',
    treatment: '',
    duration: {
      from: Date.now(),
      to: Date.now()
    },
    quantity: 0,
    doses: '',
    note: ''
  });
  
  const [SpottedProblems, setSpottedProblems] = useState({
    pests: '',
    predation: '',
    equipment: '',
    actiontaken: '',
    note: ''
  });
  
  const [Weather, setWeather] = useState({
    conditions: '',
    temperature: 0,
    humidity: 0,
    pressure: 0,
    windspeed: 0,
    winddirection: 0
  });
  
  const [Note, setNote] = useState('');
  


  useEffect(() => {
    // Fetch currentUser from AsyncStorage
    AsyncStorage.getItem('currentUser')
      .then((value) => {
        if (value) {
          const inspector = JSON.parse(value);
          setInspector(inspector);

        } else {
          setInspector('Unknown Inspector');
        }
      })
      .catch((error) => {
        console.error('Error retrieving currentUser from AsyncStorage:', error);
        setInspector('Unknown Inspector');
      });
  }, []);

  useEffect(() => {
    if (!isQueenMarked) {
      setQueen({ ...Queen, color: '' }); // Reset color if isMarked is false
    }
  }, [isQueenMarked]);

  const handleQueenChange = (key, value) => {
    setQueen(prevQueen => ({
      ...prevQueen,
      [key]: value
    }));
  };

  const handleColonyChange = (key, value) => {
    setColony(prevColony => ({
      ...prevColony,
      [key]: value
    }));
  };

  const handleMarkedChange = (value) => {
    setIsQueenMarked(value);
    setQueen(prevQueen => ({
      ...prevQueen,
      isMarked: value
    }));
  };


  const handleAddInspection = () => {
    // Logic to add inspection to the hive
    // You can use the state variables to send the data to your backend or perform any other action
  };

  const colors = ['Rouge', 'Bleu', 'Vert', 'Jaune', 'Orange', 'Violet', 'Rose', 'Marron', 'Blanc', 'Noir'];
  const startYear = 2015;
  const endYear = 2024;
  const years = Array.from(new Array(endYear - startYear + 1), (_, index) => startYear + index);
  years.reverse();


  const queen_cells = ['Aucun', 'Essaim', 'Supersedure', 'Urgence'];
  const temperament = [
    "Agressive",
    "Nerveuse",
    "Calme",

  ];
  const force = [
    "Trés Faible",
    "Faible",
    "Modérée",
    "Forte",
    "Très Forte"

  ];
  const brood = [
    "Fermé",
    "Ouvert",
    "Irrégulièr",
    "En rayon",
    "Médiane du cadre",
    "Régulièr"
  ];
  const malebrood = [
    "Irrégulièr",
    "Régulièr"
  ];

  const supplies = ["Miel", "Pollen"];
  const units = ["Litre (L)",
    "Kilogramme (kg)",
    "Gramme (g)",
    "Millilitre (ml)"];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ajouter une inspection</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.detailsContainer}>

          {/* Hive and Apiary */}
          <View style={styles.fieldset}>
            <Text style={styles.fieldsetTitle}>Inspecteur</Text>
            <View style={[styles.detailItem, styles.inline]}>
              <Text style={styles.label}>Nom et prénom</Text>
              <TextInput
                style={[styles.textInput, styles.inlineInput, styles.disabledTextInput]}
                value={`${inspector.Firstname} ${inspector.Lastname}`}
                editable={false}
              />
            </View>
            <View style={[styles.detailItem, styles.inline]}>
              <Text style={styles.label}>CIN</Text>
              <TextInput
                style={[styles.textInput, styles.inlineInput, styles.disabledTextInput]}
                value={inspector.Cin}
                editable={false}
              />
            </View>
          </View>
          {/* End of Hive and Apiary */}


          {/* Hive and Apiary */}
          <View style={styles.fieldset}>
            <Text style={styles.fieldsetTitle}>Rucher et Ruche</Text>
            <View style={[styles.detailItem, styles.inline]}>
              <Text style={styles.label}>Rucher</Text>
              <TextInput
                style={[styles.textInput, styles.inlineInput, styles.disabledTextInput]}
                value={hiveData.Apiary.Name}
                editable={false}
              />
            </View>
            <View style={[styles.detailItem, styles.inline]}>
              <Text style={styles.label}>Ruche</Text>
              <TextInput
                style={[styles.textInput, styles.inlineInput, styles.disabledTextInput]}
                value={hiveData.Type}
                editable={false}
              />
            </View>
          </View>
          {/* End of Hive and Apiary */}


          {/* Data and Time */}
          <View style={styles.fieldset}>
            <Text style={styles.fieldsetTitle}>Date et Heure</Text>
            <View style={[styles.detailItem, styles.inline]}>
              <Text style={styles.label}>Date</Text>
              <TextInput
                style={[styles.textInput, styles.inlineInput, styles.disabledTextInput]}
                value={new Date().toLocaleDateString('fr-FR')}
                editable={false}
              />
            </View>
            <View style={[styles.detailItem, styles.inline]}>
              <Text style={styles.label}>Heure</Text>
              <TextInput
                style={[styles.textInput, styles.inlineInput, styles.disabledTextInput]}
                value={new Date().toLocaleTimeString('fr-FR')}
                editable={false}
              />
            </View>
          </View>
          {/* End of Date and Time*/}

          {/* Queen Details*/}
          <View style={styles.fieldset}>
            <Text style={styles.fieldsetTitle}>Reine</Text>
            <View style={[styles.detailItem, styles.inline]}>
              <Text style={styles.label}>Observée</Text>
              <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={Queen.seen ? "#f4f3f4" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={(value) => handleQueenChange('seen', value)}
                value={Queen.seen}
              />
            </View>

            <View style={[styles.detailItem, styles.inline]}>
              <Text style={styles.label}>Clippée</Text>
              <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={Queen.clipped ? "#f4f3f4" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={(value) => handleQueenChange('clipped', value)}
                value={Queen.clipped}
              />
            </View>

            <View style={[styles.detailItem, styles.inline]}>
              <Text style={styles.label}>Essaimé</Text>
              <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={Queen.isSwarmed ? "#f4f3f4" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={(value) => handleQueenChange('isSwarmed', value)}
                value={Queen.isSwarmed}
              />
            </View>

            <View style={[styles.detailItem, styles.inline]}>
              <Text style={styles.label}>Marquée</Text>
              <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={isQueenMarked ? "#f4f3f4" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={(value) => handleMarkedChange(value)}
                value={isQueenMarked}
              />
            </View>

            {isQueenMarked && (
              <View style={[styles.detailItem, styles.inline]}>
                <Text style={styles.label}>Couleur</Text>
                <Picker
                  style={[styles.textInput, styles.inlineInput, { backgroundColor: '#FBF5E0' }]}
                  selectedValue={Queen.color}
                  onValueChange={(itemValue) => handleQueenChange('color', itemValue)}
                >
                  {colors.map((color, index) => (
                    <Picker.Item key={index} label={color} value={color} />
                  ))}
                </Picker>
              </View>
            )}

            <View style={[styles.detailItem, styles.inline]}>
              <Text style={styles.label}>Tempérament</Text>
              <Picker
                style={[styles.textInput, styles.inlineInput, { backgroundColor: '#FBF5E0' }]}
                selectedValue={Queen.temperament}
                onValueChange={(itemValue) => handleQueenChange('temperament', itemValue)}
              >
                {temperament.map((state, index) => (
                  <Picker.Item key={index} label={state} value={state} />
                ))}
              </Picker>
            </View>

            <View style={[styles.detailItem, styles.inline]}>
              <Text style={styles.label}>Cellules royales</Text>
              <Picker
                style={[styles.textInput, styles.inlineInput, { backgroundColor: '#FBF5E0' }]}
                selectedValue={Queen.queencells}
                onValueChange={(itemValue) => handleQueenChange('queencells', itemValue)}
              >
                {queen_cells.map((state, index) => (
                  <Picker.Item key={index} label={state} value={state} />
                ))}
              </Picker>
            </View>

            <View style={[styles.detailItem, styles.inline]}>
              <Text style={styles.label}>Note</Text>
              <TextInput
                style={[styles.textInput, styles.inlineInput, styles.textArea]}
                multiline={true}
                numberOfLines={4}
                value={Queen.note}
                onChangeText={(text) => handleQueenChange('note', text)}
              />
            </View>
          </View>
          {/* End of Queen Details*/}


          {/* Colony Details*/}
          <View style={styles.fieldset}>
            <Text style={styles.fieldsetTitle}>Colonie</Text>

            <View style={[styles.detailItem, styles.inline]}>
              <Text style={styles.label}>Tempérament</Text>
              <Picker
                style={[styles.textInput, styles.inlineInput, { backgroundColor: '#FBF5E0' }]}
                selectedValue={Colony.temperament}
                onValueChange={(itemValue) => handleColonyChange('temperament', itemValue)}
              >
                {temperament.map((state, index) => (
                  <Picker.Item key={index} label={state} value={state} />
                ))}
              </Picker>
            </View>


            <View style={[styles.detailItem, styles.inline]}>
              <Text style={styles.label}>Force</Text>
              <Picker
                style={[styles.textInput, styles.inlineInput, { backgroundColor: '#FBF5E0' }]}
                selectedValue={Colony.strength}
                onValueChange={(itemValue) => handleColonyChange('strength', itemValue)}
              >
                {force.map((state, index) => (
                  <Picker.Item key={index} label={state} value={state} />
                ))}
              </Picker>
            </View>

            <View style={[styles.detailItem, styles.inline]}>
              <Text style={styles.label}>Note</Text>
              <TextInput
                style={[styles.textInput, styles.inlineInput, styles.textArea]}
                multiline={true}
                numberOfLines={4}
                value={Colony.note}
                onChangeText={(text) => handleQueenChange('note', text)}
              />
            </View>

          </View>
          {/* End of Colony Details*/}

          {/* Brood Details*/}
          <View style={styles.fieldset}>
            <Text style={styles.fieldsetTitle}>Couvain & Mâles</Text>

            <View style={[styles.detailItem, styles.inline]}>
              <Text style={styles.label}>État du couvain</Text>
              <Picker
                style={[styles.textInput, styles.inlineInput, { backgroundColor: '#FBF5E0' }]}
                selectedValue={Colony.temperament}
                onValueChange={(itemValue) => handleColonyChange('temperament', itemValue)}
              >
                {brood.map((state, index) => (
                  <Picker.Item key={index} label={state} value={state} />
                ))}
              </Picker>
            </View>

            <View style={[styles.detailItem, styles.inline]}>
              <Text style={styles.label}>Nombre total du couvain</Text>
              <TextInput
                style={[styles.textInput, styles.inlineInput]}
                keyboardType='numeric'
                value={Colony.temperament.toString()}
                onChangeText={(text) => handleColonyChange('temperament', parseInt(text))}
              />
            </View>



            <View style={[styles.detailItem, styles.inline]}>
              <Text style={styles.label}>Couvain mâle</Text>
              <Picker
                style={[styles.textInput, styles.inlineInput, { backgroundColor: '#FBF5E0' }]}
                selectedValue={Colony.strength}
                onValueChange={(itemValue) => handleColonyChange('strength', itemValue)}
              >
                {malebrood.map((state, index) => (
                  <Picker.Item key={index} label={state} value={state} />
                ))}
              </Picker>
            </View>

            <View style={[styles.detailItem, styles.inline]}>
              <Text style={styles.label}>Mâles Observés</Text>
              <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={Queen.seen ? "#f4f3f4" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={(value) => handleQueenChange('seen', value)}
                value={Queen.seen}
              />
            </View>

          </View>
          {/* End of Brood Details*/}


          {/* Supplies Details  */}
          <View style={styles.fieldset}>
            <Text style={styles.fieldsetTitle}>Fournitures</Text>

            <View style={[styles.detailItem, styles.inline]}>
              <Text style={styles.label}>Produit</Text>
              <Picker
                style={[styles.textInput, styles.inlineInput, { backgroundColor: '#FBF5E0' }]}
                selectedValue={Supplies.product}
               >
                {supplies.map((state, index) => (
                  <Picker.Item key={index} label={state} value={state} />
                ))}
              </Picker>
            </View>

            <View style={[styles.detailItem, styles.inline]}>
              <Text style={styles.label}>Ingrédients</Text>
              <TextInput
                style={[styles.textInput, styles.inlineInput]}
                value={Supplies.ingredients.name}
               />
            </View>

            <View style={[styles.detailItem, styles.inline]}>
              <Text style={styles.label}>Quantité totale</Text>
              <TextInput
                style={[styles.textInput, styles.inlineInput]}
                keyboardType='numeric'
                value={Supplies.ingredients.quantity}
               />
            </View>


            <View style={[styles.detailItem, styles.inline]}>
              <Text style={styles.label}>Unité</Text>
              <Picker
                style={[styles.textInput, styles.inlineInput, { backgroundColor: '#FBF5E0' }]}
                selectedValue={Supplies.ingredients.unit}
               >
                {units.map((state, index) => (
                  <Picker.Item key={index} label={state} value={state} />
                ))}
              </Picker>
            </View>

            <View style={[styles.detailItem, styles.inline]}>
              <Text style={styles.label}>Note</Text>
              <TextInput
                style={[styles.textInput, styles.inlineInput, styles.textArea]}
                multiline={true}
                numberOfLines={4}
                value={Note}
               />
            </View>
          </View>
          {/* End of Supplies Details*/}





          <TouchableOpacity style={styles.addButton} onPress={handleAddInspection}>
            <Text style={styles.addButtonText}>Ajouter</Text>
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
  detailItem: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
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
  inlineInput: {
    flex: 1,
    marginLeft: 15,
  },
  disabledTextInput: {
    backgroundColor: '#f0f0f0', // Set the background color for disabled inputs
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
    // Add styles for textArea
    height: 100, // Adjust the height according to your design
    textAlignVertical: 'top', // Align text to the top
  }


});

export default AddInspectionScreen;
