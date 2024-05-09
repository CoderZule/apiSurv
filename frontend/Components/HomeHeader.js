import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HomeHeader({ navigation }) {
  // Hide status bar on component mount
  React.useEffect(() => {
    StatusBar.setHidden(true);
    return () => {
      StatusBar.setHidden(false); // Reset status bar visibility on component unmount
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
    backgroundColor: "#000000",
    height: 40,
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  menuButton: {
    marginRight: 10,
  },
  titleContainer: {
    flex: 1, // Take up remaining space
    alignItems: 'center', // Center the headerTitle horizontally
  },
  headerTitle: {
    color: "white",
    fontSize: 25,
    fontWeight: 'bold',
  },
});
