import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from '../../axiosConfig';
import MapView, { Marker } from 'react-native-maps';
import EditApiaryModal from './EditApiaryModal';

const ApiaryDetailsScreen = ({ route, navigation }) => {
    const { apiaryData, badge } = route.params;
    const [modalVisible, setModalVisible] = useState(false);


    const [formData, setFormData] = useState({ ...apiaryData });

     const [mapRegion, setMapRegion] = useState({
        latitude: formData.Location.latitude || 36.8065,
        longitude: formData.Location.longitude || 10.1815,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    });

    useEffect(() => {
        setFormData({ ...apiaryData });
    }, [apiaryData]);


    // Effect to update the map region when coordinates change
    useEffect(() => {
        if (formData.Location.latitude && formData.Location.longitude) {
            setMapRegion({
                latitude: formData.Location.latitude,
                longitude: formData.Location.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            });
        }
    }, [formData.Location.latitude, formData.Location.longitude]);



    const handleModalInputChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };


    const handleDelete = async (apiaryId) => {
        try {
            const response = await axios.delete(`/apiary/deleteApiary/${apiaryId}`);
            console.log(apiaryId);
            if (response.status === 200) {
                console.log('Apiary deleted successfully');
                showAlertAndNavigate('تم حذف المنحل بنجاح');
            } else {
                console.error('Failed to delete apiary:', response.data.message);
                showAlert('فشل حذف المنحل');
            }
        } catch (error) {
            console.error('Error deleting apiary:', error.message);
            showAlert('خطأ أثناء حذف المنحل');
        }
    };

    const showAlertAndNavigate = (message) => {
        Alert.alert(
            'نجاح',
            message,
            [{ text: 'موافق', onPress: () => navigation.goBack() }],
            { cancelable: false }
        );
    };

    const showAlert = (message) => {
        Alert.alert('خطأ', message, [{ text: 'موافق' }], { cancelable: false });
    };

    const confirmDelete = (apiaryId) => {
        Alert.alert(
            'تأكيد',
            'هل أنت متأكد أنك تريد حذف هذا المنحل؟',
            [
                { text: 'إلغاء', style: 'cancel' },
                {
                    text: 'حذف',
                    onPress: () => handleDelete(apiaryId),
                    style: 'destructive',
                },
            ],
            { cancelable: true }
        );
    };

    const renderBadge = () => {
        if (badge) {
            return (
                <View style={styles.badge}>
                    <Text style={{ color: 'white', fontSize: 12 }}>آخر منحل</Text>
                </View>
            );
        }
        return null;
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.card}>


                <View style={styles.badgeContainer}>
                    {renderBadge()}
                </View>


                <View style={styles.iconsContainer}>
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => confirmDelete(apiaryData._id)}>
                        <Ionicons name="trash-outline" size={30} color="#FF0000" style={styles.icon} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => setModalVisible(true)}>
                        <Ionicons name="create-outline" size={30} color="orange" style={styles.icon} />
                    </TouchableOpacity>
                </View>




                <View style={styles.row}>

                    <Text style={styles.valueLine}>{formData.Name}</Text>
                    <View style={styles.labelContainer}>
                        <Text style={styles.label}>اسم المنحل</Text>
                        <Ionicons name='trail-sign-outline' size={14} color="#977700" />
                    </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.row}>

                    <Text style={styles.valueLine}>{formData.Forages}</Text>
                    <View style={styles.labelContainer}>
                        <Text style={styles.label}>العلف</Text>
                        <Ionicons name="leaf-outline" size={14} color="green" />
                    </View>
                </View>


                <View style={styles.divider} />


                <View style={styles.row}>

                    <Text style={styles.value}>{formData.Type}</Text>
                    <View style={styles.labelContainer}>
                        <Text style={styles.label}>النوع</Text>
                        <Ionicons name="grid-outline" size={14} color="orange" />
                    </View>
                </View>
                <View style={styles.divider} />

                <View style={styles.row}>
                    <Text style={styles.value}>{formData.SunExposure}</Text>
                    <View style={styles.labelContainer}>
                        <Text style={styles.label}>التعرض للشمس</Text>
                        <Ionicons name="cloudy-night-outline" size={14} color="gray" />
                    </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.row}>
                    <Text style={styles.value}>{formData.Location.governorate}</Text>
                    <View style={styles.labelContainer}>
                        <Text style={styles.label}>الموقع (الولاية)</Text>
                        <Ionicons name="pin-outline" size={14} color="red" />
                    </View>
                </View>


                <View style={styles.row}>
                    <Text style={styles.value}>{formData.Location.city}</Text>
                    <View style={styles.labelContainer}>
                        <Text style={styles.label}>الموقع (المعتمدية)</Text>
                        <Ionicons name="pin-outline" size={14} color="red" />
                    </View>
                </View>
                <View style={styles.mapContainer}>
                    <MapView
                        style={styles.map}
                        region={mapRegion}
                    >
                        {formData.Location.latitude && formData.Location.longitude && (
                            <Marker
                                coordinate={{
                                    latitude: formData.Location.latitude,
                                    longitude: formData.Location.longitude,
                                }}
                                title={formData.Name}
                                description={formData.Location.city}
                            />
                        )}


                    </MapView>
                </View>



            </View>


            <EditApiaryModal
                visible={modalVisible}
                onSave={() => {
                    setModalVisible(false);
                }}
                onCancel={() => setModalVisible(false)}
                formData={formData}
                onInputChange={handleModalInputChange}

            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#FBF5E0',
        marginTop: 10,
        padding: 4,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 10,
        margin: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,

    },

    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        flexWrap: 'wrap',
        alignItems: 'center',
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 5,
    },
    value: {
        fontSize: 15,
        maxWidth: '100%',
    },


    section: {
        marginBottom: 20,
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
    },
    highlight: {
        color: '#977700',
    },
    divider: {
        borderBottomColor: '#cccccc',
        borderBottomWidth: 1,
        marginVertical: 10,
    },


    icon: {
        marginRight: 5,
    },

    editButton: {
        alignSelf: 'flex-end',
        alignItems: 'center',
        alignSelf: 'flex-end',
        marginTop: 20,
        marginBottom: 20,
    },
    editButtonText: {
        fontSize: 18,
        color: 'blue',
        marginLeft: 5,
    },

    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },

    badgeContainer: {
        position: 'relative',
    },
    iconsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 'auto',
    },

    badge: {
        position: 'absolute',
        top: 10,
        backgroundColor: "#2EB922",
        paddingHorizontal: 6,
        paddingVertical: 4,
        borderRadius: 10,
        zIndex: 1,
    },

    mapContainer: {
        height: 300,
        marginTop: 20,
    },
    map: {
        flex: 1,
        height: '100%',
    },

});


export default ApiaryDetailsScreen;