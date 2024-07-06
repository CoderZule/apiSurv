import React from 'react';
import { Modal, StyleSheet, View, Text, TouchableOpacity, TextInput, ScrollView, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { HarvestMethods, HarvestSeasons, HarvestProducts, units } from '../Data';
import { Card } from 'react-native-paper';

const AddHarvestModal = ({
    selectedProduct,
    setSelectedProduct,
    quantity,
    setQuantity,
    selectedUnit,
    setSelectedUnit,
    selectedSeason,
    setSelectedSeason,
    selectedHarvestMethod,
    setSelectedHarvestMethod,
    qualityTestResults,
    setQualityTestResults,
    date,
    showDatePicker,
    setShowDatePicker,
    handleDateChange,
    handleFormSubmit,
    closeModal,
}) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            statusBarTranslucent={true}
            visible={true}
            onRequestClose={() => closeModal()}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingContainer}
            >
                <View style={styles.modalView}>
                    <Card style={styles.card}>
                        <ScrollView contentContainerStyle={styles.scrollViewContent} keyboardShouldPersistTaps="handled">
                            <Text style={styles.label}>Produit</Text>
                            <View style={styles.inputContainer}>
                                <Picker
                                    selectedValue={selectedProduct}
                                    onValueChange={(itemValue) => setSelectedProduct(itemValue)}
                                    style={styles.picker}
                                >
                                    <Picker.Item label="Sélectionner..." value="" enabled={false} />
                                    {HarvestProducts.map((product) => (
                                        <Picker.Item label={product} value={product} key={product} />
                                    ))}
                                </Picker>
                            </View>

                            <Text style={styles.label}>Date</Text>
                            <View style={styles.datePickerContainer}>
                                <Pressable onPress={() => setShowDatePicker(true)}>
                                    <Text style={styles.datePickerText}>{date.toLocaleDateString()}</Text>
                                </Pressable>
                                {showDatePicker && (
                                    <DateTimePicker
                                        value={date}
                                        mode="date"
                                        is24Hour={true}
                                        display="default"
                                        onChange={handleDateChange}
                                        locale="fr"
                                        maximumDate={new Date()} 
                                    />
                                )}
                            </View>

                            <Text style={styles.label}>Quantité</Text>
                            <TextInput
                                value={quantity}
                                onChangeText={text => setQuantity(text)}
                                keyboardType="numeric"
                                style={styles.textInput}
                                onSubmitEditing={() => { }}
                                returnKeyType="done"
                            />

                            <Text style={styles.label}>Unité</Text>
                            <View style={styles.inputContainer}>
                                <Picker
                                    selectedValue={selectedUnit}
                                    onValueChange={(itemValue) => setSelectedUnit(itemValue)}
                                    style={styles.picker}
                                >
                                    <Picker.Item label="Sélectionner..." value="" enabled={false} />
                                    {units.map((unit) => (
                                        <Picker.Item label={unit} value={unit} key={unit} />
                                    ))}
                                </Picker>
                            </View>

                            <Text style={styles.label}>Saison</Text>
                            <View style={styles.inputContainer}>
                                <Picker
                                    selectedValue={selectedSeason}
                                    onValueChange={(itemValue) => setSelectedSeason(itemValue)}
                                    style={styles.picker}
                                >
                                    <Picker.Item label="Sélectionner..." value="" enabled={false} />
                                    {HarvestSeasons.map((season) => (
                                        <Picker.Item label={season} value={season} key={season} />
                                    ))}
                                </Picker>
                            </View>

                            <Text style={styles.label}>Méthode de récolte</Text>
                            <View style={styles.inputContainer}>
                                <Picker
                                    selectedValue={selectedHarvestMethod}
                                    onValueChange={(itemValue) => setSelectedHarvestMethod(itemValue)}
                                    style={styles.picker}
                                >
                                    <Picker.Item label="Sélectionner..." value="" enabled={false} />
                                    {HarvestMethods.map((method) => (
                                        <Picker.Item label={method} value={method} key={method} />
                                    ))}
                                </Picker>
                            </View>

                            <Text style={styles.label}>Résultats des tests de qualité</Text>
                            <TextInput
                                value={qualityTestResults}
                                onChangeText={text => setQualityTestResults(text)}
                                style={styles.textInput}
                                onSubmitEditing={() => { }}
                                returnKeyType="done"
                            />
                        </ScrollView>

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.buttonCancel} onPress={() => closeModal()}>
                                <Text style={styles.buttonText}>Annuler</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.buttonSubmit} onPress={() => handleFormSubmit()}>
                                <Text style={styles.buttonText}>Ajouter</Text>
                            </TouchableOpacity>
                        </View>
                    </Card>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalView: {
        flex: 1,

        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    card: {
        width: '90%',
        maxHeight: '80%', // Adjusted to fit within modal
        padding: 20,
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'flex-start', // Align items at the top
        alignItems: 'center', // Center horizontally if needed
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        fontWeight: 'bold',
        color: '#342D21',
    },
    inputContainer: {
        marginBottom: 15,
        borderBottomWidth: 1,
        backgroundColor: '#FBF5E0',
        borderBottomColor: '#CCCCCC',
        width: '100%', // Ensure full width
    },
    picker: {
        height: 50,
        width: '100%',
        color: '#333333',
    },
    textInput: {
        width: '100%',
        marginBottom: 15,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
        borderColor: '#CCCCCC',
        borderWidth: 1,
        backgroundColor: '#FFFFFF',
        color: '#333333',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    },

    buttonCancel: {
        backgroundColor: '#CCCCCC',
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginHorizontal: 5,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonSubmit: {
        backgroundColor: '#FEE502',
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginHorizontal: 5,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {

        fontSize: 14, // Adjusted font size
        fontWeight: 'bold',
        color: '#373737',
    },
    datePickerContainer: {
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#CCCCCC',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%', // Ensure full width
    },
    datePickerText: {
        color: '#333333',
    },
    keyboardAvoidingContainer: {
        flex: 1,
    },
});

export default AddHarvestModal;
