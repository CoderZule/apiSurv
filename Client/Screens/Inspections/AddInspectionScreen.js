import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Text, TextInput, TouchableOpacity, Switch, Pressable, Alert, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from '../../axiosConfig';
import * as Location from 'expo-location';
import {
  queenColors,
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

} from '../Data';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import LottieView from "lottie-react-native";



const Option = React.memo(({ option, isSelected, onPressHandler, quantity, onQuantityChange }) => (
  <TouchableOpacity
    key={option.name}
    style={[
      styles.option,
      isSelected ? styles.selectedOption : null
    ]}
    onPress={onPressHandler}
  >
    <Text style={styles.optionText}>{option.name}</Text>
    {isSelected && (
      <TextInput
        value={quantity.toString()}
        onChangeText={onQuantityChange}
        style={[
          styles.textInput,
          { width: 50, marginBottom: 5 },
        ]}
        keyboardType="numeric"
        placeholder="الكمية"
      />
    )}
  </TouchableOpacity>
));


const AddInspectionScreen = ({ route }) => {
  const navigation = useNavigation();

  const { hiveData } = route.params;

  const [date, setDate] = useState(new Date());
  const [showPickerFrom, setShowPickerFrom] = useState(false);
  const [showPickerTo, setShowPickerTo] = useState(false);

  const [showWeatherDetails, setShowWeatherDetails] = useState(false);
  const startYear = 2015;
  const endYear = 2024;
  const years = Array.from(new Array(endYear - startYear + 1), (_, index) => startYear + index);
  years.reverse();

  const [time, setTime] = useState(new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }));


  const [inspector, setInspector] = useState('');
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const currentUserString = await AsyncStorage.getItem('currentUser');
        if (currentUserString) {
          const user = JSON.parse(currentUserString);
          setInspector(user);
          setIsLoading(false);

        }
      } catch (error) {
        console.error('Error retrieving current user:', error);
      }
    };

    fetchCurrentUser();

  }, []);

  const [formData, setFormData] = useState({
    isMarked: undefined,
    color: hiveData.Queen && hiveData.Queen.color ? hiveData.Queen.color : null,
    clipped: undefined,
    seen: false,
    isSwarmed: undefined,
    q_temperament: '',
    queenCells: '',
    queenNote: '',
    TotalFrames: hiveData.Colony.TotalFrames,
    supers: hiveData.Colony.supers,
    pollenFrames: hiveData.Colony.pollenFrames,
    strength: hiveData.Colony.strength,
    c_temperament: hiveData.Colony.temperament,
    deadBees: false,
    colonyNote: hiveData.Colony.Note,
    state: '',
    maleBrood: '',
    totalBrood: 0,
    DronesSeen: false,
    product: '',
    name: '',
    suppliesQuantity: 0,
    unit: '',
    SuppliesNote: '',
    disease: '',
    treatment: '',
    from: null,
    to: null,
    treatmentQuantity: 0,
    doses: '',
    BeeHealthNote: '',
    HoneyStores: '',
    PollenStores: '',
    ActivityAdd: '',
    QuantityAdded: 0,
    ActivityRemove: '',
    QuantityRemoved: 0,
    InspectionNote: ''


  });

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


  useEffect(() => {
    if (!formData.isMarked) {
      setFormData(prevData => ({
        ...prevData,
        color: '',
      }));
    }
  }, [formData.isMarked]);

  const handleInputChange = (key, value) => {
    setFormData(prevState => ({
      ...prevState,
      [key]: value
    }));
  };

  const [selectedAjouts, setSelectedAjouts] = useState([]);
  const [selectedEnlevements, setSelectedEnlevements] = useState([]);
  const [showQueenDetails, setShowQueenDetails] = useState(formData.seen);

  const renderOption = (option, selectedItems, handleChange) => {
    const selectedItem = selectedItems.find(item => item.name === option.name);
    const isSelected = !!selectedItem;
    const quantity = selectedItem ? selectedItem.quantity : 0;

    const onPressHandler = () => {
      handleChange(option.name, quantity);
    };

    const onQuantityChange = (text) => {
      const quantity = parseInt(text);
      if (isNaN(quantity) || quantity < 0) {
        handleChange(option.name, 0);
      } else {
        handleChange(option.name, quantity);
      }
    };

    return (
      <Option
        key={option.name}
        option={option}
        isSelected={isSelected}
        onPressHandler={onPressHandler}
        quantity={quantity}
        onQuantityChange={onQuantityChange}
      />
    );
  };

  const handleAjoutsChange = (itemName, quantity) => {
    setSelectedAjouts(prevState => {
      const index = prevState.findIndex(item => item.name === itemName);
      if (index !== -1) {

        const updatedState = prevState.map(item =>
          item.name === itemName ? { ...item, quantity } : item
        );
        return updatedState.filter(item => item.quantity > 0);
      } else {

        return [...prevState, { name: itemName, quantity }];
      }
    });
  };

  const handleEnlevementsChange = (itemName, quantity) => {
    setSelectedEnlevements(prevState => {
      const index = prevState.findIndex(item => item.name === itemName);
      if (index !== -1) {

        const updatedState = prevState.map(item =>
          item.name === itemName ? { ...item, quantity } : item
        );
        return updatedState.filter(item => item.quantity > 0);
      } else {

        return [...prevState, { name: itemName, quantity }];
      }
    });
  };

  useEffect(() => {
    const activitiesAdd = selectedAjouts.map(
      activity => `${activity.name}: ${activity.quantity}`
    );
    const activitiesRemove = selectedEnlevements.map(
      activity => `${activity.name}: ${activity.quantity}`
    );

    handleInputChange('ActivityAdd', activitiesAdd.join(', '));
    handleInputChange(
      'QuantityAdded',
      selectedAjouts.reduce((total, item) => total + item.quantity, 0)
    );
    handleInputChange('ActivityRemove', activitiesRemove.join(', '));
    handleInputChange(
      'QuantityRemoved',
      selectedEnlevements.reduce((total, item) => total + item.quantity, 0)
    );
  }, [selectedAjouts, selectedEnlevements]);

  useEffect(() => {
    if (showWeatherDetails) {
      getLocationAndFetchWeather();
    } else {

      setFormData(prevState => ({
        ...prevState,
        temperature: '',
        humidity: '',
        pressure: '',
        windSpeed: '',
        windDirection: '',
        condition: ''
      }));
    }
  }, [showWeatherDetails]);


  const getLocationAndFetchWeather = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {

        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      fetchWeather(latitude, longitude);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchWeather = async (latitude, longitude) => {
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=d769c20d61c0a5bd6bf018b42cae8855&units=metric`);
      const data = await response.json();

      setFormData(prevState => ({
        ...prevState,
        temperature: data.main.temp.toString(),
        humidity: data.main.humidity.toString(),
        pressure: data.main.pressure.toString(),
        windSpeed: data.wind.speed.toString(),
        windDirection: data.wind.deg.toString(),
        condition: data.weather[0].main
      }));
    } catch (error) {
      console.error(error);
    }
  };



  const handleAddInspection = async () => {
    try {


      const filteredAjouts = selectedAjouts.filter(activity => activity.quantity > 0);
      const filteredEnlevements = selectedEnlevements.filter(activity => activity.quantity > 0);

      const activitiesAdd = filteredAjouts.map(activity => `${activity.name}: ${activity.quantity}`);
      const activitiesRemove = filteredEnlevements.map(activity => `${activity.name}: ${activity.quantity}`);

      const formattedData = {
        Inspector: {
          firstName: inspector.Firstname,
          lastName: inspector.Lastname,
          cin: inspector.Cin,
          phone: inspector.Phone
        },

        InspectionDateTime: date,

        ApiaryAndHive: {
          apiaryName: hiveData.Apiary.Name,
          hiveName: hiveData.Name,
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
            quantity: formData.suppliesQuantity,
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
          quantity: formData.treatmentQuantity,
          doses: formData.doses,
          note: formData.BeeHealthNote
        },

        HoneyStores: formData.HoneyStores,
        PollenStores: formData.PollenStores,

        Adding: {
          ActivityAdd: activitiesAdd.join(', '),
          QuantityAdded: filteredAjouts.reduce((total, item) => total + item.quantity, 0),
        },
        Removing: {
          ActivityRemove: activitiesRemove.join(', '),
          QuantityRemoved: filteredEnlevements.reduce((total, item) => total + item.quantity, 0),
        },
        Weather: {
          condition: formData.condition,
          temperature: formData.temperature,
          humidity: formData.humidity,
          pressure: formData.pressure,
          windSpeed: formData.windSpeed,
          windDirection: formData.windDirection
        },

        Note: formData.InspectionNote,

        Hive: hiveData._id



      };


      if (hiveData.Queen) {
        formattedData.Queen = {
          seen: formData.seen,
          isMarked: formData.isMarked,
          color: formData.color,
          clipped: formData.clipped,
          temperament: formData.q_temperament,
          note: formData.queenNote,
          queenCells: formData.queenCells,
          isSwarmed: formData.isSwarmed,
        };


        if (formattedData.Queen.seen) {
          if (formattedData.Queen.isMarked && formattedData.Queen.color === '') {
            return Alert.alert('خطأ', 'يرجى اختيار لون للملكة');
          }
          if (!formattedData.Queen.temperament || !formattedData.Queen.queenCells) {
            return Alert.alert('خطأ', 'يرجى إكمال معلومات الملكة');
          }
        } else {
          formattedData.Queen.isMarked = false;
          formattedData.Queen.color = '';
          formattedData.Queen.clipped = false;
          formattedData.Queen.temperament = '';
          formattedData.Queen.note = '';
          formattedData.Queen.queenCells = '';
          formattedData.Queen.isSwarmed = false;
        }
      }



      if (!formattedData.Colony.supers | !formattedData.Colony.pollenFrames | !formattedData.Colony.TotalFrames) {
        return Alert.alert('خطأ', 'معلومات المعدات مطلوبة');
      }

      const suppliesFieldsFilled = [formattedData.Supplies.product, formattedData.Supplies.ingredients.name, formattedData.Supplies.ingredients.quantity, formattedData.Supplies.ingredients.unit].some(field => field);
      const suppliesFieldsIncomplete = [formattedData.Supplies.product, formattedData.Supplies.ingredients.name, formattedData.Supplies.ingredients.quantity, formattedData.Supplies.ingredients.unit].some(field => !field);

      if (suppliesFieldsFilled && suppliesFieldsIncomplete) {
        return Alert.alert('خطأ', 'يرجى إكمال جميع المعلومات عن غذاء النحل');
      }


      if (!formattedData.Brood.state || !formattedData.Brood.maleBrood || formattedData.Brood.totalBrood === undefined || formattedData.DronesSeen === undefined) {
        return Alert.alert('خطأ', 'معلومات الحضنة والذكور مطلوبة');

      }

      if (!formattedData.Colony.strength || !formattedData.Colony.temperament || formattedData.Colony.deadBees === undefined) {
        return Alert.alert('خطأ', 'معلومات المستعمرة مطلوبة');
      }


      const beeHealthFieldsFilled = [formattedData.BeeHealth.disease, formattedData.BeeHealth.treatment, formattedData.BeeHealth.duration.from, formattedData.BeeHealth.duration.to, formattedData.BeeHealth.quantity, formattedData.BeeHealth.doses].some(field => field);
      const beeHealthFieldsIncomplete = [formattedData.BeeHealth.disease, formattedData.BeeHealth.treatment, formattedData.BeeHealth.duration.from, formattedData.BeeHealth.duration.to, formattedData.BeeHealth.quantity, formattedData.BeeHealth.doses].some(field => !field);

      if (beeHealthFieldsFilled && beeHealthFieldsIncomplete) {
        return Alert.alert('خطأ', 'يرجى إكمال جميع المعلومات عن صحة النحل');
      }


      if (!formattedData.HoneyStores) {
        return Alert.alert('خطأ', 'مخزونات العسل مطلوبة');
      }
      if (!formattedData.PollenStores) {
        return Alert.alert('خطأ', 'مخزونات حبوب اللقاح مطلوبة');
      }
      if (!formattedData.Weather.condition || formattedData.Weather.temperature === undefined || formattedData.Weather.humidity === undefined || formattedData.Weather.pressure === undefined || formattedData.Weather.windSpeed === undefined || formattedData.Weather.windDirection === undefined) {
        return Alert.alert('خطأ', 'المعلومات الجوية مطلوبة');
      }
      if (!formattedData.Hive) {
        return Alert.alert('خطأ', 'الخلية مطلوبة');
      }





      const response = await axios.post('/inspection/create', formattedData);

      if (response.status === 201) {
        Alert.alert('نجاح', 'تمت إضافة المتابعة بنجاح', [
          {
            text: 'موافق',
            onPress: () => {
              navigation.navigate('Home');
            }
          }
        ]);
      } else {
        Alert.alert('خطأ', 'فشل في إضافة المتابعة');
      }

    } catch (error) {
      console.error('Error creating inspection:', error);
      Alert.alert('خطأ', 'فشل في إضافة المتابعة');
    }
  };

  const handleSeenToggle = (value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      seen: value,
      isMarked: value ? hiveData.Queen.isMarked : undefined,
      color: value ? hiveData.Queen.color : '',
      clipped: value ? hiveData.Queen.clipped : undefined,
      isSwarmed: value ? hiveData.Queen.isSwarmed : undefined,
    }));
    setShowQueenDetails(value);
  };



  return (
    <View style={styles.container}>
      <Text style={styles.title}>إضافة متابعة دورية</Text>
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
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.detailsContainer}>

            {/* Inspector Details*/}
            <View style={styles.fieldset}>
              <Text style={styles.fieldsetTitle}>المتفقد</Text>
              <View style={[styles.detailItem, styles.inline]}>
                <FontAwesome5 name="user-alt" size={14} color="#977700" style={styles.inputIcon} />
                <Text style={styles.label}>الاسم واللقب </Text>
                <TextInput
                  style={[styles.textInput, styles.inlineInput, styles.disabledTextInput]}
                  value={`${inspector.Firstname} ${inspector.Lastname}`}
                  editable={false}
                />

              </View>
              <View style={[styles.detailItem, styles.inline]}>
                <FontAwesome5 name="id-card-alt" size={14} color="#977700" style={styles.inputIcon} />
                <Text style={styles.label}>رقم .ب.ت.و </Text>
                <TextInput
                  style={[styles.textInput, styles.inlineInput, styles.disabledTextInput]}
                  value={inspector.Cin}
                  editable={false}
                />
              </View>
              <View style={[styles.detailItem, styles.inline]}>
                <FontAwesome5 name="phone" size={14} color="#977700" style={styles.inputIcon} />
                <Text style={styles.label}>الهاتف </Text>
                <TextInput
                  style={[styles.textInput, styles.inlineInput, styles.disabledTextInput]}
                  value={inspector.Phone}
                  editable={false}
                />
              </View>

            </View>



            {/* Hive and Apiary Details */}
            <View style={styles.fieldset}>
              <Text style={styles.fieldsetTitle}>المنحل والخلية</Text>
              <View style={[styles.detailItem, styles.inline]}>
                <Ionicons name="trail-sign-outline" size={14} color="#977700" style={styles.icon} />
                <Text style={styles.label}> المنحل </Text>
                <TextInput
                  style={[styles.textInput, styles.inlineInput, styles.disabledTextInput]}
                  value={hiveData.Apiary.Name}
                  editable={false}
                />
              </View>
              <View style={[styles.detailItem, styles.inline]}>
                <FontAwesome5 name="archive" size={14} color="#977700" style={styles.icon} />
                <Text style={styles.label}> الخلية </Text>
                <TextInput
                  style={[styles.textInput, styles.inlineInput, styles.disabledTextInput]}
                  value={hiveData.Name}
                  editable={false}
                />
              </View>
            </View>



            {/* Data and Time Details */}
            <View style={styles.fieldset}>
              <Text style={styles.fieldsetTitle}>التاريخ والوقت</Text>
              <View style={[styles.detailItem, styles.inline]}>
                <FontAwesome5 name="calendar-alt" size={14} color="#977700" style={styles.icon} />
                <Text style={styles.label}> التاريخ </Text>
                <TextInput
                  style={[styles.textInput, styles.inlineInput, styles.disabledTextInput]}
                  value={new Date().toLocaleDateString('fr-FR')}
                  editable={false}
                />
              </View>
              <View style={[styles.detailItem, styles.inline]}>
                <FontAwesome5 name="clock" size={14} color="#977700" style={styles.icon} />
                <Text style={styles.label}> الوقت </Text>
                <TextInput
                  style={[styles.textInput, styles.inlineInput, styles.disabledTextInput]}
                  value={time}
                  editable={false}
                />
              </View>
            </View>



            {/* Queen Details*/}
            {hiveData.Queen && (
              <View style={styles.fieldset}>
                <Text style={styles.fieldsetTitle}>الملكة</Text>


                <View>
                  <View style={styles.inline}>
                    <Text style={styles.label}>موجودة</Text>
                    <Switch
                      trackColor={{ false: "#767577", true: "#81b0ff" }}
                      thumbColor={showQueenDetails ? "#f4f3f4" : "#f4f3f4"}
                      ios_backgroundColor="#3e3e3e"
                      onValueChange={(value) => {
                        handleInputChange('seen', value);
                        handleSeenToggle(value);
                      }}
                      value={showQueenDetails}
                    />
                  </View>


                  {showQueenDetails && (
                    <>
                      <View style={[styles.detailItem, styles.inline]}>
                        <Text style={styles.label}>مقيدة</Text>
                        <Switch
                          trackColor={{ false: "#767577", true: "#81b0ff" }}
                          thumbColor={formData.clipped ? "#f4f3f4" : "#f4f3f4"}
                          ios_backgroundColor="#3e3e3e"
                          onValueChange={(value) => handleInputChange('clipped', value)}
                          value={formData.clipped}
                        />
                      </View>

                      <View style={[styles.detailItem, styles.inline]}>
                        <Text style={styles.label}>مُتسربة</Text>
                        <Switch
                          trackColor={{ false: "#767577", true: "#81b0ff" }}
                          thumbColor={formData.isSwarmed ? "#f4f3f4" : "#f4f3f4"}
                          ios_backgroundColor="#3e3e3e"
                          onValueChange={(value) => handleInputChange('isSwarmed', value)}
                          value={formData.isSwarmed}
                        />
                      </View>

                      <View style={[styles.detailItem, styles.inline]}>
                        <Text style={styles.label}>معلمة</Text>
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
                          <Text style={styles.label}>اللون</Text>
                          <Picker
                            style={[styles.textInput, styles.inlineInput, { backgroundColor: '#FBF5E0' }]}
                            selectedValue={formData.color}
                            onValueChange={(value) => handleInputChange('color', value)}
                          >
                            {queenColors.map((color, index) => (
                              <Picker.Item key={index} label={color} value={color} />
                            ))}
                          </Picker>
                        </View>
                      )}

                      <View style={[styles.detailItem, styles.inline]}>
                        <Text style={styles.label}>سلوك الملكة</Text>
                        <Picker
                          style={[styles.textInput, styles.inlineInput, { backgroundColor: '#FBF5E0' }]}
                          selectedValue={formData.q_temperament}
                          onValueChange={(value) => handleInputChange('q_temperament', value)}
                        >
                      <Picker.Item label="اختر..." value="" enabled={false} />
                          {temperament.map((state, index) => (
                            <Picker.Item key={index} label={state} value={state} />
                          ))}
                        </Picker>
                      </View>

                      <View style={[styles.detailItem, styles.inline]}>
                        <Text style={styles.label}>الخلايا الملكية</Text>
                        <Picker
                          style={[styles.textInput, styles.inlineInput, { backgroundColor: '#FBF5E0' }]}
                          selectedValue={formData.queenCells}
                          onValueChange={(value) => handleInputChange('queenCells', value)}
                        >
                      <Picker.Item label="اختر..." value="" enabled={false} />
                          {queen_cells.map((state, index) => (
                            <Picker.Item key={index} label={state} value={state} />
                          ))}
                        </Picker>
                      </View>

                      <View style={[styles.detailItem, styles.inline]}>
                        <Text style={styles.label}>ملاحظة</Text>
                        <TextInput
                          style={[styles.textInput, styles.inlineInput, styles.textArea]}
                          multiline={true}
                          numberOfLines={4}
                          value={formData.queenNote}
                          onChangeText={(value) => handleInputChange('queenNote', value)}
                        />
                      </View>
                    </>
                  )}
                </View>
              </View>)}



            {/* Equipments Details  */}
            <View style={styles.fieldset}>
              <Text style={styles.fieldsetTitle}>المعدات</Text>

              <View style={[styles.detailItem, styles.inline]}>
                <Text style={styles.label}>عدد العسالات </Text>
                <TextInput
                  style={[styles.textInput, styles.inlineInput]}
                  keyboardType='numeric'
                  onChangeText={(value) => handleInputChange('supers', value)}
                  value={formData.supers.toString()}
                />
              </View>
              <View style={[styles.detailItem, styles.inline]}>
                <Text style={styles.label}>عدد إطارات حبوب اللقاح </Text>
                <TextInput
                  style={[styles.textInput, styles.inlineInput]}
                  keyboardType='numeric'
                  onChangeText={(value) => handleInputChange('pollenFrames', value)}
                  value={hiveData.Colony.pollenFrames ? formData.pollenFrames.toString() : formData.pollenFrames}
                />
              </View>


              <View style={[styles.detailItem, styles.inline]}>
                <Text style={styles.label}>إجمالي الإطارات </Text>
                <TextInput
                  style={[styles.textInput, styles.inlineInput]}
                  keyboardType='numeric'
                  onChangeText={(value) => handleInputChange('TotalFrames', value)}
                  value={formData.TotalFrames.toString()}
                />
              </View>


            </View>


            {/* Supplies Details  */}
            <View style={styles.fieldset}>
              <Text style={styles.fieldsetTitle}>غذاء النحل</Text>

              <View style={[styles.detailItem, styles.inline]}>
                <Text style={styles.label}>المنتج </Text>
                <Picker
                  style={[styles.textInput, styles.inlineInput, { backgroundColor: '#FBF5E0' }]}
                  selectedValue={formData.product}
                  onValueChange={(value) => handleInputChange('product', value)}
                >
                      <Picker.Item label="اختر..." value="" enabled={false} />

                  {supplies.map((state, index) => (
                    <Picker.Item key={index} label={state} value={state} />
                  ))}
                </Picker>
              </View>

              <View style={[styles.detailItem, styles.inline]}>
                <Text style={styles.label}>المكونات </Text>
                <TextInput
                  style={[styles.textInput, styles.inlineInput]}
                  onChangeText={(value) => handleInputChange('name', value)}
                  value={formData.name}
                />
              </View>

              <View style={[styles.detailItem, styles.inline]}>
                <Text style={styles.label}>الكمية </Text>
                <TextInput
                  style={[styles.textInput, styles.inlineInput]}
                  keyboardType='numeric'
                  onChangeText={(value) => handleInputChange('suppliesQuantity', value)}
                  value={formData.quantity}
                />
              </View>


              <View style={[styles.detailItem, styles.inline]}>
                <Text style={styles.label}>الوحدة </Text>
                <Picker
                  style={[styles.textInput, styles.inlineInput, { backgroundColor: '#FBF5E0' }]}
                  selectedValue={formData.unit}
                  onValueChange={(value) => handleInputChange('unit', value)}
                >
                      <Picker.Item label="اختر..." value="" enabled={false} />

                  {units.map((state, index) => (
                    <Picker.Item key={index} label={state} value={state} />
                  ))}
                </Picker>
              </View>

              <View style={[styles.detailItem, styles.inline]}>
                <Text style={styles.label}>ملاحظة </Text>
                <TextInput
                  style={[styles.textInput, styles.inlineInput, styles.textArea]}
                  multiline={true}
                  numberOfLines={4}
                  onChangeText={(value) => handleInputChange('SuppliesNote', value)}
                  value={formData.SuppliesNote}
                />
              </View>
            </View>



            {/* Brood Details*/}
            <View style={styles.fieldset}>
              <Text style={styles.fieldsetTitle}>الحضنة والذكور</Text>

              <View style={[styles.detailItem, styles.inline]}>
                <Text style={styles.label}>الحالة </Text>
                <Picker
                  style={[styles.textInput, styles.inlineInput, { backgroundColor: '#FBF5E0' }]}
                  selectedValue={formData.state}
                  onValueChange={(value) => handleInputChange('state', value)}

                >
                      <Picker.Item label="اختر..." value="" enabled={false} />

                  {brood.map((state, index) => (
                    <Picker.Item key={index} label={state} value={state} />
                  ))}
                </Picker>
              </View>

              <View style={[styles.detailItem, styles.inline]}>
                <Text style={styles.label}>إجمالي الحضنة </Text>
                <TextInput
                  style={[styles.textInput, styles.inlineInput]}
                  keyboardType='numeric'
                  onChangeText={(value) => handleInputChange('totalBrood', value)}
                  value={formData.totalBrood}
                />
              </View>



              <View style={[styles.detailItem, styles.inline]}>
                <Text style={styles.label}>حضنة الذكور </Text>
                <Picker
                  style={[styles.textInput, styles.inlineInput, { backgroundColor: '#FBF5E0' }]}
                  selectedValue={formData.maleBrood}
                  onValueChange={(value) => handleInputChange('maleBrood', value)}
                >
                      <Picker.Item label="اختر..." value="" enabled={false} />

                  {malebrood.map((state, index) => (
                    <Picker.Item key={index} label={state} value={state} />
                  ))}
                </Picker>
              </View>

              <View style={[styles.detailItem, styles.inline]}>
                <Text style={styles.label}>وجود الذكور</Text>
                <Switch
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={formData.DronesSeen ? "#f4f3f4" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={(value) => handleInputChange('DronesSeen', value)}
                  value={formData.DronesSeen}
                />
              </View>

            </View>


            {/* Colony Details*/}
            <View style={styles.fieldset}>
              <Text style={styles.fieldsetTitle}>المستعمرة</Text>


              <View style={[styles.detailItem, styles.inline]}>
                <Text style={styles.label}>وجود نحل ميت</Text>
                <Switch
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={formData.deadBees ? "#f4f3f4" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={(value) => handleInputChange('deadBees', value)}
                  value={formData.deadBees}
                />
              </View>

              <View style={[styles.detailItem, styles.inline]}>
                <Text style={styles.label}>سلوك المستعمرة </Text>
                <Picker
                  style={[styles.textInput, styles.inlineInput, { backgroundColor: '#FBF5E0' }]}
                  selectedValue={formData.c_temperament}
                  onValueChange={(value) => handleInputChange('c_temperament', value)}
                >
                      <Picker.Item label="اختر..." value="" enabled={false} />

                  {temperament.map((state, index) => (
                    <Picker.Item key={index} label={state} value={state} />
                  ))}
                </Picker>
              </View>


              <View style={[styles.detailItem, styles.inline]}>
                <Text style={styles.label}>قوة المستعمرة </Text>
                <Picker
                  style={[styles.textInput, styles.inlineInput, { backgroundColor: '#FBF5E0' }]}
                  selectedValue={formData.strength}
                  onValueChange={(value) => handleInputChange('strength', value)}
                >
                      <Picker.Item label="اختر..." value="" enabled={false} />

                  {force.map((state, index) => (
                    <Picker.Item key={index} label={state} value={state} />
                  ))}
                </Picker>
              </View>

              <View style={[styles.detailItem, styles.inline]}>
                <Text style={styles.label}>ملاحظة </Text>
                <TextInput
                  style={[styles.textInput, styles.inlineInput, styles.textArea]}
                  multiline={true}
                  numberOfLines={4}
                  onChangeText={(value) => handleInputChange('colonyNote', value)}
                  value={formData.colonyNote}
                />
              </View>

            </View>


            {/* Treatment Details  */}
            <View style={styles.fieldset}>
              <Text style={styles.fieldsetTitle}>صحة النحل</Text>

              <View style={[styles.detailItem, styles.inline]}>
                <Text style={styles.label}>المرض </Text>
                <Picker
                  style={[styles.textInput, styles.inlineInput, { backgroundColor: '#FBF5E0' }]}
                  selectedValue={formData.disease}
                  onValueChange={(value) => handleInputChange('disease', value)}
                >
                   <Picker.Item label="اختر..." value="" enabled={false} />

                  {diseases.map((state, index) => (
                    <Picker.Item key={index} label={state} value={state} />
                  ))}
                </Picker>
              </View>

              <View style={[styles.detailItem, styles.inline]}>
                <Text style={styles.label}>العلاج </Text>
                <Picker
                  style={[styles.textInput, styles.inlineInput, { backgroundColor: '#FBF5E0' }]}
                  selectedValue={formData.treatment}
                  onValueChange={(value) => handleInputChange('treatment', value)}
                >
                   <Picker.Item label="اختر..." value="" enabled={false} />

                  {treatments.map((state, index) => (
                    <Picker.Item key={index} label={state} value={state} />
                  ))}
                </Picker>
              </View>

              <View style={styles.fieldset}>
                <Text style={styles.fieldsetTitle}>المدة</Text>
                <View>
                  <View style={[styles.detailItem, styles.inline]}>
                    <Text style={styles.label}>من   </Text>
                    <Pressable onPress={togglePickerFrom}>
                      <Text style={[styles.textInput, styles.inlineInput]}>
                        {formData.from ? formData.from.toLocaleDateString('fr-FR') : 'حدد تاريخا'}
                      </Text>
                    </Pressable>
                  </View>
                  {showPickerFrom && (
                    <DateTimePicker
                      testID="dateTimePickerFrom"
                      value={formData.from || new Date()}
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
                    <Text style={styles.label}>إلى   </Text>
                    <Pressable onPress={togglePickerTo}>
                      <Text style={[styles.textInput, styles.inlineInput]}>
                        {formData.to ? formData.to.toLocaleDateString('fr-FR') : 'حدد تاريخا'}
                      </Text>
                    </Pressable>
                  </View>
                  {showPickerTo && (
                    <DateTimePicker
                      testID="dateTimePickerTo"
                      value={formData.to || new Date()}
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
                <Text style={styles.label}>الكمية </Text>
                <TextInput
                  style={[styles.textInput, styles.inlineInput]}
                  keyboardType='numeric'
                  onChangeText={(value) => handleInputChange('treatmentQuantity', value)}
                  value={formData.treatmentQuantity}
                />
              </View>


              <View style={[styles.detailItem, styles.inline]}>
                <Text style={styles.label}>الجرعات </Text>
                <Picker
                  style={[styles.textInput, styles.inlineInput, { backgroundColor: '#FBF5E0' }]}
                  selectedValue={formData.doses}
                  onValueChange={(value) => handleInputChange('doses', value)}
                >
                   <Picker.Item label="اختر..." value="" enabled={false} />

                  {doses.map((state, index) => (
                    <Picker.Item key={index} label={state} value={state} />
                  ))}
                </Picker>
              </View>

              <View style={[styles.detailItem, styles.inline]}>
                <Text style={styles.label}>ملاحظة </Text>
                <TextInput
                  style={[styles.textInput, styles.inlineInput, styles.textArea]}
                  multiline={true}
                  numberOfLines={4}
                  onChangeText={(value) => handleInputChange('BeeHealthNote', value)}
                  value={formData.BeeHealthNote}
                />
              </View>
            </View>


            {/* Honey and Pollen stores Details  */}
            <View style={styles.fieldset}>
              <Text style={styles.fieldsetTitle}>الحصاد</Text>

              <View style={[styles.detailItem, styles.inline]}>
                <Text style={styles.label}>حصاد العسل </Text>
                <Picker
                  style={[styles.textInput, styles.inlineInput, { backgroundColor: '#FBF5E0' }]}
                  selectedValue={formData.HoneyStores}
                  onValueChange={(value) => handleInputChange('HoneyStores', value)}
                >
                   <Picker.Item label="اختر..." value="" enabled={false} />

                  {HoneyPollenHarvest.map((state, index) => (
                    <Picker.Item key={index} label={state} value={state} />
                  ))}
                </Picker>
              </View>

              <View style={[styles.detailItem, styles.inline]}>
                <Text style={styles.label}>حصاد حبوب اللقاح </Text>
                <Picker
                  style={[styles.textInput, styles.inlineInput, { backgroundColor: '#FBF5E0' }]}
                  selectedValue={formData.PollenStores}
                  onValueChange={(value) => handleInputChange('PollenStores', value)}
                >
                   <Picker.Item label="اختر..." value="" enabled={false} />

                  {HoneyPollenHarvest.map((state, index) => (
                    <Picker.Item key={index} label={state} value={state} />
                  ))}
                </Picker>
              </View>



            </View>



            {/* Actions Taken */}
            <ScrollView>
              <View style={styles.fieldset}>
                <Text style={styles.fieldsetTitle}>الأنشطة</Text>
                <View style={styles.frameContainer}>
                  <View style={styles.frame}>
                    <Text style={styles.frameTitle}>الاضافات</Text>
                    <View style={styles.optionsContainer}>
                      {options.map((option) => renderOption(option, selectedAjouts, handleAjoutsChange))}
                    </View>
                  </View>
                  <View style={styles.frame}>
                    <Text style={styles.frameTitle}>الإزالات</Text>
                    <View style={styles.optionsContainer}>
                      {options.map((option) => renderOption(option, selectedEnlevements, handleEnlevementsChange))}
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>


            {/* Weather Details  */}
            <View>
              <View style={styles.inline}>
                <Text style={styles.label}>شمل الطقس</Text>
                <Switch
                  trackColor={{ false: "#767577", true: "#B8E986" }}
                  thumbColor={showWeatherDetails ? "#B8E986" : "#B8E986"}
                  value={showWeatherDetails}
                  onValueChange={(value) => setShowWeatherDetails(value)}
                />
              </View>

              {showWeatherDetails && (
                <View style={styles.fieldset}>
                  <Text style={styles.fieldsetTitle}>الطقس</Text>

                  <View style={[styles.detailItem, styles.inline]}>
                    <Text style={styles.label}>حالة الطقس </Text>
                    <TextInput
                      style={[styles.textInput, styles.inlineInput]}
                      value={formData.condition}
                      editable={false}
                    />
                  </View>

                  <View style={[styles.detailItem, styles.inline]}>
                    <Text style={styles.label}>درجة الحرارة (°C) </Text>
                    <TextInput
                      style={[styles.textInput, styles.inlineInput]}
                      keyboardType="numeric"
                      value={formData.temperature}
                      editable={false}
                    />
                  </View>

                  <View style={[styles.detailItem, styles.inline]}>
                    <Text style={styles.label}>الرطوبة (%) </Text>
                    <TextInput
                      style={[styles.textInput, styles.inlineInput]}
                      keyboardType="numeric"
                      value={formData.humidity}
                      editable={false}
                    />
                  </View>

                  <View style={[styles.detailItem, styles.inline]}>
                    <Text style={styles.label}>الضغط (hPa) </Text>
                    <TextInput
                      style={[styles.textInput, styles.inlineInput]}
                      keyboardType="numeric"
                      value={formData.pressure}
                      editable={false}
                    />
                  </View>

                  <View style={[styles.detailItem, styles.inline]}>
                    <Text style={styles.label}>سرعة الرياح (كم/ساعة) </Text>
                    <TextInput
                      style={[styles.textInput, styles.inlineInput]}
                      keyboardType="numeric"
                      value={formData.windSpeed}
                      editable={false}
                    />
                  </View>

                  <View style={[styles.detailItem, styles.inline]}>
                    <Text style={styles.label}>اتجاه الرياح </Text>
                    <TextInput
                      style={[styles.textInput, styles.inlineInput]}
                      value={formData.windDirection}
                      editable={false}
                    />
                  </View>

                

                </View>
              )}
            </View>


            {/* Note Details  */}
            <Text style={styles.fieldsetTitle}>ملاحظة</Text>
            <View style={[styles.detailItem, styles.inline]}>
              <TextInput
                style={[styles.textInput, styles.inlineInput, styles.textArea]}
                multiline={true}
                numberOfLines={5}
                onChangeText={(value) => handleInputChange('InspectionNote', value)}
                value={formData.InspectionNote}
              />
            </View>


            <TouchableOpacity style={styles.addButton} onPress={handleAddInspection}>
              <Text style={styles.addButtonText}>إضافة</Text>
            </TouchableOpacity>



          </View>
        </ScrollView>
      )}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FBF5E0',
    padding: 20,
    borderRadius: 30,
    marginBottom: 50
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: '#977700',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 20,
  },

  inputIcon: {
    padding: 10,
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
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  inlineInput: {
    flex: 1,
    marginLeft: 15,
  },
  disabledTextInput: {
    backgroundColor: '#f0f0f0',
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

  picker: {
    flex: 2
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
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
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },


});


export default AddInspectionScreen;

