import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import EditHarvestModal from './EditHarvestModal'; 
import axios from 'axios';

const HarvestDetailsScreen = ({ route, navigation }) => {
    const { harvestData, badge } = route.params;
    const [modalVisible, setModalVisible] = useState(false);

    
    const [formData, setFormData] = useState({ ...harvestData });

    useEffect(() => {
        setFormData({ ...harvestData });
    }, [harvestData]);

    const handleModalInputChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleDelete = async (harvestId) => {
        try {
            const response = await axios.delete(`http://192.168.1.17:3000/api/harvest/deleteHarvest/${harvestId}`);
            if (response.status === 200) {
                console.log('Harvest deleted successfully');
                showAlertAndNavigate('Récolte supprimée avec succès');
            } else {
                console.error('Failed to delete harvest:', response.data.message);
                showAlert('Échec de la suppression de la récolte');
            }
        } catch (error) {
            console.error('Error deleting harvest:', error.message);
            showAlert('Erreur lors de la suppression de la récolte');
        }
    };

    const showAlertAndNavigate = (message) => {
        Alert.alert(
            'Success',
            message,
            [{ text: 'OK', onPress: () => navigation.goBack() }],
            { cancelable: false }
        );
    };

    const showAlert = (message) => {
        Alert.alert('Error', message, [{ text: 'OK' }], { cancelable: false });
    };

    const confirmDelete = (harvestId) => {
        Alert.alert(
            'Confirmation',
            'Êtes-vous sûr de vouloir supprimer cette récolte ?',
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Supprimer',
                    onPress: () => handleDelete(harvestId),
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
                    <Text style={{ color: 'white', fontSize: 12 }}>Dernière récolte</Text>
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
                        onPress={() => confirmDelete(harvestData._id)}>
                        <Ionicons name="trash-outline" size={30} color="#FF0000" style={styles.icon} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => setModalVisible(true)}>
                        <Ionicons name="create-outline" size={30} color="orange" style={styles.icon} />
                    </TouchableOpacity>
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}> <Ionicons name="flower-outline" size={14} color="orange" /> Produit
                    </Text>
                    <Text style={styles.value}>{formData.Product}</Text>
                </View>
                <View style={styles.divider} />

                <View style={styles.row}>
                    <Text style={styles.label}>
                        <Ionicons name="layers-outline" size={14} color="brown" /> Quantité
                    </Text>
                    <Text style={styles.value}>{formData.Quantity}</Text>
                </View>
                <View style={styles.divider} />

                <View style={styles.row}>
                    <Text style={styles.label}>
                        <Ionicons name="eyedrop-outline" size={14} color="#5188C7" /> Unité
                    </Text>
                    <Text style={styles.value}>{formData.Unit}</Text>
                </View>
                <View style={styles.divider} />

                <View style={styles.row}>
                    <Text style={styles.label}>
                        <Ionicons name="leaf-outline" size={14} color="#2EB922" /> Saison
                    </Text>
                    <Text style={styles.value}>{formData.Season}</Text>
                </View>
                <View style={styles.divider} />

                <View style={styles.row}>
                    <Text style={styles.label}>
                        <Ionicons name="construct-outline" size={14} color="gray" /> Méthode de récolte
                    </Text>
                    <Text style={styles.valueLine}>{"     "}{formData.HarvestMethods}</Text>

                </View>

                <View style={styles.divider} />

                <View style={styles.row}>
                    <Text style={styles.label}>
                        <Ionicons name="checkmark-circle-outline" size={14} color="#2EB922" /> Résultats des tests de qualité
                    </Text>
                    <Text style={styles.value}>{"     "}{formData.QualityTestResults}</Text>

                </View>
                <View style={styles.divider} />

                <View style={styles.row}>
                    <Text style={styles.label}>
                        <Ionicons name="calendar-outline" size={14} color="#977700" /> Date
                    </Text>
                    <Text style={styles.value}>{new Date(formData.Date).toLocaleDateString('fr-FR')}</Text>
                </View>
            </View>

            <EditHarvestModal
                visible={modalVisible}
                onSave={() => {
                    // Handle save logic here
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
        flexWrap: 'wrap', // Allow text to wrap within the row

    },

    label: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    value: {
        fontSize: 15,
        maxWidth: '100%', // Adjust maximum width as needed
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
        justifyContent: 'space-between', // Adjust as needed for spacing
        marginBottom: 20, // Optional: Add margin if desired
    },

    badgeContainer: {
        position: 'relative', // Ensure absolute positioning of badge is relative to this container
    },
    iconsContainer: {
        flexDirection: 'row',
        alignItems: 'center', // Align items horizontally
        marginLeft: 'auto',   // Push icons to the right
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

});


export default HarvestDetailsScreen;