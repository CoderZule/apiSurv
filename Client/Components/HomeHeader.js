// HomeHeader.js

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HomeHeader({ navigation, title, incompleteTasksCount, onNotificationPress }) {
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

      {incompleteTasksCount > 0 && (
        <TouchableOpacity onPress={onNotificationPress} style={styles.notificationButton}>
          <Ionicons name="calendar-outline" color="white" size={27} />
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationCount}>{incompleteTasksCount}</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    backgroundColor: '#977700',
    height: 63,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },

  notificationButton: {
    position: 'absolute',
    right: 20,
  },
  notificationBadge: {
    backgroundColor: '#D22B2B',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: -5,
    right: -7,
  },
  notificationCount: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
