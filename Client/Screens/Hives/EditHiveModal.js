import React, { useState, useEffect } from 'react';
import { Modal, StyleSheet, View, Text, TouchableOpacity, TextInput, ScrollView, Alert, KeyboardAvoidingView, Platform, Pressable, Switch, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Card } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from '../../axiosConfig';
import { ColonyTemperament, Hivetypes, colors, purpose, source, strength, status, queen_state, race, queenColors, queen_origin, temperament } from '../Data';


const EditHiveModal = ({ visible, onSave, onCancel, formData, apiaries, onInputChange }) => {


    const [showDatePicker, setShowDatePicker] = useState(false);

    const [showQueenDatePicker, setShowQueenDatePicker] = useState(false);




    const handleQueenInstalledDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || formData.Queen.installed || new Date();
        setShowQueenDatePicker(false);
        onInputChange('Queen', {
            ...formData.Queen,
            installed: currentDate
        });
    };

    const handleHiveInstalledDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || formData.Added || new Date();
        setShowDatePicker(false);
        onInputChange('Added', currentDate);
    };




    const handleSave = async () => {
        if (
            !formData.Name ||
            !formData.Type ||
            !formData.Source ||
            !formData.Purpose ||
            !formData.Added ||
            !formData.Apiary ||
            !formData.Colony.strength ||
            !formData.Colony.temperament ||
            !formData.Colony.supers ||
            !formData.Colony.TotalFrames
        ) {
            return Alert.alert('خطأ', 'يرجى ملء جميع الحقول');
        }


        if (formData.Queen?.seen) {
            if (
                !formData.Queen.hatched ||
                !formData.Queen.queen_state ||
                !formData.Queen.status ||
                !formData.Queen.temperament ||
                !formData.Queen.race
            ) {
                return Alert.alert('خطأ', 'يرجى ملء جميع الحقول المتعلقة بالملكة');
            }
        } else {
            formData.Queen = null
        }


        try {
            const response = await axios.post('/hive/editHive', formData);

            if (response.status === 200) {
                showAlert('تعديل الخلية ناجح', 'تم تعديل الخلية بنجاح');
                onSave();
            } else {
                console.error('Failed to update hive data. Unexpected response:', response);
            }
        } catch (error) {
            console.error('Failed to update hive data. Error:', error.message);
        }
    };

    const showAlert = (title, message) => {
        Alert.alert(
            'نجاح',
            message,
            [{ text: 'موافق' }],
            { cancelable: false }
        );
    };




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
                            <Text style={styles.modalTitle}>تعديل الخلية</Text>


                            <Text style={styles.label}>المنحل</Text>
                            <View style={styles.inputContainer}>
                                <Picker
                                    selectedValue={formData.Apiary ? formData.Apiary._id : ""}
                                    onValueChange={(itemValue) => onInputChange('Apiary', itemValue)}
                                    style={styles.picker}
                                >
                                    <Picker.Item label="اختر..." value="" enabled={false} />
                                    {apiaries && apiaries.map((apiary) => (
                                        <Picker.Item label={apiary.Name} value={apiary._id} key={apiary._id} />
                                    ))}

                                </Picker>
                            </View>

                            <Text style={styles.label}>اسم الخلية</Text>
                            <TextInput
                                style={styles.textInput}
                                value={formData.Name}
                                onChangeText={(text) => onInputChange('Name', text)}
                            />


                            <Text style={styles.label}>اللون</Text>
                            <View style={styles.inputContainer}>
                                <Picker
                                    selectedValue={formData.Color}
                                    onValueChange={(itemValue) => onInputChange('Color', itemValue)}
                                    style={styles.picker}
                                >
                                    <Picker.Item label="اختر..." value="" enabled={false} />
                                    {colors.map((color) => (
                                        <Picker.Item label={color} value={color} key={color} />
                                    ))}
                                </Picker>
                            </View>



                            <Text style={styles.label}>النوع</Text>
                            <View style={styles.inputContainer}>

                                <Picker
                                    selectedValue={formData.Type}
                                    onValueChange={(itemValue) => onInputChange('Type', itemValue)}
                                    style={styles.picker}
                                >
                                    <Picker.Item label="اختر..." value="" enabled={false} />
                                    {Hivetypes.map((type) => (
                                        <Picker.Item label={type} value={type} key={type} />
                                    ))}
                                </Picker>
                            </View>


                            <Text style={styles.label}>المصدر</Text>
                            <View style={styles.inputContainer}>
                                <Picker
                                    selectedValue={formData.Source}
                                    onValueChange={(itemValue) => onInputChange('Source', itemValue)}
                                    style={styles.picker}
                                >
                                    <Picker.Item label="اختر..." value="" enabled={false} />
                                    {source.map((sou) => (
                                        <Picker.Item label={sou} value={sou} key={sou} />
                                    ))}
                                </Picker>
                            </View>


                            <Text style={styles.label}>الغرض</Text>
                            <View style={styles.inputContainer}>
                                <Picker
                                    selectedValue={formData.Purpose}
                                    onValueChange={(itemValue) => onInputChange('Purpose', itemValue)}
                                    style={styles.picker}
                                >
                                    <Picker.Item label="اختر..." value="" enabled={false} />
                                    {purpose.map((pur) => (
                                        <Picker.Item label={pur} value={pur} key={pur} />
                                    ))}
                                </Picker>
                            </View>



                            <Text style={styles.label}>تاريخ التثبيت</Text>
                            <View style={styles.datePickerContainer}>
                                <Pressable onPress={() => setShowDatePicker(true)}>
                                    <Text style={styles.datePickerText}>
                                        {formData.Added ? new Date(formData.Added).toLocaleDateString('fr-FR') : 'حدد تاريخا'}
                                    </Text>
                                </Pressable>
                                {showDatePicker && (
                                    <DateTimePicker
                                        value={new Date(formData.Added || Date.now())}
                                        mode="date"
                                        is24Hour={true}
                                        display="default"
                                        onChange={handleHiveInstalledDateChange}
                                        locale="fr"
                                        maximumDate={new Date()}
                                    />
                                )}
                            </View>

                            <Text style={styles.label}>قوة المستعمرة</Text>
                            <View style={styles.inputContainer}>
                                <Picker
                                    selectedValue={formData.Colony.strength}
                                    onValueChange={(itemValue) => onInputChange('Colony', { ...formData.Colony, strength: itemValue })}
                                    style={styles.picker}
                                >
                                    <Picker.Item label="اختر..." value="" enabled={false} />
                                    {strength.map((str) => (
                                        <Picker.Item label={str} value={str} key={str} />
                                    ))}
                                </Picker>
                            </View>


                            <Text style={styles.label}>مزاج المستعمرة</Text>
                            <View style={styles.inputContainer}>
                                <Picker
                                    selectedValue={formData.Colony.temperament}
                                    onValueChange={(itemValue) => onInputChange('Colony', { ...formData.Colony, temperament: itemValue })}

                                    style={styles.picker}
                                >
                                    <Picker.Item label="اختر..." value="" enabled={false} />
                                    {ColonyTemperament.map((ct) => (
                                        <Picker.Item label={ct} value={ct} key={ct} />
                                    ))}
                                </Picker>
                            </View>



                            <Text style={styles.label}>عدد العاسلات</Text>
                            <TextInput
                                value={String(formData.Colony.supers)}
                                onValueChange={(itemValue) => onInputChange('Colony', { ...formData.Colony, supers: itemValue })}
                                style={styles.textInput}
                                keyboardType="numeric"
                                returnKeyType="done"
                            />


                            <Text style={styles.label}>مجموع الإطارات</Text>
                            <TextInput
                                value={String(formData.Colony.TotalFrames)}
                                onValueChange={(itemValue) => onInputChange('Colony', { ...formData.Colony, TotalFrames: itemValue })}
                                style={styles.textInput}
                                keyboardType="numeric"
                                returnKeyType="done"
                            />

                            <Text style={styles.label}>الملكة موجودة</Text>
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Switch
                                    value={formData.Queen ? formData.Queen.seen : false}
                                    onValueChange={(itemValue) => onInputChange('Queen', { ...formData.Queen, seen: itemValue })}
                                />
                            </View>

                            {formData.Queen && formData.Queen.seen && (
                                <>
                                    <Text style={styles.label}>الوضع</Text>
                                    <View style={styles.inputContainer}>
                                        <Picker
                                            selectedValue={formData.Queen.status}
                                            onValueChange={(itemValue) => onInputChange('Queen', { ...formData.Queen, status: itemValue })}
                                            style={styles.picker}
                                        >
                                            <Picker.Item label="اختر..." value="" enabled={false} />
                                            {status.map((statusItem, index) => (
                                                <Picker.Item key={index} label={statusItem} value={statusItem} />
                                            ))}
                                        </Picker>
                                    </View>

                                    <Text style={styles.label}>سنة الفقس</Text>
                                    <View style={styles.inputContainer}>
                                        <Picker
                                            selectedValue={formData.Queen.hatched}
                                            onValueChange={(itemValue) => onInputChange('Queen', { ...formData.Queen, hatched: parseInt(itemValue) })}
                                            style={styles.picker}
                                        >
                                            <Picker.Item label="اختر..." value="" enabled={false} />
                                            {Array.from({ length: 10 }).map((_, index) => {
                                                const year = new Date().getFullYear() - index;
                                                return <Picker.Item key={year} label={`${year}`} value={year} />;
                                            })}
                                        </Picker>
                                    </View>


                                    <Text style={styles.label}>تاريخ التثبيت</Text>
                                    <View style={styles.inputContainer}>
                                        <Button
                                            title={formData.Queen.installed ? new Date(formData.Queen.installed).toLocaleDateString('fr-FR') : 'حدد تاريخا'}
                                            onPress={() => setShowQueenDatePicker(true)}
                                        />

                                        {showQueenDatePicker && (
                                            <DateTimePicker
                                                value={new Date(formData.Queen.installed || Date.now())}
                                                mode="date"
                                                display="default"
                                                maximumDate={new Date()}
                                                onChange={handleQueenInstalledDateChange}
                                            />
                                        )}
                                    </View>


                                    <Text style={styles.label}>الحالة</Text>
                                    <View style={styles.inputContainer}>
                                        <Picker
                                            selectedValue={formData.Queen.queen_state}
                                            onValueChange={(itemValue) => onInputChange('Queen', { ...formData.Queen, queen_state: itemValue })}

                                            style={styles.picker}
                                        >
                                            <Picker.Item label="اختر..." value="" enabled={false} />
                                            {queen_state.map((stateItem, index) => (
                                                <Picker.Item key={index} label={stateItem} value={stateItem} />
                                            ))}
                                        </Picker>
                                    </View>


                                    <Text style={styles.label}>المزاج</Text>
                                    <View style={styles.inputContainer}>
                                        <Picker
                                            selectedValue={formData.Queen.temperament}
                                            onValueChange={(itemValue) => onInputChange('Queen', { ...formData.Queen, temperament: itemValue })}

                                            style={styles.picker}
                                        >
                                            <Picker.Item label="اختر..." value="" enabled={false} />
                                            {temperament.map((temperamentItem, index) => (
                                                <Picker.Item key={index} label={temperamentItem} value={temperamentItem} />
                                            ))}
                                        </Picker>
                                    </View>


                                    <Text style={styles.label}>السلالة</Text>
                                    <View style={styles.inputContainer}>
                                        <Picker
                                            selectedValue={formData.Queen.race}
                                            onValueChange={(itemValue) => onInputChange('Queen', { ...formData.Queen, race: itemValue })}

                                            style={styles.picker}
                                        >
                                            <Picker.Item label="اختر..." value="" enabled={false} />
                                            {race.map((raceItem, index) => (
                                                <Picker.Item key={index} label={raceItem} value={raceItem} />
                                            ))}
                                        </Picker>
                                    </View>

                                    <Text style={styles.label}>أجنحة مقصوصة</Text>
                                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                        <Switch value={formData.Queen.clipped}
                                            onValueChange={(itemValue) => onInputChange('Queen', { ...formData.Queen, clipped: itemValue })}
                                        />
                                    </View>

                                    <Text style={styles.label}>الملكة معلمة</Text>
                                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                        <Switch value={formData.Queen.isMarked}
                                            onValueChange={(itemValue) => onInputChange('Queen', { ...formData.Queen, isMarked: itemValue })}
                                        />
                                    </View>

                                    {formData.Queen.isMarked && (
                                        <>
                                            <Text style={styles.label}>اللون</Text>
                                            <View style={styles.inputContainer}>
                                                <Picker
                                                    selectedValue={formData.Queen.color}
                                                    onValueChange={(itemValue) => onInputChange('Queen', { ...formData.Queen, color: itemValue })}

                                                    style={styles.picker}
                                                >
                                                    <Picker.Item label="اختر..." value="" enabled={false} />
                                                    {queenColors.map((colorItem, index) => (
                                                        <Picker.Item key={index} label={colorItem} value={colorItem} />
                                                    ))}
                                                </Picker>
                                            </View>
                                        </>
                                    )}




                                    <Text style={styles.label}>الأصل</Text>
                                    <View style={styles.inputContainer}>
                                        <Picker
                                            selectedValue={formData.Queen.origin}
                                            onValueChange={(itemValue) => onInputChange('Queen', { ...formData.Queen, origin: itemValue })}
                                            style={styles.picker}
                                        >
                                            <Picker.Item label="اختر..." value="" enabled={false} />
                                            {queen_origin.map((originItem, index) => (
                                                <Picker.Item key={index} label={originItem} value={originItem} />
                                            ))}
                                        </Picker>
                                    </View>


                                </>
                            )}



                            <View style={styles.buttonContainer}>
                                <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onCancel}>
                                    <Text style={styles.buttonText}>إلغاء</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
                                    <Text style={styles.buttonText}>تعديل</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>


                    </View>




                </View>


            </KeyboardAvoidingView>


        </Modal >
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
        textAlign: 'right'
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

    mapModalView: {
        flex: 1,
        justifyContent: 'flex-end',
        margin: 0,
    },
    map: {
        width: '100%',
        height: '100%',
    },
    closeMapModalButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        padding: 10,
        backgroundColor: '#FEE502',
        borderRadius: 5,
        elevation: 2,
    },
});

export default EditHiveModal;
