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
    const [selectedGovernorate, setSelectedGovernorate] = useState('');
    const [governorates, setGovernorates] = useState([
        "Ariana", "Beja", "Ben Arous", "Bizerte", "Gabes", "Gafsa", "Jendouba", "Kairouan",
        "Kasserine", "Kebili", "Kef", "Mahdia", "Mannouba", "Medenine",
        "Monastir", "Nabeul", "Sfax", "Sidi Bouzid", "Siliana", "Sousse", "Tataouine",
        "Tozeur", "Tunis", "Zaghouan"
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
                console.error('Erreur lors de la récupération des inspections :', error);
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

            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={selectedGovernorate}
                    onValueChange={(itemValue) => setSelectedGovernorate(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Toutes les régions" value="" />
                    {governorates.map((gouvernorate, index) => (
                        <Picker.Item key={index} label={gouvernorate} value={gouvernorate} />
                    ))}
                </Picker>
            </View>
            <ScrollView contentContainerStyle={styles.container}>
                {filteredInspections.length > 0 ? (
                    filteredInspections.map((inspection, index) => (
                        <Card key={index} style={styles.card}>
                            <Card.Content>
                                <MaterialCommunityIcons
                                    name="pulse"
                                    size={30}
                                    color="#000"
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
                                        console.log('Button pressed: Alerter les apiculteurs');
                                    }}
                                >
                                    Alerter les apiculteurs
                                </Button>

                            </Card.Content>
                        </Card>
                    ))
                ) : (
                    <Text style={styles.error}>Aucune maladie détectée.</Text>
                )}
            </ScrollView>
        </SafeAreaView >
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
    pickerContainer: {
        marginHorizontal: 16,
        marginVertical: 12,
    },
    picker: {
        backgroundColor: '#FEE502',
        borderRadius: 8,
    },
    card: {
        marginBottom: 12,
        borderRadius: 10,
        padding: 12,
        backgroundColor: '#FFCDD2',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 3,
    },
    title: {
        fontWeight: 'bold',
        color: '#D50000',
        fontSize: 18,
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    subtitle: {
        fontStyle: 'italic',
        color: '#D50000',
        marginBottom: 8,
        fontSize: 14,
    },
    disease: {
        fontWeight: 'bold',
        color: '#D50000',
        fontSize: 16,
        marginBottom: 8,
    },
    date: {
        fontStyle: 'italic',
        color: '#D50000',
        marginBottom: 8,
        fontSize: 14,
    },
    icon: {
        marginBottom: 10,
    },
    button: {
        marginTop: 12,
        backgroundColor: '#D50000',
        borderRadius: 20,
    },
    error: {
        color: '#000000',
        textAlign: 'center',
        margin: 20,
        fontSize: 16,
    },
    boldText: {
        fontWeight: 'bold',
    },
});