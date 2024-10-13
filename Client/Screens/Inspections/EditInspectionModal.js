import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, Modal, Switch, Alert, TextInput, Pressable, Platform, TouchableHighlight, TouchableOpacity } from 'react-native'; // Added Pressable and Platform
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import axios from '../../axiosConfig';
import {
    queenColors,
    queen_cells,
    temperament,
    force,
    brood,
    malebrood,
    supplies,
    units,
    diseases,
    treatments,
    doses,
    HoneyPollenHarvest,
    options,

} from '../Data';

const Option = React.memo(({ option, isSelected, onPressHandler, quantity, onQuantityChange }) => (
    <TouchableOpacity
        key={option.name}
        style={[
            styles.option,
            isSelected ? styles.selectedOption : null
        ]}
        onPress={onPressHandler}
    >
        <Text style={styles.optionText}>{option.name}</Text>
        {isSelected && (
            <TextInput
                value={quantity.toString()}
                onChangeText={onQuantityChange}
                style={[
                    styles.textInput,
                    { width: 50, marginBottom: 5 },
                ]}
                keyboardType="numeric"
                placeholder="الكمية"
            />
        )}
    </TouchableOpacity>
));


const EditInspectionModal = ({
    modalVisible,
    setModalVisible,
    formData,
    handleModalInputChange,
    navigation
}) => {

    const [showPickerFrom, setShowPickerFrom] = useState(false);
    const [showPickerTo, setShowPickerTo] = useState(false);





    const togglePickerFrom = () => {
        setShowPickerFrom(!showPickerFrom);
    };

    const togglePickerTo = () => {
        setShowPickerTo(!showPickerTo);
    };

    const handleDateChangeFrom = (event, selectedDate) => {
        const currentDate = selectedDate || formData.BeeHealth.duration.from || new Date();
        setShowPickerFrom(Platform.OS === 'ios');
        handleModalInputChange('BeeHealth', 'duration', {
            ...formData.BeeHealth.duration,
            from: currentDate,
        });
    };

    const handleDateChangeTo = (event, selectedDate) => {
        const currentDate = selectedDate || formData.BeeHealth.duration.to || new Date();
        setShowPickerTo(Platform.OS === 'ios');
        handleModalInputChange('BeeHealth', 'duration', {
            ...formData.BeeHealth.duration,
            to: currentDate,
        });
    };


    const [selectedAjouts, setSelectedAjouts] = useState([]);
    const [selectedEnlevements, setSelectedEnlevements] = useState([]);

    useEffect(() => {
        if (modalVisible) {
            if (formData.Adding) {
                const initialAjouts = formData.Adding.ActivityAdd && formData.Adding.ActivityAdd
                    ? formData.Adding.ActivityAdd.split(', ').map(item => {
                        const [name, quantity] = item.split(': ');
                        return { name, quantity: parseInt(quantity) };
                    })
                    : [];
                setSelectedAjouts(initialAjouts);

            }
            if (formData.Removing) {
                const initialEnlevements = formData.Removing.ActivityRemove && formData.Removing.ActivityRemove
                    ? formData.Removing.ActivityRemove.split(', ').map(item => {
                        const [name, quantity] = item.split(': ');
                        return { name, quantity: parseInt(quantity) };
                    })
                    : [];

                setSelectedEnlevements(initialEnlevements);
            }

        }
    }, [modalVisible]);

    const handleActionChange = (type, itemName, quantity) => {
        const selectedItems = type === 'Adding' ? selectedAjouts : selectedEnlevements;
        const setSelectedItems = type === 'Adding' ? setSelectedAjouts : setSelectedEnlevements;
        const index = selectedItems.findIndex(item => item.name === itemName);

        if (index !== -1) {
            const updatedItems = [...selectedItems];
            updatedItems[index] = { name: itemName, quantity };
            setSelectedItems(updatedItems.filter(item => item.quantity > 0));
        } else {
            setSelectedItems([...selectedItems, { name: itemName, quantity }]);
        }
    };

    const renderOption = (option, selectedItems, handleChange, type) => {
        const selectedItem = selectedItems.find(item => item.name === option.name);
        const isSelected = !!selectedItem;
        const quantity = selectedItem ? selectedItem.quantity : 0;

        const onPressHandler = () => {
            handleChange(type, option.name, quantity);
        };

        const onQuantityChange = (text) => {
            const quantity = parseInt(text);
            if (isNaN(quantity) || quantity < 0) {
                handleChange(type, option.name, 0);
            } else {
                handleChange(type, option.name, quantity);
            }
        };

        return (
            <Option
                key={option.name}
                option={option}
                isSelected={isSelected}
                onPressHandler={onPressHandler}
                quantity={quantity}
                onQuantityChange={onQuantityChange}
            />
        );
    };

    useEffect(() => {
        const activitiesAdd = selectedAjouts.map(activity => `${activity.name}: ${activity.quantity}`);
        const quantityAdded = selectedAjouts.reduce((total, item) => total + item.quantity, 0);

        const activitiesRemove = selectedEnlevements.map(activity => `${activity.name}: ${activity.quantity}`);
        const quantityRemoved = selectedEnlevements.reduce((total, item) => total + item.quantity, 0);

        handleModalInputChange('Adding', 'ActivityAdd', activitiesAdd.join(', '));
        handleModalInputChange('Adding', 'QuantityAdded', quantityAdded);

        handleModalInputChange('Removing', 'ActivityRemove', activitiesRemove.join(', '));
        handleModalInputChange('Removing', 'QuantityRemoved', quantityRemoved);



    }, [selectedAjouts, selectedEnlevements]);


    const handleSave = async () => {
        const filteredAjouts = selectedAjouts ? selectedAjouts.filter(activity => activity.quantity > 0) : [];
        const filteredEnlevements = selectedEnlevements ? selectedEnlevements.filter(activity => activity.quantity > 0) : [];


        const activitiesAdd = filteredAjouts.map(activity => `${activity.name}: ${activity.quantity}`).join(', ');
        const quantityAdded = filteredAjouts.reduce((total, item) => total + item.quantity, 0);

        const activitiesRemove = filteredEnlevements.map(activity => `${activity.name}: ${activity.quantity}`).join(', ');
        const quantityRemoved = filteredEnlevements.reduce((total, item) => total + item.quantity, 0);

        const updatedFormData = { ...formData };
        updatedFormData.Adding = {
            ActivityAdd: activitiesAdd,
            QuantityAdded: quantityAdded
        };
        updatedFormData.Removing = {
            ActivityRemove: activitiesRemove,
            QuantityRemoved: quantityRemoved
        };

        try {
            if (!updatedFormData.Colony.strength || !updatedFormData.Colony.temperament || updatedFormData.Colony.deadBees === undefined) {
                return Alert.alert('خطأ', 'معلومات المستعمرة مطلوبة');
            }

            if (updatedFormData.Queen) {

                if (updatedFormData.Queen.seen) {
                    if (updatedFormData.Queen.isMarked && updatedFormData.Queen.color === '') {
                        return Alert.alert('خطأ', 'يرجى اختيار لون للملكة');
                    }
                    if (!updatedFormData.Queen.temperament || !updatedFormData.Queen.queenCells) {
                        return Alert.alert('خطأ', 'يرجى إكمال معلومات الملكة');
                    }
                } else {
                    updatedFormData.Queen.seen = false;
                    updatedFormData.Queen.isMarked = false;
                    updatedFormData.Queen.color = '';
                    updatedFormData.Queen.clipped = false;
                    updatedFormData.Queen.temperament = '';
                    updatedFormData.Queen.note = '';
                    updatedFormData.Queen.queenCells = '';
                    updatedFormData.Queen.isSwarmed = false;
                }
            }


            if (!updatedFormData.Colony.supers | !updatedFormData.Colony.pollenFrames | !updatedFormData.Colony.TotalFrames) {
                return Alert.alert('خطأ', 'معلومات المعدات مطلوبة');
            }
            if (!updatedFormData.Brood.state || !updatedFormData.Brood.maleBrood || updatedFormData.Brood.totalBrood === undefined || updatedFormData.DronesSeen === undefined) {
                return Alert.alert('خطأ', 'معلومات الحضنة والذكور مطلوبة');
            }

            if (!updatedFormData.HoneyStores) {
                return Alert.alert('خطأ', 'مخزونات العسل مطلوبة');
            }
            if (!updatedFormData.PollenStores) {
                return Alert.alert('خطأ', 'مخزونات حبوب اللقاح مطلوبة');
            }
            const response = await axios.post('/inspection/editInspection', updatedFormData);

            if (response.status === 200) {
                Alert.alert(
                    'نجاح',
                    'تم تحديث المتابعة بنجاح',
                    [{ text: 'موافق' }],
                    { cancelable: false }
                );
                console.log('تم تحديث المتابعة بنجاح');
            } else {
                Alert.alert(
                    'خطأ',
                    'فشل في تحديث المتابعة',
                    [{ text: 'موافق' }],
                    { cancelable: false }
                );
                console.error('Error updating inspection:', error);
            }

            setModalVisible(false);
            navigation.navigate('Home')

        } catch (error) {
            Alert.alert(
                'خطأ',
                'حدث خطأ أثناء تحديث المتابعة',
                [{ text: 'موافق' }],
                { cancelable: false }
            );
            console.error('خطأ في تحديث المتابعة:', error);
        }
    };


    return (
        <Modal visible={modalVisible} animationType="fade" transparent={true} statusBarTranslucent={true}
        >

            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>تعديل المتابعة الدورية</Text>

                    <ScrollView style={styles.modalContent}>

                        {/* Queen section */}
                        {formData.Queen && (
                            <View style={styles.fieldset}>
                                <Text style={styles.fieldsetTitle}>الملكة</Text>
                                <View style={[styles.detailItem, styles.inline]}>
                                    <Text style={styles.label}>
                                        موجودة</Text>
                                    <Switch
                                        value={formData.Queen.seen}
                                        onValueChange={(value) => handleModalInputChange('Queen', 'seen', value)}
                                    />
                                </View>
                                {formData.Queen.seen && (
                                    <>
                                        <View style={[styles.detailItem, styles.inline]}>
                                            <Text style={styles.label}>مقيدة</Text>
                                            <Switch
                                                value={formData.Queen.clipped}
                                                onValueChange={(value) => handleModalInputChange('Queen', 'clipped', value)}
                                            />
                                        </View>
                                        <View style={[styles.detailItem, styles.inline]}>
                                            <Text style={styles.label}>مُتسربة</Text>
                                            <Switch
                                                value={formData.Queen.isSwarmed}
                                                onValueChange={(value) => handleModalInputChange('Queen', 'isSwarmed', value)}
                                            />
                                        </View>
                                        <View style={[styles.detailItem, styles.inline]}>
                                            <Text style={styles.label}>معلمة</Text>
                                            <Switch
                                                value={formData.Queen.isMarked}
                                                onValueChange={(value) => handleModalInputChange('Queen', 'isMarked', value)}
                                            />
                                        </View>

                                        {formData.Queen.isMarked && (
                                            <View style={styles.modalRow}>
                                                {formData.Queen.color ? (<Picker
                                                    selectedValue={formData.Queen.color}
                                                    style={[styles.modalInput, { backgroundColor: '#FBF5E0' }]}
                                                    onValueChange={(value) => handleModalInputChange('Queen', 'color', value)}
                                                >
                                                    {queenColors.map((color, index) => (
                                                        <Picker.Item key={index} label={color} value={color} />
                                                    ))}
                                                </Picker>) : (<Picker
                                                    selectedValue={formData.Queen.color}
                                                    style={[styles.modalInput, { backgroundColor: '#FBF5E0' }]}
                                                    onValueChange={(value) => handleModalInputChange('Queen', 'color', value)}
                                                >

                                                    <Picker.Item label="اختر..." value="" enabled={false} />
                                                    {queenColors.map((color, index) => (
                                                        <Picker.Item key={index} label={color} value={color} />
                                                    ))}
                                                </Picker>)}
                                                <Text style={styles.modalLabel}>اللون</Text>

                                            </View>
                                        )}


                                        <View style={styles.modalRow}>
                                            {formData.Queen.temperament ? (<Picker
                                                selectedValue={formData.Queen.temperament}
                                                style={[styles.modalInput, { backgroundColor: '#FBF5E0' }]}
                                                onValueChange={(value) => handleModalInputChange('Queen', 'temperament', value)}
                                            >
                                                {temperament.map((state, index) => (
                                                    <Picker.Item key={index} label={state} value={state} />
                                                ))}
                                            </Picker>) : (<Picker
                                                selectedValue={formData.Queen.temperament}
                                                style={[styles.modalInput, { backgroundColor: '#FBF5E0' }]}
                                                onValueChange={(value) => handleModalInputChange('Queen', 'temperament', value)}
                                            >
                                                <Picker.Item label="اختر..." value="" enabled={false} />
                                                {temperament.map((state, index) => (
                                                    <Picker.Item key={index} label={state} value={state} />
                                                ))}
                                            </Picker>)}
                                            <Text style={styles.modalLabel}>سلوك الملكة</Text>


                                        </View>

                                        <View style={styles.modalRow}>
                                            {formData.Queen.queenCells ? (<Picker
                                                selectedValue={formData.Queen.queenCells}
                                                style={[styles.modalInput, { backgroundColor: '#FBF5E0' }]}
                                                onValueChange={(value) => handleModalInputChange('Queen', 'queenCells', value)}
                                            >
                                                {queen_cells.map((state, index) => (
                                                    <Picker.Item key={index} label={state} value={state} />
                                                ))}
                                            </Picker>) : (<Picker
                                                selectedValue={formData.Queen.queenCells}
                                                style={[styles.modalInput, { backgroundColor: '#FBF5E0' }]}
                                                onValueChange={(value) => handleModalInputChange('Queen', 'queenCells', value)}
                                            >
                                                <Picker.Item label="اختر..." value="" enabled={false} />
                                                {queen_cells.map((state, index) => (
                                                    <Picker.Item key={index} label={state} value={state} />
                                                ))}
                                            </Picker>)}
                                            <Text style={styles.modalLabel}>الخلايا الملكية</Text>


                                        </View>


                                        <View style={styles.modalRow}>
                                            <TextInput
                                                style={[styles.modalInput, styles.modalTextArea]}
                                                multiline
                                                numberOfLines={4}
                                                value={formData.Queen.note}
                                                onChangeText={(value) => handleModalInputChange('Queen', 'note', value)}
                                            />
                                            <Text style={styles.modalLabel}>ملاحظة</Text>

                                        </View>
                                    </>
                                )}
                            </View>)}


                        {/* Equipment section */}

                        <View style={styles.fieldset}>
                            <Text style={styles.fieldsetTitle}>المعدات</Text>
                            <View style={styles.modalRow}>
                                <TextInput
                                    style={[styles.textInput, styles.inlineInput]}
                                    keyboardType="numeric"
                                    value={formData.Colony.supers.toString()}
                                    onChangeText={(value) => handleModalInputChange('Colony', 'supers', value)}
                                />
                                <Text style={styles.modalLabel}>عدد العسالات                   </Text>

                            </View>
                            <View style={styles.modalRow}>

                                <TextInput
                                    style={[styles.textInput, styles.inlineInput]}
                                    keyboardType="numeric"
                                    value={formData.Colony.pollenFrames.toString()}
                                    onChangeText={(value) => handleModalInputChange('Colony', 'pollenFrames', value)}
                                />
                                <Text style={styles.modalLabel}>عدد إطارات حبوب اللقاح </Text>
                            </View>
                            <View style={styles.modalRow}>

                                <TextInput
                                    style={[styles.textInput, styles.inlineInput]}
                                    keyboardType="numeric"
                                    value={formData.Colony.TotalFrames.toString()}
                                    onChangeText={(value) => handleModalInputChange('Colony', 'TotalFrames', value)}
                                />
                                <Text style={styles.modalLabel}>إجمالي الإطارات              </Text>
                            </View>
                        </View>


                        {/* Supplies section */}
                        {formData.Supplies && (<View style={styles.fieldset}>
                            <Text style={styles.fieldsetTitle}>غذاء النحل</Text>
                            <View style={styles.modalRow}>

                                <Picker
                                    selectedValue={formData.Supplies.product}
                                    style={[styles.modalInput, { backgroundColor: '#FBF5E0' }]}
                                    onValueChange={(value) => handleModalInputChange('Supplies', 'product', value)}
                                >
                                    {supplies.map((product, index) => (
                                        <Picker.Item key={index} label={product} value={product} />
                                    ))}
                                </Picker>
                                <Text style={styles.modalLabel}>المنتج </Text>
                            </View>
                            <View style={styles.modalRow}>

                                <TextInput
                                    style={styles.modalInput}
                                    value={formData.Supplies.ingredients.name}
                                    onChangeText={(value) => handleModalInputChange('Supplies', 'ingredients', { name: value })}
                                />
                                <Text style={styles.modalLabel}>المكونات </Text>
                            </View>
                            <View style={styles.modalRow}>

                                <TextInput
                                    style={styles.modalInput}
                                    keyboardType="numeric"
                                    value={formData.Supplies.ingredients.quantity.toString()}
                                    onChangeText={(value) => handleModalInputChange('Supplies', 'ingredients', { quantity: value })}
                                />
                                <Text style={styles.modalLabel}>الكمية </Text>
                            </View>
                            <View style={styles.modalRow}>

                                <Picker
                                    selectedValue={formData.Supplies.ingredients.unit}
                                    style={[styles.modalInput, { backgroundColor: '#FBF5E0' }]}
                                    onValueChange={(value) => handleModalInputChange('Supplies', 'ingredients', { unit: value })}
                                >
                                    {units.map((unit, index) => (
                                        <Picker.Item key={index} label={unit} value={unit} />
                                    ))}
                                </Picker>
                                <Text style={styles.modalLabel}>الوحدة </Text>
                            </View>
                            <View style={styles.modalRow}>

                                <TextInput
                                    style={[styles.modalInput, styles.modalTextArea]}
                                    multiline
                                    numberOfLines={4}
                                    value={formData.Supplies.note}
                                    onChangeText={(value) => handleModalInputChange('Supplies', 'note', value)}
                                />
                                <Text style={styles.modalLabel}>ملاحظة </Text>
                            </View>
                        </View>)}


                        {/* Brood Details */}
                        <View style={styles.fieldset}>
                            <Text style={styles.fieldsetTitle}>الحضنة والذكور</Text>

                            <View style={[styles.detailItem, styles.inline]}>
                                <Text style={styles.label}>الحالة </Text>
                                <Picker
                                    style={[styles.textInput, styles.inlineInput, { backgroundColor: '#FBF5E0' }]}
                                    selectedValue={formData.Brood.state}
                                    onValueChange={(value) => handleModalInputChange('Brood', 'state', value)}
                                >
                                    <Picker.Item label="اختر..." value="" enabled={false} />

                                    {brood.map((state, index) => (
                                        <Picker.Item key={index} label={state} value={state} />
                                    ))}
                                </Picker>
                            </View>

                            <View style={[styles.detailItem, styles.inline]}>
                                <Text style={styles.label}>إجمالي الحضنة </Text>
                                <TextInput
                                    style={[styles.textInput, styles.inlineInput]}
                                    keyboardType='numeric'
                                    onChangeText={(value) => handleModalInputChange('Brood', 'totalBrood', value)}
                                    value={formData.Brood.totalBrood.toString()}
                                />
                            </View>

                            <View style={[styles.detailItem, styles.inline]}>
                                <Text style={styles.label}>حضنة الذكور </Text>
                                <Picker
                                    style={[styles.textInput, styles.inlineInput, { backgroundColor: '#FBF5E0' }]}
                                    selectedValue={formData.Brood.maleBrood}
                                    onValueChange={(value) => handleModalInputChange('Brood', 'maleBrood', value)}
                                >
                                    <Picker.Item label="اختر..." value="" enabled={false} />

                                    {malebrood.map((state, index) => (
                                        <Picker.Item key={index} label={state} value={state} />
                                    ))}
                                </Picker>
                            </View>

                            <View style={[styles.detailItem, styles.inline]}>
                                <Text style={styles.label}>وجود الذكور </Text>
                                <Switch

                                    onValueChange={(value) => handleModalInputChange('DronesSeen', value)}
                                    value={formData.DronesSeen}
                                />
                            </View>
                        </View>


                        {/* Colony section */}
                        <View style={styles.fieldset}>
                            <Text style={styles.fieldsetTitle}>المستعمرة</Text>
                            <View style={[styles.detailItem, styles.inline]}>
                                <Text style={styles.label}>وجود نحل ميت</Text>

                                <Switch
                                    value={formData.Colony.deadBees}
                                    onValueChange={(value) => handleModalInputChange('Colony', 'deadBees', value)}
                                />

                            </View>
                            {/* Additional Colony fields */}
                            <View style={styles.modalRow}>

                                <Picker
                                    selectedValue={formData.Colony.temperament}
                                    style={[styles.modalInput, { backgroundColor: '#FBF5E0' }]}
                                    onValueChange={(value) => handleModalInputChange('Colony', 'temperament', value)}
                                >
                                    {temperament.map((state, index) => (
                                        <Picker.Item key={index} label={state} value={state} />
                                    ))}
                                </Picker>
                                <Text style={styles.modalLabel}>سلوك المستعمرة </Text>
                            </View>
                            <View style={styles.modalRow}>
                                <Picker
                                    selectedValue={formData.Colony.strength}
                                    style={[styles.modalInput, { backgroundColor: '#FBF5E0' }]}
                                    onValueChange={(value) => handleModalInputChange('Colony', 'strength', value)}
                                >
                                    {/* Add strength options dynamically */}
                                    {force.map((state, index) => (
                                        <Picker.Item key={index} label={state} value={state} />
                                    ))}
                                </Picker>
                                <Text style={styles.modalLabel}>قوة المستعمرة </Text>

                            </View>
                            <View style={styles.modalRow}>

                                <TextInput
                                    style={[styles.modalInput, styles.modalTextArea]}
                                    multiline
                                    numberOfLines={4}
                                    value={formData.Colony.note}
                                    onChangeText={(value) => handleModalInputChange('Colony', 'note', value)}
                                />
                                <Text style={styles.modalLabel}>ملاحظة </Text>
                            </View>
                        </View>


                        {/* Treatment Details */}
                        {formData.BeeHealth && (<View style={styles.fieldset}>
                            <Text style={styles.fieldsetTitle}>صحة النحل</Text>

                            <View style={[styles.detailItem, styles.inline]}>
                                <Text style={styles.label}>المرض </Text>
                                <Picker
                                    style={[styles.textInput, styles.inlineInput, { backgroundColor: '#FBF5E0' }]}
                                    selectedValue={formData.BeeHealth.disease}
                                    onValueChange={(value) => handleModalInputChange('BeeHealth', 'disease', value)}
                                >
                                    <Picker.Item label="اختر..." value="" enabled={false} />

                                    {diseases.map((state, index) => (
                                        <Picker.Item key={index} label={state} value={state} />
                                    ))}
                                </Picker>
                            </View>

                            <View style={[styles.detailItem, styles.inline]}>
                                <Text style={styles.label}>العلاج </Text>
                                <Picker
                                    style={[styles.textInput, styles.inlineInput, { backgroundColor: '#FBF5E0' }]}
                                    selectedValue={formData.BeeHealth.treatment}
                                    onValueChange={(value) => handleModalInputChange('BeeHealth', 'treatment', value)}
                                >
                                    <Picker.Item label="اختر..." value="" enabled={false} />

                                    {treatments.map((state, index) => (
                                        <Picker.Item key={index} label={state} value={state} />
                                    ))}
                                </Picker>
                            </View>

                            <View style={styles.fieldset}>
                                <Text style={styles.fieldsetTitle}>المدة</Text>
                                <View>
                                    <View style={[styles.detailItem, styles.inline]}>
                                        <Text style={styles.label}>من </Text>
                                        <Pressable onPress={togglePickerFrom}>
                                            <Text style={[styles.textInput, styles.inlineInput]}>
                                                {formData.BeeHealth.duration.from ? new Date(formData.BeeHealth.duration.from).toLocaleDateString('fr-FR') : 'حدد تاريخا'}
                                            </Text>
                                        </Pressable>
                                    </View>
                                    {showPickerFrom && (
                                        <DateTimePicker
                                            testID="dateTimePickerFrom"
                                            value={new Date(formData.BeeHealth.duration.from || Date.now())}
                                            mode="date"
                                            is24Hour={true}
                                            display="default"
                                            onChange={handleDateChangeFrom}
                                            locale="fr"
                                        />
                                    )}
                                </View>

                                <View>
                                    <View style={[styles.detailItem, styles.inline]}>
                                        <Text style={styles.label}>إلى </Text>
                                        <Pressable onPress={togglePickerTo}>
                                            <Text style={[styles.textInput, styles.inlineInput]}>
                                                {formData.BeeHealth.duration.to ? new Date(formData.BeeHealth.duration.to).toLocaleDateString('fr-FR') : 'حدد تاريخا'}
                                            </Text>
                                        </Pressable>
                                    </View>
                                    {showPickerTo && (
                                        <DateTimePicker
                                            testID="dateTimePickerTo"
                                            value={new Date(formData.BeeHealth.duration.to || Date.now())}
                                            mode="date"
                                            is24Hour={true}
                                            display="default"
                                            onChange={handleDateChangeTo}
                                            locale="fr"
                                        />
                                    )}
                                </View>
                            </View>



                            <View style={[styles.detailItem, styles.inline]}>
                                <Text style={styles.label}>الكمية </Text>
                                <TextInput
                                    style={[styles.textInput, styles.inlineInput]}
                                    keyboardType='numeric'
                                    onChangeText={(value) => handleModalInputChange('BeeHealth', 'quantity', value)}
                                    value={formData.BeeHealth?.quantity ? formData.BeeHealth.quantity.toString() : ''}
                                />
                            </View>




                            <View style={[styles.detailItem, styles.inline]}>
                                <Text style={styles.label}>الجرعات </Text>
                                <Picker
                                    style={[styles.textInput, styles.inlineInput, { backgroundColor: '#FBF5E0' }]}
                                    selectedValue={formData.BeeHealth.doses}
                                    onValueChange={(value) => handleModalInputChange('BeeHealth', 'doses', value)}
                                >
                                    <Picker.Item label="اختر..." value="" enabled={false} />

                                    {doses.map((state, index) => (
                                        <Picker.Item key={index} label={state} value={state} />
                                    ))}
                                </Picker>
                            </View>

                            <View style={[styles.detailItem, styles.inline]}>
                                <Text style={styles.label}>ملاحظة </Text>
                                <TextInput
                                    style={[styles.textInput, styles.inlineInput, styles.textArea]}
                                    multiline={true}
                                    numberOfLines={4}
                                    onChangeText={(value) => handleModalInputChange('BeeHealth', 'note', value)}
                                    value={formData.BeeHealth.note}
                                />
                            </View>
                        </View>)}



                        {/* Honey and Pollen stores Details */}
                        <View style={styles.fieldset}>
                            <Text style={styles.fieldsetTitle}>الحصاد</Text>

                            <View style={[styles.detailItem, styles.inline]}>
                                <Text style={styles.label}>حصاد العسل  </Text>
                                <Picker
                                    style={[styles.textInput, styles.inlineInput, { backgroundColor: '#FBF5E0' }]}
                                    selectedValue={formData.HoneyStores}
                                    onValueChange={(value) => handleModalInputChange('HoneyStores', value)}
                                >
                                    <Picker.Item label="اختر..." value="" enabled={false} />

                                    {HoneyPollenHarvest.map((state, index) => (
                                        <Picker.Item key={index} label={state} value={state} />
                                    ))}
                                </Picker>
                            </View>

                            <View style={[styles.detailItem, styles.inline]}>
                                <Text style={styles.label}>حصاد حبوب اللقاح </Text>
                                <Picker
                                    style={[styles.textInput, styles.inlineInput, { backgroundColor: '#FBF5E0' }]}
                                    selectedValue={formData.PollenStores}
                                    onValueChange={(value) => handleModalInputChange('PollenStores', value)}
                                >
                                    <Picker.Item label="اختر..." value="" enabled={false} />

                                    {HoneyPollenHarvest.map((state, index) => (
                                        <Picker.Item key={index} label={state} value={state} />
                                    ))}
                                </Picker>
                            </View>
                        </View>



                        {/* Actions Taken */}

                        <View style={styles.fieldset}>
                            <Text style={styles.fieldsetTitle}>الأنشطة</Text>
                            <View style={styles.frameContainer}>

                                <View style={styles.frame}>
                                    <Text style={styles.frameTitle}>الاضافات</Text>
                                    <View style={styles.optionsContainer}>
                                        {options.map((option) => renderOption(option, selectedAjouts, handleActionChange, 'Adding'))}
                                    </View>
                                </View>




                                <View style={styles.frame}>
                                    <Text style={styles.frameTitle}>الإزالات</Text>
                                    <View style={styles.optionsContainer}>
                                        {options.map((option) => renderOption(option, selectedEnlevements, handleActionChange, 'Removing'))}
                                    </View>
                                </View>




                            </View>
                        </View>


                        {/* Note Details */}
                        <Text style={styles.fieldsetTitle}>ملاحظة</Text>
                        <View style={styles.modalRow}>
                            <TextInput
                                style={[styles.textInput, styles.inlineInput, styles.textArea]}
                                multiline
                                numberOfLines={4}
                                value={formData.Note}
                                onChangeText={(value) => handleModalInputChange('Note', value)}
                            />
                        </View>



                    </ScrollView>

                    {/* Modal footer */}
                    <View style={styles.modalFooter}>
                        <TouchableHighlight
                            style={[styles.button, styles.closeButton]}
                            underlayColor="#D1D1D1"
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.buttonText}>إلغاء</Text>
                        </TouchableHighlight>
                        <TouchableHighlight
                            style={[styles.button, styles.saveButton]}
                            underlayColor="#FFCC02"
                            onPress={handleSave}
                        >
                            <Text style={styles.buttonText}>تعديل</Text>
                        </TouchableHighlight>
                    </View>

                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        marginTop: 25,
        marginBottom: 20,
        borderRadius: 20

    },
    modalTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: '#977700',
        textAlign: 'center',
        marginBottom: 20,
    },
    modalContent: {
        flex: 1,
    },
    modalSection: {
        marginBottom: 16,
    },
    modalHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    modalRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    modalLabel: {
        fontWeight: 'bold',
        color: '#333',
    },
    modalInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 8,
        width: '60%',
        marginBottom: 8,
    },
    modalTextArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    modalFooter: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,

    },


    detailItem: {
        marginBottom: 15,
    },
    label: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#342D21',
        marginBottom: 8,
    },
    textInput: {
        fontSize: 16,
        fontWeight: '400',
        width: 150,
        color: '#797979',
        marginLeft: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
    },

    fieldset: {
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
    },
    fieldsetTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        alignSelf: 'center',
        color: '#342D21',
    },
    inline: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
    },
    inlineInput: {
        flex: 1,
        marginLeft: 15,
    },

    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },

    button: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginHorizontal: 5,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeButton: {
        backgroundColor: '#E0E0E0',
    },
    saveButton: {
        backgroundColor: '#FEE502',
    },
    buttonText: {
        fontWeight: 'bold',
        color: '#373737',
    },
    optionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 10,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },

    option: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 8,
        marginRight: 5,
        marginBottom: 5,
    },
    optionText: {
        fontSize: 14,
    },
    selectedOption: {
        backgroundColor: '#B8E986',
    },

    frameContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    frame: {
        flex: 1,
        marginLeft: 5,
        marginRight: 5,
        borderWidth: 1,
        borderColor: '#977700',
        borderRadius: 8,
        padding: 10,
    },
    frameTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 10,
        alignSelf: 'center',
        color: '#342D21',
    },
});

export default EditInspectionModal;