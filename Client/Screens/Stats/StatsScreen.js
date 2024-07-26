import React, { useState, useEffect } from 'react';
import { Text, SafeAreaView, StyleSheet, View, ScrollView } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import HomeHeader from '../../Components/HomeHeader';
import { Card } from 'react-native-paper';
import axios from '../../axiosConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import LottieView from "lottie-react-native";

export default function StatsScreen({ navigation }) {
  const [cardWidth, setCardWidth] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(true);

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

        // Calculate total, revenues, and expenses for the current and previous year
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

        // Calculate totals
        const currentYearTotal = currentYearTotals.revenues - currentYearTotals.expenses;
        const previousYearTotal = previousYearTotals.revenues - previousYearTotals.expenses;

        // Set the chart data with totals instead of individual transactions
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
      }
      finally {
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
    color: () => `#FEE502`,
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
    formatYLabel: (value) => `${Math.floor(value).toLocaleString()} د.ت `, // Format to only show the integer part
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <HomeHeader navigation={navigation} title={'Statistiques'} />
      <View style={styles.container}>
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
                source={require('../../assets/lottie/loading.json')} // Replace with your animation file path
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


        {/* New Card for Average Bee Force */}
        <Card
          style={styles.card}
          onLayout={(event) => {
            const { width } = event.nativeEvent.layout;
            setCardWidth(width);
          }}
        >
          <Text style={styles.title}>Force moyenne des abeilles</Text>
          {/* You can add content for the new card here */}
          <View style={styles.balanceContainer}>
            {/* Replace with actual data or components as needed */}
            <Text style={styles.balanceTextTotal}>Data or visualization for average bee force goes here</Text>
          </View>
        </Card>

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
    shadowRadius: 8,
    marginBottom: 20, // Add margin to separate cards
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#977700'

  },
  chart: {
    marginVertical: 10,
    borderRadius: 16
  },
  balanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 20,
  },
  balanceSection: {
    flex: 1,
    paddingHorizontal: 10,
  },
  balanceTitle: {
    fontSize: 15,
    fontWeight: '300',
    textAlign: 'center',
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#000',
    marginVertical: 5,
  },
  inlineContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceTextTotal: {
    fontWeight: 'bold',
    color: '#1D7A00',
  },
  balanceTextRevenus: {
    color: '#0A76A6',
  },
  balanceTextDepenses: {
    color: '#A63434',
  },
});
