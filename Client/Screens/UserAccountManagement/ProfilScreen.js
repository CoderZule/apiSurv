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
  Pressable, ActivityIndicator,
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
  const [currentUser, setCurrentUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [hideCurrentPassword, setHideCurrentPassword] = useState(true);
  const [hideNewPassword, setHideNewPassword] = useState(true);
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true);
  const [isLoading, setIsLoading] = useState(true); // State for loading indicator


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
        } else {
          Alert.alert('Error', 'User data not found in AsyncStorage');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', 'Failed to fetch user data');
      }finally {
        setIsLoading(false); // After fetching data, set isLoading to false
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
      };

      const response = await axios.post(
        'http://192.168.1.17:3000/api/user/editUser',
        updatedUserData
      );


      // Save updated user data to AsyncStorage
      await AsyncStorage.setItem('currentUser', JSON.stringify(updatedUserData));

      // Update the currentUser state
      setCurrentUser(updatedUserData);

      Alert.alert('Succès', 'Les informations ont été mises à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la mise à jour des informations:', error);
      Alert.alert('Error', 'Échec de la mise à jour des informations');
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
    // Reset fields when modal closes
    setCurrentPasswordInput('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
  };

  const handlePasswordChange = async () => {
    try {
      if (!currentPasswordInput) {
        setError("Veuillez saisir le mot de passe actuel.");
        return;
      }

      if (!newPassword || !confirmPassword) {
        setError("Veuillez saisir un nouveau mot de passe.");
        return;
      }

      if (newPassword !== confirmPassword) {
        setError("Les mots de passe ne correspondent pas.");
        return;
      }

      // Send API request to change password
      const updatedUserData = {
        userId: currentUser._id,
        currentPassword: currentPasswordInput,
        newPassword: newPassword,
      };

      const response = await axios.post(
        'http://192.168.1.17:3000/api/user/changeProfilPassword',
        updatedUserData
      );

      if (response.data.success) {
        Alert.alert('Succès', 'Le mot de passe a été changé avec succès.');
        setError('');
        setCurrentPasswordInput('');
        setConfirmPassword('');
        setNewPassword('');
        setModalVisible(false);
      } else {
        setError(response.data.message || 'Failed to change password');
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError('Le mot de passe actuel est incorrect.');
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
      <HomeHeader navigation={navigation} title={'Profil'} />
      {isLoading ? (
        <View style={[styles.container, styles.loadingContainer]}>
          <ActivityIndicator size="large" color="#977700" />
        </View>
      ) : (
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
            <Text style={styles.modalTitle}>Changer le mot de passe</Text>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {/* Current Password */}
            <View style={styles.modalInput}>
              <TextInput
                style={styles.inputControl}
                onChangeText={setCurrentPasswordInput}
                placeholder="Mot de passe actuel"
                secureTextEntry={hideCurrentPassword}
                placeholderTextColor="#6b7280"
              />
              <TouchableOpacity
                style={styles.visibilityIcon}
                onPress={toggleCurrentPasswordVisibility}
              >
                <FontAwesome5
                  name={hideCurrentPassword ? 'eye-slash' : 'eye'}
                  size={20}
                  color="#6b7280"
                />
              </TouchableOpacity>
            </View>

            {/* New Password */}
            <View style={styles.modalInput}>
              <TextInput
                style={styles.inputControl}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Nouveau mot de passe"
                secureTextEntry={hideNewPassword}
                placeholderTextColor="#6b7280"
              />
              <TouchableOpacity
                style={styles.visibilityIcon}
                onPress={toggleNewPasswordVisibility}
              >
                <FontAwesome5
                  name={hideNewPassword ? 'eye-slash' : 'eye'}
                  size={20}
                  color="#6b7280"
                />
              </TouchableOpacity>
            </View>

            {/* Confirm New Password */}
            <View style={styles.modalInput}>
              <TextInput
                style={styles.inputControl}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirmer le mot de passe"
                secureTextEntry={hideConfirmPassword}
                placeholderTextColor="#6b7280"
              />
              <TouchableOpacity
                style={styles.visibilityIcon}
                onPress={toggleConfirmPasswordVisibility}
              >
                <FontAwesome5
                  name={hideConfirmPassword ? 'eye-slash' : 'eye'}
                  size={20}
                  color="#6b7280"
                />
              </TouchableOpacity>
            </View>

            {/* Buttons */}
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
      </Modal>



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
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  modalInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 30,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderColor: '#E5E5E5',
    borderWidth: 1,
    marginBottom: 16,
  },
  visibilityIcon: {
    padding: 10,
    marginLeft: 'auto', // This will push the icon to the right
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
