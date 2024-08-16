import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, ScrollView, View, Text } from 'react-native';
import HomeHeader from '../Components/HomeHeader';
import axios from '../axiosConfig';
import { Card, Title, Paragraph } from 'react-native-paper';
import LottieView from "lottie-react-native";
import { Picker } from '@react-native-picker/picker';
import { HarvestProducts } from './Data';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function HomeNiveauStratScreen({ navigation }) {
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [topRegions, setTopRegions] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
    
        if (selectedProduct) {
            fetchTopRegions(selectedProduct);
        } else {
            setTopRegions([]);
            setLoading(false);

        }
    }, [selectedProduct]);

    const fetchTopRegions = async (product) => {
        try {
            setLoading(true);
            const response = await axios.get(`/harvest/TopRegionsHarvests`, {
                params: { product }
            });
            setTopRegions(response.data.data);
            setErrorMessage('');
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setErrorMessage('Aucune région trouvée pour ce produit.');
            } else {
                setErrorMessage('Erreur lors de la récupération des données.');
            }
        } finally {
            setLoading(false);
        }
    };

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
            <HomeHeader navigation={navigation} title={'Accueil'} />
            <Text style={styles.title}>Top régions avec les plus récoltes:</Text>

            <View style={styles.pickerContainer}>
                <Text style={styles.pickerTitle}>Récolte:</Text>
                <Picker
                    selectedValue={selectedProduct}
                    style={styles.pickerSelect}
                    onValueChange={(itemValue) => setSelectedProduct(itemValue)}
                >
                    <Picker.Item label="Sélectionner..." value="" enabled={false} />
                    {HarvestProducts.map((product) => (
                        <Picker.Item label={product} value={product} key={product} />
                    ))}
                </Picker>
            </View>
            {errorMessage ? (
                <Text style={styles.error}>{errorMessage}</Text>
            ) : (
                <ScrollView contentContainerStyle={styles.container}>

                    {topRegions.map((region, index) => (
                        <Card key={`${region._id}-${index}`} style={styles.card}>
                            <Card.Content>
                                <Title style={styles.titleContainer}>
                                    <View style={styles.titleWithIcon}>
                                        <Title style={styles.titleContainer}>
                                            {region.governorate}
                                        </Title>
                                        {index === 0 && (
                                            <MaterialCommunityIcons
                                                name="chart-timeline-variant-shimmer"
                                                size={27}
                                                color='#FEE502'
                                                style={styles.icon}
                                            />
                                        )}
                                    </View>
                                </Title>

                                {Object.entries(region.quantitiesByUnit).map(([unit, totalQuantity]) => (
                                    <Paragraph key={`${region._id}-${unit}`}>{`${totalQuantity} ${unit}`}</Paragraph>
                                ))}
                            </Card.Content>
                        </Card>
                    ))}
                </ScrollView>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FBF5E0',
    },
    container: {
        padding: 12,

    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    pickerContainer: {
        marginTop: 15,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    pickerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 10,
    },
    pickerSelect: {
        flex: 1,
        backgroundColor: '#FEE502',
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        color: '#977700',
        textAlign: 'center',
        margin: 20,

    },
    card: {
        marginBottom: 12,
        borderRadius: 10,
        padding: 12,
    },
    error: {
        color: '#000000',
        textAlign: 'center',
        margin: 20,
        fontSize: 16,
    },
    titleWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginLeft: 10,
    },

});
