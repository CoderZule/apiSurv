
import React, { useState } from 'react';
import { Modal, StyleSheet, View, Text, TouchableOpacity, TextInput, ScrollView, Pressable, KeyboardAvoidingView, Platform, Switch, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Card } from 'react-native-paper';
import { ColonyTemperament, Hivetypes, colors, purpose, source, strength, status, queen_state, race, queenColors, queen_origin, temperament } from '../Data';

const AddHiveModal = ({
    name,
    setName,
    selectedColor,
    setSelectedColor,
    selectedType,
    setSelectedType,
    selectedSource,
    setSelectedSource,
    selectedPurpose,
    setSelectedPurpose,
    selectedApiary,
    setSelectedApiary,
    added,
    setAdded,
    apiaries,
    colony,
    setColony,
    queen,
    setQueen,
    handleFormSubmit,
    closeModal

}) => {

     const [showQueenDatePicker, setShowQueenDatePicker] = useState(false);
    const [showHiveDatePicker, setShowHiveDatePicker] = useState(false);

    const [showDatePicker, setShowDatePicker] = useState(false);


    const handleQueenInstalledDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || queen.installed;
        setShowQueenDatePicker(false);
        setQueen({
            ...queen,
            installed: currentDate
        });
    };

    const handleHiveInstalledDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || added;  
        setShowDatePicker(false);   
        setAdded(currentDate);   
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
                            <Text style={styles.modalTitle}>إضافة خلية</Text>


                            <Text style={styles.label}>المنحل</Text>
                            <View style={styles.inputContainer}>
                                <Picker
                                    selectedValue={selectedApiary}
                                    onValueChange={(itemValue) => setSelectedApiary(itemValue)} style={styles.picker}
                                >
                                    <Picker.Item label="اختر..." value="" enabled={false} />
                                    {apiaries.map((apiary) => (
                                        <Picker.Item label={apiary.Name} value={apiary._id} key={apiary._id} />
                                    ))}
                                </Picker>
                            </View>


                            <Text style={styles.label}>اسم الخلية</Text>
                            <TextInput
                                value={name}
                                onChangeText={text => setName(text)}
                                style={styles.textInput}
                                onSubmitEditing={() => { }}
                                returnKeyType="done"
                            />

                            <Text style={styles.label}>اللون</Text>
                            <View style={styles.inputContainer}>
                                <Picker
                                    selectedValue={selectedColor}
                                    onValueChange={(itemValue) => setSelectedColor(itemValue)}
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
                                    selectedValue={selectedType}
                                    onValueChange={(itemValue) => setSelectedType(itemValue)}
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
                                    selectedValue={selectedSource}
                                    onValueChange={(itemValue) => setSelectedSource(itemValue)}
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
                                    selectedValue={selectedPurpose}
                                    onValueChange={(itemValue) => setSelectedPurpose(itemValue)}
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
                                    <Text style={styles.datePickerText}>{added.toLocaleDateString()}</Text>   
                                </Pressable>
                                {showDatePicker && (
                                    <DateTimePicker
                                        value={added}   
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
                                    selectedValue={colony.strength}
                                    onValueChange={(itemValue) => setColony({ ...colony, strength: itemValue })}
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
                                    selectedValue={colony.temperament}
                                    onValueChange={(itemValue) => setColony({ ...colony, temperament: itemValue })}
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
                                value={String(colony.supers)}
                                onChangeText={(text) => setColony({ ...colony, supers: parseFloat(text) })}
                                style={styles.textInput}
                                keyboardType="numeric"
                                returnKeyType="done"
                            />

                            <Text style={styles.label}>مجموع الإطارات</Text>
                            <TextInput
                                value={String(colony.TotalFrames)}
                                onChangeText={(text) => setColony({ ...colony, TotalFrames: parseFloat(text) })}
                                style={styles.textInput}
                                keyboardType="numeric"
                                returnKeyType="done"
                            />


                            <Text style={styles.label}>الملكة موجودة</Text>
                            <Switch value={queen.seen} onValueChange={(value) => setQueen({ ...queen, seen: value })} />

                            {queen.seen && (
                                <>
                                    <Text style={styles.label}>الوضع</Text>
                                    <View style={styles.inputContainer}>
                                        <Picker
                                            selectedValue={queen.status}
                                            onValueChange={(value) => setQueen({ ...queen, status: value })}
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
                                            selectedValue={queen.hatched}
                                            onValueChange={(value) => setQueen({ ...queen, hatched: parseInt(value) })}
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
                                            title={queen.installed ? queen.installed.toLocaleDateString('fr-FR') : 'حدد تاريخا'}
                                            onPress={() => setShowQueenDatePicker(true)}
                                        />
                                        {showQueenDatePicker && (
                                            <DateTimePicker
                                                value={queen.installed || new Date()}
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
                                            selectedValue={queen.queen_state}
                                            onValueChange={(value) => setQueen({ ...queen, queen_state: value })}
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
                                            selectedValue={queen.temperament}
                                            onValueChange={(value) => setQueen({ ...queen, temperament: value })}
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
                                            selectedValue={queen.race}
                                            onValueChange={(value) => setQueen({ ...queen, race: value })}
                                            style={styles.picker}
                                        >
                                            <Picker.Item label="اختر..." value="" enabled={false} />
                                            {race.map((raceItem, index) => (
                                                <Picker.Item key={index} label={raceItem} value={raceItem} />
                                            ))}
                                        </Picker>
                                    </View>

                                    <Text style={styles.label}>أجنحة مقصوصة</Text>
                                    <Switch value={queen.clipped} onValueChange={(value) => setQueen({ ...queen, clipped: value })} />

                                    <Text style={styles.label}>الملكة معلمة</Text>
                                    <Switch value={queen.isMarked} onValueChange={(value) => setQueen({ ...queen, isMarked: value })} />


                                    {queen.isMarked && (
                                        <>
                                            <Text style={styles.label}>اللون</Text>
                                            <View style={styles.inputContainer}>
                                                <Picker
                                                    selectedValue={queen.color}
                                                    onValueChange={(value) => setQueen({ ...queen, color: value })}
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
                                            selectedValue={queen.origin}
                                            onValueChange={(value) => setQueen({ ...queen, origin: value })}
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
        textAlign: 'right'
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
        fontSize: 14,
        fontWeight: 'bold',
        color: '#373737',

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
});

export default AddHiveModal;
