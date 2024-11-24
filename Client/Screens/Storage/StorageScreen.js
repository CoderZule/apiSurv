import React, { useState, useEffect } from 'react';
import { Text, SafeAreaView, StyleSheet, View, TouchableOpacity, Modal, TextInput, Pressable, Alert, Image } from 'react-native';
import HomeHeader from '../../Components/HomeHeader';
import { HarvestProducts, units } from '../Data';
import { Card } from 'react-native-paper';
import axios from '../../axiosConfig';
import { useIsFocused } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from "lottie-react-native";

export default function StorageScreen({ navigation }) {
  const [totals, setTotals] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [reducedQuantity, setReducedQuantity] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('');
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const currentUserString = await AsyncStorage.getItem('currentUser');
        if (currentUserString) {
          const user = JSON.parse(currentUserString);
          setCurrentUser(user);
        }
      } catch (error) {
        console.error('Error retrieving current user:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchTotals();
    }
  }, [currentUser, isFocused]);

  const fetchTotals = async () => {
    try {
      const response = await axios.get('/storage/getAllStorages', {
        params: {
          userId: currentUser._id,
        },
      });

      const storageData = response.data.data;

      const totalsMap = {};
      storageData.forEach((entry) => {
        if (!entry.Quantities) {
          console.error('Invalid entry structure:', entry);
          return;
        }

        if (!totalsMap[entry.Product]) {
          totalsMap[entry.Product] = {};
        }

        entry.Quantities.forEach((quantityEntry) => {
          if (quantityEntry.Unit && quantityEntry.Total !== undefined) {
            totalsMap[entry.Product][quantityEntry.Unit] = quantityEntry.Total;
          } else {
            console.error('Invalid quantity entry structure:', quantityEntry);
          }
        });
      });

      setTotals(totalsMap);
    } catch (error) {
      console.error('Error fetching totals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateQuantity = async () => {
    try {
      if (!selectedProduct || !selectedUnit || !reducedQuantity || isNaN(reducedQuantity) || reducedQuantity <= 0) {
        Alert.alert('خطأ', 'يرجى ملء جميع الحقول وإدخال كمية صالحة.');
        return;
      }

      const storageResponse = await axios.get('/storage/getAllStorages', {
        params: {
          userId: currentUser._id,
        },
      });

      const storageEntries = storageResponse.data.data;
      const storageEntry = storageEntries.find((entry) => entry.Product === selectedProduct);

      if (!storageEntry) {
        Alert.alert('خطأ', `المنتج "${selectedProduct}" غير موجود في المخزون.`);
        return;
      }

      const quantityEntry = storageEntry.Quantities.find((q) => q.Unit === selectedUnit);

      if (!quantityEntry) {
        Alert.alert('خطأ', `الوحدة "${selectedUnit}" غير موجودة للمنتج "${selectedProduct}".`);
        return;
      }

      if (reducedQuantity > quantityEntry.Total) {
        Alert.alert('خطأ', 'الكمية المخفضة لا يمكن أن تكون أكبر من الكمية الحالية.');
        return;
      }

      const response = await axios.put('/storage/updateQuantity', {
        product: selectedProduct,
        unit: selectedUnit,
        reducedQuantity: Number(reducedQuantity),
        user : currentUser._id
      });

      if (response.status === 200 && response.data.success) {
        fetchTotals();
        setShowModal(false);
        Alert.alert('نجاح', 'تم تحديث الكمية بنجاح');
      } else {
        Alert.alert('خطأ', response.data.message || 'خطأ في تحديث الكمية');
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      Alert.alert('خطأ', 'خطأ في تحديث الكمية');
    }
  };

  const openModal = (product) => {
    setSelectedProduct(product);
    setReducedQuantity('');
    setSelectedUnit('');
    setShowModal(true);
  };

  const filterUnits = (product) => {
    switch (product) {
      case 'عسل': // Honey
      case 'حبوب اللقاح': // Pollen
        return units.filter((unit) => unit !== 'ملليلتر (ml)');
      case 'شمع النحل': // Beeswax
      case 'العكبر': // Propolis
        return units.filter((unit) => unit !== 'لتر (L)' && unit !== 'ملليلتر (ml)');
      case 'الهلام الملكي': // Royal Jelly
        return units.filter((unit) => unit !== 'كيلوغرام (kg)' && unit !== 'لتر (L)');
      case 'خبز النحل': // Bee Bread
        return units.filter((unit) => unit !== 'لتر (L)' && unit !== 'ملليلتر (ml)');
      case 'سم النحل': // Bee Venom
        return units.filter((unit) => unit !== 'كيلوغرام (kg)' && unit !== 'لتر (L)');
      default:
        return units;
    }
  };
  


  return (
    <SafeAreaView style={styles.safeArea}>
      <HomeHeader navigation={navigation} title={'المنتجات المخزنة'} />

      <View style={[styles.centeredView]}>
        <Image
          source={require('../../assets/storage.png')}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <Card style={styles.card}>
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
          <>
            {HarvestProducts.map((product, index) => {
              const productTotals = totals[product];
              const isInStock = productTotals && Object.keys(productTotals).length > 0;

              return (
                <View key={index}>
                  <Card.Content style={styles.cardContent}>
                  {isInStock && (
                      <TouchableOpacity onPress={() => openModal(product)}>
                        <Ionicons name="remove-circle" size={24} color="#2EB922" />
                      </TouchableOpacity>
                    )}
                    <View style={styles.productDetailContainer}>
                      {isInStock ? (
                        Object.entries(productTotals).map(([unit, quantity], idx) => (
                          <Text key={`${unit}-${idx}`} style={styles.productDetail}>{`${quantity} ${unit}`}</Text>
                        ))
                      ) : (
                        <Text style={[styles.productDetail, styles.notInStock]}>غير متوفر في المخزون</Text>
                      )}
                    </View>
               
                                        <Text style={styles.productName}>{product}</Text>

                  </Card.Content>
                  {index !== HarvestProducts.length - 1 && <View style={styles.divider} />}
                </View>
              );
            })}
          </>
        )}
      </Card>

      <Modal
        transparent={true}
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
        statusBarTranslucent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>تعديل الكمية</Text>
            <Text style={styles.modalProduct}>{selectedProduct}</Text>
            <TextInput
              style={styles.input}
              placeholder="الكمية المراد تقليلها"
              keyboardType="numeric"
              value={reducedQuantity}
              onChangeText={setReducedQuantity}
            />

            <Picker
              selectedValue={selectedUnit}
              onValueChange={(itemValue) => setSelectedUnit(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="الوحدة..." value="" enabled={false} />
              {filterUnits(selectedProduct).map((unit) => (
                <Picker.Item label={unit} value={unit} key={unit} />
              ))}
            </Picker>
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.buttonClose]}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.textStyle}>إلغاء</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.buttonSave]}
                onPress={handleUpdateQuantity}
              >
                <Text style={styles.textStyle}>تعديل</Text>
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
  centeredView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,

  },
  image: {
    width: 180,
    height: 180,
  },
  card: {
    margin: 16,
    borderRadius: 10,
    padding: 10,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  productDetailContainer: {
    flex: 1,
   },

  productDetail: {
    fontSize: 16,
    color: '#6b6b6b',
    justifyContent: 'center',
    textAlign:'center',
    marginVertical: 3, 
  },
  notInStock: {
    color: 'red',
  },
  divider: {
    height: 1,
    backgroundColor: '#cccccc',
    marginVertical: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalProduct: {
    fontSize: 18,
    marginVertical: 10,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
    textAlign:'right'
  },
  picker: {
    width: '100%',
    marginBottom: 10,
    backgroundColor: '#FBF5E0',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalButton: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    width: '45%',
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
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
