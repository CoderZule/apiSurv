import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Text, TextInput, TouchableOpacity, Switch, Button, Pressable } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';


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
    queenCells: '',
    isSwarmed: false
  });
  const [Colony, setColony] = useState({
    strength: '',
    temperament: '',
    deadBees: false,
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
    condition: '',
    temperature: 0,
    humidity: 0,
    pressure: 0,
    windSpeed: 0,
    windDirection: 0
  });

  const [Note, setNote] = useState('');
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [selectedAjouts, setSelectedAjouts] = useState([]);
  const [selectedEnlevements, setSelectedEnlevements] = useState([]);
  const [showWeatherDetails, setShowWeatherDetails] = useState(false);



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

  const diseases = [
    'Acariose',
    'Loque américaine',
    'Abeilles africanisées',
    'Loque américaine',
    'Animaux',
    'Crise craie',
    'Couvain refroidi',
    'Syndrome d\'effondrement des colonies (CCD)',
    'Dysenterie',
    'Loque européenne',
    'Loque européenne',
    'Ouvrières pondeuses',
    'Nosema',
    'Pertes causées par les pesticides',
    'Sans reine',
    'Petit coléoptère de la ruche',
    'Loque pierreuse',
    'Tropilaelaps',
    'Varroa',
    'Guêpes',
    'Teigne de la cire',
    'Autre'];

  const treatments = [
    'Acaricide ajouté',
    'Acaricide retiré',
    'Apiguard',
    'Apistan',
    'Apivar',
    'Check Mite',
    'Acide formique',
    'Pads Formic Pro',
    'Fumagilline-B',
    'Miticide ajouté',
    'Miticide retiré',
    'Autre',
    'Acide oxalique',
    'Poussière de sucre',
    'Terramycine',
    'Thymol',
    'Tylosine'
  ];

  const doses = ["Gouttes", "Grammes", "Millilitres"];
  const HoneyPollenHarvest = ["Faible", "Moyenne", "Élevée"];
  const options = [
    { name: "Couvain ouvert", requiresNumberInput: true },
    { name: "Couvain fermé", requiresNumberInput: true },
    { name: "Cadre de miel", requiresNumberInput: true },
    { name: "Cadre de pollen", requiresNumberInput: true },
    { name: "Cire gaufrée", requiresNumberInput: true },
    { name: "Rayon de miel", requiresNumberInput: true }
  ];

  const weather_conditions = ["Ciel Dégagé", "Quelques Nuages", "Nuages Épars", "Nuages Fragmentés", "Averses", "Pluie", "Orage", "Neige", "Brume"];
  const weather_wind_direction = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];


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

  useEffect(() => {
    if (!isQueenMarked) {
      setQueen({ ...Queen, color: '' });
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


  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowPicker(false);
    setDate(currentDate);
  };

  const togglePicker = () => {
    setShowPicker(!showPicker);
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

  const handleAddInspection = () => {
    // Logic to add inspection to the hive
    // You can use the state variables to send the data to your backend or perform any other action
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
                selectedValue={Queen.queenCells}
                onValueChange={(itemValue) => handleQueenChange('queenCells', itemValue)}
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



          {/* Equipments Details  */}
          <View style={styles.fieldset}>
            <Text style={styles.fieldsetTitle}>Équipements</Text>

            <View style={[styles.detailItem, styles.inline]}>
              <Text style={styles.label}>Nombre de hausses</Text>
              <TextInput
                style={[styles.textInput, styles.inlineInput]}
                keyboardType='numeric'
                value={Supplies.ingredients.quantity}
              />
            </View>

            <View style={[styles.detailItem, styles.inline]}>
              <Text style={styles.label}>Nombre de trappes à pollen</Text>
              <TextInput
                style={[styles.textInput, styles.inlineInput]}
                keyboardType='numeric'
                value={Supplies.ingredients.quantity}
              />
            </View>

            <View style={[styles.detailItem, styles.inline]}>
              <Text style={styles.label}>Nombre total de cadres</Text>
              <TextInput
                style={[styles.textInput, styles.inlineInput]}
                keyboardType='numeric'
                value={Supplies.ingredients.quantity}
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
                style={[styles.textInput, styles.inlineInput, { backgroundColor: '#FBF5E0'}]}
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



          {/* Colony Details*/}
          <View style={styles.fieldset}>
            <Text style={styles.fieldsetTitle}>Colonie</Text>


            <View style={[styles.detailItem, styles.inline]}>
              <Text style={styles.label}>Abeilles mortes</Text>
              <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={Colony.deadBees ? "#f4f3f4" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={(value) => handleQueenChange('deadBees', value)}
                value={Colony.deadBees}
              />
            </View>

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



          {/* Treatment Details  */}
          <View style={styles.fieldset}>
            <Text style={styles.fieldsetTitle}>Maladie et traitement</Text>

            <View style={[styles.detailItem, styles.inline]}>
              <Text style={styles.label}>Maladie</Text>
              <Picker
                style={[styles.textInput, styles.inlineInput, { backgroundColor: '#FBF5E0'}]}
                selectedValue={Supplies.product}
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
                selectedValue={Supplies.product}
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
                  <Pressable onPress={togglePicker}>
                    <Text style={[styles.textInput, styles.inlineInput]}>
                      {hiveData.Queen.installed ? hiveData.Queen.installed.toString() : ""}
                    </Text>
                  </Pressable>
                </View>
                {showPicker && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode="date"
                    is24Hour={true}
                    display="default"
                    onChange={handleDateChange}
                    locale="fr"
                  />
                )}
              </View>

              <View>
                <View style={[styles.detailItem, styles.inline]}>
                  <Text style={styles.label}>À</Text>
                  <Pressable onPress={togglePicker}>
                    <Text style={[styles.textInput, styles.inlineInput]}>
                      {hiveData.Queen.installed ? hiveData.Queen.installed.toString() : ""}
                    </Text>
                  </Pressable>
                </View>
                {showPicker && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode="date"
                    is24Hour={true}
                    display="default"
                    onChange={handleDateChange}
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
                value={Supplies.ingredients.quantity}
              />
            </View>


            <View style={[styles.detailItem, styles.inline]}>
              <Text style={styles.label}>Doses</Text>
              <Picker
                style={[styles.textInput, styles.inlineInput, { backgroundColor: '#FBF5E0' }]}
                selectedValue={Supplies.ingredients.unit}
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
                value={Note}
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
                selectedValue={Supplies.product}
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
                selectedValue={Supplies.product}
              >
                {HoneyPollenHarvest.map((state, index) => (
                  <Picker.Item key={index} label={state} value={state} />
                ))}
              </Picker>
            </View>



          </View>

          {/* End of Honey and Pollen stores Details */}


          {/* Actions Taken */}
          <ScrollView>
            <View style={styles.fieldset}>
              <Text style={styles.fieldsetTitle}>Actions entreprises</Text>

              {/* Frames for Ajouts and Enlèvements */}
              <View style={styles.frameContainer}>
                {/* Frame for Ajouts */}
                <View style={styles.frame}>
                  <Text style={styles.frameTitle}>Ajouts</Text>
                  <View style={styles.optionsContainer}>
                    {options.map((option) => renderOption(option, selectedAjouts, handleAjoutsChange))}

                  </View>
                </View>

                {/* Frame for Enlèvements */}
                <View style={styles.frame}>
                  <Text style={styles.frameTitle}>Enlèvements</Text>
                  <View style={styles.optionsContainer}>
                    {options.map((option) => renderOption(option, selectedEnlevements, handleEnlevementsChange))}
                  </View>
                </View>
              </View>

            </View>

          </ScrollView>
          {/* End of Actions Taken  */}

          {/* Weather Details  */}
          <View>
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
          </View>
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

