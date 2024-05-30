import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Text, TextInput, TouchableOpacity, Switch, Button, Pressable, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';

import {
  colors,
  queen_cells,
  temperament,
  force,
  brood,
  malebrood,
  supplies,
  units,
  diseases,
  treatments,
  doses,
  HoneyPollenHarvest,
  options,
  weather_conditions,
  weather_wind_direction
} from './Data';


const AddInspectionScreen = ({ route }) => {

  const { hiveData } = route.params;

  const [date, setDate] = useState(new Date());
  const [showPickerFrom, setShowPickerFrom] = useState(false);
  const [showPickerTo, setShowPickerTo] = useState(false);

  const [selectedAjouts, setSelectedAjouts] = useState([]);
  const [selectedEnlevements, setSelectedEnlevements] = useState([]);
  const [showWeatherDetails, setShowWeatherDetails] = useState(false);
  const startYear = 2015;
  const endYear = 2024;
  const years = Array.from(new Array(endYear - startYear + 1), (_, index) => startYear + index);
  years.reverse();

  const [inspector, setInspector] = useState('');


  // get logged in current user
  useEffect(() => {
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



   const togglePickerFrom = () => {
    setShowPickerFrom(!showPickerFrom);
  };

  const togglePickerTo = () => {
    setShowPickerTo(!showPickerTo);
  };

  const handleDateChangeFrom = (event, selectedDate) => {
    const currentDate = selectedDate || formData.from;
    setShowPickerFrom(false);
    setFormData(prevData => ({
      ...prevData,
      from: currentDate
    }));
  };

  const handleDateChangeTo = (event, selectedDate) => {
    const currentDate = selectedDate || formData.to;
    setShowPickerTo(false);
    setFormData(prevData => ({
      ...prevData,
      to: currentDate
    }));
  };



  const handleAjoutsChange = (itemValue) => {
    setSelectedAjouts((prev) => {
      if (prev.includes(itemValue)) {
        return prev.filter(item => item !== itemValue);
      }
      return [...prev, itemValue];
    });
  };

  const handleEnlevementsChange = (itemValue) => {
    setSelectedEnlevements((prev) => {
      if (prev.includes(itemValue)) {
        return prev.filter(item => item !== itemValue);
      }
      return [...prev, itemValue];
    });
  };




  const renderOption = (option, selectedItems, handleChange) => {
    return (
      <TouchableOpacity
        key={option.name}
        style={[styles.option, selectedItems.includes(option.name) && styles.selectedOption]}
        onPress={() => handleChange(option.name)}
      >
        <Text style={styles.optionText}>{option.name}</Text>
        {option.requiresNumberInput && (
          <TextInput
            style={[styles.textInput, { width: 50 }]} // Adjust width as needed
            keyboardType="numeric"
            placeholder="Qty"
            onChangeText={(text) => handleChange(option.name, parseInt(text))}
          />
        )}
      </TouchableOpacity>
    );
  };



  const [formData, setFormData] = useState({
    isMarked: hiveData.Queen.isMarked,
    color: hiveData.Queen.color,
    clipped: hiveData.Queen.clipped,
    seen: hiveData.Queen.seen,
    isSwarmed: hiveData.Queen.isSwarmed,
    q_temperament: hiveData.Queen.temperament,
    queenCells: hiveData.Queen.queenCells,
    queenNote: hiveData.Queen.note,
    TotalFrames: hiveData.Colony.TotalFrames,
    supers: hiveData.Colony.supers,
    pollenFrames: hiveData.Colony.pollenFrames,
    strength: hiveData.Colony.strength,
    c_temperament: hiveData.Colony.temperament,
    deadBees: hiveData.Colony.deadBees,
    colonyNote: hiveData.Colony.colonyNote,
    state: '',
    maleBrood: '',
    totalBrood: 0,
    DronesSeen: false,
    product: '',
    name: '',
    quantity: 0,
    unit: '',
    SuppliesNote: '',
    disease: '',
    treatment: '',
    from: new Date(),
    to: new Date(),
    quantity: 0,
    doses: '',
    BeeHealthNote: '',
    HoneyStores: '',
    PollenStores: '',
    ActivityAdd: '',
    ActivityRemove: '',







  });

  const handleInputChange = (key, value) => {
    setFormData(prevState => ({
      ...prevState,
      [key]: value
    }));
  };

  useEffect(() => {
    if (!formData.isMarked) {
      setFormData(prevData => ({
        ...prevData,
        color: '',
      }));
    }
  }, [formData.isMarked]);


  const handleAddInspection = async () => {
    try {
      const formattedData = {
        Inspector: {
          firstName: inspector.Firstname,
          lastName: inspector.Lastname,
          cin: inspector.Cin,
        }, // the current logged in user(inspector)

        InspectionDateTime: date, //Now time

        ApiaryAndHive: {
          apiaryName: hiveData.Apiary.Name,
          hiveType: hiveData.Type,
        },

        Queen: {
          seen: formData.seen,
          isMarked: formData.isMarked,
          color: formData.color,
          clipped: formData.clipped,
          temperament: formData.q_temperament,
          note: formData.queenNote,
          queenCells: formData.queenCells,
          isSwarmed: formData.isSwarmed
        },
        Colony: {
          strength: formData.strength,
          temperament: formData.c_temperament,
          deadBees: formData.deadBees,
          supers: formData.supers,
          pollenFrames: formData.pollenFrames,
          TotalFrames: formData.TotalFrames,
          note: formData.colonyNote

        },
        Brood: {
          state: formData.state,
          maleBrood: formData.maleBrood,
          totalBrood: formData.totalBrood
        },

        DronesSeen: formData.DronesSeen,

        Supplies: {
          product: formData.product,
          ingredients: {
            name: formData.name,
            quantity: formData.quantity,
            unit: formData.unit
          },
          note: formData.SuppliesNote
        },

        BeeHealth: {
          disease: formData.disease,
          treatment: formData.treatment,
          duration: {
            from: formData.from,
            to: formData.to
          },
          quantity: formData.quantity,
          doses: formData.doses,
          note: formData.BeeHealthNote
        },

        HoneyStores: formData.HoneyStores,
        PollenStores: formData.PollenStores,

        ActivityAdd: formData.ActivityAdd,
        ActivityRemove: formData.ActivityRemove,

        Weather: {
          condition: '',
          temperature: 0,
          humidity: 0,
          pressure: 0,
          windSpeed: 0,
          windDirection: 0
        },

        Note: '',

        Hive: hiveData._id
      };

      const response = await axios.post('http://192.168.1.15:3000/api/inspection/create', formattedData);

      if (response.status === 201) {
        Alert.alert('Success', 'Inspection created successfully');
      } else {
        Alert.alert('Error', 'Failed to create inspection');
      }
    } catch (error) {
      console.error('Error creating inspection:', error);
      Alert.alert('Error', 'Failed to create inspection');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ajouter une inspection</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.detailsContainer}>

          {/* Inspector Details*/}
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
          {/* End of Inspector Details*/}


          {/* Hive and Apiary Details */}
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
          {/* End of Hive and Apiary Details */}


          {/* Data and Time Details */}
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
          {/* End of Date and Time Details */}


          {/* Queen Details*/}
          <View style={styles.fieldset}>
            <Text style={styles.fieldsetTitle}>Reine</Text>
            <View style={[styles.detailItem, styles.inline]}>
              <Text style={styles.label}>Observée</Text>
              <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={formData.seen ? "#f4f3f4" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={(value) => handleInputChange('seen', value)}
                value={formData.seen}
              />
            </View>

            <View style={[styles.detailItem, styles.inline]}>
              <Text style={styles.label}>Clippée</Text>
              <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={formData.clipped ? "#f4f3f4" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={(value) => handleInputChange('clipped', value)}
                value={formData.clipped}
              />
            </View>

            <View style={[styles.detailItem, styles.inline]}>
              <Text style={styles.label}>Essaimé</Text>
              <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={formData.isSwarmed ? "#f4f3f4" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={(value) => handleInputChange('isSwarmed', value)}
                value={formData.isSwarmed}
              />
            </View>

            <View style={[styles.detailItem, styles.inline]}>
              <Text style={styles.label}>Marquée</Text>
              <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={formData.isMarked ? "#f4f3f4" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={(value) => handleInputChange('isMarked', value)}
                value={formData.isMarked}
              />
            </View>

            {formData.isMarked && (
              <View style={[styles.detailItem, styles.inline]}>
                <Text style={styles.label}>Couleur</Text>
                <Picker
                  style={[styles.textInput, styles.inlineInput, { backgroundColor: '#FBF5E0' }]}
                  selectedValue={formData.color}
                  onValueChange={(value) => handleInputChange('color', value)}
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
                selectedValue={formData.q_temperament}

                onValueChange={(value) => handleInputChange('q_temperament', value)}
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
                selectedValue={formData.queenCells}

                onValueChange={(value) => handleInputChange('queenCells', value)}
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
                value={formData.queenNote}
                onChangeText={(value) => handleInputChange('queenNote', value)}

              />
            </View>
          </View>
          {/* End of Queen Details*/}


          {/* Equipments Details  */}
          <View style={styles.fieldset}>
            <Text style={styles.fieldsetTitle}>Équipements</Text>

            <View style={[styles.detailItem, styles.inline]}>
              <Text style={styles.label}>Nombre de hausses</Text>
              <TextInput
                style={[styles.textInput, styles.inlineInput]}
                keyboardType='numeric'
                onChangeText={(value) => handleInputChange('supers', value)}
                value={formData.supers}
              />
            </View>

            <View style={[styles.detailItem, styles.inline]}>
              <Text style={styles.label}>Nombre de trappes à pollen</Text>
              <TextInput
                style={[styles.textInput, styles.inlineInput]}
                keyboardType='numeric'
                onChangeText={(value) => handleInputChange('pollenFrames', value)}
                value={formData.pollenFrames}
              />
            </View>

            <View style={[styles.detailItem, styles.inline]}>
              <Text style={styles.label}>Nombre total de cadres</Text>
              <TextInput
                style={[styles.textInput, styles.inlineInput]}
                keyboardType='numeric'
                onChangeText={(value) => handleInputChange('TotalFrames', value)}
                value={formData.TotalFrames}
              />
            </View>


          </View>
          {/* End of Equipments  Details*/}




          {/* Supplies Details  */}
          <View style={styles.fieldset}>
            <Text style={styles.fieldsetTitle}>Fournitures</Text>

            <View style={[styles.detailItem, styles.inline]}>
              <Text style={styles.label}>Produit</Text>
              <Picker
                style={[styles.textInput, styles.inlineInput, { backgroundColor: '#FBF5E0' }]}
                selectedValue={formData.product}
                onValueChange={(value) => handleInputChange('product', value)}
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
                onChangeText={(value) => handleInputChange('name', value)}
                value={formData.name}
              />
            </View>

            <View style={[styles.detailItem, styles.inline]}>
              <Text style={styles.label}>Quantité totale</Text>
              <TextInput
                style={[styles.textInput, styles.inlineInput]}
                keyboardType='numeric'
                onChangeText={(value) => handleInputChange('quantity', value)}
                value={formData.quantity}
              />
            </View>


            <View style={[styles.detailItem, styles.inline]}>
              <Text style={styles.label}>Unité</Text>
              <Picker
                style={[styles.textInput, styles.inlineInput, { backgroundColor: '#FBF5E0' }]}
                selectedValue={formData.unit}
                onValueChange={(value) => handleInputChange('unit', value)}
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
                onChangeText={(value) => handleInputChange('SuppliesNote', value)}
                value={formData.SuppliesNote}
              />
            </View>
          </View>
          {/* End of Supplies Details*/}


          {/* Brood Details*/}
          <View style={styles.fieldset}>
            <Text style={styles.fieldsetTitle}>Couvain & Mâles</Text>

            <View style={[styles.detailItem, styles.inline]}>
              <Text style={styles.label}>État du couvain</Text>
              <Picker
                style={[styles.textInput, styles.inlineInput, { backgroundColor: '#FBF5E0' }]}
                selectedValue={formData.state}
                onValueChange={(value) => handleInputChange('state', value)}

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
                onChangeText={(value) => handleInputChange('totalBrood', value)}
                value={formData.totalBrood}
              />
            </View>



            <View style={[styles.detailItem, styles.inline]}>
              <Text style={styles.label}>Couvain mâle</Text>
              <Picker
                style={[styles.textInput, styles.inlineInput, { backgroundColor: '#FBF5E0' }]}
                selectedValue={formData.maleBrood}
                onValueChange={(value) => handleInputChange('maleBrood', value)}
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
                thumbColor={formData.DronesSeen ? "#f4f3f4" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={(value) => handleInputChange('DronesSeen', value)}
                value={formData.DronesSeen}
              />
            </View>

          </View>
          {/* End of Brood Details*/}



          {/* Colony Details*/}
          <View style={styles.fieldset}>
            <Text style={styles.fieldsetTitle}>Colonie</Text>


            <View style={[styles.detailItem, styles.inline]}>
              <Text style={styles.label}>Abeilles mortes</Text>
              <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={formData.deadBees ? "#f4f3f4" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={(value) => handleInputChange('deadBees', value)}
                value={formData.deadBees}
              />
            </View>

            <View style={[styles.detailItem, styles.inline]}>
              <Text style={styles.label}>Tempérament</Text>
              <Picker
                style={[styles.textInput, styles.inlineInput, { backgroundColor: '#FBF5E0' }]}
                selectedValue={formData.c_temperament}
                onValueChange={(value) => handleInputChange('c_temperament', value)}
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
                selectedValue={formData.strength}
                onValueChange={(value) => handleInputChange('strength', value)}
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
                onChangeText={(value) => handleInputChange('colonyNote', value)}
                value={formData.colonyNote}
              />
            </View>

          </View>
          {/* End of Colony Details*/}



          {/* Treatment Details  */}
          <View style={styles.fieldset}>
            <Text style={styles.fieldsetTitle}>Maladie et traitement</Text>

            <View style={[styles.detailItem, styles.inline]}>
              <Text style={styles.label}>Maladie</Text>
              <Picker
                style={[styles.textInput, styles.inlineInput, { backgroundColor: '#FBF5E0' }]}
                selectedValue={formData.disease}
                onValueChange={(value) => handleInputChange('disease', value)}
              >
                {diseases.map((state, index) => (
                  <Picker.Item key={index} label={state} value={state} />
                ))}
              </Picker>
            </View>

            <View style={[styles.detailItem, styles.inline]}>
              <Text style={styles.label}>Traitements</Text>
              <Picker
                style={[styles.textInput, styles.inlineInput, { backgroundColor: '#FBF5E0' }]}
                selectedValue={formData.treatment}
                onValueChange={(value) => handleInputChange('treatment', value)}
              >
                {treatments.map((state, index) => (
                  <Picker.Item key={index} label={state} value={state} />
                ))}
              </Picker>
            </View>

            <View style={styles.fieldset}>
              <Text style={styles.fieldsetTitle}>Durée</Text>
              <View>
                <View style={[styles.detailItem, styles.inline]}>
                  <Text style={styles.label}>À partir de</Text>
                  <Pressable onPress={togglePickerFrom}>
                    <Text style={[styles.textInput, styles.inlineInput]}>
                      {formData.from.toLocaleDateString('fr-FR')}
                    </Text>
                  </Pressable>
                </View>
                {showPickerFrom && (
                  <DateTimePicker
                    testID="dateTimePickerFrom"
                    value={formData.from}
                    mode="date"
                    is24Hour={true}
                    display="default"
                    onChange={handleDateChangeFrom}
                    locale="fr"
                  />
                )}
              </View>

              <View>
                <View style={[styles.detailItem, styles.inline]}>
                  <Text style={styles.label}>À</Text>
                  <Pressable onPress={togglePickerTo}>
                    <Text style={[styles.textInput, styles.inlineInput]}>
                      {formData.to.toLocaleDateString('fr-FR')}
                    </Text>
                  </Pressable>
                </View>
                {showPickerTo && (
                  <DateTimePicker
                    testID="dateTimePickerTo"
                    value={formData.to}
                    mode="date"
                    is24Hour={true}
                    display="default"
                    onChange={handleDateChangeTo}
                    locale="fr"
                  />
                )}
              </View>
            </View>


            <View style={[styles.detailItem, styles.inline]}>
              <Text style={styles.label}>Quantité</Text>
              <TextInput
                style={[styles.textInput, styles.inlineInput]}
                keyboardType='numeric'
                onChangeText={(value) => handleInputChange('quantity', value)}
                value={formData.quantity}
              />
            </View>


            <View style={[styles.detailItem, styles.inline]}>
              <Text style={styles.label}>Doses</Text>
              <Picker
                style={[styles.textInput, styles.inlineInput, { backgroundColor: '#FBF5E0' }]}
                selectedValue={formData.doses}
                onValueChange={(value) => handleInputChange('doses', value)}
              >
                {doses.map((state, index) => (
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
                onChangeText={(value) => handleInputChange('BeeHealthNote', value)}
                value={formData.BeeHealthNote}
              />
            </View>
          </View>
          {/* End of Treatment Details*/}



          {/* Honey and Pollen stores Details  */}
          <View style={styles.fieldset}>
            <Text style={styles.fieldsetTitle}>Récoltes</Text>

            <View style={[styles.detailItem, styles.inline]}>
              <Text style={styles.label}>Récolte de miel </Text>
              <Picker
                style={[styles.textInput, styles.inlineInput, { backgroundColor: '#FBF5E0' }]}
                selectedValue={formData.HoneyStores}
                onValueChange={(value) => handleInputChange('HoneyStores', value)}
              >
                {HoneyPollenHarvest.map((state, index) => (
                  <Picker.Item key={index} label={state} value={state} />
                ))}
              </Picker>
            </View>

            <View style={[styles.detailItem, styles.inline]}>
              <Text style={styles.label}>Récolte de pollens </Text>
              <Picker
                style={[styles.textInput, styles.inlineInput, { backgroundColor: '#FBF5E0' }]}
                selectedValue={formData.PollenStores}
                onValueChange={(value) => handleInputChange('PollenStores', value)}
              >
                {HoneyPollenHarvest.map((state, index) => (
                  <Picker.Item key={index} label={state} value={state} />
                ))}
              </Picker>
            </View>



          </View>

          {/* End of Honey and Pollen stores Details */}


          {/* Actions Taken */}
          {/* <ScrollView>
            <View style={styles.fieldset}>
              <Text style={styles.fieldsetTitle}>Actions entreprises</Text>

            
              <View style={styles.frameContainer}>
              
                <View style={styles.frame}>
                  <Text style={styles.frameTitle}>Ajouts</Text>
                  <View style={styles.optionsContainer}>
                    {options.map((option) => renderOption(option, selectedAjouts, handleAjoutsChange))}

                  </View>
                </View>

                 
                <View style={styles.frame}>
                  <Text style={styles.frameTitle}>Enlèvements</Text>
                  <View style={styles.optionsContainer}>
                    {options.map((option) => renderOption(option, selectedEnlevements, handleEnlevementsChange))}
                  </View>
                </View>
              </View>

            </View>

          </ScrollView> */}

          {/* End of Actions Taken  */}

          {/* Weather Details  */}
          {/* <View>
            <View style={styles.inline}>
              <Text style={styles.label}>Inclure la météo</Text>
              <Switch
                trackColor={{ false: "#767577", true: "#B8E986" }}

                thumbColor={showWeatherDetails ? "#B8E986" : "#B8E986"}

                value={showWeatherDetails}
                onValueChange={(value) => setShowWeatherDetails(value)}
              />
            </View>

            {showWeatherDetails && (
              <View style={styles.fieldset}>
                <Text style={styles.fieldsetTitle}>Météo</Text>

                <View style={[styles.detailItem, styles.inline]}>
                  <Text style={styles.label}>Température (°C)</Text>
                  <TextInput
                    style={[styles.textInput, styles.inlineInput]}
                    keyboardType="numeric"
                    value={Weather.temperature}
                  />
                </View>

                <View style={[styles.detailItem, styles.inline]}>
                  <Text style={styles.label}>Humidité (%)</Text>
                  <TextInput
                    style={[styles.textInput, styles.inlineInput]}
                    keyboardType="numeric"
                    value={Weather.humidity}
                  />
                </View>

                <View style={[styles.detailItem, styles.inline]}>
                  <Text style={styles.label}>Pression (hPa)</Text>
                  <TextInput
                    style={[styles.textInput, styles.inlineInput]}
                    keyboardType="numeric"
                    value={Weather.pressure}
                  />
                </View>

                <View style={[styles.detailItem, styles.inline]}>
                  <Text style={styles.label}>Vitesse du vent (km/h)</Text>
                  <TextInput
                    style={[styles.textInput, styles.inlineInput]}
                    keyboardType="numeric"
                    value={Weather.windSpeed}
                  />
                </View>

                <View style={[styles.detailItem, styles.inline]}>
                  <Text style={styles.label}>Direction du vent</Text>
                  <Picker
                    selectedValue={Weather.windDirection}
                    style={[styles.textInput, styles.inlineInput, { backgroundColor: '#FBF5E0' }]}
                    onValueChange={(itemValue) => Weather.windDirection = itemValue}
                  >
                    {weather_wind_direction.map((direction, index) => (
                      <Picker.Item key={index} label={direction} value={direction} />
                    ))}
                  </Picker>
                </View>

                <View style={[styles.detailItem, styles.inline]}>
                  <Text style={styles.label}>Condition météorologique</Text>
                  <Picker
                    selectedValue={Weather.condition}
                    style={[styles.textInput, styles.inlineInput, { backgroundColor: '#FBF5E0' }]}
                    onValueChange={(itemValue) => Weather.condition = itemValue}
                  >
                    {weather_conditions.map((condition, index) => (
                      <Picker.Item key={index} label={condition} value={condition} />
                    ))}
                  </Picker>
                </View>
              </View>
            )}
          </View> */}
          {/* End of Weather Details  */}


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
  },

  picker: {
    flex: 2
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
    justifyContent: 'flex-start', // Align items horizontally starting from the left
    alignItems: 'flex-start', // Align items vertically starting from the top
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  option: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
    marginRight: 5,
    marginBottom: 5,
  },
  optionText: {
    fontSize: 14,
  },
  selectedOption: {
    backgroundColor: '#B8E986',
  },

  frameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  frame: {
    flex: 1,
    marginLeft: 5,
    marginRight: 5,
    borderWidth: 1,
    borderColor: '#977700',
    borderRadius: 8,
    padding: 10,
  },
  frameTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'center',
    color: '#342D21',
  },


});


export default AddInspectionScreen;

