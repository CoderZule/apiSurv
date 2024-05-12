import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';

export default function HomeHeader({ navigation }) {

  const [loaded] = useFonts({
    'Chilanka-Regular': require('../assets/fonts/Chilanka-Regular.ttf'),
    'Poppins-Semibold': require('../assets/fonts/Poppins-SemiBold.ttf'),
  });

   React.useEffect(() => {
    StatusBar.setHidden(true);
    return () => {
      StatusBar.setHidden(false); 
    };
  }, []);

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={styles.menuButton}>
        <Ionicons name="menu" color="white" size={32} />
      </TouchableOpacity>
      <View style={styles.titleContainer}>
        <Text style={styles.headerTitle}>apiSurv</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
     backgroundColor: '#977700' ,

    height: 63,
    alignItems: 'center',
    paddingHorizontal: 15,
   },
  menuButton: {
    marginRight: 10,
  },
  titleContainer: {
    flex: 1, 
    alignItems: 'center', 
  },
  headerTitle: {
    color: "white",
    fontSize: 25,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Semibold'

  },
});
