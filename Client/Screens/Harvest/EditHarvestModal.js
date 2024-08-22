import React, { useState, useEffect } from 'react';
import { Modal, StyleSheet, View, Text, TouchableOpacity, TextInput, ScrollView, Alert, KeyboardAvoidingView, Platform, } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { HarvestMethods, HarvestSeasons, HarvestProducts, units } from '../Data';
import axios from '../../axiosConfig';

const EditHarvestModal = ({ visible, onSave, onCancel, formData, onInputChange, apiaries, hives
}) => {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [filteredHives, setFilteredHives] = useState([]);


  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios'); // On iOS, showDatePicker remains true
    setDate(currentDate);
    onInputChange('Date', currentDate);  
  };

  useEffect(() => {
     setDate(new Date(formData.Date));

     
    if (formData.Apiary) {
      const filteredHives = hives.filter(hive => hive.Apiary.Name.toString() === formData.Apiary.toString());
      setFilteredHives(filteredHives);
    } else {
      setFilteredHives([]);
    }
  }, [formData, hives]);

  const handleSave = async () => {
    if (!formData.Quantity || !formData.QualityTestResults) {
      return Alert.alert('خطأ', 'يرجى ملء جميع الحقول');
    }

    try {
      const response = await axios.post('/harvest/editHarvest', formData);

      if (response.status === 200) {
        showAlert('تعديل الحصاد ناجح', 'تم تحديث الحصاد بنجاح');
        onSave();   
      } else {
        console.error('Failed to update harvest data. Unexpected response:', response);
      }
    } catch (error) {
      console.error('Failed to update harvest data. Error:', error.message);
   
    }
  };

  const showAlert = (title, message) => {
    Alert.alert(
      'نجاح',
      message,
      [{ text: 'موافق' }],
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

              <Text style={styles.modalTitle}>تعديل الحصاد</Text>

              {/* Apiary*/}
              <Text style={styles.label}>المنحل</Text>
              <View style={styles.inputContainer}>
                <Picker
                  selectedValue={formData.Apiary}
                  onValueChange={(itemValue) => onInputChange('Apiary', itemValue)}
                  style={styles.picker}
                >
                  {apiaries.map((apiary) => (
                    <Picker.Item label={apiary.Name} value={apiary.Name} key={apiary._id} />
                  ))}
                </Picker>
              </View>

              {/* Hive */}
              <Text style={styles.label}>الخلية</Text>
              <View style={styles.inputContainer}>
                <Picker
                  selectedValue={formData.Hive}
                  onValueChange={(itemValue) => onInputChange('Hive', itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="اختر..." value="" enabled={false} />

                  {filteredHives.map((hive) => (
                    <Picker.Item label={hive.Name} value={hive.Name} key={hive._id} />
                  ))}
                </Picker>

              </View>

              {/* Product */}
              <Text style={styles.label}>المنتج</Text>
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
              <Text style={styles.label}>التاريخ</Text>
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
              <Text style={styles.label}>الكمية</Text>
              <TextInput
                style={styles.input}
                value={formData.Quantity.toString()}
                onChangeText={(text) => onInputChange('Quantity', text)}
                keyboardType="numeric"
              />

              {/* Unit */}
              <Text style={styles.label}>الوحدة</Text>
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
              <Text style={styles.label}>الموسم</Text>
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
              <Text style={styles.label}>طريقة الحصاد</Text>
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
              <Text style={styles.label}>نتائج اختبار الجودة</Text>
              <TextInput
                style={styles.input}
                value={formData.QualityTestResults}
                onChangeText={(text) => onInputChange('QualityTestResults', text)}
              />

 
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onCancel}>
                  <Text style={styles.buttonText}>إلغاء</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
                  <Text style={styles.buttonText}>تعديل</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',  
    justifyContent: 'center',
    alignItems: 'center',

  },
  modalContainer: {
    width: '90%',
    maxHeight: '80%',  
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
    textAlign: 'center',  
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',

    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    textAlign:'right'
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
    width: '100%',  
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
    width: '100%',  
  },
  datePickerText: {
    color: '#333333',
  },

  keyboardAvoidingContainer: {
    flex: 1,
  },
});

export default EditHarvestModal;
