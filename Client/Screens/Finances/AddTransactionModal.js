import React, { useState } from 'react';
import { Modal, StyleSheet, View, Text, TouchableOpacity, TextInput, ScrollView, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { IncomeCategory, ExpenseCategory } from '../Data';
import { Card } from 'react-native-paper';

const AddTransactionModal = ({
    operationType,
    setOperationType,
    description,
    setDescription,
    selectedCategory,
    setSelectedCategory,
    amount,
    setAmount,
    note,
    setNote,
    date,
    showDatePicker,
    setShowDatePicker,
    handleDateChange,
    handleFormSubmit,
    closeModal,
}) => {
    const [transactionType, setTransactionType] = useState(operationType);

    const handleTransactionTypeChange = (type) => {
        setTransactionType(type);
        setOperationType(type);
    };

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

                            <Text style={styles.modalTitle}>إضافة معاملة</Text>

                            <Text style={styles.label}>نوع العملية</Text>

                            <View style={styles.tabContainer}>
                                <TouchableOpacity
                                    style={[styles.tabButton, transactionType === 'الدخل' && styles.activeTab]}
                                    onPress={() => handleTransactionTypeChange('الدخل')}
                                >
                                    <Text style={styles.tabText}>الدخل</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.tabButton, transactionType === 'النفقات' && styles.activeTab]}
                                    onPress={() => handleTransactionTypeChange('النفقات')}
                                >
                                    <Text style={styles.tabText}>النفقات</Text>
                                </TouchableOpacity>
                            </View>


                            <Text style={styles.label}>الوصف</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder='الوصف'
                                multiline={true}
                                numberOfLines={3}
                                onChangeText={text => setDescription(text)}
                                value={description}
                            />

                            <Text style={styles.label}>التاريخ</Text>
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

                            <Text style={styles.label}>الفئة</Text>
                            <View style={styles.inputContainer}>
                                <Picker
                                    selectedValue={selectedCategory}
                                    onValueChange={(itemValue) => setSelectedCategory(itemValue)}
                                    style={styles.picker}
                                >
                                    <Picker.Item label="اختر..." value="" enabled={false} />
                                    {(transactionType === 'الدخل' || transactionType === 'النفقات'
                                        ? (transactionType === 'الدخل' ? IncomeCategory : ExpenseCategory)
                                        : []
                                    ).map((category) => (
                                        <Picker.Item label={category} value={category} key={category} />
                                    ))}
                                </Picker>
                            </View>


                            <Text style={styles.label}>المبلغ</Text>
                            <View style={styles.amountInputContainer}>
                                <TextInput
                                    value={amount}
                                    placeholder='المبلغ'
                                    onChangeText={text => setAmount(text)}
                                    keyboardType="numeric"
                                    style={styles.amountTextInput}
                                    onSubmitEditing={() => { }}
                                    returnKeyType="done"
                                />
                                <Text style={styles.currencyText}>د.ت</Text>
                            </View>

                            <Text style={styles.label}>ملاحظة</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder='ملاحظة'
                                multiline={true}
                                numberOfLines={5}
                                onChangeText={text => setNote(text)}
                                value={note}
                            />

                        </ScrollView>

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.buttonCancel} onPress={() => closeModal()}>
                                <Text style={styles.buttonText}>إلغاء</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.buttonSubmit} onPress={() => handleFormSubmit()}>
                                <Text style={styles.buttonText}>إضافة</Text>
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
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'flex-start', 
        alignItems: 'center', 
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
        width: '100%', 
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
        textAlign:'right'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    },
    buttonCancel: {
        backgroundColor: '#CCCCCC',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    buttonSubmit: {
        backgroundColor: '#FEE502',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#342D21',
    },
    datePickerContainer: {
        width: '100%',
        marginBottom: 15,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
        borderColor: '#CCCCCC',
        borderWidth: 1,
        backgroundColor: '#FBF5E0',
    },
    datePickerText: {
        color: '#333333',
    },
    keyboardAvoidingContainer: {
        flex: 1,
    },

    amountInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#CCCCCC',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
        backgroundColor: '#FFFFFF',
    },
    amountTextInput: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 15,
        color: '#333333',
        textAlign:'right'
    },
    currencyText: {
        paddingRight: 15,
        color: 'gray',
        fontWeight: 'bold',
    },
});

export default AddTransactionModal;
