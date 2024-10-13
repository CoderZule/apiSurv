import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, Alert, FlatList, ScrollView } from 'react-native';
import { Card } from 'react-native-paper';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import axios from '../../axiosConfig';
import HomeHeader from '../../Components/HomeHeader';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from "lottie-react-native";
import AddHiveModal from './AddHiveModal';

export default function HiveHistoryScreen({ navigation }) {
  const [hives, setHives] = useState([]);
  const [apiaries, setApiaries] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [selectedApiary, setSelectedApiary] = useState(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedSource, setSelectedSource] = useState('');
  const [selectedPurpose, setSelectedPurpose] = useState('');
  const [added, setAdded] = useState(new Date());
  const [colony, setColony] = useState({
    strength: '',
    temperament: '',
    supers: 0,
    TotalFrames: 0
  });
  const [queen, setQueen] = useState({
    seen: false,
    color: '',
    isMarked: false,
    hatched: 0,
    status: '',
    installed: new Date(),
    queen_state: '',
    race: '',
    clipped: false,
    origin: '',
    temperament: ''

  });

  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  const lastItemIndex = hives.length - 1;


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


  const fetchData = async () => {
    if (!currentUser) {
      return;
    }

    try {
      const apiariesResponse = await axios.get('/apiary/getAllApiaries');
      const userApiaries = apiariesResponse.data.data.filter(apiary => apiary.Owner._id === currentUser._id);

      setApiaries(userApiaries);
      let allHives = [];

      for (const apiary of userApiaries) {
        const hivesResponse = await axios.get('/hive/getHivesByApiary', {
          params: { apiaryId: apiary._id },
        });

        allHives = [...allHives, ...hivesResponse.data.data];

        allHives.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      }
      ;

      setHives(allHives);

    } catch (error) {
      console.error('Error fetching apiary or hive data:', error);
    } finally {
      setIsLoading(false);
    }
  };



  useEffect(() => {
    if (currentUser) {
      fetchData();
    }
  }, [currentUser, isFocused]);




  const handleFormSubmit = async () => {
    // Validate general form fields
    if (
      !name ||
      !selectedType ||
      !selectedSource ||
      !selectedPurpose ||
      !added ||
      !selectedApiary ||
      !colony.strength ||
      !colony.temperament ||
      !colony.supers ||
      !colony.TotalFrames
    ) {
      return Alert.alert('خطأ', 'يرجى ملء جميع الحقول');
    }


    if (queen?.seen) {
      if (
        !queen.hatched ||
        !queen.queen_state ||
        !queen.status ||
        !queen.temperament ||
        !queen.race
      ) {
        return Alert.alert('خطأ', 'يرجى ملء جميع الحقول المتعلقة بالملكة');
      }
    }

    // Prepare form data
    const formData = {
      Name: name,
      Type: selectedType,
      Color: selectedColor,
      Source: selectedSource,
      Purpose: selectedPurpose,
      Added: added,
      Colony: {
        strength: colony.strength,
        temperament: colony.temperament,
        deadBees: colony.deadBees,
        supers: colony.supers,
        pollenFrames: colony.pollenFrames,
        TotalFrames: colony.TotalFrames,
        note: colony.note,
      },
      Apiary: selectedApiary,
    };

    if (queen.installed) {
      formData.Queen = {
        seen: queen.seen,
        isMarked: queen.isMarked,
        color: queen.color,
        hatched: queen.hatched,
        status: queen.status,
        installed: queen.installed,
        queen_state: queen.queen_state,
        race: queen.race,
        clipped: queen.clipped,
        origin: queen.origin,
        temperament: queen.temperament,
        note: queen.note,
        queenCells: queen.queenCells,
        isSwarmed: queen.isSwarmed,
      };
    }


    try {
      const response = await axios.post('/hive/create', formData);
      Alert.alert('نجاح', 'تمت إضافة الخلية بنجاح');

      const newHive = response.data.data;

      // Update state to include new hive at the end
      setHives(prevHives => [...prevHives, newHive]);

      resetForm();
      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error('Error creating hive entry:', error);
      Alert.alert('خطأ', 'خطأ في إضافة الخلية');
    }
  };



  const resetForm = () => {
    setName('');
    setSelectedType('');
    setSelectedColor('');
    setSelectedSource('');
    setSelectedPurpose('');
    setAdded(new Date());
    setColony({
      strength: '',
      temperament: '',
      supers: 0,
      TotalFrames: 0
    });
    setQueen({
      color: '',
      isMarked: false,
      hatched: 0,
      status: '',
      installed: new Date(),
      queen_state: '',
      race: '',
      clipped: false,
      origin: '',
      temperament: ''
    });
    setSelectedApiary(null);
    setShowModal(false);
  };




  const renderHiveItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.tableRow}
      onPress={() => navigation.navigate('HiveDetailsScreen', {
        hiveData: item, badge: index === lastItemIndex ? true : false, apiaries: apiaries


      })}
    >

      <Text style={styles.tableCell}>{item.Purpose}{'\n'}{index === lastItemIndex && (
        <View style={styles.badge}>
          <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold', textAlign: 'right' }}>آخر خلية</Text>
        </View>
      )}

      </Text>

      <Text style={styles.tableCell}>{item.Type}</Text>
      <Text style={styles.tableCell}>{item.Name}</Text>
    </TouchableOpacity>
  );



  return (
    <SafeAreaView style={styles.safeArea}>
      <HomeHeader navigation={navigation} title={'الخلايا'} />
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
                <Text style={styles.tableHeaderText}>الغرض</Text>
                <Text style={styles.tableHeaderText}>النوع</Text>
                <Text style={styles.tableHeaderText}>الخلية</Text>

              </View>
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
                <FlatList
                  data={hives}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={renderHiveItem}
                  ListEmptyComponent={
                    <View style={styles.tableRow}>
                      <Text style={styles.noDataCell}>
                        لا يوجد خلية حتى الآن.
                      </Text>
                    </View>
                  }
                />
              )}

            </View>
          </ScrollView>
        </Card>


        {showModal && (
          <AddHiveModal
            name={name}
            setName={setName}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            selectedSource={selectedSource}
            setSelectedSource={setSelectedSource}
            selectedPurpose={selectedPurpose}
            setSelectedPurpose={setSelectedPurpose}
            selectedApiary={selectedApiary}
            setSelectedApiary={setSelectedApiary}
            added={added}
            setAdded={setAdded}
            apiaries={apiaries}
            colony={colony}
            setColony={setColony}
            queen={queen}
            setQueen={setQueen}
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
});
