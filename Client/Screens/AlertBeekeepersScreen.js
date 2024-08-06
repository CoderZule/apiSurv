import React from 'react';
import {
    Text, SafeAreaView, StyleSheet, ScrollView, View
} from 'react-native';
import HomeHeader from '../Components/HomeHeader';

export default function AlertBeekeepersScreen({ navigation }) {
    return (
        <SafeAreaView style={styles.safeArea}>
            <HomeHeader navigation={navigation} title={'Santé des Abeilles'} />

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FBF5E0',
    },

});
