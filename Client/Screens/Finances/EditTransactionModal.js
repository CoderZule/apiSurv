import React, { useState } from 'react';
import { Modal, StyleSheet, View, Text, TouchableOpacity, TextInput, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

import { IncomeCategory, ExpenseCategory } from '../Data';
import axios from '../../axiosConfig';

const EditTransactionModal = ({ visible, onSave, onCancel, formData, onInputChange }) => {
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [transactionType, setTransactionType] = useState(formData.OperationType || 'Revenus');


    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(Platform.OS === 'ios');
        setDate(currentDate);
        onInputChange('Date', currentDate);
    };

    const handleSave = async () => {
        if (!formData.Description || !formData.Amount || !formData.Category || !formData.TransactionDate) {
            return Alert.alert('Erreur', 'Veuillez remplir tous les champs');
        }

        try {
            const response = await axios.post('/transaction/editTransaction', formData);

            if (response.status === 200) {
                showAlert('Modification de la transaction réussie', 'La transaction a été mise à jour avec succès');
                onSave();
            } else {
                console.error('Failed to update transaction data. Unexpected response:', response);
            }
        } catch (error) {
            console.error('Failed to update transaction data. Error:', error.message);
        }
    };

    const showAlert = (title, message) => {
        Alert.alert(
            'Succès',
            message,
            [{ text: 'OK' }],
            { cancelable: false }
        );
    };

    const categories = transactionType === 'Revenus' ? IncomeCategory : ExpenseCategory;

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            statusBarTranslucent={true}
            onRequestClose={onCancel}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingContainer}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <ScrollView contentContainerStyle={styles.scrollViewContent}>
                            <Text style={styles.modalTitle}>Modifier la transaction</Text>


                            <Text style={styles.label}>Type d'opération</Text>

                            <View style={styles.tabContainer}>
                                <TouchableOpacity
                                    style={[styles.tabButton, transactionType === 'Revenus' && styles.activeTab]}
                                    onPress={() => {
                                        setTransactionType('Revenus');
                                        onInputChange('OperationType', 'Revenus');
                                    }}
                                >
                                    <Text style={styles.tabText}>Revenus</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.tabButton, transactionType === 'Dépenses' && styles.activeTab]}
                                    onPress={() => {
                                        setTransactionType('Dépenses');
                                        onInputChange('OperationType', 'Dépenses');
                                    }}
                                >
                                    <Text style={styles.tabText}>Dépenses</Text>
                                </TouchableOpacity>
                            </View>

                            <Text style={styles.label}>Description</Text>
                            <TextInput
                                style={styles.textInput}
                                value={formData.Description}
                                onChangeText={(text) => onInputChange('Description', text)}
                            />

                            <Text style={styles.label}>Date</Text>
                            <View style={styles.datePickerContainer}>
                                <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                                    <Text style={styles.datePickerText}>{date.toLocaleDateString()}</Text>
                                </TouchableOpacity>
                                {showDatePicker && (
                                    <DateTimePicker
                                        value={date}
                                        mode="date"
                                        display="default"
                                        onChange={handleDateChange}
                                        maximumDate={new Date()}
                                    />
                                )}
                            </View>

                            <Text style={styles.label}>Montant</Text>
                            <TextInput
                                style={styles.textInput}
                                value={formData.Amount.toString()}
                                onChangeText={(text) => onInputChange('Amount', text)}
                                keyboardType="numeric"
                            />

                            <Text style={styles.label}>Catégorie</Text>
                            <View style={styles.inputContainer}>

                                <Picker
                                    selectedValue={formData.Category}
                                    onValueChange={(itemValue) => onInputChange('Category', itemValue)}
                                    style={styles.picker}
                                >
                                    <Picker.Item label="Sélectionner..." value="" enabled={false} />
                                    {categories.map((category) => (
                                        <Picker.Item label={category} value={category} key={category} />
                                    ))}
                                </Picker>
                            </View>

                            {formData.Note && (
                                <>
                                    <Text style={styles.label}>Note</Text>
                                    <TextInput
                                        style={styles.textInput}
                                        multiline={true}
                                        numberOfLines={5}
                                        value={formData.Note}
                                        onChangeText={(text) => onInputChange('Note', text)}
                                    />
                                </>
                            )}

                            <View style={styles.buttonContainer}>
                                <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onCancel}>
                                    <Text style={styles.buttonText}>Annuler</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
                                    <Text style={styles.buttonText}>Modifier</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '90%',
        maxHeight: '80%',
        padding: 20,
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: '#977700',
        textAlign: 'center',
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginTop: 10,
        marginBottom: 5,
        fontWeight: 'bold',
        color: '#342D21',
        textAlign: 'center', 

    },
    textInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        width: '100%',
    },
    datePickerContainer: {
        marginTop: 2,
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#CCCCCC',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    datePickerText: {
        color: '#333333',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    },
    button: {
        padding: 10,
        borderRadius: 5,
        width: '40%',
        alignItems: 'center',
    },
    saveButton: {
        backgroundColor: '#FEE502',
    },
    cancelButton: {
        backgroundColor: '#E0E0E0',
    },
    buttonText: {
        fontWeight: 'bold',
        color: '#373737',
    },
    keyboardAvoidingContainer: {
        flex: 1,
    },
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'flex-start',
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 15,
    },
    tabButton: {
        flex: 1,
        paddingVertical: 10,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
        alignItems: 'center',
    },
    activeTab: {
        borderBottomColor: '#FEE502',
    },
    tabText: {
        fontSize: 16,
        color: '#333333',
    },

    inputContainer: {
        marginBottom: 15,
        borderBottomWidth: 1,
        backgroundColor: '#FBF5E0',
        borderBottomColor: '#CCCCCC',
        width: '100%', 
    },
    picker: {
        height: 50,
        width: '100%',
        color: '#333333',
    },
});

export default EditTransactionModal;
