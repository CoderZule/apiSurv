import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const Splash = ({ onFinish }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 3000,  
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      onFinish();
    }, 3000);  

    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 3000,  
      useNativeDriver: false, 
    }).start();

    return () => {
      clearTimeout(timer);
    };
  }, [fadeAnim, onFinish, progressAnim]);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../../assets/logo.png')}
        style={[styles.logo, { opacity: fadeAnim }]}
      />
      <View style={styles.progressBarContainer}>
        <Animated.View
          style={[
            styles.progressBar,
            { width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) },
          ]}
        />
      </View>
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
  progressBarContainer: {
    width: '80%',  
    height: 10,  
    backgroundColor: '#ddd',
    marginTop: 20,  
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#977700',  
  },
});

export default Splash;
