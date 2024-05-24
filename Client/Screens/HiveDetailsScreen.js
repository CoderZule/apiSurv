import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity, Modal, TouchableWithoutFeedback, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const HiveDetailsScreen = ({ route }) => {
    const { hiveData } = route.params;
    const [showOwnerModal, setShowOwnerModal] = useState(false);
    const [showApiaryModal, setShowApiaryModal] = useState(false);
    const [showHiveModal, setShowHiveModal] = useState(false);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
         return date.toLocaleString('fr', { day: '2-digit', month: 'long', year: 'numeric' });
      };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Ruche {hiveData.Type}{'\n'}Détails</Text>
            <ImageBackground imageStyle={{ borderRadius: 20 }}
                source={require('../assets/bg-hive.jpeg')} style={styles.detailsContainer}>
                <View style={styles.buttonsRow}>
                    <TouchableOpacity onPress={() => setShowOwnerModal(true)} style={styles.button}>
                        <Ionicons name='person-outline' size={30} color="#fff" />
                        <Text style={[styles.buttonText, { marginTop: 5 }]}> Propriétaire</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setShowApiaryModal(true)} style={styles.button}>
                        <Ionicons name='trail-sign-outline' size={30} color="#fff" />
                        <Text style={[styles.buttonText, { marginTop: 5 }]}>Rucher</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => setShowHiveModal(true)} style={[styles.button, styles.centerButton]}>
                    <Ionicons name='archive-outline' size={30} color="#fff" />
                    <Text style={[styles.buttonText, { marginTop: 5 }]}>Ruche</Text>
                </TouchableOpacity>
            </ImageBackground>

            {/* Owner Details Modal */}
            <Modal visible={showOwnerModal} animationType="slide" transparent={true}>
                <TouchableWithoutFeedback onPress={() => setShowOwnerModal(false)}>

                    <View style={styles.modalContainer}>
                        <TouchableWithoutFeedback>
                            <View style={styles.modalContent}>
                                <Text style={styles.groupTitle}>Détails du propriétaire</Text>
                                <View style={styles.detailItem}>
                                    <Text style={styles.label}>Nom et prénom</Text>
                                    <Text style={styles.text}>{hiveData.Apiary.Owner.Firstname} {hiveData.Apiary.Owner.Lastname}</Text>
                                </View>
                                <View style={styles.detailItem}>
                                    <Text style={styles.label}>Cin</Text>
                                    <Text style={styles.text}>{hiveData.Apiary.Owner.Cin}</Text>
                                </View>
                                <View style={styles.detailItem}>
                                    <Text style={styles.label}>Tel</Text>
                                    <Text style={styles.text}>{hiveData.Apiary.Owner.Phone}</Text>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            {/* Apiary Details Modal */}
            <Modal visible={showApiaryModal} animationType="slide" transparent={true}>
                <TouchableWithoutFeedback onPress={() => setShowApiaryModal(false)}>
                    <View style={styles.modalContainer}>
                        <TouchableWithoutFeedback>

                            <View style={styles.modalContent}>
                                <Text style={styles.groupTitle}>Détails du rucher</Text>
                                <View style={styles.detailItem}>
                                    <Text style={styles.label}>Nom du rucher</Text>
                                    <Text style={styles.text}>{hiveData.Apiary.Name}</Text>
                                </View>
                                <View style={styles.detailItem}>
                                    <Text style={styles.label}>Type</Text>
                                    <Text style={styles.text}>{hiveData.Apiary.Type}</Text>
                                </View>
                                <View style={styles.detailItem}>
                                    <Text style={styles.label}>Gouvernorat</Text>
                                    <Text style={styles.text}>{hiveData.Apiary.Location.governorate}</Text>
                                </View>
                                <View style={styles.detailItem}>
                                    <Text style={styles.label}>Délégation</Text>
                                    <Text style={styles.text}>{hiveData.Apiary.Location.city}</Text>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>


            {/* Hive Details Modal */}
            <Modal visible={showHiveModal} animationType="slide" transparent={true}>
                <TouchableWithoutFeedback onPress={() => setShowHiveModal(false)}>
                    <View style={styles.modalContainer}>
                        <TouchableWithoutFeedback>

                            <View style={styles.modalContent}>
                                <Text style={styles.groupTitle}>Détails de la ruche</Text>
                                <ScrollView style={styles.scrollContainer}>
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
                                        <Text style={styles.text}>{formatDate(hiveData.Added)}</Text>
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
                                                <Text style={styles.text}>{formatDate(hiveData.Queen.installed)}</Text>
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
                                </ScrollView>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
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
        fontSize: 25,
        fontWeight: "bold",
        color: '#2EB922',
        textAlign: 'center',
        marginTop: 60, // Add margin top here
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 2
    },
    detailsContainer: {
        borderRadius: 20,
        padding: 20,
        marginTop: 80, // Add margin top here
    },
    buttonsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    button: {
        backgroundColor: 'rgba(90, 65, 0, 0.7)', // Darker brown color with 70% opacity
        width: '48%', // Adjust width to fit two buttons in a row
        aspectRatio: 1, // Square aspect ratio
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    centerButton: {
        alignSelf: 'center'
    },
    buttonText: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        width: '80%',
        maxHeight: '80%',
    },
    detailItem: {
        marginBottom: 15,
    },
    groupTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    color: '#977700',

        textAlign: 'center',
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#626262',

        marginBottom: 8,
    },
    text: {
        fontSize: 16,
        fontWeight: '400',
        color: '#797979',
    },
    scrollContainer: {
        maxHeight: 400,
    },
});


export default HiveDetailsScreen;
