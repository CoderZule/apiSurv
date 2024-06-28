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
import axios from 'axios';

export default function ProfilScreen({ navigation }) {
  const [Firstname, setFirstName] = useState('');
  const [Lastname, setLastName] = useState('');
  const [Email, setEmail] = useState('');
  const [Phone, setPhone] = useState('');
  const [Password, setPassword] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUserString = await AsyncStorage.getItem('currentUser');

        if (currentUserString) {
          const user = JSON.parse(currentUserString);
          setCurrentUser(user);
          setFirstName(user.Firstname);
          setLastName(user.Lastname);
          setPhone(user.Phone);
          setEmail(user.Email);
          setPassword(user.Password);
        } else {
          Alert.alert('Error', 'User data not found in AsyncStorage');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', 'Failed to fetch user data');
      }
    };

    fetchUserData();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      const updatedUserData = {
        _id: currentUser._id,
        Firstname,
        Lastname,
        Email,
        Phone,
        Password,
      };

      const response = await axios.post(
        'http://192.168.1.17:3000/api/user/editUser',
        updatedUserData
      );

      console.log('Update response:', response.data);
      // Handle success (maybe update AsyncStorage here too)
      Alert.alert('Success', 'User information updated successfully');
    } catch (error) {
      console.error('Error updating user information:', error);
      Alert.alert('Error', 'Failed to update user information');
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
    // Reset fields when modal closes
    setNewPassword('');
    setConfirmPassword('');
  };

  const handlePasswordChange = async () => {
    try {
      // Validate new password and confirm password match
      if (newPassword !== confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        return;
      }

      // Send API request to change password
      const updatedUserData = {
        _id: currentUser._id,
        Password: newPassword,
      };

      const response = await axios.post(
        'http://192.168.1.17:3000/api/user/changePassword',
        updatedUserData
      );

      console.log('Password change response:', response.data);
      Alert.alert('Success', 'Password changed successfully');
      setModalVisible(false);
    } catch (error) {
      console.error('Error changing password:', error);
      Alert.alert('Error', 'Failed to change password');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <HomeHeader navigation={navigation} title={'Profil'} />

      <View style={styles.container}>
        <KeyboardAwareScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Card 1: Personal Information */}

          <View style={styles.card}>
          <Text style={styles.cardTitle}>Informations de l'apiculteur</Text>

            <View style={styles.input}>
              <Text style={styles.inputLabel}>Prénom</Text>
              <View style={styles.inputContainer}>
                <FontAwesome5
                  name="user"
                  size={15}
                  color="#977700"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.inputControl}
                  value={Firstname}
                  onChangeText={setFirstName}
                  placeholder="Entrez votre prénom"
                  placeholderTextColor="#6b7280"
                />
              </View>
            </View>

            <View style={styles.input}>
              <Text style={styles.inputLabel}>Nom</Text>
              <View style={styles.inputContainer}>
                <FontAwesome5
                  name="user"
                  size={15}
                  color="#977700"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.inputControl}
                  value={Lastname}
                  onChangeText={setLastName}
                  placeholder="Entrez votre nom"
                  placeholderTextColor="#6b7280"
                />
              </View>
            </View>

            <View style={styles.input}>
              <Text style={styles.inputLabel}>Téléphone</Text>
              <View style={styles.inputContainer}>
                <FontAwesome5
                  name="phone"
                  size={15}
                  color="#977700"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.inputControl}
                  value={Phone}
                  onChangeText={setPhone}
                  placeholder="Entrez votre numéro de téléphone"
                  placeholderTextColor="#6b7280"
                  keyboardType="Phone-pad"
                />
              </View>
            </View>
          </View>

          {/* Card 2: Login Credentials */}

          <View style={styles.card}>
          <Text style={styles.cardTitle}>Paramètres du compte</Text>

            <View style={styles.input}>
              <Text style={styles.inputLabel}>Email</Text>
              <View style={styles.inputContainer}>
                <FontAwesome5
                  name="envelope"
                  size={15}
                  color="#977700"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.inputControl}
                  value={Email}
                  onChangeText={setEmail}
                  placeholder="Entrez votre Email"
                  placeholderTextColor="#6b7280"
                  keyboardType="Email-address"
                />
              </View>
            </View>

            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.penIconContainer}>
              <View style={styles.input}>
                <Text style={styles.inputLabel}>Mot de passe  <FontAwesome5
                  name="pen"
                  size={15}
                  color="#5188C7"
                  style={styles.inputIcon}
                /></Text>

              </View>
            </TouchableOpacity>


          </View>

          {/* Single Button Outside Cards */}
          <View style={styles.formAction}>
            <TouchableOpacity onPress={handleUpdateProfile}>
              <View style={styles.btn}>
                <Text style={styles.btnText}>Mettre à jour</Text>
              </View>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </View >

      {/* Modal for Password Change */}
      < Modal
        animationType="slide"
        transparent={true}
        statusBarTranslucent={true}
        visible={modalVisible}
        onRequestClose={handleModalClose}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Changer le mot de passe</Text>
         
            <TextInput
              style={styles.modalInput}
              value={newPassword}
              onChangeText={setCurrentPassword}
              placeholder="Mot de passe actuel"
              secureTextEntry
            />
         
            <TextInput
              style={styles.modalInput}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Nouveau mot de passe"
              secureTextEntry
            />
            <TextInput
              style={styles.modalInput}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Retaper le nouveau mot de passe"
              secureTextEntry
            />
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.buttonClose]}
                onPress={handleModalClose}
              >
                <Text style={styles.textStyle}>Annuler</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.buttonSave]}
                onPress={handlePasswordChange}
              >
                <Text style={styles.textStyle}>Sauvegarder</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal >
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FBF5E0',
  },
  container: {
    flex: 1,
    margin: 20,
    justifyContent: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  card: {
    paddingHorizontal: 24,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingVertical: 25,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#977700',
    textAlign: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#977700',
    marginBottom: 20,
    marginLeft: 10,
  },
  input: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#373737',
    marginBottom: 8,
    marginLeft: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 30,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderColor: '#E5E5E5',
    borderWidth: 1,
  },
  penIconContainer: {
    // padding: 10,
  },

  inputIcon: {
    padding: 10,
  },
  inputControl: {
    flex: 1,
    paddingHorizontal: 8,
    fontSize: 12,
    fontWeight: '500',
    color: '#797979',
  },
  formAction: {
   // marginTop: 10,
    //marginBottom: 16,
    alignItems: 'center',
  },
  btn: {
    width: 276,
    height: 50,
    paddingHorizontal: 20,
    backgroundColor: '#FEE502',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    fontSize: 17,
    color: '#373737',
    fontWeight: 'bold',
  },
  // Modal styles
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#977700',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 10,
    width: '100%',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    minWidth: 100,
    alignItems: 'center',
  },
  buttonClose: {
    backgroundColor: '#ccc',
    marginRight: 10,
  },
  buttonSave: {
    backgroundColor: '#FEE502',
    marginLeft: 10,
  },
  textStyle: {
    color: '#373737',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
