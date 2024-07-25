import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import EditTransactionModal from './EditTransactionModal';
import axios from '../../axiosConfig';
 
const TransactionDetailsScreen = ({ route, navigation }) => {
    const { transactionData, badge } = route.params;
    const [modalVisible, setModalVisible] = useState(false);


    const [formData, setFormData] = useState({ ...transactionData });

    useEffect(() => {
        setFormData({ ...transactionData });
    }, [transactionData]);

    const handleModalInputChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleDelete = async (transactionId) => {
        try {
            const response = await axios.delete(`/transaction/deleteTransaction/${transactionId}`);
            if (response.status === 200) {
                console.log('Transaction deleted successfully');
                showAlertAndNavigate('Transaction supprimée avec succès');
            } else {
                console.error('Failed to delete transaction:', response.data.message);
                showAlert('Échec de la suppression de la transaction');
            }
        } catch (error) {
            console.error('Error deleting transaction:', error.message);
            showAlert('Erreur lors de la suppression de la transaction');
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

    const confirmDelete = (transactionId) => {
        Alert.alert(
            'Confirmation',
            'Êtes-vous sûr de vouloir supprimer cette transaction ?',
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Supprimer',
                    onPress: () => handleDelete(transactionId),
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
                    <Text style={{ color: 'white', fontSize: 12 }}>Dernière transaction</Text>
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
                        onPress={() => confirmDelete(transactionData._id)}>
                        <Ionicons name="trash-outline" size={30} color="#FF0000" style={styles.icon} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => setModalVisible(true)}>
                        <Ionicons name="create-outline" size={30} color="orange" style={styles.icon} />
                    </TouchableOpacity>
                </View>


                <View style={styles.row}>
                    <Text style={styles.label}> <Ionicons name="settings-outline" size={14} color="gray" /> Type d'opération
                    </Text>
                    <Text style={styles.value}>{formData.OperationType}</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.row}>
                    <Text style={styles.label}>
                        <Ionicons name="newspaper-outline" size={14} color="blue" /> Description
                    </Text>
                    <Text style={styles.valueLine}>{"     "}{formData.Description}</Text>

                </View>

                <View style={styles.divider} />

                <View style={styles.row}>
                    <Text style={styles.label}>
                        <Ionicons name="calendar-number-outline" size={14} color="#977700" /> Date
                    </Text>
                    <Text style={styles.value}>{new Date(formData.TransactionDate).toLocaleDateString('fr-FR')}</Text>
                </View>

                <View style={styles.divider} />


                <View style={styles.row}>
                    <Text style={styles.label}> <Ionicons name="grid-outline" size={14} color="orange" /> Catégorie
                    </Text>
                    <Text style={styles.value}>{formData.Category}</Text>
                </View>
                <View style={styles.divider} />

                <View style={styles.row}>
                    <Text style={styles.label}> <Ionicons name="cash-outline" size={14} color="green" /> Montant
                    </Text>
                    <Text style={styles.value}>{formData.Amount}</Text>
                </View>


                {formData.Note &&
                    (<><View style={styles.divider} />

                        <View style={styles.row}>

                            <Text style={styles.label}>
                                <Ionicons name="receipt-outline" size={14} color="pink" /> Note
                            </Text>
                            <Text style={styles.value}>{"     "}{formData.Note}</Text>

                        </View></>)}



            </View>

            <EditTransactionModal
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


export default TransactionDetailsScreen;