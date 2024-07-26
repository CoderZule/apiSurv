import React, { useState, useEffect } from 'react';
import { Text, SafeAreaView, StyleSheet, View } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import HomeHeader from '../../Components/HomeHeader';
import { Card } from 'react-native-paper';
import axios from '../../axiosConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import LottieView from "lottie-react-native";
import { Picker } from '@react-native-picker/picker';

export default function StatsScreen({ navigation }) {
  const [cardWidth, setCardWidth] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState('Finances');

  const [chartData, setChartData] = useState({
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
            if (transaction.OperationType === 'Revenus') {
              currentYearTotals.revenues += transaction.Amount;
            } else if (transaction.OperationType === 'Dépenses') {
              currentYearTotals.expenses += transaction.Amount;
            }
          } else if (transactionYear === previousYear) {
            if (transaction.OperationType === 'Revenus') {
              previousYearTotals.revenues += transaction.Amount;
            } else if (transaction.OperationType === 'Dépenses') {
              previousYearTotals.expenses += transaction.Amount;
            }
          }
        });

        const currentYearTotal = currentYearTotals.revenues - currentYearTotals.expenses;
        const previousYearTotal = previousYearTotals.revenues - previousYearTotals.expenses;

        setChartData({
          labels: [currentYear.toString(), previousYear.toString()],
          datasets: [{
            data: [currentYearTotal, previousYearTotal]
          }]
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

  const chartConfig = {
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <HomeHeader navigation={navigation} title={'Stats et Graphs'} />
      <View style={styles.container}>
        <Picker
          selectedValue={selectedReport}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedReport(itemValue)}
        >
          <Picker.Item label="Finances" value="Finances" />
          <Picker.Item label="Force" value="Force" />
          <Picker.Item label="Récoltes" value="Récoltes" />

        </Picker>

        {selectedReport === 'Finances' && (
          <Card
            style={styles.card}
            onLayout={(event) => {
              const { width } = event.nativeEvent.layout;
              setCardWidth(width);
            }}
          >
            <Text style={styles.title}>Transactions Récentes</Text>
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
              cardWidth > 0 && (
                <BarChart
                  style={styles.chart}
                  data={chartData}
                  width={cardWidth - 20}
                  height={300}
                  chartConfig={chartConfig}
                  verticalLabelRotation={0}
                  xLabelsOffset={-10}
                />
              )
            )}

            <View style={styles.balanceContainer}>
              <View style={styles.balanceSection}>
                <Text style={styles.balanceTitle}>Solde Année Courante</Text>
                <View style={styles.divider} />
                <View style={styles.inlineContainer}>
                  <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Total: </Text>
                  <Text style={styles.balanceTextTotal}>{financialData.currentYearTotal} د.ت</Text>
                </View>
                <View style={styles.inlineContainer}>
                  <Text>Revenus: </Text>
                  <Text style={styles.balanceTextRevenus}>{financialData.currentYearRevenues} د.ت</Text>
                </View>
                <View style={styles.inlineContainer}>
                  <Text>Dépenses: </Text>
                  <Text style={styles.balanceTextDepenses}>{financialData.currentYearExpenses} د.ت -</Text>
                </View>
              </View>
              <View style={styles.balanceSection}>
                <Text style={styles.balanceTitle}>Solde Année Précédente</Text>
                <View style={styles.divider} />
                <View style={styles.inlineContainer}>
                  <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Total: </Text>
                  <Text style={styles.balanceTextTotal}>{financialData.previousYearTotal} د.ت</Text>
                </View>
                <View style={styles.inlineContainer}>
                  <Text>Revenus: </Text>
                  <Text style={styles.balanceTextRevenus}>{financialData.previousYearRevenues} د.ت</Text>
                </View>
                <View style={styles.inlineContainer}>
                  <Text>Dépenses: </Text>
                  <Text style={styles.balanceTextDepenses}>{financialData.previousYearExpenses} د.ت -</Text>
                </View>
              </View>
            </View>
          </Card>
        )}

        {selectedReport === 'Force' && (
          <Card
            style={styles.card}
            onLayout={(event) => {
              const { width } = event.nativeEvent.layout;
              setCardWidth(width);
            }}
          >
            <Text style={styles.title}>Force moyenne des abeilles</Text>
            <View style={styles.balanceContainer}>
              <Text>Content for Top Performers</Text>
            </View>
          </Card>
        )}

        {selectedReport === 'Récoltes' && (
          <Card
            style={styles.card}
            onLayout={(event) => {
              const { width } = event.nativeEvent.layout;
              setCardWidth(width);
            }}
          >
            <Text style={styles.title}>Récoltes</Text>
            <View style={styles.balanceContainer}>
              <Text>Content for Harvest</Text>
            </View>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  picker: {
    backgroundColor: '#FEE502',
    width: '100%',
    marginBottom: 20,
  }
});
