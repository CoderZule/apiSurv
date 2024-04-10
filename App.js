import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Splash from './Screens/Home/Splash';
import Index from './Screens/Home/Index';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  return (
    <View style={styles.container}>
      {showSplash ? (
        <Splash onFinish={handleSplashFinish} />
      ) : (
        <Index />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
