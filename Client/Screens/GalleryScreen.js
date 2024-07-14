import React, { useState } from 'react';
import {
  Text, SafeAreaView, StyleSheet
} from 'react-native';
import HomeHeader from '../Components/HomeHeader';

export default function GalleryScreen({navigation}) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <HomeHeader navigation={navigation} title={'Galerie'} />
    </SafeAreaView>

  )
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
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  }
})
