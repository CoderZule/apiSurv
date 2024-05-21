import React from 'react';
import { StyleSheet, ScrollView, View, Text, TextInput } from 'react-native';

const HiveDetailsScreen = ({ route }) => {
    const { hiveData } = route.params;

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Détails de la ruche</Text>
            <View style={styles.detailsContainer}>
                <View style={styles.detailItem}>
                    <Text style={styles.label}>Couleur</Text>
                    <Text style={styles.text}>{hiveData.Color}</Text>
                </View>
                <View style={styles.detailItem}>
                    <Text style={styles.label}>Type</Text>
                    <Text style={styles.text}>{hiveData.Type}</Text>
                </View>
                <View style={styles.detailItem}>
                    <Text style={styles.label}>Source</Text>
                    <Text style={styles.text}>{hiveData.Source}</Text>
                </View>
                <View style={styles.detailItem}>
                    <Text style={styles.label}>But</Text>
                    <Text style={styles.text}>{hiveData.Purpose}</Text>
                </View>
                <View style={styles.detailItem}>
                    <Text style={styles.label}>Date d'ajout</Text>
                    <Text style={styles.text}>{hiveData.Added}</Text>
                </View>
                <View style={styles.detailItem}>
                    <Text style={styles.label}>Note</Text>
                    <Text style={styles.text}>{hiveData.Note}</Text>
                </View>
                <View style={styles.detailItem}>
                    <Text style={styles.label}>Force de la Colonie</Text>
                    <Text style={styles.text}>{hiveData.Colony.strength}</Text>
                </View>
                <View style={styles.detailItem}>
                    <Text style={styles.label}>Tempérament de la Colonie</Text>
                    <Text style={styles.text}>{hiveData.Colony.temperament}</Text>
                </View>
                <View style={styles.detailItem}>
                    <Text style={styles.label}>Nombre de Supers</Text>
                    <Text style={styles.text}>{hiveData.Colony.supers}</Text>
                </View>
                <View style={styles.detailItem}>
                    <Text style={styles.label}>Nombre de cadres</Text>
                    <Text style={styles.text}>{hiveData.Colony.frames}</Text>
                </View>

                {hiveData.Queen && (
                    <View>

                        {hiveData.Queen.isMarked && (
                            <View style={styles.detailItem}>
                                 <Text style={styles.text}>Reine Marquée</Text>
                            </View>
                        )}
                        {hiveData.Queen.color !== "" && (
                            <View style={styles.detailItem}>
                                <Text style={styles.label}>Couleur de la reine</Text>
                                <Text style={styles.text}>{hiveData.Queen.color}</Text>
                            </View>
                        )}

                        <View style={styles.detailItem}>
                            <Text style={styles.label}>Éclos</Text>
                            <Text style={styles.text}>{hiveData.Queen.hatched}</Text>
                        </View>


                        <View style={styles.detailItem}>
                            <Text style={styles.label}>Statut de la Reine</Text>
                            <Text style={styles.text}>{hiveData.Queen.status}</Text>
                        </View>


                        <View style={styles.detailItem}>
                            <Text style={styles.label}>Date d'installation</Text>
                            <Text style={styles.text}>{hiveData.Queen.installed}</Text>
                        </View>


                        <View style={styles.detailItem}>
                            <Text style={styles.label}>État de reine</Text>
                            <Text style={styles.text}>{hiveData.Queen.queen_state}</Text>
                        </View>


                        <View style={styles.detailItem}>
                            <Text style={styles.label}>Origine de reine</Text>
                            <Text style={styles.text}>{hiveData.Queen.race}</Text>
                        </View>

                        {hiveData.Queen.clipped && (
                            <View style={styles.detailItem}>
                                 <Text style={styles.text}>Reine Clippée</Text>
                            </View>
                        )}

                        <View style={styles.detailItem}>
                            <Text style={styles.label}>Reine Origine</Text>
                            <Text style={styles.text}>{hiveData.Queen.origin}</Text>
                        </View>

 

                        <View style={styles.detailItem}>
                            <Text style={styles.label}>Reine Note</Text>
                            <Text style={styles.text}>{hiveData.Queen.note}</Text>
                        </View>

                    </View>
                )}
            
            </View>
        </ScrollView>
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
        fontSize: 24,
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
        fontSize: 16,
        fontWeight: 'bold',
        color: '#342D21',
        marginBottom: 8,
    },
    text: {
        fontSize: 16,
        fontWeight: '400',
        color: '#797979',
    },
});


export default HiveDetailsScreen;
