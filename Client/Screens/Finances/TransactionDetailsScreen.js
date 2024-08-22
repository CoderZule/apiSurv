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
                showAlertAndNavigate('تم حذف المعاملة بنجاح');
            } else {
                console.error('Failed to delete transaction:', response.data.message);
                showAlert('فشل حذف المعاملة');
            }
        } catch (error) {
            console.error('Error deleting transaction:', error.message);
            showAlert('خطأ أثناء حذف المعاملة');
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

    const confirmDelete = (transactionId) => {
        Alert.alert(
            'تأكيد',
            'هل أنت متأكد أنك تريد حذف هذه المعاملة؟',
            [
                { text: 'إلغاء', style: 'cancel' },
                {
                    text: 'حذف',
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
                    <Text style={{ color: 'white', fontSize: 12 }}>آخر معاملة</Text>
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

                    <Text style={styles.value}>{formData.OperationType}</Text>
                    <View style={styles.labelContainer}>
                        <Text style={styles.label}>نوع العملية</Text>
                        <Ionicons name="settings-outline" size={14} color="gray" />
                    </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.row}>

                    <Text style={styles.valueLine}>{formData.Description}</Text>
                    <View style={styles.labelContainer}>
                        <Text style={styles.label}>الوصف</Text>
                        <Ionicons name="newspaper-outline" size={14} color="blue" />
                    </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.row}>

                    <Text style={styles.value}>{new Date(formData.TransactionDate).toLocaleDateString('fr-FR')}</Text>
                    <View style={styles.labelContainer}>
                        <Text style={styles.label}>التاريخ</Text>
                        <Ionicons name="calendar-number-outline" size={14} color="#977700" />
                    </View>
                </View>

                <View style={styles.divider} />


                <View style={styles.row}>

                    <Text style={styles.value}>{formData.Category}</Text>
                    <View style={styles.labelContainer}>
                        <Text style={styles.label}>الفئة</Text>
                        <Ionicons name="grid-outline" size={14} color="orange" />
                    </View>
                </View>
                <View style={styles.divider} />

                <View style={styles.row}>
                    <Text style={styles.value}>{formData.Amount}</Text>
                    <View style={styles.labelContainer}>
                        <Text style={styles.label}>المبلغ</Text>
                        <Ionicons name="cash-outline" size={14} color="green" />
                    </View>
                </View>


                {formData.Note &&
                    (<><View style={styles.divider} />

                        <View style={styles.row}>
                            <Text style={styles.value}>{formData.Note}</Text>
                            <View style={styles.labelContainer}>
                                <Text style={styles.label}>ملاحظة</Text>
                                <Ionicons name="receipt-outline" size={14} color="pink" />
                            </View>
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


export default TransactionDetailsScreen;