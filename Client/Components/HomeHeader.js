import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HomeHeader({ navigation, title }) {
  React.useEffect(() => {
    StatusBar.setHidden(true);
    return () => {
      StatusBar.setHidden(false);
    };
  }, []);

  const handleMenuPress = () => {
    if (navigation && navigation.toggleDrawer) {
      navigation.toggleDrawer();
    }
    // Add fallback logic if needed
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={handleMenuPress} style={styles.menuButton}>
        <Ionicons name="menu" color="white" size={32} />
      </TouchableOpacity>
      <View style={styles.titleContainer}>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    backgroundColor: '#977700',
    height: 63,
    alignItems: 'center',
    paddingHorizontal: 10, // Added paddingHorizontal to space items
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center', // Centering title vertically
  },
  headerTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  menuButton: {
    // Remove marginLeft from menuButton to keep it aligned with the header
  },
});
