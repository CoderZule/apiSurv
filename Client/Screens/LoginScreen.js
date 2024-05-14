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
import { useFonts } from 'expo-font';
import { FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';  
import { useNavigation } from '@react-navigation/native';  
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const navigation = useNavigation(); 

  const [loaded] = useFonts({
    'Chilanka-Regular': require('../assets/fonts/Chilanka-Regular.ttf'),
    'Poppins-Semibold': require('../assets/fonts/Poppins-SemiBold.ttf'),
  });

  const [form, setForm] = useState({
    email: '',
    password: '',
    hidePassword: true,
  });

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        'http://192.168.1.19:3000/api/user/login',
        
        {
          Email: form.email,
          Password: form.password,
        }
      );

       const currentUser = response.data.currentUser;

      AsyncStorage.setItem("token",response.data.token);

    navigation.navigate('DrawerNavigator');


     } catch (error) {
       Alert.alert('Échec de connexion', 'Identifiants invalides. Veuillez réessayer.');
     }
  };
  const togglePasswordVisibility = () => {
    setForm({ ...form, hidePassword: !form.hidePassword });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.container}>
        <KeyboardAwareScrollView>
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
                <FontAwesome5 name="envelope" size={20} color="#6b7280" style={styles.inputIcon} />
                <TextInput
                  autoCapitalize="none"
                  autoCorrect={false}
                  clearButtonMode="while-editing"
                  keyboardType="email-address"
                  onChangeText={email => setForm({ ...form, email })}
                  placeholder="apic@exemple.com"
                  placeholderTextColor="#6b7280"
                  style={styles.inputControl}
                  value={form.email}

                />
              </View>
            </View>

            <View style={styles.input}>
              <Text style={styles.inputLabel}>Mot de passe</Text>
              <View style={styles.inputContainer}>
                <FontAwesome5 name="lock" size={20} color="#6b7280" style={styles.inputIcon} />
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
  container: {
    flex: 1,
    paddingVertical: 24,
    paddingHorizontal: 0,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#342D21',
    fontFamily: 'Chilanka-Regular'

  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 36,
  },
  headerImg: {
    width: 250,
    height: 168,
    alignSelf: 'center',
  },
  form: {
    marginBottom: 24,
    paddingHorizontal: 24,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  input: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: '#342D21',
    marginBottom: 8,
    marginLeft: 7,
    fontFamily: 'Chilanka-Regular'

  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 15,

  },
  inputIcon: {
    padding: 10,
  },
  inputControl: {
    flex: 1,
    paddingHorizontal: 1,
    height: 50,
    fontSize: 15,
    fontWeight: '500',
    color: '#797979',
    paddingVertical: 8,
    fontFamily: 'Chilanka-Regular'


  },

  formAction: {
    marginTop: 4,
    marginBottom: 16,
  },
  formLink: {
    fontSize: 16,
    fontWeight: '600',
    color: '#977700',
    textAlign: 'center',
    fontFamily: 'Chilanka-Regular'

  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: '#FEE502',
    borderRadius: 20,
    borderColor: '#FEE502',
  },
  btnText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    color: '#373737',
    fontFamily: 'Poppins-SemiBold'

  },
});