import React, { useState, useEffect } from 'react';
import { Modal, StyleSheet, View, Text, TouchableOpacity, TextInput, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Card } from 'react-native-paper';
import { Apiarytypes, sunExposures } from '../Data';
import { GovDeleg } from './GovDeleg';
import axios from '../../axiosConfig';
import MapView, { Marker } from 'react-native-maps';
import { FontAwesome5 } from '@expo/vector-icons';

import { useIsFocused } from '@react-navigation/native';

const EditApiaryModal = ({ visible, onSave, onCancel, formData, onInputChange }) => {



    const [forages, setForages] = useState([]);
    const [mapVisible, setMapVisible] = useState(false);
    const [location, setLocation] = useState({
        latitude: formData.Location.latitude || '',
        longitude: formData.Location.longitude || '',
        governorate: formData.Location.governorate || '',
        city: formData.Location.city || ''
    });
    const isFocused = useIsFocused();

    function getCitiesByGovernorate(data) {
        const citiesByGovernorate = {};
        data.forEach(entry => {
            const { Gov, Deleg } = entry;
            if (!citiesByGovernorate[Gov]) {
                citiesByGovernorate[Gov] = [Deleg];
            } else {
                if (!citiesByGovernorate[Gov].includes(Deleg)) {
                    citiesByGovernorate[Gov].push(Deleg);
                }
            }
        });
        return citiesByGovernorate;
    }

    const citiesByGovernorate = getCitiesByGovernorate(GovDeleg);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/forage/getAllForages');
                setForages(response.data.data);
            } catch (error) {
                console.error('Error fetching forage data:', error);
                setForages([]);
            }
        };
        fetchData();
    }, [isFocused]);

    const openMapModal = () => {
        setMapVisible(true);
    };

    const closeMapModal = () => {
        setMapVisible(false);
    };

    const handleLocationSelect = (event) => {
        const { latitude, longitude } = event.nativeEvent.coordinate;
        const updatedLocation = { ...location, latitude, longitude };
        setLocation(updatedLocation);   
        onInputChange('Location', updatedLocation);    
    };
    

    const handleSave = async () => {
        if (!formData.Name || !formData.Forages || !formData.Type || !formData.SunExposure || !formData.Location.governorate || !formData.Location.city || !formData.Location.latitude || !formData.Location.longitude) {
            return Alert.alert('خطأ', 'يرجى ملء جميع الحقول');
        }

        try {
            const response = await axios.post('/apiary/editApiary', formData);

            if (response.status === 200) {
                showAlert('تعديل المنحل ناجح', 'تم تعديل المنحل بنجاح');
                onSave();
            } else {
                console.error('Failed to update apiary data. Unexpected response:', response);
            }
        } catch (error) {
            console.error('Failed to update apiary data. Error:', error.message);
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
                        <ScrollView contentContainerStyle={styles.scrollViewContent}>
                            <Text style={styles.modalTitle}>تعديل المنحل</Text>

                            <Text style={styles.label}>اسم المنحل</Text>
                            <TextInput
                                style={styles.textInput}
                                value={formData.Name}
                                onChangeText={(text) => onInputChange('Name', text)}
                            />


                            <Text style={styles.label}>العلف</Text>
                            <View style={styles.inputContainer}>

                                <Picker
                                    selectedValue={formData.Forages}
                                    onValueChange={(itemValue) => onInputChange('Forages', itemValue)}
                                    style={styles.picker}
                                >
                                    <Picker.Item label="اختر..." value="" enabled={false} />
                                    {forages.map((forage) => (
                                        <Picker.Item label={forage.Name} value={forage.Name} key={forage.Name} />
                                    ))}
                                </Picker>
                            </View>


                            <Text style={styles.label}>النوع</Text>
                            <View style={styles.inputContainer}>

                                <Picker
                                    selectedValue={formData.Type}
                                    onValueChange={(itemValue) => onInputChange('Type', itemValue)}
                                    style={styles.picker}
                                >
                                    <Picker.Item label="اختر..." value="" enabled={false} />
                                    {Apiarytypes.map((type) => (
                                        <Picker.Item label={type} value={type} key={type} />
                                    ))}
                                </Picker>
                            </View>


                            <Text style={styles.label}>التعرض للشمس</Text>
                            <View style={styles.inputContainer}>

                                <Picker
                                    selectedValue={formData.SunExposure}
                                    onValueChange={(itemValue) => onInputChange('SunExposure', itemValue)}
                                    style={styles.picker}
                                >
                                    <Picker.Item label="اختر..." value="" enabled={false} />
                                    {sunExposures.map((sunExposure) => (
                                        <Picker.Item label={sunExposure} value={sunExposure} key={sunExposure} />
                                    ))}
                                </Picker>
                            </View>

                            <View style={{ flex: 1 , padding: 40 }}>
                                <TouchableOpacity onPress={openMapModal}>
                               
                                
                                  <Text style={{textDecorationLine:'underline'}}> انقر هنا لتحديد إحداثيات الخريطة <FontAwesome5 name="map-pin" size={18} color="#EE4B2B" /></Text>

                                </TouchableOpacity>
                            </View>


                            <Text style={styles.label}>خط العرض</Text>
                            <TextInput
                                value={String(location.latitude)}
                                onChangeText={(text) => {
                                    const latitude = parseFloat(text);
                                    setLocation({ ...location, latitude });
                                    onInputChange('Location', { ...location, latitude });  
                                }}
                                editable={false}
                                style={[styles.textInput, { backgroundColor: '#f0f0f0' }]}
                                keyboardType="numeric"
                                returnKeyType="done"
                            />

                            <Text style={styles.label}>خط الطول</Text>
                            <TextInput
                                value={String(location.longitude)}
                                onChangeText={(text) => {
                                    const longitude = parseFloat(text);
                                    setLocation({ ...location, longitude });
                                    onInputChange('Location', { ...location, longitude });  
                                }}
                                editable={false}
                                style={[styles.textInput, { backgroundColor: '#f0f0f0' }]}
                                keyboardType="numeric"
                                returnKeyType="done"
                            />

                            <Text style={styles.label}>الموقع (الولاية)</Text>
                            <View style={styles.inputContainer}>
                                <Picker
                                    selectedValue={location.governorate}
                                    onValueChange={(gov) => {
                                        setLocation(prev => ({ ...prev, governorate: gov, city: '' }));
                                        onInputChange('Location', { ...location, governorate: gov, city: '' });  
                                    }}
                                    style={styles.picker}
                                >
                                    <Picker.Item label="اختر الولاية..." value="" enabled={false} />
                                    {Object.keys(citiesByGovernorate).map((gov) => (
                                        <Picker.Item label={gov} value={gov} key={gov} />
                                    ))}
                                </Picker>
                            </View>

                            <Text style={styles.label}>الموقع (المعتمدية)</Text>
                            <View style={styles.inputContainer}>
                                <Picker
                                    selectedValue={location.city}
                                    onValueChange={(city) => {
                                        setLocation(prev => ({ ...prev, city }));
                                        onInputChange('Location', { ...location, city }); 
                                    }}
                                    style={styles.picker}
                                    enabled={!!location.governorate}
                                >
                                    <Picker.Item label="اختر المدينة..." value="" enabled={false} />
                                    {(citiesByGovernorate[location.governorate] || []).map((city) => (
                                        <Picker.Item label={city} value={city} key={city} />
                                    ))}
                                </Picker>
                            </View>


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

              

                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={mapVisible}
                        onRequestClose={closeMapModal}
                    >
                        <View style={styles.mapModalView}>
                            {location && typeof location.latitude === 'number' && typeof location.longitude === 'number' ? (
                                <MapView
                                    style={styles.map}
                                    initialRegion={{
                                        latitude: location.latitude || 36.8065,
                                        longitude: location.longitude || 10.1815,
                                        latitudeDelta: 0.0922,
                                        longitudeDelta: 0.0421,
                                    }}
                                    onPress={handleLocationSelect}
                                >
                                    <Marker
                                        coordinate={location}
                                        draggable
                                        onDragEnd={handleLocationSelect}
                                    
                                    />
                                </MapView>
                            ) : (
                                <Text>جاري تحميل الخريطة...</Text>
                            )}


                            <TouchableOpacity style={styles.closeMapModalButton} onPress={() => setMapVisible(false)}>
                                <Text style={styles.buttonText}>إغلاق الخريطة</Text>
                            </TouchableOpacity>
                        </View>

                    </Modal>
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
    textInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        width: '100%',
        textAlign: 'right'
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
    keyboardAvoidingContainer: {
        flex: 1,
    },
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'flex-start',
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 15,
    },
    tabButton: {
        flex: 1,
        paddingVertical: 10,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
        alignItems: 'center',
    },
    activeTab: {
        borderBottomColor: '#FEE502',
    },
    tabText: {
        fontSize: 16,
        color: '#333333',
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

    mapModalView: {
        flex: 1,
        justifyContent: 'flex-end',
        margin: 0,
    },
    map: {
        width: '100%',
        height: '100%',
    },
    closeMapModalButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        padding: 10,
        backgroundColor: '#FEE502',
        borderRadius: 5,
        elevation: 2,
    },
});

export default EditApiaryModal;
