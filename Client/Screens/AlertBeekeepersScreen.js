import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, ScrollView, View, Text } from 'react-native';
import HomeHeader from '../Components/HomeHeader';
import axios from '../axiosConfig';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import LottieView from "lottie-react-native";
import { Picker } from '@react-native-picker/picker';

export default function AlertBeekeepersScreen({ navigation }) {
    const [inspections, setInspections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedGovernorate, setSelectedGovernorate] = useState(''); // State for selected governorate
    const [governorates, setGovernorates] = useState([
        "Ariana",
        "Béja",
        "Ben Arous",
        "Bizerte",
        "Gabès",
        "Gafsa",
        "Jendouba",
        "Kairouan",
        "Kasserine",
        "Kébili",
        "Gouvernorat du Kef",
        "Mahdia",
        "la Manouba",
        "Médenine",
        "Monastir",
        "Nabeul",
        "Sfax",
        "Sidi Bouzid",
        "Siliana",
        "Sousse",
        "Tataouine",
        "Tozeur",
        "Tunis",
        "Zaghouan"
    ]);
    

    useEffect(() => {
        const fetchInspectionsWithDiseases = async () => {
            try {
                const response = await axios.get('/inspection/getInspectionsWithDiseases');
                if (response.data.success) {
                    setInspections(response.data.data);
                } else {
                    console.log('Aucune présence de maladies détectée dans aucune région.');
                }
            } catch (error) {
               // console.error('Erreur lors de la récupération des inspections :', error);
             } finally {
                setLoading(false);
            }
        };

        fetchInspectionsWithDiseases();
    }, []);

    const filteredInspections = selectedGovernorate
        ? inspections.filter(inspection => inspection.Hive.Apiary.Location.governorate === selectedGovernorate)
        : inspections;

    if (loading) {
        return (
            <View style={[styles.safeArea, styles.loader]}>
                <LottieView
                    source={require('../assets/lottie/loading.json')}  
                    autoPlay
                    loop
                    style={{ width: 100, height: 100 }}
                />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <HomeHeader navigation={navigation} title={'Présence de maladies'} />
            <Picker
                selectedValue={selectedGovernorate}
                onValueChange={(itemValue) => setSelectedGovernorate(itemValue)}
                style={styles.picker}
            >
                <Picker.Item label="Tous les gouvernorats" value="" />
                {governorates.map((gouvernorate, index) => (
                    <Picker.Item key={index} label={gouvernorate} value={gouvernorate} />
                ))}
            </Picker>
            <ScrollView contentContainerStyle={styles.container}>
                {filteredInspections.length > 0 ? (
                    filteredInspections.map((inspection, index) => (
                        <Card key={index} style={styles.card}>
                            <Card.Content>
                                <MaterialCommunityIcons
                                    name="pulse"
                                    size={40} 
                                    color="#000000"
                                    style={styles.icon}
                                /> 
                                <Title style={styles.title}>{inspection.Hive.Name}</Title>
                                <Paragraph style={styles.subtitle}>Présence de maladies</Paragraph>
                                <Paragraph>Rucher: <Text style={styles.boldText}>{`${inspection.Hive.Apiary.Name}`}</Text></Paragraph>
                                <Paragraph>Emplacement: <Text style={styles.boldText}>{`${inspection.Hive.Apiary.Location.city}, ${inspection.Hive.Apiary.Location.governorate}`}</Text></Paragraph>
                                <Paragraph style={styles.disease}>{`Maladie: ${inspection.BeeHealth.disease}`}</Paragraph>
                                <Paragraph style={styles.date}>{`Date: ${new Date(inspection.InspectionDateTime).toLocaleDateString('fr-FR')}`}</Paragraph>  
                                <Button
                                    mode="contained"
                                    style={styles.button}
                                    onPress={() => {
                                        navigation.navigate('DetailsScreen', { inspection });
                                    }}
                                >
                                    Alerter les apiculteurs
                                </Button>
                            </Card.Content>
                        </Card>
                    ))
                ) : (
                    <Text style={styles.error}>Aucune présence de maladies détectée dans aucune région.</Text>
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
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        padding: 16,
    },
    picker: {
        height: 50,
        width: '100%',
        marginBottom: 16,
    },
    card: {
        marginBottom: 10,
        borderRadius: 12,
        padding: 15,
        backgroundColor: 'rgba(255, 205, 210, 0.9)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.7,
        shadowRadius: 8,
        elevation: 5,
    },
    title: {
        fontWeight: 'bold',
        color: '#D50000',
        fontSize: 22,
        textTransform: 'uppercase',
    },
    subtitle: {
        fontStyle: 'italic',
        color: '#D50000',
        marginBottom: 5,
        fontSize: 16,
    },
    disease: {
        fontWeight: 'bold',
        color: '#D50000',
        fontSize: 18,
        marginBottom: 10,
    },
    date: {
        fontStyle: 'italic',
        color: '#D50000',
        marginBottom: 10,
        fontSize: 16,
    },
    icon: {
        marginBottom: 10,
    },
    button: {
        marginTop: 10,
        backgroundColor: '#D50000',
        borderRadius: 20,
    },
    error: {
        color: '#D50000',
        textAlign: 'center',
        margin: 20,
        fontSize: 18,
    },
    boldText: {
        fontWeight: 'bold',
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});
