import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, Alert, FlatList, ScrollView } from 'react-native';
import { Card } from 'react-native-paper';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import axios from '../../axiosConfig';
import HomeHeader from '../../Components/HomeHeader';
import AddTransactionModal from './AddTransactionModal';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from "lottie-react-native";

export default function TransactionsHistoryScreen({ navigation }) {
  const [transactions, setTransactions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [operationType, setOperationType] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
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


  const fetchTransactionsData = async () => {
    try {
      const response = await axios.get('/transaction/getAllTransactions',
        {
          params: { userId: currentUser._id },

        });

      setTransactions(response.data.data);
    } catch (error) {
      console.error('Error fetching transactions data:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء تحميل المعاملات');
    }
    finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    if (currentUser) {
      fetchTransactionsData();
    }
  }, [currentUser, isFocused]);




  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const handleFormSubmit = async () => {
    if (!description || !amount || !date) {
      return Alert.alert('خطأ', 'يرجى ملء جميع الحقول');
    }
    if (operationType && !selectedCategory) {
      return Alert.alert('خطأ', "يرجى اختيار فئة");
    }
    if (!operationType) {
      return Alert.alert('خطأ', "يرجى تحديد نوع العملية");
    }
    else {
      try {
        const formData = {
          OperationType: operationType,
          Description: description,
          TransactionDate: date.toISOString(),
          Category: selectedCategory,
          Amount: amount,
          Note: note,
          User: currentUser._id

        };

        const response = await axios.post('/transaction/create', formData);
        Alert.alert('نجاح', 'تمت إضافة المعاملة بنجاح');

        setOperationType('');
        setDescription('');
        setDate(new Date());
        setSelectedCategory('');
        setAmount('');
        setNote('');
        setShowModal(false);
        fetchTransactionsData();

      } catch (error) {
        console.error('Error creating transaction entry:', error);
        Alert.alert('خطأ', 'حدث خطأ أثناء إضافة المعاملة');
      }
    }
  };



  const renderTransactionItem = ({ item, index }) => {
    const lastItemIndex = transactions.length - 1;


    return (
      <TouchableOpacity
        style={styles.tableRow}
        onPress={() => navigation.navigate('TransactionDetailsScreen', {
          transactionData: item,
          badge: index === lastItemIndex ? true : false,
        })}
      >
          <Text style={styles.tableCell}>
          {new Date(item.TransactionDate).toLocaleDateString('fr-FR')}{'\n'}
          {index === lastItemIndex && (
            <View style={styles.badge}>
             <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold', textAlign:'right' }}>آخر معاملة</Text>
            </View>
          )}
        </Text>
        <Text style={styles.tableCell}>{item.Amount} د.ت</Text>
        <Text style={styles.tableCell}>{item.Category}</Text>


      </TouchableOpacity>
    );
  };



  return (
    <SafeAreaView style={styles.safeArea}>
      <HomeHeader navigation={navigation} title={'المعاملات المالية'} />
      <ScrollView horizontal={true}>
        <Card style={styles.card}>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowModal(true)}
          >
            <FontAwesome5Icon name="plus-circle" size={35} color="#FEE502" />
          </TouchableOpacity>


          <ScrollView horizontal={true}>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderText}>التاريخ</Text>
              <Text style={styles.tableHeaderText}>المبلغ</Text>
              <Text style={styles.tableHeaderText}>الفئة</Text>

              </View>

              {isLoading ? (
                <View style={[styles.container, styles.loadingContainer]}>
                  <LottieView
                    source={require('../../assets/lottie/loading.json')}
                    autoPlay
                    loop
                    style={{ width: 100, height: 70 }}
                  />
                </View>
              ) : (

                <FlatList
                  data={transactions}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={renderTransactionItem}
                  ListEmptyComponent={
                    <View style={styles.tableRow}>
                      <Text style={styles.noDataCell}>
                      لا يوجد أي معاملات حتى الآن.
                      </Text>
                    </View>
                  }
                />
              )}
            </View>
          </ScrollView>
        </Card>


        {showModal && (
          <AddTransactionModal
            operationType={operationType}
            setOperationType={setOperationType}
            description={description}
            setDescription={setDescription}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            amount={amount}
            setAmount={setAmount}
            note={note}
            setNote={setNote}
            date={date}
            showDatePicker={showDatePicker}
            setShowDatePicker={setShowDatePicker}
            handleDateChange={handleDateChange}
            handleFormSubmit={handleFormSubmit}
            closeModal={() => setShowModal(false)}


          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FBF5E0',
  },
  card: {
    padding: 13,
    borderRadius: 10,
    elevation: 3,
    backgroundColor: '#FFFFFF',
    marginVertical: 16,
    marginHorizontal: 15,
  },
  addButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  table: {
    flex: 1,
    minWidth: '80%',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  tableHeader: {
    flexDirection: 'row',
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  tableHeaderText: {
    padding: 8,
    fontSize: 16,
    fontWeight: 'bold',
    width: 100,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    backgroundColor: '#fff',
    borderBottomColor: '#ccc',
    minHeight: 60,
  },
  tableCell: {
    padding: 12,
    width: 80,
    flex: 1,
    textAlign: 'center',

    fontSize: 14,
  },
  noDataCell: {
    flex: 1,
    padding: 10,
    textAlign: 'center',
  },
  badge: {
    backgroundColor: "#2EB922",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
});
