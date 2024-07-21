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
          Alert.alert('Error', 'User data not found in AsyncStorage');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', 'Failed to fetch user data');
      } finally {
        setIsLoading(false);
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
        Cin,
        Phone,
      };

      const response = await axios.post(
        '/user/editUser',
        updatedUserData
      );

      await AsyncStorage.setItem('currentUser', JSON.stringify(updatedUserData));
      setCurrentUser(updatedUserData);
      Alert.alert('Succès', 'Les informations ont été mises à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la mise à jour des informations:', error);
      Alert.alert('Error', 'Échec de la mise à jour des informations');
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
        setError('Veuillez saisir le mot de passe actuel.');
        return;
      }

      if (!newPassword || !confirmPassword) {
        setError('Veuillez saisir un nouveau mot de passe.');
        return;
      }

      if (newPassword !== confirmPassword) {
        setError('Les mots de passe ne correspondent pas.');
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
          <LottieView
            source={require('../../assets/lottie/loading.json')} // Replace with your animation file path
            autoPlay
            loop
            style={{ width: 100, height: 100 }}
          />
        </View>
      ) : (
        <View style={styles.container}>
          <KeyboardAwareScrollView contentContainerStyle={styles.scrollContainer}>
            <Card style={styles.card}>
              <Card.Title title="Informations de l'apiculteur" />
              <Card.Content>
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
                      keyboardType="phone-pad"
                    />
                  </View>
                </View>
              </Card.Content>
            </Card>

            <Card style={styles.card}>
              <Card.Title title="Paramètres du compte" />
              <Card.Content>
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
                      keyboardType="email-address"
                    />
                  </View>
                </View>

                <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.penIconContainer}>
                  <View style={styles.input}>
                    <Text style={styles.inputLabel}>
                      Mot de passe{' '}
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
                  <Text style={styles.btnText}>Mettre à jour</Text>
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
            <Text style={styles.modalTitle}>Changer le mot de passe</Text>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#FBF5E0',

  },
  input: {
    marginBottom: 16,

  },
  inputLabel: {
    fontSize: 12,
    color: '#333',
    marginBottom: 4,
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
    marginRight: 8,
  },
  inputControl: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  formAction: {
    marginTop: 24,
  },
  btn: {
    backgroundColor: '#FEE502',
    borderRadius: 8,
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
