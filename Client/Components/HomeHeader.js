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
   };

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={handleMenuPress} style={styles.menuButton}>
        <Ionicons name="menu" color="#faf0ce" size={35} />
      </TouchableOpacity>
      <View style={styles.titleContainer}>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>

      {incompleteTasksCount > 0 && (
        <TouchableOpacity onPress={onNotificationPress} style={styles.notificationButton}>
          <Ionicons name="calendar-outline" color="#faf0ce" size={28} />
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
    height: 70,
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop:5
  },
  titleContainer: {
    flex: 1,
    marginTop:9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#faf0ce',
    fontSize: 24,
    fontWeight: 'bold',
  },

  menuButton: {
  marginTop:9,
  
  },
  notificationButton: {
     marginTop:9,
    right: 15,
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
    color: '#faf0ce',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
