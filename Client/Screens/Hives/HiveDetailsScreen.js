import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from '../../axiosConfig';
import EditHiveModal from './EditHiveModal';
import SvgQRCode from 'react-native-qrcode-svg';   
import { FontAwesome5 } from '@expo/vector-icons';

const HiveDetailsScreen = ({ route, navigation }) => {
    const { hiveData, badge, apiaries } = route.params;
    const [modalVisible, setModalVisible] = useState(false);
 
    const [formData, setFormData] = useState({ ...hiveData });


    useEffect(() => {
        setFormData({ ...hiveData });
    }, [hiveData]);



    const handleModalInputChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };


    const handleDelete = async (hiveid) => {
        try {
            const response = await axios.post(`/hive/deleteHive`, { hiveid });
            if (response.status === 200) {
                showAlertAndNavigate('تم حذف الخلية بنجاح');
            } else {
                console.error('Failed to delete hive:', response.data.message);
                showAlert('فشل حذف الخلية');
            }
        } catch (error) {
            console.error('Error deleting hive:', error.message);
            showAlert('خطأ أثناء حذف الخلية');
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

    const confirmDelete = (hiveid) => {
        Alert.alert(
            'تأكيد',
            'هل أنت متأكد أنك تريد حذف هذه الخلية؟',
            [
                { text: 'إلغاء', style: 'cancel' },
                {
                    text: 'حذف',
                    onPress: () => handleDelete(hiveid),
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
                    <Text style={{ color: 'white', fontSize: 12 }}>آخر خلية</Text>
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
                        onPress={() => confirmDelete(hiveData._id)}>
                        <Ionicons name="trash-outline" size={30} color="#FF0000" style={styles.icon} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => setModalVisible(true)}>
                        <Ionicons name="create-outline" size={30} color="orange" style={styles.icon} />
                    </TouchableOpacity>
                </View>

                <View style={styles.fieldset}>
                    <Text style={styles.fieldsetTitle}>معلومات عامة عن الخلية</Text>


                    <View style={styles.row}>
                        <Text style={styles.valueLine}>{formData.Apiary.Name}</Text>
                        <View style={styles.labelContainer}>
                            <Text style={styles.label}>المنحل</Text>
                            <Ionicons name='trail-sign-outline' size={14} color="#977700" />
                        </View>
                    </View>


                    <View style={styles.divider} />

                    <View style={styles.row}>
                        <Text style={styles.valueLine}>{formData.Name}</Text>
                        <View style={styles.labelContainer}>
                            <Text style={styles.label}>اسم الخلية</Text>
                            <FontAwesome5 name="forumbee" size={14} color="#977700" />
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.row}>
                        <Text style={styles.valueLine}>{formData.Color}</Text>
                        <View style={styles.labelContainer}>
                            <Text style={styles.label}>اللون</Text>
                            <Ionicons name="color-palette-outline" size={14} color="fuchsia" />
                        </View>
                    </View>

                    <View style={styles.divider} />


                    <View style={styles.row}>
                        <Text style={styles.value}>{formData.Type}</Text>
                        <View style={styles.labelContainer}>
                            <Text style={styles.label}>النوع</Text>
                            <Ionicons name="pricetag-outline" size={14} color="gray" />
                        </View>
                    </View>


                    <View style={styles.divider} />

                    <View style={styles.row}>
                        <Text style={styles.value}>{formData.Source}</Text>
                        <View style={styles.labelContainer}>
                            <Text style={styles.label}>المصدر</Text>
                            <Ionicons name="earth-outline" size={14} color="green" />
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.row}>
                        <Text style={styles.value}>{formData.Purpose}</Text>
                        <View style={styles.labelContainer}>
                            <Text style={styles.label}>الغرض</Text>
                            <Ionicons name="checkmark-circle-outline" size={14} color="red" />
                        </View>
                    </View>


                    <View style={styles.divider} />

                    <View style={styles.row}>
                        <Text style={styles.value}>{new Date(formData.Added).toLocaleDateString('fr-FR')}</Text>
                        <View style={styles.labelContainer}>
                            <Text style={styles.label}>تاريخ التثبيت</Text>
                            <Ionicons name="calendar-number-outline" size={14} color="gray" />
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.row}>
                        <Text style={styles.value}>{formData.Colony.supers}</Text>
                        <View style={styles.labelContainer}>
                            <Text style={styles.label}>عدد العاسلات</Text>
                            <Ionicons  name="file-tray-full-outline" size={14} color="orange" />
                        </View>
                    </View>


                    <View style={styles.divider} />

                    <View style={styles.row}>
                        <Text style={styles.value}>{formData.Colony.TotalFrames}</Text>
                        <View style={styles.labelContainer}>
                            <Text style={styles.label}>مجموع الإطارات</Text>
                            <Ionicons name="file-tray-full-outline" size={14} color="orange" />
                        </View>
                    </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.fieldset}>
                    <Text style={styles.fieldsetTitle}>معلومات عن المستعمرة</Text>

                    <View style={styles.row}>
                        <Text style={styles.value}>{formData.Colony.strength}</Text>
                        <View style={styles.labelContainer}>
                            <Text style={styles.label}>القوة</Text>
                            <Ionicons name="fitness-outline" size={14} color="blue"  />
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.row}>
                        <Text style={styles.value}>{formData.Colony.temperament}</Text>
                        <View style={styles.labelContainer}>
                            <Text style={styles.label}>السلوك</Text>
                            <Ionicons name="happy-outline" size={14} color="gray" />
                        </View>
                    </View>
                </View>

                <View style={styles.divider} />


                {
                    formData.Queen !=null && formData.Queen?.race && (

                        <View style={styles.fieldset}>
                            <Text style={styles.fieldsetTitle}>معلومات عن الملكة</Text>


 
                            <View style={styles.row}>
                                <Text style={styles.value}>{new Date(formData.Queen.installed).toLocaleDateString('fr-FR')}</Text>
                                <View style={styles.labelContainer}>
                                    <Text style={styles.label}>تاريخ التثبيت </Text>
                                    <Ionicons name="calendar-number-outline" size={14} color="gray"/>
                                </View>
                            </View>
                            <View style={styles.divider} />

                            <View style={styles.row}>
                                <Text style={styles.value}>{formData.Queen.status}</Text>
                                <View style={styles.labelContainer}>
                                    <Text style={styles.label}>الوضع</Text>
                                    <Ionicons name="information-circle-outline"  size={14} color="blue" />
                                </View>
                            </View>

                            <View style={styles.divider} />

                            <View style={styles.row}>
                                <Text style={styles.value}>{formData.Queen.queen_state}</Text>
                                <View style={styles.labelContainer}>
                                    <Text style={styles.label}>الحالة</Text>
                                    <Ionicons name="shield-checkmark-outline" size={14} color="green" />
                                </View>
                            </View>

                            <View style={styles.divider} />


                            <View style={styles.row}>
                                <Text style={styles.value}>{formData.Queen.temperament}</Text>
                                <View style={styles.labelContainer}>
                                    <Text style={styles.label}>السلوك</Text>
                                    <Ionicons name="happy-outline" size={14} color="gray" />
                                </View>
                            </View>


                            <View style={styles.divider} />

                            <View style={styles.row}>
                                <Text style={styles.value}>{formData.Queen.race}</Text>
                                <View style={styles.labelContainer}>
                                    <Text style={styles.label}>السلالة</Text>
                                    <Ionicons name="ribbon-outline" size={14} color="purple" />
                                </View>
                            </View>

                            <View style={styles.divider} />


                            <View style={styles.row}>
                                <Text style={styles.value}>{formData.Queen.clipped ? 'نعم' : 'لا'}</Text>
                                <View style={styles.labelContainer}>
                                    <Text style={styles.label}>أجنحة مقصوصة؟</Text>
                                    <Ionicons name="cut-outline" size={14} color="red" />
                                </View>
                            </View>
                            <View style={styles.divider} />


                            <View style={styles.row}>
                                <Text style={styles.value}>{formData.Queen.isMarked ? 'نعم' : 'لا'}</Text>
                                <View style={styles.labelContainer}>
                                    <Text style={styles.label}>معلمة؟</Text>
                                    <Ionicons name="flag-outline" size={14} color="orange" />
                                </View>
                            </View>


                            {formData.Queen.isMarked && (<View style={styles.row}>

                                <Text style={styles.value}>{formData.Queen.color}</Text>
                                <View style={styles.labelContainer}>
                                    <Text style={styles.label}>اللون</Text>
                                    <Ionicons  name="color-palette-outline" size={14} color="fuchsia" />
                                </View>
                            </View>)}

                            <View style={styles.divider} />


                            <View style={styles.row}>
                                <Text style={styles.value}>{formData.Queen.origin}</Text>
                                <View style={styles.labelContainer}>
                                    <Text style={styles.label}>الأصل</Text>
                                    <Ionicons name="location-outline" size={14} color="teal" />
                                </View>
                            </View>


                        </View>
                    )
                }

            </View>
 
               <View style={styles.qrContainer}>
                    <Text style={styles.qrTitle}>رمز QR للخلية {formData.Name}</Text>
                    <SvgQRCode
                        value={hiveData._id}   
                        size={100}
                    />
                </View>


            <EditHiveModal
                visible={modalVisible}
                onSave={() => {
                    setModalVisible(false);
                }}
                onCancel={() => setModalVisible(false)}
                formData={formData}
                apiaries={apiaries}
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
    fieldset: {
        marginBottom: 20,
    },
    fieldsetTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#977700',
        textAlign: 'center',
       padding:20
    },
    qrContainer: {
        alignItems: 'center',
        padding:20
    },
    qrTitle: {
        fontSize: 18,
        marginBottom: 10,
        color: 'black',
        fontWeight:'bold'
    },
});

export default HiveDetailsScreen;