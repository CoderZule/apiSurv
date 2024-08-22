import React, { useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
  Alert, Linking
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { FontAwesome5 } from '@expo/vector-icons';
import axios from '../../axiosConfig';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const navigation = useNavigation();

  const [form, setForm] = useState({
    email: '',
    password: '',
    hidePassword: true,
  });

  const handleLogin = async () => {
    try {
      const response = await axios.post('/user/login', {
        Email: form.email,
        Password: form.password,
        platform: 'mobile',
      });

      await AsyncStorage.multiSet([
        ['token', response.data.token],
        ['currentUser', JSON.stringify(response.data.currentUser)],
      ]);

      navigation.reset({
        index: 0,
        routes: [{ name: 'DrawerNavigator' }],
      });

    } catch (error) {
      Alert.alert('فشل الاتصال', 'بيانات الاعتماد غير صحيحة. يرجى المحاولة مرة أخرى.');
    }
  };

  const togglePasswordVisibility = () => {
    setForm({ ...form, hidePassword: !form.hidePassword });
  };

  const handlePress = () => {
    Alert.alert(
      'تأكيد',
      "هل أنت متأكد أنك تريد إرسال بريد إلكتروني لإعادة تعيين كلمة المرور الخاصة بك؟",
      [
        {
          text: 'إلغاء',
          style: 'cancel',
        },
        {
          text: 'إرسال',
          onPress: () => {
            const subject = encodeURIComponent('إعادة تعيين كلمة المرور');
            const body = encodeURIComponent('مرحباً،\n\nأرجو إعادة تعيين كلمة المرور الخاصة بي.\n\nمع تحياتي،');
            Linking.openURL(`mailto:adminapisurv@gmail.com?subject=${subject}&body=${body}`);
          },
        },
      ],
      { cancelable: false }
    );
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
            <Text style={styles.subtitle}>
              تسجيل الدخول إلى حسابك
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.input}>
              <Text style={styles.inputLabel}>البريد الإلكتروني</Text>
              <View style={styles.inputContainer}>
                <FontAwesome5 name="envelope" size={22} color="#977700" style={styles.inputIcon} />
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
              <View style={styles.inputContainer}>
                <FontAwesome5 name="lock" size={22} color="#977700" style={styles.inputIcon} />
                <TextInput
                  autoCorrect={false}
                  clearButtonMode="while-editing"
                  onChangeText={password => setForm({ ...form, password })}
                  placeholder="********"
                  placeholderTextColor="#6b7280"
                  secureTextEntry={form.hidePassword}
                  value={form.password}
                  style={styles.inputField}
                />
                <TouchableOpacity onPress={togglePasswordVisibility}>
                  <FontAwesome5
                    name={form.hidePassword ? 'eye-slash' : 'eye'}
                    size={22}
                    color="#6b7280"
                    style={styles.inputIconEye}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.formAction}>
              <TouchableOpacity onPress={handleLogin}>
                <View style={styles.btn}>
                  <Text style={styles.btnText}>تسجيل الدخول</Text>
                </View>
              </TouchableOpacity>
            </View>

            <Text style={styles.formLink} onPress={handlePress}>
              نسيت كلمة المرور؟
            </Text>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FBF5E0'
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
    marginVertical: 36,
  },
  headerImg: {
    marginTop: 20,
    width: 210,
    height: 180,
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
    paddingVertical: 45,
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
  inputContainer: {
    flexDirection: 'row',
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
    marginBottom: 16,
  },
  formLink: {
    fontSize: 14,
    fontWeight: '500',
    color: '#977700',
    textAlign: 'center',
    marginTop: 12,
    textDecorationLine: 'underline',
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
  }
});
