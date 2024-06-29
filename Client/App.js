import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import RootNavigator from './navigation/RootNavigator';


export default function App() {


  return (
    <View style={styles.container}>

      <RootNavigator />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});