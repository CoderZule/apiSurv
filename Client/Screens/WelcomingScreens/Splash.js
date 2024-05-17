import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated } from 'react-native';

const Splash = ({ onFinish }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(
      fadeAnim,
      {
        toValue: 1,
        duration: 3000, // Fade-in duration
        useNativeDriver: true,
      }
    ).start();
    
    const timer = setTimeout(() => {
      onFinish();
    }, 6000); // Total duration - Fade-in duration

    return () => {
      clearTimeout(timer);
    };
  }, [fadeAnim, onFinish]);

  return (
    <View style={styles.container}>
      <Image 
        source={require('../../assets/splashtop.png')} 
        style={styles.splashTop}
      />
      <Animated.Image 
        source={require('../../assets/logo.png')} 
        style={[styles.logo, { opacity: fadeAnim }]} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', 
  },
  logo: {
    width: 251, 
    height: 178,
  },
  splashTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    resizeMode: 'cover',
    height: 100, // Adjust as needed
  },
});

export default Splash;
