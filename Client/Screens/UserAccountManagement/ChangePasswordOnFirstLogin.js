import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal, Alert } from 'react-native';
import axios from '../../axiosConfig';
import { FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ChangePasswordOnFirstLogin({ visible, onClose, userId }) {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [hideNewPassword, setHideNewPassword] = useState(true);
    const [hideConfirmPassword, setHideConfirmPassword] = useState(true);


    const handlePasswordChange = async () => {
        if (!newPassword || !confirmPassword) {
            setError("يرجى إدخال كلمة مرور جديدة.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("كلمات المرور غير متطابقة.");
            return;
        }

        try {
            const response = await axios.post('/user/changePasswordFirstLogin', {
                userId,
                newPassword
            });

            if (response.data.success) {

                const currentUserString = await AsyncStorage.getItem('currentUser');
                if (currentUserString) {
                    const user = JSON.parse(currentUserString);
                    const updatedUser = { ...user, FirstTimeLogin: false };
                    await AsyncStorage.setItem('currentUser', JSON.stringify(updatedUser));
                }
                Alert.alert(
                    "نجاح",
                    "تم تغيير كلمة المرور بنجاح.",
                    [{ text: "موافق", onPress: onClose }]
                );
            } else {
                setError("خطأ أثناء تغيير كلمة المرور.");
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setError("لا يمكن أن تكون كلمة المرور الجديدة هي نفسها القديمة.");
            } else {
                setError("خطأ أثناء تغيير كلمة المرور.");
                console.error(error);
            }
        }
    };
    const toggleNewPasswordVisibility = () => {
        setHideNewPassword(!hideNewPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setHideConfirmPassword(!hideConfirmPassword);
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            statusBarTranslucent={true}

            onRequestClose={() => { }}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>تغيير كلمة المرور</Text>
                    <Text style={styles.modalSubTitle}>كلمة مرورك انتهت صلاحيتها. يرجى إدخال كلمة مرور جديدة</Text>
                    <View style={styles.inputContainer}>
                        <View style={styles.input}>
                            <TouchableOpacity onPress={toggleNewPasswordVisibility}>
                                <FontAwesome5
                                    name={hideNewPassword ? 'eye-slash' : 'eye'}
                                    size={20}
                                    color="#6b7280"
                                    style={styles.inputIcon}
                                />
                            </TouchableOpacity>
                            <TextInput
                                placeholder="كلمة مرور جديدة"
                                secureTextEntry={hideNewPassword}
                                value={newPassword}
                                onChangeText={setNewPassword}
                                style={{ flex: 1, textAlign:'right' }}
                            />
                            <FontAwesome5 name="lock" size={22} color="#977700" style={styles.inputIcon} />

                        </View>
                    </View>
                    <View style={styles.inputContainer}>
                        <View style={styles.input}>
                            <TouchableOpacity onPress={toggleConfirmPasswordVisibility}>
                                <FontAwesome5
                                    name={hideConfirmPassword ? 'eye-slash' : 'eye'}
                                    size={20}
                                    color="#6b7280"
                                    style={styles.inputIcon}
                                />
                            </TouchableOpacity>

                            <TextInput
                                placeholder="تأكيد كلمة المرور"
                                secureTextEntry={hideConfirmPassword}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                style={{ flex: 1, textAlign:'right' }}
                            />
                            <FontAwesome5 name="lock" size={22} color="#977700" style={styles.inputIcon} />


                        </View>
                    </View>
                    {error ? <Text style={styles.errorText}>{error}</Text> : null}
                    <TouchableOpacity style={styles.modalButton} onPress={handlePasswordChange}>
                        <Text style={styles.modalButtonText}>Changer</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}


const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        width: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#977700',
    },
    modalSubTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 10,
        backgroundColor: '#f9f9f9'
        
    },
    input: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        paddingLeft: 8,
        padding: 3,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginRight: 10,
 
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
    modalButton: {
        backgroundColor: '#FEE502',
        padding: 10,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
    },
    modalButtonText: {
        color: '#373737',
        fontWeight: 'bold'

    },
    inputIcon: {
        padding: 10,
    },
});
