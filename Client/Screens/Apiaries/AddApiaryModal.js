import React, { useState, useEffect } from 'react';
import { Modal, StyleSheet, View, Text, TouchableOpacity, TextInput, ScrollView, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Card } from 'react-native-paper';
import { Apiarytypes, sunExposures } from '../Data';
import { GovDeleg } from './GovDeleg';
import axios from '../../axiosConfig';
import MapView, { Marker } from 'react-native-maps';
import { FontAwesome5 } from '@expo/vector-icons';

import { useIsFocused } from '@react-navigation/native';

const AddApiaryModal = ({
    name,
    setName,
    selectedForage,
    setSelectedForage,
    selectedType,
    setSelectedType,
    selectedSunExposure,
    setSelectedSunExposure,
    location,
    setLocation,
    handleFormSubmit,
    closeModal
}) => {

    const [forages, setForages] = useState([]);
    const [mapVisible, setMapVisible] = useState(false); 
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
        setLocation({ latitude, longitude });
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            statusBarTranslucent={true}
            visible={true}
            onRequestClose={() => closeModal()}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingContainer}
            >
                <View style={styles.modalView}>
                    <Card style={styles.card}>
                        <ScrollView contentContainerStyle={styles.scrollViewContent} keyboardShouldPersistTaps="handled">
                            <Text style={styles.modalTitle}>إضافة منحل</Text>


                            <Text style={styles.label}>اسم المنحل</Text>
                            <TextInput
                                value={name}
                                onChangeText={text => setName(text)}
                                style={styles.textInput}
                                onSubmitEditing={() => { }}
                                returnKeyType="done"
                            />

                            <Text style={styles.label}>العلف</Text>
                            <View style={styles.inputContainer}>
                                <Picker
                                    selectedValue={selectedForage}
                                    onValueChange={(itemValue) => setSelectedForage(itemValue)}
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
                                    selectedValue={selectedType}
                                    onValueChange={(itemValue) => setSelectedType(itemValue)}
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
                                    selectedValue={selectedSunExposure}
                                    onValueChange={(itemValue) => setSelectedSunExposure(itemValue)}
                                    style={styles.picker}
                                >
                                    <Picker.Item label="اختر..." value="" enabled={false} />
                                    {sunExposures.map((sunExposure) => (
                                        <Picker.Item label={sunExposure} value={sunExposure} key={sunExposure} />
                                    ))}
                                </Picker>
                            </View>


                            <View style={{ flex: 1 , padding: 40 }}>
                                <TouchableOpacity style={styles.button} onPress={openMapModal}>
                               
                                
                                  <Text style={{textDecorationLine:'underline'}}> انقر هنا لتحديد إحداثيات الخريطة <FontAwesome5 name="map-pin" size={18} color="#EE4B2B" /></Text>

                                </TouchableOpacity>
                            </View>

                            <Text style={styles.label}>خط العرض</Text>
                            <TextInput
                                value={String(location.latitude)}
                                onChangeText={(text) => setLocation({ ...location, latitude: parseFloat(text) })}
                                editable={false}  
                                style={[styles.textInput, { backgroundColor: '#f0f0f0' }]}
                                keyboardType="numeric"
                                returnKeyType="done"
                            />

                            <Text style={styles.label}>خط الطول</Text>
                            <TextInput
                                value={String(location.longitude)}
                                onChangeText={(text) => setLocation({ ...location, longitude: parseFloat(text) })}
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
                                        setLocation(prev => ({ ...prev, governorate: gov }));
                                        setLocation(prev => ({ ...prev, city: '' }));
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
                                    onValueChange={(city) => setLocation(prev => ({ ...prev, city }))}
                                    style={styles.picker}
                                    enabled={!!location.governorate}
                                >
                                    <Picker.Item label="اختر المدينة..." value="" enabled={false} />
                                    {(citiesByGovernorate[location.governorate] || []).map((city) => (
                                        <Picker.Item label={city} value={city} key={city} />
                                    ))}
                                </Picker>
                            </View>

                            



                        </ScrollView>

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.buttonCancel} onPress={() => closeModal()}>
                                <Text style={styles.buttonText}>إلغاء</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.buttonSubmit} onPress={() => handleFormSubmit()}>
                                <Text style={styles.buttonText}>إضافة</Text>
                            </TouchableOpacity>
                        </View>
                    </Card>


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
    modalView: {
        flex: 1,

        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
    card: {
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
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        fontWeight: 'bold',
        color: '#342D21',
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
    textInput: {
        width: '100%',
        marginBottom: 15,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
        borderColor: '#CCCCCC',
        borderWidth: 1,
        backgroundColor: '#FFFFFF',
        color: '#333333',
        textAlign: 'right'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    },

    buttonCancel: {
        backgroundColor: '#CCCCCC',
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginHorizontal: 5,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonSubmit: {
        backgroundColor: '#FEE502',
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginHorizontal: 5,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#373737',
 
    },
    datePickerContainer: {
        width: '100%',
        marginBottom: 15,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
        borderColor: '#CCCCCC',
        borderWidth: 1,
        backgroundColor: '#FBF5E0',
    },
    datePickerText: {
        color: '#333333',
    },
    keyboardAvoidingContainer: {
        flex: 1,
    },
});

export default AddApiaryModal;
