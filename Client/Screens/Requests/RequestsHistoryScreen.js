import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, Alert, FlatList, ScrollView } from 'react-native';

import HomeHeader from '../../Components/HomeHeader';
 

export default function RequestsHistoryScreen({ navigation }) {
  


    return (
        <SafeAreaView style={styles.safeArea}>
            <HomeHeader navigation={navigation} title={'طلباتي'} />
           
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FBF5E0',
    },
    card: {
        padding: 13,
        borderRadius: 10,
        elevation: 3,
        backgroundColor: '#FFFFFF',
        marginVertical: 16,
        marginHorizontal: 15,
    },
    addButton: {
        alignSelf: 'flex-end',

        marginBottom: 10,
    },
    table: {
        flex: 1,
        minWidth: '80%',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    tableHeader: {
        flexDirection: 'row',
        flexGrow: 1,
        backgroundColor: '#f5f5f5',
        borderBottomWidth: 1,
        borderColor: '#ddd',
    },
    tableHeaderText: {
        padding: 8,
        fontSize: 16,
        fontWeight: 'bold',
        width: 100,
        textAlign: 'center',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        backgroundColor: '#fff',
        borderBottomColor: '#ccc',
        minHeight: 60,
    },
    tableCell: {
        padding: 12,
        width: 80,
        flex: 1,
        textAlign: 'center',

        fontSize: 14,
    },
    noDataCell: {
        flex: 1,
        padding: 10,
        textAlign: 'center',
    },
    badge: {
        backgroundColor: "#2EB922",
        borderRadius: 10,
        paddingHorizontal: 6,
        paddingVertical: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        padding: 16,
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});
