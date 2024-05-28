import React, { useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
  Alert
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';
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
      const response = await axios.post(
        'http://192.168.1.14:3000/api/user/login',
        {
          Email: form.email,
          Password: form.password,
        }
      );
 
  
      const currentUser = response.data.currentUser;
       AsyncStorage.multiSet([
        ['token', response.data.token],
        ['currentUser', JSON.stringify(response.data.currentUser)]
      ]);
            navigation.navigate('DrawerNavigator', currentUser);

    } catch (error) {
      Alert.alert('Échec de connexion', 'Identifiants invalides. Veuillez réessayer.');
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
              source={require('../assets/logo.png')}
            />
            <Text style={styles.subtitle}>
              Connectez-vous à votre compte
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.input}>
              <Text style={styles.inputLabel}>E-mail</Text>
              <View style={styles.inputContainer}>
                <FontAwesome5 name="envelope" size={20} color="#977700" style={styles.inputIcon} />
                <TextInput
                  autoCapitalize="none"
                  autoCorrect={false}
                  clearButtonMode="while-editing"
                  keyboardType="email-address"
                  onChangeText={email => setForm({ ...form, email })}
                  placeholder="exemple@apisurv.com"
                  placeholderTextColor="#6b7280"
                  style={styles.inputControl}
                  value={form.email}
                />
              </View>
            </View>

            <View style={styles.input}>
              <Text style={styles.inputLabel}>Mot de passe</Text>
              <View style={styles.inputContainer}>
                <FontAwesome5 name="lock" size={20} color="#977700" style={styles.inputIcon} />
                <TextInput
                  autoCorrect={false}
                  clearButtonMode="while-editing"
                  onChangeText={password => setForm({ ...form, password })}
                  placeholder="********"
                  placeholderTextColor="#6b7280"
                  style={styles.inputControl}
                  secureTextEntry={form.hidePassword}
                  value={form.password}
                />
                <TouchableOpacity onPress={togglePasswordVisibility}>
                  <FontAwesome5
                    name={form.hidePassword ? 'eye-slash' : 'eye'}
                    size={20}
                    color="#6b7280"
                    style={styles.inputIcon}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.formAction}>
              <TouchableOpacity onPress={handleLogin}>
                <View style={styles.btn}>
                  <Text style={styles.btnText}>Se connecter</Text>
                </View>
              </TouchableOpacity>
            </View>

            <Text style={styles.formLink}>Mot de passe oublié?</Text>
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
    borderTopLeftRadius: 50,  // Top border radius for the form
    borderTopRightRadius: 50,  // Top border radius for the form
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
    backgroundColor: '#F5F5F5',
    borderRadius: 30,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderColor: '#E5E5E5',
    borderWidth: 1,
  },
  inputIcon: {
    padding: 10,
  },
  inputControl: {
    flex: 1,
    paddingHorizontal: 8,
    fontSize: 15,
    fontWeight: '500',
    color: '#797979',
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
