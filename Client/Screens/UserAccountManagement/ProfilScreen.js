import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  Pressable,

} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { FontAwesome5 } from '@expo/vector-icons';
import HomeHeader from '../../Components/HomeHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../../axiosConfig';
import { Card } from 'react-native-paper';
import LottieView from "lottie-react-native";

export default function ProfilScreen({ navigation }) {
  const [Firstname, setFirstName] = useState('');
  const [Lastname, setLastName] = useState('');
  const [Email, setEmail] = useState('');
  const [Cin, setCin] = useState('');
  const [Phone, setPhone] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [hideCurrentPassword, setHideCurrentPassword] = useState(true);
  const [hideNewPassword, setHideNewPassword] = useState(true);
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUserString = await AsyncStorage.getItem('currentUser');
        if (currentUserString) {
          const user = JSON.parse(currentUserString);
          setCurrentUser(user);
          setFirstName(user.Firstname);
          setLastName(user.Lastname);
          setCin(user.Cin);
          setPhone(user.Phone);
          setEmail(user.Email);
        } else {
          Alert.alert('خطأ', 'لم يتم العثور على بيانات المستخدم في AsyncStorage');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('خطأ', 'فشل في جلب بيانات المستخدم');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleUpdateProfile = async () => {
    const nameRegex = /^[a-zA-Z\s]+$/;
    const emailRegex =/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;


    if (!Firstname || !Lastname || !Email || !Cin || !Phone) {
      Alert.alert('الحقول فارغة', 'يرجى ملء جميع الحقول.');
      return;
    }
    if (!nameRegex.test(Firstname)) {
      Alert.alert('الاسم غير صالح', 'يرجى إدخال اسم صالح.');
      return;
    }

    if (!nameRegex.test(Lastname)) {
      Alert.alert('اللقب غير صالح', 'يرجى إدخال لقب صالح.');
      return;
    }


    if (!emailRegex.test(Email)) {
      Alert.alert('صيغة البريد الإلكتروني غير صالحة', 'يرجى إدخال بريد إلكتروني صالح.');
      return;
    }


    try {
      const updatedUserData = {
        _id: currentUser._id,
        Firstname,
        Lastname,
        Email,
        Cin,
        Phone,
      };

      const response = await axios.post(
        '/user/editUser',
        updatedUserData
      );

      await AsyncStorage.setItem('currentUser', JSON.stringify(updatedUserData));
      setCurrentUser(updatedUserData);
      Alert.alert('نجاح', 'تم تحديث المعلومات بنجاح');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        Alert.alert('فشل في تحديث المعلومات', 'البريد الإلكتروني مستخدم بالفعل.');
      } else {
        Alert.alert('خطأ', 'فشل في تحديث المعلومات');
      }

    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setCurrentPasswordInput('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
  };

  const handlePasswordChange = async () => {
    try {
      if (!currentPasswordInput) {
        setError('يرجى إدخال كلمة المرور الحالية.');
        return;
      }

      if (!newPassword || !confirmPassword) {
        setError('يرجى إدخال كلمة مرور جديدة.');
        return;
      }

      if (newPassword !== confirmPassword) {
        setError('كلمات المرور غير متطابقة.');
        return;
      }

      if (newPassword.length <= 5) {
        Alert.alert('كلمة المرور قصيرة', 'يجب أن تتكون كلمة المرور من أكثر من 5 أحرف.');
        return;
      }

      const updatedUserData = {
        userId: currentUser._id,
        currentPassword: currentPasswordInput,
        newPassword: newPassword,
      };

      const response = await axios.post(
        '/user/changeProfilPassword',
        updatedUserData
      );

      if (response.data.success) {
        Alert.alert('نجاح', 'تم تغيير كلمة المرور بنجاح.');
        setError('');
        setCurrentPasswordInput('');
        setConfirmPassword('');
        setNewPassword('');
        setModalVisible(false);
      } else {
        setError(response.data.message || 'فشل في تغيير كلمة المرور');
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError('كلمة المرور الحالية غير صحيحة.');
      } else {
        console.error('Error changing password:', error);
      }
    }
  };

  const toggleCurrentPasswordVisibility = () => {
    setHideCurrentPassword(!hideCurrentPassword);
  };

  const toggleNewPasswordVisibility = () => {
    setHideNewPassword(!hideNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setHideConfirmPassword(!hideConfirmPassword);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <HomeHeader navigation={navigation} title={'الملف الشخصي'} />
      {isLoading ? (
        <View style={[styles.container, styles.loadingContainer]}>
          <LottieView
            source={require('../../assets/lottie/loading.json')}
            autoPlay
            loop
            style={{ width: 100, height: 100 }}
          />
        </View>
      ) : (
        <View style={styles.container}>
          <KeyboardAwareScrollView contentContainerStyle={styles.scrollContainer}>
            <Card style={styles.card}>

              <Card.Content>
                <Text style={styles.cardTitle}>معلومات النحال</Text>

                <View style={styles.input}>
                  <Text style={styles.inputLabel}>الاسم</Text>
                  <View style={styles.inputContainer}>

                    <TextInput
                      style={styles.inputControl}
                      value={Firstname}
                      onChangeText={setFirstName}
                    />
                    <FontAwesome5
                      name="user"
                      size={15}
                      color="#977700"
                      style={styles.inputIcon}
                    />
                  </View>


                </View>

                <View style={styles.input}>
                  <Text style={styles.inputLabel}>اللقب</Text>
                  <View style={styles.inputContainer}>

                    <TextInput
                      style={styles.inputControl}
                      value={Lastname}
                      onChangeText={setLastName}
                    />
                    <FontAwesome5
                      name="user"
                      size={15}
                      color="#977700"
                      style={styles.inputIcon}
                    />
                  </View>
                </View>

                <View style={styles.input}>
                  <Text style={styles.inputLabel}>الهاتف</Text>
                  <View style={styles.inputContainer}>

                    <TextInput
                      style={styles.inputControl}
                      value={Phone}
                      onChangeText={setPhone}
                      keyboardType="phone-pad"
                    />
                    <FontAwesome5
                      name="phone"
                      size={15}
                      color="#977700"
                      style={styles.inputIcon}
                    />

                  </View>
                </View>


                <View style={styles.input}>
                  <Text style={styles.inputLabel}>رقم ب.ت.و</Text>
                  <View style={styles.inputContainer}>

                    <TextInput
                      style={styles.inputControl}
                      value={Cin}
                      onChangeText={setCin}
                      keyboardType="number-pad"
                    />
                    <FontAwesome5
                      name="id-card"
                      size={15}
                      color="#977700"
                      style={styles.inputIcon}
                    />

                  </View>
                </View>
              </Card.Content>
            </Card>

            <Card style={styles.card}>
              <Card.Content>
                <Text style={styles.cardTitle}>إعدادات الحساب</Text>

                <View style={styles.input}>
                  <Text style={styles.inputLabel}>البريد الإلكتروني</Text>
                  <View style={styles.inputContainer}>
                    <FontAwesome5
                      name="envelope"
                      size={15}
                      color="#977700"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.inputControlPhoneEM}
                      value={Email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                    />


                  </View>
                </View>

                <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.penIconContainer}>
                  <View style={styles.input}>
                    <Text style={styles.inputLabel}>
                      كلمة المرور{' '}
                      <FontAwesome5
                        name="pen"
                        size={15}
                        color="#5188C7"
                        style={styles.inputIcon}
                      />
                    </Text>
                  </View>
                </TouchableOpacity>
              </Card.Content>
            </Card>

            <View style={styles.formAction}>
              <TouchableOpacity onPress={handleUpdateProfile}>
                <View style={styles.btn}>
                  <Text style={styles.btnText}>تحديث</Text>
                </View>
              </TouchableOpacity>
            </View>
          </KeyboardAwareScrollView>
        </View>
      )}

      <Modal
        animationType="fade"
        transparent={true}
        statusBarTranslucent={true}
        visible={modalVisible}
        onRequestClose={handleModalClose}
      >
        <View style={styles.modalBackground}>

          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>تغيير كلمة المرور</Text>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <View style={styles.modalInput}>
              <TouchableOpacity
                style={styles.visibilityIcon}
                onPress={toggleCurrentPasswordVisibility}
              >
                <FontAwesome5
                  name={hideCurrentPassword ? 'eye-slash' : 'eye'}
                  size={14}
                  color="#6b7280"
                />
              </TouchableOpacity>
              <TextInput
                style={styles.inputControl}
                onChangeText={setCurrentPasswordInput}
                placeholder="كلمة المرور الحالية"
                secureTextEntry={hideCurrentPassword}
                placeholderTextColor="#6b7280"
              />
              <FontAwesome5 name="lock" size={14} color="#977700" style={styles.inputIcon} />


            </View>

            <View style={styles.modalInput}>
              <TouchableOpacity
                style={styles.visibilityIcon}
                onPress={toggleNewPasswordVisibility}
              >
                <FontAwesome5
                  name={hideNewPassword ? 'eye-slash' : 'eye'}
                  size={14}
                  color="#6b7280"
                />
              </TouchableOpacity>

              <TextInput
                style={styles.inputControl}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="كلمة المرور الجديدة"
                secureTextEntry={hideNewPassword}
                placeholderTextColor="#6b7280"
              />
              <FontAwesome5 name="lock" size={14} color="#977700" style={styles.inputIcon} />

            </View>

            <View style={styles.modalInput}>
              <TouchableOpacity
                style={styles.visibilityIcon}
                onPress={toggleConfirmPasswordVisibility}
              >
                <FontAwesome5
                  name={hideConfirmPassword ? 'eye-slash' : 'eye'}
                  size={14}
                  color="#6b7280"
                />
              </TouchableOpacity>

              <TextInput
                style={styles.inputControl}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="تأكيد كلمة المرور"
                secureTextEntry={hideConfirmPassword}
                placeholderTextColor="#6b7280"
              />
              <FontAwesome5 name="lock" size={14} color="#977700" style={styles.inputIcon} />


            </View>

            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.buttonClose]}
                onPress={handleModalClose}
              >
                <Text style={styles.textStyle}>إلغاء</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.buttonSave]}
                onPress={handlePasswordChange}
              >
                <Text style={styles.textStyle}>تغيير كلمة المرور</Text>
              </Pressable>
            </View>
          </View>

        </View>
      </Modal>
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
    padding: 16,
    direction: 'rtl'
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    paddingBottom: 16,
  },
  card: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#977700',
    textAlign: 'right',
  },
  input: {
    marginBottom: 10,

  },
  inputLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f9f9f9',

  },
  inputIcon: {
    marginLeft: 8,
  },
  inputControl: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    textAlign: 'right',
  },


  inputControlPhoneEM: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    textAlign: 'left',
    marginLeft: 8,
  },
  formAction: {
    marginTop: 5
  },
  btn: {
    backgroundColor: '#FEE502',
    borderRadius: 20,
    paddingVertical: 12,
    alignItems: 'center',
  },
  btnText: {
    fontSize: 16,
    color: '#373737',
    fontWeight: 'bold',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#977700',
  },
  modalInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f9f9f9',
    marginBottom: 16,
    width: '100%',
    direction: 'rtl'
  },
  visibilityIcon: {
    marginLeft: 8,

  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    margin: 4,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonClose: {
    backgroundColor: '#bbb',
  },
  buttonSave: {
    backgroundColor: '#FEE502',
  },
  textStyle: {
    fontSize: 16,
    color: '#373737',

  },
  errorText: {
    color: 'red',
    marginBottom: 8,
  },
});
