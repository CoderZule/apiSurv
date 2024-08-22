import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import EditHarvestModal from './EditHarvestModal';
import axios from '../../axiosConfig';
import { FontAwesome5 } from '@expo/vector-icons';

const HarvestDetailsScreen = ({ route, navigation }) => {
    const { harvestData, badge, apiaries, hives } = route.params;
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
            const response = await axios.delete(`/harvest/deleteHarvest/${harvestId}`);
            if (response.status === 200) {
                console.log('Harvest deleted successfully');
                showAlertAndNavigate('تم حذف الحصاد بنجاح');
            } else {
                console.error('Failed to delete harvest:', response.data.message);
                showAlert('فشل في حذف الحصاد');
            }
        } catch (error) {
            console.error('Error deleting harvest:', error.message);
            showAlert('خطأ في حذف الحصاد');
        }
    };

    const showAlertAndNavigate = (message) => {
        Alert.alert(
            'نجاح',
            message,
            [{ text: 'موافق', onPress: () => navigation.goBack() }],
            { cancelable: false }
        );
    };

    const showAlert = (message) => {
        Alert.alert('خطأ', message, [{ text: 'موافق' }], { cancelable: false });
    };

    const confirmDelete = (harvestId) => {
        Alert.alert(
            'تأكيد',
            'هل أنت متأكد أنك تريد حذف هذا الحصاد؟',
            [
                { text: 'إلغاء', style: 'cancel' },
                {
                    text: 'حذف',
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
                    <Text style={{ color: 'white', fontSize: 12 }}>آخر حصاد</Text>
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
                    <Text style={styles.value}>{formData.Apiary}</Text>
                    <View style={styles.labelContainer}>
                        <Text style={styles.label}>المنحل</Text>
                        <Ionicons name="trail-sign-outline" size={14} color="#977700" />
                    </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.row}>
                    <Text style={styles.value}>{formData.Hive}</Text>
                    <View style={styles.labelContainer}>
                        <Text style={styles.label}>الخلية</Text>
                        <FontAwesome5 name="archive" size={14} color="#977700" />
                    </View>
                </View>
                <View style={styles.divider} />

                <View style={styles.row}>
                    <Text style={styles.value}>{formData.Product}</Text>
                    <View style={styles.labelContainer}>
                        <Text style={styles.label}>المنتج</Text>
                        <Ionicons name="flower-outline" size={14} color="orange" />
                    </View>

                </View>

                <View style={styles.divider} />

                <View style={styles.row}>
                    <Text style={styles.value}>{formData.Quantity}</Text>
                    <View style={styles.labelContainer}>
                        <Text style={styles.label}>الكمية</Text>
                        <Ionicons name="layers-outline" size={14} color="brown" />
                    </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.row}>
                    <Text style={styles.value}>{formData.Unit}</Text>
                    <View style={styles.labelContainer}>
                        <Text style={styles.label}>الوحدة</Text>
                        <Ionicons name="eyedrop-outline" size={14} color="#5188C7" />
                    </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.row}>
                    <Text style={styles.value}>{formData.Season}</Text>
                    <View style={styles.labelContainer}>
                        <Text style={styles.label}>الموسم</Text>
                        <Ionicons name="leaf-outline" size={14} color="#2EB922" />
                    </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.row}>
                    <Text style={styles.valueLine}>{formData.HarvestMethods}</Text>
                    <View style={styles.labelContainer}>
                        <Text style={styles.label}>طريقة الحصاد</Text>
                        <Ionicons name="construct-outline" size={14} color="gray" />
                    </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.row}>
                    <Text style={styles.value}>{formData.QualityTestResults}</Text>
                    <View style={styles.labelContainer}>
                        <Text style={styles.label}>نتائج اختبارات الجودة</Text>
                        <Ionicons name="checkmark-circle-outline" size={14} color="#2EB922" />
                    </View>
                </View>
                <View style={styles.divider} />

                <View style={styles.row}>
                    <Text style={styles.value}>{new Date(formData.Date).toLocaleDateString('fr-FR')}</Text>
                    <View style={styles.labelContainer}>
                        <Text style={styles.label}>التاريخ</Text>
                        <Ionicons name="calendar-outline" size={14} color="#977700" />
                    </View>
                    
                </View>
            </View>

            <EditHarvestModal
                visible={modalVisible}
                onSave={() => {

                    setModalVisible(false);
                }}
                onCancel={() => setModalVisible(false)}
                formData={formData}
                onInputChange={handleModalInputChange}
                apiaries={apiaries}
                hives={hives}
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
        flexWrap: 'wrap',
        alignItems: 'center',
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 5,
    },
    value: {
        fontSize: 15,
        maxWidth: '100%',
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
        justifyContent: 'space-between',
        marginBottom: 20,
    },

    badgeContainer: {
        position: 'relative',
    },
    iconsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 'auto',
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