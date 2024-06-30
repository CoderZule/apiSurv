import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity, Modal, ImageBackground, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import _ from 'lodash'; // Import lodash for debounce

const HiveDetailsScreen = ({ route, navigation }) => {
    const { hiveData, InspectionsHistoryData } = route.params;


    const [showOwnerModal, setShowOwnerModal] = useState(false);
    const [showApiaryModal, setShowApiaryModal] = useState(false);
    const [showHiveModal, setShowHiveModal] = useState(false);

    const navigateToInspectionsHistory = _.debounce(() => {
        navigation.navigate('InspectionsHistoryScreen', { InspectionsHistoryData });
    }, 300);


    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('fr', { day: '2-digit', month: 'long', year: 'numeric' });
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Ruche {hiveData.Type}{'\n'}Détails</Text>
            <ImageBackground imageStyle={{ borderRadius: 20 }}
                source={require('../../assets/bg-hive.jpeg')} style={styles.detailsContainer}>
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
                <View style={styles.buttonsRow}>
                    <TouchableOpacity onPress={() => setShowHiveModal(true)} style={[styles.button]}>
                        <Ionicons name='archive-outline' size={30} color="#fff" />
                        <Text style={[styles.buttonText, { marginTop: 5 }]}>Ruche</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={navigateToInspectionsHistory} style={[styles.button]}>
                        <Ionicons name='create-outline' size={30} color="#fff" />
                        <Text style={[styles.buttonText, { marginTop: 5 }]}>Inspections</Text>
                    </TouchableOpacity>
                </View>

            </ImageBackground>

            {/* Owner Details Modal */}
            <Modal visible={showOwnerModal} animationType="slide" transparent={true}>
                <TouchableWithoutFeedback onPress={() => setShowOwnerModal(false)}>

                    <View style={styles.modalContainer}>
                        <TouchableWithoutFeedback>
                            <View style={styles.modalContent}>
                                <Text style={styles.groupTitle}>Détails du propriétaire</Text>
                                <View style={styles.detailItem}>
                                    <Text style={styles.labelGeneralInfo}>Nom et prénom</Text>
                                    <Text style={styles.textGeneralInfo}>{hiveData.Apiary.Owner.Firstname} {hiveData.Apiary.Owner.Lastname}</Text>
                                </View>
                                <View style={styles.detailItem}>
                                    <Text style={styles.labelGeneralInfo}>Cin</Text>
                                    <Text style={styles.textGeneralInfo}>{hiveData.Apiary.Owner.Cin}</Text>
                                </View>
                                <View style={styles.detailItem}>
                                    <Text style={styles.labelGeneralInfo}>Tel</Text>
                                    <Text style={styles.textGeneralInfo}>{hiveData.Apiary.Owner.Phone}</Text>
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
                                    <Text style={styles.labelGeneralInfo}>Nom du rucher</Text>
                                    <Text style={styles.textGeneralInfo}>{hiveData.Apiary.Name}</Text>
                                </View>
                                <View style={styles.detailItem}>
                                    <Text style={styles.labelGeneralInfo}>Type</Text>
                                    <Text style={styles.textGeneralInfo}>{hiveData.Apiary.Type}</Text>
                                </View>
                                <View style={styles.detailItem}>
                                    <Text style={styles.labelGeneralInfo}>Gouvernorat</Text>
                                    <Text style={styles.textGeneralInfo}>{hiveData.Apiary.Location.governorate}</Text>
                                </View>
                                <View style={styles.detailItem}>
                                    <Text style={styles.labelGeneralInfo}>Délégation</Text>
                                    <Text style={styles.textGeneralInfo}>{hiveData.Apiary.Location.city}</Text>
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

                                    <View style={styles.section}>
                                         <View style={styles.detailItem}>
                                            <Text style={styles.labelGeneralInfo}>Couleur</Text>
                                            <Text style={styles.textGeneralInfo}>{hiveData.Color}</Text>
                                        </View>
                                        <View style={styles.detailItem}>
                                            <Text style={styles.labelGeneralInfo}>Type</Text>
                                            <Text style={styles.textGeneralInfo}>{hiveData.Type}</Text>
                                        </View>
                                        <View style={styles.detailItem}>
                                            <Text style={styles.labelGeneralInfo}>Source</Text>
                                            <Text style={styles.textGeneralInfo}>{hiveData.Source}</Text>
                                        </View>
                                        <View style={styles.detailItem}>
                                            <Text style={styles.labelGeneralInfo}>But</Text>
                                            <Text style={styles.textGeneralInfo}>{hiveData.Purpose}</Text>
                                        </View>
                                        <View style={styles.detailItem}>
                                            <Text style={styles.labelGeneralInfo}>Date d'ajout</Text>
                                            <Text style={styles.textGeneralInfo}>{formatDate(hiveData.Added)}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.divider} />

                                    <View style={styles.section}>
                                        <Text style={styles.header}>Colonie</Text>
                                        <View style={styles.detailItem}>
                                            <Text style={styles.label}>Force</Text>
                                            <Text style={styles.text}>{hiveData.Colony.strength}</Text>
                                        </View>
                                        <View style={styles.detailItem}>
                                            <Text style={styles.label}>Tempérament</Text>
                                            <Text style={styles.text}>{hiveData.Colony.temperament}</Text>
                                        </View>
                                        <View style={styles.detailItem}>
                                            <Text style={styles.label}>Supers</Text>
                                            <Text style={styles.text}>{hiveData.Colony.supers}</Text>
                                        </View>
                                        <View style={styles.detailItem}>
                                            <Text style={styles.label}>Cadres de pollen</Text>
                                            <Text style={styles.text}>{hiveData.Colony.pollenFrames}</Text>
                                        </View>
                                        <View style={styles.detailItem}>
                                            <Text style={styles.label}>Cadres au total</Text>
                                            <Text style={styles.text}>{hiveData.Colony.TotalFrames}</Text>
                                        </View>
                                    </View>


                                    {hiveData.Queen && (
                                        <>

                                            <View style={styles.divider} />
                                            <View style={styles.section}>
                                                <Text style={styles.header}>Reine</Text>


                                                <View style={styles.detailItem}>
                                                    <Text style={styles.label}>Clippée?</Text>
                                                    {hiveData.Queen.clipped ? (

                                                        <Text style={styles.text}>Oui</Text>

                                                    ) : (<Text style={styles.text}>Non</Text>)}
                                                </View>



                                                <View style={styles.detailItem}>
                                                    <Text style={styles.label}>Marquée?</Text>
                                                    {hiveData.Queen.isMarked ? (

                                                        <Text style={styles.text}>Oui</Text>

                                                    ) : (<Text style={styles.text}>Non</Text>)}
                                                </View>

                                                {hiveData.Queen.color !== "" && (
                                                    <View style={styles.detailItem}>
                                                        <Text style={styles.label}>Couleur</Text>
                                                        <Text style={styles.text}>{hiveData.Queen.color}</Text>
                                                    </View>
                                                )}

                                                <View style={styles.detailItem}>
                                                    <Text style={styles.label}>Éclos</Text>
                                                    <Text style={styles.text}>{hiveData.Queen.hatched}</Text>
                                                </View>


                                                <View style={styles.detailItem}>
                                                    <Text style={styles.label}>Statut</Text>
                                                    <Text style={styles.text}>{hiveData.Queen.status}</Text>
                                                </View>


                                                <View style={styles.detailItem}>
                                                    <Text style={styles.label}>Date d'installation</Text>
                                                    <Text style={styles.text}>{formatDate(hiveData.Queen.installed)}</Text>
                                                </View>


                                                <View style={styles.detailItem}>
                                                    <Text style={styles.label}>État</Text>
                                                    <Text style={styles.text}>{hiveData.Queen.queen_state}</Text>
                                                </View>


                                                <View style={styles.detailItem}>
                                                    <Text style={styles.label}>Race</Text>
                                                    <Text style={styles.text}>{hiveData.Queen.race}</Text>
                                                </View>

                                                <View style={styles.detailItem}>
                                                    <Text style={styles.label}>Origine</Text>
                                                    <Text style={styles.text}>{hiveData.Queen.origin}</Text>
                                                </View>


                                            </View>
                                        </>
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
        marginTop: 60,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 2
    },
    detailsContainer: {
        borderRadius: 20,
        padding: 20,
        marginTop: 80,
    },
    buttonsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    button: {
        backgroundColor: 'rgba(90, 65, 0, 0.7)',
        width: '48%',
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
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

    groupTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#977700',
        textAlign: 'center',
        marginBottom: 20,
    },
 
    scrollContainer: {
        maxHeight: 400,
    },
    divider: {
        borderBottomColor: '#cccccc',
        borderBottomWidth: 1,
        marginVertical: 10,
    },
    section: {
        marginBottom: 20,
    },

    detailItem: {
        marginBottom: 15,
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#626262',

        marginBottom: 8,
    },
    text: {
        fontSize: 12,
        fontWeight: '400',
        color: '#797979',
    },

    labelGeneralInfo: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#626262',
        marginBottom: 4,
        textAlign: 'center',  
    },
    textGeneralInfo: {
        fontSize: 12,
        fontWeight: '400',
        color: '#797979',
        textAlign: 'center',  
    },
    
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
    },
});


export default HiveDetailsScreen;
