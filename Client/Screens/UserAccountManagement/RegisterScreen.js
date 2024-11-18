import React, { useState } from 'react';
import {
    StyleSheet,
    SafeAreaView,
    View,
    Image,
    Text,
    TouchableOpacity,
    TextInput,
    Alert,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { FontAwesome5 } from '@expo/vector-icons';
import axios from '../../axiosConfig';
import { useNavigation } from '@react-navigation/native';
import LottieView from "lottie-react-native";
 

export default function RegisterScreen() {
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false);

    const [form, setForm] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        hidePassword: true,
    });



    const handleRegister = async () => {

        const nameRegex = /^[\p{L}\s]+$/u;


        const emailRegex =/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        
        if (!form.firstname || !form.lastname || !form.email || !form.password) {
            Alert.alert('الحقول فارغة', 'يرجى ملء جميع الحقول.');
            return;
        }
        
        if (!nameRegex.test(form.firstname)) {
            Alert.alert('الاسم غير صالح', 'يرجى إدخال اسم صالح.');
            return;
        }
        
        if (!nameRegex.test(form.lastname)) {
            Alert.alert('اللقب غير صالح', 'يرجى إدخال لقب صالح.');
            return;
        }
        
        if (!emailRegex.test(form.email)) {
            Alert.alert('صيغة البريد الإلكتروني غير صالحة', 'يرجى إدخال بريد إلكتروني صالح.');
            return;
        }
        

        if (form.password.length <= 5) {
            Alert.alert('كلمة المرور قصيرة', 'يجب أن تتكون كلمة المرور من أكثر من 5 أحرف.');
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post('/user/register', {
                Firstname: form.firstname,
                Lastname: form.lastname,
                Email: form.email,
                Password: form.password,
                platform: 'mobile',
            });

            setIsLoading(false);

            Alert.alert('نجاح', 'تم إنشاء الحساب بنجاح.');
        } catch (error) {
            setIsLoading(false);
            if (error.response && error.response.status === 400) {
                Alert.alert('فشل إنشاء حساب', 'البريد الإلكتروني مستخدم بالفعل.');
            } else {
                Alert.alert('فشل إنشاء حساب', 'حدث خطأ أثناء الإنشاء. يرجى التحقق من البيانات والمحاولة مرة أخرى.');

            }
        }
    };


    const togglePasswordVisibility = () => {
        setForm({ ...form, hidePassword: !form.hidePassword });
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <KeyboardAwareScrollView contentContainerStyle={styles.scrollContainer}>
                    <View style={styles.header}>
                        <Image
                            resizeMode="contain"
                            style={styles.headerImg}
                            source={require('../../assets/logo.png')}
                        />
                        <Text style={styles.subtitle}>إنشاء حساب جديد</Text>
                    </View>
                    <View style={styles.form}>


                        <View style={styles.input}>
                            <Text style={styles.inputLabel}>الاسم</Text>
                            <View style={styles.inputContainer}>
                                <FontAwesome5 name="user" size={15} color="#977700" style={styles.inputIcon} />
                                <TextInput
                                    autoCapitalize="words"
                                    autoCorrect={false}
                                    onChangeText={firstname => setForm({ ...form, firstname })}
                                    placeholder="الاسم"
                                    placeholderTextColor="#6b7280"
                                    value={form.firstname}
                                />
                            </View>
                        </View>

                        <View style={styles.input}>
                            <Text style={styles.inputLabel}>اللقب</Text>
                            <View style={styles.inputContainer}>
                                <FontAwesome5 name="user" size={15} color="#977700" style={styles.inputIcon} />
                                <TextInput
                                    autoCapitalize="words"
                                    autoCorrect={false}
                                    onChangeText={lastname => setForm({ ...form, lastname })}
                                    placeholder="اللقب"
                                    placeholderTextColor="#6b7280"
                                    value={form.lastname}
                                />
                            </View>
                        </View>

                        {/* <View style={styles.input}>
                            <Text style={styles.inputLabel}>رقم الهاتف</Text>
                            <View style={styles.inputContainer}>
                                <FontAwesome5 name="phone" size={15} color="#977700" style={styles.inputIcon} />
                                <TextInput
                                    keyboardType="phone-pad"
                                    autoCorrect={false}
                                    onChangeText={phone => setForm({ ...form, phone })}
                                    placeholder="رقم الهاتف"
                                    placeholderTextColor="#6b7280"
                                    value={form.phone}

                                />
                            </View>
                        </View>

                        <View style={styles.input}>
                            <Text style={styles.inputLabel}>رقم ب.ت.و</Text>
                            <View style={styles.inputContainer}>
                                <FontAwesome5 name="id-card" size={15} color="#977700" style={styles.inputIcon} />
                                <TextInput
                                keyboardType="phone-pad"
                                    autoCorrect={false}
                                    onChangeText={cin => setForm({ ...form, cin })}
                                    placeholder="رقم ب.ت.و"
                                    placeholderTextColor="#6b7280"
                                    value={form.cin}
                                />

                            </View>
                        </View> */}

                        <View style={styles.input}>
                            <Text style={styles.inputLabel}>البريد الإلكتروني</Text>
                            <View style={styles.inputContainerEmailPass}>
                                <FontAwesome5 name="envelope" size={15} color="#977700" style={styles.inputIcon} />
                                <TextInput
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    clearButtonMode="while-editing"
                                    keyboardType="email-address"
                                    onChangeText={email => setForm({ ...form, email })}
                                    placeholder="exemple@apisurv.com"
                                    placeholderTextColor="#6b7280"
                                    value={form.email}
                                />
                            </View>
                        </View>

                        <View style={styles.input}>
                            <Text style={styles.inputLabel}>كلمة المرور</Text>
                            <View style={styles.inputContainerEmailPass}>
                                <FontAwesome5 name="lock" size={15} color="#977700" style={styles.inputIcon} />
                                <TextInput
                                    autoCorrect={false}
                                    clearButtonMode="while-editing"
                                    onChangeText={password => setForm({ ...form, password })}
                                    placeholder="*********"
                                    placeholderTextColor="#6b7280"
                                    secureTextEntry={form.hidePassword}
                                    value={form.password}
                                    style={styles.inputField}
                                />
                                <TouchableOpacity onPress={togglePasswordVisibility}>
                                    <FontAwesome5
                                        name={form.hidePassword ? 'eye-slash' : 'eye'}
                                        size={15}
                                        color="#6b7280"
                                        style={styles.inputIconEye}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.formAction}>
                            <TouchableOpacity onPress={handleRegister}>
                                <View style={styles.btn}>
                                    <Text style={styles.btnText}>إنشاء حساب</Text>
                                </View>
                            </TouchableOpacity>
                            <Text style={styles.formLink} onPress={navigation.goBack} >
                                لديك حساب بالفعل؟ تسجيل الدخول
                            </Text>
                        </View>
                    </View>

                    {isLoading && (
                        <View style={styles.loadingContainer}>
                            <LottieView
                                source={require('../../assets/lottie/loading.json')}
                                autoPlay
                                loop
                                style={{ width: 100, height: 100 }}
                            />
                        </View>
                    )}
                </KeyboardAwareScrollView>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FBF5E0',
    },
    container: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    subtitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#342D21',
    },
    header: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 16,
    },
    headerImg: {
        marginTop: 20,
        width: 260,
        height: 130,
        alignSelf: 'center',
    },
    form: {
        paddingHorizontal: 24,
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
        backgroundColor: '#fff',
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        paddingVertical: 35,
    },
    input: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: '#373737',
        marginBottom: 8,
        marginLeft: 10,
    },
    inputContainerEmailPass: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        borderRadius: 30,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderColor: '#E5E5E5',
        borderWidth: 1,
    },

    inputContainer: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        borderRadius: 30,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderColor: '#E5E5E5',
        borderWidth: 1,
    },
    inputIcon: {
        padding: 10,
    },
    inputField: {
        flex: 1,
        fontSize: 15,
        color: '#342D21',
    },
    inputIconEye: {
        marginLeft: 10,
    },
    formAction: {
        marginTop: 16,
        marginBottom: 10,
    },
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 24,
        backgroundColor: '#FEE502',
        borderRadius: 30,
    },
    btnText: {
        fontSize: 17,
        color: '#373737',
        fontWeight: 'bold',
    },
    formLink: {
        marginTop: 25,
        fontSize: 14,
        fontWeight: '500',
        color: '#977700',
        textAlign: 'right',
        textDecorationLine: 'underline',

    },

    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)'
      },
});
