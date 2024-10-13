import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, Alert, FlatList, ScrollView } from 'react-native';
import { Card } from 'react-native-paper';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import axios from '../../axiosConfig';
import HomeHeader from '../../Components/HomeHeader';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from "lottie-react-native";
import AddApiaryModal from './AddApiaryModal';

export default function ApiaryHistoryScreen({ navigation }) {
    const [apiaries, setApiaries] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [name, setName] = useState('');
    const [selectedForage, setSelectedForage] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [selectedSunExposure, setSelectedSunExposure] = useState('');
    const [location, setLocation] = useState({
        latitude: 0,
        longitude: 0,
        city: '',
        governorate: ''
    });
    const isFocused = useIsFocused();
    const [isLoading, setIsLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    const lastItemIndex = apiaries.length - 1;


    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const currentUserString = await AsyncStorage.getItem('currentUser');
                if (currentUserString) {
                    const user = JSON.parse(currentUserString);
                    setCurrentUser(user);

                }
            } catch (error) {
                console.error('Error retrieving current user:', error);
            }
        };

        fetchCurrentUser();

    }, []);


 
        const fetchData = async () => {
            if (!currentUser) {
                return;
            }
            try {
                const apiariesResponse = await axios.get('/apiary/getAllApiaries');
                const userApiaries = apiariesResponse.data.data.filter(apiary => apiary.Owner._id === currentUser._id);
                setApiaries(userApiaries);
             } catch (error) {
                console.error('Error fetching apiary data:', error);
            } finally {
                setIsLoading(false);
            }
        };
    
        useEffect(() => {
            if (currentUser) {
              fetchData();
            }
          }, [currentUser, isFocused]);

    



    const handleFormSubmit = async () => {
        if (!name || !selectedForage || !selectedType || !selectedSunExposure || !location.city || !location.governorate || !location.latitude || !location.longitude) {
            return Alert.alert('خطأ', 'يرجى ملء جميع الحقول');
        }
        try {
            const formData = {
                Name: name,
                Forages: selectedForage,
                Type: selectedType,
                SunExposure: selectedSunExposure,
                Location: {
                    latitude: location.latitude,
                    longitude: location.longitude,
                    city: location.city,
                    governorate: location.governorate,
                },
                Owner: currentUser._id,
            };
    
            const response = await axios.post('/apiary/create', formData);
            Alert.alert('نجاح', 'تمت إضافة المنحل بنجاح');
            
            resetForm();
            setShowModal(false);
    
            fetchData();
        } catch (error) {
            console.error('Error creating apiary entry:', error);
            Alert.alert('خطأ', 'خطأ في إضافة المنحل');
        }
    };
    
    const resetForm = () => {
        setName('');
        setSelectedForage('');
        setSelectedType('');
        setSelectedSunExposure('');
        setLocation({ latitude: 0, longitude: 0, city: '', governorate: '' });
    };
    


    const renderApiaryItem = ({ item, index }) => (
        <TouchableOpacity
            style={styles.tableRow}
            onPress={() => navigation.navigate('ApiaryDetailsScreen', {
                apiaryData: item, badge: index === lastItemIndex ? true : false,


            })}
        >
            
            <Text style={styles.tableCell}>{item.SunExposure}{'\n'}{index === lastItemIndex && (
                <View style={styles.badge}>
                    <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold', textAlign: 'right' }}>آخر منحل</Text>
                </View>
            )}
            
            </Text>
          
            <Text style={styles.tableCell}>{item.Type}</Text>
            <Text style={styles.tableCell}>{item.Name}</Text>
        </TouchableOpacity>
    );



    return (
        <SafeAreaView style={styles.safeArea}>
            <HomeHeader navigation={navigation} title={'المنحل'} />
            <ScrollView horizontal={true}>
                <Card style={styles.card}>

                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => setShowModal(true)}
                    >
                        <FontAwesome5Icon name="plus-circle" size={35} color="#FEE502" />
                    </TouchableOpacity>


                    <ScrollView horizontal={true}>
                        <View style={styles.table}>
                            <View style={styles.tableHeader}>
                                <Text style={styles.tableHeaderText}>التعرض للشمس</Text>
                                <Text style={styles.tableHeaderText}>النوع</Text>
                                <Text style={styles.tableHeaderText}>المنحل</Text>

                            </View>
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
                                <FlatList
                                    data={apiaries}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={renderApiaryItem}
                                    ListEmptyComponent={
                                        <View style={styles.tableRow}>
                                            <Text style={styles.noDataCell}>
                                                لا يوجد منحل حتى الآن.
                                            </Text>
                                        </View>
                                    }
                                />
                            )}

                        </View>
                    </ScrollView>
                </Card>


                {showModal && (
                    <AddApiaryModal
                        name={name}
                        setName={setName}
                        selectedForage={selectedForage}
                        setSelectedForage={setSelectedForage}
                        selectedType={selectedType}
                        setSelectedType={setSelectedType}
                        selectedSunExposure={selectedSunExposure}
                        setSelectedSunExposure={setSelectedSunExposure}
                        location={location}
                        setLocation={setLocation}
                        handleFormSubmit={handleFormSubmit}
                        closeModal={() => setShowModal(false)}


                    />
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FBF5E0',
    },
    card: {
        padding: 13,
        borderRadius: 10,
        elevation: 3,
        backgroundColor: '#FFFFFF',
        marginVertical: 16,
        marginHorizontal: 15,
    },
    addButton: {
        alignSelf: 'flex-end',

        marginBottom: 10,
    },
    table: {
        flex: 1,
        minWidth: '80%',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    tableHeader: {
        flexDirection: 'row',
        flexGrow: 1,
        backgroundColor: '#f5f5f5',
        borderBottomWidth: 1,
        borderColor: '#ddd',
    },
    tableHeaderText: {
        padding: 8,
        fontSize: 16,
        fontWeight: 'bold',
        width: 100,
        textAlign: 'center',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        backgroundColor: '#fff',
        borderBottomColor: '#ccc',
        minHeight: 60,
    },
    tableCell: {
        padding: 12,
        width: 80,
        flex: 1,
        textAlign: 'center',

        fontSize: 14,
    },
    noDataCell: {
        flex: 1,
        padding: 10,
        textAlign: 'center',
    },
    badge: {
        backgroundColor: "#2EB922",
        borderRadius: 10,
        paddingHorizontal: 6,
        paddingVertical: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        padding: 16,
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});
