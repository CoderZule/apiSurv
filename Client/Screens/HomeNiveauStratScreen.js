import React from 'react';
import {
    Text, SafeAreaView, StyleSheet, ScrollView, View
} from 'react-native';
import HomeHeader from '../Components/HomeHeader';

export default function HomeNiveauStratScreen({ navigation }) {
    return (
        <SafeAreaView style={styles.safeArea}>
            <HomeHeader navigation={navigation} title={'Accueil'} />

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FBF5E0',
    },

});
