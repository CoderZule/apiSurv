import React, { useState, useEffect } from 'react';
import { Text, SafeAreaView, StyleSheet, View } from 'react-native';
import { BarChart, LineChart } from 'react-native-chart-kit';
import HomeHeader from '../../Components/HomeHeader';
import { Card } from 'react-native-paper';
import axios from '../../axiosConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import LottieView from "lottie-react-native";
import { Picker } from '@react-native-picker/picker';
import { units, HarvestProducts } from '../Data';

export default function StatsScreen({ navigation }) {
  const [cardWidth, setCardWidth] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState('المعاملات المالية');
  const [selectedUnit, setSelectedUnit] = useState('لتر (L)');
  const [selectedProduct, setSelectedProduct] = useState('عسل');

  const [apiaries, setApiaries] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [singleHiveMessage, setSingleHiveMessage] = useState('');

  const [selectedApiary, setSelectedApiary] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());


  const [chartDataFinances, setChartDataFinances] = useState({
    labels: [],
    datasets: [{ data: [] }]
  });

  const [chartDataHarvest, setChartDataHarvest] = useState({
    labels: [],
    datasets: [{ data: [] }]
  });

  const [chartDataStrength, setChartDataStrength] = useState({
    labels: [],
    datasets: [{ data: [] }]
  });

  const [financialData, setFinancialData] = useState({
    currentYearTotal: 0,
    currentYearRevenues: 0,
    currentYearExpenses: 0,
    previousYearTotal: 0,
    previousYearRevenues: 0,
    previousYearExpenses: 0
  });

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
    const fetchTransactions = async () => {
      try {
        const response = await axios.get('/transaction/getAllTransactions', {
          params: { userId: currentUser?._id },
        });
        const transactions = response.data.data;
        setTransactions(transactions);

        const currentYearTotals = {
          revenues: 0,
          expenses: 0,
        };

        const previousYearTotals = {
          revenues: 0,
          expenses: 0,
        };

        const currentYear = new Date().getFullYear();
        const previousYear = currentYear - 1;

        transactions.forEach(transaction => {
          const transactionYear = new Date(transaction.TransactionDate).getFullYear();
          if (transactionYear === currentYear) {
            if (transaction.OperationType === 'الدخل') {
              currentYearTotals.revenues += transaction.Amount;
            } else if (transaction.OperationType === 'النفقات') {
              currentYearTotals.expenses += transaction.Amount;
            }
          } else if (transactionYear === previousYear) {
            if (transaction.OperationType === 'الدخل') {
              previousYearTotals.revenues += transaction.Amount;
            } else if (transaction.OperationType === 'النفقات') {
              previousYearTotals.expenses += transaction.Amount;
            }
          }
        });

        const currentYearTotal = currentYearTotals.revenues - currentYearTotals.expenses;
        const previousYearTotal = previousYearTotals.revenues - previousYearTotals.expenses;

        setChartDataFinances({
          labels: [previousYear.toString(), currentYear.toString()],
          datasets: [{ data: [previousYearTotal, currentYearTotal] }]
        });

        setFinancialData({
          currentYearTotal,
          currentYearRevenues: currentYearTotals.revenues,
          currentYearExpenses: currentYearTotals.expenses,
          previousYearTotal,
          previousYearRevenues: previousYearTotals.revenues,
          previousYearExpenses: previousYearTotals.expenses
        });
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser) {
      fetchTransactions();
    }
  }, [currentUser, isFocused]);

  const chartConfigFinances = {
    backgroundGradientFrom: "#FBF5E0",
    backgroundGradientTo: "#FBF5E0",
    color: () => `#2EB922`,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForBackgroundLines: {
      strokeWidth: 1,
      stroke: "#e3e3e3",
      strokeDasharray: "0",
    },
    formatYLabel: (value) => `${Math.floor(value).toLocaleString()} د.ت `,
  };


  useEffect(() => {
    const fetchHarvests = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('/harvest/getAllHarvests', {
          params: { userId: currentUser?._id },
        });
        const harvests = response.data.data;

        const yearTotals = {};
        units.forEach(unit => {
          yearTotals[unit] = 0;
        });

        harvests.forEach(harvest => {
          const harvestYear = new Date(harvest.Date).getFullYear();
          if (harvestYear === selectedYear && harvest.Product === selectedProduct) {
            yearTotals[harvest.Unit] += harvest.Quantity;
          }
        });

        setChartDataHarvest({
          labels: [selectedYear.toString()],
          datasets: [{
            data: [yearTotals[selectedUnit]],
          }]
        });
      } catch (error) {
        console.error('Error fetching harvests:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser) {
      fetchHarvests();
    }
  }, [currentUser, isFocused, selectedUnit, selectedYear, selectedProduct]);


  const unitAbbreviations = {
    "لتر (L)": "L",
    "كيلوجرام (kg)": "kg",
    "جرام (g)": "g",
    "ميليلتر (ml)": "ml",
  };


  const chartConfigHarvest = {
    backgroundGradientFrom: "#FBF5E0",
    backgroundGradientTo: "#FBF5E0",
    color: () => `#2EB922`,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForBackgroundLines: {
      strokeWidth: 1,
      stroke: "#e3e3e3",
      strokeDasharray: "0",
    },
    formatYLabel: (value) => {
      const unitLabel = unitAbbreviations[selectedUnit] || '';
      return `${parseFloat(value).toFixed(1)} ${unitLabel}`;
    },

  };

  const currentQuantity = chartDataHarvest.datasets[0].data[0];




  useEffect(() => {
    const fetchApiaries = async () => {
      try {
        const response = await axios.get('/apiary/getAllApiaries', {
          params: { userId: currentUser._id },
        });
        const apiaries = response.data.data;

        const userApiaries = apiaries.filter(apiary => apiary.Owner._id === currentUser._id);
        setApiaries(userApiaries);


      } catch (error) {
        console.error('Error fetching apiaries:', error);
      }
    };

    if (currentUser) {
      fetchApiaries();
    }
  }, [currentUser, isFocused]);


  const strengthMapping = {
    "ضعيف جداً": 0,
    "ضعيف": 25,
    "معتدل": 50,
    "قوي": 75,
    "قوي جداً": 100,
  };


  useEffect(() => {
    const fetchHivesByApiary = async () => {
      if (!selectedApiary) return;

      try {
        setIsLoading(true);
        const response = await axios.get('/hive/getHivesByApiary', {
          params: { apiaryId: selectedApiary },
        });
        const hives = response.data.data;


        if (!Array.isArray(hives) || hives.length === 0) {
          setChartDataStrength({
            labels: [],
            datasets: [{ data: [] }],
          });
          setSingleHiveMessage('لا توجد خلايا نحل متاحة في هذا المنحل.');
          return;
        }


        const colonyStrengths = hives.map(hive => ({
          name: hive.Name,
          strength: strengthMapping[hive.Colony.strength] || 0,
        }));


        if (colonyStrengths.length === 1) {
          const singleHive = colonyStrengths[0];
          setSingleHiveMessage(`لديك خلية نحل واحدة فقط بقوة ${singleHive.strength}%`);
        } else {

          const topColonyStrengths = colonyStrengths
            .sort((a, b) => b.strength - a.strength)
            .slice(0, 3);

          setChartDataStrength({
            labels: topColonyStrengths.map(colony => colony.name),
            datasets: [{
              data: topColonyStrengths.map(colony => colony.strength),
            }]
          });
          setSingleHiveMessage('');
        }
      } catch (error) {
        console.error('Error fetching hives:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHivesByApiary();
  }, [selectedApiary]);

  const chartConfigStrength = {
    backgroundGradientFrom: "#FBF5E0",
    backgroundGradientTo: "#FBF5E0",
    color: () => `#2EB922`,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForBackgroundLines: {
      strokeWidth: 1,
      stroke: "#e3e3e3",
      strokeDasharray: "0",
    },
    formatYLabel: (value) => `${parseFloat(value).toFixed(0)} %`,
  };

  const filteredUnits = units.filter(unit => {
    switch (selectedProduct) {
      case 'عسل': // Honey
      case 'حبوب اللقاح': // Pollen
        return !['ملليلتر (ml)'].includes(unit);
      case 'شمع النحل': // Beeswax
      case 'العكبر': // Propolis
      case 'خبز النحل': // Bee Bread
        return !['لتر (L)', 'ملليلتر (ml)'].includes(unit);
      case 'الهلام الملكي': // Royal Jelly
        return !['كيلوغرام (kg)', 'لتر (L)'].includes(unit);
      case 'سم النحل': // Bee Venom
        return !['كيلوغرام (kg)', 'لتر (L)'].includes(unit);
      default:
        return true;
    }
  });


  return (
    <SafeAreaView style={styles.safeArea}>
      <HomeHeader navigation={navigation} title={'الإحصائيات والرسوم البيانية'} />
      <View style={styles.container}>
        <Picker
          selectedValue={selectedReport}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedReport(itemValue)}
        >
          <Picker.Item label="المعاملات المالية" value="المعاملات المالية" />
          <Picker.Item label="الحصاد" value="الحصاد" />
          <Picker.Item label="قوة خلايا النحل" value="قوة خلايا النحل" />


        </Picker>

        {selectedReport === "المعاملات المالية" && (
          <Card
            style={styles.card}
            onLayout={(event) => {
              const { width } = event.nativeEvent.layout;
              setCardWidth(width);
            }}
          >
            <Text style={styles.title}>أحدث المعاملات</Text>
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
              transactions.length > 0 ? (
                <>
                  {cardWidth > 0 && (
                    <LineChart
                      style={styles.chart}
                      data={chartDataFinances}
                      width={cardWidth - 20}
                      height={300}
                      chartConfig={chartConfigFinances}
                      verticalLabelRotation={20}
                      xLabelsOffset={-10}
                    />
                  )}
                  <View style={styles.balanceContainer}>

                    <View style={styles.balanceSection}>
                      <Text style={styles.balanceTitle}>الرصيد للسنة السابقة</Text>
                      <View style={styles.divider} />
                      <View style={styles.inlineContainer}>
                        <Text style={styles.balanceTextTotal}>{Math.abs(financialData.previousYearTotal).toLocaleString()} {financialData.previousYearTotal >= 0 ? '' : '-'} د.ت </Text>
                        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>الإجمالي: </Text>

                      </View>
                      <View style={styles.inlineContainer}>
                        <Text style={styles.balanceTextRevenus}>{financialData.previousYearRevenues} د.ت</Text>
                        <Text>الدخل: </Text>
                      </View>
                      <View style={styles.inlineContainer}>
                        <Text style={styles.balanceTextDepenses}>{financialData.previousYearExpenses} - د.ت </Text>
                        <Text>النفقات:</Text>
                      </View>
                    </View>

                    <View style={styles.balanceSection}>
                      <Text style={styles.balanceTitle}>الرصيد للسنة{'\n'}الحالية</Text>


                      <View style={styles.divider} />

                      <View style={styles.inlineContainer}>
                        <Text style={styles.balanceTextTotal}>{Math.abs(financialData.currentYearTotal).toLocaleString()} {financialData.currentYearTotal >= 0 ? '' : '-'} د.ت </Text>
                        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>الإجمالي: </Text>
                      </View>
                      <View style={styles.inlineContainer}>
                        <Text style={styles.balanceTextRevenus}>{financialData.currentYearRevenues} د.ت</Text>
                        <Text>الدخل: </Text>
                      </View>
                      <View style={styles.inlineContainer}>
                        <Text style={styles.balanceTextDepenses}>{financialData.currentYearExpenses} - د.ت </Text>
                        <Text>النفقات: </Text>
                      </View>
                    </View>


                  </View>
                </>
              ) : (
                <Text style={styles.noDataText}>لا توجد معاملات حالياً.</Text>

              )
            )}
          </Card>
        )}



        {selectedReport === "قوة خلايا النحل" && (
          <Card style={[styles.card, { width: cardWidth }]} onLayout={(event) => setCardWidth(event.nativeEvent.layout.width)}>
            <Text style={styles.title}>أعلى 3  خلايا نحل من حيث القوة</Text>

            {apiaries.length > 0 ? (
              <View>
                <View style={styles.pickerContainer}>

                  <Picker
                    selectedValue={selectedApiary}
                    onValueChange={(itemValue) => {
                      setSelectedApiary(itemValue);
                      setSingleHiveMessage('');
                      setChartDataStrength({
                        labels: [],
                        datasets: [{ data: [] }],
                      });
                    }}
                    style={styles.pickerSelect}
                  >
                    <Picker.Item label="اختر منحل" value="" enabled={false} />

                    {apiaries.map(apiary => (
                      <Picker.Item key={apiary._id} label={apiary.Name} value={apiary._id} />
                    ))}
                  </Picker>

                  <Text style={styles.pickerTitle}>المنحل:</Text>

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
                  chartDataStrength && chartDataStrength.datasets[0].data.length > 0 ? (
                    <BarChart
                      style={styles.chart}
                      data={chartDataStrength}
                      width={cardWidth - 20}
                      height={300}
                      chartConfig={chartConfigStrength}
                      verticalLabelRotation={0}
                      xLabelsOffset={-5}

                    />
                  ) : (

                    <Text style={styles.textMessage}>{singleHiveMessage}</Text>
                  ))}

              </View>
            ) : (

              <Text style={styles.noDataText}>ليس لديك أي مناحل في الوقت الراهن.
              </Text>
            )}

          </Card>
        )}

        {selectedReport === "الحصاد" && (
          <Card
            style={styles.card}
            onLayout={(event) => {
              const { width } = event.nativeEvent.layout;
              setCardWidth(width);
            }}
          >
            <Text style={styles.title}>أحدث المحاصيل</Text>

            <View style={styles.pickerContainer}>


              <Picker
                selectedValue={selectedProduct}
                style={styles.pickerSelect}
                onValueChange={(itemValue) => {
                  setSelectedProduct(itemValue);

                }}
              >
                {HarvestProducts.map(product => (
                  <Picker.Item key={product} label={product} value={product} />
                ))}
              </Picker>

              <Text style={styles.pickerTitle}>المنتج:</Text>
            </View>


            <View style={styles.pickerContainer}>

              <Picker
                selectedValue={selectedUnit}
                style={styles.pickerSelect}
                onValueChange={(itemValue) => setSelectedUnit(itemValue)}
              >

                {filteredUnits.map(unit => (
                  <Picker.Item key={unit} label={unit} value={unit} />
                ))}
              </Picker>
              <Text style={styles.pickerTitle}>الوحدة:</Text>
            </View>


            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedYear}
                onValueChange={(itemValue) => setSelectedYear(itemValue)}
                style={styles.pickerSelect}
              >
                {[...Array(10)].map((_, index) => {
                  const year = new Date().getFullYear() - index;
                  return <Picker.Item key={year} label={year.toString()} value={year} />;
                })}
              </Picker>
              <Text style={styles.pickerTitle}>السنة:</Text>
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
              currentQuantity > 0 ? (
                <BarChart
                  data={chartDataHarvest}
                  width={cardWidth - 40}
                  height={220}
                  chartConfig={chartConfigHarvest}
                  verticalLabelRotation={0}
                  fromZero={true}
                  style={{ borderRadius: 16, marginVertical: 10 }}
                />
              ) : (

                <Text style={styles.noDataText}>لا توجد بيانات.</Text>


              )
            )}
          </Card>
        )}
      </View>
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
    margin: 20,
    justifyContent: 'center',
  },
  card: {
    padding: 10,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#977700',
  },
  chart: {
    borderRadius: 16,
    marginVertical: 10,
  },
  balanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  balanceSection: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  balanceTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#555555',
    textAlign: 'center',
    marginBottom: 5,
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 5,
  },
  inlineContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  balanceTextTotal: {
    fontWeight: 'bold',
  },
  balanceTextRevenus: {
    color: '#2EB922',
  },
  balanceTextDepenses: {
    color: '#ff0000',
  },
  loadingContainer: {
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  picker: {
    backgroundColor: '#FEE502',
    width: '100%',
    marginBottom: 20,
  },

  noDataText: {
    textAlign: 'center',
    justifyContent: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 20,
  },
  pickerContainer: {
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pickerTitle: {
    fontSize: 16,
    marginTop: 15,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 10,
    textAlign: 'center',
  },
  pickerSelect: {
    backgroundColor: '#E8E8E8',
    width: '75%',

  },
});
